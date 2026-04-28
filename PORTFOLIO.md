# Portfolio Manifest — Mini Projects JS

This document is meant to be handed to a separate Claude Code session to integrate these projects into a portfolio site. It is self-contained — everything needed (titles, slugs, descriptions, tech, highlights, live URLs, source links, screenshot paths) is below.

## Repo facts

- **Source repo:** https://github.com/ubednama/Mini-Projects-js
- **Live deploy:** https://mini-projects-js-five.vercel.app
- **Author:** ubednama (https://github.com/ubednama)
- **Stack:** vanilla HTML / CSS / JavaScript (ES6+), no build step, deployed on Vercel with one serverless function (`api/weather.js`) for the weather proxy.
- **Aesthetic:** retro terminal — JetBrains Mono, dark palette, accent green `#00ff00` on `#000000`.
- **Total:** 17 self-contained projects + a hub page.

URL conventions for every project below:
- **Live:** `https://mini-projects-js-five.vercel.app/<slug>/`
- **Source folder:** `https://github.com/ubednama/Mini-Projects-js/tree/main/<slug>`
- **Screenshot:** `screenshots/<slug>.png` (1280×800 recommended; PNG)

## Umbrella project (for portfolio "collection" entry)

```yaml
title: Mini Projects JS
slug: mini-projects-js
tagline: 17 vanilla-JS apps in a retro terminal aesthetic.
description: |
  A self-contained collection of 17 interactive web apps built with no
  framework, no build step, no dependencies. Hosted as a single static
  site on Vercel with one serverless proxy. Each app is a folder; a hub
  page links them together with a CRT-terminal visual identity.
  Doubles as a personal sandbox for showcasing a wide range of skills:
  game AI, canvas drawing, secure RNG, geolocation, PWA, accessibility.
tech: [HTML5, CSS3, JavaScript ES6+, Vercel Serverless, PWA, Service Worker]
highlights:
  - PWA-installable with offline shell caching (sw.js + manifest.webmanifest)
  - GitHub Actions CI runs node --check on every JS file on push
  - Open Graph + Twitter Card meta on every project page
  - Single shared utilities module (TerminalUtils) for toast / clipboard / Enter handling
  - Deployed at <https://mini-projects-js-five.vercel.app>
links:
  live: https://mini-projects-js-five.vercel.app
  source: https://github.com/ubednama/Mini-Projects-js
screenshot: screenshots/hub.png
```

---

## Individual projects

### 1. Tic-Tac-Toe

```yaml
title: Tic-Tac-Toe
slug: tic-tac-toe
category: Games & Interactive
tagline: Classic 3×3 with an unbeatable minimax AI.
description: |
  Player-vs-Player and Player-vs-Computer modes. Three difficulty levels:
  Easy (random), Medium (heuristic — win > block > center > corner),
  Hard (full minimax search — provably unbeatable). Logs every move in
  chess-style A1–C3 notation to an in-app terminal.
tech: [JavaScript, Game AI, Minimax]
highlights:
  - Full minimax with depth-aware scoring (faster wins prioritized over slower wins)
  - Random tiebreak among equally-valued moves so the AI feels less robotic
  - Three difficulty modes for progressive challenge
links:
  live: https://mini-projects-js-five.vercel.app/tic-tac-toe/
  source: https://github.com/ubednama/Mini-Projects-js/tree/main/tic-tac-toe
screenshot: screenshots/tic-tac-toe.png
```

### 2. Rock Paper Scissors

```yaml
title: Rock Paper Scissors
slug: rock-paper-scissors
category: Games & Interactive
tagline: The classic, with score tracking.
description: |
  Tap your move, the computer picks at random, score updates live. Clean
  input feedback with hover states and result animation.
tech: [JavaScript, DOM, Animation]
highlights:
  - Animated reveal with tactile feedback
  - Persistent score for the session
links:
  live: https://mini-projects-js-five.vercel.app/rock-paper-scissors/
  source: https://github.com/ubednama/Mini-Projects-js/tree/main/rock-paper-scissors
screenshot: screenshots/rock-paper-scissors.png
```

### 3. Circle Game

```yaml
title: Circle Game
slug: circle-game
category: Games & Interactive
tagline: Tap to drop circles, watch them bounce.
description: |
  Click anywhere to spawn a circle with a random color and size. A
  meditative, no-rules toy that demonstrates DOM-based animation and
  pointer event handling.
tech: [JavaScript, DOM, Pointer Events]
highlights:
  - Lightweight DOM-only animation (no canvas)
  - Generative color and size on each tap
links:
  live: https://mini-projects-js-five.vercel.app/circle-game/
  source: https://github.com/ubednama/Mini-Projects-js/tree/main/circle-game
screenshot: screenshots/circle-game.png
```

### 4. Currency Converter

```yaml
title: Currency Converter
slug: currency-converter
category: Utility Apps
tagline: Real-time global currency conversion with persistence.
description: |
  Pulls live exchange rates from the @fawazahmed0/currency-api CDN. Pick
  any pair from a dropdown of 150+ currencies, swap with one click, and
  see flag indicators update. Selections and amount persist across page
  reloads via localStorage.
tech: [JavaScript, Fetch API, localStorage]
highlights:
  - 150+ currencies with country-flag indicators
  - One-click from↔to swap that re-fetches the rate
  - Selections and amount persist via localStorage
  - Safe DOM construction (no innerHTML on API data)
links:
  live: https://mini-projects-js-five.vercel.app/currency-converter/
  source: https://github.com/ubednama/Mini-Projects-js/tree/main/currency-converter
screenshot: screenshots/currency-converter.png
```

### 5. Temperature Converter

```yaml
title: Temperature Converter
slug: temperature-converter
category: Utility Apps
tagline: Convert between Celsius, Fahrenheit, and Kelvin.
description: |
  Type a value in any unit; the other two update instantly. Logs each
  conversion to an in-app terminal panel.
tech: [JavaScript, DOM]
highlights:
  - Bidirectional updates — change any field, the others recompute
  - Terminal-style operation log
links:
  live: https://mini-projects-js-five.vercel.app/temperature-converter/
  source: https://github.com/ubednama/Mini-Projects-js/tree/main/temperature-converter
screenshot: screenshots/temperature-converter.png
```

### 6. Calculator

```yaml
title: Calculator
slug: calculator
category: Utility Apps
tagline: Basic math, full keyboard support, no eval().
description: |
  Standard arithmetic with parentheses and percentage. Notable: replaced
  the original eval()-based evaluator with a hand-rolled recursive
  descent parser that rejects invalid input, division by zero, and
  non-finite results.
tech: [JavaScript, Recursive Descent Parser]
highlights:
  - Custom expression parser — no eval(), no dependencies
  - Full keyboard support (digits, operators, Enter, Backspace, Escape)
  - Division-by-zero and overflow handling
  - In-app terminal logs full expression history
links:
  live: https://mini-projects-js-five.vercel.app/calculator/
  source: https://github.com/ubednama/Mini-Projects-js/tree/main/calculator
screenshot: screenshots/calculator.png
```

### 7. Weather App

```yaml
title: Weather App
slug: weather-app
category: Utility Apps
tagline: Real-time weather by city or geolocation, key kept server-side.
description: |
  Search any city or use the 📍 button for current location. The
  OpenWeatherMap API key never reaches the browser — requests go through
  a Vercel serverless function (api/weather.js) that injects the key
  server-side. Graceful handling of city-not-found, denied permissions,
  and rate limits.
tech: [JavaScript, Vercel Serverless, Geolocation API, OpenWeatherMap]
highlights:
  - Serverless proxy hides API key (key in Vercel env vars, not in JS)
  - Geolocation button with permission/error toasts
  - Cache-Control on proxy (s-maxage=300, stale-while-revalidate=600)
  - Safe DOM construction (no innerHTML for API responses)
links:
  live: https://mini-projects-js-five.vercel.app/weather-app/
  source: https://github.com/ubednama/Mini-Projects-js/tree/main/weather-app
screenshot: screenshots/weather-app.png
```

### 8. Dictionary App

```yaml
title: Dictionary App
slug: dictionary-app
category: Utility Apps
tagline: Definitions, examples, antonyms, and pronunciation.
description: |
  Look up any word using the dictionaryapi.dev API. Returns part of
  speech, definition, example, antonyms, and audio pronunciations
  (multiple regional variants when available). Source link to the
  upstream entry. All API content is rendered via DOM construction
  (no innerHTML).
tech: [JavaScript, Fetch API, Web Audio]
highlights:
  - Multi-region pronunciation playback
  - Antonyms and source attribution
  - DOM-builder helper for safe rendering of API content
links:
  live: https://mini-projects-js-five.vercel.app/dictionary-app/
  source: https://github.com/ubednama/Mini-Projects-js/tree/main/dictionary-app
screenshot: screenshots/dictionary-app.png
```

### 9. Password Generator

```yaml
title: Password Generator
slug: password-generator
category: Utility Apps
tagline: Cryptographically-secure passwords with a live entropy meter.
description: |
  Length 4–32 with mix-and-match character sets (lowercase, uppercase,
  numbers, symbols). Random source is crypto.getRandomValues with
  rejection sampling so there's no modulo bias. A live strength meter
  computes entropy bits from charset size × length and classifies the
  result as Weak / Fair / Strong / Very Strong.
tech: [JavaScript, Web Crypto API]
highlights:
  - crypto.getRandomValues + rejection sampling — no Math.random, no bias
  - Live entropy bar with bits-of-entropy label
  - One-click clipboard copy
  - In-app terminal log of generation parameters
links:
  live: https://mini-projects-js-five.vercel.app/password-generator/
  source: https://github.com/ubednama/Mini-Projects-js/tree/main/password-generator
screenshot: screenshots/password-generator.png
```

### 10. QR Code Generator

```yaml
title: QR Code Generator
slug: qr-code-generator
category: Utility Apps
tagline: Generate, copy, and download QR codes from any text or URL.
description: |
  Type any string, get a QR code from api.qrserver.com. Copy the encoded
  text back to clipboard, or download the QR as a 500×500 PNG (fetched
  as a blob and saved locally — no right-click required).
tech: [JavaScript, Fetch API, Blob, Clipboard]
highlights:
  - Copy encoded text + Download PNG buttons
  - Blob-based download flow (no right-click-save needed)
  - Loading spinner with fade-in transition
links:
  live: https://mini-projects-js-five.vercel.app/qr-code-generator/
  source: https://github.com/ubednama/Mini-Projects-js/tree/main/qr-code-generator
screenshot: screenshots/qr-code-generator.png
```

### 11. Color Picker

```yaml
title: Color Picker
slug: color-picker
category: Utility Apps
tagline: Pick colors, generate palettes, copy in any format.
description: |
  Pick any color and get HEX, RGB, and HSL representations. Generate a
  related palette (complementary, analogous, etc.) and copy any value
  to clipboard with one click.
tech: [JavaScript, Color Math]
highlights:
  - HEX / RGB / HSL — pick one, see all three
  - Palette generation
  - Per-value clipboard copy
links:
  live: https://mini-projects-js-five.vercel.app/color-picker/
  source: https://github.com/ubednama/Mini-Projects-js/tree/main/color-picker
screenshot: screenshots/color-picker.png
```

### 12. Stopwatch

```yaml
title: Stopwatch
slug: stopwatch
category: Time & Productivity
tagline: Precision timing with persistent laps and keyboard shortcuts.
description: |
  Start / pause / reset / lap with 10ms precision. State persists across
  page reloads — refreshing the tab while running keeps the clock
  ticking and remembers all recorded laps (capped at 100 to bound DOM
  growth). Spacebar to start/pause, L to record a lap, Ctrl+R to reset.
tech: [JavaScript, localStorage, Keyboard Events]
highlights:
  - Reload-safe state via localStorage; resumes mid-run accurately
  - Keyboard shortcuts (Space, L, Ctrl+R)
  - Lap history capped at 100 entries (no unbounded DOM growth)
links:
  live: https://mini-projects-js-five.vercel.app/stopwatch/
  source: https://github.com/ubednama/Mini-Projects-js/tree/main/stopwatch
screenshot: screenshots/stopwatch.png
```

### 13. Digital Clock

```yaml
title: Digital Clock
slug: digital-clock
category: Time & Productivity
tagline: Live time with date and timezone display.
description: |
  Updates every second. Shows current date, day of week, and timezone
  alongside HH:MM:SS.
tech: [JavaScript, Intl.DateTimeFormat]
highlights:
  - Locale-aware time formatting via Intl
  - Cleanly stops updates on page unload
links:
  live: https://mini-projects-js-five.vercel.app/digital-clock/
  source: https://github.com/ubednama/Mini-Projects-js/tree/main/digital-clock
screenshot: screenshots/digital-clock.png
```

### 14. Analog Clock

```yaml
title: Analog Clock
slug: analog-clock
category: Time & Productivity
tagline: A classic analog face, multiple visual styles.
description: |
  CSS-only clock face with hour, minute, and second hands rotated by
  computed style transforms each tick.
tech: [JavaScript, CSS Transforms]
highlights:
  - Pure CSS face (no canvas, no SVG)
  - Smooth second-hand sweep
links:
  live: https://mini-projects-js-five.vercel.app/analog-clock/
  source: https://github.com/ubednama/Mini-Projects-js/tree/main/analog-clock
screenshot: screenshots/analog-clock.png
```

### 15. Quick Sign

```yaml
title: Quick Sign
slug: quick-sign
category: Creative Tools
tagline: Sign on a canvas, undo, save, retrieve, download.
description: |
  Mouse and touch drawing on an HTML canvas with adjustable pen color,
  background color, and stroke width. Unified pointer handling scales
  CSS pixels to canvas-bitmap pixels so drawing stays aligned on
  responsive layouts and mobile. Undo history (cap 20) bound to a
  dedicated button and Ctrl/Cmd+Z. Save to localStorage and retrieve;
  download as a timestamped PNG.
tech: [JavaScript, Canvas API, Touch Events, localStorage]
highlights:
  - Unified mouse + touch handling — one getPointerPos() function
  - Coordinate scaling so drawing aligns under any CSS scale (mobile)
  - Undo stack with keyboard shortcut (Ctrl/Cmd+Z)
  - Save to localStorage, retrieve on demand, download as PNG
links:
  live: https://mini-projects-js-five.vercel.app/quick-sign/
  source: https://github.com/ubednama/Mini-Projects-js/tree/main/quick-sign
screenshot: screenshots/quick-sign.png
```

### 16. Print Numbers

```yaml
title: Print Numbers
slug: print-numbers
category: Creative Tools
tagline: Pick a starting number, render a 2×3 grid in either direction.
description: |
  A small visual exercise: enter a number from -9999 to 9999, choose
  ascending or descending, and watch six animated tiles cascade in.
tech: [JavaScript, CSS Animation]
highlights:
  - Bounded input validation (range + toast feedback)
  - Staggered CSS animation per tile
links:
  live: https://mini-projects-js-five.vercel.app/print-numbers/
  source: https://github.com/ubednama/Mini-Projects-js/tree/main/print-numbers
screenshot: screenshots/print-numbers.png
```

### 17. Breaking Bad Quotes

```yaml
title: Breaking Bad Quotes
slug: bb-quotes-api
category: API & Content
tagline: One-click random quotes from the show.
description: |
  Fetches a random quote from a Breaking Bad quotes API. Demonstrates
  third-party API consumption with proper loading and error states.
tech: [JavaScript, Fetch API]
highlights:
  - Loading state + graceful error handling
  - One-click "new quote" interaction
links:
  live: https://mini-projects-js-five.vercel.app/bb-quotes-api/
  source: https://github.com/ubednama/Mini-Projects-js/tree/main/bb-quotes-api
screenshot: screenshots/bb-quotes-api.png
```

---

## Screenshot capture guide

Save all screenshots into `screenshots/` at the repo root using the slugs listed above (e.g. `screenshots/calculator.png`).

Recommended approach (one of):

- **macOS:** `Cmd+Shift+4`, then space (window mode), click the browser window. Saves to Desktop — rename and move into `screenshots/`.
- **Browser DevTools:** open DevTools, `Cmd+Shift+P` (Cmd+Option+P on macOS), type "screenshot", pick "Capture full size screenshot" or "Capture node screenshot".
- **Recommended dimensions:** 1280×800 (desktop) or 1170×2532 (mobile portrait if you want both).

For consistency, capture each app in a state that shows it doing something — e.g. calculator with a recent computation, weather-app with a city loaded, stopwatch mid-run, qr-code-generator with a code rendered.

---

## Hand-off prompt template

Paste this (along with this whole file) to your portfolio Claude Code session:

> I want to add the projects listed in `PORTFOLIO.md` from my Mini-Projects-js repo to my portfolio site. Each YAML block describes one project with title, slug, category, tagline, description, tech, highlights, live URL, source URL, and screenshot path. Screenshots will be at `screenshots/<slug>.png` in the Mini-Projects-js repo (I'll copy them to wherever your code expects). Please add a "Mini Projects JS" entry that links to the umbrella project, plus individual entries for any of the 17 sub-projects you think are most portfolio-worthy (your call — or I can pick). Group them by category as listed.
