const selectableElementTags = ["H1", "H2", "H3", "H4", "H5", "H6", "SVG", "P", "IMG", "SPAN", "V-ROWS", "V-COLS", "DIV"];
const parentElementTags = ["BODY", "V-ROWS", "V-COLS", "DIV"];

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
  // INSERT MODE
  // escape - remove contenteditable (exit edit mode)
  if (e.key === "Escape" && !e.ctrlKey && !e.metaKey && !e.shiftKey && !e.altKey) {
    e.preventDefault();
    [...document.querySelectorAll(`[contenteditable]`)].forEach((e) => e.removeAttribute("contenteditable"));
    const sel = window.getSelection();
    sel.removeAllRanges();
  }

  // if in edit mode, ignore all keys except escape
  if (e.target?.closest("[contenteditable]")) {
    return;
  }

  // NORMAL MODE
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

  // alt + shift + down - add clone above (same as mod-d)
  if (e.key === "ArrowDown" && e.altKey && e.shiftKey && !e.ctrlKey && !e.metaKey) {
    e.preventDefault();
    const selected = document.querySelector("[data-selected]");
    if (selected) {
      const clone = selected.cloneNode(true);
      clone.removeAttribute("data-selected");
      selected.parentNode.insertBefore(clone, selected);
    }
  }

  // alt + shift + up - add clone below
  if (e.key === "ArrowUp" && e.altKey && e.shiftKey && !e.ctrlKey && !e.metaKey) {
    e.preventDefault();
    const selected = document.querySelector("[data-selected]");
    if (selected) {
      const clone = selected.cloneNode(true);
      clone.removeAttribute("data-selected");
      selected.parentNode.insertBefore(clone, selected.nextSibling);
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

  // m - toggle `max` attribute on selected element
  if (e.key === "m" && !e.ctrlKey && !e.shiftKey && !e.altKey) {
    e.preventDefault();
    const selected = document.querySelector("[data-selected]");
    if (selected) {
      selected.toggleAttribute("max");
    }
  }

  // n - new child <v-rows> beforeend
  if (e.key === "n" && !e.ctrlKey && !e.shiftKey && !e.altKey) {
    e.preventDefault();
    const selected = document.querySelector("[data-selected]");
    if (selected && parentElementTags.includes(selected.tagName)) {
      const allExistingAttrs = [...selected.attributes]
        .filter((attr) => attr.name !== "data-selected")
        .map((attr) => `${attr.name}="${attr.value}"`)
        .join(" ");
      selected.insertAdjacentHTML("beforeend", `<v-rows ${allExistingAttrs}></v-rows>`);
      // select the new element
      const newElement = selected.lastElementChild;
      newElement.toggleAttribute("data-selected", true);
      selected.removeAttribute("data-selected");
    }
  }

  // shift + n - new parent <v-rows>
  if (e.key === "N" && !e.ctrlKey && e.shiftKey && !e.altKey) {
    e.preventDefault();
    const selected = document.querySelector("[data-selected]");
    if (selected) {
      // We want selection to be on the new element
      const allExistingAttrs = [...selected.attributes].map((attr) => `${attr.name}="${attr.value}"`).join(" ");
      selected.removeAttribute("data-selected");
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

  // tab - select next in pre-order tree traversal. If not next, continue. Ultimately wrap around.
  if (e.key === "Tab" && !e.shiftKey && !e.ctrlKey && !e.altKey) {
    e.preventDefault();
    const selected = document.querySelector("[data-selected]");
    if (selected) {
      const allElements = [...document.querySelectorAll("*")].filter((el) => selectableElementTags.includes(el.tagName));
      const currentIndex = allElements.indexOf(selected);
      const nextIndex = (currentIndex + 1) % allElements.length;
      allElements[nextIndex].toggleAttribute("data-selected", true);
      selected.removeAttribute("data-selected");
    }
  }

  // shift + tab reverse select
  if (e.key === "Tab" && e.shiftKey && !e.ctrlKey && !e.altKey) {
    e.preventDefault();
    const selected = document.querySelector("[data-selected]");
    if (selected) {
      const allElements = [...document.querySelectorAll("*")].filter((el) => selectableElementTags.includes(el.tagName));
      const currentIndex = allElements.indexOf(selected);
      const nextIndex = (currentIndex - 1 + allElements.length) % allElements.length;
      allElements[nextIndex].toggleAttribute("data-selected", true);
      selected.removeAttribute("data-selected");
    }
  }

  // x - cut all selected elements
  if (e.key === "x" && !e.ctrlKey && !e.metaKey && !e.shiftKey && !e.altKey) {
    e.preventDefault();
    // TODO implement clipboard
    // next selection is pre order traversal target of the last selected element

    const allElements = [...document.querySelectorAll("*")].filter((el) => selectableElementTags.includes(el.tagName));

    const allSelected = [...document.querySelectorAll("[data-selected]")];
    const selected = allSelected[allSelected.length - 1];
    const selectedIndex = allElements.indexOf(selected);
    const nextSelectable = allElements[selectedIndex + 1] ?? allElements[0];

    allSelected.forEach((e) => e.remove());

    nextSelectable.toggleAttribute("data-selected", true);
  }

  // i - toggle contenteditable="plaintext-only"
  if (e.key === "i" && !e.ctrlKey && !e.metaKey && !e.shiftKey && !e.altKey) {
    e.preventDefault();
    const selected = document.querySelector("[data-selected]");
    if (selected) {
      selected.setAttribute("contenteditable", "plaintext-only");
      // select all text
      const range = document.createRange();
      const sel = window.getSelection();
      range.selectNodeContents(selected);
      sel.removeAllRanges();
      sel.addRange(range);
      selected.focus();
    }
  }
});

/**
 * Use svg icon by href
 * @example <v-icon href="#icon-name" size="24"></v-icon>
 */
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

/**
 * Use any icon from fluent design system
 * @example <fluent-icon name="search" size="24"></fluent-icon>
 * See full list at aka.ms/iconcloud
 */
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
