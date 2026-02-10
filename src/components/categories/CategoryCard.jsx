const CategoryCard = ({ title, gradient }) => (
  <div
    className={`h-32 rounded-sm ${gradient} flex items-end p-4 text-sm font-semibold hover:scale-105 transition cursor-pointer`}
  >
    {title}
  </div>
);

export default CategoryCard;
