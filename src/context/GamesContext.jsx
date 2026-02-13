import { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import { fetchGames, fetchGameById } from "@/mockdata/mockApi";

const GamesContext = createContext();

export const GamesProvider = ({ children }) => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load games on mount
  const loadGames = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchGames();
      setGames(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadGames();
  }, [loadGames]);

  // Get a single game by ID
  const getGameById = useCallback(
    async (id) => {
      // First check local state
      const localGame = games.find((g) => g.id === parseInt(id));
      if (localGame) return localGame;

      // If not found, fetch from API
      try {
        return await fetchGameById(parseInt(id));
      } catch {
        return null;
      }
    },
    [games]
  );

  // Get games by category
  const getGamesByCategory = useCallback(
    (category) => {
      return games.filter((game) => game.category === category);
    },
    [games]
  );

  // Get trending games (top rated)
  const getTrendingGames = useCallback(
    (limit = 5) => {
      return [...games]
        .sort((a, b) => b.rating - a.rating)
        .slice(0, limit);
    },
    [games]
  );

  // Search games
  const searchGames = useCallback(
    (query) => {
      if (!query.trim()) return games;
      const lowerQuery = query.toLowerCase();
      return games.filter(
        (game) =>
          game.title.toLowerCase().includes(lowerQuery) ||
          game.tags.some((tag) => tag.toLowerCase().includes(lowerQuery)) ||
          game.description.toLowerCase().includes(lowerQuery)
      );
    },
    [games]
  );

  // Get categories
  const categories = useMemo(() => {
    const cats = new Set(games.map((game) => game.category));
    return Array.from(cats).sort();
  }, [games]);

  const value = {
    games,
    loading,
    error,
    refreshGames: loadGames,
    getGameById,
    getGamesByCategory,
    getTrendingGames,
    searchGames,
    categories,
  };

  return <GamesContext.Provider value={value}>{children}</GamesContext.Provider>;
};

export const useGames = () => {
  const context = useContext(GamesContext);
  if (context === undefined) {
    throw new Error("useGames must be used within a GamesProvider");
  }
  return context;
};
