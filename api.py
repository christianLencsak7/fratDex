"""
FratDex API – FastAPI Edition
────────────────────────────────────────────────────────────────────
Endpoints
─────────
GET  /video_feed        → MJPEG stream (live camera + overlay text)
GET  /api/database      → JSON list of all known names in the pickle DB
POST /api/scan          → Grab current frame, run recognition, update state
GET  /api/state         → { collected: [...] }
POST /api/reset         → Clear all collected

Run:
  uvicorn api:app --host 0.0.0.0 --port 8000 --reload
"""

from fastapi import FastAPI
from fastapi.responses import StreamingResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import asyncio
import cv2
import numpy as np
import pickle
import os
import json
import time
import threading

# ─── Load InsightFace ─────────────────────────────────────────────────────────
from insightface.app import FaceAnalysis

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH    = os.path.join(SCRIPT_DIR, "pokedex_database.pkl")
STATE_FILE = os.path.join(SCRIPT_DIR, "state.json")
LAST_SCAN_IMAGE = os.path.join(SCRIPT_DIR, "last_scan.jpg")

with open(DB_PATH, "rb") as f:
    database = pickle.load(f)

print(f"✅ Loaded FratDex database with {len(database)} people: {list(database.keys())}")

face_app = FaceAnalysis(name="buffalo_l")
face_app.prepare(ctx_id=-1, det_size=(320, 320))

# Maps raw database folder key → display name matching players.js
NAME_MAP = {
    "christianLencsak":   "Christian Lencsak",
    "Christian Lencsak":  "Christian Lencsak",
    "emilyPrasad":        "Emily Prasad",
    "Emily Prasad":       "Emily Prasad",
    "ryanCollier":        "Ryan Collier",
    "Ryan Collier":       "Ryan Collier",
    "samFerro":           "Samuel Ferro",
    "Sam Ferro":          "Samuel Ferro",
    "Samuel Ferro":       "Samuel Ferro",
    "zumrutAkcamKibis":   "Zumrut Akcam-Kibis",
    "Zumrut Akcam-Kibis": "Zumrut Akcam-Kibis",
    "Zumrut Akcam Kibis": "Zumrut Akcam-Kibis",
}

# ─── State helpers ─────────────────────────────────────────────────────────────

def load_state() -> dict:
    if not os.path.exists(STATE_FILE):
        return {"collected": []}
    with open(STATE_FILE, "r") as f:
        return json.load(f)

def save_state(state: dict):
    with open(STATE_FILE, "w") as f:
        json.dump(state, f, indent=2)

# ─── Face recognition helper ───────────────────────────────────────────────────

def recognize_person(embedding) -> tuple[str, float]:
    best_match, best_score = "Unknown", -1.0
    for name, emb in database.items():
        sim = float(np.dot(embedding, emb) / (np.linalg.norm(embedding) * np.linalg.norm(emb)))
        if sim > best_score:
            best_score = sim
            best_match = name
    if best_score >= THRESHOLD:
        return best_match, best_score
    return "Unknown", best_score

# ─── Camera (managed via lifespan — released cleanly on shutdown) ────────────

cap = None  # initialized in lifespan()

# Shared overlay state for the MJPEG stream
_lock          = threading.Lock()
_overlay_text  = ""
_overlay_color = (0, 255, 0)
_overlay_until = 0.0

def set_overlay(text: str, color=(0, 255, 0), duration=4.0):
    global _overlay_text, _overlay_color, _overlay_until
    with _lock:
        _overlay_text  = text
        _overlay_color = color
        _overlay_until = time.time() + duration

# ─── Async MJPEG frame generator (non-blocking, cancellable) ──────────────────

async def generate_frames():
    """Async generator — yields MJPEG frames. Cancels cleanly on shutdown."""
    loop = asyncio.get_event_loop()
    try:
        while True:
            success, frame = await loop.run_in_executor(None, cap.read)
            if not success or frame is None:
                await asyncio.sleep(0.05)
                continue

            # Flip horizontally — acts as a natural mirror.
            # Text is drawn AFTER flipping so it appears readable (not backwards).
            frame = cv2.flip(frame, 1)

            with _lock:
                text  = _overlay_text if time.time() < _overlay_until else ""
                color = _overlay_color

            if text:
                cv2.putText(frame, text, (28, 62),
                            cv2.FONT_HERSHEY_SIMPLEX, 1.8, (0, 0, 0), 6)
                cv2.putText(frame, text, (30, 60),
                            cv2.FONT_HERSHEY_SIMPLEX, 1.8, color, 4)

            h, w = frame.shape[:2]
            rx, ry, rs = w // 2, h // 2, 80
            cv2.rectangle(frame, (rx - rs, ry - rs), (rx + rs, ry + rs), (255, 247, 223), 2)

            _, buffer = cv2.imencode(".jpg", frame, [cv2.IMWRITE_JPEG_QUALITY, 75])
            yield (
                b"--frame\r\n"
                b"Content-Type: image/jpeg\r\n\r\n"
                + buffer.tobytes()
                + b"\r\n"
            )
    except asyncio.CancelledError:
        pass

# ─── FastAPI lifespan (startup + shutdown hooks) ───────────────────────────────

@asynccontextmanager
async def lifespan(app: FastAPI):
    global cap
    cap = cv2.VideoCapture(0)  # change to 1 for external USB webcam
    if not cap.isOpened():
        raise RuntimeError("❌ Could not open camera. Try VideoCapture(1).")
    print("📷 Camera ready.")
    yield  # ←── server runs here
    cap.release()
    print("📷 Camera released cleanly.")

# ─── FastAPI app ───────────────────────────────────────────────────────────────

app = FastAPI(title="FratDex API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Routes ───────────────────────────────────────────────────────────────────

@app.get("/video_feed")
def video_feed():
    """Live MJPEG camera stream. Drop into any <img src="..."> tag."""
    return StreamingResponse(
        generate_frames(),
        media_type="multipart/x-mixed-replace; boundary=frame"
    )


@app.get("/api/database")
def get_database():
    """Returns all known names in the face database."""
    return JSONResponse({"names": list(database.keys()), "count": len(database)})


@app.post("/api/scan")
def scan():
    """
    Grab current frame, run InsightFace, update state.json, return result.
    """
    success, frame = cap.read()
    if not success:
        return JSONResponse({"success": False, "error": "Camera read failed"}, status_code=500)

    # Flip to match the stream so the saved face photo matches what the user sees
    frame = cv2.flip(frame, 1)

    faces = face_app.get(frame)

    if not faces:
        set_overlay("No face", (0, 0, 255))
        return JSONResponse({"success": True, "player": "Unknown", "reason": "No face detected"})

    face = max(faces, key=lambda f: (f.bbox[2] - f.bbox[0]) * (f.bbox[3] - f.bbox[1]))
    raw_name, score = recognize_person(face.embedding)

    # Convert database key → display name (e.g. "christianLencsak" → "Christian Lencsak")
    name = NAME_MAP.get(raw_name, raw_name)

    print(f"[Scan] {raw_name} → {name} ({score:.3f})")

    # Save the captured frame as the last-scan photo
    cv2.imwrite(LAST_SCAN_IMAGE, frame)

    if name != "Unknown":
        state = load_state()
        already = name in state["collected"]
        if not already:
            state["collected"].append(name)
            save_state(state)
        set_overlay(name, (80, 255, 80))
        return JSONResponse({
            "success":         True,
            "player":          name,
            "score":           round(score, 3),
            "newly_collected": not already,
            "total_collected": len(state["collected"]),
        })
    else:
        set_overlay("Unknown", (0, 0, 255))
        return JSONResponse({"success": True, "player": "Unknown", "score": round(score, 3)})


@app.get("/api/state")
def get_state():
    return JSONResponse(load_state())


@app.post("/api/reset")
def reset_state():
    empty = {"collected": []}
    save_state(empty)
    return JSONResponse({"success": True})


@app.get("/api/last-scan-image")
def last_scan_image():
    """Returns the JPEG of the last successfully scanned face."""
    from fastapi.responses import FileResponse
    if not os.path.exists(LAST_SCAN_IMAGE):
        return JSONResponse({"error": "No scan yet"}, status_code=404)
    return FileResponse(LAST_SCAN_IMAGE, media_type="image/jpeg")


@app.get("/health")
def health():
    return {"status": "ok", "db_size": len(database)}
