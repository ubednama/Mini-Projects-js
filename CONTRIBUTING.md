# Contributing

Short guide to adding a new mini-project to this collection. The project deliberately stays vanilla — no build step, no framework, no dependencies.

## Prerequisites

- A terminal aesthetic that fits the rest of the collection (dark background, JetBrains Mono, accent green `#00ff00`).
- The new project must work on a static host (no Node runtime needed at request time, unless it uses `api/` serverless functions).

## 1. Create the folder

Use **kebab-case** (lowercase, hyphen-separated). Folder name doubles as the URL slug.

```
my-new-thing/
├── index.html
├── script.js          # or game.js, etc — be consistent inside the project
└── style.css          # optional; many projects only need global.css
```

## 2. The `index.html` skeleton

Every project page should look like this. Copy from any existing project (e.g. `calculator/index.html`) and adjust.

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>My New Thing</title>
    <meta name="description" content="One-line description" />

    <!-- Open Graph -->
    <meta property="og:title" content="My New Thing | Mini Projects JS" />
    <meta property="og:description" content="One-line description" />
    <meta property="og:type" content="website" />
    <meta property="og:image" content="../og-image.svg" />
    <meta name="twitter:card" content="summary_large_image" />

    <!-- Icons / PWA -->
    <link rel="icon" href="../favicon.svg" type="image/svg+xml" />
    <link rel="manifest" href="/manifest.webmanifest" />
    <meta name="theme-color" content="#000000" />

    <!-- Styles -->
    <link rel="stylesheet" href="../global.css" />
    <link rel="stylesheet" href="style.css" />
  </head>
  <body class="game-body">
    <a href="../" class="top-right-back">← Back</a>

    <main class="center-container">
      <header class="app-header">
        <h1 class="app-title">My New Thing</h1>
        <p class="app-desc">One-line tagline.</p>
      </header>

      <!-- your UI here -->

      <div id="toast-container" class="toast-container"></div>

      <footer class="footer">
        Built with ❤️ by
        <a href="https://github.com/ubednama" target="_blank">ubednama</a>
      </footer>
    </main>

    <script src="../terminal-utils.js"></script>
    <script src="script.js"></script>
  </body>
</html>
```

**Hard rules:**
- Back button uses `href="../"` (not `../index.html`) — `cleanUrls` in `vercel.json` handles the rest.
- Always load `../terminal-utils.js` before your own script.
- Always include a `#toast-container` somewhere in `<body>` (toasts auto-create one if missing, but having it placed lets you control where it sits).

## 3. Use the shared utilities

`terminal-utils.js` exposes `window.TerminalUtils` with these helpers — prefer them over re-implementing:

| Utility | Use for |
|---|---|
| `TerminalUtils.showToast(msg, type)` | Notifications. `type` is `info` / `success` / `error` / `warning`. |
| `TerminalUtils.copyToClipboard(text, onSuccess, onError)` | Clipboard with graceful `execCommand` fallback. |
| `TerminalUtils.onEnter(input, handler)` | Hook Enter key on a single input. |
| `new TerminalUtils.TerminalUI(name)` | Optional in-app terminal log panel (used by calculator, tic-tac-toe, etc). |

Never re-implement `showToast` locally — the shared one auto-dismisses and styles consistently.

## 4. Style consistency

`global.css` provides the base layer (variables, typography, `.btn-primary`, `.btn-secondary`, `.app-header`, `.app-title`, `.spinner`, `.toast`, etc). Your `style.css` should only add layout-specific tweaks.

Use the design tokens — never hardcode colors:

```css
color: var(--text-primary);
background: var(--bg-card);
border-color: var(--accent-color);
```

If you find yourself copying a pattern from another project's CSS, consider whether it belongs in `global.css` instead.

## 5. Wire it into the hub

Three places to update when adding a project:

### a. Root `index.html` (hub page)

Add a `<div class="project-item">` in the appropriate `[CATEGORY]` block:

```html
<div class="project-item">
  <a href="./my-new-thing/" class="project-link">
    <span class="project-icon">🆕</span>
    <span class="project-name">my-new-thing</span>
    <span class="project-desc">// short description</span>
  </a>
</div>
```

Bump the `⚡ N projects loaded` count in the footer.

### b. `README.md`

Add to the relevant category section. Bump the count in the intro paragraph and the category header (`### 🛠️ Utility Apps (N)`).

### c. `PORTFOLIO.md`

Append a new YAML block following the existing format — title, slug, category, tagline, description, tech, highlights, live + source links, screenshot path.

## 6. Screenshots

Drop a 1280×800 PNG at `screenshots/<slug>.png`. The portfolio integration uses these.

## 7. Validation before pushing

- `node --check <your-script>.js` — CI runs this on every JS file on push.
- Open the page locally (e.g. `python -m http.server 8000`) and click through the feature.
- Test on a narrow viewport (≤640px) — every project must work on mobile.
- Check that the back button returns to `/`, not to a 404.

## 8. Commit style

Follow the existing pattern:

- `feat: add <project-name>` for a new project
- `fix(<project>): <what>` for bug fixes
- `chore: ...` for repo-level changes
- `docs: ...` for README/PORTFOLIO changes

Commits should be authored by you only — no `Co-Authored-By` trailers.

## Project conventions worth knowing

- **localStorage keys** are namespaced: `<project>-<purpose>-v1` (e.g. `stopwatch-state-v1`). Bump the `-v1` if the schema changes incompatibly.
- **Service worker** (`sw.js`) caches the same-origin shell. Bump `CACHE_NAME` whenever you change cached assets, otherwise returning visitors see stale files until their SW updates.
- **API keys** never go in client JS. If your project needs one, add a serverless function under `api/` (see `api/weather.js` for the pattern) and store the key in Vercel env vars.
- **No `eval()`** — the calculator was rewritten to drop it; do the same if you're tempted.
- **No `innerHTML`** for content that includes data from APIs or user input. Use `textContent`, `replaceChildren()`, or the `el()` builder from `dictionary-app/script.js`.
