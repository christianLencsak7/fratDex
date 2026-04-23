import insightface
from insightface.app import FaceAnalysis
import cv2
import numpy as np
import os
import pickle

# Always resolve paths relative to THIS script file, not the CWD
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))

app = FaceAnalysis(name='buffalo_l')
app.prepare(ctx_id=-1, det_size=(640, 640))

def build_player_database(players_folder):
    database = {}

    for player_name in os.listdir(players_folder):
        player_path = os.path.join(players_folder, player_name)

        if not os.path.isdir(player_path):
            continue

        print(f"Processing {player_name}...")
        embeddings = []

        for img_file in os.listdir(player_path):
            img_path = os.path.join(player_path, img_file)
            img = cv2.imread(img_path)

            if img is None:
                print(f"  [SKIP] Could not read {img_file}, skipping")
                continue

            faces = app.get(img)

            if not faces:
                print(f"  [SKIP] No face found in {img_file}, skipping")
                continue

            largest_face = max(faces, key=lambda f: (f.bbox[2]-f.bbox[0]) * (f.bbox[3]-f.bbox[1]))
            embeddings.append(largest_face.embedding)
            print(f"  [OK] {img_file}")

        if embeddings:
            database[player_name] = np.mean(embeddings, axis=0)
            print(f"  -> {len(embeddings)} photos processed for {player_name}\n")
        else:
            print(f"  [FAIL] No valid faces found for {player_name}\n")

    return database

# FaceRegModel/ itself — member subfolders (e.g. emilyPrasad/, christianLencsak/) live inside it
MEMBERS_FOLDER = SCRIPT_DIR
DB_PATH = os.path.join(SCRIPT_DIR, 'frat_database.pkl')

database = build_player_database(MEMBERS_FOLDER)

with open(DB_PATH, 'wb') as f:
    pickle.dump(database, f)

print(f"[OK] Database built with {len(database)} member(s)!")
print("Members:", list(database.keys()))