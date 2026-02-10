import { Button } from "@/components/ui/button";
import { Bell, MessageCircle, Users, Gamepad2 } from "lucide-react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <aside className="w-20 flex flex-col items-center gap-6 py-6 bg-black/30">
      <Link to="/">
        <Button size="icon" className="bg-lime-400 text-black">
          <Gamepad2 />
        </Button>
      </Link>
      <Link to="/">
        <Button size="icon" variant="ghost">
          🏠
        </Button>
      </Link>
      <Button size="icon" variant="ghost">
        🔥
      </Button>
      <Link to="/checkout">
        <Button size="icon" variant="ghost">
          🛒
        </Button>
      </Link>
      <Link to="/profile">
        <Button size="icon" variant="ghost">
          ⚙️
        </Button>
      </Link>
    </aside>
  );
};

export default Sidebar;
