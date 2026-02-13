import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCart } from "@/context/CartContext";
import { useGames } from "@/context/GamesContext";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

const ShootingPage = () => {
  const { addToCart } = useCart();
  const { getGamesByCategory, loading } = useGames();
  const navigate = useNavigate();

  const games = getGamesByCategory("shooting");

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0f1a] text-white p-10 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-lime-400" />
        <span className="ml-2">Loading games...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0f1a] text-white p-10">
      <h1 className="text-2xl font-bold mb-6">Shooting</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {games.map((game) => (
          <Card
            key={game.id}
            className="bg-black/40 border-none hover:scale-105 transition cursor-pointer"
            onClick={() => navigate(`/product/${game.id}`)}
          >
            <CardContent className="flex flex-col p-3 space-y-2">
              <img src={game.imageUrl} alt={game.title} className="rounded-sm" />
              <p className="font-semibold text-white">{game.title}</p>
              <p className="text-lime-400 text-sm">${game.price}</p>
              <div className="flex gap-2">
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(game);
                  }}
                  className="flex-1 bg-lime-400 text-black text-sm"
                >
                  Add to Cart
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {games.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400">No shooting games available.</p>
        </div>
      )}
    </div>
  );
};

export default ShootingPage;
