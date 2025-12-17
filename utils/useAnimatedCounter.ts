import { useEffect, useRef, useState } from "react";

export function useAnimatedCounter(target: number, duration = 400): number {
  const [value, setValue] = useState(target);
  const frameRef = useRef<number | null>(null);
  const startValueRef = useRef<number>(target);

  useEffect(() => {
    const startTime = performance.now();
    startValueRef.current = value;

    const animate = (time: number) => {
      const progress = Math.min((time - startTime) / duration, 1);
      const current = Math.round(
        startValueRef.current + (target - startValueRef.current) * progress
      );

      setValue(current);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      }
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [target, duration]);

  return value;
}
