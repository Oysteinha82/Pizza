"use client";

import PizzaCard from "./PizzaCard";
import { ProductType } from "@/types/product";
import { useLanguage } from "@/contexts/LanguageContext";
import { PRODUCT_PRICES } from "@/contexts/CartContext";
import { useTranslation } from "@/hooks/useTranslation";

// Midlertidig data for testing
const salads = [
  {
    id: 1,
    translationKey: "caesar",
    ingredients: [
      "Romaine Lettuce",
      "Chicken",
      "Parmesan",
      "Croutons",
      "Caesar Dressing",
    ],
    image: "/cesar.png",
    type: "salad" as ProductType,
  },
  {
    id: 2,
    translationKey: "greek",
    ingredients: [
      "Feta Cheese",
      "Olives",
      "Cucumber",
      "Tomatoes",
      "Red Onion",
      "Olive Oil",
    ],
    image: "/greek.jpg",
    type: "salad" as ProductType,
  },
  {
    id: 3,
    translationKey: "caprese",
    ingredients: [
      "Mozzarella",
      "Tomatoes",
      "Basil",
      "Balsamic Vinegar",
      "Olive Oil",
    ],
    image: "/caprese.png",
    type: "salad" as ProductType,
  },
  {
    id: 4,
    translationKey: "cobb",
    ingredients: [
      "Lettuce",
      "Chicken",
      "Bacon",
      "Avocado",
      "Blue Cheese",
      "Egg",
    ],
    image: "/cobb.jpg",
    type: "salad" as ProductType,
  },
];

export default function SaladSection() {
  const { language } = useLanguage();
  const { t } = useTranslation(language);

  return (
    <section className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-4">
        {salads.map((salad) => {
          const productPrice =
            PRODUCT_PRICES[salad.translationKey]?.prices[language]?.normal;
          if (!productPrice) {
            console.warn(
              `No price found for ${salad.translationKey} in ${language}`
            );
            return null;
          }
          return (
            <PizzaCard
              key={salad.id}
              name={t(`products.${salad.translationKey}.name`)}
              ingredients={salad.ingredients}
              price={productPrice}
              image={salad.image}
              type={salad.type}
              translationKey={salad.translationKey}
            />
          );
        })}
      </div>
    </section>
  );
}
