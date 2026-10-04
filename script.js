(() => {
  'use strict';
  const root = document.documentElement;
  const main = document.getElementById('invitation');
  const intro = document.getElementById('intro');
  const skip = document.getElementById('skip');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let finished = !root.classList.contains('intro-active');
  let finishTimer;

  function finish() {
    if (finished) return;
    finished = true;
    clearTimeout(finishTimer);
    clearTimeout(window.invitationFallback);
    const moveFocus = intro.contains(document.activeElement);
    root.classList.remove('intro-active', 'opening');
    main.inert = false;
    main.removeAttribute('aria-hidden');
    if (moveFocus) main.focus({ preventScroll: true });
  }

  if (finished) return;
  main.inert = true;
  main.setAttribute('aria-hidden', 'true');
  skip.addEventListener('click', finish);
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') finish();
    // Keep keyboard focus on the sole control during the opening.
    if (!finished && event.key === 'Tab') { event.preventDefault(); skip.focus(); }
  });
  reducedMotion.addEventListener('change', event => { if (event.matches) finish(); });

  const imagesReady = Array.from(main.querySelectorAll('img')).map(img => {
    if (img.complete) return Promise.resolve();
    return new Promise(resolve => {
      img.addEventListener('load', resolve, { once: true });
      img.addEventListener('error', resolve, { once: true });
    });
  });
  // Slow networks must never leave guests stranded behind an opening screen.
  const deadline = new Promise(resolve => setTimeout(resolve, 2500));
  const fontsReady = document.fonts ? document.fonts.ready : Promise.resolve();
  Promise.race([Promise.all([...imagesReady, fontsReady]), deadline]).then(() => {
    if (finished || !root.classList.contains('intro-active')) return;
    if (reducedMotion.matches) { finish(); return; }
    root.classList.add('opening');
    finishTimer = setTimeout(finish, 5100);
  }).catch(finish);
})();
