(() => {
  'use strict';
  const root = document.documentElement;
  const main = document.getElementById('invitation');
  const intro = document.getElementById('intro');
  const opener = document.getElementById('open-envelope');
  const skip = document.getElementById('skip');
  const replay = document.getElementById('replay');
  const motionNotice = document.getElementById('motion-notice');
  const play = document.getElementById('play-animations');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let finished = true;
  let finishTimer;
  let run = 0;
  let ready = false;
  let started = false;

  function finish() {
    if (finished) return;
    finished = true;
    started = false;
    opener.disabled = false;
    run++;
    clearTimeout(finishTimer);
    clearTimeout(window.invitationFallback);
    const moveFocus = intro.contains(document.activeElement);
    root.classList.remove('intro-active', 'opening');
    main.inert = false;
    main.removeAttribute('aria-hidden');
    if (moveFocus) main.focus({ preventScroll: true });
  }

  function start(userRequested = false) {
    if (started) return;
    if (reducedMotion.matches && !userRequested) { finished = false; finish(); return; }
    if (userRequested && reducedMotion.matches) {
      root.classList.add('motion-enabled');
      document.getElementById('petals-paused').checked = false;
    }
    finished = false;
    started = true;
    opener.disabled = true;
    skip.hidden = false;
    ready = false;
    clearTimeout(finishTimer);
    const currentRun = ++run;
    root.classList.remove('opening');
    root.classList.add('intro-active');
    main.inert = true;
    main.setAttribute('aria-hidden', 'true');
    skip.focus({ preventScroll: true });
    clearTimeout(window.invitationFallback);
    // The envelope is drawn in CSS. Photos can load during its opening;
    // a slow font gets a serif fallback rather than skipping the animation.
    const fontsReady = document.fonts ? document.fonts.ready : Promise.resolve();
    const deadline = new Promise(resolve => setTimeout(resolve, 500));
    Promise.race([fontsReady, deadline]).then(() => {
      if (finished || currentRun !== run) return;
      ready = true;
      beginWhenVisible();
    }).catch(finish);
  }

  function beginWhenVisible() {
    if (finished || !ready || document.hidden || root.classList.contains('opening')) return;
    // Start the sequence's clocks only when it can actually be seen.
    // Completion is timer-based; no animationend/transitionend event is required.
    void intro.offsetWidth;
    root.classList.add('opening');
    finishTimer = setTimeout(finish, 5100);
    window.invitationFallback = setTimeout(finish, 10000);
  }

  function updateReplay() {
    const needsOptIn = reducedMotion.matches && !root.classList.contains('motion-enabled');
    motionNotice.hidden = !needsOptIn;
    replay.textContent = needsOptIn ? 'Play animations' : 'Replay invitation';
  }
  replay.hidden = false;
  updateReplay();
  opener.addEventListener('click', () => start());
  function playAnimations() { start(true); updateReplay(); }
  replay.addEventListener('click', playAnimations);
  play.addEventListener('click', playAnimations);
  skip.addEventListener('click', finish);
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') finish();
    if (!finished && event.key === 'Tab') {
      event.preventDefault();
      (started ? skip : opener).focus();
    }
  });
  function motionChanged(event) {
    root.classList.remove('motion-enabled');
    if (event.matches && started) finish();
    updateReplay();
  }
  if (reducedMotion.addEventListener) reducedMotion.addEventListener('change', motionChanged);
  else reducedMotion.addListener(motionChanged);
  // A page restored from Safari's back/forward cache should remain usable.
  window.addEventListener('pagehide', () => { if (started) finish(); });
  window.addEventListener('pageshow', event => {
    if (event.persisted && started) finish();
    else beginWhenVisible();
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && root.classList.contains('opening')) finish();
    else if (!document.hidden) beginWhenVisible();
  });
  if (root.classList.contains('intro-active')) {
    finished = false;
    main.inert = true;
    main.setAttribute('aria-hidden', 'true');
    opener.focus({ preventScroll: true });
  }
  root.classList.add('intro-ready');
  clearTimeout(window.invitationFallback);
})();

(() => {
  'use strict';
  const canvas = document.querySelector('.petal-canvas');
  const layer = document.querySelector('.falling-petals');
  const pause = document.getElementById('petals-paused');
  const root = document.documentElement;
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (!canvas || !layer || !pause) return;
  function getContext(element) {
    try { return element.getContext('2d'); }
    catch (_) { return null; }
  }
  const context = getContext(canvas);
  if (!context) return; // The larger CSS petals remain a decorative fallback.

  const seeds = Array.from(layer.querySelectorAll('.petal-path'), element => {
    const value = name => parseFloat(element.style.getPropertyValue(name));
    return {
      life: value('--fall'), size: value('--size') * 2.4,
      turn: value('--turn') * Math.PI / 180,
      rotation: value('--rotation') * Math.PI / 180,
      drift: value('--drift') * 1.8, sway: value('--sway'),
      sweep: value('--sweep') * 1.4, opacity: value('--opacity')
    };
  });
  if (!seeds.length) return;

  // Reduce the previous 0.4 density by 20%. Round the count and scale
  // lifetimes so the arrival rate is also reduced by exactly 20%.
  const density = 0.32;
  const previousParticleCount = Math.round(seeds.length * 0.4);
  const particleCount = Math.max(1, Math.round(previousParticleCount * 0.8));
  const selectedSeeds = Array.from({ length: particleCount }, (_, index) =>
    seeds[Math.floor(index * seeds.length / particleCount)]);
  const targetArrivalRate = seeds.reduce((sum, seed) => sum + 1 / seed.life, 0) * density;
  const durationScale = selectedSeeds.reduce((sum, seed) => sum + 1 / seed.life, 0) / targetArrivalRate;
  const particles = selectedSeeds.map((seed, index) => ({
    ...seed,
    life: seed.life * durationScale,
    x: (index + 0.5) / particleCount,
    phase: (index * 0.61803398875) % 1,
    turn: seed.turn + index * 0.47,
    sprite: index % 6, cycle: -1
  }));
  const sprites = Array.from({ length: 6 }, (_, index) => {
    const sprite = document.createElement('canvas');
    sprite.width = sprite.height = 64;
    const brush = getContext(sprite);
    if (!brush) return null;
    const tint = index % 2 ? '#dfacb9' : '#e4b8c1';
    const gradient = brush.createRadialGradient(24, 21, 2, 32, 32, 31);
    gradient.addColorStop(0, '#fff5f0');
    gradient.addColorStop(0.6, '#efd2d8');
    gradient.addColorStop(1, tint);
    brush.fillStyle = gradient;
    brush.beginPath();
    brush.moveTo(12, 48);
    brush.bezierCurveTo(6, 27, 17, 9, 32, 12);
    brush.bezierCurveTo(36, 13, 38, 15, 40, 18);
    brush.lineTo(44, 14);
    brush.bezierCurveTo(59, 21, 57, 39, 40, 49);
    brush.bezierCurveTo(30, 55, 20, 53, 12, 48);
    brush.fill();
    return sprite;
  });

  if (sprites.some(sprite => !sprite)) return;

  // Keep the fixed canvas out of hidden/transformed invitation ancestors.
  // Safari can otherwise clip it or keep an obsolete compositing layer.
  document.body.appendChild(layer);
  const protectedElements = Array.from(document.querySelectorAll(
    '.invitation-heading, .photo, .message, .small-ornament, .venue-details, .map-preview, .calendar-section, .rsvp-copy, .qr-block, .signature'
  ));
  let protectedRects = [];
  function measureContent() {
    protectedRects = protectedElements.map(element => element.getBoundingClientRect())
      .filter(rect => rect.width && rect.height);
  }

  let width = 0;
  let height = 0;
  let elapsed = 0;
  let previous = 0;
  let frame = 0;
  let canvasAvailable = true;

  function stop() {
    cancelAnimationFrame(frame);
    frame = 0;
    previous = 0;
  }

  function useFallback() {
    canvasAvailable = false;
    stop();
    root.classList.remove('petals-enhanced');
    // The existing CSS petals remain below protected invitation content.
    document.getElementById('invitation').prepend(layer);
  }

  function resize() {
    if (!canvasAvailable) return;
    try {
      width = layer.clientWidth || window.innerWidth;
      height = layer.clientHeight || window.innerHeight;
      measureContent();
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      draw();
    } catch (_) { useFallback(); }
  }

  function draw() {
    context.clearRect(0, 0, width, height);
    for (const petal of particles) {
      const age = petal.phase + elapsed / petal.life;
      const cycle = Math.floor(age);
      const progress = age - cycle;
      if (petal.cycle !== cycle) {
        // New starting positions each loop keep the shower from repeating.
        if (petal.cycle >= 0) petal.x = Math.random();
        petal.cycle = cycle;
      }
      const wave = Math.sin(elapsed * Math.PI * 2 / petal.sway + petal.phase * 12);
      const x = petal.x * width + petal.drift * progress + wave * petal.sweep;
      const y = progress * (height + 110) - 55;
      const fade = Math.min(1, progress / 0.06, (1 - progress) / 0.06);
      const angle = petal.turn + progress * petal.rotation + wave * 0.3;
      context.save();
      context.translate(x, y);
      context.rotate(angle);
      context.globalAlpha = fade * petal.opacity;
      const flutter = 0.55 + Math.abs(Math.cos(elapsed / petal.sway + petal.phase * 8)) * 0.45;
      context.drawImage(sprites[petal.sprite], -petal.size / 2, -petal.size / 2,
        petal.size, petal.size * flutter);
      context.restore();
    }
    // Transparent cutouts preserve faces, text, buttons and the QR quiet zone.
    // Rectangles are cached on layout/scroll events, not read on every frame.
    for (const rect of protectedRects) {
      context.clearRect(rect.left - 3, rect.top - 3, rect.width + 6, rect.height + 6);
    }
  }

  function tick(time) {
    frame = 0;
    if (!canvasAvailable) return;
    if (previous) elapsed += Math.min((time - previous) / 1000, 0.05);
    previous = time;
    try { draw(); }
    catch (_) { useFallback(); return; }
    frame = requestAnimationFrame(tick);
  }

  function sync() {
    const stopped = !canvasAvailable || (motion.matches && !root.classList.contains('motion-enabled')) || pause.checked || document.hidden ||
      root.classList.contains('intro-active');
    if (stopped) {
      stop();
    } else if (!frame) {
      resize();
      if (!canvasAvailable) return;
      root.classList.add('petals-enhanced');
      frame = requestAnimationFrame(tick);
    }
  }

  pause.addEventListener('change', sync);
  if (motion.addEventListener) motion.addEventListener('change', sync);
  else motion.addListener(sync);
  document.addEventListener('visibilitychange', sync);
  window.addEventListener('resize', resize, { passive: true });
  window.addEventListener('orientationchange', resize, { passive: true });
  window.addEventListener('pagehide', stop);
  window.addEventListener('pageshow', () => {
    // A page cache may discard a queued frame while retaining its old ID.
    // Cancel/reset before resuming so there is exactly one live RAF chain.
    stop(); resize(); sync();
  });
  canvas.addEventListener('contextlost', useFallback);
  canvas.addEventListener('contextrestored', () => {
    canvasAvailable = true;
    document.body.appendChild(layer);
    resize(); sync();
  });
  window.addEventListener('scroll', measureContent, { passive: true });
  if (window.visualViewport) window.visualViewport.addEventListener('resize', resize, { passive: true });
  document.querySelector('.calendar-save').addEventListener('toggle', measureContent);
  if (window.ResizeObserver) new ResizeObserver(resize).observe(document.getElementById('invitation'));
  new MutationObserver(sync).observe(root, { attributes: true, attributeFilter: ['class'] });
  sync();
})();
