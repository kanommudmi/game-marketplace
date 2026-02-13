import { useState, useEffect, useMemo, useCallback } from "react";
import {
  fetchGames,
  addGame,
  updateGame,
  deleteGame,
} from "@/mockdata/mockApi";

export const useGamesManagement = () => {
  // Data state
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Modal state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingGame, setEditingGame] = useState(null);
  const [formMode, setFormMode] = useState("add");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [gameToDelete, setGameToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Load games
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

  // Filtered games
  const filteredGames = useMemo(() => {
    let result = [...games];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (game) =>
          game.title.toLowerCase().includes(query) ||
          game.developer.toLowerCase().includes(query) ||
          game.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    if (selectedCategory && selectedCategory !== "all") {
      result = result.filter((game) => game.category === selectedCategory);
    }

    return result;
  }, [games, searchQuery, selectedCategory]);

  // Categories
  const categories = useMemo(() => {
    const cats = new Set(games.map((game) => game.category));
    return ["all", ...Array.from(cats).sort()];
  }, [games]);

  // CRUD operations
  const handleAddGame = useCallback(() => {
    setEditingGame(null);
    setFormMode("add");
    setIsFormOpen(true);
  }, []);

  const handleEditGame = useCallback((game) => {
    setEditingGame(game);
    setFormMode("edit");
    setIsFormOpen(true);
  }, []);

  const handleDeleteClick = useCallback((game) => {
    setGameToDelete(game);
    setDeleteDialogOpen(true);
  }, []);

  const handleFormSubmit = useCallback(
    async (formData) => {
      try {
        if (formMode === "add") {
          await addGame(formData);
        } else {
          await updateGame(editingGame.id, formData);
        }
        await loadGames();
        setIsFormOpen(false);
        return true;
      } catch (err) {
        setError(err.message);
        return false;
      }
    },
    [formMode, editingGame, loadGames]
  );

  const handleConfirmDelete = useCallback(async () => {
    if (!gameToDelete) return;
    setIsDeleting(true);
    try {
      await deleteGame(gameToDelete.id);
      await loadGames();
      setDeleteDialogOpen(false);
      setGameToDelete(null);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setIsDeleting(false);
    }
  }, [gameToDelete, loadGames]);

  const handleCancelDelete = useCallback(() => {
    setDeleteDialogOpen(false);
    setGameToDelete(null);
  }, []);

  const handleCloseForm = useCallback(() => {
    setIsFormOpen(false);
    setEditingGame(null);
  }, []);

  return {
    // Data
    games,
    filteredGames,
    loading,
    error,
    categories,

    // Filters
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,

    // Modal state
    isFormOpen,
    editingGame,
    formMode,
    deleteDialogOpen,
    gameToDelete,
    isDeleting,

    // Actions
    loadGames,
    handleAddGame,
    handleEditGame,
    handleDeleteClick,
    handleFormSubmit,
    handleConfirmDelete,
    handleCancelDelete,
    handleCloseForm,
  };
};
