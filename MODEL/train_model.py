import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import joblib
import math

df = pd.read_csv("final_merged_dataset.csv")

# CLEANING
df.drop(columns=["month", "Season_y", "lat", "lon"], errors="ignore", inplace=True)

# DATE PARSING (matches your CSV format: DD-MM-YYYY)
df["Date"] = pd.to_datetime(df["Date"], format="%d-%m-%Y", errors="coerce")

# SORTING (safe for all pandas versions)
if "WLCODE" in df.columns and "Date" in df.columns:
    df.sort_values(by=["WLCODE", "Date"], inplace=True)
elif "Date" in df.columns:
    df.sort_values(by=["Date"], inplace=True)



df.fillna(df.median(numeric_only=True), inplace=True)

df["day_of_year"] = df["Date"].dt.dayofyear
df = pd.get_dummies(df, columns=["state", "SITE_TYPE", "Season"], drop_first=True)
df["district"] = pd.factorize(df["district"])[0]
df["WLCODE"] = pd.factorize(df["WLCODE"])[0]
df.drop("Date", axis=1, inplace=True)

y = df["Water_Level"]
X = df.drop(["Water_Level", "Water_Level_Change"], axis=1, errors="ignore")

original_columns = X.columns
joblib.dump(list(original_columns), "training_columns.pkl")

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

model = RandomForestRegressor(n_jobs=-1, random_state=42)
model.fit(X_train, y_train)

predictions = model.predict(X_test)

mae = mean_absolute_error(y_test, predictions)
mse = mean_squared_error(y_test, predictions)
rmse = math.sqrt(mse)
r2 = r2_score(y_test, predictions)

print("\n--- Model Metrics ---")
print("MAE:", mae)
print("MSE:", mse)
print("RMSE:", rmse)
print("R²:", r2)

joblib.dump(model, "groundwater_model.pkl")
print("\nSaved groundwater_model.pkl and training_columns.pkl")
