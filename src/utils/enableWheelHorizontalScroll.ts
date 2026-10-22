/*
 * Lets the mouse wheel scroll wide tables / panels sideways.
 *
 * Over a horizontally scrollable area the wheel moves it left/right while it
 * can still move that way; once it reaches an edge (or the area is not wide
 * enough) the wheel scrolls the page normally. Holding Ctrl keeps the browser
 * zoom, and areas that also scroll vertically (dropdown lists, modals) are
 * left alone.
 */

const canScrollX = (el: HTMLElement) => {
  const { overflowX } = getComputedStyle(el);

  return (
    (overflowX === "auto" || overflowX === "scroll") &&
    el.scrollWidth > el.clientWidth + 1
  );
};

const canScrollY = (el: HTMLElement) => {
  const { overflowY } = getComputedStyle(el);

  return (
    (overflowY === "auto" || overflowY === "scroll") &&
    el.scrollHeight > el.clientHeight + 1
  );
};

export function enableWheelHorizontalScroll() {
  const onWheel = (event: WheelEvent) => {
    if (event.ctrlKey || event.defaultPrevented) return;

    // Already a sideways gesture (trackpad / shift+wheel): browser handles it
    if (Math.abs(event.deltaX) >= Math.abs(event.deltaY)) return;

    let el = event.target as HTMLElement | null;

    while (el && el !== document.body) {
      if (el instanceof HTMLElement) {
        if (canScrollY(el)) return;

        if (canScrollX(el)) {
          const max = el.scrollWidth - el.clientWidth;
          const goingRight = event.deltaY > 0;

          const atEdge = goingRight
            ? el.scrollLeft >= max - 1
            : el.scrollLeft <= 0;

          if (!atEdge) {
            event.preventDefault();
            el.scrollLeft += event.deltaY;
          }

          return;
        }
      }

      el = el.parentElement;
    }
  };

  // passive:false so preventDefault can stop the page from scrolling too
  window.addEventListener("wheel", onWheel, { passive: false });

  return () => window.removeEventListener("wheel", onWheel);
}
