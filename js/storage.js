// storage.js — local save, export/import, and state apply/gather
import { $, setCookie, getCookie } from './util.js';
import { statOrder } from './stats.js';
import { getPortrait, setPortrait } from './portrait.js';

const LS_KEY = "dnd_irl_sheet_v2";
const COOKIE_KEY = "dnd_irl_id";

export function gatherState() {
  const data = {
    sheetName: $("#sheetName").value || "Unnamed Sheet",
    persona: $("#persona").value || "",
    notes: $("#notes").value || "",
    stats: Object.fromEntries(statOrder.map(key => [
      key,
      { score: parseInt($(`#${key}-num`).value,10), mod: Math.floor((parseInt($(`#${key}-num`).value,10) - 10)/2) }
    ])),
    portraitDataURL: getPortrait(),
    updatedAt: new Date().toISOString(),
    version: 2
  };
  return data;
}

export function applyState(data) {
  $("#sheetName").value = data.sheetName || "";
  $("#persona").value = data.persona || "";
  $("#notes").value = data.notes || "";
  setPortrait(data.portraitDataURL || "");
  for (const key of statOrder) {
    const sc = data.stats?.[key]?.score ?? 10;
    $(`#${key}-num`).value = sc;
    $(`#${key}-range`).value = sc;
    $(`#${key}-num`).dispatchEvent(new Event('input'));
  }
}

export function initLocalSave() {
  $("#btnSaveLocal").addEventListener('click', () => {
    const data = gatherState();
    localStorage.setItem(LS_KEY, JSON.stringify(data));
    const id = getCookie(COOKIE_KEY) || Math.random().toString(36).slice(2);
    setCookie(COOKIE_KEY, id, 365);
    alert("Saved locally ✔");
  });

  // Load on startup if present
  const raw = localStorage.getItem(LS_KEY);
  if (raw) {
    try { applyState(JSON.parse(raw)); } catch {}
  }
}

export function initExportImport() {
  $("#btnExport").addEventListener('click', () => {
    const data = gatherState();
    const blob = new Blob([JSON.stringify(data, null, 2)], {type: "application/json"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const safeName = (data.sheetName || "sheet").replace(/[^a-z0-9-_]+/gi,'_');
    a.download = `${safeName}.json`;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  });

  $("#fileImport").addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const text = await file.text();
    try {
      const data = JSON.parse(text);
      applyState(data);
      alert("Imported ✔");
    } catch {
      alert("Import failed: invalid JSON");
    }
  });
}
