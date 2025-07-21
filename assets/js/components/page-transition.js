// Saat halaman sudah dimuat sepenuhnya, tambahkan kelas "page-loaded"
window.addEventListener('DOMContentLoaded', () => {
document.body.classList.add('page-loaded');
});

// Tambahkan event listener ke semua tautan
document.querySelectorAll('a[href]').forEach(link => {
link.addEventListener('click', function (e) {
const targetHref = this.getAttribute('href');

// Hindari link eksternal dan anchor #
if (!targetHref.startsWith('http') && !targetHref.startsWith('#')) {
e.preventDefault(); // Hentikan pindah langsung

// Tambahkan kelas animasi keluar
document.body.classList.remove('page-loaded');
document.body.classList.add('page-fadeout');

// Pindah halaman setelah 0.5 detik (durasi fade)
setTimeout(() => {
window.location.href = targetHref;
}, 500);
}
});
});
