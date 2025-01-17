import PizzaCard from "./PizzaCard";
import { ProductType } from "@/types/product";

// Midlertidig data for testing
const salads = [
  {
    id: 1,
    name: "Caesar Salad",
    ingredients: [
      "Romaine Lettuce",
      "Chicken",
      "Parmesan",
      "Croutons",
      "Caesar Dressing",
    ],
    price: 169,
    image: "/cesar.png",
    type: "salad" as ProductType,
  },
  {
    id: 2,
    name: "Greek Salad",
    ingredients: [
      "Feta Cheese",
      "Olives",
      "Cucumber",
      "Tomatoes",
      "Red Onion",
      "Olive Oil",
    ],
    price: 159,
    image: "/greek.jpg",
    type: "salad" as ProductType,
  },
  {
    id: 3,
    name: "Caprese",
    ingredients: [
      "Mozzarella",
      "Tomatoes",
      "Basil",
      "Balsamic Vinegar",
      "Olive Oil",
    ],
    price: 149,
    image: "/caprese.png",
    type: "salad" as ProductType,
  },
];

export default function SaladSection() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {salads.map((salad) => (
          <PizzaCard
            key={salad.id}
            name={salad.name}
            ingredients={salad.ingredients}
            price={salad.price}
            image={salad.image}
            type={salad.type}
          />
        ))}
      </div>
    </div>
  );
}
