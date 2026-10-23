const frame = document.querySelector("#preview");
const box = document.querySelector("#preview-box");
document.querySelectorAll("[data-width]").forEach((button) => {
  button.addEventListener("click", () => {
    box.classList.toggle("mobile", button.dataset.width === "mobile");
    document
      .querySelectorAll("[data-width]")
      .forEach((item) =>
        item.setAttribute("aria-pressed", String(item === button)),
      );
  });
});
document.querySelectorAll("[data-font]").forEach((button) => {
  button.addEventListener("click", () => {
    frame.src = "preview.html?type=" + button.dataset.font;
    document
      .querySelectorAll("[data-font]")
      .forEach((item) =>
        item.setAttribute("aria-pressed", String(item === button)),
      );
  });
});
document
  .querySelector("#print")
  .addEventListener("click", () => window.print());
