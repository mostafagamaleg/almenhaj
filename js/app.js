const Alminhaj = (() => {
  const data = window.AlminhajData || {};

  const pageMap = {
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
    ['student', 'لوحة الطالب', 'layout-dashboard'],
    ['library', 'المكتبة', 'library'],
    ['lesson', 'مشغل الدرس', 'square-play'],
    ['quiz', 'الاختبارات', 'circle-help'],
    ['quran', 'المصحف', 'book-open-text'],
    ['assignments', 'الواجبات', 'clipboard-check'],
    ['achievements', 'الإنجازات', 'trophy'],
    ['certificates', 'الشهادات', 'award'],
    ['leaderboard', 'المتصدرون', 'trophy'],
    ['teacher', 'لوحة الشيخ', 'users-round'],
    ['admin', 'الإدارة', 'shield-check'],
    ['reports', 'التقارير', 'chart-column'],
    ['settings', 'الإعدادات', 'settings']
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
    initCourseFilter,
    initUploader,
    initPage
  };
})();

window.Alminhaj = Alminhaj;
