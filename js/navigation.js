document.addEventListener('DOMContentLoaded', () => {
  document.addEventListener('click', event => {
    const toggle = event.target.closest('.alm-mobile-toggle');
    if (toggle) {
      document.getElementById('appSidebar')?.classList.toggle('open');
    }

    const langToggle = event.target.closest('.alm-lang-toggle');
    if (langToggle) {
      const html = document.documentElement;
      const isArabic = html.lang === 'ar';
      html.lang = isArabic ? 'en' : 'ar';
      html.dir = isArabic ? 'ltr' : 'rtl';
      langToggle.textContent = isArabic ? 'AR' : 'EN';
      showToast(isArabic ? 'English interface preview enabled' : 'تم تفعيل الواجهة العربية');
    }

    const toastTrigger = event.target.closest('[data-toast]');
    if (toastTrigger) {
      showToast(toastTrigger.dataset.toast);
    }

    const modalTrigger = event.target.closest('[data-open-modal]');
    if (modalTrigger) {
      document.querySelector(modalTrigger.dataset.openModal)?.classList.add('show');
    }

    const modalClose = event.target.closest('[data-close-modal]');
    if (modalClose) {
      modalClose.closest('.alm-modal-backdrop')?.classList.remove('show');
    }
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      document.querySelectorAll('.alm-modal-backdrop.show').forEach(modal => modal.classList.remove('show'));
      document.getElementById('appSidebar')?.classList.remove('open');
    }
  });
});

function showToast(message = 'تم الحفظ بنجاح') {
  let toast = document.querySelector('.alm-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'alm-toast alm-card p-4';
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<div class="flex items-start gap-3"><span class="grid h-9 w-9 place-items-center rounded-xl bg-[rgba(21,131,95,.10)] text-[var(--alm-green-800)]"><i data-lucide="check" class="h-5 w-5"></i></span><p class="text-sm font-bold leading-6">${message}</p></div>`;
  toast.classList.add('show');
  if (window.lucide) window.lucide.createIcons();
  clearTimeout(window.__almToastTimer);
  window.__almToastTimer = setTimeout(() => toast.classList.remove('show'), 2600);
}
