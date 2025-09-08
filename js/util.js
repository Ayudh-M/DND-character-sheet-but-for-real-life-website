// util.js — tiny helpers
export const $ = (sel, el=document) => el.querySelector(sel);
export const $$ = (sel, el=document) => [...el.querySelectorAll(sel)];

export function setCookie(name, value, days=365) {
  const d = new Date();
  d.setTime(d.getTime() + (days*24*60*60*1000));
  const expires = "expires="+ d.toUTCString();
  document.cookie = name + "=" + encodeURIComponent(value) + ";" + expires + ";path=/;SameSite=Lax";
}
export function getCookie(name) {
  const cname = name + "=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(';');
  for (let c of ca) {
    while (c.charAt(0) == ' ') c = c.substring(1);
    if (c.indexOf(cname) == 0) return c.substring(cname.length, c.length);
  }
  return "";
}

export const toBase64 = (str) => btoa(unescape(encodeURIComponent(str)));
export const fromBase64 = (b64) => decodeURIComponent(escape(atob(b64)));
export function bytesToBase64(bytes) {
  let binary = '';
  const len = bytes.length;
  for (let i = 0; i < len; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

export function fmtTime(sec) {
  const m = Math.floor(sec/60), s = Math.round(sec%60);
  return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
}

export const clamp = (n, min, max) => Math.min(max, Math.max(min, n));
export const modFromScore = (s) => Math.floor((s - 10) / 2);

// math helpers
export function expThrough(x1,y1,x2,y2) {
  const b = Math.pow(y2/y1, 1/(x2-x1));
  const a = y1 / Math.pow(b, x1);
  return (x) => a * Math.pow(b, x);
}
export function piecewise(anchors) {
  return (x) => {
    x = clamp(x, anchors[0].x, anchors[anchors.length-1].x);
    for (let i=0; i<anchors.length-1; i++) {
      const a = anchors[i], b = anchors[i+1];
      if (x <= b.x) {
        const p = (x - a.x) / (b.x - a.x);
        return a.y + p*(b.y - a.y);
      }
    }
    return anchors[anchors.length-1].y;
  };
}
