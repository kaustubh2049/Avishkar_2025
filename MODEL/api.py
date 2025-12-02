from fastapi import FastAPI
from pydantic import BaseModel
import pandas as pd
import joblib

from preprocess import preprocess_new_data

app = FastAPI()

# Load model and training columns once at startup
model = joblib.load("groundwater_model.pkl")
training_columns = joblib.load("training_columns.pkl")


class PredictionRequest(BaseModel):
    state: str
    district: str
    LAT: float
    LON: float
    SITE_TYPE: str
    WLCODE: str
    Date: str                      # e.g. "2024-05-01"
    Season: str                    # e.g. "Pre-Monsoon"
    Rainfall_monthly: int
    Rainfall_seasonal: int
    Annual_Ground_Water_Draft_Total: float
    Annual_Replenishable_Groundwater_Resource: float
    Net_Ground_Water_Availability: float
    Stage_of_development: float
    Stage_of_development_calc: float
    Exploitation_Ratio: float
    Water_Level_Lag1: float        # last known level


class PredictionResponse(BaseModel):
    predicted_level: float


@app.post("/predict", response_model=PredictionResponse)
def predict(req: PredictionRequest):
    try:
        # Convert request body to DataFrame
        raw = req.dict()
        print("RAW REQUEST:", raw)

        raw_df = pd.DataFrame([raw])
        print("DATE VALUE:", raw_df["Date"].iloc[0])

        # Apply same preprocessing as during training
        X_new = preprocess_new_data(raw_df, training_columns)

        # Run model prediction
        y_pred = model.predict(X_new)[0]

        return PredictionResponse(predicted_level=float(y_pred))

    except Exception as e:
        # Log the error to the console for debugging
        print("PREDICT ERROR:", repr(e))
        # Re-raise so FastAPI returns 500 with detail
        raise