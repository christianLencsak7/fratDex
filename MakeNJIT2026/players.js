// ─── FratDex Member Data ─────────────────────────────────────────
// Converts height string "5-10" → inches for normalization
function _htIn(s) {
  const [f, i] = s.split("-").map(Number);
  return f * 12 + i;
}

// Returns a normalized member object ready for the app.
// year: "Fr" | "So" | "Jr" | "Sr"
function mkMember(no, name, chapter, role, ht, major, year, collected, colors) {
  const htIn  = _htIn(ht);
  const htPct = Math.round(Math.max(1, Math.min(99, (htIn - 60) / 20 * 100)));
  const yearMap = { "Fr": 10, "So": 35, "Jr": 60, "Sr": 85 };
  const yearPct = yearMap[year] ?? 50;
  const rolePct = role === "Pledge Master" ? 95
                : role === "President"     ? 90
                : role === "VP"            ? 80
                : role === "Treasurer"     ? 70
                : role === "Secretary"     ? 65
                : role === "Brother"       ? 50
                : role === "Little Sister" ? 50
                : 40;
  return {
    no,
    name,
    team: chapter,   // "team" field reused as chapter — keeps app logic intact
    pos:  role,      // "pos" field reused as role
    ht,
    wt:   yearPct,   // reused as year% for bar display
    exp:  year,      // reused as class year
    college: major,  // reused as major
    collected: !!collected,
    colors,
    stats: [
      ["HT",   htPct],
      ["YEAR", yearPct],
      ["ROLE", rolePct],
    ],
  };
}

// Chapter color palette [primary, secondary]
const C = {
  NJIT: ["#D22B2B", "#F5A623"],   // red + gold
};

const players = [
  mkMember(1, "Christian Lencsak", "NJIT Chapter", "Brother",       "6-0", "Computer Science", "Jr", false, C.NJIT),
  mkMember(2, "Emily Prasad",      "NJIT Chapter", "Little Sister", "5-3", "Computer Science", "Jr", false, C.NJIT),
  mkMember(3, "Ryan Collier",      "NJIT Chapter", "Brother",       "5-11","Business",         "So", false, C.NJIT),
  mkMember(4, "Sam Ferro",         "NJIT Chapter", "Brother",       "5-10","Engineering",      "Jr", false, C.NJIT),
  mkMember(5, "Zumrut Akcam Kibis","NJIT Chapter", "Little Sister", "5-4", "Architecture",     "Sr", false, C.NJIT),
];
