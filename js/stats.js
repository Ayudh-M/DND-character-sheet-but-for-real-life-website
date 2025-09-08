// stats.js — stat descriptors and scales
import { clamp, fmtTime, expThrough, piecewise } from './util.js';

export const titles = (score) => {
  const t = [
    "Pitiful", "Feeble", "Very Weak", "Frail", "Weak",
    "Below Average", "Meager", "Middling", "Ordinary", "Average",
    "Able", "Capable", "Fit", "Sturdy", "Strong",
    "Very Strong", "Mighty", "Elite", "Exceptional", "World-Class",
    "Phenomenal", "Legendary", "Mythic", "Titanic", "Herculean"
  ];
  return t[clamp(score,1,25)-1];
};

/* Strength */
const dl1rm = expThrough(10,80,18,240);
const pushups = expThrough(10,25,25,200);
const pullups = expThrough(10,5,25,40);
function strengthDesc(s) {
  const dead = Math.round(dl1rm(s));
  const carryPerHand = Math.round(dead * 0.4);
  const pu = Math.round(pushups(s));
  const chins = Math.max(0, Math.round(pullups(s)));
  return `Deadlift 1RM ≈ ${dead} kg • Farmer carry ≈ ${carryPerHand} kg/hand (20 m) • Push‑ups max ≈ ${pu} • Pull‑ups ≈ ${chins}`;
}

/* Dexterity */
function dexWPM(s) {
  if (s<=10) return 5+5*s;
  if (s<=18) return 60 + (s-10)*5;
  return 110 + (s-18)*10;
}
const reactMs = expThrough(1,500,25,120);
function juggleSec(s) {
  if (s<=5) return 0;
  if (s<=10) return (s-5)*4;
  if (s<=18) return 20 + (s-10)*5;
  return Math.round(60 + (s-18)*(540/7));
}
function dexterityDesc(s) {
  const wpm = Math.round(dexWPM(s));
  const rt = Math.round(reactMs(s));
  const j = Math.round(juggleSec(s));
  return `Typing ≈ ${wpm} WPM • Simple reaction time ≈ ${rt} ms • 3‑ball juggle ≈ ${j? j+' s':'can’t keep 3 balls up'}`;
}

/* Constitution */
const fiveK = piecewise([{x:1,y:45*60},{x:10,y:28*60},{x:18,y:20*60},{x:25,y:14*60}]);
const plank = piecewise([{x:1,y:10},{x:10,y:90},{x:18,y:240},{x:25,y:600}]);
const hikeRecover = piecewise([{x:1,y:60},{x:10,y:24},{x:18,y:10},{x:25,y:2}]);
function constitutionDesc(s) {
  const run = fmtTime(Math.round(fiveK(s)));
  const pl = Math.round(plank(s));
  const rec = Math.round(hikeRecover(s));
  return `5k ≈ ${run} • Plank ≈ ${pl} s • Post‑hike recovery ≈ ${rec} min to feel normal`;
}

/* Intelligence */
const digitSpan = piecewise([{x:1,y:2},{x:10,y:6},{x:18,y:8},{x:25,y:12}]);
const ravenTime = piecewise([{x:1,y:60},{x:10,y:20},{x:18,y:10},{x:25,y:3}]);
const mentalMult = piecewise([{x:1,y:0},{x:10,y:60},{x:18,y:20},{x:25,y:5}]);
function intelligenceDesc(s) {
  const ds = Math.round(digitSpan(s));
  const rv = Math.round(ravenTime(s));
  const mm = Math.round(mentalMult(s));
  return `Digits backward ≈ ${ds} • 20‑item pattern test ≈ ${rv} min • 2‑digit×2‑digit mental ≈ ${mm? mm+' s':'not reliable'}`;
}

/* Wisdom */
const focusMin = piecewise([{x:1,y:0.5},{x:10,y:5},{x:18,y:15},{x:25,y:60}]);
const impulseErr = piecewise([{x:1,y:50},{x:10,y:15},{x:18,y:5},{x:25,y:1}]);
const fallacyDetect = piecewise([{x:1,y:10},{x:10,y:50},{x:18,y:80},{x:25,y:98}]);
function wisdomDesc(s) {
  const f = focusMin(s).toFixed(1);
  const imp = Math.round(impulseErr(s));
  const fd = Math.round(fallacyDetect(s));
  return `Sustained focus ≈ ${f} min • Impulse errors ≈ ${imp}% • Fallacy detection ≈ ${fd}%`;
}

/* Charisma */
const eyeContact = piecewise([{x:1,y:0.5},{x:10,y:3},{x:18,y:6},{x:25,y:15}]);
const retention = piecewise([{x:1,y:20},{x:10,y:50},{x:18,y:75},{x:25,y:95}]);
const newFriends = piecewise([{x:1,y:0},{x:10,y:2},{x:18,y:5},{x:25,y:10}]);
function charismaDesc(s) {
  const ec = eyeContact(s).toFixed(1);
  const ret = Math.round(retention(s));
  const nf = Math.round(newFriends(s));
  return `Eye contact comfort ≈ ${ec} s • 3‑min talk retention ≈ ${ret}% • New friends at a meetup ≈ ${nf}`;
}

export const statDefs = {
  STR: { name:"Strength", detail: strengthDesc },
  DEX: { name:"Dexterity", detail: dexterityDesc },
  CON: { name:"Constitution", detail: constitutionDesc },
  INT: { name:"Intelligence", detail: intelligenceDesc },
  WIS: { name:"Wisdom", detail: wisdomDesc },
  CHA: { name:"Charisma", detail: charismaDesc },
};

export const statOrder = ["STR","DEX","CON","INT","WIS","CHA"];

export function generateScale(statKey) {
  const stat = statDefs[statKey];
  const rows = [];
  for (let s=1; s<=25; s++) {
    const title = titles(s);
    const desc = stat.detail(s);
    rows.push({ score:s, title, desc });
  }
  return rows;
}
