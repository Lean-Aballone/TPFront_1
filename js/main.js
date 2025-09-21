const initHamburger = () => {
  const btn = document.getElementById("hamburger");
  const nav = document.getElementById("site-nav");
  if (!btn || !nav) return;

  const mq = window.matchMedia("(min-width: 900px)");
  let backdrop = null;

  const createBackdrop = () => {
    if (backdrop || mq.matches) return;
    backdrop = document.createElement("div");
    backdrop.className = "backdrop";
    backdrop.addEventListener("click", closeNav);
    document.body.appendChild(backdrop);
    requestAnimationFrame(() => backdrop.classList.add("show"));
  };
  const removeBackdrop = () => {
    if (!backdrop) return;
    backdrop.classList.remove("show");
    backdrop.addEventListener(
      "transitionend",
      () => {
        backdrop?.remove();
        backdrop = null;
      },
      { once: true }
    );
  };

  const openNav = () => {
    nav.classList.add("is-open");
    btn.setAttribute("aria-expanded", "true");
    document.body.classList.add("nav-open");
    createBackdrop();
    nav.querySelector("a")?.focus(); // foco al primer link
  };
  const closeNav = () => {
    nav.classList.remove("is-open");
    btn.setAttribute("aria-expanded", "false");
    document.body.classList.remove("nav-open");
    removeBackdrop();
  };
  const toggleNav = () =>
    btn.getAttribute("aria-expanded") === "true" ? closeNav() : openNav();

  const applyLayout = () => {
    if (mq.matches) {
      closeNav();
      removeBackdrop();
    } else {
      closeNav();
    }
  };

  btn.addEventListener("click", toggleNav);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeNav();
  });
  nav.addEventListener("click", (e) => {
    const a = e.target.closest("a");
    if (a && !mq.matches) closeNav();
  });
  mq.addEventListener("change", applyLayout);

  applyLayout();
};


/**
 * Controla el modo oscuro/claro y persiste la preferencia del usuario.
 */
const toggleTheme = () => {
  const trigger = document.querySelector('[data-js="theme-toggle"]');
  if (!trigger) return;

  const htmlEl = document.documentElement;
  const labelEl = trigger.querySelector('[data-js="theme-toggle-label"]');
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

  let storageAvailable = true;
  try {
    const testKey = '__gonza_theme__';
    window.localStorage.setItem(testKey, '1');
    window.localStorage.removeItem(testKey);
  } catch (error) {
    storageAvailable = false;
  }

  const readPreference = () => {
    if (!storageAvailable) return null;
    return window.localStorage.getItem('gonza_theme');
  };

  const writePreference = (value) => {
    if (!storageAvailable) return;
    window.localStorage.setItem('gonza_theme', value);
  };

  const updateLabel = (isDark) => {
    const text = isDark ? 'Modo claro' : 'Modo oscuro';
    if (labelEl) {
      labelEl.textContent = text;
    } else {
      trigger.textContent = text;
    }
  };

  const applyTheme = (isDark, persist = false) => {
    htmlEl.classList.toggle('theme-dark', isDark);
    trigger.setAttribute('aria-pressed', String(isDark));
    updateLabel(isDark);
    if (persist) {
      writePreference(isDark ? 'dark' : 'light');
    }
  };

  const stored = readPreference();
  if (stored === 'dark' || stored === 'light') {
    applyTheme(stored === 'dark');
  } else {
    applyTheme(mediaQuery.matches);
  }

  trigger.addEventListener('click', () => {
    const willBeDark = !htmlEl.classList.contains('theme-dark');
    applyTheme(willBeDark, true);
  });

  mediaQuery.addEventListener('change', (event) => {
    if (readPreference()) return;
    applyTheme(event.matches);
  });
};

/**
 * Resalta aleatoriamente una habilidad y una película para explorar contenido.
 */
const randomHighlight = () => {
  const trigger = document.querySelector('[data-js="random-highlight"]');
  if (!trigger) return;

  const skillItems = () => Array.from(document.querySelectorAll('[data-js="skill-item"]'));
  const movieItems = () => Array.from(document.querySelectorAll('[data-js="movie-item"]'));
  const highlightClass = 'highlight';

  const clearHighlights = (items) => {
    items.forEach((item) => item.classList.remove(highlightClass));
  };

  const randomItem = (items) => {
    if (!items.length) return null;
    const index = Math.floor(Math.random() * items.length);
    return items[index];
  };

  const runHighlight = () => {
    const skills = skillItems();
    const movies = movieItems();
    if (!skills.length || !movies.length) return;

    clearHighlights(skills);
    clearHighlights(movies);

    const nextSkill = randomItem(skills);
    const nextMovie = randomItem(movies);

    nextSkill?.classList.add(highlightClass);
    nextMovie?.classList.add(highlightClass);
  };

  trigger.addEventListener('click', () => {
    runHighlight();
  });

  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    runHighlight();
  }
};

/**
 * Aplica scroll suave a los anclajes del navbar fijo respetando reduced motion.
 */
const smoothScrollInit = () => {
  const nav = document.querySelector('[data-js="section-nav"]');
  if (!nav) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const links = nav.querySelectorAll('a[href^="#"]');

  links.forEach((link) => {
    link.addEventListener('click', (event) => {
      const targetId = link.getAttribute('href');
      if (!targetId) return;

      const target = document.querySelector(targetId);
      if (!target) return;

      event.preventDefault();
      target.scrollIntoView({
        behavior: reduceMotion.matches ? 'auto' : 'smooth',
        block: 'start',
      });
    });
  });
};

/**
 * Inicializa los comportamientos específicos de gonza.html.
 */
const initGonzaFeatures = () => {
  toggleTheme();
  randomHighlight();
  smoothScrollInit();
};

document.addEventListener('DOMContentLoaded', initHamburger);
document.addEventListener('DOMContentLoaded', initGonzaFeatures);
