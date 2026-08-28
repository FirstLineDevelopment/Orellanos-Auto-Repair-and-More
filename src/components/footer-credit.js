export function renderFooterCredit({
  enabled = false,
  selector = "[data-firstline-credit]",
  href = "https://firstlinedev.com/"
} = {}) {
  const target = document.querySelector(selector);
  if (!target) return;

  if (!enabled) {
    target.remove();
    return;
  }

  target.classList.add("fl-footer-credit");
  target.innerHTML = `Built by <a href="${href}" target="_blank" rel="noopener noreferrer">FirstLine Development</a>`;
}
