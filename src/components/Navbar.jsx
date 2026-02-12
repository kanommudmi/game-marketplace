import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bell, MessageCircle, User, Gamepad2, ShoppingCart, LogIn, Menu, X, Search } from "lucide-react"; // Added Menu and X
import { useCart } from "@/context/CartContext";
import { useUser } from "@/context/UserContext";
import { useState, useEffect, useRef } from "react";
import Cart from "./Cart";
import ThemeToggle from "./ThemeToggle";
import { allProducts } from "@/mockdata/games";

export function Navbar() {
  const navigate = useNavigate();
  const { cart } = useCart();
  const { user } = useUser();
  const [showCart, setShowCart] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false); // New state for mobile menu
  const [currency, setCurrency] = useState("USD");
  const [exchangeRate, setExchangeRate] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const cartRef = useRef(null);

  // Search State
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const searchRef = useRef(null);

  const walletBalance = user?.walletBalance || 0;

  // Search Logic
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setSearchResults([]);
      return;
    }

    const results = allProducts.filter((product) =>
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setSearchResults(results.slice(0, 5));
  }, [searchTerm]);

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchResults([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleResultClick = (id) => {
    navigate(`/product/${id}`);
    setSearchTerm("");
    setSearchResults([]);
    setShowMobileMenu(false);
  };

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
    const interval = setInterval(fetchExchangeRate, 300000);
    return () => clearInterval(interval);
  }, []);

  // Close cart when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cartRef.current && !cartRef.current.contains(event.target)) {
        setShowCart(false);
      }
    };

    if (showCart) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showCart]);

  const toggleCurrency = () => {
    setCurrency(prev => prev === "USD" ? "THB" : "USD");
  };

  const usdAmount = walletBalance;
  const thbAmount = exchangeRate ? (walletBalance * exchangeRate) : null;

  const displayText = currency === "USD"
    ? `$ ${usdAmount.toFixed(2)} USD`
    : thbAmount
      ? `฿ ${thbAmount.toFixed(2)} THB`
      : '฿ Loading...';

  return (
    <>
      <div className="bg-linear-to-br from-[#0b0f1a] to-[#141a2a] text-white">
        <nav className="flex items-center justify-between px-4 py-3 md:px-8 md:py-4"> {/* Adjusted padding for mobile */}
          {/* Left side: Logo and Search */}
          <div className="flex items-center gap-4">
            <Link to="/">
              <div className="flex items-center gap-3">
                <Gamepad2 className="text-lime-400" />
              </div>
            </Link>
            {/* Search Input - Desktop */}
            <div className="relative hidden md:block w-72" ref={searchRef}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Search games..."
                  className="w-full bg-black/40 border-none text-sm pl-10 focus:ring-1 focus:ring-lime-400"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={() => {
                    if (searchTerm) {
                      const results = allProducts.filter((product) =>
                        product.title.toLowerCase().includes(searchTerm.toLowerCase())
                      );
                      setSearchResults(results.slice(0, 5));
                    }
                  }}
                />
              </div>

              {/* Search Results Dropdown */}
              {searchResults.length > 0 && (
                <div className="absolute top-full left-0 w-full bg-[#151921] border border-white/10 rounded-b-sm mt-1 shadow-xl overflow-hidden z-50">
                  {searchResults.map((game) => (
                    <div
                      key={game.id}
                      className="flex items-center gap-3 p-3 hover:bg-white/5 cursor-pointer transition-colors border-b border-white/5 last:border-none"
                      onClick={() => handleResultClick(game.id)}
                    >
                      <img
                        src={game.imageUrl}
                        alt={game.title}
                        className="w-10 h-12 object-cover rounded-sm"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-white truncate">
                          {game.title}
                        </h4>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-400">
                            {game.category}
                          </span>
                          <span className="text-xs text-lime-400 bg-lime-400/10 px-1 rounded-sm">
                            ★ {game.rating}
                          </span>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-lime-400 whitespace-nowrap">
                        {game.isFree ? "Free" : `$${game.price}`}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Hamburger menu icon - visible on mobile, hidden on md+ */}
          <div className="md:hidden flex items-center">
            <Button size="icon" variant="ghost" onClick={() => setShowMobileMenu(!showMobileMenu)}>
              {showMobileMenu ? <X /> : <Menu />}
            </Button>
          </div>

          {/* Right side: Controls and Icons (Desktop) */}
          <div className="hidden md:flex items-center gap-3">
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
            <div className="relative" ref={cartRef}>
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

        {/* Mobile Menu (visible when showMobileMenu is true) */}
        {showMobileMenu && (
          <div className="md:hidden bg-linear-to-br from-[#0b0f1a] to-[#141a2a] p-4 space-y-4 flex flex-col items-center">
            {/* Search Input for Mobile */}
            <Input placeholder="Search" className="w-full bg-black/40 border-none text-sm" />
            <ThemeToggle />
            <Button
              onClick={toggleCurrency}
              className="bg-lime-400 text-black font-semibold w-full"
            >
              {displayText}
            </Button>
            <Link to="/login" className="w-full">
              <Button variant="secondary" className="w-full">
                <LogIn className="mr-2" /> Login
              </Button>
            </Link>
            <Link to="/profile" className="w-full">
              <Button variant="secondary" className="w-full">
                <User className="mr-2" /> Profile
              </Button>
            </Link>
            <Button variant="secondary" className="w-full">
              <MessageCircle className="mr-2" /> Messages
            </Button>
            <Button variant="secondary" className="w-full">
              <Bell className="mr-2" /> Notifications
            </Button>
            {/* Cart Button for Mobile Menu */}
            <div className="relative w-full" ref={cartRef}>
              <Button
                variant="secondary"
                onClick={() => setShowCart(!showCart)}
                className="relative w-full"
              >
                <ShoppingCart className="mr-2" /> Cart
                {cart.length > 0 && (
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 bg-lime-400 text-black text-xs w-5 h-5 rounded-sm flex items-center justify-center font-bold">
                    {cart.length}
                  </span>
                )}
              </Button>
              {showCart && (
                <div className="absolute left-0 right-0 top-full mt-2 z-50">
                  <div className="bg-black/90 rounded-sm p-2">
                    <Cart />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
