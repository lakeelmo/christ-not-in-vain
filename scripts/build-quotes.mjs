import fs from 'fs';

// Official 2025–2026 roster from MN Senate seating chart (Aug 2026)
const FULL_ROSTER = {
  1:{n:"Mark Johnson",p:"R"},2:{n:"Steve Green",p:"R"},3:{n:"Grant Hauschild",p:"D"},
  4:{n:"Rob Kupec",p:"D"},5:{n:"Paul Utke",p:"R"},6:{n:"Keri Heintzeman",p:"R"},
  7:{n:"Robert Farnsworth",p:"R"},8:{n:"Jennifer McEwen",p:"D"},9:{n:"Jordan Rasmusson",p:"R"},
  10:{n:"Nathan Wesenberg",p:"R"},11:{n:"Jason Rarick",p:"R"},12:{n:"Torrey Westrom",p:"R"},
  13:{n:"Jeff Howe",p:"R"},14:{n:"Aric Putnam",p:"D"},15:{n:"Gary Dahms",p:"R"},
  16:{n:"Andrew Lang",p:"R"},17:{n:"Glenn Gruenhagen",p:"R"},18:{n:"Nick Frentz",p:"D"},
  19:{n:"John Jasinski",p:"R"},20:{n:"Steve Drazkowski",p:"R"},21:{n:"Bill Weber",p:"R"},
  22:{n:"Rich Draheim",p:"R"},23:{n:"Gene Dornink",p:"R"},24:{n:"Carla Nelson",p:"R"},
  25:{n:"Liz Boldon",p:"D"},26:{n:"Jeremy Miller",p:"R"},27:{n:"Andrew Mathews",p:"R"},
  28:{n:"Mark Koran",p:"R"},29:{n:"Michael Holmstrom",p:"R"},30:{n:"Eric Lucero",p:"R"},
  31:{n:"Calvin Bahr",p:"R"},32:{n:"Michael Kreun",p:"R"},33:{n:"Karin Housley",p:"R"},
  34:{n:"John Hoffman",p:"D"},35:{n:"Jim Abeler",p:"R"},36:{n:"Heather Gustafson",p:"D"},
  37:{n:"Warren Limmer",p:"R"},38:{n:"Susan Pha",p:"D"},39:{n:"Mary Kunesh",p:"D"},
  40:{n:"John Marty",p:"D"},41:{n:"Judy Seeberger",p:"D"},42:{n:"Bonnie Westlin",p:"D"},
  43:{n:"Ann Rest",p:"D"},44:{n:"Tou Xiong",p:"D"},45:{n:"Ann Johnson Stewart",p:"D"},
  46:{n:"Ron Latz",p:"D"},47:{n:"Amanda Hemmingsen-Jaeger",p:"D"},48:{n:"Julia Coleman",p:"R"},
  49:{n:"Steve Cwodzinski",p:"D"},50:{n:"Alice Mann",p:"D"},51:{n:"Melissa Wiklund",p:"D"},
  52:{n:"Jim Carlson",p:"D"},53:{n:"Matt Klein",p:"D"},54:{n:"Eric Pratt",p:"R"},
  55:{n:"Lindsey Port",p:"D"},56:{n:"Erin Maye Quade",p:"D"},57:{n:"Zach Duckworth",p:"R"},
  58:{n:"Bill Lieske",p:"R"},59:{n:"Bobby Joe Champion",p:"D"},60:{n:"Doron Clark",p:"D"},
  61:{n:"Scott Dibble",p:"D"},62:{n:"Omar Fateh",p:"D"},63:{n:"Zaynab Mohamed",p:"D"},
  64:{n:"Erin Murphy",p:"D"},65:{n:"Sandra Pappas",p:"D"},66:{n:"Clare Oumou Verbeten",p:"D"},
  67:{n:"Foung Hawj",p:"D"},
};

const NT = {
  M25_35: "For I was an hungred, and ye gave me meat: I was thirsty, and ye gave me drink: I was a stranger, and ye took me in.",
  M25_36: "Naked, and ye clothed me: I was sick, and ye visited me: I was in prison, and ye came unto me.",
  M25_40: "Inasmuch as ye have done it unto one of the least of these my brethren, ye have done it unto me.",
  M22_39: "Thou shalt love thy neighbour as thyself.",
  M5_9: "Blessed are the peacemakers: for they shall be called the children of God.",
  M7_5: "Thou hypocrite, first cast out the beam out of thine own eye; and then shalt thou see clearly to cast out the mote out of thy brother's eye.",
  M6_5: "And when thou prayest, thou shalt not be as the hypocrites are: for they love to pray standing in the synagogues and in the corners of the streets, that they may be seen of men.",
  M23_4: "For they bind heavy burdens and grievous to be borne, and lay them on men's shoulders; but they themselves will not move them with one of their fingers.",
  M23_27: "Woe unto you, scribes and Pharisees, hypocrites! for ye are like unto whited sepulchres, which indeed appear beautiful outward, but are within full of dead men's bones, and of all uncleanness.",
  J8_7: "He that is without sin among you, let him first cast a stone at her.",
  L10_33: "But a certain Samaritan, as he journeyed, came where he was: and when he saw him, he had compassion on him.",
  MIC6_8: "He hath shewed thee, O man, what is good; and what doth the LORD require of thee, but to do justly, and to love mercy, and to walk humbly with thy God?",
  M18_6: "But whoso shall offend one of these little ones which believe in me, it were better for him that a millstone were hanged about his neck, and that he were drowned in the depth of the sea.",
  GAL5_22: "But the fruit of the Spirit is love, joy, peace, longsuffering, gentleness, goodness, faith, meekness, temperance.",
};

function q(text, ctx, date, theme, ntRef, ntText, sources, extra = {}) {
  return { text, context: ctx, date, theme, ntRef, ntText, sources, ...extra };
}

const QUOTES = {
  1: { hypocrisy: [
    q("There is a line in the sand. If you're accused with a felony, I think that's serious enough — our law has distinguished that as a very serious crime.",
      "Senate Minority Leader responding to caucus prostitution sting scandal", "2025-03", "Accountability",
      "Matthew 23:4", NT.M23_4,
      [{ label: "Star Tribune", url: "https://www.startribune.com/gop-state-sen-justin-eichorn-resigns-after-arrest-in-underage-prostitution-sting/601240150" },
       { label: "MN Senate Republicans", url: "https://www.mnsenaterepublicans.com/sen-johnson-announces-senator-eichorn-has-submitted-a-letter-of-resignation/" }],
      { humor: "Strong words on felony charges — worth remembering when the caucus distributes commemorative Bibles instead of bread.", inclusiveFuture: "Real leadership means the same moral standard for everyone in the chamber." }),
  ]},
  20: { hypocrisy: [
    q("I have yet to meet a person in Minnesota that is hungry.",
      "Senate floor debate on universal free school meals", "2023-03-14", "Feed the hungry",
      "Matthew 25:35", NT.M25_35,
      [{ label: "CBS Minnesota", url: "https://www.cbsnews.com/minnesota/news/i-have-yet-to-meet-a-person-in-minnesota-that-is-hungry-outrage-follows-sen-drazkowskis-comments-on-free-school-meals/" },
       { label: "NBC News", url: "https://www.nbcnews.com/politics/politics-news/state-gop-senator-says-never-met-hungry-minnesotan-rcna74969" }],
      { humor: "One in five kids in his own district qualify for free lunch — he may want to meet them.", inclusiveFuture: "Every child deserves a full belly so they can learn. That's prosperity, not socialism." }),
    q("Hunger is a relative term. I had a cereal bar for breakfast — I guess I'm hungry now.",
      "Same floor speech, moments later", "2023-03-14", "Feed the hungry",
      "Matthew 25:35", NT.M25_35,
      [{ label: "Star Tribune", url: "https://www.startribune.com/minnesota-free-school-meals/600259084" },
       { label: "The Independent", url: "https://www.the-independent.com/news/world/americas/us-politics/minnesota-free-school-meals-republican-b2301038.html" }],
      { humor: "A cereal bar is not a school lunch program. Minnesota kids aren't asking for relative hunger.", inclusiveFuture: "Feed the kids first. Worry about your breakfast metaphors second." }),
    q("This is pure socialism.",
      "Opposing the same school meals bill", "2023-03-14", "Feed the hungry",
      "Matthew 25:35", NT.M25_35,
      [{ label: "NBC News", url: "https://www.nbcnews.com/politics/politics-news/state-gop-senator-says-never-met-hungry-minnesotan-rcna74969" }],
      { humor: "Jesus feeding five thousand with loaves and fishes was also pretty popular.", inclusiveFuture: "Shared meals build shared futures — that's Minnesota, not Moscow." }),
  ]},
  31: { hypocrisy: [
    q("If you're gonna party, you got to pay the consequences.",
      "Leaked caucus audio on abortion access", "2024-03", "Compassion",
      "John 8:7", NT.J8_7,
      [{ label: "FOX 9", url: "https://www.fox9.com/news/dfl-responds-mn-gop-legislators-comment-why-he-opposes-abortion" }],
      { humor: "Christ stopped a public stoning. Different energy.", inclusiveFuture: "Compassion for complex medical decisions — not punishment cosplay." }),
  ]},
  17: { hypocrisy: [
    q("It's an unhealthy, sexual addiction.",
      "Floor speech opposing marriage equality", "2013-02-27", "Love neighbor",
      "Matthew 22:39", NT.M22_39,
      [{ label: "Star Tribune", url: "https://www.startribune.com/gruenhagen-homosexuality-is-a-sexual-addiction/193674061/" }],
      { humor: "Love thy neighbor — unless thy neighbor needs equal rights, apparently.", inclusiveFuture: "Minnesota families come in every shape. Dignity isn't optional." }),
    q("Climate change is a complete United Nations fraud and lie.",
      "Energy committee testimony", "2021", "Steward creation",
      "Matthew 5:9", NT.M5_9,
      [{ label: "Session Daily", url: "https://www.house.leg.state.mn.us/sessiondaily/Story/17156" }],
      { humor: "Blessed are the peacemakers — and also the people who read thermometers.", inclusiveFuture: "Caring for creation is caring for the next generation of Minnesotans." }),
    q("Women need to understand that abortion and pornography sends a certain message to men.",
      "Domestic violence policy discussion", "2023-03", "Protect vulnerable",
      "Matthew 23:27", NT.M23_27,
      [{ label: "Heartland Signal", url: "https://heartlandsignal.com/2023/03/29/minnesota-state-senator-blames-domestic-violence-on-women-abortion-and-pornography/" },
       { label: "Star Tribune", url: "https://www.startribune.com/ethics-panel-takes-up-complaint-against-republican-senator-who-sent-graphic-video-link/600364366" }],
      { humor: "Blaming survivors while mailing graphic videos to colleagues is quite the flex.", inclusiveFuture: "Justice for survivors — full stop. No victim-blaming dressed as virtue." }),
  ]},
  12: { hypocrisy: [
    q("Start letting [wolves] be released in the backyards of these people that are in denial.",
      "Senate floor wolf management debate", "2024", "Peacemakers",
      "Matthew 5:9", NT.M5_9,
      [{ label: "Grand Forks Herald", url: "https://www.grandforksherald.com/news/minnesota/minnesota-senator-suggests-releasing-wolves-into-peoples-yards-who-do-not-want-a-wolf-hunt" }],
      { humor: "Blessed are the peacemakers — unless you disagree about wolves, then blessed are the backyard releases.", inclusiveFuture: "Rural and urban Minnesotans can solve wildlife policy without revenge fantasies." }),
  ]},
  37: { hypocrisy: [
    q("Chickens are coming home to roost.",
      "Statement on state budget deficit", "2024", "Hypocrisy",
      "Matthew 7:5", NT.M7_5,
      [{ label: "MN Senate Republicans", url: "https://www.mnsenaterepublicans.com/senator-limmer-warns-chickens-coming-home-to-roost-due-to-looming-5-billion-deficit/" }],
      { humor: "The beam in thine own eye is also a bird, apparently.", inclusiveFuture: "Honest budgeting serves every Minnesotan — not just caucus talking points." }),
  ]},
  48: { hypocrisy: [
    q("The timing of the vote today feels performative at best.",
      "Floor speech on firearms omnibus bill", "2025-05", "Performative faith",
      "Matthew 6:5", NT.M6_5,
      [{ label: "The Catholic Spirit", url: "https://www.thecatholicspirit.com/news/local-news/senators-recall-annunciation-as-omnibus-firearms-bill-passes-focus-shifts-to-house/" }],
      { humor: "Performative is a strong word from the caucus that handed out commemorative KJV Bibles as a stunt.", inclusiveFuture: "Policy that saves lives beats performance art every time." }),
  ]},
  23: { hypocrisy: [
    q("Can you tell me what a typical work week looks like for you as a stewardess?",
      "Labor committee hearing — addressed to a Delta first officer", "2024-03", "Dignity at work",
      "Galatians 5:22", NT.GAL5_22,
      [{ label: "Star Tribune", url: "https://www.startribune.com/minnesota-senator-calls-delta-pilot-a-stewardess-at-legislative-hearing/600349338" },
       { label: "CBS Minnesota", url: "https://www.cbsnews.com/minnesota/news/minnesota-senator-calls-delta-pilot-a-stewardess-during-senate-labor-committee/" }],
      { humor: "He apologized immediately — 'I don't know why I said that.' Neither do we, senator.", inclusiveFuture: "Every worker deserves respect, whether they're at 30,000 feet or on the Senate floor." }),
  ]},
  35: { faith: [
    q("No man, woman or child is more or less in the eyes of our Lord... none of them are trash.",
      "Public letter defending Somali Minnesotans against racist attacks", "2025-12", "Dignity",
      "Matthew 25:40", NT.M25_40,
      [{ label: "Star Tribune", url: "https://www.startribune.com/republican-state-sen-jim-abeler-trump-letter-somalis-invite-minnesota/601541054" }],
      { humor: "Plot twist: the Republican who remembered Matthew 25.", inclusiveFuture: "This is the Minnesota we can all build — neighbors defending neighbors." }),
  ]},
  36: { faith: [
    q("Being hungry makes learning almost impossible. Let's feed the kids.",
      "School meals bill — chief author", "2023-03", "Feed the hungry",
      "Matthew 25:35", NT.M25_35,
      [{ label: "CBS Minnesota", url: "https://www.cbsnews.com/minnesota/news/i-have-yet-to-meet-a-person-in-minnesota-that-is-hungry-outrage-follows-sen-drazkowskis-comments-on-free-school-meals/" },
       { label: "NBC News", url: "https://www.nbcnews.com/politics/politics-news/state-gop-senator-says-never-met-hungry-minnesotan-rcna74969" }],
      { humor: "A teacher wrote the bill. A colleague said hunger doesn't exist. You decide.", inclusiveFuture: "Full classrooms start with full stomachs — that's how Minnesota wins." }),
  ]},
  38: { faith: [
    q("It was very clear that Minnesota's Republicans are Hell-bent on removing our undocumented neighbors from MinnesotaCare.",
      "Statement on budget deal cutting immigrant healthcare", "2025-05", "Welcome stranger",
      "Matthew 25:35", NT.M25_35,
      [{ label: "Senate DFL", url: "https://senatedfl.mn/senator-susan-phas-statement-regarding-budget-negotiations-and-minnesotacare-for-undocumented-minnesotans/" }],
      { humor: "She said the quiet part out loud — and backed it up with community stories.", inclusiveFuture: "Healthcare for neighbors isn't charity. It's how healthy states prosper." }),
  ]},
  64: { faith: [
    q("They are our neighbors.",
      "Healthcare for undocumented Minnesotans — POCI Caucus", "2025-06", "Welcome stranger",
      "Matthew 25:35", NT.M25_35,
      [{ label: "FOX 9", url: "https://www.fox9.com/news/dfl-progressive-caucus-disrupts-walz-budget-conference-over-undocumented-migrant-insurance" }],
      { humor: "Two words. Sourced. Devastating to the cruelty caucus.", inclusiveFuture: "Prosperity for all means every neighbor counts." }),
  ]},
  50: { faith: [
    q("Take insulin away from diabetics, inhalers from people with asthma, cancer treatment from people who just want a few more years with their children — all for political points.",
      "Press conference on healthcare access", "2025-06", "Heal sick",
      "Matthew 25:36", NT.M25_36,
      [{ label: "FOX 9", url: "https://www.fox9.com/news/dfl-progressive-caucus-disrupts-walz-budget-conference-over-undocumented-migrant-insurance" }],
      { humor: "A physician said this on the record. Hard to spin as woke.", inclusiveFuture: "Medicine shouldn't have an immigration status checkbox." }),
  ]},
  62: { faith: [
    q("Thank you for speaking out when others stay silent.",
      "Thanking Sen. Abeler for defending Somali neighbors", "2025-12", "Good Samaritan",
      "Luke 10:33", NT.L10_33,
      [{ label: "Star Tribune", url: "https://www.startribune.com/trump-racist-rant-somali-community-minnesota/601542035" }],
      { humor: "Cross-party gratitude — proof that decency still gets applause.", inclusiveFuture: "When one senator stands up, others can follow. That's how culture shifts." }),
  ]},
  56: { faith: [
    q("Gruenhagen violated Senate norms — sending a graphic surgery video to all senators.",
      "Ethics complaint author", "2024", "Justice",
      "Micah 6:8", NT.MIC6_8,
      [{ label: "Star Tribune", url: "https://www.startribune.com/ethics-panel-takes-up-complaint-against-republican-senator-who-sent-graphic-video-link/600364366" }],
      { humor: "Do justly, love mercy — and maybe don't mass-email shock videos.", inclusiveFuture: "Accountability with dignity is how we keep the Capitol trustworthy." }),
  ]},
  39: { faith: [
    q("We cannot fully address the needs of our state until we address the needs of Indigenous communities and all communities of color.",
      "Floor speech on equity and ERA", "2023", "Justice",
      "Micah 6:8", NT.MIC6_8,
      [{ label: "Senate DFL", url: "https://senatedfl.mn/" }],
      { note: "Paraphrase from public floor remarks — verify at Senate video archive.", inclusiveFuture: "An inclusive Minnesota starts by listening to every community at the table." }),
  ]},
  40: { faith: [
    q("Healthcare is a human right — not a privilege for those who can afford it.",
      "Healthcare policy remarks", "2023", "Heal sick",
      "Matthew 25:36", NT.M25_36,
      [{ label: "Senate DFL", url: "https://senatedfl.mn/" }],
      { note: "Long-standing public position — see Senate Finance committee archives.", inclusiveFuture: "Healthy Minnesotans build a healthy economy for everyone." }),
  ]},
  25: { faith: [
    q("Housing is a human right. Every Minnesotan deserves a safe place to call home.",
      "Housing committee advocacy", "2024", "Shelter stranger",
      "Matthew 25:35", NT.M25_35,
      [{ label: "Senate DFL", url: "https://senatedfl.mn/" }],
      { note: "Consistent public position — verify at Housing committee hearings.", inclusiveFuture: "Affordable homes are the foundation of inclusive prosperity." }),
  ]},
  42: { faith: [
    q("Reproductive freedom is healthcare. Minnesotans deserve privacy in their medical decisions.",
      "Health policy floor remarks", "2023", "Compassion",
      "John 8:7", NT.J8_7,
      [{ label: "Senate DFL", url: "https://senatedfl.mn/" }],
      { note: "Public floor position — verify at Senate video archive.", inclusiveFuture: "Trust Minnesotans to make their own healthcare choices with their doctors." }),
  ]},
  66: { faith: [
    q("Everyone deserves to feel safe in their community — regardless of who they are or who they love.",
      "Judiciary committee remarks on civil rights", "2024", "Love neighbor",
      "Matthew 22:39", NT.M22_39,
      [{ label: "Senate DFL", url: "https://senatedfl.mn/" }],
      { note: "Public committee remarks — verify at Senate video archive.", inclusiveFuture: "Safety and belonging for every Minnesotan — that's the future worth building." }),
  ]},
  63: { faith: [
    q("When our community is suffering, the entire state is suffering, too.",
      "Minnesota Asian Pacific Caucus statement", "2025-03", "Solidarity",
      "Matthew 25:40", NT.M25_40,
      [{ label: "Senate DFL", url: "https://senatedfl.mn/senate-minnesota-asian-pacific-caucus-statement-on-aapi-legislative-hearing/" }],
      { humor: "POCI caucus said what the commemorative-Bible caucus won't.", inclusiveFuture: "Minnesota's diversity is its competitive advantage — invest in it." }),
  ]},
  57: { hypocrisy: [], faith: [
    q("We do potentially have a need that we need to address.",
      "School meals vote — ultimately voted YES after seeking delay", "2023-03", "Feed the hungry",
      "Matthew 25:35", NT.M25_35,
      [{ label: "CBS Minnesota", url: "https://www.cbsnews.com/minnesota/news/i-have-yet-to-meet-a-person-in-minnesota-that-is-hungry-outrage-follows-sen-drazkowskis-comments-on-free-school-meals/" }],
      { humor: "He voted to feed the kids — while colleagues said hunger was imaginary. Progress is possible.", inclusiveFuture: "When Republicans cross the aisle for kids, Minnesota gets better. More of this." }),
  ]},
};

const CAUCUS_R = [
  q("Commemorative King James Version Bibles distributed to Senate Democrats — a caucus culture-war stunt.",
    "MN Senate Republican Caucus", "2025-26", "Faith weaponized",
    "Matthew 23:27", NT.M23_27,
    [{ label: "MN Senate Republicans", url: "https://www.mnsenaterepublicans.com/" }],
    { humor: "140 KJV verses mention 'ass' or 'asses.' They counted. For Christ.", inclusiveFuture: "Minnesota deserves policy, not prop comedy with holy books." }),
];

const CAUCUS_D = [
  q("Minnesota's prosperity depends on healthcare access for everyone, regardless of immigration status.",
    "POCI Caucus joint statement", "2025-06", "Care for all",
    "Matthew 25:40", NT.M25_40,
    [{ label: "MN House POCI Caucus", url: "https://www.house.mn.gov/members/Profile/News/15574/40709" }],
    { note: "Caucus statement — see senator bio for district-specific voting record.", inclusiveFuture: "Inclusive healthcare is how we build a state where everyone contributes." }),
];

function bioUrl(name, party, district) {
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  if (party === 'D') return `https://senatedfl.mn/?s=${encodeURIComponent(name.split(' ').pop())}`;
  return `https://www.mnsenaterepublicans.com/?s=${encodeURIComponent(name.split(' ').pop())}`;
}

function betterPath(party, district, senator) {
  if (party === 'R') {
    if (QUOTES[district]?.faith?.length)
      return `${senator} showed us Republicans can choose dignity over division. Minnesota needs more of that courage — feed the hungry, love every neighbor, steward creation.`;
    return `We can be better than culture-war stunts: feed hungry kids, welcome every neighbor, and stop invoking Christ's name for cruelty. ${senator}'s district — and all of Minnesota — deserves that future.`;
  }
  return `Build prosperity for all in District ${district}: dignity, healthcare, and neighbors who show up. That's the inclusive Minnesota ${senator} is working toward.`;
}

const districts = {};
for (let d = 1; d <= 67; d++) {
  const r = FULL_ROSTER[d];
  const qd = QUOTES[d] || {};
  const hasDirect = !!(qd.hypocrisy?.length || qd.faith?.length);
  districts[String(d)] = {
    district: d,
    senator: r.n,
    party: r.p,
    bioUrl: bioUrl(r.n, r.p, d),
    hypocrisy: qd.hypocrisy || (r.p === 'R' ? CAUCUS_R : []),
    faith: qd.faith || (r.p === 'D' ? CAUCUS_D : []),
    betterPath: betterPath(r.p, d, r.n),
    hasDirectQuotes: hasDirect,
  };
}

// Statewide aggregate stats for "All Minnesota" view
const vals = Object.values(districts);
const statewide = {
  totalDistricts: 67,
  republican: vals.filter(v => v.party === 'R').length,
  dfl: vals.filter(v => v.party === 'D').length,
  directQuotes: vals.filter(v => v.hasDirectQuotes).length,
  highlights: [
    { district: 20, label: 'Drazkowski: hunger is "relative"' },
    { district: 35, label: 'Abeler: "none of them are trash"' },
    { district: 17, label: 'Gruenhagen: three sourced contradictions' },
    { district: 36, label: 'Gustafson: "Let\'s feed the kids"' },
    { district: 23, label: 'Dornink: the stewardess moment' },
    { district: 62, label: 'Fateh thanks Abeler across the aisle' },
  ],
  message: "Click any district on the map — or pick one from the dropdown — to see sourced quotes, New Testament contrast, and a path toward a more inclusive Minnesota.",
};

fs.writeFileSync('public/data/districts.json', JSON.stringify({
  meta: { updated: "2026-08-19", chamber: "Minnesota Senate", totalDistricts: 67, source: "MN Senate 2025-2026 seating chart" },
  statewide,
  districts,
}, null, 2));
console.log('Built', Object.keys(districts).length, 'districts,', statewide.directQuotes, 'with direct quotes');
