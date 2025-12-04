from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import joblib
import numpy as np
import traceback

app = Flask(__name__)
CORS(app)

# ---- Paths: load models & encoders from projectavishkar ----
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECTAVISHKAR_DIR = os.path.join(BASE_DIR, "..", "projectavishkar")

LE_DISTRICT_PATH = os.path.join(PROJECTAVISHKAR_DIR, "le_district.pkl")
LE_REGION_PATH = os.path.join(PROJECTAVISHKAR_DIR, "le_region.pkl")

SOIL_N_PATH = os.path.join(PROJECTAVISHKAR_DIR, "soil_model_N.pkl")
SOIL_P_PATH = os.path.join(PROJECTAVISHKAR_DIR, "soil_model_P.pkl")
SOIL_K_PATH = os.path.join(PROJECTAVISHKAR_DIR, "soil_model_K.pkl")
SOIL_PH_PATH = os.path.join(PROJECTAVISHKAR_DIR, "soil_model_pH.pkl")

# ---- Load encoders & models trained by crop_system.py ----
try:
    le_district = joblib.load(LE_DISTRICT_PATH)
    le_region = joblib.load(LE_REGION_PATH)

    soil_model_N = joblib.load(SOIL_N_PATH)
    soil_model_P = joblib.load(SOIL_P_PATH)
    soil_model_K = joblib.load(SOIL_K_PATH)
    soil_model_pH = joblib.load(SOIL_PH_PATH)

    print("[SOIL-API] Loaded encoders and soil models successfully.")
except Exception as e:
    print("[SOIL-API][ERROR] Failed to load models or encoders:", e)
    traceback.print_exc()
    le_district = None
    le_region = None
    soil_model_N = None
    soil_model_P = None
    soil_model_K = None
    soil_model_pH = None


@app.route("/")
def home():
    """Health check"""
    ready = all(
        m is not None
        for m in [le_district, le_region, soil_model_N, soil_model_P, soil_model_K, soil_model_pH]
    )
    return jsonify({
        "message": "Soil Prediction API is running!",
        "models_loaded": ready,
        "endpoints": {
            "POST /soil-predict": "Predict N, P, K, pH and simple soil score from location"
        },
    })


@app.route("/soil-predict", methods=["POST"])
def soil_predict():
    """
    Request JSON:
    {
      "district": "Achalpur",
      "region": "Vidarbha",
      "latitude": 21.30,
      "longitude": 77.56
    }
    """
    if not all(
        m is not None
        for m in [le_district, le_region, soil_model_N, soil_model_P, soil_model_K, soil_model_pH]
    ):
        return jsonify({"error": "Models or encoders not loaded on server"}), 500

    try:
        data = request.get_json(force=True) or {}
        district = (data.get("district") or "").strip()
        region = (data.get("region") or "").strip()
        latitude = data.get("latitude", None)
        longitude = data.get("longitude", None)

        if latitude is None or longitude is None:
            return jsonify({"error": "latitude and longitude are required"}), 400

        try:
            lat_f = float(latitude)
            lon_f = float(longitude)
        except ValueError:
            return jsonify({"error": "latitude and longitude must be numbers"}), 400

        # Encode district & region like in crop_system.py
        try:
            dist_enc = int(le_district.transform([district])[0])
        except Exception:
            dist_enc = 0

        try:
            reg_enc = int(le_region.transform([region])[0])
        except Exception:
            reg_enc = 0

        # Feature order: ["Latitude", "Longitude", "District_enc", "Region_enc"]
        X_user = np.array([[lat_f, lon_f, dist_enc, reg_enc]])

        # Predict soil parameters
        pred_N = float(soil_model_N.predict(X_user)[0])
        pred_P = float(soil_model_P.predict(X_user)[0])
        pred_K = float(soil_model_K.predict(X_user)[0])
        pred_pH = float(soil_model_pH.predict(X_user)[0])

        # Heuristic statuses (tune thresholds as needed)
        def status_npk(x, low, high):
            if x < low:
                return "Low"
            if x > high:
                return "High"
            return "Good"

        def status_ph(x):
            if x < 6.0:
                return "Acidic"
            if x > 7.5:
                return "Alkaline"
            return "Optimal"

        status_N = status_npk(pred_N, low=20, high=60)
        status_P = status_npk(pred_P, low=20, high=50)
        status_K = status_npk(pred_K, low=40, high=120)
        status_pH = status_ph(pred_pH)

        # Rough score out of 100
        score_components = [
            1.0 if status_N == "Good" else 0.5 if status_N == "Low" else 0.7,
            1.0 if status_P == "Good" else 0.5 if status_P == "Low" else 0.7,
            1.0 if status_K == "Good" else 0.5 if status_K == "Low" else 0.7,
            1.0 if status_pH == "Optimal" else 0.6
        ]
        score = int((sum(score_components) / len(score_components)) * 100)

        # Simple text recommendations
        recommendations = []
        if status_N == "Low":
            recommendations.append("Nitrogen is low. Apply N-rich fertilizer (e.g. Urea) as per local recommendation.")
        if status_P == "Low":
            recommendations.append("Phosphorus is low. Use SSP/DAP or P-rich fertilizers in basal dose.")
        if status_K == "Low":
            recommendations.append("Potassium is low. Apply MOP or other K-rich fertilizer.")
        if status_pH == "Acidic":
            recommendations.append("Soil is acidic. Consider liming and adding organic matter.")
        if status_pH == "Alkaline":
            recommendations.append("Soil is alkaline. Add organic matter and gypsum as needed.")

        if not recommendations:
            recommendations.append("Soil parameters look balanced. Maintain with organic compost and crop rotation.")

        response = {
            "N": round(pred_N, 2),
            "P": round(pred_P, 2),
            "K": round(pred_K, 2),
            "pH": round(pred_pH, 2),
            "score": score,
            "statuses": {
                "N": status_N,
                "P": status_P,
                "K": status_K,
                "pH": status_pH,
            },
            "recommendations": recommendations,
        }

        return jsonify(response)

    except Exception as e:
        print("[SOIL-API][ERROR]", str(e))
        traceback.print_exc()
        return jsonify({"error": f"Prediction failed: {str(e)}"}), 500


if __name__ == "__main__":
    # Run this separately from server.py, on a different port
    app.run(host="0.0.0.0", port=5001, debug=True)