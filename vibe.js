document.addEventListener("click", (e) => {
  if (!e.ctrlKey) {
    document.querySelectorAll("[data-selected]").forEach((el) => {
      if (el === e.target) return;
      el.removeAttribute("data-selected");
    });
  }
  e.target.toggleAttribute("data-selected");
});

customElements.define(
  "v-icon",
  class extends HTMLElement {
    static get observedAttributes() {
      return ["href", "size", "width", "height"];
    }

    connectedCallback() {
      const width = this.getAttribute("size") ?? this.getAttribute("width") ?? 16;
      const height = this.getAttribute("height") ?? this.getAttribute("size") ?? 16;
      this.innerHTML = `<svg width="${width}" height="${height}"><use xlink:href="${this.getAttribute("href")}" /></svg>`;
    }

    attributeChangedCallback() {
      const width = this.getAttribute("size") ?? this.getAttribute("width") ?? 16;
      const height = this.getAttribute("height") ?? this.getAttribute("size") ?? 16;
      this.innerHTML = `<svg width="${width}" height="${height}"><use xlink:href="${this.getAttribute("href")}" /></svg>`;
    }
  }
);
