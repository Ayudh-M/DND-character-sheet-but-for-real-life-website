# D&D IRL Character Sheet — Modular Version

This is the **modular** edition of the static site. Files are split by concern:

```
/
├─ index.html         # Minimal HTML shell
├─ styles.css         # Visual styles (no build step)
└─ js/
   ├─ util.js         # Helpers (DOM, cookies, math)
   ├─ stats.js        # Stat descriptors & scales
   ├─ ui.js           # Card UI & modal
   ├─ portrait.js     # Image upload/preview
   ├─ storage.js      # Local save, export/import, apply/gather state
   ├─ github.js       # GitHub Contents API sync (no server)
   └─ main.js         # Entry point
```

Host on GitHub Pages exactly like the single-file version — no build process needed. The scripts use **ES modules**, so `type="module"` is set in `index.html`.
