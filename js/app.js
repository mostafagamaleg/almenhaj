/* ================================================================
   CatStore — مخزن الفئات الديناميكي (localStorage)
   الفئات الافتراضية تأتي من data.js، والمستخدم يضيف فوقها.
   ================================================================ */
const CatStore = (() => {
  const KEY = 'alm_lecture_cats';
  const ICONS = [
    'layers','book-open','book-marked','scroll-text','pen-line','scale','video',
    'graduation-cap','mic','users','star','heart','globe','compass','flask-conical',
    'brain','lamp','leaf','music','monitor','file-text','award','shield','cpu'
  ];

  function defaults() {
    return (window.AlminhajData?.lectureCategories || []).map(c => ({ ...c, _default: true }));
  }

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? JSON.parse(raw) : defaults();
    } catch { return defaults(); }
  }

  function save(cats) {
    try { localStorage.setItem(KEY, JSON.stringify(cats)); } catch {}
  }

  function all()   { return load(); }
  function icons() { return ICONS; }

  function add(cat) {
    const cats = load();
    const id = 'cat-' + Date.now();
    cats.push({ id, name: cat.name, icon: cat.icon || 'layers', color: cat.color || '#0a4d3f', desc: cat.desc || '' });
    save(cats); return id;
  }

  function update(id, patch) {
    const cats = load().map(c => c.id === id ? { ...c, ...patch } : c);
    save(cats);
  }

  function remove(id) {
    const cats = load().filter(c => c.id !== id);
    save(cats);
  }

  function reset() { save(defaults()); }

  return { all, icons, add, update, remove, reset };
})();

window.CatStore = CatStore;

const Alminhaj = (() => {
  const data = window.AlminhajData || {};

  const pageMap = {
    lectures:   'lectures.html',
    upload:     'upload.html',
    categories: 'categories.html',
    landing: 'index.html',
    login: 'login.html',
    register: 'register.html',
    forgot: 'forgot-password.html',
    student: 'student.html',
    dashboard: 'dashboard.html',
    teacher: 'teacher.html',
    admin: 'admin.html',
    library: 'course.html',
    course: 'course-details.html',
    lesson: 'lesson.html',
    quran: 'quran-reader.html',
    tafsir: 'tafsir-reader.html',
    pdf: 'pdf-reader.html',
    quiz: 'quiz.html',
    result: 'result.html',
    assignments: 'assignments.html',
    achievements: 'achievements.html',
    certificates: 'certificates.html',
    leaderboard: 'leaderboard.html',
    profile: 'profile.html',
    settings: 'settings.html',
    notifications: 'notifications.html',
    analytics: 'analytics.html',
    reports: 'reports.html'
  };

  const navItems = [
    ['student',   'لوحة الطالب',         'layout-dashboard'],
    ['lectures',  'المحاضرات',            'video'],
    ['library',   'المسارات',             'library'],
    ['quiz',      'الاختبارات',           'circle-help'],
    ['quran',     'المصحف والتفسير',      'book-open-text'],
    ['assignments','الواجبات',            'clipboard-check'],
    ['achievements','الإنجازات',          'trophy'],
    ['certificates','الشهادات',           'award'],
    ['leaderboard','المتصدّرون',          'bar-chart-3'],
    ['teacher',   'لوحة الشيخ',          'presentation'],
    ['upload',      'رفع محاضرة',           'upload-cloud'],
    ['categories',  'إدارة الفئات',         'folders'],
    ['admin',     'الإدارة',              'shield-check'],
    ['reports',   'التقارير',             'chart-column'],
    ['settings',  'الإعدادات',            'settings'],
  ];

  function icon(name, cls = 'h-5 w-5') {
    return `<i data-lucide="${name}" class="${cls}"></i>`;
  }

  function renderSidebar(active = 'student') {
    const links = navItems.map(([key, label, iconName]) => {
      const href = pageMap[key] || '#';
      const isActive = key === active;
      return `<a class="alm-nav-link ${isActive ? 'active' : ''}" href="${href}">${icon(iconName)}<span>${label}</span></a>`;
    }).join('');

    return `
      <div class="flex h-full flex-col p-5">
        <a href="index.html" class="mb-7 flex items-center gap-3">
          <span class="grid h-12 w-12 place-items-center rounded-xl border border-white/15 bg-white/10 text-[#ead8a3]">${icon('book-open-text', 'h-6 w-6')}</span>
          <span>
            <b class="block text-xl">المنهاج</b>
            <span class="block text-xs text-white/55">Alminhaj LMS</span>
          </span>
        </a>
        <nav class="space-y-1">${links}</nav>
        <div class="mt-auto rounded-2xl border border-white/10 bg-white/5 p-4">
          <div class="mb-3 flex items-center justify-between text-xs text-white/60">
            <span>خطة جزء عم</span>
            <span>${data.currentUser?.progress || 73}%</span>
          </div>
          <div class="alm-progress bg-white/15"><span style="width:${data.currentUser?.progress || 73}%"></span></div>
          <p class="mt-3 text-xs leading-6 text-white/60">استمر في رحلتك القرآنية لتحصل على شهادة المرحلة.</p>
        </div>
      </div>
    `;
  }

  function renderTopbar(title = 'لوحة التحكم', subtitle = 'منصة المنهاج') {
    return `
      <div class="alm-topbar px-4 py-3 md:px-7">
        <div class="flex items-center justify-between gap-3">
          <div class="flex items-center gap-3">
            <button class="alm-mobile-toggle rounded-xl border border-[var(--alm-line)] bg-white p-2 lg:hidden" aria-label="فتح القائمة">${icon('menu')}</button>
            <div>
              <p class="text-xs font-bold text-[var(--alm-muted)]">${subtitle}</p>
              <h1 class="text-xl font-black md:text-2xl">${title}</h1>
            </div>
          </div>
          <div class="hidden flex-1 justify-center px-4 md:flex">
            <label class="relative w-full max-w-md">
              <span class="absolute inset-y-0 right-3 grid place-items-center text-[var(--alm-muted)]">${icon('search', 'h-4 w-4')}</span>
              <input class="alm-input pr-10" placeholder="ابحث عن سورة، درس، اختبار..." />
            </label>
          </div>
          <div class="flex items-center gap-2">
            <button class="alm-lang-toggle alm-btn alm-btn-secondary !min-h-10 !px-3" type="button">EN</button>
            <a href="notifications.html" class="rounded-xl border border-[var(--alm-line)] bg-white p-2">${icon('bell')}</a>
            <a href="profile.html" class="hidden items-center gap-3 rounded-xl border border-[var(--alm-line)] bg-white px-3 py-2 md:flex">
              <span class="text-left">
                <b class="block text-sm">${data.currentUser?.name || 'محمود أحمد'}</b>
                <span class="text-xs text-[var(--alm-muted)]">طالب</span>
              </span>
              <span class="grid h-9 w-9 place-items-center rounded-lg bg-[var(--alm-green-800)] text-white">م</span>
            </a>
          </div>
        </div>
      </div>
    `;
  }

  function renderLayout(active, title, subtitle) {
    const shell = document.querySelector('[data-layout="app"]');
    if (!shell) return;
    shell.innerHTML = `
      <aside class="alm-sidebar" id="appSidebar">${renderSidebar(active)}</aside>
      <div class="alm-main">
        ${renderTopbar(title, subtitle)}
        <main class="p-4 md:p-7">
          <div data-page-slot></div>
        </main>
      </div>
    `;
    const source = document.querySelector('[data-page-content]');
    const slot = shell.querySelector('[data-page-slot]');
    if (source && slot) {
      slot.innerHTML = source.innerHTML;
      source.remove();
    }
  }

  function statCard(label, value, iconName, tone = '') {
    return `
      <div class="alm-card p-5">
        <div class="flex items-start justify-between gap-3">
          <span class="text-sm font-bold text-[var(--alm-muted)]">${label}</span>
          <span class="grid h-10 w-10 place-items-center rounded-xl ${tone === 'gold' ? 'bg-[rgba(197,154,69,.16)] text-[#7a5516]' : 'bg-[rgba(21,131,95,.10)] text-[var(--alm-green-800)]'}">${icon(iconName)}</span>
        </div>
        <b class="mt-4 block text-3xl">${value}</b>
      </div>
    `;
  }

  function courseCard(course) {
    return `
      <article class="alm-card flex h-full flex-col p-5 transition hover:-translate-y-1 hover:shadow-panel">
        <div class="flex items-start justify-between gap-3">
          <span class="alm-badge gold">${course.badge}</span>
          <span class="grid h-11 w-11 place-items-center rounded-xl bg-[var(--alm-cream-100)] text-[var(--alm-green-800)]">${icon('book-open-check')}</span>
        </div>
        <h3 class="mt-5 text-xl font-black">${course.title}</h3>
        <p class="mt-2 flex-1 text-sm leading-7 text-[var(--alm-muted)]">${course.description}</p>
        <div class="mt-5 flex items-center justify-between text-xs font-bold text-[var(--alm-muted)]">
          <span>${course.lessons} درس</span>
          <span>${course.progress}%</span>
        </div>
        <div class="alm-progress mt-2"><span style="width:${course.progress}%"></span></div>
        <div class="mt-5 flex items-center justify-between">
          <span class="text-sm font-bold">${course.instructor}</span>
          <a class="alm-btn alm-btn-primary !min-h-10 !px-4" href="course-details.html">فتح المسار</a>
        </div>
      </article>
    `;
  }

  function lessonRow(lesson, index) {
    const statusMap = {
      completed: ['تم', 'badge-check', 'text-[var(--alm-success)]'],
      current: ['الحالي', 'play-circle', 'text-[var(--alm-gold-500)]'],
      locked: ['مغلق', 'lock', 'text-[var(--alm-muted)]']
    };
    const [status, iconName, color] = statusMap[lesson.status] || statusMap.locked;
    return `
      <a href="lesson.html" class="flex items-center justify-between gap-3 rounded-xl border border-[var(--alm-line)] bg-white p-3 transition hover:border-[var(--alm-gold-500)]">
        <div class="flex items-center gap-3">
          <span class="grid h-9 w-9 place-items-center rounded-lg bg-[var(--alm-cream-100)] text-sm font-black">${index + 1}</span>
          <span>
            <b class="block text-sm">${lesson.title}</b>
            <span class="text-xs text-[var(--alm-muted)]">${lesson.duration}</span>
          </span>
        </div>
        <span class="${color}">${icon(iconName)}</span>
      </a>
    `;
  }

  function timelineItem(item) {
    return `
      <div class="flex gap-3">
        <span class="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[rgba(21,131,95,.10)] text-[var(--alm-green-800)]">${icon(item.icon)}</span>
        <span>
          <b class="block text-sm">${item.title}</b>
          <span class="text-xs text-[var(--alm-muted)]">${item.time}</span>
        </span>
      </div>
    `;
  }

  function leaderboardItem(item) {
    return `
      <div class="flex items-center justify-between rounded-xl bg-white p-3">
        <div class="flex items-center gap-3">
          <span class="grid h-10 w-10 place-items-center rounded-full ${item.rank === 1 ? 'bg-[var(--alm-gold-300)] text-[var(--alm-green-950)]' : 'bg-[var(--alm-cream-100)]'} font-black">${item.rank}</span>
          <span>
            <b class="block text-sm">${item.name}</b>
            <span class="text-xs text-[var(--alm-muted)]">${item.city}</span>
          </span>
        </div>
        <b>${item.points.toLocaleString('en-US')}</b>
      </div>
    `;
  }

  function renderCourses(selector = '[data-courses]', courses = data.courses || []) {
    document.querySelectorAll(selector).forEach(el => {
      el.innerHTML = courses.map(courseCard).join('');
    });
  }

  function renderLessons(selector = '[data-lessons]') {
    document.querySelectorAll(selector).forEach(el => {
      el.innerHTML = (data.lessons || []).map(lessonRow).join('');
    });
  }

  function renderActivity(selector = '[data-activity]') {
    document.querySelectorAll(selector).forEach(el => {
      el.innerHTML = (data.activity || []).map(timelineItem).join('');
    });
  }

  function renderLeaderboard(selector = '[data-leaderboard]') {
    document.querySelectorAll(selector).forEach(el => {
      el.innerHTML = (data.leaderboard || []).map(leaderboardItem).join('');
    });
  }

  function renderStats(selector = '[data-stats]') {
    const stats = data.stats || {};
    const cards = [
      ['الطلاب', stats.students || 1000, 'graduation-cap'],
      ['المعلمون', stats.teachers || 200, 'users-round'],
      ['المسارات', stats.courses || 42, 'library'],
      ['الشهادات', stats.certificates || 1300, 'award', 'gold']
    ];
    document.querySelectorAll(selector).forEach(el => {
      el.innerHTML = cards.map(card => statCard(...card)).join('');
    });
  }

  function initTabs() {
    document.querySelectorAll('[data-tabs]').forEach(group => {
      group.addEventListener('click', event => {
        const button = event.target.closest('[data-tab-target]');
        if (!button) return;
        const target = button.dataset.tabTarget;
        group.querySelectorAll('[data-tab-target]').forEach(btn => btn.classList.toggle('alm-btn-primary', btn === button));
        document.querySelectorAll('[data-tab-panel]').forEach(panel => panel.classList.toggle('active', panel.dataset.tabPanel === target));
      });
    });
  }

  /* ============== محرّك الاختبار التفاعلي ============== */
  function initQuiz(selector = '[data-quiz]') {
    const root = document.querySelector(selector);
    const quiz = data.quiz;
    if (!root || !quiz) return;

    const state = { i: 0, answers: Array(quiz.questions.length).fill(null), left: quiz.duration, started: Date.now() };

    function fmt(sec) {
      const m = String(Math.floor(sec / 60)).padStart(2, '0');
      const s = String(sec % 60).padStart(2, '0');
      return `${m}:${s}`;
    }

    function letters(idx) { return ['أ', 'ب', 'ج', 'د', 'هـ'][idx] || idx + 1; }

    function render() {
      const q = quiz.questions[state.i];
      const total = quiz.questions.length;
      const answered = state.answers.filter(a => a !== null).length;
      const pct = Math.round(((state.i) / total) * 100);
      const opts = q.options.map((opt, idx) => {
        const sel = state.answers[state.i] === idx;
        return `
          <button data-opt="${idx}" class="alm-quiz-opt flex w-full items-center justify-between gap-3 rounded-xl border p-4 text-start font-bold transition ${sel ? 'border-[var(--alm-green-600)] bg-[rgba(21,131,95,.10)]' : 'border-[var(--alm-line)] bg-white hover:border-[var(--alm-gold-500)]'}">
            <span class="flex items-center gap-3"><span class="grid h-7 w-7 place-items-center rounded-lg ${sel ? 'bg-[var(--alm-green-700)] text-white' : 'bg-[var(--alm-cream-100)]'} text-sm">${letters(idx)}</span><span>${opt}</span></span>
            ${sel ? icon('check-circle', 'h-5 w-5 text-[var(--alm-green-700)]') : ''}
          </button>`;
      }).join('');

      root.innerHTML = `
        <div class="mb-5 flex items-center justify-between gap-3">
          <div><span class="alm-badge gold">${quiz.title}</span><h1 class="mt-3 text-2xl font-black md:text-3xl">السؤال ${state.i + 1} من ${total}</h1></div>
          <span class="flex items-center gap-2 rounded-xl bg-white px-4 py-3 font-bold shadow-card" data-timer><i data-lucide="timer" class="h-5 w-5 text-[var(--alm-gold-500)]"></i> ${fmt(state.left)}</span>
        </div>
        <div class="alm-panel p-6 md:p-8">
          <div class="mb-7 flex items-center justify-between gap-4 text-xs font-bold text-[var(--alm-muted)]">
            <span>أجبت ${answered}/${total}</span><div class="alm-progress w-full max-w-xs"><span style="width:${pct}%"></span></div><span>${total} أسئلة</span>
          </div>
          <h2 class="text-xl font-black leading-9">${q.q}</h2>
          <div class="mt-6 space-y-3">${opts}</div>
          <div class="mt-8 flex justify-between gap-3">
            <button class="alm-btn alm-btn-secondary" data-prev ${state.i === 0 ? 'disabled style="opacity:.5"' : ''}>${icon('chevron-right')} السابق</button>
            <button class="alm-btn alm-btn-primary" data-next>${state.i === total - 1 ? 'إنهاء الاختبار' : 'السؤال التالي'} ${icon('chevron-left')}</button>
          </div>
        </div>`;
      if (window.lucide) window.lucide.createIcons();
    }

    function finish() {
      clearInterval(timer);
      let correct = 0;
      state.answers.forEach((a, i) => { if (a === quiz.questions[i].answer) correct++; });
      const spent = Math.min(quiz.duration, Math.round((Date.now() - state.started) / 1000));
      const result = {
        correct,
        total: quiz.questions.length,
        wrong: quiz.questions.length - correct,
        percent: Math.round((correct / quiz.questions.length) * 100),
        time: fmt(spent),
        passed: Math.round((correct / quiz.questions.length) * 100) >= quiz.pass,
        answers: state.answers,
        title: quiz.title,
      };
      try { localStorage.setItem('alm_quiz_result', JSON.stringify(result)); } catch (e) {}
      window.location.href = 'result.html';
    }

    root.addEventListener('click', e => {
      const opt = e.target.closest('[data-opt]');
      if (opt) { state.answers[state.i] = Number(opt.dataset.opt); render(); return; }
      if (e.target.closest('[data-prev]')) { if (state.i > 0) { state.i--; render(); } return; }
      if (e.target.closest('[data-next]')) {
        if (state.i < quiz.questions.length - 1) { state.i++; render(); }
        else finish();
      }
    });

    const timer = setInterval(() => {
      state.left--;
      const el = root.querySelector('[data-timer]');
      if (el) el.innerHTML = `<i data-lucide="timer" class="h-5 w-5 text-[var(--alm-gold-500)]"></i> ${fmt(state.left)}`;
      if (window.lucide) window.lucide.createIcons();
      if (state.left <= 0) finish();
    }, 1000);

    render();
  }

  /* ============== صفحة النتيجة الديناميكية ============== */
  function renderResult(selector = '[data-result]') {
    const root = document.querySelector(selector);
    if (!root) return;
    let r;
    try { r = JSON.parse(localStorage.getItem('alm_quiz_result')); } catch (e) {}
    if (!r) r = { correct: 8, total: 10, wrong: 2, percent: 80, time: '08:35', passed: true, title: 'اختبار سورة النبأ', answers: [] };
    const grade = r.percent >= 90 ? 'نتيجة ممتازة' : r.percent >= 75 ? 'نتيجة جيدة جداً' : r.percent >= 60 ? 'نتيجة جيدة' : 'تحتاج مراجعة';
    const cards = [
      ['النسبة المئوية', r.percent + '%'],
      ['إجابات صحيحة', r.correct],
      ['إجابات خاطئة', r.wrong],
      ['الوقت المستغرق', r.time],
    ];
    root.innerHTML = `
      <span class="alm-badge gold">نتيجة الاختبار</span>
      <h1 class="mt-4 text-4xl font-black">${r.title || 'نتيجة الاختبار'}</h1>
      <div class="mx-auto mt-8 grid h-48 w-48 place-items-center rounded-full border-[12px] ${r.passed ? 'border-[var(--alm-gold-500)]' : 'border-[var(--alm-danger)]'} bg-[var(--alm-green-950)] text-white shadow-panel">
        <div><p class="font-bold text-[var(--alm-gold-300)]">${grade}</p><b class="text-5xl">${r.correct} / ${r.total}</b></div>
      </div>
      <h2 class="mt-8 text-2xl font-black">${r.passed ? 'أحسنت! لقد اجتزت الاختبار بنجاح' : 'لا بأس، أعد المحاولة بعد المراجعة'}</h2>
      <p class="mt-2 text-[var(--alm-muted)]">استمر في رحلتك القرآنية</p>
      <div class="mx-auto mt-8 grid max-w-4xl gap-4 md:grid-cols-4">
        ${cards.map(([l, v]) => `<div class="alm-card p-5"><span class="text-sm text-[var(--alm-muted)]">${l}</span><b class="mt-2 block text-3xl">${v}</b></div>`).join('')}
      </div>
      <div class="mt-8 flex flex-wrap justify-center gap-3">
        <a class="alm-btn alm-btn-secondary" href="quiz.html">${icon('rotate-ccw')} إعادة الاختبار</a>
        <a class="alm-btn alm-btn-primary" href="${r.passed ? 'certificates.html' : 'tafsir-reader.html'}">${r.passed ? 'متابعة الدرس التالي' : 'العودة للتفسير'} ${icon('arrow-left')}</a>
      </div>`;
    if (window.lucide) window.lucide.createIcons();
  }

  /* ============== التفسير التفاعلي آية بآية ============== */
  function initTafsir() {
    const list = document.querySelector('[data-verse-list]');
    const body = document.querySelector('[data-verse-body]');
    const verses = data.nabaVerses || [];
    if (!list || !body || !verses.length) return;
    const arNum = n => n.toLocaleString('ar-EG');

    list.innerHTML = verses.map((v, i) => `
      <button data-verse="${i}" class="alm-verse-link w-full rounded-xl p-3 text-start text-sm font-bold transition ${i === 0 ? 'bg-[rgba(197,154,69,.18)]' : 'bg-white hover:bg-[var(--alm-cream-100)]'}">
        <span class="text-[var(--alm-gold-500)]">${arNum(v.n)}</span> ${v.text}
      </button>`).join('');

    function show(idx) {
      const v = verses[idx];
      body.innerHTML = `
        <div class="alm-fade-in rounded-2xl bg-white p-6 md:p-8">
          <div class="flex items-center justify-between">
            <span class="alm-badge gold">الآية ${arNum(v.n)} من ${arNum(40)}</span>
            <button class="rounded-lg border border-[var(--alm-line)] bg-white p-2" data-toast="تم نسخ الآية">${icon('copy', 'h-4 w-4')}</button>
          </div>
          <h2 class="mt-5 font-quran text-4xl font-bold leading-loose">${v.text}</h2>
          <div class="mt-5 rounded-xl bg-[var(--alm-cream-100)] p-5"><b class="text-[var(--alm-green-800)]">التفسير</b><p class="mt-2 leading-9">${v.t}</p></div>
          <div class="mt-5 flex flex-wrap gap-3">
            <button class="alm-btn alm-btn-secondary" data-toast="تم حفظ الملاحظة">${icon('bookmark')} حفظ الملاحظة</button>
            <button class="alm-btn alm-btn-primary" data-verse-next>${icon('arrow-left')} الآية التالية</button>
          </div>
        </div>`;
      list.querySelectorAll('[data-verse]').forEach(b => {
        const on = Number(b.dataset.verse) === idx;
        b.classList.toggle('bg-[rgba(197,154,69,.18)]', on);
        b.classList.toggle('bg-white', !on);
      });
      if (window.lucide) window.lucide.createIcons();
      window.__almVerse = idx;
    }

    list.addEventListener('click', e => {
      const btn = e.target.closest('[data-verse]');
      if (btn) show(Number(btn.dataset.verse));
    });
    body.addEventListener('click', e => {
      if (e.target.closest('[data-verse-next]')) {
        const next = Math.min(verses.length - 1, (window.__almVerse || 0) + 1);
        show(next);
      }
    });
    show(0);
  }

  /* ============== الخريطة الذهنية ============== */
  function renderMindmap(selector = '[data-mindmap]') {
    const root = document.querySelector(selector);
    const map = data.nabaMindmap;
    if (!root || !map) return;
    root.innerHTML = `
      <div class="grid place-items-center gap-6">
        <div class="grid h-32 w-32 place-items-center rounded-full bg-[var(--alm-green-800)] text-center text-lg font-black text-white shadow-panel">${map.center}</div>
        <div class="grid w-full gap-4 md:grid-cols-2 xl:grid-cols-4">
          ${map.nodes.map((node, i) => `
            <div class="alm-card alm-fade-in p-5" style="animation-delay:${i * 80}ms">
              <div class="mb-3 flex items-center gap-2"><span class="grid h-8 w-8 place-items-center rounded-lg bg-[rgba(197,154,69,.18)] text-[#7a5516]">${icon('git-branch', 'h-4 w-4')}</span><b>${node.title}</b></div>
              <ul class="space-y-2">${node.items.map(it => `<li class="flex items-center gap-2 rounded-lg bg-[var(--alm-cream-100)] px-3 py-2 text-sm font-bold"><span class="h-2 w-2 rounded-full bg-[var(--alm-gold-500)]"></span>${it}</li>`).join('')}</ul>
            </div>`).join('')}
        </div>
      </div>`;
    if (window.lucide) window.lucide.createIcons();
  }

  /* ============== فلترة المكتبة حسب التصنيف ============== */
  function initCourseFilter(selector = '[data-filter-group]') {
    const group = document.querySelector(selector);
    if (!group) return;
    group.addEventListener('click', e => {
      const btn = e.target.closest('[data-filter]');
      if (!btn) return;
      const cat = btn.dataset.filter;
      group.querySelectorAll('[data-filter]').forEach(b => {
        b.classList.toggle('alm-btn-primary', b === btn);
        b.classList.toggle('alm-btn-secondary', b !== btn);
      });
      const list = (data.courses || []).filter(c => cat === 'all' || c.category === cat);
      renderCourses('[data-courses]', list);
      if (window.lucide) window.lucide.createIcons();
    });
  }

  /* ============== رافع الملفات والفيديوهات التفاعلي ============== */
  function initUploader(selector = '[data-uploader]') {
    const root = document.querySelector(selector);
    if (!root) return;

    const MAX = { video: 500, pdf: 50, image: 10, audio: 100 }; // ميجابايت
    const accept = 'video/*,application/pdf,image/*,audio/*';
    const files = [];
    let seq = 0;

    function human(bytes) {
      if (bytes < 1024) return bytes + ' B';
      if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
      if (bytes < 1073741824) return (bytes / 1048576).toFixed(1) + ' MB';
      return (bytes / 1073741824).toFixed(2) + ' GB';
    }
    function kind(f) {
      if (f.type.startsWith('video/')) return 'video';
      if (f.type.startsWith('image/')) return 'image';
      if (f.type.startsWith('audio/')) return 'audio';
      if (f.type === 'application/pdf') return 'pdf';
      return 'other';
    }
    const iconFor = { video: 'film', image: 'image', audio: 'music', pdf: 'file-text', other: 'file' };

    root.innerHTML = `
      <div data-drop class="grid place-items-center rounded-2xl border-2 border-dashed border-[var(--alm-line)] bg-[var(--alm-cream-50)] p-8 text-center transition cursor-pointer">
        <span class="grid h-16 w-16 place-items-center rounded-2xl bg-[rgba(21,131,95,.10)] text-[var(--alm-green-800)]">${icon('upload-cloud', 'h-8 w-8')}</span>
        <b class="mt-4 block text-lg">اسحب الملفات هنا أو اضغط للاختيار</b>
        <p class="mt-1 text-sm text-[var(--alm-muted)]">فيديو حتى ${MAX.video}MB · PDF حتى ${MAX.pdf}MB · صور وصوتيات</p>
        <div class="mt-4 flex flex-wrap justify-center gap-2">
          <span class="alm-badge">${icon('film', 'h-4 w-4')} MP4</span>
          <span class="alm-badge">${icon('file-text', 'h-4 w-4')} PDF</span>
          <span class="alm-badge">${icon('image', 'h-4 w-4')} JPG/PNG</span>
          <span class="alm-badge">${icon('music', 'h-4 w-4')} MP3</span>
        </div>
        <input type="file" multiple accept="${accept}" class="hidden" data-input />
      </div>
      <div class="mt-5 hidden items-center justify-between" data-bulk>
        <span class="text-sm font-bold text-[var(--alm-muted)]"><span data-count>0</span> ملف · <span data-size>0</span></span>
        <button class="alm-btn alm-btn-primary" data-publish>${icon('send')} نشر الدرس</button>
      </div>
      <div class="mt-4 space-y-3" data-list></div>`;
    if (window.lucide) window.lucide.createIcons();

    const drop = root.querySelector('[data-drop]');
    const input = root.querySelector('[data-input]');
    const list = root.querySelector('[data-list]');
    const bulk = root.querySelector('[data-bulk]');

    function refreshBulk() {
      const active = files.filter(f => !f.removed);
      bulk.classList.toggle('hidden', active.length === 0);
      bulk.classList.toggle('flex', active.length > 0);
      root.querySelector('[data-count]').textContent = active.length;
      root.querySelector('[data-size]').textContent = human(active.reduce((s, f) => s + f.file.size, 0));
    }

    function rowHTML(item) {
      const k = item.kind;
      const over = item.error;
      const preview = (k === 'video' || k === 'image') && item.url
        ? (k === 'video'
            ? `<video src="${item.url}" controls class="mt-3 w-full max-h-64 rounded-xl bg-black"></video>`
            : `<img src="${item.url}" class="mt-3 max-h-48 rounded-xl" />`)
        : '';
      return `
        <div class="alm-card p-4" data-row="${item.id}">
          <div class="flex items-center gap-3">
            <span class="grid h-11 w-11 place-items-center rounded-xl ${over ? 'bg-[rgba(180,35,24,.10)] text-[var(--alm-danger)]' : 'bg-[var(--alm-cream-100)] text-[var(--alm-green-800)]'}">${icon(iconFor[k], 'h-5 w-5')}</span>
            <div class="min-w-0 flex-1">
              <b class="block truncate text-sm">${item.file.name}</b>
              <span class="text-xs text-[var(--alm-muted)]">${human(item.file.size)} · ${k.toUpperCase()}</span>
            </div>
            <button class="rounded-lg p-2 text-[var(--alm-muted)] hover:text-[var(--alm-danger)]" data-remove="${item.id}">${icon('trash-2', 'h-4 w-4')}</button>
          </div>
          ${over
            ? `<p class="mt-3 flex items-center gap-2 rounded-lg bg-[rgba(180,35,24,.08)] p-2 text-xs font-bold text-[var(--alm-danger)]">${icon('alert-triangle', 'h-4 w-4')} ${item.error}</p>`
            : `<div class="mt-3 flex items-center gap-3"><div class="alm-progress flex-1"><span data-bar style="width:${item.pct}%"></span></div><span class="w-24 text-end text-xs font-bold ${item.pct >= 100 ? 'text-[var(--alm-success)]' : 'text-[var(--alm-muted)]'}" data-pct>${item.pct >= 100 ? 'اكتمل ✓' : item.pct + '%'}</span></div>${preview}`}
        </div>`;
    }

    function addFiles(fileList) {
      [...fileList].forEach(file => {
        const k = kind(file);
        const limit = (MAX[k] || 50) * 1048576;
        const item = { id: ++seq, file, kind: k, pct: 0, removed: false, error: null, url: null };
        if (k === 'other') item.error = 'نوع غير مدعوم — استخدم فيديو أو PDF أو صورة أو صوت.';
        else if (file.size > limit) item.error = `حجم كبير جداً — الحد ${MAX[k]}MB لهذا النوع.`;
        else if (k === 'video' || k === 'image') { try { item.url = URL.createObjectURL(file); } catch (e) {} }
        files.push(item);
        list.insertAdjacentHTML('beforeend', rowHTML(item));
        if (window.lucide) window.lucide.createIcons();
        if (!item.error) simulate(item);
      });
      refreshBulk();
    }

    function simulate(item) {
      const tick = setInterval(() => {
        item.pct = Math.min(100, item.pct + Math.random() * 18 + 6);
        const row = list.querySelector(`[data-row="${item.id}"]`);
        if (!row) { clearInterval(tick); return; }
        const bar = row.querySelector('[data-bar]');
        const pct = row.querySelector('[data-pct]');
        if (bar) bar.style.width = item.pct + '%';
        if (pct) {
          const done = item.pct >= 100;
          pct.textContent = done ? 'اكتمل ✓' : Math.round(item.pct) + '%';
          pct.className = 'w-24 text-end text-xs font-bold ' + (done ? 'text-[var(--alm-success)]' : 'text-[var(--alm-muted)]');
        }
        if (item.pct >= 100) clearInterval(tick);
      }, 320);
    }

    // drag & drop
    ['dragenter', 'dragover'].forEach(ev => drop.addEventListener(ev, e => {
      e.preventDefault();
      drop.classList.add('border-[var(--alm-gold-500)]', 'bg-[rgba(197,154,69,.08)]');
    }));
    ['dragleave', 'drop'].forEach(ev => drop.addEventListener(ev, e => {
      e.preventDefault();
      drop.classList.remove('border-[var(--alm-gold-500)]', 'bg-[rgba(197,154,69,.08)]');
    }));
    drop.addEventListener('drop', e => { if (e.dataTransfer?.files?.length) addFiles(e.dataTransfer.files); });
    drop.addEventListener('click', () => input.click());
    input.addEventListener('change', () => { if (input.files.length) addFiles(input.files); input.value = ''; });

    list.addEventListener('click', e => {
      const btn = e.target.closest('[data-remove]');
      if (!btn) return;
      const id = Number(btn.dataset.remove);
      const item = files.find(f => f.id === id);
      if (item) { item.removed = true; if (item.url) URL.revokeObjectURL(item.url); }
      list.querySelector(`[data-row="${id}"]`)?.remove();
      refreshBulk();
    });

    root.querySelector('[data-publish]').addEventListener('click', () => {
      const ready = files.filter(f => !f.removed && !f.error);
      if (!ready.length) { showToast('أضِف ملفاً واحداً صالحاً على الأقل'); return; }
      showToast(`تم رفع ${ready.length} ملف ونشر الدرس بنجاح`);
    });
  }

  /* ============================================================
     محرّك الداشبورد — يحسب كل الإحصائيات من البيانات
     ============================================================ */
  function getDashStats() {
    const lectures  = data.lectures || [];
    const cats      = CatStore.all();
    const students  = data.students || [];
    const lb        = data.leaderboard || [];
    const activity  = data.activity || [];
    const stats     = data.stats || {};

    const published = lectures.filter(l => l.status === 'published');
    const drafts    = lectures.filter(l => l.status === 'draft');
    const reviews   = lectures.filter(l => l.status === 'review');
    const totalStudents = lectures.reduce((s, l) => s + (l.students || 0), 0) || stats.students || 1000;

    const byCategory = cats.map(c => ({
      ...c,
      total:     lectures.filter(l => l.category === c.id).length,
      published: lectures.filter(l => l.category === c.id && l.status === 'published').length,
      students:  lectures.filter(l => l.category === c.id).reduce((s, l) => s + (l.students || 0), 0),
    })).filter(c => c.total > 0).sort((a, b) => b.total - a.total);

    const recent = [...lectures].sort((a, b) =>
      (b.publishedAt || '').localeCompare(a.publishedAt || '')).slice(0, 6);

    let lastResult = null;
    try { lastResult = JSON.parse(localStorage.getItem('alm_quiz_result')); } catch {}

    const avgScore = lastResult ? lastResult.percent : 80;

    return {
      lectures, published, drafts, reviews, recent,
      totalLectures: lectures.length,
      totalPublished: published.length,
      totalDrafts: drafts.length,
      totalReviews: reviews.length,
      byCategory,
      totalStudents: stats.students || 250000,
      totalTeachers: stats.teachers || 3000,
      totalCerts:    stats.certificates || 1300,
      totalQuizzes:  stats.completedQuizzes || 7200,
      avgScore,
      lastResult,
      students,
      leaderboard: lb,
      activity,
      liveStats: data.liveStats || [],
    };
  }

  /* ============================================================
     داشبورد الإدارة الشامل
     ============================================================ */
  function renderMainDashboard(selector = '[data-main-dashboard]') {
    const root = document.querySelector(selector);
    if (!root) return;
    const s = getDashStats();
    const maxCat = Math.max(...s.byCategory.map(c => c.total), 1);

    const statusBadge = st => ({ published: `<span class="alm-badge text-xs">منشور</span>`, review: `<span class="alm-badge gold text-xs">مراجعة</span>`, draft: `<span class="text-xs text-[var(--alm-muted)] font-bold">مسودة</span>` }[st] || '');
    const srcBadge = vt => vt === 'youtube'
      ? `<span class="flex items-center gap-1 text-xs font-bold text-[#cc0000]">${icon('youtube','h-3.5 w-3.5')} يوتيوب</span>`
      : `<span class="flex items-center gap-1 text-xs font-bold text-[var(--alm-muted)]">${icon('hard-drive','h-3.5 w-3.5')} محلي</span>`;

    root.innerHTML = `
    <!-- KPI cards -->
    <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-6 mb-6">
      ${[
        ['المحاضرات الكل',   s.totalLectures,  'video',           'bg-[rgba(21,131,95,.10)] text-[var(--alm-green-800)]'],
        ['منشورة',           s.totalPublished, 'circle-check',    'bg-[rgba(19,119,90,.10)] text-[var(--alm-success)]'],
        ['الطلاب',           s.totalStudents.toLocaleString('ar-EG'), 'users','bg-[rgba(197,154,69,.14)] text-[#7a5516]'],
        ['المعلمون',         s.totalTeachers.toLocaleString('ar-EG'),'presentation','bg-[rgba(21,131,95,.10)] text-[var(--alm-green-800)]'],
        ['الاختبارات',       s.totalQuizzes.toLocaleString('ar-EG'), 'circle-help','bg-[rgba(197,154,69,.14)] text-[#7a5516]'],
        ['متوسط النتائج',    s.avgScore+'%',   'chart-no-axes-gantt','bg-[rgba(19,119,90,.10)] text-[var(--alm-success)]'],
      ].map(([lbl,val,ic,bg]) => `
        <div class="alm-card p-5">
          <div class="flex items-start justify-between gap-2">
            <span class="text-sm font-bold text-[var(--alm-muted)]">${lbl}</span>
            <span class="grid h-9 w-9 shrink-0 place-items-center rounded-xl ${bg}">${icon(ic,'h-4 w-4')}</span>
          </div>
          <b class="mt-3 block text-3xl leading-none">${val}</b>
        </div>`).join('')}
    </div>

    <div class="grid gap-5 xl:grid-cols-[1fr_360px] mb-5">
      <!-- المحاضرات حسب الفئة -->
      <div class="alm-panel p-6">
        <div class="mb-5 flex items-center justify-between">
          <div><span class="alm-badge gold">Analytics</span><h2 class="mt-2 text-2xl font-black">المحاضرات حسب الفئة</h2></div>
          <a class="alm-btn alm-btn-secondary !min-h-9 !px-3" href="lectures.html">${icon('arrow-left','h-4 w-4')} كل المحاضرات</a>
        </div>
        <div class="space-y-4">
          ${s.byCategory.map(c => `
          <div>
            <div class="mb-1 flex items-center justify-between gap-2">
              <span class="flex items-center gap-2 text-sm font-bold">
                <span class="grid h-7 w-7 place-items-center rounded-lg text-white" style="background:${c.color}">${icon(c.icon,'h-3.5 w-3.5')}</span>
                ${c.name}
              </span>
              <span class="text-xs font-bold text-[var(--alm-muted)]">${c.total} محاضرة · ${c.students.toLocaleString('ar-EG')} مشاهدة</span>
            </div>
            <div class="alm-progress h-3">
              <span style="width:${Math.round((c.total/maxCat)*100)}%"></span>
            </div>
          </div>`).join('')}
        </div>
        ${s.byCategory.length === 0 ? `<p class="py-8 text-center text-[var(--alm-muted)]">لا توجد محاضرات بعد.</p>` : ''}
      </div>

      <!-- الحالات + مسودات -->
      <div class="space-y-4">
        ${[
          ['منشورة', s.totalPublished, 'circle-check', 'var(--alm-success)', s.totalLectures],
          ['قيد المراجعة', s.totalReviews, 'clock', 'var(--alm-warning)', s.totalLectures],
          ['مسودات', s.totalDrafts, 'file', 'var(--alm-muted)', s.totalLectures],
        ].map(([lbl,val,ic,clr,tot]) => `
        <div class="alm-card p-4">
          <div class="flex items-center gap-3">
            <span class="grid h-10 w-10 place-items-center rounded-xl bg-[rgba(21,131,95,.08)]" style="color:${clr}">${icon(ic,'h-5 w-5')}</span>
            <span class="flex-1">
              <b class="block text-sm">${lbl}</b>
              <div class="mt-1 flex items-center gap-2"><div class="alm-progress flex-1"><span style="width:${tot?Math.round((val/tot)*100):0}%"></span></div><span class="text-xs font-bold">${val}</span></div>
            </span>
          </div>
        </div>`).join('')}
        <div class="alm-panel p-4 bg-[var(--alm-green-950)] text-white">
          <h3 class="font-black mb-3">إجراءات سريعة</h3>
          <div class="space-y-2">
            <a href="upload.html" class="alm-btn alm-btn-gold w-full justify-center">${icon('upload-cloud','h-4 w-4')} رفع محاضرة</a>
            <a href="categories.html" class="alm-btn border border-white/15 bg-white/10 text-white w-full justify-center">${icon('folders','h-4 w-4')} إدارة الفئات</a>
            <a href="quiz.html" class="alm-btn border border-white/15 bg-white/10 text-white w-full justify-center">${icon('circle-help','h-4 w-4')} بدء اختبار</a>
          </div>
        </div>
      </div>
    </div>

    <!-- آخر المحاضرات + نتائج الاختبارات + المتصدّرون -->
    <div class="grid gap-5 xl:grid-cols-[1fr_1fr_320px]">
      <!-- جدول آخر المحاضرات -->
      <div class="alm-panel p-5">
        <h3 class="mb-4 text-xl font-black">آخر المحاضرات</h3>
        <div class="space-y-3">
          ${s.recent.map(l => `
          <div class="flex items-center gap-3 rounded-xl border border-[var(--alm-line)] bg-white p-3">
            <span class="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[var(--alm-cream-100)] text-[var(--alm-green-800)]">${icon('video','h-4 w-4')}</span>
            <div class="min-w-0 flex-1">
              <b class="block truncate text-sm">${l.title}</b>
              <span class="text-xs text-[var(--alm-muted)]">${l.instructor} · ${l.duration}</span>
            </div>
            <div class="flex flex-col items-end gap-1">${statusBadge(l.status)}${srcBadge(l.videoType)}</div>
          </div>`).join('')}
          ${s.recent.length===0?`<p class="py-6 text-center text-sm text-[var(--alm-muted)]">لا توجد محاضرات.</p>`:''}
        </div>
      </div>

      <!-- نتائج الاختبارات -->
      <div class="alm-panel p-5">
        <h3 class="mb-4 text-xl font-black">الاختبارات والنتائج</h3>
        ${s.lastResult ? `
        <div class="mb-4 rounded-2xl border border-[var(--alm-line)] bg-white p-4 text-center">
          <span class="alm-badge gold mb-2">آخر نتيجة · ${s.lastResult.title || 'اختبار'}</span>
          <div class="mx-auto my-3 grid h-24 w-24 place-items-center rounded-full border-8 ${s.lastResult.passed?'border-[var(--alm-gold-500)]':'border-[var(--alm-danger)]'} bg-[var(--alm-green-950)] text-white">
            <b class="text-2xl">${s.lastResult.correct}/${s.lastResult.total}</b>
          </div>
          <div class="grid grid-cols-3 gap-3 text-center text-sm">
            <div><b class="block text-lg text-[var(--alm-success)]">${s.lastResult.correct}</b><span class="text-[var(--alm-muted)]">صحيح</span></div>
            <div><b class="block text-lg text-[var(--alm-danger)]">${s.lastResult.wrong}</b><span class="text-[var(--alm-muted)]">خطأ</span></div>
            <div><b class="block text-lg">${s.lastResult.percent}%</b><span class="text-[var(--alm-muted)]">النسبة</span></div>
          </div>
        </div>` : `<div class="mb-4 rounded-2xl bg-[var(--alm-cream-100)] p-6 text-center text-sm text-[var(--alm-muted)]">${icon('circle-help','h-8 w-8 mx-auto mb-2')} لم تُجرِ اختباراً بعد.</div>`}
        <div class="space-y-3">
          ${[
            ['اختبار سورة النبأ',    '10 أسئلة', s.lastResult?.percent+'%' || '—', s.lastResult?.passed],
            ['اختبار النحو التطبيقي','8 أسئلة', '75%', true],
            ['اختبار فقه الطهارة',  '12 سؤالاً','60%', true],
          ].map(([t,q,sc,passed]) => `
          <div class="flex items-center justify-between rounded-xl border border-[var(--alm-line)] bg-white p-3 text-sm">
            <span><b class="block">${t}</b><span class="text-xs text-[var(--alm-muted)]">${q}</span></span>
            <span class="font-black ${passed?'text-[var(--alm-success)]':'text-[var(--alm-danger)]'}">${sc}</span>
          </div>`).join('')}
        </div>
        <a href="quiz.html" class="alm-btn alm-btn-primary mt-4 w-full justify-center">${icon('plus','h-4 w-4')} اختبار جديد</a>
      </div>

      <!-- المتصدّرون -->
      <div class="alm-panel p-5">
        <h3 class="mb-4 text-xl font-black">المتصدّرون</h3>
        <div class="space-y-3">
          ${s.leaderboard.map((item,i) => `
          <div class="flex items-center gap-3 rounded-xl p-3 ${i===0?'bg-[rgba(197,154,69,.12)]':'bg-white'}">
            <span class="grid h-9 w-9 shrink-0 place-items-center rounded-full font-black text-sm ${i===0?'bg-[var(--alm-gold-500)] text-[var(--alm-green-950)]':i===1?'bg-[var(--alm-cream-200)]':i===2?'bg-[rgba(197,154,69,.25)]':'bg-[var(--alm-cream-100)]'}">${item.rank}</span>
            <div class="flex-1 min-w-0"><b class="block truncate text-sm">${item.name}</b><span class="text-xs text-[var(--alm-muted)]">${item.city}</span></div>
            <b class="text-sm">${Number(item.points).toLocaleString('ar-EG')}</b>
          </div>`).join('')}
        </div>
        <a href="leaderboard.html" class="alm-btn alm-btn-secondary mt-4 w-full justify-center">${icon('bar-chart-3','h-4 w-4')} كل المتصدّرين</a>
      </div>
    </div>`;

    if (window.lucide) window.lucide.createIcons();
  }

  /* ============================================================
     داشبورد الطالب الشخصي
     ============================================================ */
  function renderStudentDashboard(selector = '[data-student-dashboard]') {
    const root = document.querySelector(selector);
    if (!root) return;
    const s   = getDashStats();
    const usr = data.currentUser || {};
    const lec = s.lectures.filter(l => l.status === 'published');
    const cats = CatStore.all();

    root.innerHTML = `
    <!-- تحيّة + كروت شخصية -->
    <div class="mb-5 alm-panel p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[var(--alm-green-950)] text-white overflow-hidden relative">
      <div class="alm-pattern absolute inset-0 opacity-10"></div>
      <div class="relative z-10">
        <span class="alm-badge mb-2" style="background:rgba(234,216,163,.2);color:#ead8a3">رحلتك القرآنية</span>
        <h1 class="text-2xl font-black">مرحباً، ${usr.name || 'محمود أحمد'} 👋</h1>
        <p class="mt-1 text-sm text-white/70">أنت في مرحلة <b class="text-[var(--alm-gold-300)]">${usr.level || 'جزء عمّ'}</b> · واصل الرحلة!</p>
      </div>
      <div class="relative z-10 grid grid-cols-2 gap-3 md:flex md:gap-5">
        ${[
          ['تقدّمك', (usr.progress||73)+'%', 'chart-no-axes-gantt'],
          ['نقاطك',  (usr.points||3250).toLocaleString('ar-EG'), 'star'],
          ['الأيام المتتالية', (usr.streak||12)+' يوم', 'flame'],
        ].map(([l,v,ic])=>`
        <div class="text-center">
          <span class="grid h-9 w-9 place-items-center rounded-xl bg-white/10 mx-auto mb-1">${icon(ic,'h-4 w-4')}</span>
          <b class="block text-xl leading-none">${v}</b>
          <span class="text-xs text-white/60">${l}</span>
        </div>`).join('')}
      </div>
    </div>

    <div class="grid gap-5 xl:grid-cols-[1fr_340px]">
      <div class="space-y-5">
        <!-- آخر نتيجة اختبار -->
        ${s.lastResult ? `
        <div class="alm-panel p-5">
          <div class="flex items-center justify-between mb-3">
            <h2 class="text-xl font-black">آخر نتيجة اختبار</h2>
            <a href="result.html" class="alm-btn alm-btn-secondary !min-h-9 !px-3 text-xs">تفاصيل</a>
          </div>
          <div class="grid grid-cols-2 gap-3 md:grid-cols-4">
            ${[
              ['النتيجة', s.lastResult.correct+'/'+s.lastResult.total, s.lastResult.passed?'text-[var(--alm-success)]':'text-[var(--alm-danger)]'],
              ['النسبة',  s.lastResult.percent+'%',''],
              ['الوقت',   s.lastResult.time,''],
              ['الحالة',  s.lastResult.passed?'ناجح ✓':'راجع', s.lastResult.passed?'text-[var(--alm-success)]':'text-[var(--alm-warning)]'],
            ].map(([l,v,cl])=>`
            <div class="rounded-xl bg-[var(--alm-cream-100)] p-3 text-center">
              <b class="block text-2xl ${cl}">${v}</b>
              <span class="text-xs text-[var(--alm-muted)]">${l}</span>
            </div>`).join('')}
          </div>
          <div class="mt-3 flex gap-3">
            <a href="quiz.html"   class="alm-btn alm-btn-primary flex-1 justify-center">${icon('rotate-ccw','h-4 w-4')} اختبار جديد</a>
            <a href="tafsir-reader.html" class="alm-btn alm-btn-secondary flex-1 justify-center">${icon('book-open','h-4 w-4')} راجع التفسير</a>
          </div>
        </div>` : `
        <div class="alm-card p-5 flex items-center gap-4">
          <span class="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-[rgba(197,154,69,.14)] text-[#7a5516]">${icon('circle-help','h-7 w-7')}</span>
          <div class="flex-1"><b>لم تُجرِ اختباراً بعد</b><p class="mt-1 text-sm text-[var(--alm-muted)]">اختبر نفسك بعد مشاهدة أي محاضرة.</p></div>
          <a href="quiz.html" class="alm-btn alm-btn-primary">${icon('arrow-left','h-4 w-4')} ابدأ</a>
        </div>`}

        <!-- المحاضرات المتاحة -->
        <div class="alm-panel p-5">
          <div class="mb-4 flex items-center justify-between">
            <h2 class="text-xl font-black">المحاضرات المتاحة</h2>
            <a href="lectures.html" class="alm-btn alm-btn-secondary !min-h-9 !px-3 text-xs">${icon('arrow-left','h-4 w-4')} الكل</a>
          </div>
          <!-- فلترة سريعة بالفئة -->
          <div class="mb-4 flex flex-wrap gap-2" id="std-cat-filter">
            <button class="alm-btn alm-btn-primary !min-h-8 !px-3 !text-xs" data-scat="all">الكل (${lec.length})</button>
            ${cats.filter(c=>lec.some(l=>l.category===c.id)).map(c=>`
            <button class="alm-btn alm-btn-secondary !min-h-8 !px-3 !text-xs" data-scat="${c.id}">${c.name} (${lec.filter(l=>l.category===c.id).length})</button>`).join('')}
          </div>
          <div class="space-y-3" id="std-lec-list">
            ${lec.slice(0,5).map(l=>`
            <a href="lesson.html" class="flex items-center gap-3 rounded-xl border border-[var(--alm-line)] bg-white p-3 transition hover:border-[var(--alm-gold-500)]">
              <span class="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[var(--alm-green-900)] text-[var(--alm-gold-300)]">${icon('play','h-5 w-5 fill-current')}</span>
              <div class="min-w-0 flex-1">
                <b class="block truncate text-sm">${l.title}</b>
                <span class="text-xs text-[var(--alm-muted)]">${l.instructor} · ${l.duration} · ${l.type==='series'?l.seriesName:'مستقلّة'}</span>
              </div>
              <div class="flex flex-col items-end gap-1">
                ${l.videoType==='youtube'?`<span class="text-xs font-bold text-[#cc0000]">${icon('youtube','h-3.5 w-3.5 inline')} يوتيوب</span>`:``}
                ${l.attachments?.length?`<span class="text-xs text-[var(--alm-muted)]">${icon('paperclip','h-3 w-3 inline')} ${l.attachments.length}</span>`:''}
              </div>
            </a>`).join('')}
          </div>
        </div>
      </div>

      <!-- الجانب: التقدّم + الرحلة + النشاط -->
      <aside class="space-y-4">
        <div class="alm-panel p-5">
          <h3 class="mb-4 text-xl font-black">تقدّمك العام</h3>
          <div class="flex items-center gap-4">
            <div class="alm-ring" style="--value:${usr.progress||73}"><span>${usr.progress||73}%</span></div>
            <div>
              <b class="text-xl">${usr.level||'جزء عمّ'}</b>
              <p class="mt-1 text-sm text-[var(--alm-muted)]">المستوى الحالي</p>
              <div class="mt-2 flex flex-wrap gap-1">
                <span class="alm-badge text-xs">${icon('video','h-3 w-3')} ${lec.length} محاضرة</span>
                <span class="alm-badge gold text-xs">${icon('star','h-3 w-3')} ${usr.points||3250} نقطة</span>
              </div>
            </div>
          </div>
        </div>
        <div class="alm-panel p-5">
          <h3 class="mb-4 text-xl font-black">الرحلة القرآنية</h3>
          <div class="relative space-y-3 pe-10 before:absolute before:end-4 before:top-5 before:h-[calc(100%-2.5rem)] before:w-1 before:rounded-full before:bg-gradient-to-b before:from-[var(--alm-green-700)] before:to-[var(--alm-gold-500)]">
            ${[
              ['جزء عمّ', 'قيد التعلّم', true],
              ['الثلاثة الأجزاء الأولى','مغلق',false],
              ['ربع القرآن','مغلق',false],
              ['نصف القرآن','مغلق',false],
              ['القرآن كاملاً','مغلق',false],
            ].map(([t,sub,active],i)=>`
            <div class="relative rounded-xl p-3 ${active?'bg-[rgba(197,154,69,.14)]':'bg-white'}">
              <span class="absolute -end-9 top-3 grid h-7 w-7 place-items-center rounded-full text-sm font-black ${active?'bg-[var(--alm-gold-500)] text-[var(--alm-green-950)]':'bg-[var(--alm-green-800)] text-white'}">${i+1}</span>
              <b class="block text-sm">${t}</b>
              <span class="text-xs text-[var(--alm-muted)]">${sub}</span>
            </div>`).join('')}
          </div>
        </div>
        <div class="alm-panel p-5">
          <h3 class="mb-4 text-xl font-black">النشاط الأخير</h3>
          <div class="space-y-3">
            ${s.activity.map(a=>`
            <div class="flex gap-3">
              <span class="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[rgba(21,131,95,.10)] text-[var(--alm-green-800)]">${icon(a.icon,'h-4 w-4')}</span>
              <span><b class="block text-sm">${a.title}</b><span class="text-xs text-[var(--alm-muted)]">${a.time}</span></span>
            </div>`).join('')}
          </div>
        </div>
      </aside>
    </div>`;

    // فلترة محاضرات الطالب
    root.querySelector('#std-cat-filter')?.addEventListener('click', e => {
      const btn = e.target.closest('[data-scat]');
      if (!btn) return;
      root.querySelectorAll('[data-scat]').forEach(b => {
        b.classList.toggle('alm-btn-primary', b === btn);
        b.classList.toggle('alm-btn-secondary', b !== btn);
      });
      const cat = btn.dataset.scat;
      const filtered = cat === 'all' ? lec : lec.filter(l => l.category === cat);
      root.querySelector('#std-lec-list').innerHTML = filtered.slice(0,6).map(l=>`
        <a href="lesson.html" class="flex items-center gap-3 rounded-xl border border-[var(--alm-line)] bg-white p-3 transition hover:border-[var(--alm-gold-500)]">
          <span class="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[var(--alm-green-900)] text-[var(--alm-gold-300)]">${icon('play','h-5 w-5 fill-current')}</span>
          <div class="min-w-0 flex-1"><b class="block truncate text-sm">${l.title}</b><span class="text-xs text-[var(--alm-muted)]">${l.instructor} · ${l.duration}</span></div>
        </a>`).join('') || `<p class="py-4 text-center text-sm text-[var(--alm-muted)]">لا توجد محاضرات في هذه الفئة.</p>`;
      if (window.lucide) window.lucide.createIcons();
    });

    if (window.lucide) window.lucide.createIcons();
  }

  /* ============== صفحة إدارة الفئات (CRUD ديناميكي) ============== */
  function initCategoriesPage(selector = '[data-categories-page]') {
    const root = document.querySelector(selector);
    if (!root) return;

    const COLORS = [
      { hex: '#042a22', label: 'أخضر غامق جداً' },
      { hex: '#063b30', label: 'أخضر غامق' },
      { hex: '#0a4d3f', label: 'أخضر داكن' },
      { hex: '#0f6b52', label: 'أخضر متوسط' },
      { hex: '#15835f', label: 'أخضر فاتح' },
      { hex: '#c59a45', label: 'ذهبي' },
      { hex: '#7a5516', label: 'بني ذهبي' },
      { hex: '#1e40af', label: 'أزرق' },
      { hex: '#7c3aed', label: 'بنفسجي' },
      { hex: '#b91c1c', label: 'أحمر' },
    ];

    let editId = null; // null = إضافة جديدة، string = تعديل

    function renderList() {
      const cats = CatStore.all();
      const listEl = root.querySelector('[data-cat-list]');
      if (!listEl) return;
      listEl.innerHTML = cats.length ? cats.map(c => `
        <div class="alm-card flex items-center gap-4 p-4" data-cat-row="${c.id}">
          <span class="grid h-11 w-11 shrink-0 place-items-center rounded-xl text-white" style="background:${c.color}">
            <i data-lucide="${c.icon}" class="h-5 w-5"></i>
          </span>
          <div class="min-w-0 flex-1">
            <b class="block text-sm">${c.name}</b>
            <span class="block truncate text-xs text-[var(--alm-muted)]">${c.desc || '—'}</span>
          </div>
          ${c._default ? `<span class="alm-badge text-xs">افتراضية</span>` : ''}
          <div class="flex gap-2">
            <button class="rounded-lg border border-[var(--alm-line)] bg-white p-2 hover:border-[var(--alm-gold-500)]" data-edit="${c.id}" title="تعديل">
              <i data-lucide="pencil" class="h-4 w-4"></i>
            </button>
            <button class="rounded-lg border border-[var(--alm-line)] bg-white p-2 hover:border-[var(--alm-danger)] hover:text-[var(--alm-danger)]" data-delete="${c.id}" title="حذف">
              <i data-lucide="trash-2" class="h-4 w-4"></i>
            </button>
          </div>
        </div>`).join('')
        : `<div class="py-12 text-center text-[var(--alm-muted)]">${icon('inbox','h-10 w-10 mx-auto mb-3')} لا توجد فئات بعد.</div>`;
      if (window.lucide) window.lucide.createIcons();
    }

    function renderForm(catId) {
      const cats = CatStore.all();
      const cat = catId ? cats.find(c => c.id === catId) : null;
      const formEl = root.querySelector('[data-cat-form]');
      if (!formEl) return;
      const icons = CatStore.icons();
      const curIcon = cat?.icon || 'layers';
      const curColor = cat?.color || '#0a4d3f';
      formEl.innerHTML = `
        <h3 class="mb-4 text-lg font-black">${cat ? 'تعديل الفئة' : 'إضافة فئة جديدة'}</h3>
        <div class="space-y-4">
          <label class="block"><span class="mb-1 block text-sm font-bold">اسم الفئة <span class="text-[var(--alm-danger)]">*</span></span>
            <input class="alm-input" id="cat-name" placeholder="مثال: التجويد" value="${cat?.name || ''}" /></label>
          <label class="block"><span class="mb-1 block text-sm font-bold">وصف مختصر</span>
            <input class="alm-input" id="cat-desc" placeholder="وصف الفئة..." value="${cat?.desc || ''}" /></label>
          <div><span class="mb-2 block text-sm font-bold">الأيقونة</span>
            <div class="grid grid-cols-6 gap-2" id="icon-grid">
              ${icons.map(ic => `
                <button type="button" data-icon="${ic}" title="${ic}"
                  class="grid h-10 w-10 place-items-center rounded-xl border-2 transition ${ic === curIcon ? 'border-[var(--alm-gold-500)] bg-[rgba(197,154,69,.14)]' : 'border-[var(--alm-line)] bg-white hover:border-[var(--alm-gold-500)]'}">
                  <i data-lucide="${ic}" class="h-5 w-5"></i>
                </button>`).join('')}
            </div>
            <input type="hidden" id="cat-icon" value="${curIcon}" />
          </div>
          <div><span class="mb-2 block text-sm font-bold">اللون</span>
            <div class="flex flex-wrap gap-2" id="color-grid">
              ${COLORS.map(cl => `
                <button type="button" data-color="${cl.hex}" title="${cl.label}"
                  class="h-9 w-9 rounded-xl border-4 transition ${cl.hex === curColor ? 'border-[var(--alm-ink)] scale-110' : 'border-transparent hover:scale-105'}"
                  style="background:${cl.hex}"></button>`).join('')}
            </div>
            <input type="hidden" id="cat-color" value="${curColor}" />
          </div>
          <div class="flex gap-3 pt-2">
            <button id="cat-save" class="alm-btn alm-btn-primary flex-1">${icon('check')} ${cat ? 'حفظ التعديلات' : 'إضافة الفئة'}</button>
            <button id="cat-cancel" class="alm-btn alm-btn-secondary">${icon('x')} إلغاء</button>
          </div>
        </div>`;
      if (window.lucide) window.lucide.createIcons();
      bindForm(catId);
    }

    function bindForm(catId) {
      // اختيار الأيقونة
      root.querySelector('#icon-grid')?.addEventListener('click', e => {
        const btn = e.target.closest('[data-icon]');
        if (!btn) return;
        root.querySelectorAll('[data-icon]').forEach(b => {
          b.classList.toggle('border-[var(--alm-gold-500)]', b === btn);
          b.classList.toggle('bg-[rgba(197,154,69,.14)]', b === btn);
          b.classList.toggle('border-[var(--alm-line)]', b !== btn);
        });
        const hidIco = root.querySelector('#cat-icon');
        if (hidIco) hidIco.value = btn.dataset.icon;
      });
      // اختيار اللون
      root.querySelector('#color-grid')?.addEventListener('click', e => {
        const btn = e.target.closest('[data-color]');
        if (!btn) return;
        root.querySelectorAll('[data-color]').forEach(b => {
          b.classList.toggle('border-[var(--alm-ink)]', b === btn);
          b.classList.toggle('scale-110', b === btn);
          b.classList.toggle('border-transparent', b !== btn);
        });
        const hidCol = root.querySelector('#cat-color');
        if (hidCol) hidCol.value = btn.dataset.color;
      });
      // حفظ
      root.querySelector('#cat-save')?.addEventListener('click', () => {
        const name = root.querySelector('#cat-name')?.value.trim();
        if (!name) { showToast('أدخل اسم الفئة أولاً'); return; }
        const payload = {
          name,
          desc:  root.querySelector('#cat-desc')?.value.trim() || '',
          icon:  root.querySelector('#cat-icon')?.value || 'layers',
          color: root.querySelector('#cat-color')?.value || '#0a4d3f',
        };
        if (catId) { CatStore.update(catId, payload); showToast('تم تعديل الفئة ✓'); }
        else       { CatStore.add(payload);            showToast('تمت إضافة الفئة ✓'); }
        editId = null;
        renderList();
        closeForm();
      });
      // إلغاء
      root.querySelector('#cat-cancel')?.addEventListener('click', () => { editId = null; closeForm(); });
    }

    function closeForm() {
      const formWrap = root.querySelector('[data-form-wrap]');
      if (formWrap) { formWrap.classList.add('hidden'); }
    }
    function openForm(catId) {
      const formWrap = root.querySelector('[data-form-wrap]');
      if (formWrap) { formWrap.classList.remove('hidden'); }
      renderForm(catId);
      formWrap?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // HTML الصفحة
    root.innerHTML = `
      <div class="alm-panel mb-5 p-5">
        <div class="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div><span class="alm-badge gold">Categories</span>
            <h1 class="mt-2 text-3xl font-black">إدارة فئات المحاضرات</h1>
            <p class="mt-1 text-sm text-[var(--alm-muted)]">أضف وعدّل وارتّب فئاتك — تُحفظ تلقائياً وتظهر فوراً في صفحة المحاضرات ونموذج الرفع.</p>
          </div>
          <div class="flex gap-3">
            <button id="btn-add-cat" class="alm-btn alm-btn-primary">${icon('plus')} إضافة فئة جديدة</button>
            <button id="btn-reset-cats" class="alm-btn alm-btn-secondary">${icon('rotate-ccw')} استعادة الافتراضية</button>
          </div>
        </div>
      </div>
      <div class="grid gap-5 xl:grid-cols-[1fr_380px]">
        <div class="space-y-3" data-cat-list></div>
        <div class="hidden" data-form-wrap>
          <div class="alm-panel p-5 sticky top-24" data-cat-form></div>
        </div>
      </div>`;

    renderList();

    root.addEventListener('click', e => {
      if (e.target.closest('#btn-add-cat'))    { openForm(null); return; }
      if (e.target.closest('#btn-reset-cats')) {
        if (confirm('هتُستعاد الفئات الافتراضية وستُحذف فئاتك المضافة. متأكّد؟')) {
          CatStore.reset(); renderList(); closeForm(); showToast('تمت استعادة الفئات الافتراضية');
        }
        return;
      }
      const editBtn = e.target.closest('[data-edit]');
      if (editBtn) { openForm(editBtn.dataset.edit); return; }
      const delBtn = e.target.closest('[data-delete]');
      if (delBtn) {
        const cats = CatStore.all();
        const cat  = cats.find(c => c.id === delBtn.dataset.delete);
        if (cat && confirm(`حذف فئة "${cat.name}"؟`)) {
          CatStore.remove(delBtn.dataset.delete);
          renderList(); closeForm();
          showToast(`تم حذف فئة "${cat.name}"`);
        }
      }
    });
  }

  /* ============== صفحة تصفّح المحاضرات ============== */
  function initLecturesPage(selector = '[data-lectures-page]') {
    const root = document.querySelector(selector);
    const cats = CatStore.all();
    const lectures = data.lectures || [];
    if (!root) return;

    function ytThumb(url) {
      const m = url.match(/embed\/([\w-]+)/);
      return m ? `https://img.youtube.com/vi/${m[1]}/mqdefault.jpg` : '';
    }

    function statusBadge(s) {
      const map = { published: ['منشور', 'text-[var(--alm-success)]'], review: ['قيد المراجعة', 'text-[var(--alm-warning)]'], draft: ['مسودة', 'text-[var(--alm-muted)]'] };
      const [l, c] = map[s] || map.draft;
      return `<span class="text-xs font-bold ${c}">${l}</span>`;
    }

    function lectureCard(lec) {
      const thumb = lec.videoType === 'youtube' ? ytThumb(lec.youtubeUrl) : '';
      const typeLabel = lec.type === 'series' ? `سلسلة · ${lec.seriesName} #${lec.seriesOrder}` : 'محاضرة مستقلّة';
      const srcIcon = lec.videoType === 'youtube'
        ? `<span class="flex items-center gap-1 text-[#ff0000] text-xs font-bold">${icon('youtube', 'h-4 w-4')} يوتيوب</span>`
        : `<span class="flex items-center gap-1 text-[var(--alm-muted)] text-xs font-bold">${icon('hard-drive', 'h-4 w-4')} ملف محلي</span>`;
      const attCount = lec.attachments?.length || 0;
      return `
        <article class="alm-card flex flex-col overflow-hidden transition hover:-translate-y-1">
          <div class="relative ${thumb ? '' : 'alm-video'} min-h-[160px] bg-[var(--alm-green-900)]" style="${thumb ? `background:url('${thumb}') center/cover no-repeat` : ''}">
            ${!thumb ? `<span class="alm-play"><i data-lucide="play" class="h-8 w-8 fill-current"></i></span>` : `<span class="absolute inset-0 flex items-center justify-center"><span class="alm-play"><i data-lucide="play" class="h-8 w-8 fill-current"></i></span></span>`}
            <span class="absolute bottom-2 end-2 rounded-lg bg-black/70 px-2 py-1 text-xs font-bold text-white">${lec.duration}</span>
            ${srcIcon ? `<span class="absolute top-2 start-2 rounded-lg bg-white/90 px-2 py-1">${srcIcon}</span>` : ''}
          </div>
          <div class="flex flex-1 flex-col p-4">
            <span class="text-xs font-bold text-[var(--alm-muted)]">${typeLabel}</span>
            <h3 class="mt-1 text-base font-black leading-6">${lec.title}</h3>
            <p class="mt-1 text-xs leading-5 text-[var(--alm-muted)] line-clamp-2">${lec.description}</p>
            <div class="mt-3 flex flex-wrap items-center gap-2">
              ${statusBadge(lec.status)}
              ${attCount ? `<span class="flex items-center gap-1 text-xs text-[var(--alm-muted)]">${icon('paperclip','h-3.5 w-3.5')} ${attCount} مرفق</span>` : ''}
              <span class="flex items-center gap-1 text-xs text-[var(--alm-muted)]">${icon('users','h-3.5 w-3.5')} ${lec.students.toLocaleString('ar-EG')}</span>
            </div>
            <div class="mt-3 flex items-center justify-between gap-2 border-t border-[var(--alm-line)] pt-3">
              <span class="text-xs font-bold text-[var(--alm-muted)]">${lec.instructor}</span>
              <a href="lesson.html" class="alm-btn alm-btn-primary !min-h-8 !px-3 !text-xs">مشاهدة</a>
            </div>
          </div>
        </article>`;
    }

    function render(catId = 'all') {
      const filtered = catId === 'all' ? lectures : lectures.filter(l => l.category === catId);
      const grid = root.querySelector('[data-lec-grid]');
      const count = root.querySelector('[data-lec-count]');
      if (grid) grid.innerHTML = filtered.length
        ? filtered.map(lectureCard).join('')
        : `<div class="col-span-full py-16 text-center text-[var(--alm-muted)]">${icon('inbox','h-10 w-10 mx-auto mb-3')} لا توجد محاضرات في هذه الفئة بعد.</div>`;
      if (count) count.textContent = filtered.length;
      if (window.lucide) window.lucide.createIcons();
    }

    // بناء الـHTML
    root.innerHTML = `
      <div class="alm-panel mb-5 p-5">
        <div class="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div><span class="alm-badge gold">Lectures</span><h1 class="mt-2 text-3xl font-black">المحاضرات</h1><p class="mt-1 text-sm text-[var(--alm-muted)]"><span data-lec-count>${lectures.length}</span> محاضرة متاحة</p></div>
          <a class="alm-btn alm-btn-primary" href="upload.html">${icon('upload-cloud')} رفع محاضرة جديدة</a>
        </div>
        <div class="mt-4 flex flex-wrap gap-2" data-cat-filter>
          <button class="alm-btn alm-btn-primary" data-cat="all">الكل</button>
          ${cats.map(c => `<button class="alm-btn alm-btn-secondary" data-cat="${c.id}">${icon(c.icon,'h-4 w-4')} ${c.name}</button>`).join('')}
        </div>
      </div>
      <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3" data-lec-grid></div>`;

    root.querySelector('[data-cat-filter]').addEventListener('click', e => {
      const btn = e.target.closest('[data-cat]');
      if (!btn) return;
      root.querySelectorAll('[data-cat]').forEach(b => {
        b.classList.toggle('alm-btn-primary', b === btn);
        b.classList.toggle('alm-btn-secondary', b !== btn);
      });
      render(btn.dataset.cat);
    });

    render('all');
  }

  /* ============== نموذج رفع المحاضرة المتقدّم ============== */
  function initLectureUpload(selector = '[data-lecture-upload]') {
    const root = document.querySelector(selector);
    const cats = CatStore.all();
    if (!root) return;

    let videoMode = 'youtube'; // 'youtube' | 'local'
    let lectureType = 'single'; // 'single' | 'series'
    let attachments = [];
    let mainFile = null;
    let mainFileProgress = 0;

    function human(b) {
      if (b < 1048576) return (b/1024).toFixed(1)+' KB';
      return (b/1048576).toFixed(1)+' MB';
    }

    function ytId(url) {
      const m = url.match(/(?:v=|youtu\.be\/|embed\/)([\w-]{11})/);
      return m ? m[1] : null;
    }

    function render() {
      root.innerHTML = `
      <div class="grid gap-5 xl:grid-cols-[1fr_320px]">
        <div class="space-y-5">

          <!-- بيانات المحاضرة -->
          <div class="alm-panel p-6">
            <h2 class="mb-4 text-xl font-black">بيانات المحاضرة</h2>
            <div class="grid gap-4 md:grid-cols-2">
              <label class="block"><span class="mb-1 block text-sm font-bold">الفئة <span class="text-[var(--alm-danger)]">*</span></span>
                <select class="alm-input" id="lec-cat">
                  <option value="">— اختر الفئة —</option>
                  ${cats.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
                </select></label>
              <label class="block"><span class="mb-1 block text-sm font-bold">نوع المحاضرة <span class="text-[var(--alm-danger)]">*</span></span>
                <div class="grid grid-cols-2 gap-2 pt-1">
                  <button id="type-single" class="alm-btn ${lectureType==='single'?'alm-btn-primary':'alm-btn-secondary'}" data-type="single">${icon('film','h-4 w-4')} مستقلّة</button>
                  <button id="type-series" class="alm-btn ${lectureType==='series'?'alm-btn-primary':'alm-btn-secondary'}" data-type="series">${icon('list-video','h-4 w-4')} سلسلة</button>
                </div></label>
              ${lectureType === 'series' ? `
              <label class="block"><span class="mb-1 block text-sm font-bold">اسم السلسلة</span><input class="alm-input" id="lec-series" placeholder="مثال: سلسلة تفسير جزء عمّ" /></label>
              <label class="block"><span class="mb-1 block text-sm font-bold">رقم الحلقة في السلسلة</span><input class="alm-input" id="lec-order" type="number" min="1" placeholder="1" /></label>` : ''}
              <label class="block md:col-span-2"><span class="mb-1 block text-sm font-bold">عنوان المحاضرة <span class="text-[var(--alm-danger)]">*</span></span><input class="alm-input" id="lec-title" placeholder="مثال: تفسير سورة النبأ — الآيات ١-١٠" /></label>
              <label class="block md:col-span-2"><span class="mb-1 block text-sm font-bold">وصف مختصر</span><textarea class="alm-input min-h-24" id="lec-desc" placeholder="نبذة عن محتوى المحاضرة وأهدافها..."></textarea></label>
            </div>
          </div>

          <!-- مصدر الفيديو -->
          <div class="alm-panel p-6">
            <h2 class="mb-4 text-xl font-black">مصدر الفيديو</h2>
            <div class="mb-4 grid grid-cols-2 gap-3">
              <button class="alm-btn ${videoMode==='youtube'?'alm-btn-primary':'alm-btn-secondary'} justify-center" data-vmode="youtube">
                ${icon('youtube','h-5 w-5')} يوتيوب (أونلاين)
              </button>
              <button class="alm-btn ${videoMode==='local'?'alm-btn-primary':'alm-btn-secondary'} justify-center" data-vmode="local">
                ${icon('hard-drive','h-5 w-5')} ملف محلي (أوفلاين)
              </button>
            </div>
            ${videoMode === 'youtube' ? `
            <div id="youtube-panel">
              <label class="block"><span class="mb-1 block text-sm font-bold">رابط يوتيوب</span>
                <input class="alm-input" id="yt-url" placeholder="https://www.youtube.com/watch?v=..." />
              </label>
              <div id="yt-preview" class="mt-4 hidden">
                <p class="mb-2 text-sm font-bold text-[var(--alm-muted)]">معاينة الفيديو:</p>
                <div class="relative overflow-hidden rounded-2xl" style="padding-top:56.25%">
                  <iframe id="yt-iframe" class="absolute inset-0 h-full w-full" frameborder="0" allowfullscreen></iframe>
                </div>
              </div>
              <p class="mt-3 text-xs text-[var(--alm-muted)]">${icon('info','h-4 w-4 inline')} أدخل رابط الفيديو لمعاينته مباشرة. تأكّد أن الفيديو غير مقيّد (Private).</p>
            </div>` : `
            <div id="local-panel">
              <div data-video-drop class="grid place-items-center rounded-2xl border-2 border-dashed border-[var(--alm-line)] bg-[var(--alm-cream-50)] p-8 text-center cursor-pointer transition">
                ${icon('upload-cloud','h-10 w-10 text-[var(--alm-green-700)] mx-auto')}
                <b class="mt-3 block">اسحب ملف الفيديو هنا أو اضغط للاختيار</b>
                <span class="mt-1 text-sm text-[var(--alm-muted)]">MP4 · MKV · MOV · AVI · حتى 500MB</span>
                <input type="file" accept="video/*" class="hidden" id="video-input" />
              </div>
              <div id="video-preview" class="mt-4 hidden">
                <div class="flex items-center justify-between rounded-xl border border-[var(--alm-line)] bg-white p-3">
                  <span class="flex items-center gap-3">${icon('film','h-8 w-8 text-[var(--alm-green-700)]')}<span><b id="video-name" class="block text-sm"></b><span id="video-size" class="text-xs text-[var(--alm-muted)]"></span></span></span>
                  <button id="video-remove" class="rounded-lg p-2 text-[var(--alm-muted)] hover:text-[var(--alm-danger)]">${icon('trash-2','h-4 w-4')}</button>
                </div>
                <div class="mt-2 flex items-center gap-3"><div class="alm-progress flex-1"><span id="video-bar" style="width:0%"></span></div><span id="video-pct" class="text-xs font-bold text-[var(--alm-muted)]">0%</span></div>
              </div>
            </div>`}
          </div>

          <!-- المرفقات -->
          <div class="alm-panel p-6">
            <h2 class="mb-1 text-xl font-black">المرفقات</h2>
            <p class="mb-4 text-sm text-[var(--alm-muted)]">ملخّصات PDF، خرائط ذهنية، أوراق عمل، صوتيات...</p>
            <div data-att-uploader></div>
          </div>
        </div>

        <!-- الشريط الجانبي -->
        <aside class="space-y-4">
          <div class="alm-panel p-5">
            <h3 class="text-lg font-black">حالة النشر</h3>
            <div class="mt-4 space-y-3 text-sm">
              <div class="flex items-center justify-between rounded-xl bg-white p-3"><span>الحفظ كمسودة</span><span class="alm-badge">تلقائي</span></div>
              <div class="flex items-center justify-between rounded-xl bg-white p-3"><span>مراجعة الإدارة</span><span class="alm-badge gold">قبل النشر</span></div>
              <div class="flex items-center justify-between rounded-xl bg-white p-3"><span>إشعار للطلاب</span><span class="alm-badge">عند النشر</span></div>
            </div>
            <div class="mt-4 grid gap-2">
              <button class="alm-btn alm-btn-secondary w-full justify-center" id="btn-draft">${icon('save','h-4 w-4')} حفظ كمسودة</button>
              <button class="alm-btn alm-btn-primary w-full justify-center" id="btn-publish">${icon('send','h-4 w-4')} رفع ونشر المحاضرة</button>
            </div>
          </div>
          <div class="alm-panel p-5">
            <h3 class="text-lg font-black">إرشادات</h3>
            <ul class="mt-3 space-y-2 text-sm text-[var(--alm-muted)]">
              <li class="flex gap-2">${icon('check','h-4 w-4 text-[var(--alm-success)] shrink-0')} يوتيوب: تأكّد أن الرابط عام أو غير مُدرَج.</li>
              <li class="flex gap-2">${icon('check','h-4 w-4 text-[var(--alm-success)] shrink-0')} ملف محلي: MP4 بدقة 720p+، حتى 500MB.</li>
              <li class="flex gap-2">${icon('check','h-4 w-4 text-[var(--alm-success)] shrink-0')} المرفقات: PDF أو صورة، حتى 50MB لكل ملف.</li>
              <li class="flex gap-2">${icon('check','h-4 w-4 text-[var(--alm-success)] shrink-0')} السلاسل: حدّد اسم السلسلة ورقم الحلقة بدقة.</li>
            </ul>
          </div>
        </aside>
      </div>`;

      if (window.lucide) window.lucide.createIcons();
      bindEvents();
    }

    function bindEvents() {
      // نوع المحاضرة
      root.querySelectorAll('[data-type]').forEach(btn => btn.addEventListener('click', () => {
        lectureType = btn.dataset.type; render();
      }));

      // مصدر الفيديو
      root.querySelectorAll('[data-vmode]').forEach(btn => btn.addEventListener('click', () => {
        videoMode = btn.dataset.vmode; mainFile = null; mainFileProgress = 0; render();
      }));

      // معاينة يوتيوب
      const ytInput = root.querySelector('#yt-url');
      if (ytInput) {
        ytInput.addEventListener('input', () => {
          const id = ytId(ytInput.value.trim());
          const preview = root.querySelector('#yt-preview');
          const iframe = root.querySelector('#yt-iframe');
          if (id && preview && iframe) {
            iframe.src = `https://www.youtube.com/embed/${id}`;
            preview.classList.remove('hidden');
          } else if (preview) {
            preview.classList.add('hidden');
          }
        });
      }

      // رفع ملف الفيديو (محلي)
      const videoDrop = root.querySelector('[data-video-drop]');
      const videoInput = root.querySelector('#video-input');
      if (videoDrop && videoInput) {
        videoDrop.addEventListener('click', () => videoInput.click());
        ['dragenter','dragover'].forEach(ev => videoDrop.addEventListener(ev, e => { e.preventDefault(); videoDrop.classList.add('border-[var(--alm-gold-500)]'); }));
        ['dragleave','drop'].forEach(ev => videoDrop.addEventListener(ev, e => { e.preventDefault(); videoDrop.classList.remove('border-[var(--alm-gold-500)]'); }));
        videoDrop.addEventListener('drop', e => { if (e.dataTransfer?.files[0]) setVideoFile(e.dataTransfer.files[0]); });
        videoInput.addEventListener('change', () => { if (videoInput.files[0]) setVideoFile(videoInput.files[0]); });
        const removeBtn = root.querySelector('#video-remove');
        if (removeBtn) removeBtn.addEventListener('click', () => { mainFile = null; mainFileProgress = 0; render(); });
      }

      // المرفقات
      initUploader('[data-att-uploader]');

      // أزرار النشر
      const btnDraft = root.querySelector('#btn-draft');
      const btnPublish = root.querySelector('#btn-publish');
      if (btnDraft) btnDraft.addEventListener('click', () => showToast('تم حفظ المحاضرة كمسودة'));
      if (btnPublish) btnPublish.addEventListener('click', () => {
        const title = root.querySelector('#lec-title')?.value.trim();
        const cat = root.querySelector('#lec-cat')?.value;
        if (!title) { showToast('أدخل عنوان المحاضرة أولاً'); return; }
        if (!cat) { showToast('اختر فئة المحاضرة أولاً'); return; }
        if (videoMode === 'youtube' && !ytId(root.querySelector('#yt-url')?.value || '')) { showToast('أدخل رابط يوتيوب صحيح أولاً'); return; }
        if (videoMode === 'local' && !mainFile) { showToast('أضف ملف الفيديو أولاً'); return; }
        showToast('تم رفع المحاضرة ونشرها بنجاح ✓');
        setTimeout(() => { window.location.href = 'lectures.html'; }, 1800);
      });
    }

    function setVideoFile(file) {
      if (!file.type.startsWith('video/')) { showToast('الملف المحدد ليس فيديو'); return; }
      if (file.size > 500 * 1048576) { showToast('حجم الفيديو يتجاوز 500MB'); return; }
      mainFile = file;
      mainFileProgress = 0;
      render();
      // محاكاة التقدّم
      const bar = root.querySelector('#video-bar');
      const pct = root.querySelector('#video-pct');
      const nm  = root.querySelector('#video-name');
      const sz  = root.querySelector('#video-size');
      const pr  = root.querySelector('#video-preview');
      if (nm) nm.textContent = file.name;
      if (sz) sz.textContent = human(file.size);
      if (pr) pr.classList.remove('hidden');
      const t = setInterval(() => {
        mainFileProgress = Math.min(100, mainFileProgress + Math.random() * 15 + 5);
        if (bar) bar.style.width = mainFileProgress + '%';
        if (pct) { pct.textContent = mainFileProgress >= 100 ? 'اكتمل ✓' : Math.round(mainFileProgress) + '%'; pct.className = 'text-xs font-bold ' + (mainFileProgress >= 100 ? 'text-[var(--alm-success)]' : 'text-[var(--alm-muted)]'); }
        if (mainFileProgress >= 100) clearInterval(t);
      }, 300);
    }

    render();
  }

  function initPage(config = {}) {
    renderLayout(config.active || document.body.dataset.page || 'student', config.title || document.title, config.subtitle || 'منصة المنهاج');
    renderCourses();
    renderLessons();
    renderStats();
    renderActivity();
    renderLeaderboard();
    initTabs();
    initQuiz();
    renderResult();
    initTafsir();
    renderMindmap();
    initCourseFilter();
    initUploader();
    renderMainDashboard();
    renderStudentDashboard();
    initLecturesPage();
    initLectureUpload();
    initCategoriesPage();
    if (window.lucide) window.lucide.createIcons();
  }

  return {
    data,
    pageMap,
    icon,
    statCard,
    courseCard,
    lessonRow,
    renderLayout,
    renderCourses,
    renderLessons,
    renderStats,
    renderActivity,
    renderLeaderboard,
    initQuiz,
    renderResult,
    initTafsir,
    renderMindmap,
    getDashStats,
    renderMainDashboard,
    renderStudentDashboard,
    initCourseFilter,
    initUploader,
    initLecturesPage,
    initLectureUpload,
    initCategoriesPage,
    initPage
  };
})();

window.Alminhaj = Alminhaj;
