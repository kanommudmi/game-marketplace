import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCart } from "@/context/CartContext";
import { useNavigate } from "react-router-dom";
import { allProducts } from "@/mockdata/games";

const ShootingPage = () => {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const games = allProducts.filter((game) => game.category === "shooting");

  return (
    <div className="min-h-screen bg-[#0b0f1a] text-white p-10">
      <h1 className="text-2xl font-bold mb-6">Shooing</h1>

      <div className="grid grid-cols-4 gap-6">
        {games.map((game) => (
          <Card key={game.id} className="bg-black/40 border-none hover:scale-105 transition cursor-pointer" onClick={() => navigate(`/product/${game.id}`)}>
            <CardContent className="flex flex-col p-3 space-y-2">
              <img src={game.imageUrl} alt={game.title} className="rounded-lg" />
              <p className="font-semibold text-white">{game.title}</p>
              <p className="text-lime-400 text-sm">${game.price}</p>
              <div className="flex gap-2">
                <Button onClick={(e) => { e.stopPropagation(); addToCart(game); }} className="flex-1 bg-lime-400 text-black text-sm">Add to Cart</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ShootingPage;
