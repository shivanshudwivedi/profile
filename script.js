(() => {
  'use strict';
  const body = document.body;
  const systemMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const motionButtons = [...document.querySelectorAll('.motion-toggle')];
  let paused = false;
  let refreshScene = () => {};
  try { paused = localStorage.getItem('portfolio-motion') === 'paused'; } catch (_) { /* Optional storage. */ }
  function setMotion() {
    const off = paused || systemMotion.matches;
    body.classList.toggle('motion-off', off);
    body.classList.toggle('motion-on', !off);
    motionButtons.forEach(button => {
      button.setAttribute('aria-pressed', String(off));
      button.querySelector('span').textContent = off ? 'off' : 'on';
      button.setAttribute('aria-label', off ? 'Turn motion on' : 'Turn motion off');
      button.disabled = systemMotion.matches;
      if (systemMotion.matches) button.setAttribute('aria-label', 'Motion is off to respect your system preference');
    });
    refreshScene();
  }
  motionButtons.forEach(button => button.addEventListener('click', () => {
    paused = !paused;
    try { localStorage.setItem('portfolio-motion', paused ? 'paused' : 'running'); } catch (_) { /* Optional storage. */ }
    setMotion();
  }));
  systemMotion.addEventListener('change', setMotion);

  const walletStage = document.querySelector('.wallet-stage');
  let tiltFrame = null;
  walletStage.addEventListener('pointermove', event => {
    if (event.pointerType !== 'mouse' || body.classList.contains('motion-off')) return;
    const rect = walletStage.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - .5;
    const y = (event.clientY - rect.top) / rect.height - .5;
    if (tiltFrame) cancelAnimationFrame(tiltFrame);
    tiltFrame = requestAnimationFrame(() => {
      walletStage.style.setProperty('--tilt-x', `${x * 12}deg`);
      walletStage.style.setProperty('--tilt-y', `${-y * 9}deg`);
      tiltFrame = null;
    });
  });
  walletStage.addEventListener('pointerleave', () => {
    if (tiltFrame) cancelAnimationFrame(tiltFrame);
    tiltFrame = null;
    walletStage.style.setProperty('--tilt-x', '0deg');
    walletStage.style.setProperty('--tilt-y', '0deg');
  });

  const dialog = document.querySelector('.project-dialog');
  let opener = null;
  document.querySelectorAll('[data-open="wallet"]').forEach(button => {
    button.disabled = false;
    button.addEventListener('click', () => {
      if (typeof dialog.showModal !== 'function') {
        document.querySelector('.wallet-fallback').open = true;
        document.querySelector('.wallet-fallback').scrollIntoView({ block: 'nearest' });
        return;
      }
      opener = button;
      dialog.showModal();
      dialog.querySelector('.dialog-close').focus();
    });
  });
  dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => { if (opener) opener.focus({ preventScroll: true }); });
  const controls = document.querySelector('.publication-controls');
  const recordRows = [...document.querySelectorAll('.records-table tbody tr')];
  const search = controls.querySelector('input');
  const filterButtons = [...controls.querySelectorAll('[data-filter]')];
  const count = document.querySelector('.record-count');
  const empty = document.querySelector('.empty-records');
  let activeFilter = 'all';
  function filterRecords() {
    const query = search.value.trim().toLocaleLowerCase();
    let visible = 0;
    recordRows.forEach(row => {
      const matchesType = activeFilter === 'all' || row.dataset.type === activeFilter;
      const matchesSearch = row.textContent.toLocaleLowerCase().includes(query);
      row.hidden = !(matchesType && matchesSearch);
      if (!row.hidden) visible += 1;
    });
    count.textContent = `${visible} of ${recordRows.length} records`;
    empty.hidden = visible !== 0;
    requestAnimationFrame(updateProgress);
  }
  filterButtons.forEach(button => button.addEventListener('click', () => {
    activeFilter = button.dataset.filter;
    filterButtons.forEach(filter => filter.setAttribute('aria-pressed', String(filter === button)));
    filterRecords();
  }));
  search.addEventListener('input', filterRecords);
  controls.hidden = false;
  count.hidden = false;
  filterRecords();
  // Native scrolling stays intact. The progress line reflects the actual page.
  const progress = document.querySelector('.reading-progress');
  const header = document.querySelector('.header');
  const sectionLinks = [...header.querySelectorAll('.header-inner > nav a[href^="#"]')];
  let scrollFrame = null;
  function updateProgress() {
    const distance = document.documentElement.scrollHeight - innerHeight;
    progress.style.transform = `scaleX(${distance > 0 ? Math.min(1, scrollY / distance) : 0})`;
    const underHeader = document.elementFromPoint(innerWidth * .5, header.offsetHeight + 2);
    // Transition bands ignore pointer events, so locate them by their bounds.
    const bridge = [...document.querySelectorAll('.chapter-bridge')].find(band => {
      const bounds = band.getBoundingClientRect();
      return bounds.top <= header.offsetHeight + 2 && bounds.bottom > header.offsetHeight + 2;
    });
    let bridgeIsDark = false;
    if (bridge) {
      const bounds = bridge.getBoundingClientRect();
      const portion = (header.offsetHeight + 2 - bounds.top) / bounds.height;
      bridgeIsDark = bridge.dataset.to === 'dark' ? portion > .5 : portion < .5;
    }
    header.dataset.tone = bridgeIsDark || underHeader?.closest('.chapter-dark,.results-band,.footer') ? 'dark' : 'light';
    const readingLine = header.offsetHeight + 50;
    sectionLinks.forEach(link => {
      const bounds = document.querySelector(link.hash).getBoundingClientRect();
      if (bounds.top <= readingLine && bounds.bottom > readingLine) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
    scrollFrame = null;
  }
  addEventListener('scroll', () => {
    if (scrollFrame === null) scrollFrame = requestAnimationFrame(updateProgress);
  }, { passive: true });
  addEventListener('resize', updateProgress, { passive: true });
  updateProgress();

  // Artwork motion runs only while a scene intersects the viewport.
  if ('IntersectionObserver' in window) {
    const artObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => entry.target.classList.toggle('in-view', entry.isIntersecting));
    }, { rootMargin: '80px' });
    document.querySelectorAll('[data-scene]').forEach(scene => artObserver.observe(scene));
    const entranceObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('entered');
        entranceObserver.unobserve(entry.target);
      });
    }, { threshold: .04 });
    document.querySelectorAll('[data-enter]').forEach(card => entranceObserver.observe(card));
  } else {
    document.querySelectorAll('[data-scene]').forEach(scene => scene.classList.add('in-view'));
  }

  // Native disclosure navigation stays available without JavaScript.
  const disclosure = document.querySelector('.nav-disclosure');
  const summary = disclosure.querySelector('summary');
  function closeNavigation(returnFocus = false) {
    disclosure.open = false;
    body.classList.remove('nav-open');
    summary.setAttribute('aria-expanded', 'false');
    if (returnFocus) summary.focus({ preventScroll:true });
    updateProgress();
    refreshScene();
  }
  disclosure.addEventListener('toggle', () => {
    body.classList.toggle('nav-open', disclosure.open);
    summary.setAttribute('aria-expanded', String(disclosure.open));
    if (!disclosure.open) updateProgress();
    refreshScene();
  });
  summary.setAttribute('aria-expanded', 'false');
  header.querySelectorAll('a').forEach(link => link.addEventListener('click', () => closeNavigation()));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && disclosure.open) closeNavigation(true);
  });
  document.addEventListener('pointerdown', event => {
    if (disclosure.open && !header.contains(event.target)) closeNavigation();
  });
  document.addEventListener('focusin', event => {
    if (disclosure.open && !header.contains(event.target)) closeNavigation();
  });

  // Original woven torus surface: geometric artwork, not operational data.
  const hero = document.querySelector('.hero');
  const art = document.querySelector('.hero-art');
  const canvas = document.querySelector('.signal-canvas');
  const ctx = canvas.getContext('2d', { alpha:true });
  if (ctx) {
    let width = 0, height = 0;
    let frame = null, lastTick = 0, phase = 0;
    let visible = true, mouseX = 0, mouseY = 0, targetX = 0, targetY = 0;
    let geometry = [];
    let segments = 180;
    let lanes = 10;
    function surface(t, v = 0) {
      const radius = 1 + .28 * Math.cos(3 * t);
      const band = .2 * v;
      return {
        x:(radius + band * Math.cos(3 * t)) * Math.cos(2 * t),
        y:(radius + band * Math.cos(3 * t)) * Math.sin(2 * t),
        z:.48 * Math.sin(3 * t) + band * Math.sin(3 * t)
      };
    }
    function buildGeometry() {
      segments = width < 620 ? 120 : 180;
      lanes = width < 620 ? 8 : 10;
      geometry = [];
      for (let i = 0; i <= segments; i++) {
        for (let lane = 0; lane <= lanes; lane++) geometry.push(surface(i / segments * Math.PI * 2, lane / lanes * 2 - 1));
      }
    }
    function project(point) {
      const angleY = phase * .19 + .3 + mouseX * .24;
      const angleX = -.7 + Math.sin(phase * .17) * .16 + mouseY * .2;
      const angleZ = -.23 + Math.sin(phase * .13) * .2;
      const a = point.x * Math.cos(angleY) + point.z * Math.sin(angleY);
      const b = -point.x * Math.sin(angleY) + point.z * Math.cos(angleY);
      const c = point.y * Math.cos(angleX) - b * Math.sin(angleX);
      const depth = point.y * Math.sin(angleX) + b * Math.cos(angleX);
      const perspective = 3.8 / (4 + depth * .35);
      const scale = Math.min(width * .33, height * .34);
      return {
        x:width * .49 + (a * Math.cos(angleZ) - c * Math.sin(angleZ)) * scale * perspective,
        y:height * .48 + (a * Math.sin(angleZ) + c * Math.cos(angleZ)) * scale * perspective,
        depth
      };
    }
    function drawScene() {
      if (!width || !height) return;
      ctx.clearRect(0, 0, width, height);
      const shadow = ctx.createRadialGradient(width * .49, height * .81, 0, width * .49, height * .81, width * .27);
      shadow.addColorStop(0, '#201e1924');
      shadow.addColorStop(1, '#201e1900');
      ctx.save();
      ctx.translate(0, height * .59);
      ctx.scale(1, .25);
      ctx.fillStyle = shadow;
      ctx.fillRect(0, 0, width, height);
      ctx.restore();
      const points = geometry.map(project);
      const faces = [];
      for (let i = 0; i < segments; i++) {
        for (let lane = 0; lane < lanes; lane++) {
          const n = i * (lanes + 1) + lane;
          const corners = [points[n], points[n + lanes + 1], points[n + lanes + 2], points[n + 1]];
          faces.push({ corners, depth:corners.reduce((sum,p) => sum + p.depth, 0) / 4, lane, i });
        }
      }
      faces.sort((a,b) => b.depth - a.depth);
      faces.forEach(face => {
        const light = .5 + .5 * Math.sin(face.i / segments * Math.PI * 6 + phase * .15);
        const specular = Math.pow(light, 5);
        const shade = Math.round(17 + light * 39 + specular * 110 + face.lane * .9);
        const red = shade + 6;
        const green = shade + 4;
        const blue = shade;
        ctx.beginPath();
        face.corners.forEach((point, index) => index ? ctx.lineTo(point.x, point.y) : ctx.moveTo(point.x, point.y));
        ctx.closePath();
        ctx.fillStyle = `rgb(${red},${green},${blue})`;
        ctx.fill();
        ctx.strokeStyle = `rgba(232,222,201,${.17 + light * .27})`;
        ctx.lineWidth = .55;
        ctx.stroke();
      });
      // Short moving highlights follow the geometry rather than flickering randomly.
      for (let runner = 0; runner < 3; runner++) {
        for (let trail = 8; trail >= 0; trail--) {
          const t = (phase * .55 + runner * Math.PI * 2 / 3 - trail * .024) % (Math.PI * 2);
          const point = project(surface(t, .85));
          ctx.globalAlpha = (1 - trail / 9) * .9;
          ctx.fillStyle = '#f0d6a3';
          ctx.beginPath();
          ctx.arc(point.x, point.y, trail ? 1.6 : 3, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
    }
    function tick(now) {
      frame = null;
      if (document.hidden || !visible || body.classList.contains('motion-off') || body.classList.contains('nav-open')) return;
      if (now - lastTick >= 1000 / 30) {
        const delta = lastTick ? Math.min(now - lastTick, 80) : 33;
        phase += delta * .00045;
        mouseX += (targetX - mouseX) * .06;
        mouseY += (targetY - mouseY) * .06;
        drawScene();
        lastTick = now;
      }
      frame = requestAnimationFrame(tick);
    }
    refreshScene = () => {
      if (frame !== null) cancelAnimationFrame(frame);
      frame = null;
      lastTick = 0;
      drawScene();
      if (!document.hidden && visible && !body.classList.contains('motion-off') && !body.classList.contains('nav-open')) frame = requestAnimationFrame(tick);
    };
    function resizeScene() {
      const rect = art.getBoundingClientRect();
      width = rect.width; height = rect.height;
      buildGeometry();
      const density = Math.min(devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(width * density);
      canvas.height = Math.round(height * density);
      ctx.setTransform(density, 0, 0, density, 0, 0);
      refreshScene();
    }
    hero.addEventListener('pointermove', event => {
      if (event.pointerType !== 'mouse') return;
      const rect = hero.getBoundingClientRect();
      targetX = (event.clientX - rect.left) / rect.width - .5;
      targetY = (event.clientY - rect.top) / rect.height - .5;
    }, { passive:true });
    hero.addEventListener('pointerleave', () => { targetX = 0; targetY = 0; });
    document.addEventListener('visibilitychange', refreshScene);
    if ('ResizeObserver' in window) new ResizeObserver(resizeScene).observe(art);
    else addEventListener('resize', resizeScene, { passive:true });
    if ('IntersectionObserver' in window) new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting;
      refreshScene();
    }, { threshold:0 }).observe(hero);
    resizeScene();
    body.classList.add('canvas-ready');
  }
  setMotion();
  body.classList.add('js-ready');
  if (typeof dialog.showModal !== 'function') body.classList.add('dialog-fallback');
})();
