"use client";

import { useEffect } from "react";

const REVEAL_THRESHOLD = 0.15;
const MAX_STAGGER_MS = 350;

export function useScrollReveal() {
  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion || !("IntersectionObserver" in window)) return;

    const targets = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]")
    );
    document.querySelectorAll<HTMLElement>("[data-reveal-stagger]").forEach((group) => {
      Array.from(group.children)
        .filter(
          (child): child is HTMLElement =>
            child instanceof HTMLElement && child.hasAttribute("data-reveal")
        )
        .forEach((child, index) => {
          child.style.setProperty(
            "--reveal-delay",
            `${Math.min(index * 70, MAX_STAGGER_MS)}ms`
          );
        });
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!(entry.target instanceof HTMLElement)) return;
          entry.target.classList.toggle(
            "is-visible",
            entry.isIntersecting && entry.intersectionRatio >= REVEAL_THRESHOLD
          );
        });
      },
      { threshold: REVEAL_THRESHOLD }
    );

    targets.forEach((target) => {
      const bounds = target.getBoundingClientRect();
      if (bounds.top < window.innerHeight && bounds.bottom > 0) {
        target.classList.add("is-visible");
      }
      observer.observe(target);
    });

    document.documentElement.classList.add("reveal-ready");

    return () => {
      observer.disconnect();
      document.documentElement.classList.remove("reveal-ready");
    };
  }, []);
}
