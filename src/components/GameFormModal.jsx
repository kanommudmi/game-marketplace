import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Star, Loader2 } from "lucide-react";

const CATEGORIES = [
  "action",
  "rpg",
  "racing",
  "sports",
  "strategy",
  "shooting",
];

const GameFormModal = ({ isOpen, onClose, onSubmit, game, mode }) => {
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    category: "action",
    imageUrl: "https://placehold.co/300x400",
    description: "",
    rating: 0,
    tags: "",
    developer: "",
    publisher: "",
    releaseDate: "",
    isFree: false,
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (game && mode === "edit") {
      setFormData({
        title: game.title || "",
        price: game.price?.toString() || "",
        category: game.category || "action",
        imageUrl: game.imageUrl || "https://placehold.co/300x400",
        description: game.description || "",
        rating: game.rating || 0,
        tags: Array.isArray(game.tags) ? game.tags.join(", ") : game.tags || "",
        developer: game.developer || "",
        publisher: game.publisher || "",
        releaseDate: game.releaseDate || "",
        isFree: game.isFree || false,
      });
    } else {
      setFormData({
        title: "",
        price: "",
        category: "action",
        imageUrl: "https://placehold.co/300x400",
        description: "",
        rating: 0,
        tags: "",
        developer: "",
        publisher: "",
        releaseDate: "",
        isFree: false,
      });
    }
    setErrors({});
  }, [game, mode, isOpen]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.isFree) {
      if (!formData.price || parseFloat(formData.price) < 0) {
        newErrors.price = "Price must be 0 or greater";
      }
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!formData.developer.trim()) {
      newErrors.developer = "Developer is required";
    }

    if (!formData.publisher.trim()) {
      newErrors.publisher = "Publisher is required";
    }

    if (!formData.releaseDate) {
      newErrors.releaseDate = "Release date is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        ...formData,
        price: formData.isFree ? 0 : parseFloat(formData.price),
        rating: parseFloat(formData.rating),
      });
      onClose();
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStarRating = () => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => handleChange("rating", star)}
            className="p-1 hover:scale-110 transition-transform"
          >
            <Star
              className={`w-6 h-6 ${
                star <= formData.rating
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300"
              }`}
            />
          </button>
        ))}
        <span className="ml-2 text-sm text-gray-600">
          ({formData.rating}/5)
        </span>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900">
            {mode === "add" ? "Add New Game" : "Edit Game"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">
              Game Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="Enter game title"
              className={errors.title ? "border-red-500" : ""}
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title}</p>
            )}
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) => handleChange("category", e.target.value)}
                className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Price & Free Toggle */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="price">Price</Label>
                <div className="flex items-center gap-2">
                  <Switch
                    id="isFree"
                    checked={formData.isFree}
                    onCheckedChange={(checked) =>
                      handleChange("isFree", checked)
                    }
                  />
                  <Label htmlFor="isFree" className="text-sm cursor-pointer">
                    Free
                  </Label>
                </div>
              </div>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => handleChange("price", e.target.value)}
                placeholder="0.00"
                disabled={formData.isFree}
                className={errors.price ? "border-red-500" : ""}
              />
              {errors.price && (
                <p className="text-sm text-red-500">{errors.price}</p>
              )}
            </div>
          </div>

          {/* Rating */}
          <div className="space-y-2">
            <Label>Rating</Label>
            {renderStarRating()}
          </div>

          {/* Image URL */}
          <div className="space-y-2">
            <Label htmlFor="imageUrl">Image URL</Label>
            <Input
              id="imageUrl"
              value={formData.imageUrl}
              onChange={(e) => handleChange("imageUrl", e.target.value)}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">
              Description <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Enter game description"
              rows={4}
              className={errors.description ? "border-red-500" : ""}
            />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description}</p>
            )}
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Input
              id="tags"
              value={formData.tags}
              onChange={(e) => handleChange("tags", e.target.value)}
              placeholder="Action, RPG, Open World"
            />
            <p className="text-xs text-gray-500">
              Example: Action, Adventure, Multiplayer
            </p>
          </div>

          {/* Developer & Publisher */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="developer">
                Developer <span className="text-red-500">*</span>
              </Label>
              <Input
                id="developer"
                value={formData.developer}
                onChange={(e) => handleChange("developer", e.target.value)}
                placeholder="Game developer"
                className={errors.developer ? "border-red-500" : ""}
              />
              {errors.developer && (
                <p className="text-sm text-red-500">{errors.developer}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="publisher">
                Publisher <span className="text-red-500">*</span>
              </Label>
              <Input
                id="publisher"
                value={formData.publisher}
                onChange={(e) => handleChange("publisher", e.target.value)}
                placeholder="Game publisher"
                className={errors.publisher ? "border-red-500" : ""}
              />
              {errors.publisher && (
                <p className="text-sm text-red-500">{errors.publisher}</p>
              )}
            </div>
          </div>

          {/* Release Date */}
          <div className="space-y-2">
            <Label htmlFor="releaseDate">
              Release Date <span className="text-red-500">*</span>
            </Label>
            <Input
              id="releaseDate"
              type="date"
              value={formData.releaseDate}
              onChange={(e) => handleChange("releaseDate", e.target.value)}
              className={errors.releaseDate ? "border-red-500" : ""}
            />
            {errors.releaseDate && (
              <p className="text-sm text-red-500">{errors.releaseDate}</p>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {mode === "add" ? "Adding..." : "Saving..."}
                </>
              ) : mode === "add" ? (
                "Add Game"
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default GameFormModal;
