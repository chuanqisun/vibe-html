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

customElements.define(
  "fluent-icon",
  class extends HTMLElement {
    static get observedAttributes() {
      return ["name", "size", "width", "height"];
    }

    connectedCallback() {
      this.render();
    }

    attributeChangedCallback() {
      this.render();
    }

    render() {
      const lower_case_name = this.getAttribute("name").toLowerCase().replace(/ /g, "_");
      const width = this.getAttribute("size") ?? this.getAttribute("width") ?? 16;
      const height = this.getAttribute("height") ?? this.getAttribute("size") ?? 16;
      fetch(`https://esm.sh/@fluentui/svg-icons@1.1.279/icons/${lower_case_name}_24_regular.svg?raw`)
        .then((res) => res.text())
        .then((src) => {
          this.innerHTML = src;
          // replace all fill with currentColor
          this.querySelectorAll("[fill]").forEach((el) => {
            if (el.getAttribute("fill") === "none") return;
            el.setAttribute("fill", "currentColor");
          });
          this.querySelector("svg").setAttribute("fill", "currentColor");

          // replace root width height with size
          this.querySelector("svg").setAttribute("width", width);
          this.querySelector("svg").setAttribute("height", height);
        });
    }
  }
);
