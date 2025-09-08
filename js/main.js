// main.js — entry point (no GitHub sync)
import { initUI } from './ui.js';
import { initPortrait } from './portrait.js';
import { initLocalSave, initExportImport } from './storage.js';

window.addEventListener('DOMContentLoaded', () => {
  initUI();
  initPortrait();
  initLocalSave();
  initExportImport();
  console.log("D&D IRL Character Sheet (Modular v2) loaded.");
});
