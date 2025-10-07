document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("hero-form");
  if (!form) return;
  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    const formData = new FormData(this);
    const submitData = {};
    // Collect form data
    for (const [key, value] of formData.entries()) {
      if (value.trim()) {
        submitData[key] = value.trim();
      }
    }
    // Handle checkbox
    submitData.secretIdentity =
      document.getElementById("secretIdentity").checked;
    try {
      const response = await fetch("/heroes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitData),
      });
      const data = await response.json();
      if (data.success) {
        window.location.href = data.redirectTo;
      } else {
        alert("Error: " + data.error);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to add hero");
    }
  });
});
