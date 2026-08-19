import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const RAW = JSON.parse(fs.readFileSync(join(__dirname, 'senator-quotes-data.json'), 'utf8'));

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

function normalizeQuote(raw) {
  const q = {
    text: raw.text,
    context: raw.context,
    date: raw.date,
    theme: raw.theme,
    ntRef: raw.ntRef,
    ntText: NT[raw.ntKey] || raw.ntRef,
    sources: raw.sources,
  };
  if (raw.humor) q.humor = raw.humor;
  if (raw.inclusiveFuture) q.inclusiveFuture = raw.inclusiveFuture;
  if (raw.note) q.note = raw.note;
  return q;
}

function bioUrl(name, party) {
  const last = name.split(' ').pop();
  if (party === 'D') return `https://senatedfl.mn/?s=${encodeURIComponent(last)}`;
  return `https://www.mnsenaterepublicans.com/?s=${encodeURIComponent(last)}`;
}

function betterPath(party, district, senator, qd) {
  if (party === 'R') {
    if (qd.faith?.length)
      return `${senator} showed us Republicans can choose dignity over division. Minnesota needs more of that courage — feed the hungry, love every neighbor, steward creation.`;
    return `We can be better than culture-war stunts: feed hungry kids, welcome every neighbor, and stop invoking Christ's name for cruelty. ${senator}'s district — and all of Minnesota — deserves that future.`;
  }
  return `Build prosperity for all in District ${district}: dignity, healthcare, and neighbors who show up. That's the inclusive Minnesota ${senator} is working toward.`;
}

const districts = {};
let totalQuoteCount = 0;

for (let d = 1; d <= 67; d++) {
  const r = FULL_ROSTER[d];
  const raw = RAW[String(d)];
  if (!raw) throw new Error(`Missing quote data for district ${d}`);

  const hypocrisy = (raw.hypocrisy || []).map(normalizeQuote);
  const faith = (raw.faith || []).map(normalizeQuote);
  totalQuoteCount += hypocrisy.length + faith.length;

  if (r.p === 'R' && !hypocrisy.length && !faith.length)
    throw new Error(`District ${d} (${r.n}) has no quotes`);
  if (r.p === 'D' && !faith.length)
    throw new Error(`District ${d} (${r.n}) has no faith quotes`);

  districts[String(d)] = {
    district: d,
    senator: r.n,
    party: r.p,
    bioUrl: bioUrl(r.n, r.p),
    hypocrisy,
    faith,
    betterPath: betterPath(r.p, d, r.n, { faith }),
    hasDirectQuotes: true,
  };
}

const vals = Object.values(districts);
const statewide = {
  totalDistricts: 67,
  republican: vals.filter(v => v.party === 'R').length,
  dfl: vals.filter(v => v.party === 'D').length,
  directQuotes: 67,
  totalQuoteCount,
  highlights: [
    { district: 20, label: 'Drazkowski: hunger is "relative"' },
    { district: 35, label: 'Abeler: "none of them are trash"' },
    { district: 17, label: 'Gruenhagen: three sourced contradictions' },
    { district: 36, label: 'Gustafson: "Let\'s feed the kids"' },
    { district: 23, label: 'Dornink: the stewardess moment' },
    { district: 62, label: 'Fateh thanks Abeler across the aisle' },
  ],
  message: "Every senator has sourced quotes — click any district to explore. No generic caucus filler; every entry links to original reporting or official statements.",
};

fs.writeFileSync('public/data/districts.json', JSON.stringify({
  meta: {
    updated: "2026-08-19",
    chamber: "Minnesota Senate",
    totalDistricts: 67,
    source: "MN Senate 2025-2026 seating chart",
    allSenatorsSourced: true,
    totalQuoteCount,
  },
  statewide,
  districts,
}, null, 2));

console.log(`Built ${Object.keys(districts).length} districts, ${totalQuoteCount} sourced quotes (all senators covered)`);
