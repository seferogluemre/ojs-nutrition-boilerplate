import { useEffect, useRef } from "react";
import BlazeSlider, { BlazeConfig } from "blaze-slider";

export function useBlazeSlider(config?: BlazeConfig) {
  const sliderRef = useRef<BlazeSlider | null>(null);
  const sliderElRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      !sliderRef.current &&
      !!sliderElRef.current
    ) {
      const blazeSlider = new BlazeSlider(sliderElRef.current, config);
      sliderRef.current = blazeSlider;
    }

    return () => {
      if (sliderRef.current) {
        sliderRef.current.destroy();
        sliderRef.current = null;
      }
    };
  }, [config]);

  const prev = () => {
    if (sliderRef.current) {
      sliderRef.current.prev();
    }
  };

  const next = () => {
    if (sliderRef.current) {
      sliderRef.current.next();
    }
  };

  return { sliderRef, sliderElRef, prev, next };
} 