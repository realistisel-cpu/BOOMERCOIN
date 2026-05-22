/* ============================================================
   BOOMER — script.js
   ============================================================ */

(() => {
  'use strict';

  // ----- NAV SCROLL -----
  const nav = document.querySelector('.nav');
  const onScroll = () => {
    if (window.scrollY > 30) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ----- PARTICLES -----
  const particleHost = document.getElementById('particles');
  if (particleHost) {
    const count = window.innerWidth < 700 ? 14 : 28;
    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      const size = 3 + Math.random() * 6;
      p.style.width = p.style.height = size + 'px';
      p.style.left = Math.random() * 100 + '%';
      p.style.animationDuration = 8 + Math.random() * 12 + 's';
      p.style.animationDelay = -Math.random() * 20 + 's';
      const colors = ['#ff6b00', '#ffb800', '#ff2e93', '#7b3fff', '#00e5ff'];
      const c = colors[Math.floor(Math.random() * colors.length)];
      p.style.background = c;
      p.style.boxShadow = `0 0 12px ${c}`;
      particleHost.appendChild(p);
    }
  }

  // ----- REVEAL ON SCROLL -----
  const revealEls = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e, idx) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('in'), idx * 60);
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
  revealEls.forEach(el => io.observe(el));

  // ----- COPY CONTRACT ADDRESS -----
  const copyBtn = document.getElementById('copyBtn');
  const caText = document.getElementById('ca-text');
  const toast = document.getElementById('toast');
  if (copyBtn && caText) {
    copyBtn.addEventListener('click', async () => {
      const text = caText.textContent.trim();
      try {
        await navigator.clipboard.writeText(text);
      } catch {
        const ta = document.createElement('textarea');
        ta.value = text; document.body.appendChild(ta);
        ta.select(); document.execCommand('copy'); document.body.removeChild(ta);
      }
      copyBtn.classList.add('copied');
      copyBtn.querySelector('span').textContent = 'COPIED!';
      toast.classList.add('show');
      setTimeout(() => {
        copyBtn.classList.remove('copied');
        copyBtn.querySelector('span').textContent = 'COPY';
        toast.classList.remove('show');
      }, 1800);
    });
  }

  // ----- ANIMATED COUNTERS -----
  const formatNum = (n) => {
    if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(n % 1_000_000_000 ? 2 : 0) + 'B';
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(n % 1_000_000 ? 1 : 0) + 'M';
    if (n >= 1_000) return n.toLocaleString();
    return n.toString();
  };
  const counters = document.querySelectorAll('.stat-num[data-count]');
  const countObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = parseInt(el.dataset.count, 10);
      const duration = 1600;
      const start = performance.now();
      const step = (now) => {
        const t = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - t, 3);
        const val = Math.floor(target * eased);
        el.textContent = formatNum(val);
        if (t < 1) requestAnimationFrame(step);
        else el.textContent = formatNum(target);
      };
      requestAnimationFrame(step);
      countObs.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach(c => countObs.observe(c));

  // ----- MOUSE PARALLAX (hero) -----
  const heroArt = document.querySelector('.hero-art');
  const heroBoomer = document.getElementById('heroBoomer');
  if (heroArt && heroBoomer) {
    const coins = heroArt.querySelectorAll('.float-coin');
    heroArt.addEventListener('mousemove', (e) => {
      const r = heroArt.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      heroBoomer.style.transform = `translate(${x * 18}px, ${y * 18}px) rotate(${x * 4}deg)`;
      coins.forEach((c, i) => {
        const f = (i + 1) * 6;
        c.style.transform = `translate(${x * f}px, ${y * f}px)`;
      });
    });
    heroArt.addEventListener('mouseleave', () => {
      heroBoomer.style.transform = '';
      coins.forEach(c => c.style.transform = '');
    });
  }

  // ----- GLOBAL PARALLAX FOR STICKERS / BLOBS -----
  const stickers = document.querySelectorAll('.sticker');
  const blobs = document.querySelectorAll('.blob');
  let mx = 0, my = 0, tx = 0, ty = 0;
  window.addEventListener('mousemove', (e) => {
    tx = (e.clientX / window.innerWidth - 0.5);
    ty = (e.clientY / window.innerHeight - 0.5);
  });
  const parallaxTick = () => {
    mx += (tx - mx) * 0.05;
    my += (ty - my) * 0.05;
    stickers.forEach((s, i) => {
      const depth = (i + 1) * 12;
      s.style.transform = `translate(${mx * depth}px, ${my * depth}px)`;
    });
    blobs.forEach((b, i) => {
      const depth = (i + 1) * 20;
      b.style.translate = `${mx * depth}px ${my * depth}px`;
    });
    requestAnimationFrame(parallaxTick);
  };
  parallaxTick();

  // ----- CARD TILT EFFECT -----
  const tiltEls = document.querySelectorAll('[data-tilt]');
  tiltEls.forEach(el => {
    let rect = null;
    el.addEventListener('mouseenter', () => { rect = el.getBoundingClientRect(); });
    el.addEventListener('mousemove', (e) => {
      if (!rect) rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      const rx = (y - 0.5) * -10;
      const ry = (x - 0.5) * 12;
      el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(0)`;
      el.style.setProperty('--mx', (x * 100) + '%');
      el.style.setProperty('--my', (y * 100) + '%');
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
      rect = null;
    });
  });

  // ----- LIGHTBOX FOR GALLERY -----
  const lb = document.getElementById('lightbox');
  const lbImg = document.getElementById('lbImg');
  const lbClose = document.getElementById('lbClose');
  document.querySelectorAll('.m-item img').forEach(img => {
    img.addEventListener('click', (e) => {
      e.stopPropagation();
      lbImg.src = img.src;
      lb.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });
  const closeLb = () => {
    lb.classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(() => { lbImg.src = ''; }, 300);
  };
  lbClose && lbClose.addEventListener('click', closeLb);
  lb && lb.addEventListener('click', (e) => { if (e.target === lb) closeLb(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLb(); });

  // ----- SMOOTH ANCHOR SCROLL OFFSET FOR FIXED NAV -----
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id.length <= 1) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 70;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  // ----- BUTTON RIPPLE -----
  document.querySelectorAll('.btn-primary').forEach(btn => {
    btn.addEventListener('click', function (e) {
      const ripple = document.createElement('span');
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      ripple.style.cssText = `
        position:absolute;border-radius:50%;pointer-events:none;
        width:${size}px;height:${size}px;
        left:${e.clientX - rect.left - size/2}px;
        top:${e.clientY - rect.top - size/2}px;
        background:rgba(255,255,255,0.5);
        transform:scale(0);opacity:1;
        transition:transform .6s ease,opacity .6s ease;`;
      this.appendChild(ripple);
      requestAnimationFrame(() => {
        ripple.style.transform = 'scale(2)';
        ripple.style.opacity = '0';
      });
      setTimeout(() => ripple.remove(), 600);
    });
  });

})();
