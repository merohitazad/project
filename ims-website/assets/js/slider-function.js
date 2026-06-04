function createAutoSlider(containerOrSelector, cardSelector, opts = {}) {
  const options = Object.assign(
    {
      intervalSeconds: 4,
      smoothDurationMs: 600,
      debug: false,
    },
    opts
  );

  const container =
    typeof containerOrSelector === "string"
      ? document.querySelector(containerOrSelector)
      : containerOrSelector;

  if (!container) {
    console.warn("createAutoSlider: container not found", containerOrSelector);
    return null;
  }

  // Instance state (scoped per-slider)
  let intervalId = null;
  let currentIndex = 0;
  let cardStep = 0;
  let originalCount = 0;
  let isHovered = false;
  let isImagesLoaded = false;
  let resizeTimer = null;
  let destroyed = false;

  // Utilities
  function log(...args) {
    if (options.debug) console.log("[autoSlider]", ...args);
  }

  function waitForImages() {
    const imgs = Array.from(container.querySelectorAll("img"));
    if (imgs.length === 0) return Promise.resolve();
    const promises = imgs.map((img) => {
      if (img.complete) return Promise.resolve();
      return new Promise((resolve) => {
        img.addEventListener("load", resolve, { once: true });
        img.addEventListener("error", resolve, { once: true });
      });
    });
    return Promise.all(promises);
  }

  // Calculate cardStep (card width + gap). Prefer computed gap when available.
  function calculateCardStep() {
    const cards = Array.from(container.querySelectorAll(cardSelector));
    if (!cards.length) {
      cardStep = 0;
      return;
    }

    const firstRect = cards[0].getBoundingClientRect();

    // try computed gap (columnGap / gap)
    const style = getComputedStyle(container);
    const gapValue =
      parseFloat(style.columnGap || style.gap || style.rowGap) || 0;

    if (cards.length > 1) {
      if (gapValue > 0) {
        cardStep = Math.round(firstRect.width + gapValue);
        log("calcStep from css gap", cardStep, "gap", gapValue);
        return;
      }
      const secondRect = cards[1].getBoundingClientRect();
      const inferredGap = Math.round(
        secondRect.left - (firstRect.left + firstRect.width)
      );
      cardStep = Math.round(firstRect.width + Math.max(0, inferredGap));
      log(
        "calcStep from geometry",
        cardStep,
        "inferredGap",
        inferredGap,
        "w",
        firstRect.width
      );
      return;
    }

    // single card fallback
    cardStep = Math.round(firstRect.width);
    log("calcStep single card", cardStep);
  }

  // Setup clones for infinite scroll
  function setupClones() {
    const children = Array.from(container.children);

    // set originalCount if not set yet
    if (!originalCount) originalCount = children.length;

    // remove previously appended clones
    if (children.length > originalCount) {
      for (let i = children.length - 1; i >= originalCount; i--) {
        container.removeChild(children[i]);
      }
    }

    // append clones of originals
    const originals = Array.from(container.children).slice(0, originalCount);
    originals.forEach((node) => {
      const clone = node.cloneNode(true);
      clone.setAttribute("aria-hidden", "true");
      container.appendChild(clone);
    });

    log(
      "setupClones originalCount",
      originalCount,
      "totalChildren",
      container.children.length
    );
  }

  // Smooth scroll to index
  function slideToIndex(index) {
    if (!cardStep) return;
    const target = index * cardStep;
    container.scrollTo({ left: target, behavior: "smooth" });
  }

  // Autoplay controls
  function startAutoAdvance() {
    stopAutoAdvance();
    if (!originalCount || !cardStep) {
      log(
        "startAutoAdvance aborted: originalCount or cardStep zero",
        originalCount,
        cardStep
      );
      return;
    }

    intervalId = setInterval(() => {
      if (isHovered) return;
      currentIndex++;
      slideToIndex(currentIndex);

      if (currentIndex >= originalCount) {
        // after scroll completes, jump back to equivalent index silently
        setTimeout(() => {
          currentIndex = currentIndex - originalCount;
          container.scrollTo({
            left: currentIndex * cardStep,
            behavior: "auto",
          });
        }, options.smoothDurationMs + 20);
      }
    }, options.intervalSeconds * 1000);

    log("autoAdvance started", {
      intervalSeconds: options.intervalSeconds,
    });
  }

  function stopAutoAdvance() {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
      log("autoAdvance stopped");
    }
  }

  // Resize handler
  function handleResize() {
    stopAutoAdvance();
    if (cardStep) {
      const approximateIndex = Math.round(
        container.scrollLeft / Math.max(1, cardStep)
      );
      currentIndex = approximateIndex % (originalCount || 1);
    } else {
      currentIndex = 0;
    }

    setupClones();
    calculateCardStep();
    container.scrollTo({
      left: currentIndex * cardStep,
      behavior: "auto",
    });
    startAutoAdvance();
  }

  // Event listeners (scoped so we can remove them on destroy)
  function attachListeners() {
    container.addEventListener("mouseenter", onMouseEnter);
    container.addEventListener("mouseleave", onMouseLeave);
    container.addEventListener("touchstart", onTouchStart, {
      passive: true,
    });
    container.addEventListener("touchend", onTouchEnd, { passive: true });
    container.addEventListener("touchcancel", onTouchEnd, {
      passive: true,
    });
    window.addEventListener("resize", onWindowResize);
    log("listeners attached");
  }

  function detachListeners() {
    container.removeEventListener("mouseenter", onMouseEnter);
    container.removeEventListener("mouseleave", onMouseLeave);
    container.removeEventListener("touchstart", onTouchStart);
    container.removeEventListener("touchend", onTouchEnd);
    container.removeEventListener("touchcancel", onTouchEnd);
    window.removeEventListener("resize", onWindowResize);
    log("listeners detached");
  }

  function onMouseEnter() {
    isHovered = true;
    stopAutoAdvance();
  }
  function onMouseLeave() {
    isHovered = false;
    startAutoAdvance();
  }
  function onTouchStart() {
    isHovered = true;
    stopAutoAdvance();
  }
  function onTouchEnd() {
    isHovered = false;
    startAutoAdvance();
  }
  function onWindowResize() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(handleResize, 120);
  }

  // Initialize (wait images, then measure and start)
  function init() {
    waitForImages()
      .then(() => {
        isImagesLoaded = true;
        const cards = container.querySelectorAll(cardSelector);
        originalCount = cards.length;
        if (!originalCount) {
          console.warn(
            "createAutoSlider: no cards found for selector",
            cardSelector
          );
          return;
        }

        setupClones();
        calculateCardStep();

        if (!cardStep) {
          console.warn(
            "createAutoSlider: cardStep calculated as 0 — check CSS/layout for",
            container
          );
          // still start listeners so user can debug and interact
          attachListeners();
          return;
        }

        container.scrollTo({ left: 0, behavior: "auto" });
        attachListeners();
        startAutoAdvance();
      })
      .catch((err) => {
        console.error("createAutoSlider: error waiting for images", err);
      });
  }

  // Public API
  function start() {
    startAutoAdvance();
  }
  function stop() {
    stopAutoAdvance();
  }
  function jumpTo(i) {
    currentIndex = i;
    slideToIndex(i);
  }
  function info() {
    return {
      currentIndex,
      cardStep,
      originalCount,
      isImagesLoaded,
      destroyed,
    };
  }
  function destroy() {
    destroyed = true;
    stopAutoAdvance();
    detachListeners();
    // remove clones appended during setup (assumes originals were first originalCount children)
    const children = Array.from(container.children);
    if (originalCount && children.length > originalCount) {
      for (let i = children.length - 1; i >= originalCount; i--) {
        container.removeChild(children[i]);
      }
    }
    log("destroyed");
  }

  // run init async (but within this call)
  init();

  return { start, stop, jumpTo, info, destroy };
}
