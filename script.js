/* =============================================
   ZAINAB PORTFOLIO — script.js
   Interactions: nav scroll, mobile menu,
   counter animation, filter, testimonial slider,
   scroll reveals, particles, contact form
   ============================================= */

(function () {
  'use strict';

  /* ---- THEME: system preference with a saved manual override ---- */
  const root = document.documentElement;
  const themeToggle = document.getElementById('theme-toggle');
  const systemThemeQuery = window.matchMedia('(prefers-color-scheme: dark)');
  let themePreference = root.dataset.themePreference || 'system';

  function applyTheme(theme) {
    root.dataset.theme = theme;

    if (themeToggle) {
      const nextTheme = theme === 'dark' ? 'light' : 'dark';
      themeToggle.setAttribute('aria-label', `Switch to ${nextTheme} theme`);
      themeToggle.setAttribute('title', `Switch to ${nextTheme} theme`);
    }
  }

  if (themeToggle) {
    applyTheme(root.dataset.theme || (systemThemeQuery.matches ? 'dark' : 'light'));

    themeToggle.addEventListener('click', () => {
      const nextTheme = root.dataset.theme === 'dark' ? 'light' : 'dark';
      themePreference = nextTheme;
      root.dataset.themePreference = themePreference;
      applyTheme(nextTheme);

      try {
        localStorage.setItem('portfolio-theme', nextTheme);
      } catch (error) {
        console.warn('Unable to save the theme preference.', error);
      }
    });
  }

  systemThemeQuery.addEventListener('change', (event) => {
    if (themePreference === 'system') {
      applyTheme(event.matches ? 'dark' : 'light');
    }
  });

  /* ---- NAVBAR: scroll shrink ---- */
  const navbar = document.getElementById('navbar');

  function handleScroll() {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });

  /* ---- MOBILE MENU ---- */
  const hamburger   = document.getElementById('hamburger');
  const mobileMenu  = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  hamburger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', isOpen);
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
    });
  });

  /* ---- SMOOTH SCROLL for all anchor links ---- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ---- HERO PARTICLES ---- */
  function createParticles() {
    const container = document.getElementById('hero-particles');
    if (!container) return;

    const count = 28;
    for (let i = 0; i < count; i++) {
      const dot = document.createElement('div');
      const size = Math.random() * 3 + 1.5;
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      const duration = Math.random() * 8 + 6;
      const delay = Math.random() * 6;
      const opacity = Math.random() * 0.5 + 0.1;

      // Alternate between purple and blue tones
      const colors = ['183,110,240', '91,141,246', '224,64,251', '56,189,248'];
      const color = colors[Math.floor(Math.random() * colors.length)];

      dot.style.cssText = `
        position: absolute;
        left: ${x}%;
        top: ${y}%;
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        background: rgba(${color}, ${opacity});
        animation: particle-float ${duration}s ${delay}s ease-in-out infinite;
        pointer-events: none;
      `;
      container.appendChild(dot);
    }

    // Inject the keyframes once
    if (!document.getElementById('particle-keyframes')) {
      const style = document.createElement('style');
      style.id = 'particle-keyframes';
      style.textContent = `
        @keyframes particle-float {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: var(--op, 0.3); }
          33%  { transform: translate(${rand(-30, 30)}px, ${rand(-40, -10)}px) scale(1.2); }
          66%  { transform: translate(${rand(-20, 20)}px, ${rand(-20, 20)}px) scale(0.8); }
        }
      `;
      document.head.appendChild(style);
    }

    function rand(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }
  }

  createParticles();

  /* ---- COUNTER ANIMATION ---- */
  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const duration = 1800;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Easing: ease-out
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target);
      if (progress < 1) requestAnimationFrame(update);
      else el.textContent = target;
    }

    requestAnimationFrame(update);
  }

  const statNumbers = document.querySelectorAll('.stat-number');
  let statsAnimated = false;

  function checkStats() {
    if (statsAnimated) return;
    const statsSection = document.getElementById('stats');
    if (!statsSection) return;

    const rect = statsSection.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.85) {
      statsAnimated = true;
      statNumbers.forEach(el => animateCounter(el));
    }
  }

  window.addEventListener('scroll', checkStats, { passive: true });
  checkStats();

  /* ---- PORTFOLIO FILTER ---- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioCards = document.querySelectorAll('.portfolio-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      // Update active state
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Show/hide cards
      portfolioCards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.classList.remove('hidden');
          card.style.opacity = '0';
          card.style.transform = 'translateY(16px)';
          requestAnimationFrame(() => {
            card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          });
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  /* ---- TESTIMONIALS SLIDER ---- */
  const track     = document.getElementById('testimonials-track');
  const prevBtn   = document.getElementById('track-prev');
  const nextBtn   = document.getElementById('track-next');
  const dots      = document.querySelectorAll('.track-dot');

  let currentSlide  = 0;
  let slideWidth    = 0;
  let totalSlides   = 0;

  function getSlideConfig() {
    const cards = track.querySelectorAll('.testimonial-card');
    totalSlides = cards.length;
    if (totalSlides === 0) return;
    slideWidth = cards[0].offsetWidth + 24; // gap is 24px
  }

  function goToSlide(index) {
    getSlideConfig();
    const maxIndex = Math.max(0, totalSlides - 2);
    currentSlide = Math.max(0, Math.min(index, maxIndex));
    track.style.transform = `translateX(-${currentSlide * slideWidth}px)`;

    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentSlide);
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => goToSlide(currentSlide - 1));
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', () => goToSlide(currentSlide + 1));
  }
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => goToSlide(i));
  });

  // Auto-advance slider
  let sliderInterval = setInterval(() => {
    const cards = track ? track.querySelectorAll('.testimonial-card') : [];
    const max = Math.max(0, cards.length - 2);
    goToSlide(currentSlide >= max ? 0 : currentSlide + 1);
  }, 5000);

  // Pause on hover
  if (track) {
    track.addEventListener('mouseenter', () => clearInterval(sliderInterval));
    track.addEventListener('mouseleave', () => {
      sliderInterval = setInterval(() => {
        const cards = track.querySelectorAll('.testimonial-card');
        const max = Math.max(0, cards.length - 2);
        goToSlide(currentSlide >= max ? 0 : currentSlide + 1);
      }, 5000);
    });
  }

  window.addEventListener('resize', () => goToSlide(currentSlide));
  window.addEventListener('load', () => goToSlide(0));

  /* ---- SCROLL REVEAL ---- */
  const revealTargets = document.querySelectorAll(
    '.service-card, .portfolio-card, .testimonial-card, .stat-item, ' +
    '.about-grid, .contact-grid, .platform-item, .featured-video-section'
  );

  revealTargets.forEach(el => el.classList.add('reveal'));

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger within groups
        const siblings = entry.target.parentElement.querySelectorAll('.reveal:not(.visible)');
        let delay = 0;
        siblings.forEach((sib, idx) => {
          if (sib === entry.target) delay = idx * 80;
        });

        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);

        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealTargets.forEach(el => revealObserver.observe(el));

  /* ---- ACTIVE NAV LINK (on scroll) ---- */
  const sections   = document.querySelectorAll('section[id]');
  const navLinks   = document.querySelectorAll('.nav-link');

  function updateActiveNav() {
    const scrollY = window.scrollY;

    sections.forEach(section => {
      const sectionTop    = section.offsetTop - 100;
      const sectionHeight = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active-link');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active-link');
          }
        });
      }
    });
  }

  // Add active-link style
  const linkStyle = document.createElement('style');
  linkStyle.textContent = `.nav-link.active-link { color: var(--txt-primary); background: rgba(255,255,255,0.06); }`;
  document.head.appendChild(linkStyle);

  window.addEventListener('scroll', updateActiveNav, { passive: true });

  /* ---- CONTACT FORM (client-side validation + feedback) ---- */
  const contactForm = document.getElementById('contact-form');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameEl    = document.getElementById('contact-name');
      const emailEl   = document.getElementById('contact-email-input');
      const msgEl     = document.getElementById('contact-message');
      const submitBtn = document.getElementById('btn-contact-submit');

      // Simple validation
      let valid = true;
      [nameEl, emailEl, msgEl].forEach(el => {
        el.style.borderColor = '';
        if (!el.value.trim()) {
          el.style.borderColor = '#f87171';
          valid = false;
        }
      });

      if (emailEl.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailEl.value)) {
        emailEl.style.borderColor = '#f87171';
        valid = false;
      }

      if (!valid) return;

      // Success feedback
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Message Sent! ✅';
      submitBtn.style.background = 'linear-gradient(135deg, #4ade80, #22c55e)';
      submitBtn.disabled = true;

      setTimeout(() => {
        submitBtn.textContent = originalText;
        submitBtn.style.background = '';
        submitBtn.disabled = false;
        contactForm.reset();
      }, 3000);

      // NOTE: Wire up a real backend (e.g., Formspree, EmailJS, or a serverless function)
      // to actually send the form data. Replace the setTimeout above with your API call.
    });
  }

  /* ---- CURSOR GLOW EFFECT (desktop only) ---- */
  if (window.matchMedia('(pointer: fine)').matches) {
    const glow = document.createElement('div');
    glow.style.cssText = `
      position: fixed;
      pointer-events: none;
      z-index: 9999;
      width: 280px;
      height: 280px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(183,110,240,0.07) 0%, transparent 70%);
      transform: translate(-50%, -50%);
      transition: opacity 0.3s ease;
      top: 0;
      left: 0;
    `;
    document.body.appendChild(glow);

    document.addEventListener('mousemove', (e) => {
      glow.style.left = e.clientX + 'px';
      glow.style.top  = e.clientY + 'px';
    });

    document.addEventListener('mouseleave', () => { glow.style.opacity = '0'; });
    document.addEventListener('mouseenter', () => { glow.style.opacity = '1'; });
  }

})();
