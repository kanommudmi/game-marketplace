import { useNavigate } from "react-router-dom";
import { useGames } from "@/context/GamesContext";
import SliderImage from "@/components/SliderImage";
import { Loader2 } from "lucide-react";

const TrendingSection = () => {
  const navigate = useNavigate();
  const { games, loading } = useGames();

  // Featured trending games by ID
  const trendingGames = games.filter((game) =>
    [101, 102, 103, 11, 1, 2].includes(game.id),
  );

  const trendingImages = trendingGames.map((game) => ({
    src: game.imageUrl,
    alt: game.title,
  }));

  const handleImageClick = (image, index) => {
    navigate(`/product/${trendingGames[index].id}`);
  };

  if (loading) {
    return (
      <section className="w-full border border-gray-700/30 bg-[#151924] p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Trending</h2>
        </div>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-white/50" />
        </div>
      </section>
    );
  }

  return (
    <section className="w-full border border-gray-700/30 bg-[#151924] p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Trending</h2>
      </div>

      {trendingGames.length > 0 ? (
        <SliderImage
          images={trendingImages}
          autoplayDelay={3000}
          disableOnInteraction={false}
          pauseOnMouseEnter={true}
          onImageClick={handleImageClick}
        />
      ) : (
        <div className="flex items-center justify-center h-64 bg-black/20 border border-gray-700/30">
          <p className="text-gray-400">No trending games available</p>
        </div>
      )}
    </section>
  );
};

export default TrendingSection;
