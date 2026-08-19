import fs from 'fs';

const FULL_ROSTER = {
  1:{n:"Mark Johnson",p:"R"},2:{n:"Steve Green",p:"R"},3:{n:"Jason Rarick",p:"R"},4:{n:"Paul Utke",p:"R"},
  5:{n:"Robert Kupec",p:"D"},6:{n:"Keri Heintzeman",p:"R"},7:{n:"Robert Farnsworth",p:"R"},8:{n:"Torrey Westrom",p:"R"},
  9:{n:"Jordan Rasmusson",p:"R"},10:{n:"Nathan Wesenberg",p:"R"},11:{n:"Tony Jurgens",p:"R"},12:{n:"Jeremy Miller",p:"R"},
  13:{n:"Jeff Howe",p:"R"},14:{n:"Aric Putnam",p:"D"},15:{n:"Gary Dahms",p:"R"},16:{n:"Rob Farnsworth",p:"R"},
  17:{n:"Glenn Gruenhagen",p:"R"},18:{n:"Nick Frentz",p:"D"},19:{n:"John Jasinski",p:"R"},20:{n:"Steve Drazkowski",p:"R"},
  21:{n:"Mary Kunesh",p:"D"},22:{n:"Rich Draheim",p:"R"},23:{n:"Gene Dornink",p:"R"},24:{n:"Carla Nelson",p:"R"},
  25:{n:"Melisa López Franzen",p:"D"},26:{n:"John Marty",p:"D"},27:{n:"Andrew Mathews",p:"R"},28:{n:"Mark Koran",p:"R"},
  29:{n:"Michael Holmstrom",p:"R"},30:{n:"Eric Lucero",p:"R"},31:{n:"Calvin Bahr",p:"R"},32:{n:"Michael Kreun",p:"R"},
  33:{n:"Karin Housley",p:"R"},34:{n:"John Hoffman",p:"D"},35:{n:"Jim Abeler",p:"R"},36:{n:"Heather Gustafson",p:"D"},
  37:{n:"Warren Limmer",p:"R"},38:{n:"Susan Pha",p:"D"},39:{n:"Andrew Lang",p:"R"},40:{n:"Chris Eaton",p:"D"},
  41:{n:"Jeremy Miller",p:"R"},42:{n:"Bonnie Westlin",p:"D"},43:{n:"Ann Johnson Stewart",p:"D"},44:{n:"Rachel Silberman",p:"D"},
  45:{n:"Lindsey Port",p:"D"},46:{n:"Grant Hauschild",p:"D"},  47:{n:"Julia Coleman",p:"R"},48:{n:"Steve Cwodzinski",p:"D"},
  49:{n:"Melisa López Franzen",p:"D"},50:{n:"Alice Mann",p:"D"},51:{n:"Eric Pratt",p:"R"},52:{n:"Judy Seeberger",p:"D"},
  53:{n:"Matt Klein",p:"D"},54:{n:"Aric Putnam",p:"D"},55:{n:"Bill Weber",p:"R"},56:{n:"Erin Maye Quade",p:"D"},
  57:{n:"Zach Duckworth",p:"R"},58:{n:"Bill Lieske",p:"R"},59:{n:"Bobby Joe Champion",p:"D"},60:{n:"Doron Clark",p:"D"},
  61:{n:"Scott Dibble",p:"D"},62:{n:"Omar Fateh",p:"D"},63:{n:"Jennifer McEwen",p:"D"},64:{n:"Erin Murphy",p:"D"},
  65:{n:"Sandra Pappas",p:"D"},66:{n:"Clare Oumou Verbeten",p:"D"},67:{n:"Foung Hawj",p:"D"},
};

const QUOTES = {
  20: { hypocrisy: [{ text: "I have yet to meet a person in Minnesota that is hungry.", context: "Senate floor opposing free school meals", date: "2023-03-14", theme: "Feed the hungry", ntContrast: "Matthew 25:35", sources: [{ label: "CBS Minnesota", url: "https://www.cbsnews.com/minnesota/news/i-have-yet-to-meet-a-person-in-minnesota-that-is-hungry-outrage-follows-sen-drazkowskis-comments-on-free-school-meals/" }, { label: "NBC News", url: "https://www.nbcnews.com/politics/politics-news/state-gop-senator-says-never-met-hungry-minnesotan-rcna74969" }] }] },
  31: { hypocrisy: [{ text: "If you're gonna party, you got to pay the consequences.", context: "Leaked audio on abortion", date: "2024-03", theme: "Compassion", ntContrast: "John 8:7", sources: [{ label: "FOX 9", url: "https://www.fox9.com/news/dfl-responds-mn-gop-legislators-comment-why-he-opposes-abortion" }] }] },
  17: { hypocrisy: [
    { text: "It's an unhealthy, sexual addiction.", context: "Opposing marriage equality", date: "2013-02-27", theme: "Love neighbor", ntContrast: "Matthew 22:39", sources: [{ label: "Star Tribune", url: "https://www.startribune.com/gruenhagen-homosexuality-is-a-sexual-addiction/193674061/" }] },
    { text: "Climate change is a complete United Nations fraud and lie.", context: "Energy committee", date: "2021", theme: "Steward creation", ntContrast: "Matthew 5:9", sources: [{ label: "Public record via Wikipedia", url: "https://en.wikipedia.org/wiki/Glenn_Gruenhagen" }] },
    { text: "Women need to understand that abortion and pornography sends a certain message to men.", context: "Domestic violence discussion", date: "2023-03", theme: "Protect vulnerable", ntContrast: "Matthew 23:27", sources: [{ label: "Heartland Signal", url: "https://heartlandsignal.com/2023/03/29/minnesota-state-senator-blames-domestic-violence-on-women-abortion-and-pornography/" }] },
  ]},
  8: { hypocrisy: [{ text: "Start letting [wolves] be released in the backyards of these people that are in denial.", context: "Senate floor wolf debate", date: "2024", theme: "Peacemakers", ntContrast: "Matthew 5:9", sources: [{ label: "Grand Forks Herald", url: "https://www.grandforksherald.com/news/minnesota/minnesota-senator-suggests-releasing-wolves-into-peoples-yards-who-do-not-want-a-wolf-hunt" }] }] },
  37: { hypocrisy: [{ text: "Chickens are coming home to roost.", context: "Budget deficit statement", date: "2024", theme: "Hypocrisy", ntContrast: "Matthew 7:5", sources: [{ label: "MN Senate Republicans", url: "https://www.mnsenaterepublicans.com/senator-limmer-warns-chickens-coming-home-to-roost-due-to-looming-5-billion-deficit/" }] }] },
  47: { hypocrisy: [{ text: "The timing of the vote today feels performative at best.", context: "Firearms bill floor speech", date: "2025-05", theme: "Performative faith", ntContrast: "Matthew 6:5", sources: [{ label: "The Catholic Spirit", url: "https://www.thecatholicspirit.com/news/local-news/senators-recall-annunciation-as-omnibus-firearms-bill-passes-focus-shifts-to-house/" }] }] },
  1: { hypocrisy: [{ text: "We've asked for resignation based on the charges.", context: "Caucus sex sting scandal response", date: "2025-03", theme: "Accountability", ntContrast: "Matthew 23:4", sources: [{ label: "CBS Minnesota", url: "https://www.cbsnews.com/minnesota/news/justin-eichorn-minnesota-republican-state-sen-charged-prostitution/" }] }] },
  35: { faith: [{ text: "No man, woman or child is more or less in the eyes of our Lord... none of them are trash.", context: "Letter defending Somali Minnesotans", date: "2025-12", theme: "Dignity", ntAlignment: "Matthew 25:40", sources: [{ label: "Star Tribune", url: "https://www.startribune.com/republican-state-sen-jim-abeler-trump-letter-somalis-invite-minnesota/601541054" }] }] },
  64: { faith: [{ text: "They are our neighbors.", context: "Healthcare for undocumented Minnesotans", date: "2025-06", theme: "Welcome stranger", ntAlignment: "Matthew 25:35", sources: [{ label: "FOX 9", url: "https://www.fox9.com/news/dfl-progressive-caucus-disrupts-walz-budget-conference-over-undocumented-migrant-insurance" }] }] },
  50: { faith: [{ text: "Take insulin away from diabetics, inhalers from people with asthma, cancer treatment from people who just want a few more years with their children — all for political points.", context: "Healthcare press conference", date: "2025-06", theme: "Heal sick", ntAlignment: "Matthew 25:36", sources: [{ label: "FOX 9", url: "https://www.fox9.com/news/dfl-progressive-caucus-disrupts-walz-budget-conference-over-undocumented-migrant-insurance" }] }] },
  62: { faith: [{ text: "Thank you for speaking out when others stay silent.", context: "Thanking Abeler for defending Somali neighbors", date: "2025-12", theme: "Good Samaritan", ntAlignment: "Luke 10:25-37", sources: [{ label: "Star Tribune", url: "https://www.startribune.com/trump-racist-rant-somali-community-minnesota/601542035" }] }] },
  56: { faith: [{ text: "Gruenhagen violated Senate norms — sending graphic surgery video to all senators.", context: "Ethics complaint", date: "2024", theme: "Justice", ntAlignment: "Micah 6:8", sources: [{ label: "Star Tribune", url: "https://www.startribune.com/ethics-panel-takes-up-complaint-against-republican-senator-who-sent-graphic-video-link/600364366" }] }] },
};

const CAUCUS_R = [{ text: "Commemorative KJV Bibles distributed to Senate Democrats — 140 verses mention ass/asses.", context: "Caucus culture-war stunt", date: "2025-26", theme: "Faith weaponized", ntContrast: "Matthew 23:27", sources: [{ label: "MN Senate Republicans", url: "https://www.mnsenaterepublicans.com/" }] }];
const CAUCUS_D = [{ text: "Minnesota's prosperity depends on healthcare access for everyone, regardless of immigration status.", context: "POCI Caucus", date: "2025-06", theme: "Care for all", ntAlignment: "Matthew 25:40", sources: [{ label: "MN House POCI Caucus", url: "https://www.house.mn.gov/members/Profile/News/15574/40709" }], note: "Caucus statement — see senator bio for district-specific record." }];

const districts = {};
for (let d = 1; d <= 67; d++) {
  const r = FULL_ROSTER[d];
  const q = QUOTES[d] || {};
  districts[String(d)] = {
    district: d,
    senator: r.n,
    party: r.p,
    bioUrl: `https://www.senate.mn/members/index.html`,
    hypocrisy: q.hypocrisy || (r.p === "R" ? CAUCUS_R : []),
    faith: q.faith || (r.p === "D" ? CAUCUS_D : []),
    betterPath: r.p === "R"
      ? "We can be better: feed the hungry, love every neighbor, steward creation — stop invoking Christ for cruelty."
      : "Build prosperity for all — dignity, healthcare, and neighbors who show up.",
    hasDirectQuotes: !!(q.hypocrisy || q.faith),
  };
}

fs.writeFileSync('public/data/districts.json', JSON.stringify({
  meta: { updated: "2026-08-19", chamber: "Minnesota Senate", totalDistricts: 67 },
  districts,
}, null, 2));
console.log('Built', Object.keys(districts).length, 'districts');
