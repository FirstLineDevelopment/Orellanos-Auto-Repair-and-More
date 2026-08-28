export function bindAnchorOffset({
  headerSelector = "[data-site-header]",
  linkSelector = 'a[href^="#"]',
  extraOffset = 8
} = {}) {
  const links = Array.from(document.querySelectorAll(linkSelector));

  function headerHeight() {
    const header = document.querySelector(headerSelector);
    return header ? Math.ceil(header.getBoundingClientRect().height) : 0;
  }

  function scrollToHash(hash) {
    if (!hash || hash === "#") return false;
    const id = decodeURIComponent(hash.slice(1));
    const target = document.getElementById(id);
    if (!target) return false;

    const top = target.getBoundingClientRect().top + window.scrollY - headerHeight() - extraOffset;
    window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
    return true;
  }

  links.forEach((link) => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href") || "";
      if (!href.startsWith("#")) return;
      if (!scrollToHash(href)) return;
      event.preventDefault();
      window.history.pushState(null, "", href);
    });
  });

  if (window.location.hash) {
    requestAnimationFrame(() => requestAnimationFrame(() => scrollToHash(window.location.hash)));
  }
}
