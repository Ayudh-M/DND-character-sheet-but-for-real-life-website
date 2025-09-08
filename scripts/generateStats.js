const fs = require('fs');

const titles = [
  "Pitiful","Feeble","Very Weak","Frail","Weak","Below Average","Meager","Middling","Ordinary","Average","Able","Capable","Fit","Sturdy","Strong","Very Strong","Mighty","Elite","Exceptional","World-Class","Phenomenal","Legendary","Mythic","Titanic","Herculean"
];

function band(level){
  if(level<=5) return 0;
  if(level<=10) return 1;
  if(level<=15) return 2;
  if(level<=20) return 3;
  return 4;
}

function buildStat(name, animals, humanTemplates, metricsFn){
  const levels = {};
  for(let s=1;s<=25;s++){
    const a = animals[s-1];
    const human = humanTemplates[band(s)].replace('{animal}', a);
    levels[s] = {
      title: titles[s-1],
      human,
      metrics: metricsFn(s)
    };
  }
  return { name, levels };
}

// Strength
const strAnimals = [
  'kitten','puppy','housecat','beagle','goat','sheep','adult human','athletic human','laborer','soldier','farmer','weightlifter','lumberjack','football lineman','powerlifter','strongman competitor','ox','horse','black bear','grizzly bear','gorilla','rhino','elephant','hippopotamus','whale'
];
const strTemplates = [
  'You show the frailty of a {animal}, lifting only light objects.',
  'Like a {animal}, you handle everyday loads without strain.',
  'You have the power of a {animal}, moving heavy items when needed.',
  'Your muscles rival a {animal}, enabling feats of strength.',
  'You exhibit legendary might like a {animal}, bending metal and hoisting massive weights.'
];
function strMetrics(s){
  const dead = 20 + s*12;
  const press = 5 + s*6;
  const push = Math.round(s*3);
  return `1RM deadlift ≈ ${dead} kg • Overhead press ≈ ${press} kg • Push-ups ≈ ${push}`;
}

// Dexterity
const dexAnimals = [
  'sloth','cow','pig','turtle','dog','goat','sheep','cat','otter','raccoon','monkey','lemur','squirrel','panther','cougar','cheetah','octopus','spider','housefly','dragonfly','swallow','falcon','hummingbird','martin','swift'
];
const dexTemplates = [
  'You move with the clumsiness of a {animal}, dropping and stumbling.',
  'Like a {animal}, you manage basic coordination tasks.',
  'You match a {animal} for nimble movement and fine control.',
  'Your agility mirrors a {animal}, weaving through obstacles gracefully.',
  'You display breathtaking acrobatics like a {animal}, reacting instantly.'
];
function dexMetrics(s){
  const react = Math.round(450 - s*12);
  const balance = 1 + s*10;
  const wpm = 10 + s*6;
  return `Reaction time ≈ ${react} ms • One-foot balance ≈ ${balance} s • Typing ≈ ${wpm} WPM`;
}

// Constitution
const conAnimals = [
  'mayfly','hamster','housecat','rabbit','dog','goat','pig','office worker','hiker','soldier','horse','camel','wolf','husky','marathoner','triathlete','ironman competitor','sherpa','ultra runner','camel caravan','whale','elephant','tortoise','greenland shark','mythic titan'
];
const conTemplates = [
  'You tire quickly like a {animal}, needing frequent rests.',
  'You endure daily effort like a {animal}, handling moderate exertion.',
  'Your stamina matches a {animal}, shrugging off long activity.',
  'You endure hardship like a {animal}, resisting fatigue and illness.',
  'You show near-endless endurance like a {animal}, thriving under extreme strain.'
];
function conMetrics(s){
  const run = (45 - s*1.2).toFixed(1);
  const plank = s*15;
  const rhr = 100 - s*2;
  return `5k run ≈ ${run} min • Plank ≈ ${plank} s • Resting HR ≈ ${rhr} bpm`;
}

// Intelligence
const intAnimals = [
  'jellyfish','clam','goldfish','chicken','dog','pig','chimp','human child','teen student','college grad','engineer','scientist','researcher','doctor','professor','polymath','genius inventor','renowned scientist','Nobel laureate','Einstein-level thinker','cutting-edge AI researcher','unified theory creator','global strategist','philosopher king','legendary sage'
];
const intTemplates = [
  'You reason on the level of a {animal}, grasping only simple ideas.',
  'Like a {animal}, you learn and solve everyday problems.',
  'Your mind matches a {animal}, analyzing and planning with skill.',
  'You think with the brilliance of a {animal}, synthesizing complex concepts.',
  'You display world-shaping intellect like a {animal}, advancing human knowledge.'
];
function intMetrics(s){
  const words = s*2;
  const puzzle = 5 + s*3;
  const read = 100 + s*8;
  return `New facts/day ≈ ${words} • Puzzle percentile ≈ ${puzzle}% • Reading ≈ ${read} WPM`;
}

// Wisdom
const wisAnimals = [
  'mole','opossum','pigeon','cat','dog','horse','elephant','shepherd','counselor','mediator','therapist','village elder','safari guide','monk','philosopher','guru','sage','prophet','wise judge','spiritual leader','enlightened master','mythic oracle','legendary seer','planetary counselor','transcendent being'
];
const wisTemplates = [
  'You notice little, like a {animal}, and misread situations.',
  'Like a {animal}, you read basic cues and make sound choices.',
  'Your insight equals a {animal}, perceiving motives and patterns.',
  'You show deep understanding like a {animal}, guiding others wisely.',
  'You exhibit profound awareness like a {animal}, nearly prophetic.'
];
function wisMetrics(s){
  const mindful = s*2;
  const notice = Math.max(1, Math.round(30 - s));
  return `Mindful minutes/day ≈ ${mindful} • Notice change ≈ ${notice} s`;
}

// Charisma
const chaAnimals = [
  'slug','toad','opossum','housecat','friendly dog','pony','orator','singer','comedian','teacher','leader','politician','activist','tv host','celebrity','influencer','stage actor','pop star','cult leader','national leader','world diplomat','revered icon','legendary performer','global figure','visionary hero'
];
const chaTemplates = [
  'You repel attention like a {animal}, struggling to hold a conversation.',
  'Like a {animal}, you chat comfortably with friends.',
  'You charm others like a {animal}, winning crowds.',
  'Your presence matches a {animal}, commanding rooms effortlessly.',
  'You inspire masses like a {animal}, shaping movements and history.'
];
function chaMetrics(s){
  const audience = s*4;
  const persuade = 5 + s*3;
  return `Comfortable audience ≈ ${audience} people • Persuasion success ≈ ${persuade}%`;
}

const data = {
  version: 1,
  titles,
  stats: {
    STR: buildStat('Strength', strAnimals, strTemplates, strMetrics),
    DEX: buildStat('Dexterity', dexAnimals, dexTemplates, dexMetrics),
    CON: buildStat('Constitution', conAnimals, conTemplates, conMetrics),
    INT: buildStat('Intelligence', intAnimals, intTemplates, intMetrics),
    WIS: buildStat('Wisdom (EQ)', wisAnimals, wisTemplates, wisMetrics),
    CHA: buildStat('Charisma', chaAnimals, chaTemplates, chaMetrics)
  }
};

fs.writeFileSync('content/stats.json', JSON.stringify(data, null, 2));
