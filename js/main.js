// main.js — boot sequence
import { loadContent } from './content.js';
import { initUI } from './ui.js';
import { initPortrait } from './portrait.js';
import { initLocalSave, initExportImport } from './storage.js';

window.addEventListener('DOMContentLoaded', async () => {
  await loadContent('./content/stats.json');
  initUI();
  initPortrait();
  initLocalSave();
  initExportImport();
  console.log('D&D IRL Character Sheet loaded.');
});
