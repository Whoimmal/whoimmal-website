document.addEventListener("DOMContentLoaded", function () {
  const searchToggleBtn = document.getElementById("searchToggleBtn");
  const searchForm = document.querySelector(".search-container");

  // Toggle form search di mobile
  searchToggleBtn.addEventListener("click", () => {
    searchForm.classList.toggle("show");
    if (searchForm.classList.contains("show")) {
      searchForm.querySelector("input").focus();
    }
  });

  // Klik di luar akan menutup form di mobile
  document.addEventListener("click", (e) => {
    const isClickInside = searchForm.contains(e.target) || searchToggleBtn.contains(e.target);
    if (!isClickInside) {
      searchForm.classList.remove("show");
    }
  });
});
