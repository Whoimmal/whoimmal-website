document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("qna-input");
  const submit = document.getElementById("qna-submit");
  const list = document.getElementById("qna-list");

  submit.addEventListener("click", () => {
    const question = input.value.trim();
    if (question) {
      const li = document.createElement("li");
      li.textContent = question;
      list.prepend(li);
      input.value = "";
    }
  });

  input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") submit.click();
  });
});
