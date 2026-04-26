const CHAPTER = "SigEp NJ Alpha";

const playersData = [
    {
        name: "Christopher Field",
        role: "President",
        hometown: "Belmore NY",
        major: "Comp Sci",
        roll: "1329",
        bday: "12/15/2004",
        bio: "An active athlete who enjoyed Volleyball, Track, and Baseball in high school.",
        big: "Matteo Picconi",
        lils: "Akash Rana"
    },
    {
        name: "Ian Hoffman",
        role: "VP of Programming",
        hometown: "Manasquan NJ",
        major: "Mech E",
        roll: "?",
        bday: "?",
        bio: "A talented individual with a background in Theater, Jazz, and Choir.",
        big: "?",
        lils: "?"
    },
    {
        name: "Michael Lamaze",
        role: "VP of Learning Community",
        hometown: "Merrick",
        major: "Cybersecurity",
        roll: "1379",
        bday: "?",
        bio: "6’4 370lbs lean machine monster of mass destruction and terror. Intelligent, jacked, humble, tall, handsome, overall just the greatest to ever do it of all time 👀",
        big: "Ryan Collier",
        lils: "?"
    },
    {
        name: "Sean Anderson",
        role: "VP of Finance",
        hometown: "Mickelton Nj",
        major: "Comp E",
        roll: "1340",
        bday: "12/5/2003",
        bio: "A focused student and athlete who did track, xc, rowing, and reached Boy Scouts.",
        big: "Dmitrius Dmantsouw",
        lils: "Marco Polametti"
    },
    {
        name: "John Kubowitz",
        role: "VP of Member Development",
        hometown: "Carnegie Nj",
        major: "Mech E",
        roll: "1357",
        bday: "04/04/2005",
        bio: "Experienced in Judo and Boy Scouts, this member is a dedicated individual.",
        big: "Anthony Frizzilone",
        lils: "Chop"
    },
    {
        name: "Leonard Weber",
        role: "VP of Recruitment",
        hometown: "Tilted Towers",
        major: "Computer Science 🚿",
        roll: "1354",
        bday: "?",
        bio: "This elusive species is most commonly found deep within its habitat, The Playroom, surrounded by glowing monitors, loud friends, empty snack wrappers, and the not very distant sound of Rocket League overtime at 2:47 am. It is rarely spotted outside touching grass, and when encountered in the wild, usually appears confused by sunlight. If you’re looking to catch one, don’t search the tall grass - check his room first. Lures include Vbucks, loud music, an Ethernet connection and someone typing “W stream” in chat. Rumor says it evolves into SweatyLennyManMan after 3 ranked Rocket League overtime wins in a row…",
        big: "Juan Ponce",
        lils: "Lenny, Gabe Costa, Ian Hoffman"
    },
    {
        name: "Jacob Radzietra",
        role: "Chaplain",
        hometown: "Cape May",
        major: "SWE",
        roll: "1331",
        bday: "03/09/2005",
        bio: "An active student who participated in Soccer, Golf, and served his community.",
        big: "Michael Monteleone",
        lils: "Joe Letizia"
    },
    {
        name: "Charles Lansdowne",
        role: "VP of Communications",
        hometown: "Denville NJ",
        major: "Electrical Engineering",
        roll: "1347",
        bday: "12/30/2004",
        bio: "A multi-talented member with interests in fencing, marching band, and culinary arts.",
        big: "Mateo Piconni",
        lils: "?"
    },
    {
        name: "Aidan Ruck",
        role: "Brother",
        hometown: "Cinnaminson NJ",
        major: "Comp E",
        roll: "1314",
        bday: "02/24/04",
        bio: "A competitive spirit with a focus on Tennis and Esports.",
        big: "Justin Bauman",
        lils: "Theo, Justin Bauman, Brian Specter"
    },
    {
        name: "Theo Rogalski",
        role: "Brother",
        hometown: "Davis, California",
        major: "CPE Bachelor's, EE Master's",
        roll: "1334",
        bday: "01/18/2005",
        bio: "Hobbies: Reading (Sci-Fi, Psychology, History), Language Learning (PTBR), Hiking, Coffee Walks Goals: Advanced Education (thinking about PhD), High-Tech Startup  4 Cool Brothers: Ruck (my big, inspired/told me about AMP in 4), Ethan (The GOAT), Jorge (Helped a brotha out with rush), Kian (Spellify genius))",
        big: "Aidan \"El Presidente\" Ruck",
        lils: "Joshua Heng"
    },
    {
        name: "Jorge Ponce",
        role: "Brother",
        hometown: "Staten Island",
        major: "Computer Science",
        roll: "1310",
        bday: "02/10/2004",
        bio: "A dedicated member involved in Soccer and Student Government during high school.",
        big: "Jett",
        lils: "Lenny, Aidan Weiss, Ryan Catalano"
    },
    {
        name: "Aidan Weiss",
        role: "Brother",
        hometown: "Oceanport NJ",
        major: "QF",
        roll: "1332",
        bday: "03/19/2004",
        bio: "A disciplined individual with a background in Military High School and Competition Drill Team.",
        big: "Jorge Ponce",
        lils: "Jenna?"
    },
    {
        name: "Michael Folmer",
        role: "Brother",
        hometown: "Staten Island",
        major: "Mech E",
        roll: "1362",
        bday: "11/08/2005",
        bio: "An active person who enjoys Weightlifting, Robotics, Ice Hockey, and Track.",
        big: "Mike LaFranco",
        lils: "Matteo Picone"
    },
    {
        name: "Aaron Sprigle",
        role: "Brother",
        hometown: "Cedar Grove",
        major: "Comp E Minor CS Masters Embedded Systems",
        roll: "1325",
        bday: "04/05/2004",
        bio: "A well-rounded member who participated in tennis, robotics, and band.",
        big: "Krishna, Nick Fonatno",
        lils: "Aidan Williams Healey, Michael Burgos"
    },
    {
        name: "Michael Preziosi",
        role: "Brother",
        hometown: "Woodland Park",
        major: "Cybersecurity",
        roll: "1330",
        bday: "06/02/2005",
        bio: "Involved in Marching Band, Fencing, and Tennis, with a strong academic focus.",
        big: "Andrew Cheney",
        lils: "Steven Skross"
    },
    {
        name: "Samuel Ferro",
        role: "Brother",
        hometown: "Ocean Nj",
        major: "mech e",
        roll: "1338",
        bday: "06/14/2005",
        bio: "A multi-disciplinary student involved in fencing, pit band, and jazz band.",
        big: "dean filipppone",
        lils: "ryan hoarle, rocco polimeni"
    },
    {
        name: "Ethan Silverstein",
        role: "Brother",
        hometown: "Syosset NY",
        major: "CS",
        roll: "1323",
        bday: "07/20/2004",
        bio: "Enjoys golf and robotics, bringing a technical edge to the chapter.",
        big: "Dean Zazero",
        lils: "Andrew Tarnoski, Rocco Palmetti"
    },
    {
        name: "Aidan Williams-Healy",
        role: "Brother",
        hometown: "Wayne NJ",
        major: "electrical engineering",
        roll: "1275",
        bday: "01/06/2003",
        bio: "An athlete in xc, wrestling, and track, and a semi-pro in spikeball.",
        big: "aaron sprigle",
        lils: "michael burgoiz, dylan skurnik"
    },
    {
        name: "John Flores",
        role: "Brother",
        hometown: "Clifton NJ",
        major: "Bio Chem",
        roll: "1371",
        bday: "05/31/2006",
        bio: "A dedicated researcher and athlete who played football and volleyball.",
        big: "Justin Baumann",
        lils: "None"
    },
    {
        name: "Justin Baumann",
        role: "Brother",
        hometown: "Bedminsrer NJ",
        major: "?",
        roll: "1280",
        bday: "08/08/03",
        bio: "A physics enthusiast who participated in the Physics Olympics.",
        big: "Bryan Spector",
        lils: "Andrew Philipps, Aidan Ruck, Michael Loff, Itai Geller, John Flores"
    },
    {
        name: "Dustin Conway",
        role: "Brother",
        hometown: "Port Republic NJ",
        major: "?",
        roll: "1268",
        bday: "?",
        bio: "A student leader involved in multiple clubs, including student council and NHS.",
        big: "Stephan Willey",
        lils: "Scott Miller, Jackson Corbett, Benjamin Gilmore"
    },
    {
        name: "Jackson Corbett",
        role: "Brother",
        hometown: "Wayne",
        major: "Civil E",
        roll: "1361",
        bday: "05/05/2006",
        bio: "A creative individual with a passion for theater.",
        big: "Dustin Conway",
        lils: "Stephan Wiley"
    },
    {
        name: "Ryan Hoarle",
        role: "Brother",
        hometown: "West Caldwell",
        major: "Mech E",
        roll: "1364",
        bday: "05/01/2006",
        bio: "A student of track and soccer who also enjoys building sets.",
        big: "Sam Ferro",
        lils: "Dean Filipione"
    },
    {
        name: "Emran Nasseri",
        role: "Brother",
        hometown: "Waldwick",
        major: "CS",
        roll: "1373",
        bday: "11/19/2005",
        bio: "An active athlete who played soccer, basketball, and track.",
        big: "Harris Hamid",
        lils: "Nicki Brate"
    },
    {
        name: "Mateo Picconi",
        role: "Brother",
        hometown: "Toms River Nj",
        major: "Civil E",
        roll: "1300",
        bday: "06/19/2003",
        bio: "A student leader and morning announcer during his high school years.",
        big: "Akash Rahna",
        lils: "Jake Meiskin"
    },
    {
        name: "Michael Loff",
        role: "Brother",
        hometown: "Neptune NJ",
        major: "CS",
        roll: "1356",
        bday: "05/27/04",
        bio: "A multi-sport athlete who played soccer, lax, wrestling, swim, and bowl.",
        big: "Justin Baumann",
        lils: "Brian Specter"
    },
    {
        name: "Nicholas Fontana",
        role: "Brother",
        hometown: "Manalapan, NJ",
        major: "CS",
        roll: "1341",
        bday: "08/27/05",
        bio: "A coder and peer leader who brings technical skills to the group.",
        big: "Kieran Sedita",
        lils: "Aaron Sprigle, AWH"
    },
    {
        name: "Dimitri Stamoutsos",
        role: "Brother",
        hometown: "Brick NJ",
        major: "Cybersecurity",
        roll: "1296",
        bday: "06/26/03",
        bio: "Enjoys cross country, chess club, and computer science club.",
        big: "Sean Anderson",
        lils: "Marco Polmetti, Luke Macvoy"
    },
    {
        name: "Dominic Souza",
        role: "Brother",
        hometown: "Scotch Plains NJ",
        major: "Mech E",
        roll: "1368",
        bday: "09/27/2004",
        bio: "A drum line member who also enjoys debate club and crosswords.",
        big: "Aidan Weiss",
        lils: "Jorge Ponce"
    },
    {
        name: "Ross Rampolla",
        role: "Brother",
        hometown: "Long Island",
        major: "Mech E",
        roll: "1291",
        bday: "01/01/2003",
        bio: "An active person with a background in lax, football, and climbing.",
        big: "Matthew Sytsma",
        lils: "Angelo Naro, Abhi Prahbati, Rocco Palmetti"
    },
    {
        name: "Christopher Brown",
        role: "Brother",
        hometown: "Glen Ridge",
        major: "Engineering Management",
        roll: "1318",
        bday: "11/26/2003",
        bio: "An Eagle Scout who practiced taekwondo and has a passion for plants.",
        big: "Robby",
        lils: "Ryan Evan Houst, Brian Tagoloverst"
    },
    {
        name: "Kian Holden",
        role: "Brother",
        hometown: "Princeton",
        major: "CS",
        roll: "1319",
        bday: "09/29/2003",
        bio: "Enjoys Magic: The Gathering, video games, piano, and music.",
        big: "Kieran Corson",
        lils: "Ryan Joe, Anthony Mendo, Jay Tray"
    },
    {
        name: "Andrew Cheney",
        role: "Brother",
        hometown: "Flemington NJ",
        major: "Mechanical Engineering",
        roll: "1288",
        bday: "01/15/2003",
        bio: "Old but not as cranky as Mateo. An Eagle Scout who enjoyed marching and jazz band.",
        big: "Steven Skros",
        lils: "Dean Wise, Ansh Razdan, Michael Preziosi, Steven Skross, Daniel Raleigh"
    },
    {
        name: "Megan Birns",
        role: "Sweetheart",
        hometown: "Marlborough NJ",
        major: "CS",
        roll: "250",
        bday: "01/13/2004",
        bio: "An artistic soul who loves music, art, thrifting, and playing bass.",
        big: "Kieran Corson",
        lils: "Kayleigh Tobland, Zoe Hack, Anja Lubbe, Emily Prasad, Aidan Ruck"
    },
    {
        name: "Itai Geller",
        role: "Brother",
        hometown: "Metuchen NJ",
        major: "Biomedical Engineering minor in Ocean Engineering",
        roll: "1339",
        bday: "08/10/2004",
        bio: "A climber and artist who writes and manages opinions for The Stute.",
        big: "Justin Baumann",
        lils: "Brian Specter"
    },
    {
        name: "Ryan Collier",
        role: "Brother",
        hometown: "Freehold NJ",
        major: "Business Tech",
        roll: "1337",
        bday: "10/30/2004",
        bio: "Enjoys gaming, working out, and has a great sense of humor.",
        big: "Michael Lamaze",
        lils: "Michael Dox, Gabriel Costa, Steven Scross"
    },
    {
        name: "William Bany",
        role: "Brother",
        hometown: "Farmingdale NY",
        major: "Chemical Engineering",
        roll: "1353",
        bday: "05/13/2005",
        bio: "Enjoys snowboarding, music, guitar, and movies.",
        big: "Francesco Pedulla, Mark Lecisynski",
        lils: "Nico Savatta, Matt Sytsma"
    },
    {
        name: "Stephen Sargeant",
        role: "Brother",
        hometown: "Queens NY",
        major: "civil engineering",
        roll: "1366",
        bday: "03/01/2005",
        bio: "A dedicated athlete who played football and basketball.",
        big: "Branden Bondadies",
        lils: "None"
    },
    {
        name: "Marcus Hom",
        role: "Brother",
        hometown: "Mahwah",
        major: "Computer Science",
        roll: "1320",
        bday: "09/08/2004",
        bio: "A musical individual who was involved in orchestra and band.",
        big: "Noah Spina",
        lils: "None"
    },
    {
        name: "Francesco Pedulla",
        role: "Brother",
        hometown: "Brooklyn",
        major: "Mech E",
        roll: "1349",
        bday: "12/14/2025",
        bio: "A dedicated musician who played in symphonic and marching bands.",
        big: "Christopher Opsal",
        lils: "Jett Tink"
    },
    {
        name: "David Vuong",
        role: "Brother",
        hometown: "Newburgh, New York",
        major: "Electrical Engineering",
        roll: "1398",
        bday: "?",
        bio: "im literally a fucking nuke with all this radiation in me",
        big: "Michael Loff",
        lils: "?"
    },
    {
        name: "Clark Laforteza",
        role: "Brother",
        hometown: "Parsippany",
        major: "Mechanical Engineer",
        roll: "1386",
        bday: "?",
        bio: "Filipino guy who you could catch around doing anything.",
        big: "Sam Ferro",
        lils: "?"
    },
    {
        name: "Jake Paccione",
        role: "Brother",
        hometown: "Bloomfield, NJ",
        major: "CS",
        roll: "1344",
        bday: "?",
        bio: "Super strength like superman, average nose",
        big: "Zach Scarpati",
        lils: "?"
    },
    {
        name: "Krishna Mansukhani",
        role: "Brother",
        hometown: "Edison, NJ",
        major: "Mechanical Engineering",
        roll: "1370",
        bday: "?",
        bio: "Quite literally the since greatest human being in the of the universe. Aura personified",
        big: "Aaron Sprigle",
        lils: "?"
    }
];

function _nameHash(name) {
    let h = 7;
    for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) | 0;
    return 50 + Math.abs(h) % 45; // 50-94
}

function mkMember(no, name, chapter, role, collected, colors, extra = {}) {
    const roleRank = {
        "President": 99,
        "VP of Programming": 90,
        "VP of Learning Community": 88,
        "VP of Finance": 87,
        "VP of Member Development": 86,
        "VP of Recruitment": 85,
        "Chaplain": 84,
        "VP of Communications": 83,
        "Resident Scholar": 80,
        "Chapter Counselor": 78,
        "Faculty Fellow": 72,
        "Sweetheart": 70,
        "Brother": 50,
    };
    return {
        no,
        name,
        team: chapter,
        pos: role,
        collected: !!collected,
        colors,
        major: extra.major || "?",
        hometown: extra.hometown || "?",
        roll: extra.roll || "?",
        bday: extra.bday || "?",
        bio: extra.bio || "Little is known about this pokemon",
        big: extra.big || "?",
        lils: extra.lils || "?",
        stats: [
            ["SPIRIT", extra.spirit || _nameHash(name)],
            ["RANK", roleRank[role] ?? 50],
        ],
    };
}
