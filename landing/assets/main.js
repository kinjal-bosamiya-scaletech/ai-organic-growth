/* =========================================================================
   Ranky AI — landing page behaviour
   No dependencies. Everything here is progressive enhancement: with JS
   disabled the page is fully readable and fully visible.
   ========================================================================= */

(function () {
  "use strict";

  var root = document.documentElement;

  /* --- Theme: light / dark / system ------------------------------------
     Same storage key as src/context/ThemeContext.tsx, so a returning
     visitor's choice carries over if this page and the app share an
     origin. The class itself is already applied by the inline anti-FOUC
     script in <head>; this just wires up the toggle and keeps it synced
     with the OS setting while "system" is selected.
     -------------------------------------------------------------------- */

  var THEME_KEY = "ranky-theme";
  var themeMedia = window.matchMedia("(prefers-color-scheme: dark)");
  var themeButtons = document.querySelectorAll(".theme-toggle__btn");

  function storedThemeChoice() {
    try {
      var stored = localStorage.getItem(THEME_KEY);
      if (stored === "light" || stored === "dark" || stored === "system") {
        return stored;
      }
    } catch (e) {
      // Private mode / blocked storage — fall through to the system default.
    }
    return "system";
  }

  function applyTheme(choice) {
    var resolved = choice === "system" ? (themeMedia.matches ? "dark" : "light") : choice;
    root.classList.toggle("dark", resolved === "dark");
    root.style.colorScheme = resolved;
    themeButtons.forEach(function (button) {
      var pressed = button.getAttribute("data-theme-choice") === choice;
      button.setAttribute("aria-pressed", String(pressed));
    });
  }

  var themeChoice = storedThemeChoice();
  applyTheme(themeChoice);

  themeButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      themeChoice = button.getAttribute("data-theme-choice");
      try {
        localStorage.setItem(THEME_KEY, themeChoice);
      } catch (e) {
        // Preference just won't persist; the session still works.
      }
      applyTheme(themeChoice);
    });
  });

  if (typeof themeMedia.addEventListener === "function") {
    themeMedia.addEventListener("change", function () {
      if (themeChoice === "system") applyTheme(themeChoice);
    });
  }

  /* --- Motion gate ----------------------------------------------------
     Animations are opt-in: CSS only animates under [data-motion="on"], so
     visitors who asked for reduced motion (and anyone without JS) get the
     finished page immediately instead of empty, un-revealed sections.
     -------------------------------------------------------------------- */

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  var animate = !reduced.matches;

  if (animate) {
    root.setAttribute("data-motion", "on");
  }

  // Honour a mid-visit change to the OS setting.
  var onPrefChange = function () {
    if (reduced.matches) {
      root.removeAttribute("data-motion");
    } else {
      root.setAttribute("data-motion", "on");
    }
  };

  if (typeof reduced.addEventListener === "function") {
    reduced.addEventListener("change", onPrefChange);
  }

  /* --- Tools marquee --------------------------------------------------
     The CSS slides the track by exactly one group width, so the loop is
     only seamless with three identical groups. Clone them here rather
     than triplicating the markup — and keep the copies out of the
     accessibility tree and out of the tab order.
     -------------------------------------------------------------------- */

  var marqueeTrack = document.querySelector(".marquee__track");

  if (animate && marqueeTrack && marqueeTrack.children.length === 1) {
    var group = marqueeTrack.firstElementChild;

    for (var copy = 0; copy < 2; copy++) {
      var clone = group.cloneNode(true);
      clone.setAttribute("aria-hidden", "true");
      clone.querySelectorAll("a").forEach(function (link) {
        link.tabIndex = -1;
      });
      marqueeTrack.appendChild(clone);
    }
  }

  /* =====================================================================
     Book-a-demo dialog
     ===================================================================== */

  var demo = document.getElementById("demo");
  var demoForm = document.getElementById("demo-form");
  var demoDone = demo.querySelector(".modal__done");
  var demoError = demo.querySelector(".modal__error");
  var demoSubmit = demo.querySelector(".modal__submit");
  var canDialog = typeof demo.showModal === "function";

  /* ---------------------------------------------------------------------
     TODO: point this at your real endpoint. Everything else in the flow
     (validation, pending state, success panel, error panel) already works
     against the promise this returns.

       return fetch("/api/demo-requests", {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify(payload),
       }).then(function (res) {
         if (!res.ok) throw new Error("Request failed");
       });

     Until then it resolves after a short delay so the UI is complete.
     --------------------------------------------------------------------- */
  function submitDemoRequest(payload) {
    return new Promise(function (resolve) {
      window.setTimeout(function () {
        // eslint-disable-next-line no-console
        console.info("[demo request]", payload);
        resolve();
      }, 700);
    });
  }

  function openDemo() {
    demo.showModal();
    document.body.classList.add("modal-open");

    var first = demoForm.hidden
      ? demoDone.querySelector(".modal__title")
      : demoForm.querySelector("input");

    if (first) first.focus();
  }

  function closeDemo() {
    demo.close();
  }

  demo.addEventListener("close", function () {
    document.body.classList.remove("modal-open");
  });

  document.querySelectorAll("[data-demo]").forEach(function (trigger) {
    trigger.addEventListener("click", function (event) {
      // Without <dialog> support the href="#demo" fallback takes over.
      if (!canDialog) return;
      event.preventDefault();
      openDemo();
    });
  });

  demo.querySelectorAll("[data-demo-close]").forEach(function (button) {
    button.addEventListener("click", closeDemo);
  });

  // A click that lands on the dialog itself is a click on the backdrop.
  demo.addEventListener("click", function (event) {
    if (event.target === demo) closeDemo();
  });

  demoForm.addEventListener("submit", function (event) {
    event.preventDefault();

    // novalidate keeps the browser quiet until submit, then we ask for it.
    if (!demoForm.checkValidity()) {
      demoForm.reportValidity();
      return;
    }

    var data = new FormData(demoForm);
    var payload = {
      name: data.get("name"),
      email: data.get("email"),
      company: data.get("company"),
      website: data.get("website"),
      note: data.get("note"),
    };

    demoError.hidden = true;
    demoSubmit.disabled = true;
    demoSubmit.querySelector("span").textContent = "Sending…";

    submitDemoRequest(payload)
      .then(function () {
        demo.querySelector("[data-demo-email]").textContent = payload.email;
        demoForm.hidden = true;
        demoDone.hidden = false;
        demoDone.querySelector(".modal__title").focus();
      })
      .catch(function () {
        demoError.textContent =
          "Something went wrong sending that. Please try again, or email us directly.";
        demoError.hidden = false;
        demoSubmit.disabled = false;
        demoSubmit.querySelector("span").textContent = "Request demo";
      });
  });

  // Deep link: /landing/#demo opens the dialog rather than the inline fallback.
  if (canDialog && window.location.hash === "#demo") {
    openDemo();
    window.history.replaceState(null, "", window.location.pathname);
  }

  /* --- Nav: hairline + blur once scrolled off the hero ---------------- */

  var nav = document.getElementById("nav");
  var ticking = false;

  function syncNav() {
    nav.classList.toggle("is-stuck", window.scrollY > 24);
    ticking = false;
  }

  window.addEventListener(
    "scroll",
    function () {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(syncNav);
      }
    },
    { passive: true }
  );

  syncNav();

  /* --- Scroll-spy: highlight the current section's nav link ----------- */

  var navLinks = document.querySelectorAll(".nav__link");
  var spySections = [];

  navLinks.forEach(function (link) {
    var id = link.getAttribute("href").slice(1);
    var section = document.getElementById(id);
    if (section) spySections.push(section);
  });

  if (spySections.length && "IntersectionObserver" in window) {
    var setActiveLink = function (id) {
      navLinks.forEach(function (link) {
        link.classList.toggle("is-active", link.getAttribute("href") === "#" + id);
      });
    };

    var spy = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) setActiveLink(entry.target.id);
        });
      },
      // A thin band just above the viewport's middle — whichever section is
      // crossing it counts as "current", the usual scroll-spy trick.
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );

    spySections.forEach(function (section) {
      spy.observe(section);
    });
  }

  /* =====================================================================
     Hero mock: a real, looping worked example rather than a static
     screenshot. Entirely decorative (aria-hidden; the H1/lede carry the
     actual page content), so it can play freely without an accessibility
     burden of its own. Placed before the reduced-motion early-return below
     so it always initialises, even when the rest of the reveal/scroll
     wiring bails out early.
     ===================================================================== */

  var demoEl = document.querySelector("[data-demo-player]");

  if (demoEl) {
    var demoScoreEl = demoEl.querySelector("[data-demo-score]");
    var demoRingEl = demoEl.querySelector("[data-demo-ring]");
    var demoPhaseEl = demoEl.querySelector("[data-demo-phase]");
    var demoPhaseTextEl = demoEl.querySelector("[data-demo-phase-text]");
    var demoFootEl = demoEl.querySelector("[data-demo-foot]");
    var demoRows = Array.prototype.slice.call(demoEl.querySelectorAll("[data-demo-row]"));

    var RING_CIRCUMFERENCE = 326.7; // 2 * PI * r(52) — matches the hero gauge
    var START_SCORE = 41;
    var ROW_FIXES = [{ after: 58 }, { after: 76 }, { after: 92 }];
    var ORIGINAL_TAGS = demoRows.map(function (row) {
      return row.querySelector("[data-demo-row-tag]").textContent;
    });
    // Captured once, up front — resetDemo() restores this on every loop, so
    // the row's original severity colour survives past the first fix (it
    // gets overwritten with the brand green once "fixed").
    var ORIGINAL_SEV = demoRows.map(function (row) {
      return row.style.getPropertyValue("--sev");
    });
    var demoRunId = 0;

    var setScore = function (value) {
      demoRingEl.style.strokeDashoffset = String(RING_CIRCUMFERENCE * (1 - value / 100));
      demoScoreEl.textContent = String(Math.round(value));
    };

    var setPhase = function (phase, label) {
      demoPhaseEl.setAttribute("data-phase", phase);
      demoPhaseTextEl.textContent = label;
    };

    var wait = function (ms) {
      return new Promise(function (resolve) {
        window.setTimeout(resolve, ms);
      });
    };

    var animateScore = function (from, to, duration) {
      return new Promise(function (resolve) {
        var start = null;
        function tick(ts) {
          if (start === null) start = ts;
          var progress = Math.min((ts - start) / duration, 1);
          setScore(from + (to - from) * progress);
          if (progress < 1) {
            window.requestAnimationFrame(tick);
          } else {
            resolve();
          }
        }
        window.requestAnimationFrame(tick);
      });
    };

    var resetDemo = function () {
      setScore(START_SCORE);
      setPhase("scanning", "Scanning");
      demoFootEl.textContent = "Scanning for indexing and content issues…";
      demoRows.forEach(function (row, i) {
        row.classList.remove("is-fixed");
        row.style.setProperty("--sev", ORIGINAL_SEV[i]);
        row.querySelector("[data-demo-row-tag]").textContent = ORIGINAL_TAGS[i];
      });
    };

    var fixRow = function (index, runId) {
      var row = demoRows[index];
      var fix = ROW_FIXES[index];
      var from = index === 0 ? START_SCORE : ROW_FIXES[index - 1].after;
      return wait(950).then(function () {
        if (runId !== demoRunId) return Promise.reject(new Error("cancelled"));
        row.classList.add("is-fixed");
        row.style.setProperty("--sev", "var(--brand)");
        row.querySelector("[data-demo-row-tag]").textContent = "FIXED";
        return animateScore(from, fix.after, 850);
      });
    };

    var playDemo = function (runId) {
      resetDemo();

      return wait(1100)
        .then(function () {
          if (runId !== demoRunId) return Promise.reject(new Error("cancelled"));
          setPhase("found", "3 issues found");
          demoFootEl.textContent = "3 issues found — generating fixes…";
          return wait(1000);
        })
        .then(function () {
          if (runId !== demoRunId) return Promise.reject(new Error("cancelled"));
          setPhase("fixing", "Applying fixes");
          return fixRow(0, runId);
        })
        .then(function () {
          if (runId !== demoRunId) return Promise.reject(new Error("cancelled"));
          return fixRow(1, runId);
        })
        .then(function () {
          if (runId !== demoRunId) return Promise.reject(new Error("cancelled"));
          return fixRow(2, runId);
        })
        .then(function () {
          if (runId !== demoRunId) return Promise.reject(new Error("cancelled"));
          setPhase("done", "Done");
          demoFootEl.textContent = "+51 points in one pass — +156% organic clicks projected in 90 days";
          return wait(4200);
        })
        .then(function () {
          if (runId !== demoRunId) return Promise.reject(new Error("cancelled"));
          return playDemo(runId);
        })
        .catch(function () {
          // Cancelled — scrolled away, or a newer run took over. Silence is
          // correct here: this is just the loop stopping.
        });
    };

    if (animate && "IntersectionObserver" in window) {
      var demoObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            demoRunId++; // invalidates any in-flight chain either way
            if (entry.isIntersecting) playDemo(demoRunId);
          });
        },
        { threshold: 0.35 }
      );
      demoObserver.observe(demoEl);
    } else {
      // Reduced motion / no IntersectionObserver: show the finished state
      // as a static proof point rather than an unplayed "before".
      setScore(92);
      setPhase("done", "Done");
      demoFootEl.textContent = "+51 points in one pass — +156% organic clicks projected in 90 days";
      demoRows.forEach(function (row) {
        row.classList.add("is-fixed");
        row.style.setProperty("--sev", "var(--brand)");
        row.querySelector("[data-demo-row-tag]").textContent = "FIXED";
      });
    }
  }

  /* --- Scroll reveals -------------------------------------------------
     One observer drives three things:
       .reveal  → fade-up (staggered by its own --i)
       .mock    → sparkline draw-on (the gauge ring is the hero's own
                  live-example loop above, driven independently)
       .pipe    → the eight pipeline nodes light up in sequence
     -------------------------------------------------------------------- */

  var targets = document.querySelectorAll(".reveal, .mock, .flow, .sprawl, .pipe");

  if (!animate || !("IntersectionObserver" in window)) {
    // Static fallback: mark everything visible so nothing is left hidden.
    targets.forEach(function (el) {
      el.classList.add("is-visible");
    });
    document.querySelectorAll(".node").forEach(function (el) {
      el.classList.add("is-lit");
    });
    return;
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;

        var el = entry.target;
        el.classList.add("is-visible");

        if (el.classList.contains("pipe")) {
          el.querySelectorAll(".node").forEach(function (node) {
            node.classList.add("is-lit");
          });
        }

        observer.unobserve(el);
      });
    },
    { rootMargin: "0px 0px -12% 0px", threshold: 0.15 }
  );

  targets.forEach(function (el) {
    observer.observe(el);
  });
})();
