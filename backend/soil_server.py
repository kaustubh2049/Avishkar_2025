from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import joblib
import numpy as np
import traceback
import json
from datetime import datetime

app = Flask(__name__)
CORS(app)

# ---- Paths: load models & encoders from projectavishkar ----
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECTAVISHKAR_DIR = os.path.join(BASE_DIR, "..", "projectavishkar")
HISTORY_PATH = os.path.join(BASE_DIR, "soil_history.jsonl")

LE_DISTRICT_PATH = os.path.join(PROJECTAVISHKAR_DIR, "le_district.pkl")
LE_REGION_PATH = os.path.join(PROJECTAVISHKAR_DIR, "le_region.pkl")
LE_CROP_PATH = os.path.join(PROJECTAVISHKAR_DIR, "le_crop.pkl")

SOIL_N_PATH = os.path.join(PROJECTAVISHKAR_DIR, "soil_model_N.pkl")
SOIL_P_PATH = os.path.join(PROJECTAVISHKAR_DIR, "soil_model_P.pkl")
SOIL_K_PATH = os.path.join(PROJECTAVISHKAR_DIR, "soil_model_K.pkl")
SOIL_PH_PATH = os.path.join(PROJECTAVISHKAR_DIR, "soil_model_pH.pkl")
CROP_MODEL_PATH = os.path.join(PROJECTAVISHKAR_DIR, "crop_model.pkl")

# ---- Load encoders & models trained by crop_system.py ----
try:
    le_district = joblib.load(LE_DISTRICT_PATH)
    le_region = joblib.load(LE_REGION_PATH)
    le_crop = joblib.load(LE_CROP_PATH)

    soil_model_N = joblib.load(SOIL_N_PATH)
    soil_model_P = joblib.load(SOIL_P_PATH)
    soil_model_K = joblib.load(SOIL_K_PATH)
    soil_model_pH = joblib.load(SOIL_PH_PATH)

    crop_model = joblib.load(CROP_MODEL_PATH)

    print("[SOIL-API] Loaded encoders, soil models, and crop model successfully.")
except Exception as e:
    print("[SOIL-API][ERROR] Failed to load models or encoders:", e)
    traceback.print_exc()
    le_district = None
    le_region = None
    le_crop = None
    soil_model_N = None
    soil_model_P = None
    soil_model_K = None
    soil_model_pH = None
    crop_model = None


@app.route("/")
def home():
    """Health check"""
    ready = all(
        m is not None
        for m in [
            le_district,
            le_region,
            le_crop,
            soil_model_N,
            soil_model_P,
            soil_model_K,
            soil_model_pH,
            crop_model,
        ]
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
        for m in [
            le_district,
            le_region,
            le_crop,
            soil_model_N,
            soil_model_P,
            soil_model_K,
            soil_model_pH,
            crop_model,
        ]
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

        # Crop recommendations using the trained crop model
        crop_feature_cols = [
            "N",
            "P",
            "K",
            "pH",
            "Latitude",
            "Longitude",
            "District_enc",
            "Region_enc",
        ]

        X_user_crop = np.array([
            [
                pred_N,
                pred_P,
                pred_K,
                pred_pH,
                lat_f,
                lon_f,
                dist_enc,
                reg_enc,
            ]
        ])

        try:
            probs = crop_model.predict_proba(X_user_crop)[0]
            top_idx = np.argsort(probs)[::-1][:3]
            top_crops = [le_crop.inverse_transform([i])[0] for i in top_idx]
            top_scores = [float(probs[i] * 100.0) for i in top_idx]
            crop_recommendations = [
                {"name": name, "score": round(score, 2)}
                for name, score in zip(top_crops, top_scores)
            ]
        except Exception as e:
            print("[SOIL-API][WARN] Failed to compute crop recommendations:", e)
            crop_recommendations = []

        # Build main response
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
            "crop_recommendations": crop_recommendations,
        }

        # --- Append this prediction to simple history log ---
        try:
            entry = {
                "timestamp": datetime.utcnow().isoformat() + "Z",
                "district": district,
                "region": region,
                "latitude": lat_f,
                "longitude": lon_f,
                "score": score,
                "N": response["N"],
                "P": response["P"],
                "K": response["K"],
                "pH": response["pH"],
            }

            with open(HISTORY_PATH, "a", encoding="utf-8") as f:
                f.write(json.dumps(entry) + "\n")

            # Read recent history for this location and neighbor stats
            history: list[dict] = []
            neighbor_scores: list[float] = []
            if os.path.exists(HISTORY_PATH):
                with open(HISTORY_PATH, "r", encoding="utf-8") as f:
                    lines = f.readlines()[-300:]

                for line in lines:
                    line = line.strip()
                    if not line:
                        continue
                    try:
                        rec = json.loads(line)
                    except json.JSONDecodeError:
                        continue

                    # Match by same region/district or nearby coordinates
                    same_place = False
                    same_district = False
                    same_region = False
                    try:
                        if district and rec.get("district") == district:
                            same_district = True
                            same_place = True
                        elif region and rec.get("region") == region:
                            same_region = True
                            same_place = True
                        else:
                            lat2 = float(rec.get("latitude", 0.0))
                            lon2 = float(rec.get("longitude", 0.0))
                            if abs(lat2 - lat_f) <= 0.02 and abs(lon2 - lon_f) <= 0.02:
                                same_place = True
                    except Exception:
                        same_place = False

                    if same_place:
                        history.append(
                            {
                                "timestamp": rec.get("timestamp"),
                                "score": rec.get("score"),
                                "N": rec.get("N"),
                                "P": rec.get("P"),
                                "K": rec.get("K"),
                                "pH": rec.get("pH"),
                            }
                        )

                    # Collect neighbor scores (prefer same district, else same region)
                    try:
                        sc = float(rec.get("score"))
                    except Exception:
                        sc = None
                    if sc is not None:
                        if same_district:
                            neighbor_scores.append(sc)
                        elif not district and same_region:
                            neighbor_scores.append(sc)

            # Sort by timestamp (oldest first) and limit
            def _ts_key(item: dict):
                try:
                    return item.get("timestamp") or ""
                except Exception:
                    return ""

            history_sorted = sorted(history, key=_ts_key)[-10:]
            response["history"] = history_sorted

            # Neighbor comparison stats
            if neighbor_scores:
                try:
                    avg_score = float(sum(neighbor_scores) / len(neighbor_scores))
                    # percentile: percentage of neighbors with score <= current score
                    count_le = sum(1 for s in neighbor_scores if s <= score)
                    percentile = float((count_le / len(neighbor_scores)) * 100.0)
                    response["neighbor_stats"] = {
                        "avg_score": round(avg_score, 2),
                        "count": len(neighbor_scores),
                        "percentile": round(percentile, 2),
                    }
                except Exception as e:
                    print("[SOIL-API][WARN] Failed to compute neighbor stats:", e)

        except Exception as e:
            print("[SOIL-API][WARN] Failed to log or attach history:", e)

        return jsonify(response)

    except Exception as e:
        print("[SOIL-API][ERROR]", str(e))
        traceback.print_exc()
        return jsonify({"error": f"Prediction failed: {str(e)}"}), 500


if __name__ == "__main__":
    # Run this separately from server.py, on a different port
    app.run(host="0.0.0.0", port=5001, debug=True)