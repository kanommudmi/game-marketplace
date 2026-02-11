import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { useNavigate } from "react-router-dom";
import { allProducts } from "@/mockdata/games";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Mousewheel, Keyboard, Autoplay } from "swiper/modules";
import { useSwiper } from "@/hooks/useSwiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const TrendingSection = () => {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const trendingGames = allProducts.filter((game) => 
    [101, 102, 103, 11, 1, 2].includes(game.id)
  );

  const { onSwiper, swiperParams } = useSwiper();

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Trending</h2>
        <div className="flex gap-2">
          <button className="trending-swiper-prev w-8 h-8 rounded-full border border-lime-400 text-lime-400 flex items-center justify-center hover:bg-lime-400 hover:text-black transition">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <button className="trending-swiper-next w-8 h-8 rounded-full border border-lime-400 text-lime-400 flex items-center justify-center hover:bg-lime-400 hover:text-black transition">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>
      </div>

      <Swiper
        {...swiperParams}
        modules={[Navigation, Pagination, Mousewheel, Keyboard, Autoplay]}
        navigation={{
          prevEl: '.trending-swiper-prev',
          nextEl: '.trending-swiper-next',
        }}
        pagination={{
          el: '.trending-swiper-pagination',
          clickable: true,
          bulletClass: 'trending-swiper-pagination-bullet',
          bulletActiveClass: 'trending-swiper-pagination-bullet-active',
        }}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        loop={true}
        className="trending-swiper"
        onSwiper={onSwiper}
      >
        {trendingGames.map((game) => (
          <SwiperSlide key={game.id}>
            <Card className="bg-black/40 border-none hover:scale-105 transition cursor-pointer" onClick={() => navigate(`/product/${game.id}`)}>
              <CardContent className="flex flex-col p-2 space-y-2">
                <img src={game.imageUrl} alt={game.title} className="h-40 rounded-sm object-cover" />
                <p className="text-white text-sm font-medium">{game.title}</p>
                <p className="text-xs text-lime-400">${game.price}</p>
                <Button onClick={(e) => { e.stopPropagation(); addToCart(game); }} className="w-full bg-lime-400 text-black text-xs">Add to Cart</Button>
              </CardContent>
            </Card>
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="trending-swiper-pagination flex justify-center gap-2 mt-4" />

      <style>{`
        .trending-swiper-pagination-bullet {
          width: 8px;
          height: 8px;
          background: #4a4a4a;
          border-radius: 50%;
          opacity: 0.5;
          transition: all 0.2s;
        }
        .trending-swiper-pagination-bullet-active {
          background: #a3e635;
          opacity: 1;
          width: 20px;
          border-radius: 4px;
        }
      `}</style>
    </section>
  );
};

export default TrendingSection;