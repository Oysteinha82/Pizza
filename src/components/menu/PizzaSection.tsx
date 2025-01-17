"use client";

import dynamic from "next/dynamic";
import { ProductType } from "@/types/product";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslation } from "@/hooks/useTranslation";

// Dynamically import PizzaCard with no SSR
const DynamicPizzaCard = dynamic(() => import("./PizzaCard"), { ssr: false });

// Midlertidig data for testing
const pizzas = [
  {
    id: 1,
    translationKey: "margherita",
    ingredients: ["Tomato Sauce", "Mozzarella", "Fresh Basil"],
    price: 189,
    image: "/margarita.jpg",
    type: "pizza" as ProductType,
  },
  {
    id: 2,
    translationKey: "pepperoni",
    ingredients: ["Tomato Sauce", "Mozzarella", "Pepperoni"],
    price: 209,
    image: "/pepperoni.avif",
    type: "pizza" as ProductType,
  },
  {
    id: 3,
    translationKey: "quattro_formaggi",
    ingredients: ["Mozzarella", "Gorgonzola", "Parmesan", "Cheddar"],
    price: 229,
    image: "/4cheese.jpg",
    type: "pizza" as ProductType,
  },
  {
    id: 4,
    translationKey: "vegetariana",
    ingredients: [
      "Tomato Sauce",
      "Mozzarella",
      "Mushrooms",
      "Bell Peppers",
      "Red Onion",
      "Olives",
      "Cherry Tomatoes",
    ],
    price: 199,
    image: "/vegan.avif",
    type: "pizza" as ProductType,
  },
  {
    id: 5,
    translationKey: "diavola",
    ingredients: [
      "Tomato Sauce",
      "Mozzarella",
      "Spicy Salami",
      "Chili",
      "Olives",
    ],
    price: 219,
    image: "/diavola.jpg",
    type: "pizza" as ProductType,
  },
  {
    id: 6,
    translationKey: "prosciutto_rucola",
    ingredients: [
      "Tomato Sauce",
      "Mozzarella",
      "Prosciutto",
      "Arugula",
      "Parmesan",
    ],
    price: 239,
    image: "/parma.jpg",
    type: "pizza" as ProductType,
  },
];

export default function PizzaSection() {
  const { language } = useLanguage();
  const { t } = useTranslation(language);

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {pizzas.map((pizza) => (
            <DynamicPizzaCard
              key={pizza.id}
              name={t(`products.${pizza.translationKey}.name`)}
              description={t(`products.${pizza.translationKey}.description`)}
              ingredients={pizza.ingredients}
              price={pizza.price}
              image={pizza.image}
              type={pizza.type}
              translationKey={pizza.translationKey}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
