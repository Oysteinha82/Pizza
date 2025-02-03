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

const drinks = [
  {
    id: 1,
    translationKey: "coca_cola",
    ingredients: ["cola_extract", "natural_flavors"],
    image: "/cola.webp",
    type: "drinks" as ProductType,
  },
  {
    id: 2,
    translationKey: "sprite",
    ingredients: ["Sugar", "Lemon", "Lime"],
    image: "/sprite.jpg",
    type: "drinks" as ProductType,
  },
  {
    id: 3,
    translationKey: "fanta",
    ingredients: ["Sugar", "Orange Juice", "Natural Flavors"],
    image: "/fanta.jpg",
    type: "drinks" as ProductType,
  },
  {
    id: 4,
    translationKey: "san_pellegrino",
    ingredients: ["mineral_water", "natural_carbonation"],
    image: "/pele.jpg",
    type: "drinks" as ProductType,
  },
];

export default function DrinksSection() {
  const { language } = useLanguage();
  const { t } = useTranslation(language);

  return (
    <section className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-4">
        {drinks.map((drink) => {
          const prices = PRODUCT_PRICES[drink.translationKey]?.prices[language];
          if (!prices) {
            console.warn(
              `No prices found for ${drink.translationKey} in ${language}`
            );
            return null;
          }

          return (
            <DynamicPizzaCard
              key={drink.id}
              name={t(`products.${drink.translationKey}.name`)}
              description={t(`products.${drink.translationKey}.description`)}
              ingredients={drink.ingredients}
              price={prices["0.33L"]}
              sizes={prices}
              image={drink.image}
              type={drink.type}
              translationKey={drink.translationKey}
            />
          );
        })}
      </div>
    </section>
  );
}
