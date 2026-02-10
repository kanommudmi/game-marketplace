import { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";
import { generateMockOrders } from "@/mockdata/user";

const UserContext = createContext();

const defaultUser = {
  id: "user_001",
  displayName: "GamerPro123",
  email: "gamer@example.com",
  avatarUrl: "https://placehold.co/150x150/lime/white?text=GP",
  bio: "Passionate gamer who loves RPGs and open-world adventures. Always looking for the next great game to explore!",
  joinDate: "2024-01-15",
  location: "United States",
  totalGamesOwned: 0,
  totalSpent: 0,
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("userProfile");
      return saved ? JSON.parse(saved) : defaultUser;
    }
    return defaultUser;
  });

  const [orders, setOrders] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("userOrders");
      return saved ? JSON.parse(saved) : generateMockOrders();
    }
    return generateMockOrders();
  });

  const [wishlist, setWishlist] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("userWishlist");
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  // Persist user data to localStorage
  useEffect(() => {
    localStorage.setItem("userProfile", JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem("userOrders", JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem("userWishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  const updateProfile = (updates) => {
    setUser((prev) => ({
      ...prev,
      ...updates,
    }));
    toast.success("Profile updated successfully!");
  };

  const addToWishlist = (game) => {
    setWishlist((prev) => {
      if (prev.find((item) => item.id === game.id)) {
        toast.info(`${game.title} is already in your wishlist`);
        return prev;
      }
      toast.success(`${game.title} added to wishlist`);
      return [...prev, game];
    });
  };

  const removeFromWishlist = (gameId) => {
    setWishlist((prev) => {
      const game = prev.find((item) => item.id === gameId);
      if (game) {
        toast.success(`${game.title} removed from wishlist`);
      }
      return prev.filter((item) => item.id !== gameId);
    });
  };

  const addOrder = (cartItems, total) => {
    const newOrder = {
      id: `ORD-${Date.now()}`,
      date: new Date().toISOString(),
      items: cartItems,
      total: total,
      status: "completed",
    };
    
    setOrders((prev) => [newOrder, ...prev]);
    
    // Update user stats
    setUser((prev) => ({
      ...prev,
      totalGamesOwned: prev.totalGamesOwned + cartItems.length,
      totalSpent: prev.totalSpent + total,
    }));
  };

  const isInWishlist = (gameId) => {
    return wishlist.some((item) => item.id === gameId);
  };

  const getOrderById = (orderId) => {
    return orders.find((order) => order.id === orderId);
  };

  const value = {
    user,
    orders,
    wishlist,
    updateProfile,
    addToWishlist,
    removeFromWishlist,
    addOrder,
    isInWishlist,
    getOrderById,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
