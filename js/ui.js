// ui.js — builds stat cards & modal from loaded content
// ui.js — builds stat cards & modal from loaded content
import { $, clamp, modFromScore } from './util.js';
import { statOrder } from './stats.js';
import { getStatName, getTitle, getLevel, getScale } from './content.js';
import { statOrder } from './stats.js';
import { getStatName, getTitle, getLevel, getScale } from './content.js';

export function initUI() {
  const wrapper = $('#statsGrid');

  function createStatCard(key) {
  function createStatCard(key) {
    const card = document.createElement('div');
    card.className = 'card';
    card.className = 'card';
    card.innerHTML = `
      <div class="flex items-start justify-between gap-2 mb-2">
        <div>
          <div class="stat-label">${key}</div>
          <h3 class="text-xl font-semibold">${getStatName(key)}</h3>
          <div class="stat-label">${key}</div>
          <h3 class="text-xl font-semibold">${getStatName(key)}</h3>
        </div>
        <div class="text-right">
          <div class="badge mono" title="D&D-style modifier">MOD <span id="${key}-mod">+0</span></div>
          <div class="badge mono" title="D&D-style modifier">MOD <span id="${key}-mod">+0</span></div>
        </div>
      </div>
      <div class="grid grid-cols-3 gap-3 items-center mb-3">
        <input id="${key}-range" type="range" min="1" max="25" value="10" class="col-span-2 w-full">
        <input id="${key}-num" type="number" min="1" max="25" value="10" class="input">
        <input id="${key}-range" type="range" min="1" max="25" value="10" class="col-span-2 w-full">
        <input id="${key}-num" type="number" min="1" max="25" value="10" class="input">
      </div>
      <div class="text-sm muted mb-2"><span id="${key}-title" class="font-medium text-slate-800"></span></div>
      <p id="${key}-desc" class="kpi"></p>
      <div class="text-sm muted mb-2"><span id="${key}-title" class="font-medium text-slate-800"></span></div>
      <p id="${key}-desc" class="kpi"></p>
      <div class="mt-3">
        <button data-scale="${key}" class="btn btn-ghost">View full 1–25 scale</button>
        <button data-scale="${key}" class="btn btn-ghost">View full 1–25 scale</button>
      </div>
    `;
    wrapper.appendChild(card);

    const range = $(`#${key}-range`, card);
    const num = $(`#${key}-num`, card);
    const mod = $(`#${key}-mod`, card);
    const title = $(`#${key}-title`, card);
    const desc = $(`#${key}-desc`, card);
    const range = $(`#${key}-range`, card);
    const num = $(`#${key}-num`, card);
    const mod = $(`#${key}-mod`, card);
    const title = $(`#${key}-title`, card);
    const desc = $(`#${key}-desc`, card);

    function render(val) {
      val = clamp(parseInt(val || 10, 10), 1, 25);
      val = clamp(parseInt(val || 10, 10), 1, 25);
      range.value = val;
      num.value = val;
      const m = modFromScore(val);
      mod.textContent = (m >= 0 ? '+' : '') + m;
      title.textContent = `${getTitle(val)} (${val})`;
      const lvl = getLevel(key, val);
      if (lvl) {
        desc.innerHTML = `${lvl.human}<br><span class="muted">Numbers: ${lvl.metrics}</span>`;
      } else {
        desc.textContent = 'No content for this level.';
      }
      const m = modFromScore(val);
      mod.textContent = (m >= 0 ? '+' : '') + m;
      title.textContent = `${getTitle(val)} (${val})`;
      const lvl = getLevel(key, val);
      if (lvl) {
        desc.innerHTML = `${lvl.human}<br><span class="muted">Numbers: ${lvl.metrics}</span>`;
      } else {
        desc.textContent = 'No content for this level.';
      }
    }

    range.addEventListener('input', e => render(e.target.value));
    num.addEventListener('input', e => render(e.target.value));
    render(10);
  }

  statOrder.forEach(createStatCard);

  const modal = $('#modalScale');
  const scaleTitle = $('#scaleTitle');
  const scaleBody = $('#scaleBody');
  $('#closeScale').addEventListener('click', () => modal.close());
  const modal = $('#modalScale');
  const scaleTitle = $('#scaleTitle');
  const scaleBody = $('#scaleBody');
  $('#closeScale').addEventListener('click', () => modal.close());
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-scale]');
    if (!btn) return;
    const key = btn.getAttribute('data-scale');
    const rows = getScale(key);
    scaleTitle.textContent = `${getStatName(key)} — 1 to 25`;
    const rows = getScale(key);
    scaleTitle.textContent = `${getStatName(key)} — 1 to 25`;
    scaleBody.innerHTML = rows.map(r =>
      `<tr><td class="mono">${r.score}</td><td>${r.title}</td><td class="text-slate-700">${r.human}</td><td class="text-slate-700 muted">${r.metrics}</td></tr>`
    ).join('');
    modal.showModal();
  });
}
