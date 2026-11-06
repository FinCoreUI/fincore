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
