// Leitner-box spaced repetition engine. Boxes 1-5; box N reviewed again after INTERVALS[N] days.
const SRS = (() => {
  const STORAGE_KEY = 'gd_srs_state_v1';
  const INTERVALS = { 1: 0, 2: 1, 3: 3, 4: 7, 5: 14 };

  function load() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    } catch (e) {
      return {};
    }
  }

  function save(state) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function todayStr() {
    return new Date().toISOString().slice(0, 10);
  }

  function addDays(days) {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d.toISOString().slice(0, 10);
  }

  function getCard(state, id) {
    return state[id] || { box: 1, due: todayStr(), seen: 0, correct: 0, wrong: 0 };
  }

  function isDue(card) {
    return card.due <= todayStr();
  }

  function dueItems(ids) {
    const state = load();
    return ids.filter(id => isDue(getCard(state, id)));
  }

  function newItems(ids, limit) {
    const state = load();
    return ids.filter(id => !state[id]).slice(0, limit);
  }

  function grade(id, correct) {
    const state = load();
    const card = getCard(state, id);
    card.seen += 1;
    if (correct) {
      card.correct += 1;
      card.box = Math.min(5, card.box + 1);
    } else {
      card.wrong += 1;
      card.box = 1;
      Mistakes.add(id);
    }
    card.due = addDays(INTERVALS[card.box]);
    state[id] = card;
    save(state);
    if (correct) Mistakes.clearIfMastered(id, card.box);
    return card;
  }

  function stats(ids) {
    const state = load();
    let mastered = 0, learning = 0, due = 0;
    ids.forEach(id => {
      const c = state[id];
      if (!c) return;
      if (c.box >= 4) mastered++; else learning++;
      if (isDue(c)) due++;
    });
    return { total: ids.length, mastered, learning, due, untouched: ids.length - mastered - learning };
  }

  return { load, save, getCard, isDue, dueItems, newItems, grade, stats, todayStr };
})();

// Separate mistake pool: items that have ever been answered wrong, removed once mastered (box >= 4).
const Mistakes = (() => {
  const KEY = 'gd_mistakes_v1';

  function load() {
    try {
      return JSON.parse(localStorage.getItem(KEY)) || [];
    } catch (e) {
      return [];
    }
  }

  function save(list) {
    localStorage.setItem(KEY, JSON.stringify(list));
  }

  function add(id) {
    const list = load();
    if (!list.includes(id)) {
      list.push(id);
      save(list);
    }
  }

  function clearIfMastered(id, box) {
    if (box >= 4) {
      save(load().filter(x => x !== id));
    }
  }

  function all() {
    return load();
  }

  return { add, clearIfMastered, all };
})();

// Streak tracking: counts consecutive days with at least one practice session.
const Streak = (() => {
  const KEY = 'gd_streak_v1';

  function load() {
    try {
      return JSON.parse(localStorage.getItem(KEY)) || { count: 0, last: null };
    } catch (e) {
      return { count: 0, last: null };
    }
  }

  function touch() {
    const data = load();
    const today = SRS.todayStr();
    if (data.last === today) return data.count;
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yStr = yesterday.toISOString().slice(0, 10);
    data.count = data.last === yStr ? data.count + 1 : 1;
    data.last = today;
    localStorage.setItem(KEY, JSON.stringify(data));
    return data.count;
  }

  function current() {
    return load().count;
  }

  return { touch, current };
})();
