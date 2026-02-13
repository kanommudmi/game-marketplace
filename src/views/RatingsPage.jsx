import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useCart } from "@/context/CartContext";
import { useGames } from "@/context/GamesContext";
import { useNavigate } from "react-router-dom";
import { Search, Star, SlidersHorizontal, X, Loader2 } from "lucide-react";

const RatingsPage = () => {
  const { addToCart } = useCart();
  const { games, loading: gamesLoading, categories } = useGames();
  const navigate = useNavigate();

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minRating, setMinRating] = useState(0);
  const [showFreeOnly, setShowFreeOnly] = useState(false);
  const [sortBy, setSortBy] = useState("rating-desc");
  const [showFilters, setShowFilters] = useState(false);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...games];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (product) =>
          product.title.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query) ||
          product.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    // Category filter
    if (selectedCategory !== "all") {
      result = result.filter((product) => product.category === selectedCategory);
    }

    // Price filter
    if (minPrice !== "") {
      result = result.filter((product) => product.price >= parseFloat(minPrice));
    }
    if (maxPrice !== "") {
      result = result.filter((product) => product.price <= parseFloat(maxPrice));
    }

    // Rating filter
    if (minRating > 0) {
      result = result.filter((product) => product.rating >= minRating);
    }

    // Free/Paid filter
    if (showFreeOnly) {
      result = result.filter((product) => product.isFree);
    }

    // Sorting
    switch (sortBy) {
      case "rating-desc":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "rating-asc":
        result.sort((a, b) => a.rating - b.rating);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "name-asc":
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "name-desc":
        result.sort((a, b) => b.title.localeCompare(a.title));
        break;
      default:
        break;
    }

    return result;
  }, [games, searchQuery, selectedCategory, minPrice, maxPrice, minRating, showFreeOnly, sortBy]);

  // Render star rating
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="flex items-center gap-0.5">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
        ))}
        {hasHalfStar && (
          <Star className="w-4 h-4 fill-yellow-400/50 text-yellow-400" />
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={`empty-${i}`} className="w-4 h-4 text-gray-500" />
        ))}
        <span className="ml-1 text-sm text-gray-400">({rating})</span>
      </div>
    );
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setMinPrice("");
    setMaxPrice("");
    setMinRating(0);
    setShowFreeOnly(false);
    setSortBy("rating-desc");
  };

  // Check if any filter is active
  const hasActiveFilters =
    searchQuery ||
    selectedCategory !== "all" ||
    minPrice !== "" ||
    maxPrice !== "" ||
    minRating > 0 ||
    showFreeOnly;

  if (gamesLoading) {
    return (
      <div className="min-h-screen bg-[#0b0f1a] text-white p-10 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-lime-400" />
        <span className="ml-2">Loading games...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0f1a] text-white p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Browse Games by Rating</h1>
          <p className="text-gray-400">Discover top-rated games and find your next favorite</p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search games by title, description, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-black/40 border-gray-700 text-white placeholder:text-gray-500 h-12"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Filter Toggle Button (Mobile) */}
        <div className="lg:hidden mb-4">
          <Button
            onClick={() => setShowFilters(!showFilters)}
            variant="outline"
            className="w-full border-gray-700 bg-black/40"
          >
            <SlidersHorizontal className="w-4 h-4 mr-2" />
            {showFilters ? "Hide Filters" : "Show Filters"}
          </Button>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar */}
          <div className={`lg:w-64 shrink-0 ${showFilters ? "block" : "hidden lg:block"}`}>
            <div className="bg-black/40 rounded-lg p-6 border border-gray-800">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <SlidersHorizontal className="w-5 h-5" />
                  Filters
                </h2>
                {hasActiveFilters && (
                  <Button
                    onClick={clearFilters}
                    variant="ghost"
                    size="sm"
                    className="text-lime-400 hover:text-lime-300"
                  >
                    Clear All
                  </Button>
                )}
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full bg-[#1a1f2e] border border-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:border-lime-400"
                >
                  <option value="all">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Price Range
                </label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="bg-[#1a1f2e] border-gray-700 text-white"
                    min="0"
                  />
                  <Input
                    type="number"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="bg-[#1a1f2e] border-gray-700 text-white"
                    min="0"
                  />
                </div>
              </div>

              {/* Rating Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Minimum Rating
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="0"
                    max="5"
                    step="0.5"
                    value={minRating}
                    onChange={(e) => setMinRating(parseFloat(e.target.value))}
                    className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-lime-400"
                  />
                  <span className="text-sm text-gray-400 w-12">{minRating}+</span>
                </div>
                <div className="flex items-center mt-2">
                  {minRating > 0 ? renderStars(minRating) : <span className="text-gray-500 text-sm">Any rating</span>}
                </div>
              </div>

              {/* Free/Paid Filter */}
              <div className="mb-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showFreeOnly}
                    onChange={(e) => setShowFreeOnly(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-700 bg-[#1a1f2e] text-lime-400 focus:ring-lime-400"
                  />
                  <span className="text-sm text-gray-300">Free Games Only</span>
                </label>
              </div>

              {/* Sort By */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full bg-[#1a1f2e] border border-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:border-lime-400"
                >
                  <option value="rating-desc">Rating: High to Low</option>
                  <option value="rating-asc">Rating: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="name-asc">Name: A to Z</option>
                  <option value="name-desc">Name: Z to A</option>
                </select>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Results Count */}
            <div className="mb-4 flex items-center justify-between">
              <p className="text-gray-400">
                Showing <span className="text-white font-semibold">{filteredProducts.length}</span> games
              </p>
            </div>

            {/* Grid */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((game) => (
                  <Card
                    key={game.id}
                    className="bg-black/40 border-gray-800 hover:border-lime-400/50 hover:scale-105 transition-all duration-300 cursor-pointer group"
                    onClick={() => navigate(`/product/${game.id}`)}
                  >
                    <CardContent className="flex flex-col p-0">
                      {/* Image Container */}
                      <div className="relative overflow-hidden">
                        <img
                          src={game.imageUrl}
                          alt={game.title}
                          className="w-full h-48 object-cover rounded-t-sm"
                        />
                        {game.isFree && (
                          <div className="absolute top-2 right-2 bg-lime-400 text-black text-xs font-bold px-2 py-1 rounded">
                            FREE
                          </div>
                        )}
                        <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded capitalize">
                          {game.category}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-4 space-y-2">
                        <h3 className="font-semibold text-white text-lg truncate group-hover:text-lime-400 transition-colors">
                          {game.title}
                        </h3>
                        
                        {/* Rating */}
                        <div className="flex items-center">
                          {renderStars(game.rating)}
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1">
                          {game.tags.slice(0, 3).map((tag, idx) => (
                            <span
                              key={idx}
                              className="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        {/* Price and Button */}
                        <div className="flex items-center justify-between pt-2">
                          <p className={`font-bold ${game.isFree ? "text-lime-400" : "text-white"}`}>
                            {game.isFree ? "Free" : `$${game.price}`}
                          </p>
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              addToCart(game);
                            }}
                            size="sm"
                            className="bg-lime-400 text-black hover:bg-lime-500"
                          >
                            Add to Cart
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="text-6xl mb-4">🎮</div>
                <h3 className="text-xl font-semibold mb-2">No games found</h3>
                <p className="text-gray-400 mb-4">Try adjusting your filters or search query</p>
                <Button onClick={clearFilters} variant="outline" className="border-lime-400 text-lime-400 hover:bg-lime-400/10">
                  Clear All Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RatingsPage;
