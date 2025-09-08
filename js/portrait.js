// portrait.js — image upload/preview storage
import { $ } from './util.js';

let portraitDataURL = "";
export const getPortrait = () => portraitDataURL;
export function setPortrait(dataURL) {
  portraitDataURL = dataURL || "";
  const preview = $("#portraitPreview");
  preview.src = portraitDataURL || "";
  if (!portraitDataURL) preview.style.backgroundImage = "";
}

export function initPortrait() {
  const input = $("#portraitFile");
  $("#btnRemovePortrait").addEventListener('click', () => setPortrait(""));
  input.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPortrait(reader.result);
    reader.readAsDataURL(file);
  });
}
