// stats.js — detailed stat descriptors & scales
import { clamp, fmtTime, expThrough, piecewise } from './util.js';

/** Score title (flavor) */
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

/** ---------- Strength (what you can move & for how long) ---------- */
const dl1rm = expThrough(10,80,18,240);            // 1RM deadlift (kg)
const pushups = expThrough(10,25,25,200);          // max reps
const pullups = expThrough(10,5,25,40);            // strict reps
const overheadPress = (s) => Math.round(dl1rm(s)*0.42); // rough press est.
const farmerCarryPerHand = (s) => Math.round(dl1rm(s)*0.35); // 100 m
const ruckWeight60m = piecewise([                  // 60-minute ruck at ~5 km/h
  {x:1,y:5},{x:10,y:15},{x:18,y:25},{x:25,y:40}
]);
function strengthDesc(s) {
  const dead = Math.round(dl1rm(s));
  const pu = Math.round(pushups(s));
  const chins = Math.max(0, Math.round(pullups(s)));
  const press = overheadPress(s);
  const carry100 = farmerCarryPerHand(s);
  const ruck = Math.round(ruckWeight60m(s));
  return [
    `You should be able to lift awkward household loads, move furniture with a friend, and hoist luggage without drama. At higher scores, you can carry adults, sprint with loads, or control heavy objects safely.`,
    `Numbers: 1RM deadlift ≈ ${dead} kg • Overhead press ≈ ${press} kg • Farmer carry ≈ ${carry100} kg/hand for 100 m • 60‑min ruck ≈ ${ruck} kg backpack • Max push‑ups ≈ ${pu} • Strict pull‑ups ≈ ${chins}`
  ].join(' ');
}

/** ---------- Dexterity (precision, speed, balance) ---------- */
function dexWPM(s) {
  if (s<=10) return 5+5*s;          // typing
  if (s<=18) return 60 + (s-10)*5;
  return 110 + (s-18)*10;
}
const reactMs = expThrough(1,500,25,120);          // simple reaction time
function juggleSec(s) {                             // 3-ball cascade
  if (s<=5) return 0;
  if (s<=10) return (s-5)*4;
  if (s<=18) return 20 + (s-10)*5;
  return Math.round(60 + (s-18)*(540/7));
}
const balanceEC = piecewise([                       // single-leg eyes-closed
  {x:1,y:1},{x:10,y:10},{x:18,y:20},{x:25,y:40}
]);
function dexterityDesc(s) {
  const wpm = Math.round(dexWPM(s));
  const rt = Math.round(reactMs(s));
  const j = Math.round(juggleSec(s));
  const bal = Math.round(balanceEC(s));
  return [
    `You should be able to manipulate small objects smoothly, catch tossed items without fumbling, and place your feet exactly where you intend. Higher scores feel "cat‑like": quick hands, soft landings, crisp footwork.`,
    `Numbers: typing ≈ ${wpm} WPM • reaction ≈ ${rt} ms • 3‑ball juggle ≈ ${j? j+' s':'can’t keep 3 balls up'} • single‑leg balance (eyes closed) ≈ ${bal} s`
  ].join(' ');
}

/** ---------- Constitution (lasting power & recovery) ---------- */
const fiveK = piecewise([{x:1,y:45*60},{x:10,y:28*60},{x:18,y:20*60},{x:25,y:14*60}]);
const plank = piecewise([{x:1,y:10},{x:10,y:90},{x:18,y:240},{x:25,y:600}]);
const hikeRecover = piecewise([{x:1,y:60},{x:10,y:24},{x:18,y:10},{x:25,y:2}]); // min
const stairsFlights = piecewise([{x:1,y:2},{x:10,y:8},{x:18,y:20},{x:25,y:40}]);
const packFor2h = piecewise([{x:1,y:3},{x:10,y:10},{x:18,y:18},{x:25,y:30}]); // kg for 2h brisk
function constitutionDesc(s) {
  const run = fmtTime(Math.round(fiveK(s)));
  const pl = Math.round(plank(s));
  const rec = Math.round(hikeRecover(s));
  const stair = Math.round(stairsFlights(s));
  const pack = Math.round(packFor2h(s));
  return [
    `You should be able to keep going when others fade, hold pace over distance, and bounce back after a hard day. At higher scores, back‑to‑back long days feel fine with minimal soreness.`,
    `Numbers: 5k ≈ ${run} • plank ≈ ${pl} s • recovery after tough hike ≈ ${rec} min • stairs without stopping ≈ ${stair} flights • 2‑hour brisk hike with ≈ ${pack} kg pack`
  ].join(' ');
}

/** ---------- Intelligence (reasoning, memory, learning speed) ---------- */
const digitSpan = piecewise([{x:1,y:2},{x:10,y:6},{x:18,y:8},{x:25,y:12}]);     // backward
const ravenTime = piecewise([{x:1,y:60},{x:10,y:20},{x:18,y:10},{x:25,y:3}]);    // mins for 20 patterns
const mentalMult = piecewise([{x:1,y:0},{x:10,y:60},{x:18,y:20},{x:25,y:5}]);    // secs for 2d×2d
function intelligenceDesc(s) {
  const ds = Math.round(digitSpan(s));
  const rv = Math.round(ravenTime(s));
  const mm = Math.round(mentalMult(s));
  let feats = "";
  if (s<=8) feats = "understands simple rules but struggles to keep multiple steps in mind without notes.";
  else if (s<=12) feats = "can follow multi‑step instructions and debug simple problems with patience.";
  else if (s<=16) feats = "learns unfamiliar tools from docs, reasons through if‑then chains, and spots contradictions.";
  else if (s<=20) feats = "abstracts patterns quickly, translates problems between domains (e.g., words → equations → code).";
  else feats = "juggles several abstractions at once, creates new frameworks, and reasons about edge cases naturally.";
  return `You ${feats} Numbers: digits backward ≈ ${ds} • 20‑item pattern set ≈ ${rv} min • 2‑digit×2‑digit mental ≈ ${mm>0 ? mm+' s' : 'not reliable'}`;
}

/** ---------- Wisdom (EQ: perception of self/others, judgment) ---------- */
const focusMin = piecewise([{x:1,y:0.5},{x:10,y:5},{x:18,y:15},{x:25,y:60}]);
const impulseErr = piecewise([{x:1,y:50},{x:10,y:15},{x:18,y:5},{x:25,y:1}]);
const fallacyDetect = piecewise([{x:1,y:10},{x:10,y:50},{x:18,y:80},{x:25,y:98}]);
function wisdomFeatText(s) {
  if (s<=8) return "often reacts in the moment; takes things personally; misses tone and subtext; struggles to admit mistakes.";
  if (s<=12) return "pauses sometimes before reacting; can name basic emotions; accepts feedback with effort.";
  if (s<=16) return "usually reads the room; notices cognitive biases; asks clarifying questions before judging.";
  if (s<=20) return "stays calm under social stress; de‑escalates conflict; balances short‑term feelings with long‑term values.";
  return "models other people’s perspectives, including when they’re wrong; repairs quickly after missteps; sets and keeps healthy boundaries.";
}
function wisdomDesc(s) {
  const f = focusMin(s).toFixed(1);
  const imp = Math.round(impulseErr(s));
  const fd = Math.round(fallacyDetect(s));
  return [
    `You ${wisdomFeatText(s)}`,
    `Numbers: sustained focus ≈ ${f} min • impulse errors (Go/No‑Go) ≈ ${imp}% • fallacy/bias detection in a 10‑item set ≈ ${fd}%`
  ].join(' ');
}

/** ---------- Charisma (presence, persuasion, warmth) ---------- */
const eyeContact = piecewise([{x:1,y:0.5},{x:10,y:3},{x:18,y:6},{x:25,y:15}]); // seconds
const retention = piecewise([{x:1,y:20},{x:10,y:50},{x:18,y:75},{x:25,y:95}]); // % of 3‑min talk
const newFriends = piecewise([{x:1,y:0},{x:10,y:2},{x:18,y:5},{x:25,y:10}]);   // at 20‑person meetup
const namesRemembered = piecewise([{x:1,y:0},{x:10,y:4},{x:18,y:10},{x:25,y:18}]); // names after intros
function charismaFeatText(s) {
  if (s<=8) return "feel awkward starting conversations and default to short answers.";
  if (s<=12) return "can hold small talk, ask basic questions, and mirror energy with some effort.";
  if (s<=16) return "tell engaging stories, make others comfortable, and invite quieter people in.";
  if (s<=20) return "lead groups without steamrolling; negotiate win‑wins; energize a room on purpose.";
  return "command attention when needed, tailor messages to diverse audiences, and inspire action.";
}
function charismaDesc(s) {
  const ec = eyeContact(s).toFixed(1);
  const ret = Math.round(retention(s));
  const nf = Math.round(newFriends(s));
  const names = Math.round(namesRemembered(s));
  return [
    `You ${charismaFeatText(s)}`,
    `Numbers: comfortable eye contact ≈ ${ec} s • 3‑min talk retention ≈ ${ret}% • new genuine contacts at a 20‑person meetup ≈ ${nf} • names remembered after intros ≈ ${names}`
  ].join(' ');
}

/** ---------- Exports ---------- */
export const statDefs = {
  STR: { name:"Strength", detail: strengthDesc },
  DEX: { name:"Dexterity", detail: dexterityDesc },
  CON: { name:"Constitution", detail: constitutionDesc },
  INT: { name:"Intelligence", detail: intelligenceDesc },
  WIS: { name:"Wisdom (EQ)", detail: wisdomDesc },
  CHA: { name:"Charisma", detail: charismaDesc },
};
export const statOrder = ["STR","DEX","CON","INT","WIS","CHA"];

export function generateScale(statKey) {
  const stat = statDefs[statKey];
  const rows = [];
  for (let s=1; s<=25; s++) rows.push({ score:s, title: titles(s), desc: stat.detail(s) });
  return rows;
}
