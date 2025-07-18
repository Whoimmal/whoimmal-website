document.addEventListener("DOMContentLoaded", () => {
  const searchBtn = document.getElementById("searchToggleBtn");
  const searchPopup = document.getElementById("searchPopup");

  searchBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    searchPopup.classList.toggle("show");
  });

  // Klik di luar pop-up menutupnya
  window.addEventListener("click", (e) => {
    if (!searchPopup.contains(e.target) && !searchBtn.contains(e.target)) {
      searchPopup.classList.remove("show");
    }
  });
});
