let quotes = [];

fetch("assets/data/quotes.json")
  .then((res) => res.json())
  .then((data) => {
    quotes = data;
  })
  .catch((err) => console.error("Gagal memuat quotes.json", err));

function typeText(element, text, speed = 30) {
  element.innerHTML = "";                         // Kosongkan isi
  element.classList.remove("typewriter");         // Reset animasi
  element.setAttribute("data-text", text);        // Optional, future effect

  let i = 0;
  function typing() {
    if (i < text.length) {
      element.innerHTML += text.charAt(i);
      i++;
      setTimeout(typing, speed);
    } else {
      element.classList.add("typewriter");        // Tambahkan efek setelah selesai
    }
  }

  typing();
}

function generateQuote() {
  if (quotes.length === 0) return;
  const quote = quotes[Math.floor(Math.random() * quotes.length)];
  const display = document.getElementById("quote-display");
  typeText(display, `"${quote}"`);
}
