import PizzaCard from "./PizzaCard";
import { ProductType } from "@/types/product";

// Midlertidig data for testing
const desserts = [
  {
    id: 1,
    name: "Tiramisu",
    ingredients: ["Mascarpone", "Coffee", "Cocoa", "Ladyfingers"],
    price: 89,
    image: "/tira.jpg",
    type: "dessert" as ProductType,
  },
  {
    id: 2,
    name: "Panna Cotta",
    ingredients: ["Cream", "Vanilla", "Berry Sauce", "Mint"],
    price: 79,
    image: "/pana.avif",
    type: "dessert" as ProductType,
  },
  {
    id: 3,
    name: "Gelato",
    ingredients: ["Vanilla", "Chocolate", "Strawberry", "Pistachio"],
    price: 69,
    image: "/gelato.jpg",
    type: "dessert" as ProductType,
  },
];

export default function DessertSection() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {desserts.map((dessert) => (
          <PizzaCard
            key={dessert.id}
            name={dessert.name}
            ingredients={dessert.ingredients}
            price={dessert.price}
            image={dessert.image}
            type={dessert.type}
          />
        ))}
      </div>
    </div>
  );
}
