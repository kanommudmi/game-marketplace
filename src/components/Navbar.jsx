import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bell, MessageCircle, User, Gamepad2, ShoppingCart, LogIn } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useUser } from "@/context/UserContext";
import { useState, useEffect } from "react";
import Cart from "./Cart";
import ThemeToggle from "./ThemeToggle";

export function Navbar() {
  const { cart } = useCart();
  const { user } = useUser();
  const [showCart, setShowCart] = useState(false);
  const [currency, setCurrency] = useState("USD");
  const [exchangeRate, setExchangeRate] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  
  // Use real wallet balance from UserContext
  const walletBalance = user?.walletBalance || 0;

  const fetchExchangeRate = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
      const data = await response.json();
      if (data && data.rates && data.rates.THB) {
        setExchangeRate(data.rates.THB);
        setLastUpdated(new Date().toLocaleTimeString());
      }
    } catch (error) {
      console.error('Failed to fetch exchange rate:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchExchangeRate();
    
    // Refresh rate every 5 minutes
    const interval = setInterval(fetchExchangeRate, 300000);
    return () => clearInterval(interval);
  }, []);

  const toggleCurrency = () => {
    setCurrency(prev => prev === "USD" ? "THB" : "USD");
  };

  const usdAmount = walletBalance;
  const thbAmount = exchangeRate ? (walletBalance * exchangeRate) : null;
  
  // Always show USD immediately, THB only when rate is available
  const displayText = currency === "USD" 
    ? `$ ${usdAmount.toFixed(2)} USD`
    : thbAmount 
      ? `฿ ${thbAmount.toFixed(2)} THB`
      : '฿ Loading...';

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
            <ThemeToggle />
            <Button 
              onClick={toggleCurrency}
              className="bg-lime-400 text-black font-semibold min-w-[140px]"
            >
              {displayText}
            </Button>
            <Link to="/login">
              <Button size="icon" variant="secondary">
                <LogIn />
              </Button>
            </Link>
            <Link to="/profile">
              <Button size="icon" variant="secondary">
                <User />
              </Button>
            </Link>
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
                  <span className="absolute -top-1 -right-1 bg-lime-400 text-black text-xs w-5 h-5 rounded-sm flex items-center justify-center font-bold">
                    {cart.length}
                  </span>
                )}
              </Button>
              {showCart && (
                <div className="absolute right-0 top-12 z-50">
                  <div className="bg-black/90 rounded-sm p-2">
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
