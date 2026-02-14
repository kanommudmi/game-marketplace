import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const { cart, removeFromCart } = useCart();
  const navigate = useNavigate();

  return (
    <aside className="w-80 border border-gray-700/30 bg-[#151924] p-4 space-y-4 shadow-xl">
      <h3 className="text-lg font-semibold">My Cart ({cart.length})</h3>

      {cart.length === 0 && <p className="text-sm text-slate-400">Cart is empty</p>}

      <div className="max-h-60 overflow-y-auto space-y-2">
        {cart.map((item) => (
          <div key={item.id} className="flex items-center gap-3 bg-[#1a1f2e] p-2 border border-gray-700/20 hover:border-gray-600/30 transition-all">
            <img src={item.imageUrl} alt={item.title} className="w-12 h-12 object-cover" />
            <div className="flex-1">
              <p className="text-sm font-medium">{item.title}</p>
              <p className="text-xs text-gray-400">${item.price}</p>
            </div>
            <button
              onClick={() => removeFromCart(item.id)}
              className="text-xs text-red-400 hover:text-red-500 transition-all"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      {cart.length > 0 && (
        <div className="pt-4 border-t border-gray-700/30 space-y-3">
          <div className="flex justify-between text-sm">
            <span>Total</span>
            <span className="font-semibold">
              ${cart.reduce((sum, i) => sum + i.price, 0).toFixed(2)}
            </span>
          </div>
          <Button onClick={() => navigate('/checkout')} className="w-full bg-white text-black font-semibold hover:bg-gray-200 transition-all">Checkout</Button>
        </div>
      )}
    </aside>
  );
};

export default Cart;
