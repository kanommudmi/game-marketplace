import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Loader2,
  Star,
  AlertCircle,
  Gamepad2,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import { fetchGames, addGame, updateGame, deleteGame } from "@/mockdata/mockApi";
import GameFormModal from "@/components/GameFormModal";

const GamesManagement = () => {
  const [games, setGames] = useState([]);
  const [filteredGames, setFilteredGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingGame, setEditingGame] = useState(null);
  const [formMode, setFormMode] = useState("add");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [gameToDelete, setGameToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    loadGames();
  }, []);

  useEffect(() => {
    filterGames();
  }, [searchQuery, selectedCategory, games]);

  const loadGames = async () => {
    try {
      setLoading(true);
      const data = await fetchGames();
      setGames(data);
    } catch (error) {
      console.error("Failed to load games:", error);
      toast.error("Failed to load games");
    } finally {
      setLoading(false);
    }
  };

  const filterGames = () => {
    let result = [...games];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (game) =>
          game.title.toLowerCase().includes(query) ||
          game.description.toLowerCase().includes(query) ||
          game.developer.toLowerCase().includes(query) ||
          game.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    if (selectedCategory !== "all") {
      result = result.filter((game) => game.category === selectedCategory);
    }

    setFilteredGames(result);
  };

  const handleAddGame = () => {
    setFormMode("add");
    setEditingGame(null);
    setIsFormOpen(true);
  };

  const handleEditGame = (game) => {
    setFormMode("edit");
    setEditingGame(game);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (game) => {
    setGameToDelete(game);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!gameToDelete) return;

    setIsDeleting(true);
    try {
      await deleteGame(gameToDelete.id);
      setGames((prev) => prev.filter((g) => g.id !== gameToDelete.id));
      toast.success(`"${gameToDelete.title}" has been deleted`);
    } catch (error) {
      console.error("Failed to delete game:", error);
      toast.error("Failed to delete game");
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setGameToDelete(null);
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (formMode === "add") {
        const newGame = await addGame(formData);
        setGames((prev) => [...prev, newGame]);
        toast.success(`"${newGame.title}" has been added`);
      } else {
        const updatedGame = await updateGame(editingGame.id, formData);
        setGames((prev) =>
          prev.map((g) => (g.id === updatedGame.id ? updatedGame : g))
        );
        toast.success(`"${updatedGame.title}" has been updated`);
      }
    } catch (error) {
      console.error("Failed to save game:", error);
      toast.error("Failed to save game");
      throw error;
    }
  };

  const getCategories = () => {
    const cats = [...new Set(games.map((g) => g.category))];
    return cats.sort();
  };

  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-0.5">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < Math.floor(rating)
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
        <span className="ml-1 text-sm text-gray-600">({rating})</span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Games Management</h1>
          <p className="text-gray-500 mt-1">
            Manage your game catalog: {games.length} total games
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={loadGames}
            disabled={loading}
            className="border-gray-300"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button
            onClick={handleAddGame}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Game
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search games by title, description, tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="h-10 px-3 rounded-md border border-input bg-background text-sm"
            >
              <option value="all">All Categories</option>
              {getCategories().map((cat) => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Games Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Game Catalog ({filteredGames.length} games)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
              <span className="ml-2 text-gray-600">Loading games...</span>
            </div>
          ) : filteredGames.length === 0 ? (
            <div className="text-center py-12">
              <Gamepad2 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                No games found
              </h3>
              <p className="text-gray-500 mb-4">
                {searchQuery
                  ? "Try adjusting your search or filters"
                  : "Start by adding your first game"}
              </p>
              {!searchQuery && (
                <Button
                  onClick={handleAddGame}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Game
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Game</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Release Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredGames.map((game) => (
                    <TableRow key={game.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <img
                            src={game.imageUrl}
                            alt={game.title}
                            className="w-12 h-16 object-cover rounded"
                          />
                          <div>
                            <p className="font-medium text-gray-900">
                              {game.title}
                            </p>
                            <p className="text-sm text-gray-500">
                              {game.developer}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 capitalize">
                          {game.category}
                        </span>
                      </TableCell>
                      <TableCell>{renderStars(game.rating)}</TableCell>
                      <TableCell>
                        <span
                          className={`font-medium ${
                            game.isFree ? "text-emerald-600" : "text-gray-900"
                          }`}
                        >
                          {game.isFree ? "Free" : `$${game.price.toFixed(2)}`}
                        </span>
                      </TableCell>
                      <TableCell>
                        {new Date(game.releaseDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditGame(game)}
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteClick(game)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Game Form Modal */}
      <GameFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        game={editingGame}
        mode={formMode}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="w-5 h-5" />
              Confirm Deletion
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{gameToDelete?.title}"? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Game
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GamesManagement;
