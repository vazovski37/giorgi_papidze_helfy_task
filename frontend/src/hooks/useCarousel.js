import { useCallback, useEffect, useRef, useState } from 'react';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

const SCROLL_SPEED = 45;
const MANUAL_EASING = 0.12;
const MAX_FRAME_MS = 50;
const FALLBACK_CARD_STEP = 300;

export function useCarousel(tasks) {
  const viewportRef = useRef(null);
  const trackRef = useRef(null);

  const offsetRef = useRef(0);
  const setWidthRef = useRef(0);
  const manualRef = useRef(0);
  const hoveredRef = useRef(false);
  const pausedRef = useRef(false);
  const rafRef = useRef(null);
  const lastTsRef = useRef(null);
  const reducedMotionRef = useRef(false);

  const [copies, setCopies] = useState(2);
  const copiesRef = useRef(copies);
  copiesRef.current = copies;

  const [isPaused, setIsPaused] = useState(false);

  const prefersReducedMotion = usePrefersReducedMotion();
  useEffect(() => {
    reducedMotionRef.current = prefersReducedMotion;
    if (prefersReducedMotion) {
      pausedRef.current = true;
      setIsPaused(true);
    }
  }, [prefersReducedMotion]);

  const measure = useCallback(() => {
    const track = trackRef.current;
    const viewport = viewportRef.current;
    if (!track || !viewport || tasks.length === 0) return;

    const first = track.children[0];
    const secondCopyStart = track.children[tasks.length];
    if (!first || !secondCopyStart) return;

    const period = secondCopyStart.offsetLeft - first.offsetLeft;
    if (period > 0) {
      setWidthRef.current = period;
      const needed = Math.max(2, Math.ceil(viewport.clientWidth / period) + 1);
      if (needed !== copiesRef.current) setCopies(needed);
    }
  }, [tasks.length]);

  useEffect(() => {
    measure();
    const viewport = viewportRef.current;
    if (!viewport) return undefined;

    const observer = new ResizeObserver(() => {
      window.requestAnimationFrame(measure);
    });
    observer.observe(viewport);
    return () => observer.disconnect();
  }, [measure]);

  useEffect(() => {
    if (tasks.length === 0) return undefined;

    const step = (ts) => {
      if (lastTsRef.current === null) lastTsRef.current = ts;
      const dt = Math.min(ts - lastTsRef.current, MAX_FRAME_MS);
      lastTsRef.current = ts;

      let delta = 0;
      if (!pausedRef.current && !hoveredRef.current && !reducedMotionRef.current) {
        delta += (SCROLL_SPEED * dt) / 1000;
      }
      if (Math.abs(manualRef.current) > 0.5) {
        const move = manualRef.current * MANUAL_EASING;
        delta += move;
        manualRef.current -= move;
      } else {
        manualRef.current = 0;
      }

      const setWidth = setWidthRef.current;
      if (setWidth > 0) {
        offsetRef.current += delta;
        offsetRef.current = ((offsetRef.current % setWidth) + setWidth) % setWidth;
        if (trackRef.current) {
          trackRef.current.style.transform = `translate3d(${-offsetRef.current}px, 0, 0)`;
        }
      }

      rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      lastTsRef.current = null;
    };
  }, [tasks.length]);

  const cardStep = () => {
    const track = trackRef.current;
    const card = track && track.querySelector('.task-item');
    if (!card) return FALLBACK_CARD_STEP;
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    return card.getBoundingClientRect().width + gap;
  };

  const goNext = () => {
    const step = cardStep();
    manualRef.current = Math.min(manualRef.current + step, step * 2);
  };
  const goPrev = () => {
    const step = cardStep();
    manualRef.current = Math.max(manualRef.current - step, -step * 2);
  };
  const togglePlay = () => {
    pausedRef.current = !pausedRef.current;
    setIsPaused(pausedRef.current);
  };

  const viewportHandlers = {
    onMouseEnter: () => {
      hoveredRef.current = true;
    },
    onMouseLeave: () => {
      hoveredRef.current = false;
    },
    onFocusCapture: () => {
      hoveredRef.current = true;
    },
    onBlurCapture: () => {
      hoveredRef.current = false;
    },
  };

  return {
    viewportRef,
    trackRef,
    copies,
    isPaused,
    goPrev,
    goNext,
    togglePlay,
    viewportHandlers,
  };
}