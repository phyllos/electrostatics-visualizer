import {
  useEffect,
  useRef,
  useState,
} from "react";

// Use screen pixels for SVG text instead of shrinking a fixed-width viewBox.
export function useElementWidth(
  initialWidth = 500,
) {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] =
    useState(initialWidth);

  useEffect(() => {
    const element = ref.current;

    if (!element) {
      return;
    }

    const observer = new ResizeObserver(
      ([entry]) => {
        // A mobile tab may temporarily hide the element.
        if (entry.contentRect.width > 0) {
          setWidth(entry.contentRect.width);
        }
      },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, []);

  return {
    ref,
    width,
  };
}
