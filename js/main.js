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

document.addEventListener("DOMContentLoaded", initHamburger);
