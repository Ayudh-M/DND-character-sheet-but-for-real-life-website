// main.js — entry point
import { initUI } from './ui.js';
import { initPortrait } from './portrait.js';
import { initLocalSave, initExportImport } from './storage.js';
import { initGitHubSync } from './github.js';

window.addEventListener('DOMContentLoaded', () => {
  initUI();
  initPortrait();
  initLocalSave();
  initExportImport();
  initGitHubSync();
  console.log("D&D IRL Character Sheet (Modular) loaded.");
});
