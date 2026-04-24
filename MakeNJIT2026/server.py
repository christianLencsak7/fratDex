"""
FratDex Backend – WebSocket edition
─────────────────────────────────────────
When a scan comes in, the server instantly pushes a 'state_update'
event to every connected browser tab via Socket.IO.

POST /api/scan      { "label": "Member: Emily Prasad" }
GET  /api/state     → { collected: [...] }
POST /api/reset     → clears all collected
POST /api/recognize → face recognition endpoint

Run:
  pip install flask flask-cors flask-socketio
  python server.py
"""

from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from flask_socketio import SocketIO
import json
import os
import base64
import numpy as np
import cv2
import threading
import time

try:
    import serial
    import serial.tools.list_ports
    SERIAL_AVAILABLE = True
except ImportError:
    SERIAL_AVAILABLE = False

try:
    from insightface.app import FaceAnalysis
    import pickle

    _DB_PATH = os.path.join(os.path.dirname(__file__), "FaceRegModel", "frat_database.pkl")
    with open(_DB_PATH, "rb") as _f:
        _face_db = pickle.load(_f)

    _face_app = FaceAnalysis(name="buffalo_l")
    _face_app.prepare(ctx_id=-1, det_size=(320, 320))
    FACE_RECOGNITION_ENABLED = True
    print(f"[FaceRec] Loaded DB with {len(_face_db)} member(s): {list(_face_db.keys())}")
except Exception as _e:
    FACE_RECOGNITION_ENABLED = False
    _face_db = {}
    _face_app = None
    print(f"[FaceRec] Disabled: {_e}")

FACE_THRESHOLD = 0.45   # cosine similarity cutoff

# Maps the folder name used in FaceRegModel → exact name in players.js
NAME_MAP = {
    "Christian Lencsak":    "Christian Lencsak",
    "christianLencsak":     "Christian Lencsak",
    "Christian":            "Christian Lencsak",
    "Emily Prasad":         "Emily Prasad",
    "emilyPrasad":          "Emily Prasad",
    "Emily":                "Emily Prasad",
    "Ryan Collier":         "Ryan Collier",
    "ryanCollier":          "Ryan Collier",
    "Ryan":                 "Ryan Collier",
    "Sam Ferro":            "Sam Ferro",
    "samFerro":             "Sam Ferro",
    "Sam":                  "Sam Ferro",
    "Zumrut Akcam Kibis":   "Zumrut Akcam Kibis",
    "zumrutAkcamKibis":     "Zumrut Akcam Kibis",
    "Zumrut":               "Zumrut Akcam Kibis",
}

def _recognize_face(embedding):
    best_match, best_score = "Unknown", -1.0
    for name, emb in _face_db.items():
        sim = np.dot(embedding, emb) / (np.linalg.norm(embedding) * np.linalg.norm(emb))
        if sim > best_score:
            best_score = sim
            best_match = name
    if best_score >= FACE_THRESHOLD:
        display_name = NAME_MAP.get(best_match, best_match)
        return display_name, best_score
    return "Unknown", best_score


app      = Flask(__name__, static_folder=".")
CORS(app, resources={r"/*": {"origins": "*"}})
socketio = SocketIO(app, cors_allowed_origins="*", async_mode="threading")

STATE_FILE = "state.json"


# ─── State helpers ───────────────────────────────────────────────────────────

def load_state():
    if not os.path.exists(STATE_FILE):
        return {"collected": []}
    with open(STATE_FILE, "r", encoding="utf-8") as f:
        return json.load(f)


def save_state(state):
    with open(STATE_FILE, "w", encoding="utf-8") as f:
        json.dump(state, f, indent=2)


# ─── API routes ──────────────────────────────────────────────────────────────

@app.route("/api/state", methods=["GET"])
def get_state():
    return jsonify(load_state())


@app.route("/api/scan", methods=["POST"])
def scan():
    data      = request.get_json(silent=True) or {}
    raw_label = data.get("label", "").strip()

    if not raw_label:
        return jsonify({"success": False, "error": "No label provided"}), 400

    member_name = raw_label.replace("Member:", "").replace("Player:", "").strip()

    if not member_name:
        return jsonify({"success": False, "error": "Could not parse member name"}), 400

    state             = load_state()
    already_collected = member_name in state["collected"]

    if not already_collected:
        state["collected"].append(member_name)
        save_state(state)
        print(f"Scanned: {member_name}  (total: {len(state['collected'])})")

    socketio.emit("state_update", state)
    socketio.emit("scan_event",   member_name)

    return jsonify({
        "success":         True,
        "player":          member_name,
        "newly_collected": not already_collected,
        "total_collected": len(state["collected"]),
    })


@app.route("/api/reset", methods=["POST"])
def reset():
    empty = {"collected": []}
    save_state(empty)
    socketio.emit("state_update", empty)
    print("State reset.")
    return jsonify({"success": True})


@app.route("/api/recognize", methods=["POST"])
def recognize():
    if not FACE_RECOGNITION_ENABLED:
        return jsonify({"success": False, "error": "Face recognition not available"}), 503

    data      = request.get_json(silent=True) or {}
    image_b64 = data.get("image", "")

    if "," in image_b64:
        image_b64 = image_b64.split(",", 1)[1]

    try:
        img_bytes = base64.b64decode(image_b64)
        img_array = np.frombuffer(img_bytes, dtype=np.uint8)
        frame     = cv2.imdecode(img_array, cv2.IMREAD_COLOR)
    except Exception as e:
        return jsonify({"success": False, "error": f"Could not decode image: {e}"}), 400

    if frame is None:
        return jsonify({"success": False, "error": "Empty frame"}), 400

    faces = _face_app.get(frame)
    if not faces:
        return jsonify({"success": True, "player": "Unknown", "reason": "No face detected"})

    face = max(faces, key=lambda f: (f.bbox[2] - f.bbox[0]) * (f.bbox[3] - f.bbox[1]))
    member_name, score = _recognize_face(face.embedding)

    print(f"[FaceRec] Best match: {member_name} (score: {score:.2f})")

    if member_name != "Unknown":
        state             = load_state()
        already_collected = member_name in state["collected"]
        if not already_collected:
            state["collected"].append(member_name)
            save_state(state)
        socketio.emit("state_update", state)
        socketio.emit("scan_event",   member_name)

    return jsonify({
        "success": True,
        "player":  member_name,
        "score":   round(float(score), 3),
    })


# ─── Static file serving ─────────────────────────────────────────────────────

@app.route("/")
def index():
    return send_from_directory(".", "index.html")

@app.route("/<path:filename>")
def static_files(filename):
    return send_from_directory(".", filename)


# ─── Socket events ────────────────────────────────────────────────────────────

@socketio.on("connect")
def on_connect():
    print("Browser connected")
    socketio.emit("state_update", load_state())

@socketio.on("disconnect")
def on_disconnect():
    print("Browser disconnected")


# ─── Arduino Serial Bridge ───────────────────────────────────────────────────

def arduino_serial_loop():
    """Background thread to read inputs from the Arduino controller via USB."""
    if not SERIAL_AVAILABLE:
        print("[Arduino] pyserial not found. Run 'pip install pyserial'.")
        return

    arduino = None
    print("[Arduino] Searching for controller...")

    while True:
        if arduino is None:
            ports = list(serial.tools.list_ports.comports())
            target_port = None
            for p in ports:
                # Common identifiers for Arduino/Serial boards
                if any(x in p.description or x in p.device for x in ["Arduino", "ttyACM", "ttyUSB", "USB Serial", "CH340"]):
                    target_port = p.device
                    break
            
            if target_port:
                try:
                    # 115200 is standard for the Router Bridge library
                    arduino = serial.Serial(target_port, 115200, timeout=0.1)
                    print(f"[Arduino] Connected to {target_port}")
                except Exception as e:
                    arduino = None
            
            if arduino is None:
                time.sleep(2)  # Wait before retrying
                continue

        try:
            if arduino.in_waiting > 0:
                line = arduino.readline().decode('utf-8', errors='ignore').strip()
                if line:
                    # The Bridge library usually sends data in a format like:
                    # "~notify:on_button_press:left~" or "notify:on_button_press:left"
                    # We handle multiple variants here:
                    if "on_button_press" in line:
                        parts = line.replace("~", "").split(":")
                        action = parts[-1].strip()
                        print(f"[Arduino] Action received: {action}")
                        socketio.emit("arduino_input", action)
        except Exception as e:
            print(f"[Arduino] Connection lost: {e}")
            arduino = None
            time.sleep(1)


# ─── Boot ─────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    # Start the Arduino listener in the background
    threading.Thread(target=arduino_serial_loop, daemon=True).start()

    print("FratDex server  ->  http://0.0.0.0:3000")
    socketio.run(app, host="0.0.0.0", port=3000, debug=True, allow_unsafe_werkzeug=True)
