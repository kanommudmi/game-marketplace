const CategoryCard = ({ title, gradient, image }) => (
  <div
    className={`h-32 ${gradient} flex items-end p-4 text-sm font-semibold cursor-pointer relative overflow-hidden border border-gray-700/30 shadow-lg hover:border-gray-500/50 hover:shadow-xl hover:scale-105 transition-all duration-300`}
    style={{
      backgroundImage: image ? `url(${image})` : undefined,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }}
  >
    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
    <span className="relative z-10 text-white font-bold drop-shadow-lg">{title}</span>
  </div>
);

export default CategoryCard;
