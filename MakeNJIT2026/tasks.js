// ─── FratDex Task Database ───────────────────────────────────────
// Challenges themed around scanning frat members.

const defaultTasks = [
  // ── Short Term (Easy / Fast) ──
  { category: "Short Term", label: "Scan Emily Prasad",     check: (pp) => pp.some((p) => p.name === "Emily Prasad"     && p.collected) },
  { category: "Short Term", label: "Scan Christian Lencsak", check: (pp) => pp.some((p) => p.name === "Christian Lencsak" && p.collected) },
  { category: "Short Term", label: "Find a Junior",         check: (pp) => pp.some((p) => p.exp === "Jr" && p.collected) },
  { category: "Short Term", label: "Find a CS major",       check: (pp) => pp.some((p) => p.college === "Computer Science" && p.collected) },
  { category: "Short Term", label: "Find a Secretary",      check: (pp) => pp.some((p) => p.pos === "Secretary" && p.collected) },
  { category: "Short Term", label: "Find a Brother",        check: (pp) => pp.some((p) => p.pos === "Brother" && p.collected) },
  { category: "Short Term", label: "Collect 1 member",      check: (pp) => pp.filter((p) => p.collected).length >= 1 },

  // ── Medium Term (Requires some hunting) ──
  { category: "Medium Term", label: "Collect all NJIT Chapter members", check: (pp) => pp.filter((p) => p.team === "NJIT Chapter" && p.collected).length >= pp.filter(p => p.team === "NJIT Chapter").length },
  { category: "Medium Term", label: "Find 2 different roles",           check: (pp) => { const roles = new Set(pp.filter(p => p.collected).map(p => p.pos)); return roles.size >= 2; } },
  { category: "Medium Term", label: "Scan every member twice (rescan)", check: (pp) => pp.filter((p) => p.collected).length >= 2 },

  // ── Long Term (Hard / Very specific) ──
  { category: "Long Term", label: "Complete the entire FratDex",   check: (pp) => pp.every((p) => p.collected) },
  { category: "Long Term", label: "Collect both CS majors",         check: (pp) => pp.filter((p) => p.college === "Computer Science" && p.collected).length >= 2 },
];
