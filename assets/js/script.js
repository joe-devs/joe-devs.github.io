'use strict';



// element toggle function
const elementToggleFunc = function (elem) { elem.classList.toggle("active"); }



// sidebar variables
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

// sidebar toggle functionality for mobile
sidebarBtn.addEventListener("click", function () { elementToggleFunc(sidebar); });



// testimonials variables
const testimonialsItem = document.querySelectorAll("[data-testimonials-item]");
const modalContainer = document.querySelector("[data-modal-container]");
const modalCloseBtn = document.querySelector("[data-modal-close-btn]");
const overlay = document.querySelector("[data-overlay]");

// modal variable
const modalImg = document.querySelector("[data-modal-img]");
const modalTitle = document.querySelector("[data-modal-title]");
const modalText = document.querySelector("[data-modal-text]");

// modal toggle function
const testimonialsModalFunc = function () {
  modalContainer.classList.toggle("active");
  overlay.classList.toggle("active");
}

// add click event to all modal items
for (let i = 0; i < testimonialsItem.length; i++) {

  testimonialsItem[i].addEventListener("click", function () {

    modalImg.src = this.querySelector("[data-testimonials-avatar]").src;
    modalImg.alt = this.querySelector("[data-testimonials-avatar]").alt;
    modalTitle.innerHTML = this.querySelector("[data-testimonials-title]").innerHTML;
    modalText.innerHTML = this.querySelector("[data-testimonials-text]").innerHTML;

    testimonialsModalFunc();

  });

}

// add click event to modal close button
modalCloseBtn.addEventListener("click", testimonialsModalFunc);
overlay.addEventListener("click", testimonialsModalFunc);



// custom select variables
const select = document.querySelector("[data-select]");
const selectItems = document.querySelectorAll("[data-select-item]");
const selectValue = document.querySelector("[data-selecct-value]");
const filterBtn = document.querySelectorAll("[data-filter-btn]");

select.addEventListener("click", function () { elementToggleFunc(this); });

// add event in all select items
for (let i = 0; i < selectItems.length; i++) {
  selectItems[i].addEventListener("click", function () {

    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    elementToggleFunc(select);
    filterFunc(selectedValue);

  });
}

// filter variables
const filterItems = document.querySelectorAll("[data-filter-item]");

const filterFunc = function (selectedValue) {

  for (let i = 0; i < filterItems.length; i++) {

    const itemCategory = filterItems[i].dataset.category ? filterItems[i].dataset.category.toLowerCase() : "";

    if (selectedValue === "all" || selectedValue === itemCategory) {
      filterItems[i].classList.add("active");
    } else {
      filterItems[i].classList.remove("active");
    }

  }

}

// add event in all filter button items for large screen
let lastClickedBtn = filterBtn[0];

for (let i = 0; i < filterBtn.length; i++) {

  filterBtn[i].addEventListener("click", function () {

    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    filterFunc(selectedValue);

    lastClickedBtn.classList.remove("active");
    this.classList.add("active");
    lastClickedBtn = this;

  });

}



// contact form variables
const form = document.querySelector("[data-form]");
const formInputs = document.querySelectorAll("[data-form-input]");
const formBtn = document.querySelector("[data-form-btn]");

// add event to all form input field
for (let i = 0; i < formInputs.length; i++) {
  formInputs[i].addEventListener("input", function () {

    // check form validation
    if (form.checkValidity()) {
      formBtn.removeAttribute("disabled");
    } else {
      formBtn.setAttribute("disabled", "");
    }

  });
}



// page navigation variables
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

// add event to all nav link
for (let i = 0; i < navigationLinks.length; i++) {
  navigationLinks[i].addEventListener("click", function () {

    for (let i = 0; i < pages.length; i++) {
      if (this.innerHTML.toLowerCase() === pages[i].dataset.page) {
        pages[i].classList.add("active");
        navigationLinks[i].classList.add("active");
        window.scrollTo(0, 0);
      } else {
        pages[i].classList.remove("active");
        navigationLinks[i].classList.remove("active");
      }
    }

  });
}

// GitHub Markdown notes reader
const noteLinks = document.querySelectorAll("[data-note-url]");
const notesList = document.querySelector("[data-notes-list]");
const noteReader = document.querySelector("[data-note-reader]");
const noteReaderTitle = document.querySelector("[data-note-reader-title]");
const noteReaderContent = document.querySelector("[data-note-reader-content]");
const noteBackBtn = document.querySelector("[data-note-back]");

const escapeHtml = function (value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

const markdownToHtml = function (markdown) {
  let safe = escapeHtml(markdown);

  safe = safe.replace(/```([\s\S]*?)```/g, function (_, code) {
    return `<pre><code>${code.trim()}</code></pre>`;
  });

  safe = safe
    .replace(/^### (.*$)/gim, "<h4>$1</h4>")
    .replace(/^## (.*$)/gim, "<h3>$1</h3>")
    .replace(/^# (.*$)/gim, "<h2>$1</h2>")
    .replace(/\*\*(.*?)\*\*/gim, "<strong>$1</strong>")
    .replace(/`([^`]+)`/gim, "<code>$1</code>");

  const lines = safe.split("\n");
  let html = "";
  let inList = false;

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed.startsWith("- ")) {
      if (!inList) {
        html += "<ul>";
        inList = true;
      }
      html += `<li>${trimmed.slice(2)}</li>`;
      continue;
    }

    if (inList) {
      html += "</ul>";
      inList = false;
    }

    if (!trimmed) {
      continue;
    }

    if (
      trimmed.startsWith("<h2>") ||
      trimmed.startsWith("<h3>") ||
      trimmed.startsWith("<h4>") ||
      trimmed.startsWith("<pre>")
    ) {
      html += trimmed;
    } else {
      html += `<p>${trimmed}</p>`;
    }
  }

  if (inList) {
    html += "</ul>";
  }

  return html;
}

for (let i = 0; i < noteLinks.length; i++) {
  noteLinks[i].addEventListener("click", async function (event) {
    event.preventDefault();

    const noteUrl = this.dataset.noteUrl;
    const noteTitle = this.dataset.noteTitle;

    noteReaderTitle.innerText = noteTitle;
    noteReaderContent.innerHTML = "<p>Loading note from GitHub...</p>";

    notesList.hidden = true;
    noteReader.hidden = false;
    window.scrollTo(0, 0);

    try {
      const response = await fetch(noteUrl);

      if (!response.ok) {
        throw new Error(`GitHub returned ${response.status}`);
      }

      const markdown = await response.text();
      noteReaderContent.innerHTML = markdownToHtml(markdown);
    } catch (error) {
      noteReaderContent.innerHTML = `
        <p>
          This note could not be loaded yet.
        </p>
        <p>
          Make sure the GitHub repository is public and the Markdown file exists:
        </p>
        <pre><code>${noteUrl}</code></pre>
      `;
    }
  });
}

if (noteBackBtn) {
  noteBackBtn.addEventListener("click", function () {
    noteReader.hidden = true;
    notesList.hidden = false;
    noteReaderContent.innerHTML = "";
    window.scrollTo(0, 0);
  });
}
