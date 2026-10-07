(() => {
  'use strict';
  // Calendar links and manual details work without this enhancement.
  document.querySelectorAll('[data-calendar-copy]').forEach(button => {
    const help = button.closest('.calendar-help');
    const details = help.querySelector('textarea');
    const status = help.querySelector('[data-calendar-status]');
    button.hidden = false;
    button.addEventListener('click', async () => {
      button.disabled = true;
      status.textContent = '';
      const chinese = document.documentElement.lang.startsWith('zh');
      try {
        if (!navigator.clipboard || !navigator.clipboard.writeText) throw new Error('Clipboard unavailable');
        await navigator.clipboard.writeText(details.value);
        status.textContent = chinese
          ? '已复制。请在您的日历中新建活动并粘贴详情。'
          : 'Copied. Paste these details into a new event in your calendar.';
      } catch (_) {
        // Embedded browsers and denied clipboard access still allow manual copying.
        details.focus();
        details.select();
        details.setSelectionRange(0, details.value.length);
        status.textContent = chinese
          ? '详情已选中。请选择“复制”，然后粘贴至新的日历活动。'
          : 'The details are selected below. Choose Copy, then paste into a new calendar event.';
      } finally {
        button.disabled = false;
      }
    });
  });
  document.querySelectorAll('[data-language]').forEach(button => {
    button.addEventListener('click', () => {
      document.querySelectorAll('[data-calendar-status]').forEach(status => { status.textContent = ''; });
    });
  });
})();
