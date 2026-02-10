import { allProducts } from "./games";

// Default mock user data
export const mockUser = {
  id: "user_001",
  displayName: "GamerPro123",
  email: "gamer@example.com",
  avatarUrl: "https://placehold.co/150x150/84cc16/white?text=GP",
  bio: "Passionate gamer who loves RPGs and open-world adventures. Always looking for the next great game to explore!",
  joinDate: "2024-01-15",
  location: "United States",
  totalGamesOwned: 0,
  totalSpent: 0,
};

// Generate realistic mock orders
export const generateMockOrders = () => {
  const orders = [];
  const orderStatuses = ["completed", "completed", "completed", "completed", "completed"];
  
  // Create 5 mock orders with different dates
  const orderDates = [
    new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
    new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 2 weeks ago
    new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 1 month ago
    new Date(Date.now() - 45 * 24 * 60 * 60 * 1000), // 1.5 months ago
  ];

  // Random game selections for each order
  const gameSelections = [
    [allProducts[0], allProducts[4]], // Cyberpunk + Spider-Man
    [allProducts[12]], // Elden Ring
    [allProducts[6], allProducts[8]], // Forza + Mario Kart
    [allProducts[13], allProducts[14], allProducts[3]], // Witcher 3 + Skyrim + God of War
    [allProducts[1]], // GTA V
  ];

  orderDates.forEach((date, index) => {
    const items = gameSelections[index].map((game) => ({
      ...game,
      quantity: 1,
    }));
    
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const serviceFee = subtotal * 0.05;
    const total = subtotal + serviceFee;

    orders.push({
      id: `ORD-2024-${1000 + index}`,
      date: date.toISOString(),
      items: items,
      total: total,
      status: orderStatuses[index],
    });
  });

  return orders;
};

// Mock wishlist (initially empty or with some games)
export const initialWishlist = [];

// Helper to format currency
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

// Helper to format date
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
};

// Helper to format relative time
export const formatRelativeTime = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
};
