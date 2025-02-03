"use client";

import PizzaCard from "./PizzaCard";
import { ProductType } from "@/types/product";
import { useLanguage } from "@/contexts/LanguageContext";
import { PRODUCT_PRICES } from "@/contexts/CartContext";
import { useTranslation } from "@/hooks/useTranslation";

// Midlertidig data for testing
const pastas = [
  {
    id: 1,
    translationKey: "carbonara",
    ingredients: [
      "Spaghetti",
      "Eggs",
      "Pecorino Romano",
      "Guanciale",
      "Black Pepper",
    ],
    image: "/carbonara.webp",
    type: "pasta" as ProductType,
  },
  {
    id: 2,
    translationKey: "bolognese",
    ingredients: ["Tagliatelle", "Meat Sauce", "Parmesan", "Basil"],
    image: "/bolognese.jpg",
    type: "pasta" as ProductType,
  },
  {
    id: 3,
    translationKey: "alfredo",
    ingredients: [
      "Fettuccine",
      "Cream Sauce",
      "Chicken",
      "Parmesan",
      "Parsley",
    ],
    image: "/alfredo.webp",
    type: "pasta" as ProductType,
  },
  {
    id: 4,
    translationKey: "pesto",
    ingredients: [
      "Spaghetti",
      "Basil Pesto",
      "Pine Nuts",
      "Parmesan",
      "Olive Oil",
    ],
    image: "/pesto.webp",
    type: "pasta" as ProductType,
  },
];

export default function PastaSection() {
  const { language } = useLanguage();
  const { t } = useTranslation(language);

  return (
    <section className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-4">
        {pastas.map((pasta) => {
          const productPrice =
            PRODUCT_PRICES[pasta.translationKey]?.prices[language]?.normal;
          if (!productPrice) {
            console.warn(
              `No price found for ${pasta.translationKey} in ${language}`
            );
            return null;
          }
          return (
            <PizzaCard
              key={pasta.id}
              name={t(`products.${pasta.translationKey}.name`)}
              ingredients={pasta.ingredients}
              price={productPrice}
              image={pasta.image}
              type={pasta.type}
              translationKey={pasta.translationKey}
            />
          );
        })}
      </div>
    </section>
  );
}
