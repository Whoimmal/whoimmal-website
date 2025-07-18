document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".footer-form");
  const emailInput = form.querySelector('input[name="email"]');
  const messageBox = document.createElement("div");
  messageBox.className = "form-message";
  form.appendChild(messageBox);

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = emailInput.value.trim();
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!isValid) {
      messageBox.textContent = "Please enter a valid email address.";
      messageBox.style.color = "red";
      return;
    }

    try {
      const response = await fetch("https://formspree.io/f/mdkzrqby", {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email: email })
      });

      if (response.ok) {
        messageBox.textContent = "Thanks for subscribing!";
        messageBox.style.color = "green";
        emailInput.value = "";
      } else {
        messageBox.textContent = "Something went wrong. Please try again later.";
        messageBox.style.color = "red";
      }
    } catch (error) {
      console.error("Error:", error);
      messageBox.textContent = "Network error. Please check your connection.";
      messageBox.style.color = "red";
    }
  });
});
