document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("newsGrid");

  fetch("assets/data/news.json")
    .then(res => res.json())
    .then(data => {
      data.forEach((item, index) => {
        const delayClass = `reveal-delay-${(index % 3) + 1}`;

        const card = document.createElement("div");
        card.className = `news-card ${delayClass}`;
        card.innerHTML = `
          <span class="news-badge">${item.badge}</span>
          <img src="${item.image}" alt="${item.title}" class="news-image" />
          <div class="news-content">
            <h3 class="news-title">${item.title}</h3>
            <p class="news-excerpt">${item.excerpt}</p>
            <a href="${item.link}" class="read-more">Read more →</a>
          </div>
        `;

        grid.appendChild(card);
      });
    })
    .catch(err => {
      grid.innerHTML = `<p style="color: red;">Gagal memuat berita.</p>`;
      console.error("Gagal memuat news.json:", err);
    });
});
