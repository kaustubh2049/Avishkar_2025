import pandas as pd
import numpy as np
import joblib
import os
from datetime import datetime

from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.metrics import accuracy_score

# =========================================
# Helper: safe float input
# =========================================
def get_float(prompt):
    while True:
        try:
            return float(input(prompt))
        except ValueError:
            print("Please enter a valid number.")


# =========================================
# 1. LOAD & CLEAN DATA
# =========================================
print("\n=== LOADING DATASET ===")
df = pd.read_csv("crop.csv")  # Make sure crop.csv is in same folder
print(df.head())

# Expected columns in crop.csv:
# ['District', 'Latitude', 'Longitude', 'Region', 'N', 'P', 'K', 'pH', 'Rainfall', 'Crop']

print("\n=== CLEANING DATA ===")
# Drop completely empty columns if any
df = df.dropna(axis=1, how="all")

# Fill numeric NaNs with mean
num_cols = df.select_dtypes(include=["int64", "float64"]).columns
for c in num_cols:
    df[c] = df[c].fillna(df[c].mean())

# Fill categorical NaNs with mode
cat_cols = df.select_dtypes(include=["object"]).columns
for c in cat_cols:
    df[c] = df[c].fillna(df[c].mode()[0])

print("Columns:", df.columns.tolist())
print(df.isna().sum())


# =========================================
# 2. ENCODE CATEGORICAL COLUMNS
# =========================================
print("\n=== ENCODING CATEGORICAL COLUMNS ===")

le_district = LabelEncoder()
le_region = LabelEncoder()
le_crop = LabelEncoder()

df["District_enc"] = le_district.fit_transform(df["District"])
df["Region_enc"] = le_region.fit_transform(df["Region"])
df["Crop_enc"] = le_crop.fit_transform(df["Crop"])

# Save encoders (optional, useful if you reuse later)
joblib.dump(le_district, "le_district.pkl")
joblib.dump(le_region, "le_region.pkl")
joblib.dump(le_crop, "le_crop.pkl")

print("Label encoders saved.")


# =========================================
# 3. TRAIN SOIL MODELS (N, P, K, pH)
#    INPUT: Latitude, Longitude, District_enc, Region_enc
#    OUTPUT: N, P, K, pH
# =========================================
print("\n=== TRAINING SOIL MODELS FOR N, P, K, pH ===")

soil_feature_cols = ["Latitude", "Longitude", "District_enc", "Region_enc"]

X_soil = df[soil_feature_cols]
yN = df["N"]
yP = df["P"]
yK = df["K"]
yPH = df["pH"]

soil_model_N = RandomForestRegressor(n_estimators=200, random_state=42)
soil_model_P = RandomForestRegressor(n_estimators=200, random_state=42)
soil_model_K = RandomForestRegressor(n_estimators=200, random_state=42)
soil_model_pH = RandomForestRegressor(n_estimators=200, random_state=42)

soil_model_N.fit(X_soil, yN)
soil_model_P.fit(X_soil, yP)
soil_model_K.fit(X_soil, yK)
soil_model_pH.fit(X_soil, yPH)

joblib.dump(soil_model_N, "soil_model_N.pkl")
joblib.dump(soil_model_P, "soil_model_P.pkl")
joblib.dump(soil_model_K, "soil_model_K.pkl")
joblib.dump(soil_model_pH, "soil_model_pH.pkl")

print("Soil models (N, P, K, pH) saved.")


# =========================================
# 4. TRAIN CROP MODEL (classification)
#    INPUT: true N, P, K, pH + location + encodings
# =========================================
print("\n=== TRAINING CROP MODEL ===")

crop_feature_cols = [
    "N", "P", "K", "pH",
    "Latitude", "Longitude",
    "District_enc", "Region_enc"
]

X_crop = df[crop_feature_cols]
y_crop = df["Crop_enc"]

print("Crop features:", crop_feature_cols)

X_crop_train, X_crop_test, y_crop_train, y_crop_test = train_test_split(
    X_crop, y_crop, test_size=0.2, random_state=42
)

crop_model = RandomForestClassifier(n_estimators=400, random_state=42)
crop_model.fit(X_crop_train, y_crop_train)

y_pred_crop = crop_model.predict(X_crop_test)
acc_crop = accuracy_score(y_crop_test, y_pred_crop)
print(f"Crop classification accuracy: {acc_crop * 100:.2f}%")

joblib.dump(crop_model, "crop_model.pkl")
print("Crop model saved.")


# =========================================
# 5. USER INPUT (ONLY 4 FIELDS)
# =========================================
print("\n=== USER INPUT PREDICTION ===")
print("Enter your field location details:\n")

user_district_name = input("Enter District name (e.g., Achalpur): ").strip()
if user_district_name == "":
    user_district_name = df["District"].iloc[0]

user_region_name = input("Enter Region name (e.g., Vidarbha): ").strip()
if user_region_name == "":
    user_region_name = df["Region"].iloc[0]

user_latitude = get_float("Enter Latitude (e.g., 21.30): ")
user_longitude = get_float("Enter Longitude (e.g., 77.56): ")

# Encode district & region
try:
    user_dist_enc = le_district.transform([user_district_name])[0]
except ValueError:
    print(f"District '{user_district_name}' unseen, defaulting to 0.")
    user_dist_enc = 0

try:
    user_reg_enc = le_region.transform([user_region_name])[0]
except ValueError:
    print(f"Region '{user_region_name}' unseen, defaulting to 0.")
    user_reg_enc = 0


# =========================================
# 6. PREDICT N, P, K, pH FROM LOCATION
# =========================================
X_user_soil = pd.DataFrame([{
    "Latitude": user_latitude,
    "Longitude": user_longitude,
    "District_enc": user_dist_enc,
    "Region_enc": user_reg_enc,
}])[soil_feature_cols]

print("\n=== PREDICTING SOIL PARAMETERS FROM LOCATION ===")
pred_N = soil_model_N.predict(X_user_soil)[0]
pred_P = soil_model_P.predict(X_user_soil)[0]
pred_K = soil_model_K.predict(X_user_soil)[0]
pred_pH = soil_model_pH.predict(X_user_soil)[0]

print(f"Predicted N: {pred_N:.2f}")
print(f"Predicted P: {pred_P:.2f}")
print(f"Predicted K: {pred_K:.2f}")
print(f"Predicted pH: {pred_pH:.2f}")


# =========================================
# 7. CROP RECOMMENDATION USING PREDICTED N, P, K, pH
# =========================================
X_user_crop = pd.DataFrame([{
    "N": pred_N,
    "P": pred_P,
    "K": pred_K,
    "pH": pred_pH,
    "Latitude": user_latitude,
    "Longitude": user_longitude,
    "District_enc": user_dist_enc,
    "Region_enc": user_reg_enc,
}])[crop_feature_cols]

user_crop_enc = crop_model.predict(X_user_crop)[0]
user_crop = le_crop.inverse_transform([user_crop_enc])[0]

probs = crop_model.predict_proba(X_user_crop)[0]
top_idx = np.argsort(probs)[::-1][:3]
top_crops = [le_crop.inverse_transform([i])[0] for i in top_idx]
top_probs = [probs[i] * 100 for i in top_idx]

print("\n=== CROP RECOMMENDATION ===")
print(f"Best crop for your location: {user_crop}")
print("\nTop-3 recommended crops:")
for rank, (cn, pr) in enumerate(zip(top_crops, top_probs), start=1):
    print(f"{rank}. {cn} - {pr:.2f}%")


# =========================================
# 8. FIND NEAREST DATA ROW IN SAME REGION
# =========================================
print("\n=== FINDING NEAREST DATA ROW IN SAME REGION ===")

df_same_region = df[df["Region"] == user_region_name].copy()

if df_same_region.empty:
    print("No rows found in this region, using entire dataset as fallback.")
    df_same_region = df.copy()

df_same_region["DistToUser"] = np.sqrt(
    (df_same_region["Latitude"] - user_latitude) ** 2 +
    (df_same_region["Longitude"] - user_longitude) ** 2
)

nearest_idx = df_same_region["DistToUser"].idxmin()
nearest_row = df_same_region.loc[nearest_idx]

print("Nearest dataset row (same region):")
print(nearest_row[["Latitude", "Longitude", "N", "P", "K", "pH", "Crop"]])


# =========================================
# 9. SAVE SINGLE RESULT TO CSV (APPEND MODE)
# =========================================
print("\n=== SAVING RESULT TO CSV ===")

result = {
    # User inputs
    "User_Latitude": user_latitude,
    "User_Longitude": user_longitude,
    "User_District": user_district_name,
    "User_Region": user_region_name,

    # Predicted soil values
    "Pred_N": pred_N,
    "Pred_P": pred_P,
    "Pred_K": pred_K,
    "Pred_pH": pred_pH,

    # Predicted crops
    "Predicted_Crop": user_crop,
    "Top2_Crop": top_crops[1] if len(top_crops) > 1 else None,
    "Top3_Crop": top_crops[2] if len(top_crops) > 2 else None,

    # Nearest actual dataset values (same region)
    "Nearest_N": nearest_row["N"],
    "Nearest_P": nearest_row["P"],
    "Nearest_K": nearest_row["K"],
    "Nearest_pH": nearest_row["pH"],
    "Nearest_Crop": nearest_row["Crop"],
}

user_result_df = pd.DataFrame([result])

# Ensure consistent column order
columns_order = [
    "User_Latitude", "User_Longitude", "User_District", "User_Region",
    "Pred_N", "Pred_P", "Pred_K", "Pred_pH",
    "Predicted_Crop", "Top2_Crop", "Top3_Crop",
    "Nearest_N", "Nearest_P", "Nearest_K", "Nearest_pH", "Nearest_Crop"
]
user_result_df = user_result_df.reindex(columns=columns_order)

csv_name = "user_prediction_results.csv"

# If CSV doesn't exist → create with header
if not os.path.exists(csv_name):
    user_result_df.to_csv(csv_name, index=False)
else:
    # If CSV exists → append without header
    user_result_df.to_csv(csv_name, mode='a', header=False, index=False)

print(f"\nUpdated: {csv_name}")
print("Preview of this prediction:")
print(user_result_df)

# Clean up helper column
if "DistToUser" in df_same_region.columns:
    df_same_region.drop(columns=["DistToUser"], inplace=True)

print("\nDone.")
