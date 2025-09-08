// github.js — GitHub Contents API sync (static, no server)
import { $, setCookie, getCookie, toBase64, fromBase64 } from './util.js';
import { gatherState, applyState } from './storage.js';

const GH_COOKIE = "dnd_irl_gh";

function saveGhCookie(obj) { setCookie(GH_COOKIE, JSON.stringify(obj)); }
function readGhCookie() {
  const v = getCookie(GH_COOKIE);
  if (!v) return {};
  try { return JSON.parse(v); } catch { return {}; }
}

async function ghFetch(token, url, opts={}) {
  const res = await fetch(url, {
    ...opts,
    headers: {
      "Authorization": `Bearer ${token}`,
      "Accept": "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      ...(opts.headers||{})
    }
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GitHub ${res.status}: ${text}`);
  }
  return res.json();
}

async function getFileIfExists(token, owner, repo, path, ref) {
  try {
    const url = `https://api.github.com/repos/${owner}/${repo}/contents/${encodeURIComponent(path)}${ref?`?ref=${encodeURIComponent(ref)}`:''}`;
    return await ghFetch(token, url);
  } catch {
    return null;
  }
}

export function initGitHubSync() {
  const ghToken = $("#ghToken");
  const ghOwner = $("#ghOwner");
  const ghRepo = $("#ghRepo");
  const ghBranch = $("#ghBranch");
  const ghPath = $("#ghPath");

  // hydrate from cookie if present
  const cfg = readGhCookie();
  if (cfg.token) ghToken.value = cfg.token;
  if (cfg.owner) ghOwner.value = cfg.owner;
  if (cfg.repo) ghRepo.value = cfg.repo;
  if (cfg.branch) ghBranch.value = cfg.branch;
  if (cfg.path) ghPath.value = cfg.path;

  $("#btnSaveGitHub").addEventListener('click', async () => {
    const token = ghToken.value.trim();
    const owner = ghOwner.value.trim();
    const repo = ghRepo.value.trim();
    const branch = ghBranch.value.trim() || "main";
    const path = ghPath.value.trim() || "data/sheet.json";
    if (!token || !owner || !repo) return alert("Fill in token, owner, and repo.");
    saveGhCookie({ token, owner, repo, branch, path });

    const contentObj = gatherState();
    const content = JSON.stringify(contentObj, null, 2);
    const existing = await getFileIfExists(token, owner, repo, path, branch);
    const body = {
      message: `chore: update IRL sheet ${new Date().toISOString()}`,
      content: toBase64(content),
      branch
    };
    if (existing?.sha) body.sha = existing.sha;

    try {
      const url = `https://api.github.com/repos/${owner}/${repo}/contents/${encodeURIComponent(path)}`;
      const res = await ghFetch(token, url, {
        method: "PUT",
        body: JSON.stringify(body)
      });
      alert("Saved to GitHub ✔\n" + (res.content && res.content.path ? res.content.path : ""));
    } catch (err) {
      alert("GitHub save failed:\n" + err.message);
    }
  });

  $("#btnLoadGitHub").addEventListener('click', async () => {
    const token = ghToken.value.trim();
    const owner = ghOwner.value.trim();
    const repo = ghRepo.value.trim();
    const branch = ghBranch.value.trim() || "main";
    const path = ghPath.value.trim() || "data/sheet.json";
    if (!token || !owner || !repo) return alert("Fill in token, owner, and repo.");
    saveGhCookie({ token, owner, repo, branch, path });
    try {
      const file = await getFileIfExists(token, owner, repo, path, branch);
      if (!file?.content) throw new Error("File not found or empty.");
      const text = fromBase64(file.content);
      const data = JSON.parse(text);
      applyState(data);
      alert("Loaded from GitHub ✔");
    } catch (err) {
      alert("GitHub load failed:\n" + err.message);
    }
  });
}
