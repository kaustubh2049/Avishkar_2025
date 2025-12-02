import pandas as pd


def preprocess_new_data(raw_df, training_columns):
    """
    Apply the same preprocessing steps to new data
    that were used during model training.
    """
    df = raw_df.copy()

    # 1) Date -> day_of_year
    # Be robust: coerce invalid date strings to NaT, then fill with today
    df["Date"] = pd.to_datetime(df["Date"], errors="coerce")
    if df["Date"].isna().any():
        df.loc[df["Date"].isna(), "Date"] = pd.Timestamp.today().normalize()

    df["day_of_year"] = df["Date"].dt.dayofyear
    df.drop("Date", axis=1, inplace=True)

    # 2) Simple numeric median imputation
    for col in df.select_dtypes(include="number").columns:
        if df[col].isnull().any():
            df[col].fillna(df[col].median(), inplace=True)

    # 3) Ensure Season exists (fallback)
    if "Season" not in df.columns:
        df["Season"] = "Pre-Monsoon"

    # 4) One-hot encode low-cardinality features
    low_cardinality_cols = ["state", "SITE_TYPE", "Season"]
    df = pd.get_dummies(df, columns=low_cardinality_cols, drop_first=True)

    # 5) Label encode high-cardinality features
    high_cardinality_cols = ["district", "WLCODE"]
    for col in high_cardinality_cols:
        df[col] = pd.factorize(df[col])[0]

    # 6) Align with training columns (add missing, drop extras)
    df = df.reindex(columns=training_columns, fill_value=0)

    return df