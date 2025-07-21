window.addEventListener('load', () => {
  const loader = document.getElementById('page-loader');

  setTimeout(() => {
    loader.style.opacity = '0';
    loader.style.transition = 'opacity 0.5s ease';

    // Setelah loader menghilang
    setTimeout(() => {
      loader.style.display = 'none';
      document.body.classList.remove('not-loaded');
      document.body.classList.add('loaded');
    }, 500);
  }, 2000); // durasi total loader (misal 2 detik)
});
