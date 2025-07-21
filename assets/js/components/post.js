// Like Button
let liked = false;
const likeBtn = document.getElementById("likeBtn");
const likeCount = document.getElementById("likeCount");

likeBtn.addEventListener("click", () => {
liked = !liked;
if (liked) {
likeBtn.classList.add("liked");
likeCount.textContent = parseInt(likeCount.textContent) + 1;
} else {
likeBtn.classList.remove("liked");
likeCount.textContent = parseInt(likeCount.textContent) - 1;
}
});

// Share Button
const shareBtn = document.getElementById("shareBtn");
shareBtn.addEventListener("click", async () => {
try {
if (navigator.share) {
await navigator.share({
title: document.title,
text: "Check out this article!",
url: window.location.href,
});
} else {
navigator.clipboard.writeText(window.location.href);
alert("Link copied to clipboard!");
}
} catch (err) {
console.error("Sharing failed:", err);
}
});

// Comment Submit
const commentForm = document.getElementById("commentForm");
const commentInput = document.getElementById("commentInput");
const commentList = document.getElementById("commentList");

commentForm.addEventListener("submit", (e) => {
e.preventDefault();
const comment = commentInput.value.trim();
if (comment) {
const newComment = document.createElement("div");
newComment.classList.add("comment");
newComment.textContent = comment;
commentList.prepend(newComment); // Add to top
commentInput.value = "";
}
});
