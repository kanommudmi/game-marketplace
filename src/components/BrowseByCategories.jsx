import ActionCategory from "./categories/ActionCategory";
import RacingCategory from "./categories/RacingCategory";
import SportsCategory from "./categories/SportsCategory";
import RPGCategory from "./categories/RPGCategory";
import StrategyCategory from "./categories/StrategyCategory";
import ShootingCategory from "./categories/ShootingCategory";
import { Link } from "react-router-dom";

const BrowseByCategories = () => {
  return (
    <section className="border border-gray-700/30 bg-[#151924] p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Browse By Categories</h3>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
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
