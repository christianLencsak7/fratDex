import insightface
from insightface.app import FaceAnalysis
import cv2
import numpy as np
import os
import pickle

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))

app = FaceAnalysis(name='buffalo_l')
app.prepare(ctx_id=-1, det_size=(640, 640))

def build_face_database(known_faces_folder):
    database = {}

    for person_name in os.listdir(known_faces_folder):
        person_path = os.path.join(known_faces_folder, person_name)

        if not os.path.isdir(person_path):
            continue

        print(f"Processing {person_name}...")
        embeddings = []

        for img_file in os.listdir(person_path):
            img_path = os.path.join(person_path, img_file)
            img = cv2.imread(img_path)

            if img is None:
                print(f"  [SKIP] Could not read {img_file}")
                continue

            faces = app.get(img)

            if not faces:
                print(f"  [SKIP] No face found in {img_file}")
                continue

            largest_face = max(faces, key=lambda f: (f.bbox[2]-f.bbox[0]) * (f.bbox[3]-f.bbox[1]))
            embeddings.append(largest_face.embedding)
            print(f"  [OK] {img_file}")

        if embeddings:
            if len(embeddings) >= 3:
                mean = np.mean(embeddings, axis=0)
                sims = [np.dot(e, mean) / (np.linalg.norm(e) * np.linalg.norm(mean)) for e in embeddings]
                threshold = np.mean(sims) - np.std(sims)
                filtered = [e for e, s in zip(embeddings, sims) if s >= threshold]
                database[person_name] = np.mean(filtered, axis=0)
            else:
                database[person_name] = np.mean(embeddings, axis=0)
            print(f"  -> {len(embeddings)} photos processed for {person_name}\n")
        else:
            print(f"  [FAIL] No valid faces found for {person_name}\n")

    return database

KNOWN_FACES_FOLDER = os.path.join(SCRIPT_DIR, 'known_faces')
DB_PATH = os.path.join(SCRIPT_DIR, 'pokedex_database.pkl')

database = build_face_database(KNOWN_FACES_FOLDER)

with open(DB_PATH, 'wb') as f:
    pickle.dump(database, f)

print(f"[OK] Database built with {len(database)} people!")
print("Known:", list(database.keys()))