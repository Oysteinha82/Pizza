"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "@/hooks/useTranslation";
import { useLanguage } from "@/contexts/LanguageContext";
import dynamic from "next/dynamic";
import { ProductType } from "@/types/product";

// Dynamically import PizzaCard with no SSR
const DynamicPizzaCard = dynamic(() => import("./PizzaCard"), { ssr: false });

const categories = [
  { id: "pizza", emoji: "🍕" },
  { id: "pasta", emoji: "🍝" },
  { id: "salad", emoji: "🥗" },
  { id: "dessert", emoji: "🍰" },
  { id: "drinks", emoji: "🥤" },
  { id: "dips", emoji: "🥫" },
];

export default function Menu() {
  const { language } = useLanguage();
  const { t } = useTranslation(language);
  const [activeCategory, setActiveCategory] = useState("pizza");

  return (
    <section className="py-16 bg-gradient-to-b from-white to-stone-50">
      <div className="container mx-auto px-4">
        {/* Category Navigation */}
        <nav className="flex justify-center mb-12">
          <div className="flex gap-4 p-2 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg">
            {categories.map((category, index) => (
              <motion.button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`relative px-6 py-3 rounded-xl transition-all duration-300
                  ${
                    activeCategory === category.id
                      ? "text-red-600 bg-red-50"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  className="flex items-center gap-2"
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <span className="text-2xl">{category.emoji}</span>
                  <span className="font-medium capitalize">
                    {t(`menu.categories.${category.id}`)}
                  </span>
                </motion.div>
                {activeCategory === category.id && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-1 bg-red-500 rounded-full"
                    layoutId="activeCategory"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </motion.button>
            ))}
          </div>
        </nav>

        {/* Menu Grid */}
        <div className="max-w-8xl mx-auto">
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8"
          >
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, delay: item * 0.1 }}
              >
                <DynamicPizzaCard
                  name={`${t(`menu.${activeCategory}.item${item}.name`)}`}
                  description={t(
                    `menu.${activeCategory}.item${item}.description`
                  )}
                  price={199}
                  image="/images/pizza-placeholder.jpg"
                  ingredients={["tomato", "cheese", "basil"]}
                  type={activeCategory as ProductType}
                  translationKey={`${activeCategory}_item${item}`}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
