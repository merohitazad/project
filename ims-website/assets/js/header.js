// ./assets/js/header.js
// Robust header wiring (desktop + mobile). Waits for elements if they are added later.

(function () {
  const FLAG_DESKTOP = "data-ims-desktop-wired";
  const FLAG_MOBILE = "data-ims-mobile-wired";

  const SEL_HEADER = "header";
  const SEL_MENU_BTN = ".menu-button";
  const SEL_DRAWER = ".mobile-nav-drawer";
  const SEL_OVERLAY = ".mobile-nav-overlay";
  const SEL_CLOSE = ".mobile-close-btn";
  const SEL_ACC_HEAD = ".mobile-acc-head";
  const SEL_NAV_ITEM = ".nav-item";
  const SEL_DROPCARD = ".dropdown-card";

  const closest = (el, s) => (el && el.closest ? el.closest(s) : null);

  /* ---------------- Desktop wiring (unchanged) ---------------- */
  function wireDesktop(root) {
    if (!root || root.hasAttribute(FLAG_DESKTOP)) return;
    root.setAttribute(FLAG_DESKTOP, "1");

    const hideTimeouts = new WeakMap();

    const showCard = (card) => {
      if (!card) return;
      clearTimeout(hideTimeouts.get(card)?.t);
      card.classList.add("visible");
      card.setAttribute("aria-hidden", "false");
    };
    const scheduleHide = (card, d = 80) => {
      if (!card) return;
      clearTimeout(hideTimeouts.get(card)?.t);
      const t = setTimeout(() => {
        card.classList.remove("visible");
        card.setAttribute("aria-hidden", "true");
      }, d);
      hideTimeouts.set(card, { t });
    };

    root.addEventListener("mouseover", (e) => {
      const item = closest(e.target, SEL_NAV_ITEM);
      if (!item) return;
      showCard(item.querySelector(SEL_DROPCARD));
    });

    root.addEventListener("mouseout", (e) => {
      const item = closest(e.target, SEL_NAV_ITEM);
      if (!item) return;
      const card = item.querySelector(SEL_DROPCARD);
      const rel = e.relatedTarget;
      if (item.contains(rel) || (card && card.contains(rel))) return;
      scheduleHide(card);
    });

    root.addEventListener("focusin", (e) => {
      const item = closest(e.target, SEL_NAV_ITEM);
      if (!item) return;
      showCard(item.querySelector(SEL_DROPCARD));
    });

    root.addEventListener("focusout", (e) => {
      const item = closest(e.target, SEL_NAV_ITEM);
      if (!item) return;
      const card = item.querySelector(SEL_DROPCARD);
      const rel = e.relatedTarget;
      if (item.contains(rel) || (card && card.contains(rel))) return;
      scheduleHide(card);
    });

    document.addEventListener("click", (e) => {
      if (closest(e.target, "header")) return;
      root.querySelectorAll(`${SEL_DROPCARD}.visible`).forEach((c) => {
        c.classList.remove("visible");
        c.setAttribute("aria-hidden", "true");
      });
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        root.querySelectorAll(`${SEL_DROPCARD}.visible`).forEach((c) => {
          c.classList.remove("visible");
          c.setAttribute("aria-hidden", "true");
        });
      }
    });
  }

  /* ---------------- Mobile wiring (robust, waits for elements) ---------------- */
  function wireMobileNow() {
    // Always query document (not header root) because drawer/overlay may be outside header
    const btn = document.querySelector(SEL_MENU_BTN);
    const drawer = document.querySelector(SEL_DRAWER);
    const overlay = document.querySelector(SEL_OVERLAY);
    const closeBtn = document.querySelector(SEL_CLOSE);
    const accHeads = Array.from(document.querySelectorAll(SEL_ACC_HEAD));

    // If any required mobile element is missing, return false so caller can wait/observe.
    if (!btn || !drawer || !overlay) {
      return false;
    }

    // Idempotent binding
    if (!btn.__mobileBound) {
      const open = () => {
        drawer.classList.add("open");
        overlay.classList.add("show");
        btn.setAttribute("aria-expanded", "true");
        document.body.style.overflow = "hidden";
      };
      const close = () => {
        drawer.classList.remove("open");
        overlay.classList.remove("show");
        btn.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      };
      const toggle = (e) => {
        if (e?.type === "touchstart") e.preventDefault();
        drawer.classList.contains("open") ? close() : open();
      };

      btn.addEventListener("click", toggle);
      btn.addEventListener("touchstart", toggle, { passive: false });

      overlay.addEventListener("click", close);
      if (closeBtn) closeBtn.addEventListener("click", close);

      btn.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          toggle(e);
        }
      });

      btn.__mobileBound = true;
    }

    // Wire accordions (idempotent)
    accHeads.forEach((h) => {
      if (h.__accBound) return;
      h.addEventListener(
        "click",
        () => {
          const body = h.nextElementSibling;
          if (!body) return;
          const isOpen = body.classList.toggle("open");
          const caret = h.querySelector(".toggle-icon");
          if (caret) caret.classList.toggle("rot", isOpen);
        },
        { passive: true }
      );
      h.__accBound = true;
    });

    return true;
  }

  /* Wait-for-elements helper:
     - Try to wire immediately.
     - If not all elements are present, observe the document for a short time and re-attempt.
  */
  function ensureMobileWired(timeout = 3000) {
    // try immediately
    if (wireMobileNow()) return;

    // avoid repeated warnings across multiple init calls
    if (!window.__imsMobileWarnSetup)
      window.__imsMobileWarnSetup = { warned: false };

    const start = Date.now();
    const mo = new MutationObserver(() => {
      if (wireMobileNow()) {
        mo.disconnect();
        return;
      }

      // stop observing after timeout and warn only once
      if (Date.now() - start > timeout) {
        mo.disconnect();
        if (!window.__imsMobileWarnSetup.warned) {
          // warn a single time so console doesn't spam
          console.warn(
            "Mobile wiring: required elements (.menu-button, .mobile-nav-drawer, .mobile-nav-overlay) not found within timeout."
          );
          window.__imsMobileWarnSetup.warned = true;
        }
      }
    });

    mo.observe(document.documentElement || document, {
      childList: true,
      subtree: true,
    });
  }

  /* ---------------- Init ---------------- */
  function init() {
    const header = document.querySelector(SEL_HEADER);
    if (header) wireDesktop(header);
    // Desktop done (if header exists). For mobile, always attempt/wait regardless.
    ensureMobileWired();
  }

  // Run on DOMContentLoaded if still loading, otherwise now.
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }

  // Re-run on pageshow (bfcache) and when header might be replaced later
  window.addEventListener("pageshow", init);
  const repObs = new MutationObserver(init);
  repObs.observe(document.documentElement || document, {
    childList: true,
    subtree: true,
  });
})();
