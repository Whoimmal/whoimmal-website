document.addEventListener("DOMContentLoaded", () => {
  console.log("Website siap.");

  if (typeof setupNavbar === "function") {
    setupNavbar();
  }

  if (typeof initScrollAnimation === "function") {
    initScrollAnimation();
  }
});

