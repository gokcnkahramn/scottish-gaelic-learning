const DATA = {};
const el = sel => document.querySelector(sel);
const view = el('#view');

async function loadData() {
  const files = ['vocab', 'sentences', 'stories', 'grammar', 'placement'];
  await Promise.all(files.map(async name => {
    const res = await fetch(`data/${name}.json`);
    DATA[name] = await res.json();
  }));
}

function setActiveTab(name) {
  document.querySelectorAll('.tabbar button').forEach(b => {
    b.classList.toggle('active', b.dataset.view === name);
  });
}

function navigate(name) {
  setActiveTab(name);
  localStorage.setItem('gd_last_view', name);
  const renderer = { home: renderHome, learn: renderLearn, grammar: renderGrammar, listen: renderListen, speak: renderSpeak, read: renderRead, test: renderTest }[name];
  view.innerHTML = '';
  renderer();
  window.scrollTo(0, 0);
}

document.getElementById('tabbar').addEventListener('click', e => {
  const btn = e.target.closest('button[data-view]');
  if (btn) navigate(btn.dataset.view);
});

const LEVELS = ['A1', 'A2', 'B1', 'B2'];
const LEVEL_GOAL = 'B2';

function getLevel() {
  return localStorage.getItem('gd_level') || null;
}

function normalizeLevel(level) {
  if (!level) return 'A1';
  return level.replace(/\s*\(.*\)/, '').trim();
}

function getFilterLevel() {
  return localStorage.getItem('gd_filter_level') || normalizeLevel(getLevel()) || 'A1';
}

function setFilterLevel(level) {
  localStorage.setItem('gd_filter_level', level);
}

function levelFilterBar(activeLevel, onChange) {
  const bar = document.createElement('div');
  bar.className = 'btn-row';
  bar.style.flexWrap = 'wrap';
  bar.style.gap = '6px';
  bar.style.marginBottom = '14px';
  LEVELS.forEach(lv => {
    const b = document.createElement('button');
    b.className = 'pill';
    b.style.cursor = 'pointer';
    b.style.border = 'none';
    b.style.background = lv === activeLevel ? 'var(--accent)' : 'var(--card2)';
    b.style.color = lv === activeLevel ? '#0f1613' : 'var(--muted)';
    b.textContent = lv;
    b.addEventListener('click', () => { setFilterLevel(lv); onChange(lv); });
    bar.appendChild(b);
  });
  return bar;
}

// ---------- HOME ----------
function renderHome() {
  const level = getLevel();
  const vocabIds = DATA.vocab.map(v => v.id);
  const stats = SRS.stats(vocabIds);
  const dueCount = stats.due + Mistakes.all().filter(id => id.startsWith('v')).length;

  const perLevel = LEVELS.map(lv => {
    const ids = DATA.vocab.filter(v => v.level === lv).map(v => v.id);
    const s = SRS.stats(ids);
    return { level: lv, mastered: s.mastered, total: ids.length };
  });
  const goalIdx = LEVELS.indexOf(LEVEL_GOAL);
  const currentIdx = LEVELS.indexOf(normalizeLevel(level) || 'A1');
  const roadmapPct = Math.round((Math.max(currentIdx, 0) / goalIdx) * 100);

  view.innerHTML = `
    <div class="card">
      <h2>Fàilte! 👋</h2>
      <p class="muted">${level ? `Your level: <strong>${level}</strong>` : `You haven't taken the placement test yet.`} Goal: <strong>B2</strong></p>
      ${!level ? `<button class="btn wide" id="goTest">Take placement test (5 min)</button>` : `<button class="btn secondary wide" id="retakeTest">Retake placement test</button>`}
    </div>
    <div class="card">
      <h3>Road to B2</h3>
      <div class="progress-bar-bg"><div class="progress-bar-fill" style="width:${roadmapPct}%"></div></div>
      ${perLevel.map(p => `<p class="muted">${p.level}: ${p.mastered}/${p.total} words mastered</p>`).join('')}
    </div>
    <div class="home-grid">
      <div class="home-tile"><div class="num">${stats.mastered}</div><div class="label">Words mastered</div></div>
      <div class="home-tile"><div class="num">${dueCount}</div><div class="label">Due for review</div></div>
      <div class="home-tile"><div class="num">${Mistakes.all().length}</div><div class="label">In mistake pool</div></div>
      <div class="home-tile"><div class="num">${Streak.current()}</div><div class="label">Day streak</div></div>
    </div>
    <div class="card">
      <h3>Today's 30-minute plan</h3>
      <p class="muted">A balanced mix — roughly 10 min vocab review, 5 min grammar, 5 min listening, 5 min speaking, 5 min reading. Working level: <strong>${getFilterLevel()}</strong> (change it from any module's level bar).</p>
      <div class="btn-row" style="flex-wrap:wrap; gap:8px;">
        <button class="btn secondary" data-go="learn">🗂️ Learn</button>
        <button class="btn secondary" data-go="grammar">📘 Grammar</button>
        <button class="btn secondary" data-go="listen">🎧 Listen</button>
        <button class="btn secondary" data-go="speak">🎙️ Speak</button>
        <button class="btn secondary" data-go="read">📖 Read</button>
      </div>
    </div>
  `;
  view.querySelectorAll('[data-go]').forEach(b => b.addEventListener('click', () => navigate(b.dataset.go)));
  const goTest = el('#goTest') || el('#retakeTest');
  if (goTest) goTest.addEventListener('click', () => navigate('test'));
  Streak.touch();
}

// ---------- LEARN (flashcards + SRS) ----------
let learnQueue = [];
let learnIndex = 0;

function buildLearnQueue(level) {
  const ids = DATA.vocab.filter(v => v.level === level).map(v => v.id);
  const mistakeIds = Mistakes.all().filter(id => ids.includes(id));
  const due = SRS.dueItems(ids).filter(id => !mistakeIds.includes(id));
  const fresh = SRS.newItems(ids, 10);
  // Mistakes first, then due reviews, then a few new words.
  learnQueue = [...mistakeIds, ...due, ...fresh];
  learnIndex = 0;
}

function renderLearn() {
  const level = getFilterLevel();
  view.innerHTML = '<h2>Learn (flashcards)</h2>';
  view.appendChild(levelFilterBar(level, () => navigate('learn')));
  const holder = document.createElement('div');
  view.appendChild(holder);
  buildLearnQueue(level);
  renderLearnCard(holder);
}

function renderLearnCard(holder) {
  if (learnIndex >= learnQueue.length) {
    holder.innerHTML = `<div class="card"><h2>All done for now! ✅</h2><p class="muted">No more cards due at this level. Try another level above, or come back later.</p>
      <button class="btn wide" data-go="home">Back to home</button></div>`;
    holder.querySelector('[data-go="home"]').addEventListener('click', () => navigate('home'));
    return;
  }
  const id = learnQueue[learnIndex];
  const word = DATA.vocab.find(v => v.id === id);
  holder.innerHTML = `
    <p class="muted">Card ${learnIndex + 1} / ${learnQueue.length}</p>
    <div class="flashcard" id="fc">
      <div class="cat">${word.cat}</div>
      <div class="gd">${word.gd}</div>
      <div class="en">${word.en}</div>
    </div>
    <button class="btn wide" id="revealBtn">Show answer</button>
    <div class="btn-row" id="gradeRow" style="display:none; margin-top:10px;">
      <button class="btn wrong" id="wrongBtn">❌ Didn't know</button>
      <button class="btn right" id="rightBtn">✅ Knew it</button>
    </div>
  `;
  const card = holder.querySelector('#fc');
  holder.querySelector('#revealBtn').addEventListener('click', () => {
    card.classList.add('revealed');
    holder.querySelector('#revealBtn').style.display = 'none';
    holder.querySelector('#gradeRow').style.display = 'flex';
  });
  holder.querySelector('#wrongBtn').addEventListener('click', () => { SRS.grade(id, false); learnIndex++; renderLearnCard(holder); });
  holder.querySelector('#rightBtn').addEventListener('click', () => { SRS.grade(id, true); learnIndex++; renderLearnCard(holder); });
}

// ---------- GRAMMAR ----------
function renderGrammar() {
  const level = getFilterLevel();
  view.innerHTML = '<h2>Grammar notes</h2>';
  view.appendChild(levelFilterBar(level, () => navigate('grammar')));
  const items = DATA.grammar.filter(g => g.level === level);
  const list = document.createElement('div');
  list.innerHTML = items.length ? items.map(g => `
    <div class="card">
      <span class="pill">${g.level}</span>
      <h3>${g.title}</h3>
      <p>${g.body}</p>
      ${g.examples.map(ex => `<p class="muted"><strong>${ex.gd}</strong> — ${ex.en}</p>`).join('')}
    </div>
  `).join('') : `<p class="muted">No grammar notes at this level yet.</p>`;
  view.appendChild(list);
}

// ---------- LISTEN ----------
function renderListen() {
  const level = getFilterLevel();
  view.innerHTML = `
    <h2>Listening practice</h2>
    <p class="muted">Browser text-to-speech doesn't support Scottish Gaelic well, so for real pronunciation use LearnGaelic's dictionary audio (linked below) alongside these sentences. Read along, then try to say it before checking.</p>
    <div class="card">
      <h3>Dictionary audio</h3>
      <p class="muted">Look up any word's real native-speaker pronunciation:</p>
      <a class="link" href="https://learngaelic.scot/dictionary/" target="_blank" rel="noopener">Open LearnGaelic Dictionary ↗</a>
    </div>
  `;
  view.appendChild(levelFilterBar(level, () => navigate('listen')));
  const list = document.createElement('div');
  const items = DATA.sentences.filter(s => s.level === level);
  list.innerHTML = (items.length ? items : [{id: 'none', gd: '', en: ''}]).map(s => s.id === 'none' ? `<p class="muted">No sentences at this level yet.</p>` : `
      <div class="card">
        <span class="pill">${s.level}</span>
        <h3>${s.gd}</h3>
        <p class="muted" id="en-${s.id}" style="display:none;">${s.en}</p>
        <div class="btn-row">
          <button class="btn secondary" data-speak="${s.gd.replace(/"/g, '&quot;')}">🔊 Play (approx. TTS)</button>
          <button class="btn secondary" data-reveal="${s.id}">Show translation</button>
        </div>
      </div>
    `).join('');
  view.appendChild(list);
  view.querySelectorAll('[data-speak]').forEach(b => b.addEventListener('click', () => speakText(b.dataset.speak)));
  view.querySelectorAll('[data-reveal]').forEach(b => b.addEventListener('click', () => {
    el(`#en-${b.dataset.reveal}`).style.display = 'block';
  }));
}

function speakText(text) {
  if (!('speechSynthesis' in window)) {
    alert('Text-to-speech is not supported on this device.');
    return;
  }
  const u = new SpeechSynthesisUtterance(text);
  const voices = speechSynthesis.getVoices();
  const gdVoice = voices.find(v => v.lang && v.lang.toLowerCase().startsWith('gd'));
  u.lang = gdVoice ? gdVoice.lang : 'en-GB';
  if (gdVoice) u.voice = gdVoice;
  u.rate = 0.85;
  speechSynthesis.cancel();
  speechSynthesis.speak(u);
}

// ---------- SPEAK ----------
let mediaRecorder = null;
let recordedChunks = [];

function renderSpeak() {
  const level = getFilterLevel();
  view.innerHTML = `
    <h2>Speaking practice</h2>
    <p class="muted">Pick a phrase, listen to the reference pronunciation on LearnGaelic, record yourself, then play both back and compare.</p>
  `;
  view.appendChild(levelFilterBar(level, () => navigate('speak')));
  const items = DATA.sentences.filter(s => s.level === level);
  const list = document.createElement('div');
  list.innerHTML = items.length ? items.map(s => `
      <div class="card" id="speak-${s.id}">
        <h3>${s.gd}</h3>
        <p class="muted">${s.en}</p>
        <div class="btn-row">
          <button class="btn secondary" data-speak="${s.gd.replace(/"/g, '&quot;')}">🔊 Reference (TTS)</button>
          <button class="btn record" data-record="${s.id}">🎙️ Record myself</button>
        </div>
        <div id="rec-output-${s.id}"></div>
      </div>
    `).join('') : `<p class="muted">No sentences at this level yet.</p>`;
  view.appendChild(list);
  view.querySelectorAll('[data-speak]').forEach(b => b.addEventListener('click', () => speakText(b.dataset.speak)));
  view.querySelectorAll('[data-record]').forEach(b => b.addEventListener('click', () => toggleRecord(b)));
}

async function toggleRecord(btn) {
  const id = btn.dataset.record;
  if (btn.dataset.recording === '1') {
    mediaRecorder.stop();
    btn.dataset.recording = '0';
    btn.textContent = '🎙️ Record myself';
    return;
  }
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    recordedChunks = [];
    mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.ondataavailable = e => recordedChunks.push(e.data);
    mediaRecorder.onstop = () => {
      const blob = new Blob(recordedChunks, { type: 'audio/webm' });
      const url = URL.createObjectURL(blob);
      el(`#rec-output-${id}`).innerHTML = `<audio controls src="${url}"></audio>`;
      stream.getTracks().forEach(t => t.stop());
    };
    mediaRecorder.start();
    btn.dataset.recording = '1';
    btn.textContent = '⏹️ Stop recording';
  } catch (e) {
    alert('Microphone access denied or unavailable.');
  }
}

// ---------- READ ----------
function renderRead() {
  const level = getFilterLevel();
  view.innerHTML = '<h2>Stories</h2>';
  view.appendChild(levelFilterBar(level, () => navigate('read')));
  const items = DATA.stories.filter(st => st.level === level);
  const list = document.createElement('div');
  list.innerHTML = items.length ? items.map(st => `
    <div class="card">
      <span class="pill">${st.level}</span>
      <h3>${st.title} <span class="muted">(${st.titleEn})</span></h3>
      ${st.paragraphs.map(p => `<p>${linkifyStory(p.gd, st.glossary)}</p>`).join('')}
      <details><summary class="muted">Show English translation</summary>
        ${st.paragraphs.map(p => `<p class="muted">${p.en}</p>`).join('')}
      </details>
    </div>
  `).join('') : `<p class="muted">No stories at this level yet.</p>`;
  view.appendChild(list);

  view.querySelectorAll('.story-word').forEach(w => w.addEventListener('click', () => {
    const existing = w.nextElementSibling;
    if (existing && existing.classList.contains('story-tooltip')) {
      existing.remove();
      return;
    }
    const tip = document.createElement('div');
    tip.className = 'story-tooltip';
    tip.textContent = w.dataset.def;
    w.insertAdjacentElement('afterend', tip);
  }));
}

function linkifyStory(text, glossary) {
  let html = text;
  glossary.forEach(entry => {
    const re = new RegExp(entry.gd.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    html = html.replace(re, match => `<span class="story-word" data-def="${entry.en}">${match}</span>`);
  });
  return html;
}

// ---------- PLACEMENT TEST ----------
let testIndex = 0;
let testScore = { A0: 0, A1: 0, A2: 0, B1: 0, B2: 0 };
let testTotals = { A0: 0, A1: 0, A2: 0, B1: 0, B2: 0 };
let testAnswered = false;

function renderTest() {
  testIndex = 0;
  testScore = { A0: 0, A1: 0, A2: 0, B1: 0, B2: 0 };
  testTotals = { A0: 0, A1: 0, A2: 0, B1: 0, B2: 0 };
  DATA.placement.forEach(q => { testTotals[q.level] = (testTotals[q.level] || 0) + 1; });
  renderTestQuestion();
}

function renderTestQuestion() {
  if (testIndex >= DATA.placement.length) {
    const level = computeLevel();
    localStorage.setItem('gd_level', level);
    localStorage.setItem('gd_filter_level', normalizeLevel(level));
    view.innerHTML = `
      <div class="card">
        <h2>Result: ${level}</h2>
        <p class="muted">Based on your answers, we've set your starting level to <strong>${level}</strong>. You can retake this test anytime.</p>
        <button class="btn wide" data-go="home">Back to home</button>
      </div>`;
    el('[data-go="home"]').addEventListener('click', () => navigate('home'));
    return;
  }
  testAnswered = false;
  const q = DATA.placement[testIndex];
  view.innerHTML = `
    <p class="muted">Question ${testIndex + 1} / ${DATA.placement.length}</p>
    <div class="card">
      <h3>${q.q}</h3>
      <div class="choice-list">
        ${q.choices.map((c, i) => `<div class="choice" data-idx="${i}">${c}</div>`).join('')}
      </div>
    </div>
  `;
  view.querySelectorAll('.choice').forEach(c => c.addEventListener('click', () => selectChoice(c, q)));
}

function selectChoice(choiceEl, q) {
  if (testAnswered) return;
  testAnswered = true;
  const idx = parseInt(choiceEl.dataset.idx, 10);
  const correct = idx === q.answer;
  view.querySelectorAll('.choice').forEach(c => {
    const i = parseInt(c.dataset.idx, 10);
    if (i === q.answer) c.classList.add('correct');
    else if (i === idx) c.classList.add('incorrect');
  });
  if (correct) testScore[q.level] = (testScore[q.level] || 0) + 1;
  setTimeout(() => { testIndex++; renderTestQuestion(); }, 700);
}

function computeLevel() {
  const order = ['A0', 'A1', 'A2', 'B1', 'B2'];
  let achieved = 'A0 (complete beginner)';
  for (const lv of order) {
    const total = testTotals[lv] || 0;
    if (total === 0) continue;
    const ratio = testScore[lv] / total;
    if (ratio >= 0.6) {
      achieved = lv === 'A0' ? 'A0 (complete beginner)' : lv;
    } else {
      break;
    }
  }
  return achieved;
}

// ---------- INIT ----------
async function init() {
  await loadData();
  if ('speechSynthesis' in window) speechSynthesis.onvoiceschanged = () => {};
  const last = localStorage.getItem('gd_last_view') || 'home';
  navigate(last);
  el('#streakDisplay').textContent = `🔥 ${Streak.current()}`;

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  }
}

init();
