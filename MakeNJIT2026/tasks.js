// ─── FratDex Task Database ───────────────────────────────────────
// Sigma Phi Epsilon NJ Alpha – 2025-2026 FratDex Challenges

const EXEC_ROLES = [
  "President", "VP of Programming", "VP of Learning Community",
  "VP of Finance", "VP of Member Development", "VP of Recruitment",
  "Chaplain", "VP of Communications"
];

const defaultTasks = [
  // ── Short Term (Easy / Fast) ──
  { category: "Short Term", label: "Scan the President",           check: (pp) => pp.some((p) => p.pos === "President" && p.collected) },
  { category: "Short Term", label: "Scan any Sweetheart",          check: (pp) => pp.some((p) => p.pos === "Sweetheart" && p.collected) },
  { category: "Short Term", label: "Scan a Faculty Fellow",        check: (pp) => pp.some((p) => p.pos === "Faculty Fellow" && p.collected) },
  { category: "Short Term", label: "Scan your first Brother",      check: (pp) => pp.some((p) => p.pos === "Brother" && p.collected) },
  { category: "Short Term", label: "Scan any VP",                  check: (pp) => pp.some((p) => p.pos.startsWith("VP") && p.collected) },
  { category: "Short Term", label: "Scan the Chaplain",            check: (pp) => pp.some((p) => p.pos === "Chaplain" && p.collected) },
  { category: "Short Term", label: "Scan the Resident Scholar",    check: (pp) => pp.some((p) => p.pos === "Resident Scholar" && p.collected) },
  { category: "Short Term", label: "Scan Christian Lencsak",       check: (pp) => pp.some((p) => p.name === "Christian Lencsak" && p.collected) },
  { category: "Short Term", label: "Scan Ryan Collier",            check: (pp) => pp.some((p) => p.name === "Ryan Collier" && p.collected) },
  { category: "Short Term", label: "Scan Sam Ferro",               check: (pp) => pp.some((p) => p.name === "Samuel Ferro" && p.collected) },
  { category: "Short Term", label: "Scan 5 members total",         check: (pp) => pp.filter((p) => p.collected).length >= 5 },
  { category: "Short Term", label: "Scan Zumrut Akcam-Kibis",      check: (pp) => pp.some((p) => p.name === "Zumrut Akcam-Kibis" && p.collected) },

  // ── Medium Term (Requires some hunting) ──
  { category: "Medium Term", label: "Complete the Exec Board (all 8)",  check: (pp) => pp.filter((p) => EXEC_ROLES.includes(p.pos) && p.collected).length >= 8 },
  { category: "Medium Term", label: "Scan all 4 Sweethearts",           check: (pp) => pp.filter((p) => p.pos === "Sweetheart" && p.collected).length >= 4 },
  { category: "Medium Term", label: "Scan all Faculty Fellows",         check: (pp) => pp.filter((p) => p.pos === "Faculty Fellow" && p.collected).length >= 4 },
  { category: "Medium Term", label: "Scan the Chapter Counselor",       check: (pp) => pp.some((p) => p.pos === "Chapter Counselor" && p.collected) },
  { category: "Medium Term", label: "Scan 3 different VPs",             check: (pp) => pp.filter((p) => p.pos.startsWith("VP") && p.collected).length >= 3 },
  { category: "Medium Term", label: "Scan 20 members total",            check: (pp) => pp.filter((p) => p.collected).length >= 20 },
  { category: "Medium Term", label: "Scan every Staff member (6)",      check: (pp) => pp.filter((p) => ["Resident Scholar","Chapter Counselor","Faculty Fellow"].includes(p.pos) && p.collected).length >= 6 },
  { category: "Medium Term", label: "Scan 10 Brothers",                 check: (pp) => pp.filter((p) => p.pos === "Brother" && p.collected).length >= 10 },

  // ── Long Term (Hard / Very specific) ──
  { category: "Long Term", label: "Scan Christopher Field",             check: (pp) => pp.some((p) => p.name === "Christopher Field" && p.collected) },
  { category: "Long Term", label: "Scan 50 members total",              check: (pp) => pp.filter((p) => p.collected).length >= 50 },
  { category: "Long Term", label: "Scan 75 members total",              check: (pp) => pp.filter((p) => p.collected).length >= 75 },
  { category: "Long Term", label: "Complete the FratDex (all 93!)",     check: (pp) => pp.every((p) => p.collected) },
];
