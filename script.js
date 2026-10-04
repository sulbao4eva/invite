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
  const deadline = new Promise(resolve => setTimeout(() => resolve('timeout'), 2500));
  const fontsReady = document.fonts ? document.fonts.ready : Promise.resolve();
  Promise.race([Promise.all([...imagesReady, fontsReady]), deadline]).then(result => {
    if (finished || !root.classList.contains('intro-active')) return;
    if (result === 'timeout') { finish(); return; }
    if (reducedMotion.matches) { finish(); return; }
    root.classList.add('opening');
    finishTimer = setTimeout(finish, 5100);
  }).catch(finish);
})();

(() => {
  'use strict';
  const canvas = document.querySelector('.petal-canvas');
  const layer = document.querySelector('.falling-petals');
  const pause = document.getElementById('petals-paused');
  const root = document.documentElement;
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (!canvas || !layer || !pause) return;
  const context = canvas.getContext('2d');
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

  // Ten copies of each previous lifetime give exactly ten times the
  // particle quantity and average arrival rate, without speeding up the fall.
  const particles = Array.from({ length: seeds.length * 10 }, (_, index) => ({
    ...seeds[index % seeds.length],
    x: (index + 0.5) / (seeds.length * 10),
    phase: (index * 0.61803398875) % 1,
    turn: seeds[index % seeds.length].turn + index * 0.47,
    sprite: index % 6, cycle: -1
  }));
  const sprites = Array.from({ length: 6 }, (_, index) => {
    const sprite = document.createElement('canvas');
    sprite.width = sprite.height = 64;
    const brush = sprite.getContext('2d');
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

  let width = 0;
  let height = 0;
  let elapsed = 0;
  let previous = 0;
  let frame = 0;

  function resize() {
    width = layer.clientWidth;
    height = layer.clientHeight;
    const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    draw();
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
  }

  function tick(time) {
    if (previous) elapsed += Math.min((time - previous) / 1000, 0.05);
    previous = time;
    draw();
    frame = requestAnimationFrame(tick);
  }

  function sync() {
    const stopped = motion.matches || pause.checked || document.hidden ||
      root.classList.contains('intro-active');
    if (stopped) {
      cancelAnimationFrame(frame);
      frame = 0;
      previous = 0;
    } else if (!frame) {
      if (!root.classList.contains('petals-enhanced')) {
        resize();
        root.classList.add('petals-enhanced');
      }
      frame = requestAnimationFrame(tick);
    }
  }

  pause.addEventListener('change', sync);
  motion.addEventListener('change', sync);
  document.addEventListener('visibilitychange', sync);
  window.addEventListener('resize', resize, { passive: true });
  new MutationObserver(sync).observe(root, { attributes: true, attributeFilter: ['class'] });
  sync();
})();
