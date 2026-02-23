/*
  main.js
  - Theme toggle (dark/light) with localStorage persistence
  - Mobile menu toggle
  - Active section highlighting (IntersectionObserver)
  - Small UX niceties
*/

(function () {
  'use strict';

  const STORAGE_KEY = 'portfolio_theme';

  function setTheme(mode) {
    const root = document.documentElement;
    const themeLabel = document.getElementById('themeLabel');
    const iconSun = document.getElementById('iconSun');
    const iconMoon = document.getElementById('iconMoon');

    if (mode === 'light') {
      root.classList.remove('dark');
      if (themeLabel) themeLabel.textContent = 'Light';
      if (iconSun) iconSun.classList.remove('hidden');
      if (iconMoon) iconMoon.classList.add('hidden');

      localStorage.setItem(STORAGE_KEY, 'light');
      return;
    }

    // Dark mode (default)
    root.classList.add('dark');

    if (themeLabel) themeLabel.textContent = 'Dark';
    if (iconSun) iconSun.classList.add('hidden');
    if (iconMoon) iconMoon.classList.remove('hidden');

    localStorage.setItem(STORAGE_KEY, 'dark');
  }

  function getInitialTheme() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'light' || saved === 'dark') return saved;

    const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
    return prefersLight ? 'light' : 'dark';
  }

  function setupThemeToggle() {
    const btn = document.getElementById('themeToggle');
    if (!btn) return;

    setTheme(getInitialTheme());

    btn.addEventListener('click', () => {
      const current = localStorage.getItem(STORAGE_KEY) || 'dark';
      setTheme(current === 'dark' ? 'light' : 'dark');
    });
  }

  function setupMobileMenu() {
    const btn = document.getElementById('mobileMenuBtn');
    const menu = document.getElementById('mobileMenu');
    if (!btn || !menu) return;

    const closeMenu = () => {
      menu.classList.add('hidden');
      btn.setAttribute('aria-expanded', 'false');
    };

    btn.addEventListener('click', () => {
      const isOpen = !menu.classList.contains('hidden');
      if (isOpen) {
        closeMenu();
      } else {
        menu.classList.remove('hidden');
        btn.setAttribute('aria-expanded', 'true');
      }
    });

    // Close after clicking a link
    document.querySelectorAll('.mobile-link').forEach((link) => {
      link.addEventListener('click', closeMenu);
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMenu();
    });

    // Close when resizing up to desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth >= 768) closeMenu();
    });
  }

  function setupActiveNav() {
    const links = Array.from(document.querySelectorAll('.nav-link'));
    if (!links.length) return;

    const sectionIds = links
      .map((a) => (a.getAttribute('href') || '').replace('#', ''))
      .filter(Boolean);

    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    const setActive = (id) => {
      links.forEach((a) => {
        const target = (a.getAttribute('href') || '').replace('#', '');
        const active = target === id;
        a.classList.toggle('bg-white/10', active);
        a.classList.toggle('text-white', active);
      });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the most visible section
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (b.intersectionRatio || 0) - (a.intersectionRatio || 0));

        if (visible[0] && visible[0].target && visible[0].target.id) {
          setActive(visible[0].target.id);
        }
      },
      {
        root: null,
        threshold: [0.2, 0.35, 0.5, 0.65],
      }
    );

    sections.forEach((s) => observer.observe(s));
  }

  function setupMicroInteractions() {
    // Subtle card lift on hover for service and project cards
    const cards = document.querySelectorAll('article.group');
    cards.forEach((card) => {
      card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-4px)';
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
      });
    });
  }

  function setupYear() {
    const el = document.getElementById('year');
    if (el) el.textContent = String(new Date().getFullYear());
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;');
  }

  function renderProjects() {
    const grid = document.getElementById('projectsGrid');
    if (!grid) return;

    const projects = [
      {
        title: 'Project One',
        description: 'A clean, responsive front-end project with smooth interactions and accessible UI.',
        tags: ['HTML', 'Tailwind', 'JavaScript'],
        codeUrl: 'https://github.com/habib-allah1',
        gradient: 'from-brand-500/30 via-emerald-400/10 to-pink-400/10',
        badge: 'Placeholder',
      },
      {
        title: 'Project Two',
        description: 'A UI-focused project showcasing layout systems, components, and micro-animations.',
        tags: ['HTML', 'Tailwind', 'JS'],
        codeUrl: 'https://github.com/habib-allah1',
        gradient: 'from-emerald-400/25 via-brand-500/10 to-pink-400/10',
        badge: 'Placeholder',
      },
      {
        title: 'Project Three',
        description: 'A project blending web fundamentals with AI-enhanced user experience ideas.',
        tags: ['HTML', 'Tailwind', 'JavaScript'],
        codeUrl: 'https://github.com/habib-allah1',
        gradient: 'from-pink-400/20 via-brand-500/10 to-emerald-400/10',
        badge: 'Placeholder',
      },
    ];

    const cardHtml = (p) => {
      const tagsHtml = (p.tags || [])
        .map(
          (t) =>
            `<span class="rounded-full border border-white/10 bg-slate-950/30 px-3 py-1 text-xs text-slate-200">${escapeHtml(t)}</span>`
        )
        .join('');

      return `
        <article class="group rounded-3xl border border-white/10 bg-white/5 overflow-hidden hover:shadow-glow transition-shadow">
          <div class="h-44 bg-gradient-to-br ${escapeHtml(p.gradient)} relative">
            <div class="absolute inset-0 opacity-40 [background-image:linear-gradient(to_right,rgba(255,255,255,0.10)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.10)_1px,transparent_1px)] [background-size:32px_32px]"></div>
            <div class="absolute bottom-3 left-3 text-xs rounded-full border border-white/10 bg-slate-950/40 px-3 py-1">${escapeHtml(p.badge || '')}</div>
          </div>
          <div class="p-6">
            <h3 class="text-lg font-semibold group-hover:text-white transition">${escapeHtml(p.title)}</h3>
            <p class="mt-2 text-sm text-slate-200/85">${escapeHtml(p.description)}</p>
            <div class="mt-4 flex flex-wrap gap-2">${tagsHtml}</div>
            <div class="mt-6">
              <a href="${escapeHtml(p.codeUrl)}" target="_blank" rel="noreferrer" class="inline-flex w-full items-center justify-center rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold hover:bg-white/10 transition">
                View Code
                <span class="ml-2 text-slate-400">↗</span>
              </a>
            </div>
          </div>
        </article>
      `;
    };

    grid.innerHTML = projects.map(cardHtml).join('');
  }

  async function copyTextToClipboard(text) {
    if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
      await navigator.clipboard.writeText(text);
      return true;
    }

    // Fallback for older browsers
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.left = '-9999px';
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(ta);
    return ok;
  }

  function setupCopyEmail() {
    const btn = document.getElementById('copyEmailBtn');
    const emailEl = document.getElementById('emailAddress');
    const statusEl = document.getElementById('copyEmailStatus');

    if (!btn || !emailEl) return;

    const getEmail = () => (emailEl.textContent || '').trim();

    btn.addEventListener('click', async () => {
      const email = getEmail();
      if (!email) return;

      const prevText = btn.textContent;
      btn.disabled = true;
      btn.textContent = 'Copied';
      if (statusEl) statusEl.textContent = 'Email address copied to clipboard.';

      try {
        await copyTextToClipboard(email);
      } catch {
        if (statusEl) statusEl.textContent = 'Could not copy email address.';
        btn.textContent = 'Copy';
      } finally {
        window.setTimeout(() => {
          btn.disabled = false;
          btn.textContent = prevText && prevText.trim() ? prevText : 'Copy';
        }, 1200);
      }
    });
  }

  function setupBackToTop() {
    const btn = document.getElementById('backToTop');
    if (!btn) return;

    const show = () => {
      btn.classList.remove('opacity-0', 'pointer-events-none');
      btn.classList.add('opacity-100');
    };
    const hide = () => {
      btn.classList.remove('opacity-100');
      btn.classList.add('opacity-0', 'pointer-events-none');
    };

    const onScroll = () => {
      if (window.scrollY > window.innerHeight * 0.6) {
        show();
      } else {
        hide();
      }
    };

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // initial check
  }

  function setupNewsletter() {
    const form = document.querySelector('#newsletter form');
    const emailInput = document.getElementById('newsletterEmail');
    const statusEl = document.getElementById('newsletterStatus');

    if (!form || !emailInput || !statusEl) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = emailInput.value.trim();
      if (!email) return;

      // Disable form
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Subscribing…';
      emailInput.disabled = true;

      // Simulate API call (replace with real integration later)
      await new Promise(resolve => setTimeout(resolve, 1200));

      // Success feedback
      statusEl.textContent = `Successfully subscribed with ${email}.`;
      statusEl.classList.remove('sr-only');
      statusEl.className = 'mt-2 text-sm text-brand-400';
      emailInput.value = '';

      // Re-enable form
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
      emailInput.disabled = false;

      // Hide status after 5 seconds
      setTimeout(() => {
        statusEl.classList.add('sr-only');
        statusEl.className = 'sr-only';
        statusEl.textContent = '';
      }, 5000);
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    setupThemeToggle();
    setupMobileMenu();
    setupActiveNav();
    setupYear();
    renderProjects();
    setupCopyEmail();
    setupBackToTop();
    setupMicroInteractions();
    setupNewsletter();
  });
})();
