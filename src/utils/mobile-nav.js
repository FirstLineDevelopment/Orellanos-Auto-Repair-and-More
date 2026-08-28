export function bindMobileNav({
  headerSelector = "[data-site-header]",
  navSelector = "[data-mobile-nav]",
  toggleSelector = "[data-mobile-nav-toggle]",
  openClass = "is-open",
  bodyOpenClass = "fl-nav-open",
  desktopQuery = "(min-width: 769px)"
} = {}) {
  const header = document.querySelector(headerSelector);
  const nav = document.querySelector(navSelector);
  const toggle = document.querySelector(toggleSelector);
  const media = window.matchMedia(desktopQuery);

  if (!header || !nav || !toggle) return;

  function setOpen(open) {
    nav.classList.toggle(openClass, open);
    document.body.classList.toggle(bodyOpenClass, open);
    toggle.setAttribute("aria-expanded", String(open));
  }

  function close() {
    setOpen(false);
  }

  toggle.addEventListener("click", (event) => {
    event.stopPropagation();
    setOpen(!nav.classList.contains(openClass));
  });

  nav.addEventListener("click", (event) => {
    const target = event.target;
    if (target === nav) {
      close();
      return;
    }
    if (target instanceof Element && target.closest("a,button")) close();
  });

  document.addEventListener("pointerdown", (event) => {
    if (!nav.classList.contains(openClass)) return;
    if (header.contains(event.target)) return;
    close();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") close();
  });

  window.addEventListener("hashchange", close);

  media.addEventListener("change", (event) => {
    if (event.matches) close();
  });
}
