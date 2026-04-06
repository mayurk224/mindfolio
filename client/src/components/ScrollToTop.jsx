import React, { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

/**
 * ScrollToTop
 *
 * Props:
 *   scrollContainerRef – React ref pointing to the scrollable element.
 *                        Falls back to window scrolling if omitted.
 *   threshold          – px from top before the button appears (default 300).
 */
const ScrollToTop = ({ scrollContainerRef, threshold = 300 }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const container = scrollContainerRef?.current;

    const handleScroll = () => {
      const scrollTop = container ? container.scrollTop : window.scrollY;
      setVisible(scrollTop > threshold);
    };

    const target = container || window;
    target.addEventListener("scroll", handleScroll, { passive: true });
    return () => target.removeEventListener("scroll", handleScroll);
  }, [scrollContainerRef, threshold]);

  const scrollToTop = () => {
    const container = scrollContainerRef?.current;
    if (container) {
      container.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <>
      <style>{`
        .stt-btn {
          --stt-size: 44px;
          position: fixed;
          bottom: 5.5rem;   /* sits just above the "Add Item" FAB */
          right: 1.25rem;
          z-index: 60;
          width: var(--stt-size);
          height: var(--stt-size);
          border-radius: 50%;
          border: 1.5px solid hsl(var(--border));
          background: oklch(0.432 0.095 166.913);
          color: hsl(var(--foreground));
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          outline: none;
          /* entrance / exit */
          opacity: 0;
          transform: translateY(12px) scale(0.85);
          pointer-events: none;
          transition:
            opacity 0.25s ease,
            transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1),
            background 0.15s ease,
            box-shadow 0.15s ease;
        }
        .stt-btn.stt-visible {
          opacity: 1;
          transform: translateY(0) scale(1);
          pointer-events: auto;
        }
        .stt-btn:active {
          transform: scale(0.95);
        }
        .stt-btn svg {
          transition: transform 0.2s ease;
        }
        .stt-btn:hover svg {
          transform: translateY(-2px);
        }
        /* Subtle ring on focus-visible for accessibility */
        .stt-btn:focus-visible {
          outline: 2px solid hsl(var(--primary));
          outline-offset: 3px;
        }
      `}</style>

      <button
        id="scroll-to-top-btn"
        aria-label="Scroll to top"
        title="Back to top"
        className={`stt-btn${visible ? " stt-visible" : ""}`}
        onClick={scrollToTop}
      >
        <ArrowUp size={18} strokeWidth={2.2} />
      </button>
    </>
  );
};

export default ScrollToTop;
