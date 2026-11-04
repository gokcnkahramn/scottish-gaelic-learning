# TODO — Gàidhlig Agam

Ongoing content & feature roadmap toward B2. Pick items off this list in any order; check them off as they land. Each task should stay small enough to finish in one sitting.

## 1. Research: how others structure curriculum by level

Goal: don't invent a CEFR mapping from scratch — study how existing courses sequence topics, then adapt their structure (not their copyrighted text) into our own `data/*.json`.

- [ ] Map Duolingo's Scottish Gaelic course: list its unit/skill order (e.g. Basics → Greetings → Family → Food → ...) and note roughly which CEFR level each unit cluster corresponds to.
- [ ] Map LearnGaelic.scot's own course structure (they publish graded units, e.g. "Beag air Bheag", "Speaking Our Language", "An Litir Bheag") and note their stated levels.
- [ ] Map BBC Alba / BBC Naidheachdan learner resources (Beag air Bheag, Litir do Luchd-Ionnsachaidh "les" numbers) — these are explicitly graded by difficulty (easy/medium/hard letters) and are a good source for B1/B2 listening topic ideas.
- [ ] Check Steall / Cànan nan Gàidheal or any other Gaelic MOOC/course outlines for a second data point on topic sequencing.
- [ ] From the above, write a short `docs/curriculum-map.md` summarizing: "topic X → typically introduced at level Y, per sources A/B/C" — this becomes the backlog for section 2 below. Do not copy their sentences/text directly; use it only to decide *what topics and grammar points go at what level*.

## 2. Content depth — expand `data/*.json` level by level

Current state (as of this file's creation): ~210 vocab words, 18 grammar notes, 34 sentences, 5 stories, 21 placement questions across A1–B2. This is a skeleton, not a complete course — B2 fluency needs roughly 10x this volume.

- [ ] A1: round out remaining everyday categories (clothing, body parts, basic prepositions, more irregular verbs: faigh, thoir, dèan, abair, rach, faic, cluinn, beir, ith, thig — the 10 "irregular verbs" every Gaelic course front-loads).
- [ ] A2: expand shopping/travel/weather/hobbies categories to ~15-20 words each; add past/future tense drills for the 10 irregular verbs.
- [ ] B1: add topic vocab for health, housing, media/news basics, emotions (nuanced, not just happy/sad); add grammar notes on the imperative mood and indirect questions.
- [ ] B2: add vocab for current affairs, abstract argumentation, academic/work register; add grammar notes on comparative subordinate clauses, the "is" copula in formal contrasts (is e...a tha), and emphatic pronouns (mise, thusa, esan...).
- [ ] Add more stories per level (target: 4-5 stories per level, not just 1-2), ideally building a recurring cast of characters so later stories can reference earlier ones (helps with reading immersion).
- [ ] Add more placement questions per level (target: 8-10 per level instead of current 2-6) so the test result is statistically more reliable.
- [ ] Periodically re-validate all JSON files after edits (`node -e "JSON.parse(...)"` per file) and spot-check Gaelic spelling/grammar — ideally against a native-speaker resource or the LearnGaelic dictionary, since hand-written content can contain errors.

## 3. Real audio & pronunciation (the biggest gap right now)

Problem noted after first use: browser text-to-speech Gaelic pronunciation is poor (no real Gaelic TTS voice on most phones/browsers). Needs a proper fix, not just the "link out to LearnGaelic" workaround.

- [ ] Research licensing properly before bundling any audio (don't just scrape): check LearnGaelic.scot dictionary (~70,000 recorded words) terms of use for personal/educational offline use — may require asking permission rather than scraping.
- [ ] Check Mozilla Common Voice for a Scottish Gaelic (`gd`) locale dataset — CC0 if it exists, safe to bundle directly, but needs confirming a `gd` locale is actually live (last check was inconclusive).
- [ ] Check Forvo's API/terms for Gaelic pronunciations (likely needs attribution or paid API access for bulk use — confirm before relying on it).
- [ ] Evaluate PDF/book-based audio companions as a source of both vetted vocab AND matching audio, e.g.:
  - *Teach Yourself Gaelic* (Boyd Robertson & Iain Taylor) — comes with audio CDs/MP3s per lesson, graded A1→B1ish.
  - *Colloquial Scottish Gaelic* (Katherine M. Spadaro & Katie Graham) — includes audio, strong on real conversational speech.
  - *Speaking Our Language* (an t-seann cùrsa BBC) — full TV course with audio, public broadcast material, check rebroadcast/reuse terms.
  - *Scottish Gaelic in Twelve Weeks* (Boyd Robertson) — reference grammar, good for mining B1/B2 example sentences (text only, no audio).
  - *Gaelic Vocabulary* / *Illustrated Gaelic–English dictionaries* (Angus Watson or similar) — good for curated word lists if usable under fair-use/attribution for a personal learning tool.
  - For each book above: confirm (a) do I legally own/can access a copy, (b) can derived short example sentences/word lists be used personally without redistribution issues. Audio tracks from purchased books are for personal use only — do not bundle them into any app that leaves this device.
- [ ] Decide the realistic hybrid approach: likely = personal use of a legally-owned book's audio for private listening practice (outside the app, just referenced by lesson number) + Common Voice/Forvo audio only where license clearly allows bundling + continued deep-linking to LearnGaelic's dictionary for single-word pronunciation.
- [ ] If a bundleable audio source is found: add an `audio` field (URL or local file path) to relevant `vocab.json` / `sentences.json` entries and wire up an actual `<audio>` player in Listen/Speak views, replacing/supplementing the current `speechSynthesis` TTS call in `js/app.js`.
- [ ] If no good source is found for native playback: consider recording a small personal reference set yourself (e.g. with a native-speaker friend, a tutor session, or LearnGaelic's live content) for the highest-frequency ~200 words, since that's the single biggest lever for pronunciation quality.

## 4. Feature follow-ups (smaller, app-side)

- [ ] Speaking: after recording, let the user optionally tag their own attempt as "good" / "needs work" and store that locally, so weak spots resurface like SRS mistakes do for vocab.
- [ ] Listening: add a "slow / normal" playback speed toggle once real audio exists (not meaningful for TTS).
- [ ] Reading: track which stories have been fully read per level, show on Home.
- [ ] Grammar: consider turning each grammar note into a short 2-3 question quiz (reuses the placement-test UI pattern) so grammar isn't purely passive reading.
