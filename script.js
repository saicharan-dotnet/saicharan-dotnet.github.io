(function () {
  "use strict";

  var root = document.documentElement;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  root.classList.add("js");

  /* ---------- Theme toggle ---------- */
  var themeToggle = document.getElementById("themeToggle");
  function syncThemeLabel() {
    var isDark = root.getAttribute("data-theme") !== "light";
    themeToggle.setAttribute("aria-label", isDark ? "Switch to light theme" : "Switch to dark theme");
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", isDark ? "#070b1a" : "#f7f8fc");
  }
  syncThemeLabel();
  themeToggle.addEventListener("click", function () {
    var next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
    root.setAttribute("data-theme", next);
    try { localStorage.setItem("theme", next); } catch (e) {}
    syncThemeLabel();
  });

  /* ---------- Mobile menu ---------- */
  var menuButton = document.getElementById("menuButton");
  var navLinks = document.getElementById("navLinks");
  function setMenu(open) {
    navLinks.classList.toggle("is-open", open);
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }
  menuButton.addEventListener("click", function () {
    setMenu(!navLinks.classList.contains("is-open"));
  });
  navLinks.addEventListener("click", function (e) {
    if (e.target.tagName === "A") setMenu(false);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") setMenu(false);
  });

  /* ---------- Nav background + scroll progress ---------- */
  var nav = document.getElementById("nav");
  var progress = document.querySelector(".scroll-progress");
  function onScroll() {
    var y = window.scrollY;
    nav.classList.toggle("scrolled", y > 12);
    var max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.transform = "scaleX(" + (max > 0 ? y / max : 0) + ")";
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Active section in nav ---------- */
  var links = Array.prototype.slice.call(navLinks.querySelectorAll("a"));
  var sections = links
    .map(function (a) { return document.querySelector(a.getAttribute("href")); })
    .filter(Boolean);
  if ("IntersectionObserver" in window) {
    var activeObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (a) {
          a.classList.toggle("active", a.getAttribute("href") === "#" + entry.target.id);
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach(function (s) { activeObserver.observe(s); });
  }

  /* ---------- Reveal on scroll ---------- */
  var reveals = document.querySelectorAll(".reveal");
  if (!reduceMotion && "IntersectionObserver" in window) {
    // Stagger siblings that reveal together.
    Array.prototype.forEach.call(reveals, function (el) {
      var siblings = Array.prototype.filter.call(el.parentElement.children, function (c) {
        return c.classList.contains("reveal");
      });
      var i = siblings.indexOf(el);
      if (i > 0) el.style.setProperty("--d", Math.min(i * 0.08, 0.4) + "s");
    });
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    Array.prototype.forEach.call(reveals, function (el) { revealObserver.observe(el); });
  } else {
    Array.prototype.forEach.call(reveals, function (el) { el.classList.add("in"); });
  }

  /* ---------- Count-up stats ---------- */
  var counters = document.querySelectorAll(".count");
  if (!reduceMotion && "IntersectionObserver" in window) {
    var countObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var to = parseInt(el.getAttribute("data-to"), 10);
        var suffix = el.getAttribute("data-suffix") || "";
        var start = null;
        el.textContent = "0" + suffix;
        function step(ts) {
          if (!start) start = ts;
          var p = Math.min((ts - start) / 1200, 1);
          el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3))) + suffix;
          if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
        countObserver.unobserve(el);
      });
    }, { threshold: 0.6 });
    Array.prototype.forEach.call(counters, function (el) { countObserver.observe(el); });
  }

  /* ---------- Typed headline ---------- */
  var typed = document.getElementById("typed");
  var phrases = [
    "reliable .NET apps",
    "ASP.NET Core APIs",
    "React front ends",
    "SQL Server backends",
    "Azure cloud solutions"
  ];
  if (typed && !reduceMotion) {
    var pi = 0, ci = phrases[0].length, deleting = true;
    function tick() {
      var word = phrases[pi];
      if (deleting) {
        ci--;
        if (ci <= 0) { deleting = false; pi = (pi + 1) % phrases.length; }
      } else {
        ci++;
        if (ci >= phrases[pi].length) { deleting = true; typed.textContent = phrases[pi]; return setTimeout(tick, 2000); }
      }
      typed.textContent = phrases[pi].slice(0, Math.max(ci, 0)) || "​";
      setTimeout(tick, deleting ? 40 : 75);
    }
    setTimeout(tick, 2600);
  }

  /* ---------- Skill filters ---------- */
  var filters = document.querySelectorAll(".filter");
  var skillCards = document.querySelectorAll(".skill-card");
  Array.prototype.forEach.call(filters, function (btn) {
    btn.addEventListener("click", function () {
      var f = btn.getAttribute("data-filter");
      Array.prototype.forEach.call(filters, function (b) {
        var on = b === btn;
        b.classList.toggle("is-active", on);
        b.setAttribute("aria-pressed", String(on));
      });
      Array.prototype.forEach.call(skillCards, function (card) {
        card.classList.toggle("is-hidden", f !== "all" && card.getAttribute("data-cat") !== f);
      });
    });
  });

  /* ---------- Copy email ---------- */
  var copyBtn = document.getElementById("copyEmail");
  if (copyBtn) {
    copyBtn.addEventListener("click", function () {
      var email = copyBtn.getAttribute("data-email");
      var label = copyBtn.querySelector("span");
      function done(text) {
        label.textContent = text;
        setTimeout(function () { label.textContent = "Copy email"; }, 2000);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email).then(function () { done("Copied!"); }, function () { done(email); });
      } else {
        done(email);
      }
    });
  }

  /* ---------- Footer year ---------- */
  var year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
