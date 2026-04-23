import insightface
from insightface.app import FaceAnalysis
import cv2
import numpy as np
import pickle
import time
import os

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(SCRIPT_DIR, 'frat_database.pkl')

with open(DB_PATH, 'rb') as f:
    database = pickle.load(f)

print(f"✅ Loaded frat database with {len(database)} member(s)!")

app = FaceAnalysis(name='buffalo_l')
app.prepare(ctx_id=-1, det_size=(320, 320))

def recognize_player(embedding, threshold=0.6):
    best_match = None
    best_score = -1

    for player_name, player_embedding in database.items():
        sim = np.dot(embedding, player_embedding) / (np.linalg.norm(embedding) * np.linalg.norm(player_embedding))
        if sim > best_score:
            best_score = sim
            best_match = player_name

    if best_score >= threshold:
        return best_match, best_score
    else:
        return "Invalid", best_score

cap = cv2.VideoCapture(1)
print("📷 Camera ready — press SPACE to scan, Q to quit")

result_label = ""
result_color = (255, 255, 255)
result_time = None

while True:
    ret, frame = cap.read()
    if not ret:
        print("❌ Failed to grab frame")
        break

    # Clear text after 5 seconds
    if result_time and time.time() - result_time > 5:
        result_label = ""
        result_time = None

    if result_label:
        cv2.putText(frame, result_label, (30, 60),
                    cv2.FONT_HERSHEY_SIMPLEX, 2, result_color, 4)

    cv2.imshow('FratDex Face Recognition', frame)

    key = cv2.waitKey(1) & 0xFF

    if key == ord(' '):
        faces = app.get(frame)

        if not faces:
            result_label = "Invalid"
            result_color = (0, 0, 255)
            result_time = time.time()
            print("No face detected")
        else:
            for face in faces:
                player_name, score = recognize_player(face.embedding)
                if player_name != "Invalid":
                    result_label = player_name
                    result_color = (0, 255, 0)
                else:
                    result_label = "Invalid"
                    result_color = (0, 0, 255)
                result_time = time.time()
                print(f"Recognized: {player_name} (confidence: {score:.2f})")

    elif key == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()