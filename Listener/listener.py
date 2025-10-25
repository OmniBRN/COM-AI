import json
import requests
import urllib3
from sseclient import SSEClient
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime
import math
import pandas as pd
import numpy as np

from Agent.model import RandomForest, haversine  # import your class and function

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

API_KEY = "e562bf7c02a774b00bab775bdcfa4d494cf503b2128fb04a6872822783e5b04d "
STREAM_URL = "https://95.217.75.14:8443/stream"
FLAG_URL = "https://95.217.75.14:8443/api/flag"

headers = {"X-API-Key": API_KEY}

# Feature order for the model
FEATURE_ORDER = ["distance", "gender", "age", "time", "category", "amount"]

# ---------------- TRAINING FUNCTION ----------------
def train_rf_model(csv_file):
    """
    Train a RandomForest on a CSV file.
    CSV must have columns: lat, long, merch_lat, merch_long, gender, dob, unix_time, category, amt, is_fraud
    """
    train_data = []
    train_labels = []
    year = datetime.now().year

    # Use correct separator for your CSV
    df = pd.read_csv(csv_file, sep='|', on_bad_lines='skip')

    for _, row in df.iterrows():
        distance = haversine(float(row["lat"]), float(row["long"]),
                             float(row["merch_lat"]), float(row["merch_long"]))
        gender = row["gender"]
        age = year - int(row["dob"][:4])
        time = int(row["unix_time"]) % 8640
        category = row["category"]
        amount = float(row["amt"])
        train_data.append([distance, gender, age, time, category, amount])
        train_labels.append(int(row["is_fraud"]))

    X = np.array(train_data, dtype=object)
    y = np.array(train_labels, dtype=int)

    feature_types = ["numeric", "categorical", "numeric", "numeric", "categorical", "numeric"]

    rf = RandomForest(n_trees=5, max_depth=4, min_samples_split=1, max_features=3, random_state=42)
    rf.fit(X, y, feature_types)
    print(f"RandomForest trained on {len(train_labels)} samples.")
    return rf


# Train the model at startup


# ---------------- TRANSACTION HANDLING ----------------
def flag_transaction(trans_num, flag_value):
    try:
        payload = {"trans_num": trans_num, "flag_value": flag_value}
        response = requests.post(FLAG_URL, headers=headers, json=payload, verify=False, timeout=10)
        response.raise_for_status()
        return response.json()
    except Exception as e:
        print(f"Error flagging transaction {trans_num}: {e}")
        return None

def transaction_to_vector(transaction):
    """
    Convert a single transaction to the feature vector expected by your RF model.
    """
    year = datetime.now().year
    try:
        distance = haversine(
            float(transaction.get("lat", 0)),
            float(transaction.get("long", 0)),
            float(transaction.get("merch_lat", 0)),
            float(transaction.get("merch_long", 0))
        )
        gender = transaction.get("gender", "unknown")
        age = year - int(transaction.get("dob", "1900-01-01")[:4])
        time = int(transaction.get("unix_time", 0)) % 8640
        category = transaction.get("category", "unknown")
        amount = float(transaction.get("amt", 0))
        vector = [distance, gender, age, time, category, amount]
        return [vector]  # 2D array for rf.predict
    except Exception as e:
        print(f"Error converting transaction to vector: {e}")
        return [[0, "unknown", 0, 0, "unknown", 0]]

def process_transaction(transaction):
    trans_num = transaction.get("trans_num")
    print(f"Processing transaction: {trans_num}")

    # Convert to vector
    vector = transaction_to_vector(transaction)

    # Predict using trained RandomForest
    is_fraud = int(rf.predict(vector)[0])  # 0 = legit, 1 = fraud
    print(f"Predicted fraud: {is_fraud}")

    # Flag transaction
    result = flag_transaction(trans_num, is_fraud)
    print("-" * 80)

# ---------------- STREAM LISTENER ----------------
def main():
    max_workers = 20
    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        try:
            print("Connecting to stream...")
            response = requests.get(STREAM_URL, headers=headers, stream=True, verify=False)
            response.raise_for_status()
            client = SSEClient(response)
            print("Connected to stream...")

            futures = set()

            for event in client.events():
                if event.data:
                    try:
                        transaction = json.loads(event.data)
                        trans_num = transaction.get("trans_num")
                        print(f"Received transaction: {trans_num}")

                        future = executor.submit(process_transaction, transaction)
                        futures.add(future)

                        # Cleanup finished futures
                        finished = {f for f in futures if f.done()}
                        futures -= finished

                    except Exception as e:
                        print(f"Error handling event: {e}")

        except KeyboardInterrupt:
            print("Stopped by user.")
        except Exception as e:
            print(f"Unexpected error: {e}")

if __name__ == "__main__":
    rf = train_rf_model("test.csv")
    main()
