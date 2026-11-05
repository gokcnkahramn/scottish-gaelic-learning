# Curriculum map — topic/grammar sequencing by level

Internal planning notes only: summarized/paraphrased from public course structures, not copied text. Used to decide what topics and grammar points to add at which level in `data/*.json`. Confidence is marked per source since several of these are third-party trackers or incomplete search results, not official spec pages — re-verify before treating any single claim as authoritative.

## Sources checked

1. **Duolingo** (Scottish Gaelic from English) — via third-party trackers (duolingodata.com, Duolingo Fandom wiki), not an official curriculum doc. *Confidence: medium — structure keeps changing between snapshots.*
2. **LearnGaelic.scot / learngaelic.net** — official site sections: Beag air Bheag, Speaking Our Language, An Litir Bheag, SpeakGaelic coursebooks. *Confidence: medium-high for course names/levels, low for exact unit lists (not all pages surfaced).*
3. **BBC "Litir do Luchd-Ionnsachaidh"** (via learngaelic.net, which hosts/levels the letters) — graded by CEFR label per letter rather than an easy/medium/hard scheme. *Confidence: medium — the original hypothesis of an "easy/medium/hard" numbering wasn't confirmed; levels appear to be plain CEFR tags (e.g. "B2") per letter instead.*
4. **Sabhal Mòr Ostaig (SMO)** short-course Levels 1–10, and the **SpeakGaelic** coursebook series (A1/A2/B1), which SMO's own community classes are explicitly based on. *Confidence: high for level/topic mapping, since these are official coursebook listings.*

## Level → topic mapping

| Level | Topics commonly introduced here | Source(s) |
|---|---|---|
| **Intro / A0** | Greetings, basic phrases, simple statements ("tha/chan eil") | Duolingo Section 1 (9 units) |
| **A1** | Family, numbers, food, daily objects, telling time, basic questions, present tense of "bi"; SpeakGaelic A1 covers ~13 topics of "everyday practical language" | Duolingo Section 2; SpeakGaelic A1 coursebook (13 topics); SMO Level 1 ("complete beginners, no prior learning") |
| **A1→A2 boundary** | Moving house, work, holidays/dates start appearing (Duolingo Section 3, still labelled A1 by Duolingo but topically heavier); SpeakGaelic A2 exists as a distinct coursebook stage | Duolingo Section 3; SpeakGaelic A2 |
| **A2** | Shopping, travel, weather, hobbies/pastimes, opinions ("is toil leam") — this matches our current A2 vocab categories reasonably well; Duolingo's largest section (51 units) is tagged A2 and likely covers this breadth plus more irregular-verb practice | Duolingo Section 4 (A2, 51 units) |
| **B1** | Neighbours, travel (deeper/more abstract than A2 travel), beliefs, the Highlands (culture/region topic), technology, fashion — these are confirmed as actual SpeakGaelic B1 unit titles (topics 14–19 of 14–26) | SpeakGaelic B1 Part 1/2 coursebooks |
| **B1→B2** | "Speaking Our Language" programmes 19–72 are described as "developing skills", with 37–54 pitched at upper-intermediate (B2) — i.e. B1 work continues for a long stretch before B2 content appears | LearnGaelic / Speaking Our Language programme grading |
| **B2** | "Litir do Luchd-Ionnsachaidh" (the main, harder Litir, as opposed to An Litir Bheag) carries explicit CEFR labels, with some letters marked B2; topics here are adult-content current-affairs/cultural essays, matching our current B2 "formal register / idioms / policy vocab" direction | LearnGaelic Litir level pages |
| **Beyond B2 (C1-ish)** | SMO Level 10 is for learners who've completed Levels 1–9 — i.e. there's a long tail past B2 we don't need to worry about yet | SMO short-course levels |

## Most actionable finding for our content work

Our current A2 vocab set (shopping, travel, directions, weather, hobbies, opinions) lines up well with where Duolingo's biggest, most topic-dense section sits (tagged A2) — so that's validated, no change needed there.

The clearer gap: our **B1** content should lean more on *concrete-but-social* topics before getting abstract — SpeakGaelic's actual B1 topics are "neighbours, travel, belief, the Highlands/region, technology, fashion" — i.e. still very conversational/cultural, not yet the abstract "environment/politics/economy" vocab we jumped to. We should add a B1 "neighbours/community/region/fashion" vocab batch before our current abstract-society B1 words, and treat abstract current-affairs vocab (environment, politics, policy) as more properly **B2** (matches the Litir do Luchd-Ionnsachaidh B2 pattern of current-affairs essays) — which is actually where we already put most of it. So: keep B2 as-is, but backfill B1 with more everyday/cultural topics (neighbours, region/Highlands culture, fashion, technology-as-daily-life rather than technology-as-policy) before adding more abstract B1 vocab.

## Sources

- [Duolingo Data: gdfen120v2](https://duolingodata.com/dat/gdfen120v2.html)
- [Duolingo Wiki: Scottish Gaelic Skill:Iain](https://duolingo.fandom.com/wiki/Scottish_Gaelic_Skill:Iain)
- [LearnGaelic: Upper Intermediate (B2)](https://learngaelic.net/b2.jsp)
- [LearnGaelic: An Litir Bheag](https://www.learngaelic.net/litirbheag/)
- [LearnGaelic: Litir](https://learngaelic.net/litir/)
- [Forum na Gàidhlig: Online Courses](https://foramnagaidhlig.net/index.php?page=7)
- [Sabhal Mòr Ostaig: Gaelic short courses](https://www.smo.uhi.ac.uk/area-of-interest/gaelic/page/2/?lang=en)
- [Gaelic Books: Speak Gaelic A1](https://www.gaelicbooks.org/explore-the-shop/non-fiction/gaelic-learning/speak-gaelic-a1?lang=en)
- [Gaelic Books: Speak Gaelic A2](https://www.gaelicbooks.org/explore-the-shop/non-fiction/gaelic-learning/speak-gaelic-a2?lang=en)
- [Gaelic Books: Speak Gaelic B1 Part 2 (topics 14-26)](https://www.gaelicbooks.org/explore-the-shop/non-fiction/gaelic-learning/speak-gaelic-b1-part-2?lang=en)
