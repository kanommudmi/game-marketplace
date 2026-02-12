// Mock API Service for Admin Dashboard
// Simulates backend API calls with delays

import { allProducts } from "./games";
import { generateMockOrders, mockUser } from "./user";

// Simulate network delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Generate unique ID
const generateId = () => Math.floor(Math.random() * 10000) + 200;

// Initial data store (in-memory)
let gamesStore = [...allProducts];
let ordersStore = generateMockOrders();
let usersStore = [
  mockUser,
  {
    id: "user_002",
    displayName: "JohnDoe",
    email: "john@example.com",
    avatarUrl: "https://placehold.co/150x150/3b82f6/white?text=JD",
    bio: "Casual gamer",
    joinDate: "2024-02-15",
    location: "Canada",
    totalGamesOwned: 5,
    totalSpent: 299.95,
    walletBalance: 50.0,
    role: "user",
  },
  {
    id: "user_003",
    displayName: "AliceGamer",
    email: "alice@example.com",
    avatarUrl: "https://placehold.co/150x150/ec4899/white?text=AG",
    bio: "RPG enthusiast",
    joinDate: "2024-03-01",
    location: "United Kingdom",
    totalGamesOwned: 12,
    totalSpent: 599.88,
    walletBalance: 100.0,
    role: "user",
  },
  {
    id: "user_004",
    displayName: "ProPlayer99",
    email: "pro@example.com",
    avatarUrl: "https://placehold.co/150x150/f59e0b/white?text=PP",
    bio: "Competitive player",
    joinDate: "2024-01-20",
    location: "Germany",
    totalGamesOwned: 8,
    totalSpent: 449.92,
    walletBalance: 25.0,
    role: "user",
  },
  {
    id: "user_005",
    displayName: "SarahPlays",
    email: "sarah@example.com",
    avatarUrl: "https://placehold.co/150x150/8b5cf6/white?text=SP",
    bio: "Strategy game lover",
    joinDate: "2024-04-10",
    location: "Australia",
    totalGamesOwned: 3,
    totalSpent: 179.97,
    walletBalance: 75.0,
    role: "user",
  },
];

// ==================== GAMES API ====================

export const fetchGames = async () => {
  await delay(800);
  return [...gamesStore];
};

export const fetchGameById = async (id) => {
  await delay(500);
  const game = gamesStore.find((g) => g.id === id);
  if (!game) throw new Error("Game not found");
  return { ...game };
};

export const addGame = async (gameData) => {
  await delay(1200);
  const newGame = {
    ...gameData,
    id: generateId(),
    rating: parseFloat(gameData.rating) || 0,
    price: parseFloat(gameData.price) || 0,
    tags: Array.isArray(gameData.tags)
      ? gameData.tags
      : gameData.tags.split(",").map((t) => t.trim()).filter(Boolean),
  };
  gamesStore = [...gamesStore, newGame];
  return { ...newGame };
};

export const updateGame = async (id, gameData) => {
  await delay(1000);
  const index = gamesStore.findIndex((g) => g.id === id);
  if (index === -1) throw new Error("Game not found");

  const updatedGame = {
    ...gamesStore[index],
    ...gameData,
    id,
    rating: parseFloat(gameData.rating) || gamesStore[index].rating,
    price: parseFloat(gameData.price) || gamesStore[index].price,
    tags: Array.isArray(gameData.tags)
      ? gameData.tags
      : gameData.tags.split(",").map((t) => t.trim()).filter(Boolean),
  };
  gamesStore = gamesStore.map((g) => (g.id === id ? updatedGame : g));
  return { ...updatedGame };
};

export const deleteGame = async (id) => {
  await delay(800);
  const game = gamesStore.find((g) => g.id === id);
  if (!game) throw new Error("Game not found");
  gamesStore = gamesStore.filter((g) => g.id !== id);
  return { success: true, deletedGame: game };
};

// ==================== ORDERS API ====================

export const fetchOrders = async () => {
  await delay(900);
  return [...ordersStore];
};

export const fetchOrderById = async (id) => {
  await delay(600);
  const order = ordersStore.find((o) => o.id === id);
  if (!order) throw new Error("Order not found");
  return { ...order };
};

export const updateOrderStatus = async (id, status) => {
  await delay(700);
  const index = ordersStore.findIndex((o) => o.id === id);
  if (index === -1) throw new Error("Order not found");

  const updatedOrder = { ...ordersStore[index], status };
  ordersStore = ordersStore.map((o) => (o.id === id ? updatedOrder : o));
  return { ...updatedOrder };
};

// ==================== USERS API ====================

export const fetchUsers = async () => {
  await delay(800);
  return [...usersStore];
};

export const fetchUserById = async (id) => {
  await delay(500);
  const user = usersStore.find((u) => u.id === id);
  if (!user) throw new Error("User not found");
  return { ...user };
};

export const updateUserRole = async (id, role) => {
  await delay(700);
  const index = usersStore.findIndex((u) => u.id === id);
  if (index === -1) throw new Error("User not found");

  const updatedUser = { ...usersStore[index], role };
  usersStore = usersStore.map((u) => (u.id === id ? updatedUser : u));
  return { ...updatedUser };
};

export const deleteUser = async (id) => {
  await delay(800);
  const user = usersStore.find((u) => u.id === id);
  if (!user) throw new Error("User not found");
  if (user.role === "admin") throw new Error("Cannot delete admin users");
  usersStore = usersStore.filter((u) => u.id !== id);
  return { success: true, deletedUser: user };
};

// ==================== DASHBOARD STATS API ====================

export const fetchDashboardStats = async () => {
  await delay(1000);

  const totalGames = gamesStore.length;
  const totalOrders = ordersStore.length;
  const totalUsers = usersStore.length;
  const totalRevenue = ordersStore.reduce((sum, order) => sum + order.total, 0);
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const freeGames = gamesStore.filter((g) => g.isFree).length;
  const paidGames = totalGames - freeGames;

  // Recent orders (last 5)
  const recentOrders = [...ordersStore]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  // Top rated games (top 5)
  const topRatedGames = [...gamesStore]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 5);

  // Orders by status
  const ordersByStatus = {
    completed: ordersStore.filter((o) => o.status === "completed").length,
    pending: ordersStore.filter((o) => o.status === "pending").length,
    cancelled: ordersStore.filter((o) => o.status === "cancelled").length,
  };

  // Games by category
  const gamesByCategory = gamesStore.reduce((acc, game) => {
    acc[game.category] = (acc[game.category] || 0) + 1;
    return acc;
  }, {});

  return {
    totalGames,
    totalOrders,
    totalUsers,
    totalRevenue,
    avgOrderValue,
    freeGames,
    paidGames,
    recentOrders,
    topRatedGames,
    ordersByStatus,
    gamesByCategory,
  };
};

export default {
  fetchGames,
  fetchGameById,
  addGame,
  updateGame,
  deleteGame,
  fetchOrders,
  fetchOrderById,
  updateOrderStatus,
  fetchUsers,
  fetchUserById,
  updateUserRole,
  deleteUser,
  fetchDashboardStats,
};
