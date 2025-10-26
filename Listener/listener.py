import json
import requests
import urllib3
from sseclient import SSEClient
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime
import math
import pandas as pd
import numpy as np
import pickle

from Agent.model import RandomForest, haversine, DecisionTree, train  # import your class and function

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

# ---------------- CONFIG ----------------
API_KEY = "e562bf7c02a774b00bab775bdcfa4d494cf503b2128fb04a6872822783e5b04d"
STREAM_URL = "https://95.217.75.14:8443/stream"
FLAG_URL = "https://95.217.75.14:8443/api/flag"
headers = {"X-API-Key": API_KEY}

FEATURE_ORDER = ["distance", "gender", "age", "time", "category", "amount"]

# ---------------- MODEL SETUP ----------------
nr = int(input("Write 1 to train a new model, 0 to load an existing one: "))
print("Loading dependencies...")

if nr == 1:
    print("[*] Training RandomForest on test.csv ...")
    rf = train("test.csv")
    with open("/home/radu/COM-AI/Listener/RandomForest_custom.pkl", "wb") as f:
        pickle.dump(rf, f)
    print("[+] Model trained and saved.")
else:
    print("[*] Loading existing model ...")
    with open("/home/radu/COM-AI/Listener/RandomForest_custom.pkl", "rb") as fin:
        rf = pickle.load(fin)
    print("[+] Model loaded successfully.")

# ---------------- TRANSACTION HANDLING ----------------
def flag_transaction(trans_num, flag_value):
    """Send prediction result back to the API."""
    try:
        payload = {"trans_num": trans_num, "flag_value": flag_value}
        response = requests.post(FLAG_URL, headers=headers, json=payload, verify=False, timeout=10)
        response.raise_for_status()
        return response.json()
    except Exception as e:
        print(f"[!] Error flagging transaction {trans_num}: {e}")
        return None

def transaction_to_vector(transaction):
    """Convert a transaction dict to a feature vector for the RF model."""
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
        merchant = transaction.get("merchant", "unknown")  # added merchant

        # 2D array for predict
        vector = [[distance, gender, age, time, category, amount, merchant]]
        return vector

    except Exception as e:
        print(f"[!] Error converting transaction to vector: {e}")
        return [[0, "unknown", 0, 0, "unknown", 0, "unknown"]]


def process_transaction(transaction):
    """Thread worker — process one transaction."""
    trans_num = transaction.get("trans_num")
    print(f"\nProcessing transaction: {trans_num}")

    # Convert to feature vector
    vector = transaction_to_vector(transaction)
    print(f"Vector: {vector}")

    try:
        # Predict
        prediction = rf.predict(vector)
        is_fraud = int(prediction[0])
        print(f"Predicted fraud: {is_fraud}")

        # Send flag
        result = flag_transaction(trans_num, is_fraud)
        print(f"Flag response: {result}")
        print("-" * 80)

    except Exception as e:
        print(f"[!] Error during prediction/flag for {trans_num}: {e}")



# ---------------- STREAM LISTENER ----------------
def main():
    max_workers = 20
    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        try:
            print("Connecting to stream...")
            response = requests.get(STREAM_URL, headers=headers, stream=True, verify=False)
            response.raise_for_status()
            client = SSEClient(response)
            print("[+] Connected to stream. Waiting for transactions...")

            futures = set()

            for event in client.events():
                if event.data:
                    try:
                        transaction = json.loads(event.data)
                        trans_num = transaction.get("trans_num")
                        print(f"Received transaction: {trans_num}")

                        # Submit the task
                        future = executor.submit(process_transaction, transaction)
                        futures.add(future)

                        # Check finished futures (to catch thread exceptions)
                        done = {f for f in futures if f.done()}
                        for f in done:
                            try:
                                f.result()
                            except Exception as e:
                                print(f"[!] Error in thread: {e}")
                        futures -= done

                    except Exception as e:
                        print(f"[!] Error handling event: {e}")

        except KeyboardInterrupt:
            print("Stopped by user.")
        except Exception as e:
            print(f"[!] Unexpected error: {e}")


# ---------------- MAIN ----------------
if __name__ == "__main__":
    main()
