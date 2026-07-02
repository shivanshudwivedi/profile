const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('in-view');
    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.14, rootMargin: '0px 0px -6% 0px' });

document.querySelectorAll('.reveal, .metric, .timeline').forEach((el) => revealObserver.observe(el));

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = Number(el.dataset.count);
    const decimals = Number(el.dataset.decimals || 0);
    const duration = reducedMotion ? 0 : 1400;
    const start = performance.now();

    const tick = (now) => {
      const progress = duration === 0 ? 1 : Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      el.textContent = (target * eased).toFixed(decimals);
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    counterObserver.unobserve(el);
  });
}, { threshold: 0.65 });

document.querySelectorAll('[data-count]').forEach((el) => counterObserver.observe(el));

const lattice = document.querySelector('.lattice-art');
if (lattice) {
  for (let i = 0; i < 14; i += 1) {
    const node = document.createElement('i');
    node.style.cssText = `position:absolute;left:${12 + Math.random() * 76}%;top:${10 + Math.random() * 80}%;width:8px;height:8px;border-radius:50%;background:${i % 3 ? '#d8ff55' : '#ff6b35'};box-shadow:0 0 18px currentColor;animation:blink ${1.5 + Math.random() * 2}s ${Math.random()}s infinite;`;
    lattice.appendChild(node);
  }
}

const particleArt = document.querySelector('.particle-art');
if (particleArt) {
  for (let i = 0; i < 34; i += 1) {
    const particle = document.createElement('i');
    particle.style.setProperty('--a', `${i * (360 / 34) + Math.random() * 9}deg`);
    particle.style.setProperty('--d', `${100 + Math.random() * 180}px`);
    particle.style.animationDelay = `${Math.random() * 2.5}s`;
    particleArt.appendChild(particle);
  }
}

if (!reducedMotion && window.matchMedia('(pointer: fine)').matches) {
  const glow = document.querySelector('.cursor-glow');
  window.addEventListener('pointermove', (event) => {
    glow.style.opacity = '1';
    glow.style.left = `${event.clientX}px`;
    glow.style.top = `${event.clientY}px`;
  }, { passive: true });

  document.querySelectorAll('[data-tilt]').forEach((card) => {
    card.addEventListener('pointermove', (event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(900px) rotateX(${-y * 3}deg) rotateY(${x * 3}deg)`;
    });
    card.addEventListener('pointerleave', () => { card.style.transform = ''; });
  });

  document.querySelectorAll('.magnetic').forEach((button) => {
    button.addEventListener('pointermove', (event) => {
      const rect = button.getBoundingClientRect();
      button.style.transform = `translate(${(event.clientX - rect.left - rect.width / 2) * 0.11}px, ${(event.clientY - rect.top - rect.height / 2) * 0.16}px)`;
    });
    button.addEventListener('pointerleave', () => { button.style.transform = ''; });
  });
}

let lastScroll = 0;
const header = document.querySelector('.site-header');
window.addEventListener('scroll', () => {
  const current = window.scrollY;
  header.style.transform = current > lastScroll && current > 180 ? 'translateY(-100%)' : '';
  lastScroll = current;
}, { passive: true });

document.getElementById('year').textContent = new Date().getFullYear();
