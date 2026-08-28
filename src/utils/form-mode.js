export function bindFormModes({
  formSelector = "[data-firstline-form]",
  defaultMode = "demo",
  demoMessage = "Demo only: no request was sent. Connect this form to the approved live workflow before launch.",
  liveMessage = "Thanks. Your request was submitted.",
  statusSelector = ".fl-status"
} = {}) {
  document.querySelectorAll(formSelector).forEach((form) => {
    const mode = form.dataset.formMode || defaultMode;
    form.dataset.formMode = mode;

    form.addEventListener("submit", (event) => {
      if (mode === "demo") {
        event.preventDefault();
        const status = form.querySelector(statusSelector);
        if (status) status.textContent = demoMessage;
        return;
      }

      if (mode === "live" && !form.getAttribute("action")) {
        event.preventDefault();
        const status = form.querySelector(statusSelector);
        if (status) status.textContent = "Live form is not configured yet. Add an approved action or handler before launch.";
      }
    });
  });
}
