import PizzaCard from "./PizzaCard";
import { ProductType } from "@/types/product";

// Midlertidig data for testing
const dips = [
  {
    id: 1,
    name: "Garlic Dip",
    ingredients: ["Sour Cream", "Garlic", "Herbs", "Spices"],
    price: 29,
    image: "/garlic.jpg",
    type: "dips" as ProductType,
  },
  {
    id: 2,
    name: "Salsa",
    ingredients: ["Tomatoes", "Onions", "Chili", "Cilantro"],
    price: 29,
    image: "/salsa.webp",
    type: "dips" as ProductType,
  },
  {
    id: 3,
    name: "Pesto",
    ingredients: ["Basil", "Pine Nuts", "Parmesan", "Olive Oil"],
    price: 39,
    image: "/pesto.webp",
    type: "dips" as ProductType,
  },
];

export default function DipsSection() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dips.map((dip) => (
          <PizzaCard
            key={dip.id}
            name={dip.name}
            ingredients={dip.ingredients}
            price={dip.price}
            image={dip.image}
            type={dip.type}
          />
        ))}
      </div>
    </div>
  );
}
