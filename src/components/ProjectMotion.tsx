"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function ProjectMotion() {
  const pathname = usePathname();

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!window.IntersectionObserver) return;

    const tracked = new WeakSet<Element>();
    const active = new Set<Animation>();
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(({ target, isIntersecting }) => {
        if (!isIntersecting) return;
        observer.unobserve(target);
        if (preference.matches) return;

        const card = target.matches(".character-card, .pokedex-card");
        const siblings = Array.from(target.parentElement?.children || []);
        const index = card ? siblings.indexOf(target) : 0;
        const animation = target.animate(
          [
            { opacity: 0, transform: `translateY(${card ? 18 : 12}px)` },
            { opacity: 1, transform: "translateY(0)" },
          ],
          {
            duration: card ? 580 : 680,
            delay: card ? (index % 4) * 55 : 0,
            easing: "cubic-bezier(.22, 1, .36, 1)",
            fill: "backwards",
          },
        );
        active.add(animation);
        animation.onfinish = () => active.delete(animation);
        animation.oncancel = () => active.delete(animation);
      });
    }, { threshold: 0.08 });

    const selector = [
      ".character-card", ".pokedex-card", ".archive-filters",
      ".archive-location", ".archive-episodes", ".archive-detail-grid",
      ".dex-detail-grid", ".pokedex-status", ".archive-empty",
    ].join(",");
    function observe() {
      document.querySelectorAll(selector).forEach((element) => {
        if (tracked.has(element)) return;
        tracked.add(element);
        observer.observe(element);
      });
    }
    function stop() {
      if (preference.matches) active.forEach(animation => animation.cancel());
    }
    observe();
    const changes = new MutationObserver(observe);
    changes.observe(document.body, { childList: true, subtree: true });
    preference.addEventListener("change", stop);
    return () => {
      observer.disconnect();
      changes.disconnect();
      preference.removeEventListener("change", stop);
      active.forEach(animation => animation.cancel());
    };
  }, [pathname]);

  return null;
}
