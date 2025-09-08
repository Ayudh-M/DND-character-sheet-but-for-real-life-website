// ui.js — builds stat cards & modal from loaded content
import { $, clamp, modFromScore } from './util.js';
import { statOrder } from './stats.js';
import { getStatName, getTitle, getLevel, getScale } from './content.js';

export function initUI() {
  const wrapper = $('#statsGrid');
  if (!wrapper) return;

  function createStatCard(key) {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <div class="flex items-start justify-between gap-2 mb-2">
        <div>
          <div class="stat-label">${key}</div>
          <h3 class="text-xl font-semibold">${getStatName(key)}</h3>
        </div>
        <div class="text-right">
          <div class="badge mono" title="D&D-style modifier">MOD <span id="${key}-mod">+0</span></div>
        </div>
      </div>
      <div class="grid grid-cols-3 gap-3 items-center mb-3">
        <input id="${key}-range" type="range" min="1" max="25" value="10" class="col-span-2 w-full">
        <input id="${key}-num" type="number" min="1" max="25" value="10" class="input">
      </div>
      <div class="text-sm muted mb-2"><span id="${key}-title" class="font-medium text-slate-800"></span></div>
      <p id="${key}-desc" class="kpi"></p>
      <div class="mt-3">
        <button data-scale="${key}" class="btn btn-ghost">View full 1–25 scale</button>
      </div>
    `;
    wrapper.appendChild(card);

    const range = $(`#${key}-range`, card);
    const num = $(`#${key}-num`, card);
    const mod = $(`#${key}-mod`, card);
    const title = $(`#${key}-title`, card);
    const desc = $(`#${key}-desc`, card);

    function render(val) {
      val = clamp(parseInt(val || 10, 10), 1, 25);
      range.value = val;
      num.value = val;
      const m = modFromScore(val);
      mod.textContent = (m >= 0 ? '+' : '') + m;
      title.textContent = `${getTitle(val)} (${val})`;
      const lvl = getLevel(key, val);
      desc.textContent = '';
      if (lvl) {
        desc.textContent = lvl.human;
        if (lvl.metrics) {
          const br = document.createElement('br');
          const span = document.createElement('span');
          span.className = 'muted';
          span.textContent = `Numbers: ${lvl.metrics}`;
          desc.append(br, span);
        }
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
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-scale]');
    if (!btn) return;
    const key = btn.getAttribute('data-scale');
    const rows = getScale(key);
    scaleTitle.textContent = `${getStatName(key)} — 1 to 25`;
    scaleBody.innerHTML = '';
    for (const r of rows) {
      const tr = document.createElement('tr');
      const tdScore = document.createElement('td');
      tdScore.className = 'mono';
      tdScore.textContent = r.score;
      const tdTitle = document.createElement('td');
      tdTitle.textContent = r.title;
      const tdDesc = document.createElement('td');
      tdDesc.className = 'text-slate-700';
      tdDesc.textContent = r.human;
      const tdMetrics = document.createElement('td');
      tdMetrics.className = 'text-slate-700 muted';
      tdMetrics.textContent = r.metrics;
      tr.append(tdScore, tdTitle, tdDesc, tdMetrics);
      scaleBody.appendChild(tr);
    }
    modal.showModal();
  });
}
