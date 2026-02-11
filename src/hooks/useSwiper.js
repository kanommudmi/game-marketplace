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

  useEffect(() => {
    if (swiperInstance) {
      swiperInstance.update();
    }
  }, [options, swiperInstance]);

  const defaultOptions = {
    slidesPerView: 2,
    spaceBetween: 16,
    breakpoints: {
      640: { slidesPerView: 3 },
      768: { slidesPerView: 4 },
    },
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
