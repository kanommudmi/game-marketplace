import { createContext, useContext, useState } from "react";
import { toast } from "sonner";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      const newQuantity = existing ? existing.quantity + 1 : 1;
      
      // Show toast notification
      toast.success(
        <div className="flex items-center gap-3">
          <img 
            src={product.imageUrl} 
            alt={product.title}
            className="w-12 h-12 rounded-sm object-cover"
          />
          <div className="flex flex-col">
            <span className="font-medium text-sm">{product.title}</span>
            <span className="text-xs text-slate-400">
              ${product.price} • Added to cart {newQuantity > 1 && `(x${newQuantity})`}
            </span>
          </div>
        </div>,
        {
          duration: 4000,
        }
      );
      
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
