# Gàidhlig Agam — Scottish Gaelic practice PWA

A self-contained, offline-capable web app for daily Scottish Gaelic practice: vocab (spaced repetition), grammar notes, listening, speaking, short stories, and a placement test. No build step, no backend — just static files.

## Run it locally

```
python -m http.server 8080
```

Then open `http://localhost:8080` in a browser.

## Use it on your Samsung phone

**Option A — same Wi-Fi (quickest, for testing):**

1. Run the local server above on your computer.
2. Find your computer's local IP (Windows: `ipconfig`, look for "IPv4 Address").
3. On your phone's Chrome, open `http://<your-computer-ip>:8080`.
4. Chrome menu → "Add to Home screen" to install it as an app.

**Option B — GitHub Pages (permanent, works anywhere, offline after first load):**

1. Push this repo to GitHub.
2. Repo Settings → Pages → deploy from the `main` branch, root folder.
3. Open the published URL on your phone, then "Add to Home screen".
4. Because of the service worker (`sw.js`), it keeps working without internet after the first visit.

## Content

All learning content lives in `data/*.json` — edit or extend these directly, no code changes needed:

- `vocab.json` — flashcard words (id, Gaelic, English, category)
- `sentences.json` — practice sentences for listening/speaking
- `stories.json` — short reading passages with a clickable glossary
- `grammar.json` — short grammar notes with examples
- `placement.json` — multiple-choice placement test questions

The starter set (~100 words, 15 sentences, 2 stories, 5 grammar notes, 9 test questions) is hand-curated for a realistic one-session scope. Expanding it with content pulled from Tatoeba (CC BY) or Kaikki.org's parsed Wiktionary (CC BY-SA) is a natural next step — just append more objects in the same shape.

## How the practice modules work

- **Learn**: Leitner-box spaced repetition (`js/srs.js`). Wrong answers go into a mistake pool and resurface first in your next session; correct answers push a word to a later review date.
- **Listen**: reads sentences aloud via the browser's text-to-speech (no native Gaelic voice on most devices, so treat it as approximate) and links out to LearnGaelic's dictionary for real native-speaker audio.
- **Speak**: records your voice with the microphone so you can play it back next to the reference pronunciation and self-assess — no automated scoring, since reliable Gaelic speech recognition isn't available in-browser.
- **Read**: short stories with click-to-reveal glossary definitions inline.
- **Test**: a short placement quiz that sets a starting level (A0/A1/A2), stored locally so Home reflects it.

All progress (SRS state, mistakes, streak, level) is stored in the browser's `localStorage` — it's per-device and never leaves your phone.
