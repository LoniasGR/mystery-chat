import { useEffect, useRef } from "react";

export function useIntersectionObserver<T extends Element = Element>(
  callback: () => void
) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        callback();
      }
    });

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [callback]);

  return ref;
}
