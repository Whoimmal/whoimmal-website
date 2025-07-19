// Ambil elemen
const quoteInput = document.getElementById("quoteInput");
const quoteBack = document.getElementById("quoteBack");
const generateBtn = document.getElementById("generateBtn");

// Event ketika tombol "Generate" ditekan
generateBtn.addEventListener("click", () => {
const inputText = quoteInput.value.trim();
quoteBack.textContent = inputText || "Your Quote";
});

// Optional: Tekan Enter untuk generate
quoteInput.addEventListener("keydown", function(e) {
if (e.key === "Enter") {
e.preventDefault();
generateBtn.click();
}
});
