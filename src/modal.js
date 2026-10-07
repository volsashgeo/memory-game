import { createElement } from "./dom.js";

export function createModal({ onClose } = {}) {
  const content = createElement("div", { className: "modal" });
  const overlay = createElement(
    "div",
    {
      className: "modal-overlay",
      role: "dialog",
      "aria-modal": "true",
    },
    [content],
  );

  let isOpen = false;

  function onKeydown(e) {
    if (e.key === "Escape") close();
  }

  function close() {
    if (!isOpen) return;
    isOpen = false;
    overlay.classList.remove("is-open");
    document.body.classList.remove("modal-open");
    document.removeEventListener("keydown", onKeydown);
    if (typeof onClose === "function") onClose();
  }

  function open() {
    if (isOpen) return;
    isOpen = true;
    overlay.classList.add("is-open");
    document.body.classList.add("modal-open");
    document.addEventListener("keydown", onKeydown);
  }

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) close();
  });

  return {
    overlay,
    content,
    open,
    close,
    get isOpen() {
      return isOpen;
    },
  };
}
