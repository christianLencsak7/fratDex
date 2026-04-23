// ─── FratDex Member Data ─────────────────────────────────────────
// Sigma Phi Epsilon – New Jersey Alpha Chapter (RLC)
// Stevens Institute of Technology  ·  2025-2026 Composite

// Deterministic "spirit" stat from member name (always same value)
function _nameHash(name) {
  let h = 7;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) | 0;
  return 50 + Math.abs(h) % 45; // 50-94
}

function mkMember(no, name, chapter, role, collected, colors) {
  const roleRank = {
    "President":                   99,
    "VP of Programming":           90,
    "VP of Learning Community":    88,
    "VP of Finance":               87,
    "VP of Member Development":    86,
    "VP of Recruitment":           85,
    "Chaplain":                    84,
    "VP of Communications":        83,
    "Resident Scholar":            80,
    "Chapter Counselor":           78,
    "Faculty Fellow":              72,
    "Sweetheart":                  70,
    "Brother":                     50,
  };
  return {
    no,
    name,
    team:    chapter,
    pos:     role,
    ht:      "N/A",
    wt:      0,
    exp:     "Stevens",
    college: "SigEp",
    collected: !!collected,
    colors,
    stats: [
      ["SPIRIT", _nameHash(name)],
      ["RANK",   roleRank[role] ?? 50],
    ],
  };
}

// Chapter color palette [primary, secondary]
const C = {
  EXEC:  ["#522398", "#C8102E"],   // SigEp purple + red  (exec board)
  BRO:   ["#6B35A8", "#C8102E"],   // SigEp purple + red  (brothers)
  SWEET: ["#C8102E", "#FFB81C"],   // Red + gold          (sweethearts)
  FAC:   ["#2d3a4a", "#8B6BB5"],   // Dark + lavender     (faculty/staff)
};

const CHAPTER = "SigEp NJ Alpha";

const players = [
  // ── Executive Board ───────────────────────────────────────────────────
  mkMember(1,  "Christopher Field",    CHAPTER, "President",                false, C.EXEC),
  mkMember(2,  "Ian Hoffman",          CHAPTER, "VP of Programming",        false, C.EXEC),
  mkMember(3,  "Michael Lamaze",       CHAPTER, "VP of Learning Community", false, C.EXEC),
  mkMember(4,  "Sean Anderson",        CHAPTER, "VP of Finance",            false, C.EXEC),
  mkMember(5,  "John Kubowicz",        CHAPTER, "VP of Member Development", false, C.EXEC),
  mkMember(6,  "Leonard Weber",        CHAPTER, "VP of Recruitment",        false, C.EXEC),
  mkMember(7,  "Jacob Radzietra",      CHAPTER, "Chaplain",                 false, C.EXEC),
  mkMember(8,  "Charles Lansdowne",    CHAPTER, "VP of Communications",     false, C.EXEC),

  // ── Staff & Fellows ───────────────────────────────────────────────────
  mkMember(9,  "Ishan Aryendu",       CHAPTER, "Resident Scholar",  false, C.FAC),
  mkMember(10, "Adrian Castellanos",  CHAPTER, "Chapter Counselor", false, C.FAC),
  mkMember(11, "Zumrut Akcam-Kibis",  CHAPTER, "Faculty Fellow",    false, C.FAC),
  mkMember(12, "Sara Klein",          CHAPTER, "Faculty Fellow",    false, C.FAC),
  mkMember(13, "Kenneth Nilsen",      CHAPTER, "Faculty Fellow",    false, C.FAC),
  mkMember(14, "Eric Rose",           CHAPTER, "Faculty Fellow",    false, C.FAC),

  // ── Sweethearts ───────────────────────────────────────────────────────
  mkMember(15, "Charlotte Lee",     CHAPTER, "Sweetheart", false, C.SWEET),
  mkMember(16, "Francesca Reagan",  CHAPTER, "Sweetheart", false, C.SWEET),
  mkMember(17, "Megan Birns",       CHAPTER, "Sweetheart", false, C.SWEET),
  mkMember(18, "Julia Green",       CHAPTER, "Sweetheart", false, C.SWEET),

  // ── Brothers – Section 1 (Left) ──────────────────────────────────────
  mkMember(19, "Brandan Bonadies",          CHAPTER, "Brother", false, C.BRO),
  mkMember(20, "Dustin Conway",             CHAPTER, "Brother", false, C.BRO),
  mkMember(21, "Rajesh Pamar",              CHAPTER, "Brother", false, C.BRO),
  mkMember(22, "Aidan Williams-Healy",      CHAPTER, "Brother", false, C.BRO),
  mkMember(23, "Christopher Brown",         CHAPTER, "Brother", false, C.BRO),
  mkMember(24, "Anthony Curcio-Petraccoro", CHAPTER, "Brother", false, C.BRO),
  mkMember(25, "Jorge Ponce",               CHAPTER, "Brother", false, C.BRO),
  mkMember(26, "Aidan Ruck",                CHAPTER, "Brother", false, C.BRO),
  mkMember(27, "Austin Schlake",            CHAPTER, "Brother", false, C.BRO),
  mkMember(28, "Ethan Silverstein",         CHAPTER, "Brother", false, C.BRO),
  mkMember(29, "Aaron Sprigle",             CHAPTER, "Brother", false, C.BRO),
  mkMember(30, "Ryan Collier",              CHAPTER, "Brother", false, C.BRO),
  mkMember(31, "Angelo Naro",               CHAPTER, "Brother", false, C.BRO),
  mkMember(32, "Michael Preziosi",          CHAPTER, "Brother", false, C.BRO),
  mkMember(33, "Theo Rogalski",             CHAPTER, "Brother", false, C.BRO),
  mkMember(34, "William Bany",              CHAPTER, "Brother", false, C.BRO),
  mkMember(35, "Dylan McGrory",             CHAPTER, "Brother", false, C.BRO),
  mkMember(36, "Jake Paccione",             CHAPTER, "Brother", false, C.BRO),
  mkMember(37, "Francesco Pedulla",         CHAPTER, "Brother", false, C.BRO),
  mkMember(38, "Abhi Prajapati",            CHAPTER, "Brother", false, C.BRO),
  mkMember(39, "Michael Dox",               CHAPTER, "Brother", false, C.BRO),
  mkMember(40, "John Flores",               CHAPTER, "Brother", false, C.BRO),
  mkMember(41, "Michael Folmer",            CHAPTER, "Brother", false, C.BRO),
  mkMember(42, "Ryan Hoarle",               CHAPTER, "Brother", false, C.BRO),
  mkMember(43, "Christian Osowski",         CHAPTER, "Brother", false, C.BRO),
  mkMember(44, "Michael Prescott",          CHAPTER, "Brother", false, C.BRO),
  mkMember(45, "Ansh Razdan",               CHAPTER, "Brother", false, C.BRO),
  mkMember(46, "Stephen Sargeant",          CHAPTER, "Brother", false, C.BRO),
  mkMember(47, "Ryder Bowden",              CHAPTER, "Brother", false, C.BRO),
  mkMember(48, "Reece Bushroe",             CHAPTER, "Brother", false, C.BRO),
  mkMember(49, "Akeo Diaz",                 CHAPTER, "Brother", false, C.BRO),
  mkMember(50, "Clark Laforteza",           CHAPTER, "Brother", false, C.BRO),

  // ── Brothers – Section 2 (Center) ────────────────────────────────────
  mkMember(51, "Dominic Souza",      CHAPTER, "Brother", false, C.BRO),
  mkMember(52, "Andrew Tarnoski",    CHAPTER, "Brother", false, C.BRO),
  mkMember(53, "Armaan Basu",        CHAPTER, "Brother", false, C.BRO),
  mkMember(54, "Jack Guastella",     CHAPTER, "Brother", false, C.BRO),
  mkMember(55, "Christian Lencsak",  CHAPTER, "Brother", false, C.BRO),
  mkMember(56, "Mark Leszczynski",   CHAPTER, "Brother", false, C.BRO),
  mkMember(57, "Azhar Pathan",       CHAPTER, "Brother", false, C.BRO),
  mkMember(58, "Kieran Seidita",     CHAPTER, "Brother", false, C.BRO),
  mkMember(59, "Christian Sciulla",  CHAPTER, "Brother", false, C.BRO),
  mkMember(60, "Noah Wachtel",       CHAPTER, "Brother", false, C.BRO),
  mkMember(61, "Zachary Littlewood", CHAPTER, "Brother", false, C.BRO),
  mkMember(62, "Kevin Matias",       CHAPTER, "Brother", false, C.BRO),
  mkMember(63, "Connor McGinley",    CHAPTER, "Brother", false, C.BRO),
  mkMember(64, "Akshay Nair",        CHAPTER, "Brother", false, C.BRO),
  mkMember(65, "Austin Odle",        CHAPTER, "Brother", false, C.BRO),
  mkMember(66, "Kyle Phillips",      CHAPTER, "Brother", false, C.BRO),
  mkMember(67, "David Vuong",        CHAPTER, "Brother", false, C.BRO),
  mkMember(68, "Max Samarin",        CHAPTER, "Brother", false, C.BRO),
  mkMember(69, "William Smith",      CHAPTER, "Brother", false, C.BRO),

  // ── Brothers – Section 3 (Right) ─────────────────────────────────────
  mkMember(70, "Andrew Cheney",       CHAPTER, "Brother", false, C.BRO),
  mkMember(71, "Mateo Picconi",       CHAPTER, "Brother", false, C.BRO),
  mkMember(72, "Ross Rampolla",       CHAPTER, "Brother", false, C.BRO),
  mkMember(73, "Dimitri Stamoutsos",  CHAPTER, "Brother", false, C.BRO),
  mkMember(74, "Nico Savatta",        CHAPTER, "Brother", false, C.BRO),
  mkMember(75, "Kian Holden",         CHAPTER, "Brother", false, C.BRO),
  mkMember(76, "Marcus Hom",          CHAPTER, "Brother", false, C.BRO),
  mkMember(77, "Mike Lanfranco",      CHAPTER, "Brother", false, C.BRO),
  mkMember(78, "Kieran Corson",       CHAPTER, "Brother", false, C.BRO),
  mkMember(79, "Samuel Ferro",        CHAPTER, "Brother", false, C.BRO),
  mkMember(80, "Itai Geller",         CHAPTER, "Brother", false, C.BRO),
  mkMember(81, "Harris Hamid",        CHAPTER, "Brother", false, C.BRO),
  mkMember(82, "Nicholas Fontana",    CHAPTER, "Brother", false, C.BRO),
  mkMember(83, "Joshua Gervitz",      CHAPTER, "Brother", false, C.BRO),
  mkMember(84, "Ellis Hoang",         CHAPTER, "Brother", false, C.BRO),
  mkMember(85, "Michael Loff",        CHAPTER, "Brother", false, C.BRO),
  mkMember(86, "Samuel Strassburger", CHAPTER, "Brother", false, C.BRO),
  mkMember(87, "Dean Wise",           CHAPTER, "Brother", false, C.BRO),
  mkMember(88, "Ryan Catalano",       CHAPTER, "Brother", false, C.BRO),
  mkMember(89, "Jackson Corbett",     CHAPTER, "Brother", false, C.BRO),
  mkMember(90, "Joshua Heng",         CHAPTER, "Brother", false, C.BRO),
  mkMember(91, "Hudson Khadka",       CHAPTER, "Brother", false, C.BRO),
  mkMember(92, "Krishna Mansukhani",  CHAPTER, "Brother", false, C.BRO),
  mkMember(93, "Emran Nasseri",       CHAPTER, "Brother", false, C.BRO),
];
