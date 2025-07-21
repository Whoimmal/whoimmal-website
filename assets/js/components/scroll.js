document.addEventListener("DOMContentLoaded", function () {
const fadeElements = document.querySelectorAll(".fade-in");

function checkFadeIn() {
fadeElements.forEach((el) => {
const rect = el.getBoundingClientRect();
if (rect.top < window.innerHeight - 100) {
el.classList.add("visible");
}
});
}

window.addEventListener("scroll", checkFadeIn);
checkFadeIn(); // Trigger saat pertama kali
});
