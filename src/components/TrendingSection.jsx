import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const TrendingSection = () => {
  const games = ["MW II", "Need for Speed", "Far Cry 5", "FC24", "Cyberpunk 2077", "GTA V"];

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Trending</h2>
        <Button variant="link" className="text-lime-400">
          Explore All
        </Button>
      </div>

      <div className="grid grid-cols-6 gap-4">
        {games.map((game) => (
          <Card key={game} className="bg-black/40 border-none hover:scale-105 transition">
            <CardContent className="p-2 space-y-2">
              <div className="h-40 rounded-lg bg-linear-to-br from-slate-700 to-slate-900" />
              <p className="text-white text-sm font-medium">{game}</p>
              <p className="text-xs text-lime-400">FREE / $59.99</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default TrendingSection;