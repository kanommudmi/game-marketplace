import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bell, MessageCircle, Users, Wallet, Gamepad2 } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import TrendingSection from "../components/TrendingSection";
import BrowseByCategories from "@/components/BrowseByCategories";
import Cart from "@/components/Cart";

export default function LandingPage() {
  const [cartItems, setCartItems] = useState([]);

  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <>
      <div className="min-h-screen bg-linear-to-br from-[#0b0f1a] to-[#141a2a] text-white">
        <div className="flex flex-col md:flex-row">
          <div className="hidden md:flex">
            <Sidebar />
          </div>

          <section className="flex-1 p-4 md:p-8 space-y-10 w-full">
            <TrendingSection />
            <BrowseByCategories />
          </section>

          <div className="hidden md:block p-4 md:p-6">
            <Cart items={cartItems} onRemove={removeFromCart} />
          </div>
        </div>
      </div>
    </>
  );
}
