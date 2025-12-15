import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bell, MessageCircle, Users, Wallet, Gamepad2 } from "lucide-react";

export function Navbar() {
  return (
    <>
      <div className="bg-linear-to-br from-[#0b0f1a] to-[#141a2a] text-white">
        <nav className="flex items-center justify-between px-8 py-4">
          <div className="flex items-center gap-4">
            <Link to="/">
              <div className="flex items-center gap-3">
                <Gamepad2 className="text-lime-400" />
              </div>
            </Link>
            <Input placeholder="Search" className="w-72 bg-black/40 border-none text-sm" />
          </div>
          <div className="flex items-center gap-3">
            <Button className="bg-lime-400 text-black font-semibold">$ 5.49 USD</Button>
            <Button size="icon" variant="secondary">
              <Users />
            </Button>
            <Button size="icon" variant="secondary">
              <MessageCircle />
            </Button>
            <Button size="icon" variant="secondary">
              <Bell />
            </Button>
          </div>
        </nav>
      </div>
    </>
  );
}
