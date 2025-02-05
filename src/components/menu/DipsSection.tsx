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

const dips = [
  {
    id: 1,
    translationKey: "aioli",
    ingredients: ["Garlic", "Olive Oil", "Egg Yolk", "Lemon Juice", "Herbs"],
    image: "/aioli.jpg",
    type: "dip" as ProductType,
  },
  {
    id: 2,
    translationKey: "salsa",
    ingredients: ["Tomatoes", "Onion", "Jalapeño", "Cilantro", "Lime"],
    image: "/salsa.webp",
    type: "dip" as ProductType,
  },
  {
    id: 3,
    translationKey: "bearnaise",
    ingredients: [
      "Egg Yolk",
      "Butter",
      "White Wine Vinegar",
      "Tarragon",
      "Shallots",
    ],
    image: "/bernaise.jpeg",
    type: "dip" as ProductType,
  },
  {
    id: 4,
    translationKey: "garlic",
    ingredients: ["Fresh Garlic", "Cream", "Butter", "Herbs", "Salt"],
    image: "/garlic.jpg",
    type: "dip" as ProductType,
  },
];

export default function DipsSection() {
  const { language } = useLanguage();
  const { t } = useTranslation(language);

  return (
    <section className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-4">
        {dips.map((dip) => {
          const productPrice =
            PRODUCT_PRICES[dip.translationKey]?.prices[language]?.normal;
          if (!productPrice) {
            console.warn(
              `No price found for ${dip.translationKey} in ${language}`
            );
            return null;
          }
          return (
            <DynamicPizzaCard
              key={dip.id}
              name={t(`products.${dip.translationKey}.name`)}
              ingredients={dip.ingredients}
              price={productPrice}
              image={dip.image}
              type={dip.type}
              translationKey={dip.translationKey}
            />
          );
        })}
      </div>
    </section>
  );
}
