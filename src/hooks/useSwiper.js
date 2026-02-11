import { useState, useEffect, useCallback, useRef } from "react";

export const useSwiper = (options = {}) => {
  const [swiperInstance, setSwiperInstance] = useState(null);
  const optionsRef = useRef(options);

  useEffect(() => {
    optionsRef.current = options;
  }, [options]);

  const handleSwiperInit = useCallback((swiper) => {
    setSwiperInstance(swiper);
  }, []);

  useEffect(() => {
    return () => {
      if (swiperInstance) {
        swiperInstance.destroy(true, true);
      }
    };
  }, [swiperInstance]);

  const defaultOptions = {
    slidesPerView: "auto",
    spaceBetween: 16,
    centeredSlides: true,
    grabCursor: true,
    keyboard: true,
    mousewheel: { forceToAxis: true },
    ...options,
  };

  return {
    swiper: swiperInstance,
    onSwiper: handleSwiperInit,
    swiperParams: defaultOptions,
  };
};
