import { useEffect, useRef, useState } from 'react';

// Scroll-triggered fade + slide-up. Wrap any element with <Reveal> and it
// stays invisible until it enters the viewport, then animates in once.
// Uses IntersectionObserver (native browser API — no library needed).
//
// Respects OS-level `prefers-reduced-motion`: if the user has that enabled,
// content renders immediately with no animation (accessibility baseline).
export default function Reveal({
  children,
  delay = 0,
  className = '',
  as: Tag = 'div',
}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Honor reduced-motion preference — skip the animation entirely.
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      setVisible(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}
