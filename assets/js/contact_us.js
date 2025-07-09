document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector(
    'form[action="https://formspree.io/f/xpwrggpk"]'
  );
  const successDiv = document.getElementById("contact-success");
  if (form && successDiv) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const data = new FormData(form);
      fetch(form.action, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      })
        .then((response) => {
          if (response.ok) {
            form.reset();
            form.classList.add("hidden");
            successDiv.classList.remove("hidden");
          } else {
            response.json().then((data) => {
              alert(
                data.error || "Sorry, there was a problem. Please try again."
              );
            });
          }
        })
        .catch(() => {
          alert("Sorry, there was a problem. Please try again.");
        });
    });
  }
});
