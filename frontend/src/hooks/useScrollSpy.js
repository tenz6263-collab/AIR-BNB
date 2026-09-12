import { useEffect, useState } from 'react';

/**
 * Tracks which section is currently at the top of the viewport and whether
 * the hero gallery has scrolled out (which reveals the sticky section nav).
 */
export function useScrollSpy(sectionIds, { heroRef, offset = 100 }) {
  const [active, setActive] = useState(sectionIds[0]);
  const [showNav, setShowNav] = useState(false);

  useEffect(() => {
    let ticking = false;
    const update = () => {
      ticking = false;
      if (heroRef.current) {
        setShowNav(heroRef.current.getBoundingClientRect().bottom <= 20);
      }
      let current = sectionIds[0];
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= offset) current = id;
      }
      setActive(current);
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [sectionIds, heroRef, offset]);

  return { active, showNav };
}
