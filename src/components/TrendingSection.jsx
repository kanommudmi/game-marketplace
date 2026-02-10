import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { useNavigate } from "react-router-dom";
import { allProducts } from "@/mockdata/games";

const TrendingSection = () => {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const trendingGames = allProducts.filter((game) => 
    [101, 102, 103, 11, 1, 2].includes(game.id)
  );

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Trending</h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {trendingGames.map((game) => (
          <Card key={game.id} className="bg-black/40 border-none hover:scale-105 transition cursor-pointer" onClick={() => navigate(`/product/${game.id}`)}>
            <CardContent className="flex flex-col p-2 space-y-2">
              <img src={game.imageUrl} alt={game.title} className="h-40 rounded-sm object-cover" />
              <p className="text-white text-sm font-medium">{game.title}</p>
              <p className="text-xs text-lime-400">${game.price}</p>
              <Button onClick={(e) => { e.stopPropagation(); addToCart(game); }} className="w-full bg-lime-400 text-black text-xs">Add to Cart</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default TrendingSection;