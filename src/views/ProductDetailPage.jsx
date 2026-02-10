import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCart } from "@/context/CartContext";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Star, Calendar, Building2, Tag, ArrowLeft } from "lucide-react";
import { allProducts } from "@/mockdata/games";

const ProductDetailPage = () => {
  const { addToCart } = useCart();
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const found = allProducts.find((p) => p.id === parseInt(id));
    setProduct(found);
  }, [id]);

  if (!product) {
    return (
      <div className="min-h-screen bg-[#0b0f1a] text-white p-10 flex items-center justify-center">
        <p>Product not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0f1a] text-white p-10">
      <div className="max-w-6xl mx-auto">
        <Button 
          onClick={() => navigate(-1)}
          variant="ghost"
          className="mb-6 text-lime-400 hover:text-lime-300"
        >
          <ArrowLeft className="mr-2" />
          Back
        </Button>

        <div className="grid grid-cols-2 gap-8">
          <div>
            <Card className="bg-black/40 border-none overflow-hidden">
              <CardContent className="p-0">
                <img 
                  src={product.imageUrl} 
                  alt={product.title} 
                  className="w-full rounded-lg"
                />
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">{product.title}</h1>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span>{product.rating}</span>
                </div>
                <div className="flex items-center gap-1 text-slate-400">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(product.releaseDate).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-lime-400">
                {product.isFree ? "FREE" : `$${product.price}`}
              </span>
              {!product.isFree && (
                <span className="text-slate-400 line-through text-sm">
                  ${product.price * 1.5}
                </span>
              )}
            </div>

            <p className="text-slate-300 leading-relaxed">
              {product.description}
            </p>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Building2 className="w-4 h-4 text-lime-400" />
                <span className="text-slate-400">Developer:</span>
                <span>{product.developer}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Building2 className="w-4 h-4 text-lime-400" />
                <span className="text-slate-400">Publisher:</span>
                <span>{product.publisher}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag, index) => (
                <span 
                  key={index}
                  className="px-3 py-1 bg-lime-400/20 text-lime-400 text-sm rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="space-y-3 pt-4 border-t border-white/10">
              <Button 
                onClick={() => addToCart(product)}
                className="w-full bg-lime-400 text-black font-semibold text-lg py-6"
              >
                Add to Cart
              </Button>
              <Button 
                variant="outline"
                className="w-full border-lime-400 text-lime-400 hover:bg-lime-400/10"
                onClick={() => {
                  addToCart(product);
                  navigate('/checkout');
                }}
              >
                Buy Now
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
