
const Cart = ({ items, onRemove }) => {
  return (
    <aside className="w-80 bg-black/40 p-6 rounded-xl space-y-4">
      <h3 className="text-lg font-semibold">My Cart</h3>

      {items.length === 0 && <p className="text-sm text-slate-400">Cart is empty</p>}

      {items.map((item) => (
        <div key={item.id} className="flex items-center gap-4 bg-black/50 p-3 rounded-lg">
          <img src={item.imageUrl} alt={item.title} className="w-14 h-14 rounded-md object-cover" />
          <div className="flex-1">
            <p className="text-sm font-medium">{item.title}</p>
            <p className="text-xs text-lime-400">${item.price}</p>
          </div>
          <button
            onClick={() => onRemove(item.id)}
            className="text-xs text-red-400 hover:text-red-500"
          >
            Remove
          </button>
        </div>
      ))}

      {items.length > 0 && (
        <div className="pt-4 border-t border-white/10 space-y-3">
          <div className="flex justify-between text-sm">
            <span>Total</span>
            <span className="font-semibold">
              ${items.reduce((sum, i) => sum + i.price, 0).toFixed(2)}
            </span>
          </div>
          <Button className="w-full bg-lime-400 text-black font-semibold">Checkout</Button>
        </div>
      )}
    </aside>
  );
};

export default Cart;
