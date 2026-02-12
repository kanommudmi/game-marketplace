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
  walletBalance: 10.0,
  role: "user",
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(defaultUser);
  const [orders, setOrders] = useState([]);
  const [wishlist, setWishlist] = useState([]);

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

    // Update user stats and deduct from wallet
    setUser((prev) => ({
      ...prev,
      totalGamesOwned: prev.totalGamesOwned + cartItems.length,
      totalSpent: prev.totalSpent + total,
      walletBalance: prev.walletBalance - total,
    }));
  };

  const addToWallet = (amount) => {
    setUser((prev) => ({
      ...prev,
      walletBalance: prev.walletBalance + amount,
    }));
    toast.success(`$${amount.toFixed(2)} added to your wallet!`);
  };

  const deductFromWallet = (amount) => {
    setUser((prev) => {
      if (prev.walletBalance < amount) {
        toast.error("Insufficient funds in wallet");
        return prev;
      }
      return {
        ...prev,
        walletBalance: prev.walletBalance - amount,
      };
    });
  };

  const isInWishlist = (gameId) => {
    return wishlist.some((item) => item.id === gameId);
  };

  const getOrderById = (orderId) => {
    return orders.find((order) => order.id === orderId);
  };

  const loginAsAdmin = () => {
    setUser({
      id: "admin_001",
      displayName: "Admin",
      email: "admin@gamestore.com",
      avatarUrl: "https://placehold.co/150x150/10b981/white?text=A",
      bio: "Game Store Administrator",
      joinDate: "2024-01-01",
      location: "Admin Office",
      totalGamesOwned: 0,
      totalSpent: 0,
      walletBalance: 0,
      role: "admin",
    });
    toast.success("Logged in as Administrator!");
  };

  const loginAsUser = () => {
    setUser(defaultUser);
    toast.success("Logged in as User!");
  };

  const logout = () => {
    setUser(defaultUser);
    setOrders([]);
    setWishlist([]);
    toast.success("Logged out successfully!");
  };

  const isAdmin = user.role === "admin";

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
    addToWallet,
    deductFromWallet,
    loginAsAdmin,
    loginAsUser,
    logout,
    isAdmin,
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
