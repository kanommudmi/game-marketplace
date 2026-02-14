import { Button } from "@/components/ui/button";
import { Bell, MessageCircle, Users, Gamepad2 } from "lucide-react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <aside className="w-20 flex flex-col items-center gap-6 py-6 border-r border-gray-700/30 bg-[#0f1420]/50 h-full">
      <Link to="/ratings">
        <Button size="icon" variant="ghost" className="hover:bg-white/10 transition-all rounded-xl">
          🔥
        </Button>
      </Link>
      <Link to="/checkout">
        <Button size="icon" variant="ghost" className="hover:bg-white/10 transition-all rounded-xl">
          🛒
        </Button>
      </Link>
      <Link to="/profile">
        <Button size="icon" variant="ghost" className="hover:bg-white/10 transition-all rounded-xl">
          ⚙️
        </Button>
      </Link>
    </aside>
  );
};

export default Sidebar;
