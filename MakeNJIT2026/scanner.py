"""
scanner.py — PlayerDex Face Scanner
────────────────────────────────────
1. Opens the webcam and captures a frame
2. Runs insightface on the frame to detect + embed any faces
3. Compares the embedding against FaceRegModel/nba_database.pkl
4. If a match is found above the confidence threshold, POSTs the player
   name to the local PlayerDex server (/api/scan) via WebSocket push.

Usage:
    python scanner.py

Prerequisites:
    pip install insightface onnxruntime opencv-python requests numpy
    Make sure FaceRegModel/nba_database.pkl exists.
    If it doesn't, run:  cd FaceRegModel && python step_one.py
"""

import cv2
import requests
import time
import sys
import os
import numpy as np

# ── Load insightface + the pre-built player database ──────────────────────────

try:
    from insightface.app import FaceAnalysis
except ImportError:
    print("ERROR: insightface is not installed.")
    print("Run:  pip install insightface onnxruntime")
    sys.exit(1)

try:
    import pickle
except ImportError:
    import cPickle as pickle

DB_PATH = os.path.join(os.path.dirname(__file__), "FaceRegModel", "nba_database.pkl")

if not os.path.exists(DB_PATH):
    print(f"ERROR: Database not found at {DB_PATH}")
    print("cd into FaceRegModel and run:  python step_one.py")
    sys.exit(1)

with open(DB_PATH, "rb") as f:
    database = pickle.load(f)

print(f"✅ Loaded face database with {len(database)} player(s): {list(database.keys())}")

# Prepare the face analysis app (CPU mode: ctx_id=-1)
face_app = FaceAnalysis(name="buffalo_l")
face_app.prepare(ctx_id=-1, det_size=(320, 320))

SERVER_URL  = "http://127.0.0.1:3000/api/scan"
THRESHOLD   = 0.45   # cosine similarity — lower = more lenient
CAMERA_INDEX = 0     # 0 = default/first USB cam. Change to 1 or 2 if needed.


# ── Recognition helper ────────────────────────────────────────────────────────

def recognize_face(embedding, threshold=THRESHOLD):
    """
    Compares an embedding against every player in the database.
    Returns (player_name, score) or ("Unknown", score).
    """
    best_match = "Unknown"
    best_score = -1.0

    for player_name, player_embedding in database.items():
        sim = np.dot(embedding, player_embedding) / (
            np.linalg.norm(embedding) * np.linalg.norm(player_embedding)
        )
        if sim > best_score:
            best_score = sim
            best_match = player_name

    if best_score >= threshold:
        return best_match, best_score
    return "Unknown", best_score


# ── Camera capture ────────────────────────────────────────────────────────────

def take_picture():
    print(f"\nInitializing camera (index {CAMERA_INDEX})...")
    cam = cv2.VideoCapture(CAMERA_INDEX)

    if not cam.isOpened():
        print(f"ERROR: Could not open camera index {CAMERA_INDEX}.")
        print("Try changing CAMERA_INDEX at the top of scanner.py (0, 1, or 2).")
        return None

    print("Camera active. Adjusting exposure for 2 seconds...")
    time.sleep(2)

    ret, frame = cam.read()
    cam.release()

    if not ret:
        print("ERROR: Failed to capture frame.")
        return None

    file_path = os.path.join(os.path.dirname(__file__), "captured_scan.jpg")
    cv2.imwrite(file_path, frame)
    print(f"📸 Photo saved → {file_path}")
    return frame, file_path


# ── Recognition + upload ──────────────────────────────────────────────────────

def process_and_upload(frame):
    print("\nRunning face recognition model...")

    faces = face_app.get(frame)

    if not faces:
        print("⚠️  No face detected in the captured frame.")
        return

    # Use the largest detected face
    face = max(faces, key=lambda f: (f.bbox[2] - f.bbox[0]) * (f.bbox[3] - f.bbox[1]))
    player_name, score = recognize_face(face.embedding)

    print(f"🔍 Best match: {player_name}  (confidence: {score:.2f})")

    if player_name == "Unknown":
        print("❌ Could not identify player — score below threshold.")
        return

    # Push the recognized player to the PlayerDex dashboard
    print(f"📡 Pushing '{player_name}' to PlayerDex server...")
    payload = {"label": f"Player: {player_name}"}

    try:
        response = requests.post(SERVER_URL, json=payload, timeout=5)
        if response.status_code == 200:
            data = response.json()
            if data.get("newly_collected"):
                print(f"✅ '{player_name}' added to your Pokedex!")
            else:
                print(f"ℹ️  '{player_name}' was already in your Pokedex.")
        else:
            print("Server error:", response.text)
    except requests.exceptions.ConnectionError:
        print("❌ Could not reach server. Is server.py running?")
    except Exception as e:
        print(f"❌ Unexpected error: {e}")


# ── Entry point ───────────────────────────────────────────────────────────────

if __name__ == "__main__":
    print("=== PlayerDex Face Scanner ===")

    result = take_picture()
    if result:
        frame, _ = result
        process_and_upload(frame)
