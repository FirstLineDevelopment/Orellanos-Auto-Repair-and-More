import firstline from "../firstline.config.js";
import { renderFooterCredit } from "./components/footer-credit.js";
import { bindAnchorOffset } from "./utils/anchor-offset.js";
import { bindFormModes } from "./utils/form-mode.js";
import { bindMobileNav } from "./utils/mobile-nav.js";

document.querySelectorAll("[data-year]").forEach((target) => {
  target.textContent = String(new Date().getFullYear());
});

bindAnchorOffset({
  headerSelector: "[data-site-header]",
  linkSelector: 'a[href^="#"]'
});

bindMobileNav({
  headerSelector: "[data-site-header]",
  navSelector: "[data-mobile-nav]",
  toggleSelector: "[data-mobile-nav-toggle]",
  desktopQuery: "(min-width: 769px)"
});

bindFormModes({
  defaultMode: firstline.defaultFormMode || "demo"
});

renderFooterCredit({
  enabled: true,
  selector: "[data-firstline-credit]"
});
