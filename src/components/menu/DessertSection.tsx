"use client";

import dynamic from "next/dynamic";
import { ProductType } from "@/types/product";
import { useLanguage } from "@/contexts/LanguageContext";
import { PRODUCT_PRICES } from "@/contexts/CartContext";
import { useTranslation } from "@/hooks/useTranslation";

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

const desserts = [
  {
    id: 1,
    translationKey: "tiramisu",
    ingredients: [
      "Ladyfingers",
      "Mascarpone",
      "Coffee",
      "Cocoa",
      "Marsala Wine",
    ],
    image: "/tira.jpg",
    type: "dessert" as ProductType,
  },
  {
    id: 2,
    translationKey: "panna_cotta",
    ingredients: ["Heavy Cream", "Vanilla", "Sugar", "Gelatin", "Berry Sauce"],
    image: "/pana.avif",
    type: "dessert" as ProductType,
  },
  {
    id: 3,
    translationKey: "gelato",
    ingredients: ["Milk", "Cream", "Sugar", "Natural Flavors", "Nuts"],
    image: "/gelato.jpg",
    type: "dessert" as ProductType,
  },
  {
    id: 4,
    translationKey: "chocolate_fondant",
    ingredients: [
      "Dark Chocolate",
      "Butter",
      "Eggs",
      "Sugar",
      "Vanilla Ice Cream",
    ],
    image: "/fondant.jpg",
    type: "dessert" as ProductType,
  },
];

export default function DessertSection() {
  const { language } = useLanguage();
  const { t } = useTranslation(language);

  return (
    <section className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-4">
        {desserts.map((dessert) => {
          const productPrice =
            PRODUCT_PRICES[dessert.translationKey]?.prices[language]?.normal;
          if (!productPrice) {
            console.warn(
              `No price found for ${dessert.translationKey} in ${language}`
            );
            return null;
          }
          return (
            <DynamicPizzaCard
              key={dessert.id}
              name={t(`products.${dessert.translationKey}.name`)}
              ingredients={dessert.ingredients}
              price={productPrice}
              image={dessert.image}
              type={dessert.type}
              translationKey={dessert.translationKey}
            />
          );
        })}
      </div>
    </section>
  );
}
