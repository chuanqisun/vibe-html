document.addEventListener("click", (e) => {
  if (!e.ctrlKey) {
    document.querySelectorAll("[selected]").forEach((el) => {
      if (el === e.target) return;
      el.removeAttribute("selected");
    });
  }
  e.target.toggleAttribute("selected");
});
