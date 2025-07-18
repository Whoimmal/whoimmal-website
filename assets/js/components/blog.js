document.addEventListener("DOMContentLoaded", () => {
  const featuredContainer = document.getElementById("featured-post");
  const blogGrid = document.getElementById("blog-grid");

  fetch("assets/data/blog-posts.json")
    .then((res) => res.json())
    .then((data) => {
      // Featured Post
      const featured = data[0];
      featuredContainer.innerHTML = `
        <img src="${featured.image}" alt="${featured.title}" />
        <div class="featured-text">
          <h2>${featured.title}</h2>
          <p>${featured.subtitle}</p>
          <a href="${featured.link}">Read More →</a>
        </div>
      `;

      // Blog Cards
      const others = data.slice(1);
      blogGrid.innerHTML = others.map((post) => `
        <div class="blog-card">
          <h3 class="post-title">${post.title}</h3>
          <p class="post-snippet">${post.subtitle}</p>
          <a href="${post.link}">Continue Reading</a>
        </div>
      `).join("");
    })
    .catch((err) => {
      console.error("Gagal memuat blog-posts.json:", err);
    });
});
