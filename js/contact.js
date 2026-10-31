/* Contact form.
   Sends the message to Katie's Google Apps Script
   (google-apps-script/contact-form.gs) without leaving the page, then
   shows a thank-you. Without JavaScript the form posts straight to the
   script, which shows its own thank-you page. */
document.addEventListener("DOMContentLoaded", function () {
  var form = document.getElementById("contact-form");
  var thanks = document.getElementById("contact-thanks");
  if (!form || !thanks || !window.fetch || !window.URLSearchParams) return;

  var button = form.querySelector('button[type="submit"]');
  var status = form.querySelector(".form-status");
  var buttonText = button.textContent;

  function fail() {
    status.innerHTML = "Sorry, your message didn't send. Please try again, or email me at " +
      '<a href="mailto:kmaygroves@gmail.com">kmaygroves@gmail.com</a>.';
    button.disabled = false;
    button.textContent = buttonText;
  }

  // The browser has already checked the name and email by this point
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    status.textContent = "";

    var address = form.getAttribute("action");
    if (address.indexOf("PASTE_") !== -1) {
      console.warn("Contact form: paste your Apps Script web app address into contact.html (see README.md).");
      fail();
      return;
    }

    var data = new URLSearchParams(new FormData(form));
    data.append("js", "1");
    button.disabled = true;
    button.textContent = "Sending…";

    fetch(address, { method: "POST", body: data })
      .then(function (response) {
        return response.json();
      })
      .then(function (result) {
        if (!result.ok) throw new Error(result.error || "not sent");
        form.hidden = true;
        thanks.hidden = false;
        thanks.focus();
      })
      .catch(fail);
  });
});
