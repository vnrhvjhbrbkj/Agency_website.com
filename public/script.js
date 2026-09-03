document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener("click", function (event) {
    const targetId = this.getAttribute("href");
    if (!targetId || targetId === "#") return;

    const target = document.querySelector(targetId);

    if (target) {
      event.preventDefault();
      target.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }
  });
});

const form = document.getElementById("contactForm");
const formMessage = document.getElementById("formMessage");

form.addEventListener("submit", async function (event) {
  event.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const service = document.getElementById("service").value;
  const message = document.getElementById("message").value.trim();

  if (!name || !email || !message) {
    formMessage.textContent = "Please fill all required fields.";
    formMessage.classList.remove("hidden");
    return;
  }

  formMessage.textContent = "Sending...";
  formMessage.classList.remove("hidden");

  try {
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name,
        email,
        service,
        message
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Email sending failed.");
    }

    const whatsappNumber = "923134400678";

    const whatsappText =
      `New consultation request\n\n` +
      `Name: ${name}\n` +
      `Email: ${email}\n` +
      `Service: ${service}\n` +
      `Message: ${message}`;

    const whatsappUrl =
      `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappText)}`;

    window.open(whatsappUrl, "_blank");

    form.reset();
    formMessage.textContent =
      "Email sent successfully. WhatsApp is opening now.";
  } catch (error) {
    formMessage.textContent =
      error.message || "Something went wrong.";
  }
});