import PizzaCard from "./PizzaCard";
import { ProductType } from "@/types/product";

// Midlertidig data for testing
const drinks = [
  {
    id: 1,
    name: "Coca Cola",
    ingredients: ["Original Cola", "Carbonated", "0.5L"],
    price: 39,
    image: "/cola.webp",
    type: "drinks" as ProductType,
  },
  {
    id: 2,
    name: "San Pellegrino",
    ingredients: ["Mineral Water", "Citrus", "Natural Carbonation"],
    price: 39,
    image: "/pele.jpg",
    type: "drinks" as ProductType,
  },
  {
    id: 3,
    name: "Fanta",
    ingredients: ["Orange Soda", "Carbonated", "0.5L"],
    price: 39,
    image: "/fanta.jpg",
    type: "drinks" as ProductType,
  },
];

export default function DrinksSection() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {drinks.map((drink) => (
          <PizzaCard
            key={drink.id}
            name={drink.name}
            ingredients={drink.ingredients}
            price={drink.price}
            image={drink.image}
            type={drink.type}
          />
        ))}
      </div>
    </div>
  );
}
