import { useEffect, useRef, useState } from "react";

export function useIntersectionObserver<T extends Element = Element>(
  callback: () => void
) {
  const ref = useRef<T | null>(null);
  const latestCallbackRef = useRef(callback);
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    latestCallbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (isIntersecting) {
      latestCallbackRef.current();
    }
  }, [isIntersecting]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      setIsIntersecting(entries[0].isIntersecting);
    });

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [callback]);

  return ref;
}
