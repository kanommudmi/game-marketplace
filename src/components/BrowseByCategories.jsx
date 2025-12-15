import { Button } from "@/components/ui/button";
import { Bell, MessageCircle, Users, Gamepad2 } from "lucide-react";
import ActionCategory from "./categories/ActionCategory";
import RacingCategory from "./categories/RacingCategory";
import SportsCategory from "./categories/SportsCategory";
import RPGCategory from "./categories/RPGCategory";
import StrategyCategory from "./categories/StrategyCategory";
import ShootingCategory from "./categories/ShootingCategory";
import { Link } from "react-router-dom";

const BrowseByCategories = () => {
  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Browse By Categories</h3>
        <Button variant="link" className="text-lime-400">
          Explore All
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Link to="/category/action">
          <ActionCategory />
        </Link>
        <Link to="/category/racing">
          <RacingCategory />
        </Link>
        <Link to="/category/sports">
          <SportsCategory />
        </Link>
        <Link to="/category/rpg">
          <RPGCategory />
        </Link>
        <Link to="/category/strategy">
          <StrategyCategory />
        </Link>
        <Link to="/category/shooting">
          <ShootingCategory />
        </Link>
      </div>
    </section>
  );
};

export default BrowseByCategories;
