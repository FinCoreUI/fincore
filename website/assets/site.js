/* Sorleed documentation site behaviour. No framework, no tracking. */
(function () {
  "use strict";

  var navToggle = document.querySelector("[data-nav-toggle]");
  var nav = document.querySelector("[data-nav]");

  if (navToggle && nav) {
    navToggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(open));
    });
  }

  // Highlight the current page in the main navigation.
  var current = document.body.getAttribute("data-page");
  if (current) {
    document.querySelectorAll("[data-nav] a").forEach(function (link) {
      if (link.getAttribute("data-page") === current) {
        link.setAttribute("aria-current", "page");
      }
    });
  }

  // Copy buttons for code blocks.
  document.querySelectorAll("pre").forEach(function (block) {
    var button = document.createElement("button");
    button.type = "button";
    button.className = "copy-button";
    button.textContent = "Copy";
    button.addEventListener("click", function () {
      var code = block.querySelector("code");
      var text = code ? code.textContent : block.textContent;
      if (!navigator.clipboard) {
        button.textContent = "Select manually";
        return;
      }
      navigator.clipboard.writeText(text).then(
        function () {
          button.textContent = "Copied";
          setTimeout(function () {
            button.textContent = "Copy";
          }, 1600);
        },
        function () {
          button.textContent = "Copy failed";
        }
      );
    });
    block.appendChild(button);
  });

  // Password visibility demo.
  document.querySelectorAll("[data-password-toggle]").forEach(function (button) {
    button.addEventListener("click", function () {
      var field = document.getElementById(button.getAttribute("aria-controls"));
      if (!field) return;
      var visible = field.type === "text";
      field.type = visible ? "password" : "text";
      button.setAttribute("aria-pressed", String(!visible));
      button.textContent = visible ? "Show password" : "Hide password";
    });
  });

  // Keep the phone demo country list in sync with a small representative list.
  var phoneCountry = document.querySelector("[data-phone-country]");
  var phoneDial = document.querySelector("[data-phone-dial]");
  if (phoneCountry && phoneDial) {
    var updateDial = function () {
      var option = phoneCountry.options[phoneCountry.selectedIndex];
      phoneDial.textContent = option ? "+" + option.getAttribute("data-dial") : "+";
    };
    phoneCountry.addEventListener("change", updateDial);
    updateDial();
  }
})();

/* Theme Toggle Support (Dark Mode) */
(function() {
  function getTheme() {
    return localStorage.getItem("sorleed-theme") || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  }

  function setTheme(theme) {
    if (theme === "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.setAttribute("data-theme", "light");
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("sorleed-theme", theme);
    document.querySelectorAll("[data-theme-toggle]").forEach(function(btn) {
      btn.textContent = theme === "dark" ? "☀️ Light mode" : "🌙 Dark mode";
      btn.setAttribute("aria-label", "Switch to " + (theme === "dark" ? "light" : "dark") + " mode");
    });
  }

  // Initial set
  setTheme(getTheme());

  document.addEventListener("DOMContentLoaded", function() {
    document.querySelectorAll("[data-theme-toggle]").forEach(function(btn) {
      btn.textContent = getTheme() === "dark" ? "☀️ Light mode" : "🌙 Dark mode";
      btn.addEventListener("click", function() {
        var current = getTheme();
        setTheme(current === "dark" ? "light" : "dark");
      });
    });
  });
})();
