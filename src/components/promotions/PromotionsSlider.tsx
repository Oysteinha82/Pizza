"use client";

import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import PromotionCard from "./PromotionCard";
import ProductModal from "@/components/modals/ProductModal";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslation } from "@/hooks/useTranslation";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const promotions = [
  {
    translationKey: "christmas_special",
    discount: 30,
    image: "/pepperonispecial.jpg",
    price: 249,
    originalPrice: 359,
    type: "pizza" as const,
    ingredients: ["Tomato Sauce", "Mozzarella", "Pepperoni"],
    includedItems: ["Extra Cheese", "1.5L Coca-Cola"],
    defaultOptions: {
      cheeseOption: "normal" as const,
      includedDrink: "1.5L Coca-Cola",
    },
  },
  {
    translationKey: "triple_pizza",
    discount: 35,
    image: "/3-Small.jpg",
    price: 399,
    originalPrice: 599,
    type: "pizza" as const,
    pizzas: [
      {
        name: "Margherita Classic",
        ingredients: ["Tomato Sauce", "Mozzarella", "Fresh Basil"],
      },
      {
        name: "Pepperoni",
        ingredients: ["Tomato Sauce", "Mozzarella", "Pepperoni"],
      },
      {
        name: "Quattro Formaggi",
        ingredients: ["Mozzarella", "Gorgonzola", "Parmesan", "Cheddar"],
      },
    ],
    includedItems: ["1.5L Coca-Cola"],
    defaultOptions: {
      size: "small" as const,
      includedDrink: "1.5L Coca-Cola",
    },
  },
  {
    translationKey: "quattro_special",
    discount: 20,
    image: "/4cheese.jpg",
    price: 289,
    originalPrice: 359,
    type: "pizza" as const,
    ingredients: ["Mozzarella", "Gorgonzola", "Parmesan", "Cheddar"],
    includedItems: ["1.5L Coca-Cola"],
    defaultOptions: {
      includedDrink: "1.5L Coca-Cola",
    },
  },
];

export default function PromotionsSlider() {
  const [selectedPromotion, setSelectedPromotion] = useState<
    null | (typeof promotions)[0]
  >(null);
  const { language } = useLanguage();
  const { t } = useTranslation(language);
  const currency = t("productModal.currency");

  return (
    <>
      <section className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto">
          <Swiper
            modules={[Autoplay, Pagination, Navigation]}
            spaceBetween={0}
            slidesPerView={1}
            loop={true}
            grabCursor={true}
            touchEventsTarget="container"
            simulateTouch={true}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            pagination={{
              clickable: true,
              dynamicBullets: true,
            }}
            navigation={true}
            className="promotions-slider"
          >
            {promotions.map((promo, index) => (
              <SwiperSlide key={index}>
                <PromotionCard
                  title={t(`products.${promo.translationKey}.name`)}
                  description={t(
                    `products.${promo.translationKey}.description`
                  )}
                  discount={promo.discount}
                  image={promo.image}
                  price={promo.price}
                  originalPrice={promo.originalPrice}
                  onClick={() => setSelectedPromotion(promo)}
                  translationKey={promo.translationKey}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {selectedPromotion && (
        <ProductModal
          product={{
            name: t(`products.${selectedPromotion.translationKey}.name`),
            description: t(
              `products.${selectedPromotion.translationKey}.description`
            ),
            price:
              currency === "$"
                ? Math.round(selectedPromotion.price / 10.5)
                : selectedPromotion.price,
            image: selectedPromotion.image,
            type: selectedPromotion.type,
            ingredients: selectedPromotion.ingredients,
            includedItems: selectedPromotion.includedItems,
            defaultOptions: selectedPromotion.defaultOptions,
          }}
          onClose={() => setSelectedPromotion(null)}
        />
      )}
    </>
  );
}
