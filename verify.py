import pickle
import os
import re

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
    "aidanWilliamsHealy": "Aidan Williams-Healy",
    "brandonBonadies":    "Brandan Bonadies",
    "charlieLansdowne":   "Charles Lansdowne",
    "connorMcGinley":     "Connor McGinley",
    "francesaRegan":      "Francesca Reagan",
    "jacobRadzieta":      "Jacob Radzietra",
    "joshGervitz":        "Joshua Gervitz",
    "lennyWeber":         "Leonard Weber",
    "markLeszcynski":     "Mark Leszczynski",
    "meghanBirns":        "Megan Birns",
    "mikePreziosi":       "Michael Preziosi",
    "nickFontana":        "Nicholas Fontana",
    "stephenSargaent":    "Stephen Sargeant",
    "willBany":           "William Bany",
    "willSmith":          "William Smith",
    "zachLittlewood":     "Zachary Littlewood"
}

def camel_to_title(name: str) -> str:
    s1 = re.sub('(.)([A-Z][a-z]+)', r'\1 \2', name)
    s2 = re.sub('([a-z0-9])([A-Z])', r'\1 \2', s1)
    return s2.title()

pkl_path = "pokedex_database.pkl"
with open(pkl_path, "rb") as f:
    db = pickle.load(f)
pkl_keys = list(db.keys())

with open("MakeNJIT2026/players.js", "r", encoding="utf-8") as f:
    content = f.read()
player_names = re.findall(r'mkMember\(\s*\d+\s*,\s*"([^"]+)"', content)

mapped_names = {}
for raw_key in pkl_keys:
    name = NAME_MAP.get(raw_key) or camel_to_title(raw_key)
    mapped_names[raw_key] = name

unmatched_from_db = []
for raw_key, translated in mapped_names.items():
    if translated not in player_names:
        unmatched_from_db.append((raw_key, translated))

missing_in_db = []
for p_name in player_names:
    if p_name not in mapped_names.values():
        missing_in_db.append(p_name)

print("=== DB Keys that do not match any player in players.js after translation ===")
for rk, trans in unmatched_from_db:
    print(f"DB key: {rk} -> Translated: {trans}")

print("\n=== Players in players.js with no corresponding DB key ===")
for p in missing_in_db:
    print(f"Player: {p}")
