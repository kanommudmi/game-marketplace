import { Swiper, SwiperSlide } from "swiper/react";
import {
  Navigation,
  Pagination,
  Autoplay,
  EffectCoverflow,
} from "swiper/modules";
import { useSwiper } from "@/hooks/useSwiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";

const DEFAULT_IMAGES = [
  "https://res.cloudinary.com/dhggmrfe1/image/upload/v1768980922/New-TWN_e2s8hr.png",
  "https://res.cloudinary.com/dhggmrfe1/image/upload/v1768980921/New-DBL_pla1t7.png",
  "https://res.cloudinary.com/dhggmrfe1/image/upload/v1768980922/New-SGL_yvj3lb.png",
];

export default function SliderImage({
  images = DEFAULT_IMAGES,
  autoplayDelay = 3000,
  disableOnInteraction = false,
  pauseOnMouseEnter = true,
  onImageClick,
}) {
  const { onSwiper } = useSwiper();

  const imagesArray =
    typeof images[0] === "string"
      ? images.map((src) => ({ src, alt: "" }))
      : images;

  return (
    <section className="w-full mt-10">
      <div className="relative flex items-center justify-center">
        <button
          className="slider-prev absolute z-10 w-10 h-10 rounded-full border border-lime-400 text-lime-400 flex items-center justify-center hover:bg-lime-400 hover:text-black transition"
          style={{ left: "calc(40% - 360px)" }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        <Swiper
          modules={[Navigation, Pagination, Autoplay, EffectCoverflow]}
          effect="coverflow"
          centeredSlides={true}
          speed={800}
          coverflowEffect={{
            rotate: 0,
            stretch: -20,
            depth: 0,
            modifier: 1,
            slideShadows: true,
          }}
          navigation={{
            prevEl: ".slider-prev",
            nextEl: ".slider-next",
          }}
          pagination={{
            el: ".slider-pagination",
            clickable: true,
            bulletClass: "slider-pagination-bullet",
            bulletActiveClass: "slider-pagination-bullet-active",
          }}
          autoplay={{
            delay: autoplayDelay,
            disableOnInteraction,
            pauseOnMouseEnter,
          }}
          loop={true}
          className="w-full max-w-4xl mx-auto"
          onSwiper={onSwiper}
        >
          {imagesArray.map((image, index) => (
            <SwiperSlide key={index} className="w-auto">
              <img
                src={image.src}
                alt={image.alt || `Slide ${index + 1}`}
                className={`w-[80%] h-82 object-cover shadow-lg mx-auto transition-transform duration-500 hover:scale-105 ${
                  onImageClick ? "cursor-pointer" : ""
                }`}
                onClick={() => onImageClick?.(image, index)}
              />
            </SwiperSlide>
          ))}
        </Swiper>

        <button
          className="slider-next absolute z-10 w-10 h-10 rounded-full border border-lime-400 text-lime-400 flex items-center justify-center hover:bg-lime-400 hover:text-black transition"
          style={{ right: "calc(40% - 360px)" }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>

      <div className="slider-pagination flex justify-center gap-2 mt-4" />

      <style>{`
        .slider-pagination-bullet {
          width: 8px;
          height: 8px;
          background: #4a4a4a;
          border-radius: 50%;
          opacity: 0.5;
          transition: all 0.2s;
        }
        .slider-pagination-bullet-active {
          background: #a3e635;
          opacity: 1;
          width: 20px;
          border-radius: 4px;
        }
      `}</style>
    </section>
  );
}
