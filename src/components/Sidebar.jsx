import { Button } from "@/components/ui/button";
import { Bell, MessageCircle, Users, Gamepad2 } from "lucide-react";

const Sidebar = () => {
  return (
    <aside className="w-20 flex flex-col items-center gap-6 py-6 bg-black/30">
      <Button size="icon" className="bg-lime-400 text-black">
        <Gamepad2 />
      </Button>
      <Button size="icon" variant="ghost">
        🏠
      </Button>
      <Button size="icon" variant="ghost">
        🔥
      </Button>
      <Button size="icon" variant="ghost">
        🛒
      </Button>
      <Button size="icon" variant="ghost">
        ⚙️
      </Button>
    </aside>
  );
};

export default Sidebar;
