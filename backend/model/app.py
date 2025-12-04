from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import numpy as np
from PIL import Image
import io
import tensorflow as tf

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# load your Keras model
model = tf.keras.models.load_model("model.h5")

class DiseaseResult(BaseModel):
    disease: str
    severity: str
    confidence: float
    causes: List[str]
    remedies: List[str]

def preprocess_image(image_bytes: bytes) -> np.ndarray:
    img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    img = img.resize((224, 224))  # adjust to your model's input size
    arr = np.array(img) / 255.0
    arr = np.expand_dims(arr, axis=0)
    return arr

@app.post("/analyze-image", response_model=DiseaseResult)
async def analyze_image(file: UploadFile = File(...)):
    img_bytes = await file.read()
    x = preprocess_image(img_bytes)

    preds = model.predict(x)[0]
    # TODO: replace this with your real label mapping
    classes = ["Early Blight", "Late Blight", "Healthy"]
    idx = int(np.argmax(preds))
    disease = classes[idx]
    confidence = float(preds[idx])

    # Simple demo mapping – adjust to your real metadata
    severity = "High" if disease != "Healthy" else "Low"
    causes = [
        "Fungal infection",
        "High humidity",
        "Favorable temperature range",
    ]
    remedies = [
        "Apply recommended fungicide as per label.",
        "Remove infected leaves and maintain field hygiene.",
        "Ensure proper spacing and avoid overhead irrigation.",
    ]

    return DiseaseResult(
        disease=disease,
        severity=severity,
        confidence=confidence,
        causes=causes,
        remedies=remedies,
    )