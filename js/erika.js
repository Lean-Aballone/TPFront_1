(function () {
  document.addEventListener("DOMContentLoaded", () => {
    const scope = document.querySelector(".erika-scope");
    if (!scope) return;

    // 1) Tema local (light/dark) SOLO para Erika
    const KEY = "erika-theme";
    const toggleBtn = document.querySelector(".erika-theme-toggle");
    const stored = localStorage.getItem(KEY);
    if (stored === "light") scope.setAttribute("data-theme", "light");

    if (toggleBtn) {
      const applyAria = () => toggleBtn.setAttribute("aria-pressed", scope.getAttribute("data-theme") === "light" ? "true" : "false");
      applyAria();
      toggleBtn.addEventListener("click", () => {
        const isLight = scope.getAttribute("data-theme") === "light";
        scope.setAttribute("data-theme", isLight ? "dark" : "light");
        localStorage.setItem(KEY, isLight ? "dark" : "light");
        applyAria();
      });
    }

    // 2) Smooth scroll + resalte de sección activa
    const links = document.querySelectorAll(".erika-subnav a[href^='#']");
    const sections = [...document.querySelectorAll(".erika-section[id]")];
    const byId = id => document.getElementById(id);

    links.forEach(a => {
      a.addEventListener("click", e => {
        const id = a.getAttribute("href").slice(1);
        const el = byId(id);
        if (el) {
          e.preventDefault();
          el.scrollIntoView({ behavior: "smooth", block: "start" });
          history.replaceState(null, "", `#${id}`);
        }
      });
    });

    const spy = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          links.forEach(l => l.classList.toggle("active", l.getAttribute("href") === `#${id}`));
        }
      });
    }, { rootMargin: "-35% 0px -60% 0px", threshold: [0, 0.25, 0.6, 1] });
    sections.forEach(s => spy.observe(s));

    // 3) Revelado al hacer scroll (IntersectionObserver)
    const rev = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    document.querySelectorAll(".reveal").forEach(el => rev.observe(el));

    // 4) Atajo divertido: presionar "E" rota levemente el gradiente
    let toggled = false;
    window.addEventListener("keydown", (e) => {
      if (e.key.toLowerCase() === "e") {
        toggled = !toggled;
        document.body.style.transition = "background 600ms ease";
        document.body.style.backgroundPosition = toggled ? "20% 80%, 80% 20%, 50% 100%, 0 0" : "";
        setTimeout(() => (document.body.style.transition = ""), 700);
      }
    });
  });
})();
