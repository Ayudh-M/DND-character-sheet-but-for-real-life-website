// content.js — fetches and provides stat content
let data = { titles: [], stats: {} };

export async function loadContent(url) {
  try {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error(res.status);
    data = await res.json();
  } catch (err) {
    alert('Failed to load content JSON...');
    console.error(err);
    data = { titles: Array.from({ length: 25 }, (_, i) => `Level ${i+1}`), stats: {} };
  }
}

export const getStatName = (key) => data.stats?.[key]?.name || key;
export const getTitle = (score) => data.titles?.[score-1] || `Level ${score}`;
export function getLevel(key, score) {
  return data.stats?.[key]?.levels?.[score] || null;
}
export function getScale(key) {
  const rows = [];
  for (let s=1; s<=25; s++) {
    const lvl = getLevel(key, s);
    rows.push({
      score: s,
      title: getTitle(s),
      human: lvl?.human || 'No content for this level.',
      metrics: lvl?.metrics || ''
    });
  }
  return rows;
}
