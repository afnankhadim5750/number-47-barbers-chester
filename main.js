/* Number 47 Barbers Boughton — interactions */
(function () {
  "use strict";
  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* --- Footer year --- */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* --- Today's hours in the hero note --- */
  var hours = { 0: null, 1: "5pm", 2: "6pm", 3: "6pm", 4: "9pm", 5: "7pm", 6: "3pm" };
  var today = new Date().getDay();
  var close = hours[today];
  document.querySelectorAll("[data-today-hours]").forEach(function (el) {
    el.textContent = close ? "Open today until " + close : "Closed today — back Monday at 9am";
  });

  /* --- Mobile menu (data-menu-toggle / data-mobile-menu contract) --- */
  var toggle = document.querySelector("[data-menu-toggle]");
  var menu = document.querySelector("[data-mobile-menu]");
  if (toggle && menu) {
    var icon = toggle.querySelector(".bi");
    var label = toggle.querySelector("span");
    function setMenu(open) {
      menu.hidden = !open;
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      if (icon) icon.className = open ? "bi bi-x-lg" : "bi bi-list";
      if (label) label.textContent = open ? "Close" : "Menu";
    }
    toggle.addEventListener("click", function () {
      setMenu(menu.hidden);
    });
    menu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () { setMenu(false); });
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !menu.hidden) { setMenu(false); toggle.focus(); }
    });
    window.addEventListener("resize", function () {
      if (window.innerWidth > 900 && !menu.hidden) setMenu(false);
    });
  }

  /* --- Scroll-spy (IntersectionObserver) --- */
  var navLinks = document.querySelectorAll(".site-nav a:not(.btn)");
  var sections = [];
  navLinks.forEach(function (link) {
    var id = link.getAttribute("href");
    if (id && id.charAt(0) === "#") {
      var sec = document.querySelector(id);
      if (sec) sections.push({ id: id, el: sec, link: link });
    }
  });
  if ("IntersectionObserver" in window && sections.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          sections.forEach(function (s) {
            s.link.classList.toggle("active", s.el === entry.target);
          });
        }
      });
    }, { rootMargin: "-30% 0px -60% 0px" });
    sections.forEach(function (s) { spy.observe(s.el); });
  }

  /* --- FAQ accordion --- */
  document.querySelectorAll(".accordion-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var panel = document.getElementById(btn.getAttribute("aria-controls"));
      var open = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", String(!open));
      if (panel) panel.hidden = open;
    });
  });

  /* --- Lightbox --- */
  var items = Array.prototype.slice.call(document.querySelectorAll(".gallery-item"));
  var lightbox = document.getElementById("lightbox");
  var lbImg = lightbox.querySelector(".lightbox-img");
  var lbCap = lightbox.querySelector(".lightbox-caption");
  var current = 0;
  var lastFocus = null;

  function show(i) {
    current = (i + items.length) % items.length;
    var item = items[current];
    lbImg.src = item.getAttribute("data-full");
    lbImg.alt = item.getAttribute("data-alt") || "";
    lbCap.textContent = item.getAttribute("data-alt") || "";
  }
  function openLb(i) {
    lastFocus = document.activeElement;
    show(i);
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
    lightbox.querySelector(".lightbox-close").focus();
  }
  function closeLb() {
    lightbox.hidden = true;
    document.body.style.overflow = "";
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  items.forEach(function (item, i) {
    item.addEventListener("click", function () { openLb(i); });
  });
  lightbox.querySelector(".lightbox-close").addEventListener("click", closeLb);
  lightbox.querySelector(".lightbox-prev").addEventListener("click", function () { show(current - 1); });
  lightbox.querySelector(".lightbox-next").addEventListener("click", function () { show(current + 1); });
  lightbox.addEventListener("click", function (e) {
    if (e.target === lightbox) closeLb();
  });
  document.addEventListener("keydown", function (e) {
    if (lightbox.hidden) return;
    if (e.key === "Escape") closeLb();
    if (e.key === "ArrowLeft") show(current - 1);
    if (e.key === "ArrowRight") show(current + 1);
  });

  /* --- Reveal on scroll --- */
  var revealEls = document.querySelectorAll(".reveal");
  if (prefersReduced || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) { el.classList.add("visible"); });
  } else {
    var ro = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          ro.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { ro.observe(el); });
  }
})();
