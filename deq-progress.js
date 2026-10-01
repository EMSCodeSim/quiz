/* Daily practice progress. All data stays in this browser; no account is needed. */
(function () {
  const KEY = 'deq_learning_loop_v1';
  const DAY_MS = 86400000;

  function dayKey(date = new Date()) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }
  function dayDate(key) {
    const [year, month, day] = key.split('-').map(Number);
    return new Date(year, month - 1, day);
  }
  function fresh() {
    return { days: [], sessions: 0, questions: 0, correct: 0, misses: {}, recent: [] };
  }
  function read() {
    try {
      const value = JSON.parse(localStorage.getItem(KEY) || 'null');
      return value && Array.isArray(value.days) ? { ...fresh(), ...value } : fresh();
    } catch (_) { return fresh(); }
  }
  function write(state) {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (_) { /* private browsing */ }
  }
  function streak(state, today = dayKey()) {
    const days = new Set(state.days || []);
    let cursor = dayDate(today);
    if (!days.has(today)) cursor = new Date(cursor.getTime() - DAY_MS);
    let count = 0;
    while (days.has(dayKey(cursor))) {
      count++;
      cursor = new Date(cursor.getTime() - DAY_MS);
    }
    return count;
  }
  function record({ type, score, total, misses = [] }) {
    const state = read();
    const today = dayKey();
    if (!state.days.includes(today)) state.days.push(today);
    state.days = state.days.slice(-400);
    state.sessions++;
    state.questions += total;
    state.correct += score;
    state.recent.unshift({ date: today, type, score, total });
    state.recent = state.recent.slice(0, 20);
    state.misses = state.misses || {};
    misses.forEach(item => {
      const id = `${type}::${item.question}`;
      const previous = state.misses[id] || {};
      state.misses[id] = {
        type, question: item.question, domain: item.domain,
        missed: (previous.missed || 0) + 1, correctReviews: 0,
        due: dayKey(new Date(Date.now() + DAY_MS))
      };
    });
    write(state);
    return summary(state);
  }
  function recordReview({ type, question, correct }) {
    const state = read();
    const id = `${type}::${question}`;
    const item = state.misses && state.misses[id];
    if (!item) return;
    if (correct) {
      item.correctReviews = (item.correctReviews || 0) + 1;
      if (item.correctReviews >= 2) delete state.misses[id];
      else item.due = dayKey(new Date(Date.now() + 3 * DAY_MS));
    } else {
      item.missed = (item.missed || 0) + 1;
      item.correctReviews = 0;
      item.due = dayKey(new Date(Date.now() + DAY_MS));
    }
    write(state);
  }
  function dueQuestions(type) {
    const today = dayKey();
    return Object.values(read().misses || {}).filter(item => item.type === type && item.due <= today);
  }
  function summary(state = read()) {
    const today = dayKey();
    const activeThisWeek = new Set((state.days || []).filter(k => {
      const delta = Math.round((dayDate(today) - dayDate(k)) / DAY_MS);
      return delta >= 0 && delta < 7;
    })).size;
    const due = Object.values(state.misses || {}).filter(item => item.due <= today).length;
    const domains = {};
    Object.values(state.misses || {}).forEach(item => { domains[item.domain] = (domains[item.domain] || 0) + 1; });
    const focus = Object.entries(domains).sort((a, b) => b[1] - a[1])[0];
    return {
      todayDone: (state.days || []).includes(today), streak: streak(state), activeThisWeek,
      sessions: state.sessions || 0, questions: state.questions || 0,
      accuracy: state.questions ? Math.round(state.correct / state.questions * 100) : null,
      due, focus: focus ? focus[0] : null
    };
  }
  function renderHome() {
    const root = document.getElementById('learningLoop');
    if (!root) return;
    const state = read();
    const s = summary(state);
    const selected = new Date().getDate() % 2 ? 'emt' : 'paramedic';
    const label = selected === 'emt' ? 'Start today’s EMT 5' : 'Start today’s Paramedic 5';
    const href = selected === 'emt' ? '/emt_quiz.html' : '/paramedic_quiz.html';
    const bestDue = Object.values(state.misses || {}).filter(item => item.due <= dayKey()).length;
    root.innerHTML = `<div class="container"><div class="loop-head"><div><span class="eyebrow">Your field notebook</span><h2>A little practice adds up.</h2><p>Finish one five-question set today. Your streak counts completed practice days, and missed questions come back for review.</p></div><a class="btn btn-primary" href="${href}">${s.todayDone ? 'Practice another set' : label}</a></div><div class="loop-stats"><div><strong>${s.streak}</strong><span>day streak</span></div><div><strong>${s.activeThisWeek}/7</strong><span>days this week</span></div><div><strong>${s.accuracy === null ? '—' : `${s.accuracy}%`}</strong><span>overall accuracy</span></div><div><strong>${bestDue}</strong><span>questions ready to review</span></div></div><div class="loop-foot">${s.todayDone ? '<strong>Today complete.</strong> Nice work. Come back tomorrow for the next daily set.' : 'No pressure to be perfect. The useful part is noticing what you want to review.'}${s.focus ? ` <span>Recent focus: ${escapeHtml(s.focus)}.</span>` : ''}${bestDue ? ' <a href="/emt_quiz.html#review">Open a quiz to review missed questions.</a>' : ''}</div></div>`;
    const badge = document.getElementById('streakLabel');
    if (badge) badge.textContent = s.streak ? `${s.streak}-day streak` : 'Start your daily habit';
  }
  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
  }
  window.DEQProgress = { dayKey, record, recordReview, dueQuestions, summary, renderHome };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', renderHome);
  else renderHome();
})();
