const selectableElementTags = ["H1", "H2", "H3", "H4", "H5", "H6", "SVG", "P", "IMG", "SPAN", "V-ROWS", "V-COLS", "DIV"];
const parentElementTags = ["V-ROWS", "V-COLS", "DIV"];

document.addEventListener("click", (e) => {
  if (!e.ctrlKey) {
    document.querySelectorAll("[data-selected]").forEach((el) => {
      if (el === e.target) return;
      el.removeAttribute("data-selected");
    });
  }
  e.target.toggleAttribute("data-selected");
});

document.addEventListener("keydown", (e) => {
  // s - to split an element
  if (e.key === "s" && !e.ctrlKey && !e.shiftKey && !e.altKey) {
    e.preventDefault();
    // TODO support multi-select
    const selected = document.querySelector("[data-selected]");
    if (selected) {
      const clone = selected.cloneNode();
      clone.removeAttribute("data-selected");
      selected.parentNode.insertBefore(clone, selected.nextSibling);
    }
  }

  // shift - enter to select parent
  if (e.key === "Enter" && e.shiftKey && !e.ctrlKey && !e.altKey) {
    e.preventDefault();
    const selected = document.querySelector("[data-selected]");
    if (selected) {
      const parent = selected.parentNode;
      if (parent) {
        parent.toggleAttribute("data-selected", true);
        selected.removeAttribute("data-selected");
      }
    }
  }

  // enter - to select firstb child
  if (e.key === "Enter" && !e.shiftKey && !e.ctrlKey && !e.altKey) {
    e.preventDefault();
    const selected = document.querySelector("[data-selected]");
    if (selected) {
      const firstChild = selected.firstElementChild;
      if (firstChild && selectableElementTags.includes(firstChild.tagName)) {
        firstChild.toggleAttribute("data-selected", true);
        selected.removeAttribute("data-selected");
      }
    }
  }

  // c - convert div or v-rows to v-cols
  if (e.key === "c" && !e.ctrlKey && !e.shiftKey && !e.altKey) {
    e.preventDefault();
    const selected = document.querySelector("[data-selected]");
    if (selected && ["DIV", "V-ROWS"].includes(selected.tagName)) {
      const allExistingAttrs = [...selected.attributes].map((attr) => `${attr.name}="${attr.value}"`).join(" ");
      selected.outerHTML = `<v-cols ${allExistingAttrs}>${selected.innerHTML}</v-cols>`;
      selected.focus();
    }
  }

  // r - convert div or v-cols to v-rows
  if (e.key === "r" && !e.ctrlKey && !e.shiftKey && !e.altKey) {
    e.preventDefault();
    const selected = document.querySelector("[data-selected]");
    if (selected && ["DIV", "V-COLS"].includes(selected.tagName)) {
      const allExistingAttrs = [...selected.attributes].map((attr) => `${attr.name}="${attr.value}"`).join(" ");
      selected.outerHTML = `<v-rows ${allExistingAttrs}>${selected.innerHTML}</v-rows>`;
      selected.focus();
    }
  }

  // mod-d - duplicate element (paste the clone before selection)
  if (e.key === "d" && (e.ctrlKey || e.metaKey) && !e.shiftKey && !e.altKey) {
    e.preventDefault();
    const selected = document.querySelector("[data-selected]");
    if (selected) {
      const clone = selected.cloneNode(true);
      clone.removeAttribute("data-selected");
      selected.parentNode.insertBefore(clone, selected);
    }
  }

  // h - toggle `hug` attribute on selected element
  if (e.key === "h" && !e.ctrlKey && !e.shiftKey && !e.altKey) {
    e.preventDefault();
    const selected = document.querySelector("[data-selected]");
    if (selected) {
      selected.toggleAttribute("hug");
    }
  }

  // f - toggle `fill` attribute on selected element
  if (e.key === "f" && !e.ctrlKey && !e.shiftKey && !e.altKey) {
    e.preventDefault();
    const selected = document.querySelector("[data-selected]");
    if (selected) {
      selected.toggleAttribute("fill");
    }
  }

  // w - toggle `wrap` attribute on selected element
  if (e.key === "w" && !e.ctrlKey && !e.shiftKey && !e.altKey) {
    e.preventDefault();
    const selected = document.querySelector("[data-selected]");
    if (selected) {
      // if element is not v-rows or v-cols, turn it into v-rows
      if (!["V-ROWS", "V-COLS"].includes(selected.tagName)) {
        const allExistingAttrs = [...selected.attributes].map((attr) => `${attr.name}="${attr.value}"`).join(" ");
        selected.outerHTML = `<v-rows ${allExistingAttrs}>${selected.innerHTML}</v-rows>`;
        selected.focus();
      }

      selected.toggleAttribute("wrap");
    }
  }

  // c - insert a child <v-rows> beforeend
  if (e.key === "c" && !e.ctrlKey && !e.shiftKey && !e.altKey) {
    e.preventDefault();
    const selected = document.querySelector("[data-selected]");
    if (selected && parentElementTags.includes(selected.tagName)) {
      const allExistingAttrs = [...selected.attributes]
        .filter((attr) => attr.name !== "data-selected")
        .map((attr) => `${attr.name}="${attr.value}"`)
        .join(" ");
      selected.insertAdjacentHTML("beforeend", `<v-rows ${allExistingAttrs}></v-rows>`);
    }
  }

  // p - put the current element into a parent <v-rows>
  if (e.key === "p" && !e.ctrlKey && !e.shiftKey && !e.altKey) {
    e.preventDefault();
    const selected = document.querySelector("[data-selected]");
    if (selected && parentElementTags.includes(selected.tagName)) {
      const allExistingAttrs = [...selected.attributes]
        .filter((attr) => attr.name !== "data-selected")
        .map((attr) => `${attr.name}="${attr.value}"`)
        .join(" ");
      selected.outerHTML = `<v-rows ${allExistingAttrs}>${selected.outerHTML}</v-rows>`;
    }
  }

  // 1-4 set fill="<number>", 0 unset fill attribute
  if (e.key >= 0 && e.key <= 4 && !e.ctrlKey && !e.shiftKey && !e.altKey) {
    e.preventDefault();
    const selected = document.querySelector("[data-selected]");
    if (selected) {
      if (e.key === "0") {
        selected.removeAttribute("fill");
      } else {
        selected.setAttribute("fill", e.key);
      }
    }
  }

  // arrow left/up - previous, arrow right/down - next
  const prevArrowKeysNames = ["ArrowLeft", "ArrowUp"];
  const nextArrowKeysNames = ["ArrowRight", "ArrowDown"];

  if ([...prevArrowKeysNames, ...nextArrowKeysNames].includes(e.key) && !e.ctrlKey && !e.shiftKey && !e.altKey) {
    e.preventDefault();
    const selected = document.querySelector("[data-selected]");
    if (selected) {
      const parent = selected.parentNode;
      if (parent) {
        // Get all siblings that are selectable elements
        const selectableSiblings = [...parent.children].filter((child) => selectableElementTags.includes(child.tagName));

        // Find current index in the filtered list
        const currentIndex = selectableSiblings.indexOf(selected);

        // Calculate next/previous index with circular motion
        let nextIndex;
        if (prevArrowKeysNames.includes(e.key)) {
          nextIndex = currentIndex <= 0 ? selectableSiblings.length - 1 : currentIndex - 1;
        } else {
          nextIndex = currentIndex >= selectableSiblings.length - 1 ? 0 : currentIndex + 1;
        }

        // Select the target element
        const target = selectableSiblings[nextIndex];
        if (target) {
          target.toggleAttribute("data-selected", true);
          selected.removeAttribute("data-selected");
        }
      }
    }
  }

  // alt + arrow - move
  if ([...prevArrowKeysNames, ...nextArrowKeysNames].includes(e.key) && !e.ctrlKey && !e.shiftKey && e.altKey) {
    e.preventDefault();
    const selected = document.querySelector("[data-selected]");
    if (selected) {
      const parent = selected.parentNode;
      if (parent) {
        if (prevArrowKeysNames.includes(e.key)) {
          const target = selected.previousElementSibling;
          if (!target) {
            // Move to end if at beginning
            parent.appendChild(selected);
          } else {
            selected.insertAdjacentElement("afterend", target);
          }
        } else {
          const target = selected.nextElementSibling;
          if (!target) {
            // Move to beginning if at end
            parent.insertBefore(selected, parent.firstElementChild);
          } else {
            selected.insertAdjacentElement("beforebegin", target);
          }
        }
      }
    }
  }
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
      return ["name", "size", "width", "height", "fill"];
    }

    connectedCallback() {
      this.render();
    }

    attributeChangedCallback() {
      this.render();
    }

    render() {
      const lower_case_name = this.getAttribute("name").toLowerCase().replace(/ /g, "_");
      const fillMode = this.hasAttribute("fill") ? "filled" : "regular";
      const width = this.getAttribute("size") ?? this.getAttribute("width") ?? 16;
      const height = this.getAttribute("height") ?? this.getAttribute("size") ?? 16;

      Promise.any([
        fetch(`https://esm.sh/@fluentui/svg-icons@1.1.279/icons/${lower_case_name}_24_${fillMode}.svg?raw`),
        fetch(`https://esm.sh/@fluentui/svg-icons@1.1.279/icons/${lower_case_name}_20_${fillMode}.svg?raw`),
        fetch(`https://esm.sh/@fluentui/svg-icons@1.1.279/icons/${lower_case_name}_16_${fillMode}.svg?raw`),
      ])
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
