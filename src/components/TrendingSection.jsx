import { useCart } from "@/context/CartContext";
import { useNavigate } from "react-router-dom";
import { allProducts } from "@/mockdata/games";
import SliderImage from "@/components/SliderImage";

const TrendingSection = () => {
  const navigate = useNavigate();

  const trendingGames = allProducts.filter((game) =>
    [101, 102, 103, 11, 1, 2].includes(game.id),
  );

  const trendingImages = trendingGames.map((game) => ({
    src: game.imageUrl,
    alt: game.title,
  }));

  const handleImageClick = (image, index) => {
    navigate(`/product/${trendingGames[index].id}`);
  };

  return (
    <section className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Trending</h2>
      </div>

      <SliderImage
        images={trendingImages}
        autoplayDelay={3000}
        disableOnInteraction={false}
        pauseOnMouseEnter={true}
        onImageClick={handleImageClick}
      />
    </section>
  );
};

export default TrendingSection;
