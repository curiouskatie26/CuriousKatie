/* Mobile navigation toggle.
   Loaded in the <head> so the "js" class is set before the page paints;
   without JavaScript the menu simply stays visible. */
document.documentElement.classList.add("js");

document.addEventListener("DOMContentLoaded", function () {
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");
  if (!toggle || !nav) return;

  function isOpen() {
    return toggle.getAttribute("aria-expanded") === "true";
  }

  function setOpen(open) {
    toggle.setAttribute("aria-expanded", String(open));
    toggle.querySelector(".visually-hidden").textContent = open ? "Close menu" : "Menu";
    nav.classList.toggle("is-open", open);
  }

  toggle.addEventListener("click", function () {
    setOpen(!isOpen());
  });

  // Escape closes the menu and returns focus to the button
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && isOpen()) {
      setOpen(false);
      toggle.focus();
    }
  });

  // Clicking or tabbing outside the header closes the menu
  document.addEventListener("click", function (event) {
    if (isOpen() && !nav.contains(event.target) && !toggle.contains(event.target)) {
      setOpen(false);
    }
  });

  document.addEventListener("focusin", function (event) {
    if (isOpen() && !nav.contains(event.target) && !toggle.contains(event.target)) {
      setOpen(false);
    }
  });

  // Reset when the screen grows to desktop width
  var desktop = window.matchMedia("(min-width: 900px)");
  function onChange(event) {
    if (event.matches) setOpen(false);
  }
  if (desktop.addEventListener) {
    desktop.addEventListener("change", onChange);
  } else if (desktop.addListener) {
    desktop.addListener(onChange);
  }
});
