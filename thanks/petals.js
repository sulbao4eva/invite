(() => {
  'use strict';
  const root = document.documentElement;
  const canvas = document.querySelector('.petal-canvas');
  const layer = document.querySelector('.falling-petals');
  const paper = document.querySelector('.paper');
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (!canvas || !layer || !paper) return;
  function getContext(element) {
    try { return element.getContext('2d'); }
    catch (_) { return null; }
  }
  const context = getContext(canvas);

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


  let canvasAvailable = Boolean(context && sprites.every(Boolean) && particles.length);
  const protectedElements = Array.from(document.querySelectorAll(
    '.topbar, .thanks-heading, .message, .date, .time, .calendar-save, .venue h2, .venue-copy, .map-preview, .venue-button, .signoff'
  ));
  let protectedRects = [];
  let width = 0;
  let height = 0;
  let elapsed = 0;
  let previous = 0;
  let frame = 0;

  // The overlay stays at body level, outside transformed or clipped ancestors.
  // Cache text/control bounds only when layout changes, never on each frame.
  function measureContent() {
    protectedRects = protectedElements.map(element => element.getBoundingClientRect())
      .filter(rect => rect.width && rect.height);
  }

  function stop() {
    cancelAnimationFrame(frame);
    frame = 0;
    previous = 0;
  }

  function useFallback() {
    canvasAvailable = false;
    stop();
    root.classList.remove('petals-enhanced');
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
        if (petal.cycle >= 0) petal.x = Math.random();
        petal.cycle = cycle;
      }
      const wave = Math.sin(elapsed * Math.PI * 2 / petal.sway + petal.phase * 12);
      const x = petal.x * width + petal.drift * progress + wave * petal.sweep;
      const y = progress * (height + 110) - 55;
      const fade = Math.min(1, progress / 0.06, (1 - progress) / 0.06);
      context.save();
      context.translate(x, y);
      context.rotate(petal.turn + progress * petal.rotation + wave * 0.3);
      context.globalAlpha = fade * petal.opacity;
      const flutter = 0.55 + Math.abs(Math.cos(elapsed / petal.sway + petal.phase * 8)) * 0.45;
      context.drawImage(sprites[petal.sprite], -petal.size / 2, -petal.size / 2,
        petal.size, petal.size * flutter);
      context.restore();
    }
    // Keep the thank-you message, calendar, map and signature unobstructed.
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
    const stopped = motion.matches || document.hidden;
    root.classList.toggle('petals-paused', stopped);
    if (stopped || !canvasAvailable) {
      stop();
    } else if (!frame) {
      resize();
      if (!canvasAvailable) return;
      root.classList.add('petals-enhanced');
      frame = requestAnimationFrame(tick);
    }
  }

  function motionChanged() {
    sync();
  }
  if (motion.addEventListener) motion.addEventListener('change', motionChanged);
  else motion.addListener(motionChanged);
  document.addEventListener('visibilitychange', sync);
  window.addEventListener('resize', resize, { passive: true });
  window.addEventListener('orientationchange', resize, { passive: true });
  window.addEventListener('pagehide', () => {
    root.classList.add('petals-paused');
    stop();
  });
  window.addEventListener('pageshow', () => {
    // Safari's back/forward cache can discard a queued callback but retain its ID.
    stop();
    resize();
    sync();
  });
  canvas.addEventListener('contextlost', useFallback);
  canvas.addEventListener('contextrestored', () => {
    canvasAvailable = Boolean(context && sprites.every(Boolean));
    resize();
    sync();
  });
  window.addEventListener('scroll', measureContent, { passive: true });
  if (window.visualViewport) window.visualViewport.addEventListener('resize', resize, { passive: true });
  document.querySelectorAll('.calendar-save, .calendar-help').forEach(details =>
    details.addEventListener('toggle', measureContent));
  document.querySelectorAll('[data-language]').forEach(button =>
    button.addEventListener('click', measureContent));
  if (window.ResizeObserver) new ResizeObserver(resize).observe(paper);
  if (document.fonts) document.fonts.ready.then(measureContent).catch(() => {});
  sync();
})();

