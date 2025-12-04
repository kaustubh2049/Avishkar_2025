from flask import Flask, request, jsonify
from flask_cors import CORS
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
import numpy as np
from PIL import Image
import io
import os

app = Flask(__name__)
CORS(app)

# ✅ Model path
MODEL_PATH = os.path.join("model", "plant_disease_model.h5")

# ✅ Define class labels (same order as during training)
# Note: Model has 3 output classes based on model.output_shape
class_labels = [
    "Healthy",
    "Powdery",
    "Rust"
]

# Load the trained model
try:
    model = load_model(MODEL_PATH)
    print("[SUCCESS] Model loaded successfully!")
    print(f"[INFO] Model input shape: {model.input_shape}")
    print(f"[INFO] Model output shape: {model.output_shape}")
    print(f"[INFO] Number of classes: {len(class_labels)}")
except Exception as e:
    print(f"[ERROR] Error loading model: {e}")
    model = None

@app.route("/")
def home():
    return jsonify({
        "message": "Plant Disease Detection API is running!",
        "model_loaded": model is not None,
        "endpoints": {
            "GET /": "API status",
            "GET /model-info": "Model information",
            "POST /predict": "Disease prediction"
        }
    })

@app.route("/model-info")
def model_info():
    if model is None:
        return jsonify({"error": "Model not loaded"}), 500
    
    return jsonify({
        "model_loaded": True,
        "input_shape": str(model.input_shape),
        "output_shape": str(model.output_shape),
        "classes": class_labels,
        "num_classes": len(class_labels)
    })

@app.route("/predict", methods=["POST"])
def predict():
    if model is None:
        return jsonify({"error": "Model not loaded. Please check server logs."}), 500
        
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]
    
    if file.filename == '':
        return jsonify({"error": "No file selected"}), 400

    try:
        # Read image directly from upload
        img = Image.open(io.BytesIO(file.read())).convert("RGB")

        # Resize according to model input (256x256 as per model.input_shape)
        img = img.resize((256, 256))

        # Convert to array and normalize
        img_array = np.array(img) / 255.0
        img_array = np.expand_dims(img_array, axis=0)  # shape: (1,256,256,3)

        # Predict
        predictions = model.predict(img_array, verbose=0)
        print("[PREDICT] Raw model output:", predictions)
        print("[PREDICT] Predicted index:", np.argmax(predictions[0]))
        print("[PREDICT] Confidence scores:", predictions[0])
        
        predicted_index = np.argmax(predictions, axis=1)[0]
        confidence = float(np.max(predictions) * 100)

        # Ensure valid index range
        predicted_class = class_labels[predicted_index] if predicted_index < len(class_labels) else "Unknown"

        # Return result
        return jsonify({
            "prediction": predicted_class,
            "confidence": round(confidence, 2)
        })

    except Exception as e:
        print(f"[ERROR] Prediction error: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": f"Prediction failed: {str(e)}"}), 500


if __name__ == "__main__":
    # Debug mode for development only
    app.run(host="0.0.0.0", port=5000, debug=True)
