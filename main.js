// ============================================================
// NETHRA DARSHAN — shared site behavior
// ============================================================
//
// IMAGE PLACEHOLDERS
// Every photo slot across index.html is a labeled placeholder, e.g.:
//   <div class="ph" style="--ar:4/5" data-ph="Nethra Darshan Bedroom"></div>
// To drop in real photography later, replace the whole <div> with:
//   <img src="assets/images/bedroom.jpg" alt="Bedroom at Nethra Darshan" loading="lazy">
// (drop the ph classes — the surrounding layout CSS already expects
// a block-level element there, so a plain <img> slots straight in).
// See README.md for the full suggested file list.
// ============================================================

/* ---- booking configuration : edit here to update links ----
   Nethra Darshan is a single villa, not separate listings, so each
   "accommodation" here is really one of its three bedrooms — chosen
   for the same reason a guest might ask about a specific room, but
   every choice leads to the same villa-wide platforms below. Only
   platforms with a real, verified listing URL are included — do not
   add a platform, or a WhatsApp/phone "Direct Enquiry" row, without
   a real verified link/number. */
const accommodations = {
  masterBedroom: {
    name: "Master Bedroom",
    subtitle: "River-facing · villa level",
    platforms: [
      { label: "Airbnb", url: "https://www.airbnb.co.in/rooms/1304811251269428394" }
    ]
  },
  secondBedroom: {
    name: "Second Bedroom",
    subtitle: "Villa level · air conditioned",
    platforms: [
      { label: "Airbnb", url: "https://www.airbnb.co.in/rooms/1304811251269428394" }
    ]
  },
  thirdBedroom: {
    name: "Third Bedroom",
    subtitle: "Farm level · private deck",
    platforms: [
      { label: "Airbnb", url: "https://www.airbnb.co.in/rooms/1304811251269428394" }
    ]
  }
};

/* Property-level listings, shown alongside whichever bedroom is
   chosen (and alone for the "just browsing" / property step) since
   Booking.com and Agoda list the whole villa rather than a room. */
const propertyPlatforms = [
  { label: "Booking.com", url: "https://www.booking.com/hotel/in/nethra-darshan.html" },
  { label: "Agoda", url: "https://www.agoda.com/nethra-darshan/hotel/mangalore-in.html" }
];

document.addEventListener("DOMContentLoaded", () => {

  /* ---- sticky CTA height: measured, not guessed ----
     style.css reads --sticky-cta-h to reserve exactly enough space
     above the fixed "Book Your Stay" bar (hero bottom padding, and
     the page's end-of-document padding), so the bar can never cover
     the Explore the Villa button or hero copy on any phone size.
     The CSS fallback (78px) covers the instant before this runs. */
  const stickyCta = document.querySelector(".sticky-cta");
  const setStickyCtaHeight = () => {
    if (!stickyCta) return;
    document.documentElement.style.setProperty("--sticky-cta-h", `${stickyCta.offsetHeight}px`);
  };
  setStickyCtaHeight();
  window.addEventListener("resize", setStickyCtaHeight);
  window.addEventListener("orientationchange", setStickyCtaHeight);

  /* ---- nav scroll state ---- */
  const nav = document.querySelector(".nav");
  if (nav) {
    const onScroll = () => {
      nav.classList.toggle("is-scrolled", window.scrollY > 40);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---- mobile nav overlay ---- */
  const toggle = document.querySelector(".nav-toggle");
  const overlay = document.querySelector(".nav-overlay");
  const overlayClose = document.querySelector(".nav-overlay-close");
  if (toggle && overlay) {
    toggle.addEventListener("click", () => overlay.classList.add("is-open"));
    overlayClose?.addEventListener("click", () => overlay.classList.remove("is-open"));
    overlay.querySelectorAll("a").forEach(a =>
      a.addEventListener("click", () => overlay.classList.remove("is-open"))
    );
  }

  /* ---- scroll reveal ---- */
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14 });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add("is-visible"));
  }

  /* ---- image placeholder reveal (works the same once real photos replace the placeholders) ---- */
  const phEls = document.querySelectorAll(".ph");
  if ("IntersectionObserver" in window && phEls.length) {
    const phIo = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("ph--revealed");
          phIo.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -6% 0px" });
    phEls.forEach(el => phIo.observe(el));
  } else {
    phEls.forEach(el => el.classList.add("ph--revealed"));
  }

  /* ---- reveal fallback ----
     The two IntersectionObservers above only ever check each element once
     (they unobserve after the first match). On some small mobile viewports
     the very first check can run before layout has fully settled — e.g. the
     masonry gallery's column layout depending on webfont metrics — so an
     element that's actually in view gets missed, and nothing re-triggers it
     since the observer already stopped watching it. Forcing a viewport
     resize is what makes the browser recompute and finally catch it.
     This adds a cheap, rAF-throttled backstop that re-checks only the
     elements still missing their reveal class and reveals them directly if
     they're in (or already past) the viewport — it never fights the
     observers, it just catches what they missed. */
  if (revealEls.length || phEls.length) {
    let tickingReveal = false;
    const catchMissedReveals = () => {
      revealEls.forEach(el => {
        if (el.classList.contains("is-visible")) return;
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight && r.bottom > 0) el.classList.add("is-visible");
      });
      phEls.forEach(el => {
        if (el.classList.contains("ph--revealed")) return;
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight && r.bottom > 0) el.classList.add("ph--revealed");
      });
      tickingReveal = false;
    };
    const scheduleCatchUp = () => {
      if (!tickingReveal) {
        window.requestAnimationFrame(catchMissedReveals);
        tickingReveal = true;
      }
    };
    window.addEventListener("scroll", scheduleCatchUp, { passive: true });
    window.addEventListener("resize", scheduleCatchUp);
    window.addEventListener("load", catchMissedReveals);
    catchMissedReveals(); // catch anything already in view on first paint
  }

  /* ---- hero media entrance: slow settle from a soft scale, once on load ----
     Runs regardless of reduced motion (reduced motion just collapses
     the transition to ~0ms via the global CSS rule), so the image is
     never left invisible. Once settled, the inline transition is
     cleared so it never fights the scroll-driven parallax below,
     which sets transform every frame directly. */
  const heroForEntrance = document.querySelector(".hero");
  const heroMediaEntrance = heroForEntrance?.querySelector(".hero-media");
  if (heroMediaEntrance) {
    const duration = prefersReducedMotion ? 10 : 1700;
    heroMediaEntrance.style.opacity = "0";
    heroMediaEntrance.style.transform = "scale(1.045)";
    requestAnimationFrame(() => {
      heroMediaEntrance.style.transition = `opacity ${Math.round(duration * 0.75)}ms cubic-bezier(.22,.61,.36,1), transform ${duration}ms cubic-bezier(.22,.61,.36,1)`;
      requestAnimationFrame(() => {
        heroMediaEntrance.style.opacity = "1";
        heroMediaEntrance.style.transform = "scale(1)";
      });
    });
    window.setTimeout(() => { heroMediaEntrance.style.transition = ""; }, duration + 100);
  }

  /* ---- hero scroll effect: subtle cinematic parallax + fade, skipped for reduced motion ---- */
  const hero = document.querySelector(".hero");
  if (hero && !prefersReducedMotion) {
    const heroMedia = hero.querySelector(".hero-media");
    const heroContent = hero.querySelector(".hero-content");
    const scrollCue = hero.querySelector(".scroll-cue");
    let ticking = false;
    const updateHero = () => {
      const y = window.scrollY;
      const fade = Math.max(0, 1 - y / 520);
      if (y < window.innerHeight) {
        if (heroMedia) heroMedia.style.transform = `translateY(${y * 0.18}px)`;
        if (heroContent) {
          heroContent.style.opacity = String(fade);
          heroContent.style.transform = `translateY(${y * 0.08}px)`;
        }
        if (scrollCue) scrollCue.style.opacity = String(Math.max(0, 1 - y / 160));
      }
      ticking = false;
    };
    window.addEventListener("scroll", () => {
      if (!ticking) {
        window.requestAnimationFrame(updateHero);
        ticking = true;
      }
    }, { passive: true });
    updateHero();
  }

  /* ---- gallery filter ---- */
  const filters = document.querySelectorAll(".gfilter");
  const items = document.querySelectorAll(".masonry-item");
  filters.forEach(btn => {
    btn.addEventListener("click", () => {
      filters.forEach(b => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      const cat = btn.dataset.filter;
      items.forEach((item, i) => {
        const show = cat === "all" || item.dataset.category === cat;
        const isHidden = item.classList.contains("hide");
        if (show && isHidden) {
          item.classList.remove("hide");
          item.classList.add("leaving");
          void item.offsetWidth; // force reflow so the transition runs
          item.style.transitionDelay = prefersReducedMotion ? "0ms" : `${(i % 6) * 35}ms`;
          requestAnimationFrame(() => item.classList.remove("leaving"));
        } else if (!show && !isHidden) {
          item.style.transitionDelay = "0ms";
          item.classList.add("leaving");
          window.setTimeout(() => {
            item.classList.add("hide");
            item.classList.remove("leaving");
          }, prefersReducedMotion ? 0 : 380);
        }
      });
    });
  });

  /* ---- lightbox ---- */
  const lightbox = document.querySelector(".lightbox");
  if (lightbox) {
    const lbPh = lightbox.querySelector(".lightbox-ph");
    const lbImg = lightbox.querySelector(".lightbox-img");
    const lbCounter = lightbox.querySelector(".lightbox-counter");
    let visibleItems = [];
    let currentIndex = 0;

    const refreshVisible = () =>
      (visibleItems = Array.from(items).filter(i => !i.classList.contains("hide")));

    const openAt = (index) => {
      refreshVisible();
      if (!visibleItems.length) return;
      currentIndex = (index + visibleItems.length) % visibleItems.length;
      const ph = visibleItems[currentIndex].querySelector(".ph");
      const sourceImg = ph ? ph.querySelector("img") : null;
      lbPh.setAttribute("data-ph", ph ? ph.getAttribute("data-ph") : "");
      if (lbImg) {
        if (sourceImg && sourceImg.getAttribute("src")) {
          lbImg.src = sourceImg.currentSrc || sourceImg.src;
          lbImg.alt = sourceImg.alt || "";
        } else {
          lbImg.removeAttribute("src");
          lbImg.alt = "";
        }
      }
      lbCounter.textContent = `${currentIndex + 1} / ${visibleItems.length}`;
      lightbox.classList.add("is-open");
      document.body.style.overflow = "hidden";
    };
    const close = () => {
      lightbox.classList.remove("is-open");
      document.body.style.overflow = "";
    };

    items.forEach((item) => {
      item.addEventListener("click", () => {
        refreshVisible();
        const idx = visibleItems.indexOf(item);
        openAt(idx === -1 ? 0 : idx);
      });
    });
    lightbox.querySelector(".lightbox-close").addEventListener("click", close);
    lightbox.querySelector(".lightbox-prev").addEventListener("click", () => openAt(currentIndex - 1));
    lightbox.querySelector(".lightbox-next").addEventListener("click", () => openAt(currentIndex + 1));
    lightbox.addEventListener("click", (e) => { if (e.target === lightbox) close(); });
    document.addEventListener("keydown", (e) => {
      if (!lightbox.classList.contains("is-open")) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") openAt(currentIndex + 1);
      if (e.key === "ArrowLeft") openAt(currentIndex - 1);
    });
    // basic swipe support
    let touchStartX = 0;
    lightbox.addEventListener("touchstart", (e) => (touchStartX = e.touches[0].clientX));
    lightbox.addEventListener("touchend", (e) => {
      const dx = e.changedTouches[0].clientX - touchStartX;
      if (dx > 50) openAt(currentIndex - 1);
      if (dx < -50) openAt(currentIndex + 1);
    });
  }

  /* ---- booking gateway modal ----
     Two steps: choose accommodation, then choose platform (mirrors the
     original architecture, but keyed by accommodation instead of villa). */
  const modal = document.querySelector(".booking-modal");
  if (modal) {
    const stepAccommodation = modal.querySelector('[data-step="accommodation"]');
    const stepPlatform = modal.querySelector('[data-step="platform"]');
    const platformList = modal.querySelector(".platform-list");
    const backBtn = modal.querySelector(".booking-back");

    // small cross-fade helper: fade the outgoing step down, swap
    // display, then fade the incoming step up — used for both
    // accommodation -> platform and platform -> accommodation
    const swapStep = (hideEl, showEl, after) => {
      const dur = prefersReducedMotion ? 10 : 220;
      hideEl.style.transition = `opacity ${dur}ms ease`;
      hideEl.style.opacity = "0";
      window.setTimeout(() => {
        hideEl.style.display = "none";
        after?.();
        showEl.style.display = "";
        showEl.style.opacity = "0";
        showEl.style.transition = "none";
        requestAnimationFrame(() => {
          showEl.style.transition = `opacity ${dur}ms ease`;
          showEl.style.opacity = "1";
        });
      }, dur);
    };

    const renderPlatforms = (key) => {
      platformList.innerHTML = "";

      let title, rows;
      if (key === "property") {
        title = "Nethra Darshan";
        rows = propertyPlatforms;
      } else {
        const acc = accommodations[key];
        title = acc.name;
        rows = [...acc.platforms, ...propertyPlatforms];
      }
      stepPlatform.querySelector(".chosen-villa").textContent = title;

      rows.forEach(({ label, url }) => {
        const a = document.createElement("a");
        a.href = url;
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        a.innerHTML = `<span class="pname">${label}</span><span class="parrow">→</span>`;
        platformList.appendChild(a);
      });

      if (stepAccommodation.style.display !== "none") {
        swapStep(stepAccommodation, stepPlatform);
      } else {
        // already on the platform step (switching bedroom directly) —
        // just re-run the entrance animation on the fresh list
        platformList.querySelectorAll("a").forEach(a => { a.style.animation = "none"; void a.offsetWidth; a.style.animation = ""; });
      }
    };

    const openModal = (presetKey) => {
      modal.classList.add("is-open");
      document.body.style.overflow = "hidden";
      stepAccommodation.style.opacity = "";
      stepPlatform.style.opacity = "";
      if (presetKey) {
        stepAccommodation.style.display = "none";
        stepPlatform.style.display = "";
        renderPlatforms(presetKey);
      } else {
        stepAccommodation.style.display = "";
        stepPlatform.style.display = "none";
      }
    };
    const closeModal = () => {
      modal.classList.remove("is-open");
      document.body.style.overflow = "";
      stepAccommodation.style.display = "";
      stepPlatform.style.display = "none";
      stepAccommodation.style.opacity = "";
      stepPlatform.style.opacity = "";
    };

    document.querySelectorAll("[data-open-booking]").forEach(btn => {
      btn.addEventListener("click", () => openModal(btn.dataset.openBooking || null));
    });
    modal.querySelectorAll("[data-accommodation]").forEach(btn => {
      btn.addEventListener("click", () => renderPlatforms(btn.dataset.accommodation));
    });
    backBtn?.addEventListener("click", () => swapStep(stepPlatform, stepAccommodation));
    modal.querySelector(".booking-panel-close").addEventListener("click", closeModal);
    modal.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal.classList.contains("is-open")) closeModal();
    });
  }
});