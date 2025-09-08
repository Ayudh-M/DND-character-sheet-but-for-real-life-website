// ui.js — builds stat cards & modal
import { $, clamp, modFromScore } from './util.js';
import { statDefs, statOrder, titles, generateScale } from './stats.js';

export function initUI() {
  const wrapper = $('#statsGrid');

  function createStatCard(statKey) {
    const stat = statDefs[statKey];
    const card = document.createElement('div');
    card.className = "card";

    card.innerHTML = `
      <div class="flex items-start justify-between gap-2 mb-2">
        <div>
          <div class="stat-label">${statKey}</div>
          <h3 class="text-xl font-semibold">${stat.name}</h3>
        </div>
        <div class="text-right">
          <div class="badge mono" title="D&D‑style modifier">MOD <span id="${statKey}-mod">+0</span></div>
        </div>
      </div>

      <div class="grid grid-cols-3 gap-3 items-center mb-3">
        <input id="${statKey}-range" type="range" min="1" max="25" value="10" class="col-span-2 w-full">
        <input id="${statKey}-num" type="number" min="1" max="25" value="10" class="input">
      </div>

      <div class="text-sm muted mb-2"><span id="${statKey}-title" class="font-medium text-slate-800"></span></div>
      <p id="${statKey}-desc" class="kpi"></p>

      <div class="mt-3">
        <button data-scale="${statKey}" class="btn btn-ghost">View full 1–25 scale</button>
      </div>
    `;

    wrapper.appendChild(card);

    const range = $(`#${statKey}-range`, card);
    const num = $(`#${statKey}-num`, card);
    const mod = $(`#${statKey}-mod`, card);
    const title = $(`#${statKey}-title`, card);
    const desc = $(`#${statKey}-desc`, card);

    function render(val) {
      val = clamp(parseInt(val||10,10),1,25);
      range.value = val;
      num.value = val;
      mod.textContent = (modFromScore(val)>=0?'+':'') + modFromScore(val);
      title.textContent = `${titles(val)} (${val})`;
      desc.textContent = stat.detail(val);
    }

    range.addEventListener('input', e => render(e.target.value));
    num.addEventListener('input', e => render(e.target.value));
    render(10);
  }

  statOrder.forEach(createStatCard);

  // Modal wiring
  const modal = $("#modalScale");
  const scaleTitle = $("#scaleTitle");
  const scaleBody = $("#scaleBody");
  $("#closeScale").addEventListener('click', () => modal.close());
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-scale]');
    if (!btn) return;
    const key = btn.getAttribute('data-scale');
    const rows = generateScale(key);
    scaleTitle.textContent = `${statDefs[key].name} — 1 to 25`;
    scaleBody.innerHTML = rows.map(r =>
      `<tr><td class="mono">${r.score}</td><td>${r.title}</td><td class="text-slate-700">${r.desc}</td></tr>`
    ).join('');
    modal.showModal();
  });
}
