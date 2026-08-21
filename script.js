const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('in-view');
    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.14, rootMargin: '0px 0px -6% 0px' });

document.querySelectorAll('.reveal, .metric').forEach((el) => revealObserver.observe(el));

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
const navLinks = Array.from(document.querySelectorAll('.site-header nav a'));
const navTargets = navLinks
  .map((a) => ({ a, el: document.querySelector(a.getAttribute('href')) }))
  .filter((t) => t.el);
let currentNav = '';

const onScroll = () => {
  const y = window.scrollY;

  header.style.transform = y > lastScroll && y > 220 ? 'translateY(-100%)' : '';
  header.classList.toggle('is-condensed', y > 40);
  lastScroll = y;

  // mark the section the reader is actually in
  let active = '';
  const line = y + window.innerHeight * 0.36;
  navTargets.forEach(({ a, el }) => {
    if (el.offsetTop <= line) active = a.getAttribute('href');
  });
  if (active !== currentNav) {
    currentNav = active;
    navLinks.forEach((a) => {
      if (a.getAttribute('href') === active) a.setAttribute('aria-current', 'true');
      else a.removeAttribute('aria-current');
    });
  }
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

document.getElementById('year').textContent = new Date().getFullYear();
