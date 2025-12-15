import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const StrategyPage = () => {
  const games = [
    {
      id: 1,
      title: "Cyberpunk 2077",
      price: 59.99,
      imageUrl: "https://placehold.co/300x400",
    },
    {
      id: 2,
      title: "GTA V",
      price: 29.99,
      imageUrl: "https://placehold.co/300x400",
    },
    {
      id: 3,
      title: "Far Cry 6",
      price: 49.99,
      imageUrl: "https://placehold.co/300x400",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0b0f1a] text-white p-10">
      <h1 className="text-2xl font-bold mb-6">Strategy</h1>

      <div className="grid grid-cols-4 gap-6">
        {games.map((game) => (
          <Card key={game.id} className="bg-black/40 border-none hover:scale-105 transition">
            <CardContent className="flex flex-col p-3 space-y-2">
              <img src={game.imageUrl} alt={game.title} className="rounded-lg" />
              <p className="font-semibold text-white">{game.title}</p>
              <p className="text-lime-400 text-sm">${game.price}</p>
              <Button className="w-full bg-lime-400 text-black">Add to Cart</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default StrategyPage;
