import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bell, MessageCircle, Users, Wallet, Gamepad2, ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useState } from "react";
import Cart from "./Cart";

export function Navbar() {
  const { cart } = useCart();
  const [showCart, setShowCart] = useState(false);

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
            <div className="relative">
              <Button 
                size="icon" 
                variant="secondary" 
                onClick={() => setShowCart(!showCart)}
                className="relative"
              >
                <ShoppingCart />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-lime-400 text-black text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                    {cart.length}
                  </span>
                )}
              </Button>
              {showCart && (
                <div className="absolute right-0 top-12 z-50">
                  <div className="bg-black/90 rounded-lg p-2">
                    <Cart />
                  </div>
                </div>
              )}
            </div>
          </div>
        </nav>
      </div>
    </>
  );
}
