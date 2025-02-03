"use client";

import dynamic from "next/dynamic";
import { ProductType } from "@/types/product";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslation } from "@/hooks/useTranslation";
import { PRODUCT_PRICES } from "@/contexts/CartContext";

// Dynamically import PizzaCard with no SSR
const DynamicPizzaCard = dynamic(() => import("./PizzaCard"), {
  ssr: false,
  loading: () => (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden h-[400px] animate-pulse">
      <div className="h-56 bg-gray-200"></div>
      <div className="p-4">
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    </div>
  ),
});

// Midlertidig data for testing
const pizzas = [
  {
    id: 1,
    translationKey: "margherita",
    ingredients: ["Tomato Sauce", "Mozzarella", "Fresh Basil"],
    image: "/margarita.jpg",
    type: "pizza" as ProductType,
  },
  {
    id: 2,
    translationKey: "pepperoni",
    ingredients: ["Tomato Sauce", "Mozzarella", "Pepperoni"],
    image: "/pepperoni.avif",
    type: "pizza" as ProductType,
  },
  {
    id: 3,
    translationKey: "quattro_formaggi",
    ingredients: ["Mozzarella", "Gorgonzola", "Parmesan", "Cheddar"],
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
    image: "/parma.jpg",
    type: "pizza" as ProductType,
  },
  {
    id: 7,
    translationKey: "hawaiian",
    ingredients: ["Tomato Sauce", "Mozzarella", "Ham", "Pineapple", "Oregano"],
    image: "/hawaiian.png",
    type: "pizza" as ProductType,
  },
  {
    id: 8,
    translationKey: "capricciosa",
    ingredients: [
      "Tomato Sauce",
      "Mozzarella",
      "Ham",
      "Mushrooms",
      "Artichokes",
      "Olives",
    ],
    image: "/capricciosa.jpg",
    type: "pizza" as ProductType,
  },
];

export default function PizzaSection() {
  const { language } = useLanguage();
  const { t } = useTranslation(language);

  return (
    <section className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-4">
        {pizzas.map((pizza) => {
          const productPrice =
            PRODUCT_PRICES[pizza.translationKey]?.prices[language]?.normal;
          if (!productPrice) {
            console.warn(
              `No price found for ${pizza.translationKey} in ${language}`
            );
            return null;
          }
          return (
            <DynamicPizzaCard
              key={pizza.id}
              name={t(`products.${pizza.translationKey}.name`)}
              description={t(`products.${pizza.translationKey}.description`)}
              ingredients={pizza.ingredients}
              price={productPrice}
              image={pizza.image}
              type={pizza.type}
              translationKey={pizza.translationKey}
            />
          );
        })}
      </div>
    </section>
  );
}
