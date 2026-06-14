/* =========================================================
   DREAM CATCHER HOMES — Main JS
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  // ─── Inject config-driven links ────────────────────────
  if (typeof CONFIG !== 'undefined') {
    const waLink = `https://wa.me/${CONFIG.whatsappNumber.replace(/[^0-9]/g, '')}?text=Hello%2C%20I%27d%20like%20to%20enquire%20about%20a%20villa%20booking%20at%20Dream%20Catcher%20Homes%2C%20Mirleft.`;

    document.querySelectorAll('[data-action="whatsapp"]').forEach(el => {
      el.href = waLink;
      el.target = '_blank';
      el.rel = 'noopener';
    });

    document.querySelectorAll('[data-action="book"]').forEach(el => {
      el.href = CONFIG.bookingUrl;
      el.target = '_blank';
      el.rel = 'noopener';
    });

    document.querySelectorAll('[data-email]').forEach(el => {
      el.href = `mailto:${CONFIG.contactEmail}`;
      el.textContent = CONFIG.contactEmail;
    });

    document.querySelectorAll('[data-phone]').forEach(el => {
      el.textContent = CONFIG.phoneNumber;
    });

    document.querySelectorAll('[data-address]').forEach(el => {
      el.textContent = CONFIG.address;
    });

    const mapEl = document.getElementById('google-map');
    if (mapEl) mapEl.src = CONFIG.googleMapsEmbedUrl;
  }

  // ─── Sticky nav ────────────────────────────────────────
  const nav = document.querySelector('.nav');
  if (nav) {
    const onScroll = () => {
      nav.classList.toggle('scrolled', window.scrollY > 60);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ─── Mobile menu ───────────────────────────────────────
  const hamburger   = document.querySelector('.nav__hamburger');
  const mobileMenu  = document.querySelector('.nav__mobile');
  const mobileClose = document.querySelector('.nav__mobile-close');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      mobileMenu.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
    const closeMenu = () => {
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    };
    if (mobileClose) mobileClose.addEventListener('click', closeMenu);
    mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  }

  // ─── Reveal on scroll ──────────────────────────────────
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(el => io.observe(el));
  }

  // ─── Hero parallax ─────────────────────────────────────
  const heroBg = document.querySelector('.hero__bg');
  if (heroBg) {
    heroBg.classList.add('loaded');
    window.addEventListener('scroll', () => {
      const offset = window.scrollY * 0.3;
      heroBg.style.transform = `translateY(${offset}px)`;
    }, { passive: true });
  }

  // ─── FAQ accordion ─────────────────────────────────────
  document.querySelectorAll('.faq-item__btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const item   = btn.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      // Close all
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      // Toggle clicked
      if (!isOpen) item.classList.add('open');
    });
  });

  // ─── Inquiry form ──────────────────────────────────────
  const form = document.getElementById('inquiry-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name    = form.querySelector('#f-name')?.value    || '';
      const phone   = form.querySelector('#f-phone')?.value   || '';
      const checkin = form.querySelector('#f-checkin')?.value || '';
      const checkout= form.querySelector('#f-checkout')?.value|| '';
      const msg     = form.querySelector('#f-message')?.value || '';

      if (typeof CONFIG !== 'undefined') {
        // Build WhatsApp message
        const waText = encodeURIComponent(
          `Hello, I'd like to make an enquiry at Dream Catcher Homes, Mirleft.\n\n` +
          `Name: ${name}\nPhone: ${phone}\nCheck-in: ${checkin}\nCheck-out: ${checkout}\n\nMessage: ${msg}`
        );
        const waLink = `https://wa.me/${CONFIG.whatsappNumber.replace(/[^0-9]/g,'')}?text=${waText}`;
        window.open(waLink, '_blank', 'noopener');
      }
    });
  }

  // ─── Gallery lightbox (minimal) ────────────────────────
  document.querySelectorAll('.gallery__item').forEach((item, i) => {
    item.addEventListener('click', () => {
      const labels = ['Oceanfront', 'Terrace', 'Dunes', 'Pool', 'Interior'];
      // Simple toast on click (replace with real lightbox in production)
      showToast(`${labels[i] || 'View'} — replace with real images to enable gallery`);
    });
  });

  // Simple toast utility
  function showToast(msg) {
    const t = document.createElement('div');
    t.style.cssText = `
      position:fixed;bottom:90px;left:50%;transform:translateX(-50%);
      background:#1A4A6B;color:#fff;padding:12px 24px;border-radius:40px;
      font-size:.8125rem;z-index:9999;opacity:0;transition:opacity .3s;
      font-family:Jost,sans-serif;white-space:nowrap;
    `;
    t.textContent = msg;
    document.body.appendChild(t);
    requestAnimationFrame(() => { t.style.opacity = '1'; });
    setTimeout(() => {
      t.style.opacity = '0';
      setTimeout(() => t.remove(), 300);
    }, 3000);
  }

  // ─── Villa card CTA links ──────────────────────────────
  document.querySelectorAll('.villa-card .btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (typeof CONFIG !== 'undefined') {
        window.open(CONFIG.bookingUrl, '_blank', 'noopener');
      }
    });
  });

});
