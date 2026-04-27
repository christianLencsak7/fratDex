// ─── FratDex Member Data ─────────────────────────────────────────
// Sigma Phi Epsilon – New Jersey Alpha Chapter (RLC)
// Stevens Institute of Technology  ·  2025-2026 Composite

function mkMember(no, name, chapter, role, collected, colors, extra = {}) {
  return {
    no,
    name,
    team:    chapter,
    pos:     role,
    collected: !!collected,
    colors,
    major: extra.major || "?",
    hometown: extra.hometown || "?",
    roll: extra.roll || "?",
    bday: extra.bday || "?",
    bio: extra.bio || "Little is known about this pokemon",
    big: extra.big || "?",
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
  mkMember(1,  "Christopher Field",    CHAPTER, "President",                false, C.EXEC, {
    hometown: "Belmore NY",
    major: "Comp Sci",
    roll: "1329",
    bday: "12/15/2004",
    bio: "An active athlete who enjoyed Volleyball, Track, and Baseball in high school.",
    big: "Matteo Picconi",

  }),
  mkMember(2,  "Ian Hoffman",          CHAPTER, "VP of Programming",        false, C.EXEC, {
    hometown: "Manasquan, NJ",
    major: "Mechanical Engineering",
    roll: "1342",
    bday: "?",
    bio: "Loves to snowball with esteemed VP of Finance Sean Anderson.",
    big: "Caden Stott",

  }),
  mkMember(3,  "Michael Lamaze",       CHAPTER, "VP of Learning Community", false, C.EXEC, {
    hometown: "Merrick",
    major: "Cybersecurity",
    roll: "1379",
    bday: "?",
    bio: "6’4 370lbs lean machine monster of mass destruction and terror. Intelligent, jacked, humble, tall, handsome, overall just the greatest to ever do it of all time 👀",
    big: "Ryan Collier",

  }),
  mkMember(4,  "Sean Anderson",        CHAPTER, "VP of Finance",            false, C.EXEC, {
    hometown: "Mickelton Nj",
    major: "Comp E",
    roll: "1340",
    bday: "12/5/2003",
    bio: "A focused student and athlete who did track, xc, rowing, and reached Boy Scouts.",
    big: "Dmitrius Dmantsouw",

  }),
  mkMember(5,  "John Kubowicz",        CHAPTER, "VP of Member Development", false, C.EXEC, {
    hometown: "Carnegie Nj",
    major: "Mech E",
    roll: "1357",
    bday: "04/04/2005",
    bio: "Experienced in Judo and Boy Scouts, this member is a dedicated individual.",
    big: "Anthony Frizzilone",

  }),
  mkMember(6,  "Leonard Weber",        CHAPTER, "VP of Recruitment",        true, C.EXEC, {
    hometown: "Tilted Towers",
    major: "Computer Science 🚿",
    roll: "1354",
    bday: "?",
    bio: "This elusive species is most commonly found deep within its habitat, The Playroom, surrounded by glowing monitors, loud friends, empty snack wrappers, and the not very distant sound of Rocket League overtime at 2:47 am. It is rarely spotted outside touching grass, and when encountered in the wild, usually appears confused by sunlight. If you’re looking to catch one, don’t search the tall grass - check his room first. Lures include Vbucks, loud music, an Ethernet connection and someone typing “W stream” in chat. Rumor says it evolves into SweatyLennyManMan after 3 ranked Rocket League overtime wins in a row…",
    big: "Juan Ponce",

  }),
  mkMember(7,  "Jacob Radzietra",      CHAPTER, "Chaplain",                 false, C.EXEC, {
    hometown: "Cape May",
    major: "SWE",
    roll: "1331",
    bday: "03/09/2005",
    bio: "An active student who participated in Soccer, Golf, and served his community.",
    big: "Michael Monteleone",

  }),
  mkMember(8,  "Charles Lansdowne",    CHAPTER, "VP of Communications",     false, C.EXEC, {
    hometown: "Denville NJ",
    major: "Electrical Engineering",
    roll: "1347",
    bday: "12/30/2004",
    bio: "A multi-talented member with interests in fencing, marching band, and culinary arts.",
    big: "Mateo Piconni",

  }),

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
  mkMember(17, "Megan Birns",       CHAPTER, "Sweetheart", false, C.SWEET, {
    hometown: "Marlborough NJ",
    major: "CS",
    roll: "250",
    bday: "01/13/2004",
    bio: "An artistic soul who loves music, art, thrifting, and playing bass. Did dance and Girl Scouts.",
    big: "Kieran Corson",

  }),
  mkMember(18, "Julia Green",       CHAPTER, "Sweetheart", false, C.SWEET),
  mkMember(93, "Emily Prasad",      CHAPTER, "Sweetheart", false, C.SWEET),

  // ── Brothers – Section 1 (Left) ──────────────────────────────────────
  mkMember(19, "Brandan Bonadies",          CHAPTER, "Brother", false, C.BRO),
  mkMember(20, "Dustin Conway",             CHAPTER, "Brother", false, C.BRO, {
    hometown: "Port Republic NJ",
    major: "?",
    roll: "1268",
    bday: "?",
    bio: "A student leader involved in multiple clubs, student council president, and NHS.",
    big: "Stephan Willey",

  }),
  mkMember(21, "Rajesh Pamar",              CHAPTER, "Brother", false, C.BRO),
  mkMember(22, "Aidan Williams-Healy",      CHAPTER, "Brother", false, C.BRO, {
    hometown: "Wayne NJ",
    major: "electrical engineering",
    roll: "1275",
    bday: "01/06/2003",
    bio: "An athlete in xc, wrestling, and track, and a semi-pro in spikeball. Paints DnD minis.",
    big: "aaron sprigle",

  }),
  mkMember(23, "Christopher Brown",         CHAPTER, "Brother", false, C.BRO, {
    hometown: "Glen Ridge",
    major: "Engineering Management",
    roll: "1318",
    bday: "11/26/2003",
    bio: "An Eagle Scout who practiced taekwondo and has a passion for plants.",
    big: "Robby",

  }),
  mkMember(24, "Anthony Curcio-Petraccoro", CHAPTER, "Brother", false, C.BRO),
  mkMember(25, "Jorge Ponce",               CHAPTER, "Brother", false, C.BRO, {
    hometown: "Staten Island",
    major: "Computer Science",
    roll: "1310",
    bday: "02/10/2004",
    bio: "A dedicated member involved in Soccer and Student Government during high school.",
    big: "Jett",

  }),
  mkMember(26, "Aidan Ruck",                CHAPTER, "Brother", false, C.BRO, {
    hometown: "Cinnaminson NJ",
    major: "Computer Engineering / Embedded Systems",
    roll: "1314",
    bday: "02/24/04",
    bio: "Former Junior Marshall, no other positions of note. Ranked #21 nationwide on consumption of Guinness (estimated, delusional).",
    big: "Justin Baumann",

  }),
  mkMember(27, "Austin Schlake",            CHAPTER, "Brother", false, C.BRO),
  mkMember(28, "Ethan Silverstein",         CHAPTER, "Brother", false, C.BRO, {
    hometown: "Syosset NY",
    major: "CS",
    roll: "1323",
    bday: "07/20/2004",
    bio: "Enjoys golf and robotics, bringing a technical edge to the chapter.",
    big: "Dean Zazero",

  }),
  mkMember(29, "Aaron Sprigle",             CHAPTER, "Brother", false, C.BRO, {
    hometown: "Cedar Grove",
    major: "Comp E Minor CS Masters Embedded Systems",
    roll: "1325",
    bday: "04/05/2004",
    bio: "A well-rounded member who participated in tennis, robotics, and band.",
    big: "Krishna, Nick Fonatno",

  }),
  mkMember(30, "Ryan Collier",              CHAPTER, "Brother", false, C.BRO, {
    hometown: "Freehold NJ",
    major: "Business Tech",
    roll: "1337",
    bday: "10/30/2004",
    bio: "Enjoys gaming, working out, and has a great sense of humor. Previously from Freehold.",
    big: "Michael Lamaze",

  }),
  mkMember(31, "Angelo Naro",               CHAPTER, "Brother", false, C.BRO),
  mkMember(32, "Michael Preziosi",          CHAPTER, "Brother", false, C.BRO, {
    hometown: "Woodland Park",
    major: "Cybersecurity",
    roll: "1330",
    bday: "06/02/2005",
    bio: "Involved in Marching Band, Fencing, and Tennis, with a strong academic focus.",
    big: "Andrew Cheney",

  }),
  mkMember(33, "Theo Rogalski",             CHAPTER, "Brother", false, C.BRO, {
    hometown: "Davis, California",
    major: "CPE Bachelor's, EE Master's",
    roll: "1334",
    bday: "01/18/2005",
    bio: "Hobbies: Reading (Sci-Fi, Psychology, History), Language Learning (PTBR), Hiking, Coffee Walks. 4 Cool Brothers: Ruck, Ethan, Jorge, Kian.",
    big: "Aidan \"El Presidente\" Ruck",

  }),
  mkMember(34, "William Bany",              CHAPTER, "Brother", false, C.BRO, {
    hometown: "Farmingdale NY",
    major: "Chemical Engineering",
    roll: "1353",
    bday: "05/13/2005",
    bio: "Enjoys snowboarding, music, guitar, and movies.",
    big: "Francesco Pedulla, Mark Lecisynski",

  }),
  mkMember(35, "Dylan McGrory",             CHAPTER, "Brother", false, C.BRO, {
    hometown: "Westchester PA",
    major: "CS",
    roll: "1355",
    bday: "06/02/2005",
    bio: "Dedicated to the gym and esports, a balanced and focused brother.",
    big: "Zach Chirico",

  }),
  mkMember(36, "Jake Paccione",             CHAPTER, "Brother", false, C.BRO, {
    hometown: "Bloomfield, NJ",
    major: "CS",
    roll: "1344",
    bday: "?",
    bio: "Super strength like superman, average nose.",
    big: "Zach Scarpati",

  }),
  mkMember(37, "Francesco Pedulla",         CHAPTER, "Brother", false, C.BRO, {
    hometown: "Brooklyn",
    major: "Mech E",
    roll: "1349",
    bday: "12/14/2025",
    bio: "A dedicated musician who played in symphonic and marching bands.",
    big: "Christopher Opsal",

  }),
  mkMember(38, "Abhi Prajapati",            CHAPTER, "Brother", false, C.BRO),
  mkMember(39, "Michael Dox",               CHAPTER, "Brother", false, C.BRO),
  mkMember(40, "John Flores",               CHAPTER, "Brother", false, C.BRO, {
    hometown: "Clifton NJ",
    major: "Bio Chem",
    roll: "1371",
    bday: "05/31/2006",
    bio: "A dedicated researcher and athlete who played football and volleyball.",
    big: "Justin Baumann",

  }),
  mkMember(41, "Michael Folmer",            CHAPTER, "Brother", false, C.BRO, {
    hometown: "Staten Island",
    major: "Mech E",
    roll: "1362",
    bday: "11/08/2005",
    bio: "An active person who enjoys Weightlifting, Robotics, Ice Hockey, and Track.",
    big: "Mike LaFranco",

  }),
  mkMember(42, "Ryan Hoarle",               CHAPTER, "Brother", false, C.BRO, {
    hometown: "West Caldwell",
    major: "Mech E",
    roll: "1364",
    bday: "05/01/2006",
    bio: "A student of track and soccer who also enjoys building sets.",
    big: "Sam Ferro",

  }),
  mkMember(43, "Christian Osowski",         CHAPTER, "Brother", false, C.BRO),
  mkMember(44, "Michael Prescott",          CHAPTER, "Brother", false, C.BRO),
  mkMember(45, "Ansh Razdan",               CHAPTER, "Brother", false, C.BRO),
  mkMember(46, "Stephen Sargeant",          CHAPTER, "Brother", false, C.BRO, {
    hometown: "Queens NY",
    major: "civil engineering",
    roll: "1366",
    bday: "03/01/2005",
    bio: "A dedicated athlete who played football and basketball.",
    big: "Branden Bondadies",

  }),
  mkMember(47, "Ryder Bowden",              CHAPTER, "Brother", false, C.BRO),
  mkMember(48, "Reece Bushroe",             CHAPTER, "Brother", false, C.BRO),
  mkMember(49, "Akeo Diaz",                 CHAPTER, "Brother", false, C.BRO),
  mkMember(50, "Clark Laforteza",           CHAPTER, "Brother", false, C.BRO, {
    hometown: "Parsippany",
    major: "Mechanical Engineer",
    roll: "1386",
    bday: "?",
    bio: "Filipino guy who you could catch around doing anything.",
    big: "Sam Ferro",

  }),

  // ── Brothers – Section 2 (Center) ────────────────────────────────────
  mkMember(51, "Dominic Souza",      CHAPTER, "Brother", false, C.BRO, {
    hometown: "Scotch Plains NJ",
    major: "Mech E",
    roll: "1368",
    bday: "09/27/2004",
    bio: "A drum line member who also enjoys debate club and crosswords.",
    big: "Aidan Weiss",

  }),
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
  mkMember(67, "David Vuong",        CHAPTER, "Brother", false, C.BRO, {
    hometown: "Newburgh, New York",
    major: "Electrical Engineering",
    roll: "1398",
    bday: "?",
    bio: "im literally a fucking nuke with all this radiation in me",
    big: "Michael Loff",

  }),
  mkMember(68, "Max Samarin",        CHAPTER, "Brother", false, C.BRO),
  mkMember(69, "William Smith",      CHAPTER, "Brother", false, C.BRO),

  // ── Brothers – Section 3 (Right) ─────────────────────────────────────
  mkMember(70, "Andrew Cheney",       CHAPTER, "Brother", false, C.BRO, {
    hometown: "Flemington NJ",
    major: "Mechanical Engineering",
    roll: "1288",
    bday: "01/15/2003",
    bio: "Old but not as cranky as Mateo. An Eagle Scout who enjoyed marching and jazz band.",
    big: "Steven Skros",

  }),
  mkMember(71, "Mateo Picconi",       CHAPTER, "Brother", false, C.BRO, {
    hometown: "Toms River Nj",
    major: "Civil E",
    roll: "1300",
    bday: "06/19/2003",
    bio: "A student leader and morning announcer during his high school years.",
    big: "Akash Rahna",

  }),
  mkMember(72, "Ross Rampolla",       CHAPTER, "Brother", false, C.BRO, {
    hometown: "Long Island",
    major: "Mech E",
    roll: "1291",
    bday: "01/01/2003",
    bio: "An active person with a background in lax, football, and climbing.",
    big: "Matthew Sytsma",

  }),
  mkMember(73, "Dimitri Stamoutsos",  CHAPTER, "Brother", false, C.BRO, {
    hometown: "Brick NJ",
    major: "Cybersecurity",
    roll: "1296",
    bday: "06/26/03",
    bio: "Enjoys cross country, chess club, and computer science club. From Brick NJ.",
    big: "Sean Anderson",

  }),
  mkMember(74, "Nico Savatta",        CHAPTER, "Brother", false, C.BRO),
  mkMember(75, "Kian Holden",         CHAPTER, "Brother", false, C.BRO, {
    hometown: "Princeton",
    major: "CS",
    roll: "1319",
    bday: "09/29/2003",
    bio: "Enjoys Magic: The Gathering, video games, piano, and music.",
    big: "Kieran Corson",

  }),
  mkMember(76, "Marcus Hom",          CHAPTER, "Brother", false, C.BRO, {
    hometown: "Mahwah",
    major: "Computer Science",
    roll: "1320",
    bday: "09/08/2004",
    bio: "A musical individual who was involved in orchestra and band.",
    big: "Noah Spina",

  }),
  mkMember(77, "Mike Lanfranco",      CHAPTER, "Brother", false, C.BRO),
  mkMember(78, "Kieran Corson",       CHAPTER, "Brother", false, C.BRO, {
    hometown: "Cherry Hill, New Jersey",
    major: "Computer Science",
    roll: "1335",
    bday: "?",
    bio: "As a former VPMD, Kieran has now entered a classic post EC position of being a bum and getting a girlfriend",
    big: "Fris (Anthony Frisolone)",
  }),
  mkMember(79, "Samuel Ferro",        CHAPTER, "Brother", false, C.BRO, {
    hometown: "Ocean Nj",
    major: "mech e",
    roll: "1338",
    bday: "06/14/2005",
    bio: "A multi-disciplinary student involved in fencing, pit band, and jazz band.",
    big: "dean filipppone",

  }),
  mkMember(80, "Itai Geller",         CHAPTER, "Brother", false, C.BRO, {
    hometown: "Metuchen NJ",
    major: "Biomedical Engineering minor in Ocean Engineering",
    roll: "1339",
    bday: "08/10/2004",
    bio: "A climber and artist who writes and manages opinions for The Stute.",
    big: "Justin Baumann",

  }),
  mkMember(81, "Harris Hamid",        CHAPTER, "Brother", false, C.BRO),
  mkMember(82, "Nicholas Fontana",    CHAPTER, "Brother", false, C.BRO, {
    hometown: "Manalapan, NJ",
    major: "CS",
    roll: "1341",
    bday: "08/27/05",
    bio: "A coder and peer leader who brings technical skills to the group.",
    big: "Kieran Sedita",

  }),
  mkMember(83, "Joshua Gervitz",      CHAPTER, "Brother", false, C.BRO),
  mkMember(84, "Ellis Hoang",         CHAPTER, "Brother", false, C.BRO),
  mkMember(85, "Michael Loff",        CHAPTER, "Brother", false, C.BRO, {
    hometown: "Neptune NJ",
    major: "CS",
    roll: "1356",
    bday: "05/27/04",
    bio: "A multi-sport athlete who played soccer, lax, wrestling, swim, and bowl.",
    big: "Justin Baumann",

  }),
  mkMember(86, "Samuel Strassburger", CHAPTER, "Brother", false, C.BRO),
  mkMember(87, "Dean Wise",           CHAPTER, "Brother", false, C.BRO, {
    hometown: "Lyndhurst NJ",
    major: "Chemical Engineering",
    roll: "1351",
    bday: "03/28/2004",
    bio: "A culinary enthusiast and food reviewer who played volleyball and choir.",
    big: "Mark Lecisynski",

  }),
  mkMember(88, "Ryan Catalano",       CHAPTER, "Brother", false, C.BRO),
  mkMember(90, "Joshua Heng",         CHAPTER, "Brother", false, C.BRO),
  mkMember(91, "Hudson Khadka",       CHAPTER, "Brother", false, C.BRO),
  mkMember(92, "Krishna Mansukhani",  CHAPTER, "Brother", false, C.BRO, {
    hometown: "Edison, NJ",
    major: "Mechanical Engineering",
    roll: "1370",
    bday: "?",
    bio: "Quite literally the since greatest human being in the of the universe. Aura personified",
    big: "Aaron Sprigle",

  }),
  mkMember(160, "Emran Nasseri",       CHAPTER, "Brother", false, C.BRO, {
    hometown: "Waldwick",
    major: "CS",
    roll: "1373",
    bday: "11/19/2005",
    bio: "An active athlete who played soccer, basketball, and track.",
    big: "Harris Hamid",

  }),
];
