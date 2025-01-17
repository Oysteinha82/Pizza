import PizzaCard from "./PizzaCard";
import { ProductType } from "@/types/product";

// Midlertidig data for testing
const pastas = [
  {
    id: 1,
    name: "Carbonara",
    ingredients: [
      "Spaghetti",
      "Eggs",
      "Pecorino Romano",
      "Guanciale",
      "Black Pepper",
    ],
    price: 189,
    image: "/carbonara.webp",
    type: "pasta" as ProductType,
  },
  {
    id: 2,
    name: "Bolognese",
    ingredients: ["Tagliatelle", "Meat Sauce", "Parmesan", "Basil"],
    price: 199,
    image: "/bolognese.jpg",
    type: "pasta" as ProductType,
  },
  {
    id: 3,
    name: "Alfredo",
    ingredients: [
      "Fettuccine",
      "Cream Sauce",
      "Chicken",
      "Parmesan",
      "Parsley",
    ],
    price: 209,
    image: "/alfredo.webp",
    type: "pasta" as ProductType,
  },
];

export default function PastaSection() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pastas.map((pasta) => (
          <PizzaCard
            key={pasta.id}
            name={pasta.name}
            ingredients={pasta.ingredients}
            price={pasta.price}
            image={pasta.image}
            type={pasta.type}
          />
        ))}
      </div>
    </div>
  );
}
