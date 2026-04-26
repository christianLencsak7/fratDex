import insightface
from insightface.app import FaceAnalysis
import cv2
import numpy as np
import pickle
import time
import os

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(SCRIPT_DIR, 'pokedex_database.pkl')

with open(DB_PATH, 'rb') as f:
    database = pickle.load(f)

print(f"✅ Loaded database with {len(database)} people!")

app = FaceAnalysis(name='buffalo_l')
app.prepare(ctx_id=-1, det_size=(320, 320))

def recognize_person(embedding, threshold=0.55):  # lower threshold — personal faces are trickier
    best_match = None
    best_score = -1

    for person_name, person_embedding in database.items():
        sim = np.dot(embedding, person_embedding) / (
            np.linalg.norm(embedding) * np.linalg.norm(person_embedding)
        )
        if sim > best_score:
            best_score = sim
            best_match = person_name

    if best_score >= threshold:
        return best_match, best_score
    else:
        return "Unknown", best_score

cap = cv2.VideoCapture(0)  # change to 1 if using external webcam
print("📷 Pokedex ready — press SPACE to scan, Q to quit")

result_label = ""
result_color = (255, 255, 255)
result_time = None

while True:
    ret, frame = cap.read()
    if not ret:
        print("❌ Failed to grab frame")
        break

    if result_time and time.time() - result_time > 5:
        result_label = ""
        result_time = None

    if result_label:
        cv2.putText(frame, result_label, (30, 60),
                    cv2.FONT_HERSHEY_SIMPLEX, 1.8, result_color, 4)

    cv2.imshow('Pokedex', frame)
    key = cv2.waitKey(1) & 0xFF

    if key == ord(' '):
        faces = app.get(frame)

        if not faces:
            result_label = "No face detected"
            result_color = (0, 0, 255)
            result_time = time.time()
        else:
            for face in faces:
                name, score = recognize_person(face.embedding)
                result_label = name
                result_color = (0, 255, 0) if name != "Unknown" else (0, 0, 255)
                result_time = time.time()
                print(f"Recognized: {name} (confidence: {score:.2f})")

    elif key == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()