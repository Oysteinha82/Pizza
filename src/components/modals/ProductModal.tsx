import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslation } from "@/hooks/useTranslation";
import { PRODUCT_PRICES } from "@/contexts/CartContext";

interface ProductModalProps {
  onClose: () => void;
  onAddToCart?: (options: any) => void;
  product: {
    name: string;
    description: string;
    price: number;
    image: string;
    type?: "pizza" | "pasta" | "salad" | "dessert" | "drinks" | "dips";
    ingredients?: string[];
    allergener?: string[];
    spicyLevel?: number;
    pizzas?: Array<{
      name: string;
      ingredients: string[];
    }>;
    includedItems?: string[];
    defaultOptions?: {
      cheeseOption?: "normal" | "extra" | "double";
      includedDrink?: string;
      size?: "small" | "large";
      drinkSize?: "0.33L" | "0.5L" | "1.5L";
    };
    translationKey?: string;
    sizes?: { [key: string]: number };
  };
}

export default function ProductModal({
  onClose,
  onAddToCart,
  product,
}: ProductModalProps) {
  const { language } = useLanguage();
  const { t } = useTranslation(language);
  const currency = t("productModal.currency");

  // Faste tilleggspriser basert på språk
  const LARGE_PIZZA_PRICES = {
    no: 70,
    en: 7,
  };

  const LARGE_PASTA_PRICES = {
    no: 50,
    en: 5,
  };

  const LARGE_SALAD_PRICES = {
    no: 40,
    en: 4,
  };

  const CHEESE_PRICES = {
    extra: {
      no: 20,
      en: 2,
    },
    double: {
      no: 35,
      en: 4,
    },
  };

  // Hent produktpriser fra PRODUCT_PRICES
  const productPrices = product.translationKey
    ? PRODUCT_PRICES[product.translationKey]?.prices[
        language === "no" ? "no" : "en"
      ]
    : null;

  // Sjekker om det er en pizza eller pizza-promotion
  const isPizza =
    product.type === "pizza" ||
    (product.name && product.name.toLowerCase().includes("pizza")) ||
    (product.description &&
      product.description.toLowerCase().includes("pizza"));

  // Sjekker om det er en pasta eller salat
  const isPastaOrSalad = product.type === "pasta" || product.type === "salad";

  // State for pizza options
  const [size, setSize] = useState<"small" | "large">(
    product.defaultOptions?.size || "small"
  );
  const [cheeseOption, setCheeseOption] = useState<
    "normal" | "extra" | "double"
  >(product.defaultOptions?.cheeseOption || "normal");
  const [isWellDone, setIsWellDone] = useState(false);

  // State for drink size
  const [drinkSize, setDrinkSize] = useState<"0.33L" | "0.5L" | "1.5L">(
    product.defaultOptions?.drinkSize || "0.33L"
  );

  // Beregn pris basert på valg
  const extraCheesePrice =
    cheeseOption === "extra" && !product.defaultOptions?.cheeseOption
      ? CHEESE_PRICES.extra[language === "no" ? "no" : "en"]
      : cheeseOption === "double" && !product.defaultOptions?.cheeseOption
      ? CHEESE_PRICES.double[language === "no" ? "no" : "en"]
      : 0;

  const basePrice =
    product.type === "drinks" && product.sizes
      ? product.sizes[drinkSize]
      : productPrices?.normal ?? product.price;

  const largeSizePrice = isPizza
    ? size === "large" && !product.defaultOptions?.size
      ? LARGE_PIZZA_PRICES[language === "no" ? "no" : "en"]
      : 0
    : product.type === "pasta"
    ? size === "large" && !product.defaultOptions?.size
      ? LARGE_PASTA_PRICES[language === "no" ? "no" : "en"]
      : 0
    : product.type === "salad"
    ? size === "large" && !product.defaultOptions?.size
      ? LARGE_SALAD_PRICES[language === "no" ? "no" : "en"]
      : 0
    : 0;

  const sizePrice =
    size === "large" && !product.defaultOptions?.size ? largeSizePrice : 0;

  // Hvis det er en trippel pizza, gang tilleggsprisene med 3
  const finalExtraCheesePrice =
    product.translationKey === "triple_pizza"
      ? extraCheesePrice * 3
      : extraCheesePrice;
  const finalSizePrice =
    product.translationKey === "triple_pizza" ? sizePrice * 3 : sizePrice;

  const totalPrice = basePrice + finalExtraCheesePrice + finalSizePrice;

  const handleAddToCart = () => {
    // Beregn riktig pristillegg basert på størrelse
    let finalSizePrice = 0;
    if (size === "large" && !product.defaultOptions?.size) {
      if (isPizza) {
        finalSizePrice = LARGE_PIZZA_PRICES[language === "no" ? "no" : "en"];
      } else if (product.type === "pasta") {
        finalSizePrice = LARGE_PASTA_PRICES[language === "no" ? "no" : "en"];
      } else if (product.type === "salad") {
        finalSizePrice = LARGE_SALAD_PRICES[language === "no" ? "no" : "en"];
      }
    }

    // Beregn riktig pristillegg for ost
    let finalCheesePrice = 0;
    if (!product.defaultOptions?.cheeseOption) {
      if (cheeseOption === "extra") {
        finalCheesePrice = CHEESE_PRICES.extra[language === "no" ? "no" : "en"];
      } else if (cheeseOption === "double") {
        finalCheesePrice =
          CHEESE_PRICES.double[language === "no" ? "no" : "en"];
      }
    }

    // Hvis det er en trippel pizza, gang pristilleggene med 3
    if (product.translationKey === "triple_pizza") {
      finalSizePrice *= 3;
      finalCheesePrice *= 3;
    }

    // Sett valuta basert på språket produktet ble lagt til med
    const currency = language === "no" ? "NOK" : "USD";
    const finalTotalPrice = basePrice + finalSizePrice + finalCheesePrice;

    // Legg til i handlekurven med riktige priser og valuta
    onAddToCart?.({
      size,
      cheeseOption,
      isWellDone,
      drinkSize,
      extraPrices: {
        size: finalSizePrice,
        cheese: finalCheesePrice,
      },
      basePrice: basePrice,
      totalPrice: finalTotalPrice,
      currency,
      originalLanguage: language, // Lagre språket produktet ble lagt til med
    });
  };

  // Function to normalize ingredient name for translation
  const normalizeIngredient = (ingredient: string) => {
    return ingredient
      .toLowerCase()
      .replace(/ & /g, "_")
      .replace(/ /g, "_")
      .replace(/\./g, "");
  };

  return (
    <div className="fixed inset-0 bg-black/75 z-[100] flex items-center justify-center p-4">
      <div className="relative w-full max-w-6xl">
        <button
          onClick={onClose}
          className="absolute -top-4 -right-4 z-[102] p-1.5 sm:p-2 rounded-full bg-red-600 hover:bg-red-700 transition-colors shadow-lg border-2 border-white group"
        >
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5 text-white transform transition-transform duration-200 group-hover:rotate-90"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <div className="bg-white rounded-xl w-full max-h-[90vh] sm:max-h-[85vh] overflow-hidden shadow-2xl">
          <div className="flex flex-col lg:flex-row h-full">
            {/* Left side - Image */}
            <div className="w-full lg:w-[70%] relative h-48 sm:h-64 lg:h-auto">
              <img
                src={product.image}
                alt={product.name}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
            </div>

            {/* Right side - Content */}
            <div className="w-full lg:w-[30%] h-[calc(90vh-12rem)] sm:h-[calc(85vh-16rem)] lg:h-[85vh] flex flex-col bg-white">
              <div className="flex-1 min-h-0 overflow-y-auto">
                <div className="p-4 sm:p-5">
                  <div className="mb-5">
                    <h2 className="text-xl sm:text-2xl font-bold mb-2 font-playfair">
                      {product.name}
                    </h2>
                    <p className="text-gray-600 text-sm sm:text-base">
                      {product.description}
                    </p>
                  </div>

                  {/* Regular Ingredients */}
                  {product.ingredients &&
                    product.ingredients.length > 0 &&
                    !product.pizzas && (
                      <div className="mb-5">
                        <h3 className="text-xs font-semibold mb-2 uppercase tracking-wide text-gray-700">
                          {t("productModal.ingredients")}
                        </h3>
                        <div className="flex flex-wrap gap-1.5">
                          {product.ingredients.map((ingredient, index) => (
                            <span
                              key={index}
                              className="px-2.5 py-1 bg-red-50 text-gray-600 rounded-lg text-xs font-medium transition-all duration-300 hover:bg-red-100"
                            >
                              {t(
                                `ingredients.${normalizeIngredient(ingredient)}`
                              )}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                  {/* Multiple Pizzas Section - Simplified */}
                  {product.pizzas && product.pizzas.length > 0 && (
                    <div className="mb-5">
                      <h3 className="text-xs font-semibold mb-2 uppercase tracking-wide text-gray-700">
                        {t("productModal.pizzas")}
                      </h3>
                      <div className="space-y-1.5">
                        {product.pizzas.map((pizza, index) => (
                          <div
                            key={index}
                            className="bg-gray-50 px-3 py-2 rounded-lg border border-gray-100"
                          >
                            <p className="text-sm text-gray-700">
                              {pizza.name}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Included Items */}
                  {product.includedItems &&
                    product.includedItems.length > 0 && (
                      <div className="mb-5">
                        <h3 className="text-xs font-semibold mb-2 uppercase tracking-wide text-gray-700">
                          {t("productModal.included")}
                        </h3>
                        <div className="flex flex-wrap gap-1.5">
                          {product.includedItems.map((item, index) => (
                            <span
                              key={index}
                              className="px-2.5 py-1 bg-green-50 text-green-700 rounded-full text-xs border border-green-100 flex items-center gap-1"
                            >
                              <svg
                                className="w-3 h-3"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                  {/* Size Options for Pizza, Pasta and Salad */}
                  {(isPizza || isPastaOrSalad) &&
                    !product.name.toLowerCase().includes("dip") && (
                      <div className="space-y-4 mb-6">
                        <div>
                          <h3 className="text-xs font-semibold mb-2 uppercase tracking-wide text-gray-700">
                            {t("productModal.size.title")}
                          </h3>
                          <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
                            <button
                              onClick={() => setSize("small")}
                              className={`py-1.5 px-2 sm:py-1.5 sm:px-2.5 lg:py-2 lg:px-3 rounded-lg border transition-all text-xs sm:text-sm flex items-center justify-center ${
                                size === "small"
                                  ? "border-red-500 bg-red-50 text-red-600 font-medium"
                                  : "border-gray-200 hover:border-red-200 text-gray-700"
                              }`}
                            >
                              {isPizza ? '12" (30cm)' : "Normal"}
                            </button>
                            <button
                              onClick={() => setSize("large")}
                              className={`py-1.5 px-2 sm:py-1.5 sm:px-2.5 lg:py-2 lg:px-3 rounded-lg border transition-all text-xs sm:text-sm flex flex-col items-center ${
                                size === "large"
                                  ? "border-red-500 bg-red-50 text-red-600 font-medium"
                                  : "border-gray-200 hover:border-red-200 text-gray-700"
                              }`}
                            >
                              <span>{isPizza ? '18" (45cm)' : "Large"}</span>
                              <span className="text-[10px] sm:text-xs text-gray-500">
                                (+{largeSizePrice}
                                {currency})
                              </span>
                            </button>
                          </div>
                        </div>

                        {/* Cheese Options - Only for Pizza */}
                        {isPizza && (
                          <div>
                            <h3 className="text-xs font-semibold mb-2 uppercase tracking-wide text-gray-700">
                              {t("productModal.extraCheese.title")}
                            </h3>
                            <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                              <button
                                onClick={() => setCheeseOption("normal")}
                                className={`py-1.5 px-2 sm:py-1.5 sm:px-2.5 lg:py-2 lg:px-3 rounded-lg border transition-all text-xs sm:text-sm flex items-center justify-center ${
                                  cheeseOption === "normal"
                                    ? "border-red-500 bg-red-50 text-red-600 font-medium"
                                    : "border-gray-200 hover:border-red-200 text-gray-700"
                                }`}
                              >
                                {t("productModal.extraCheese.normal")
                                  .split("+")[0]
                                  .trim()}
                              </button>
                              <button
                                onClick={() => setCheeseOption("extra")}
                                className={`py-1.5 px-2 sm:py-1.5 sm:px-2.5 lg:py-2 lg:px-3 rounded-lg border transition-all text-xs sm:text-sm flex flex-col items-center ${
                                  cheeseOption === "extra"
                                    ? "border-red-500 bg-red-50 text-red-600 font-medium"
                                    : "border-gray-200 hover:border-red-200 text-gray-700"
                                }`}
                              >
                                <span>
                                  {t("productModal.extraCheese.extra")
                                    .split("+")[0]
                                    .trim()}
                                </span>
                                <span className="text-[10px] sm:text-xs text-gray-500">
                                  (+
                                  {
                                    CHEESE_PRICES.extra[
                                      language === "no" ? "no" : "en"
                                    ]
                                  }
                                  {currency})
                                </span>
                              </button>
                              <button
                                onClick={() => setCheeseOption("double")}
                                className={`py-1.5 px-2 sm:py-1.5 sm:px-2.5 lg:py-2 lg:px-3 rounded-lg border transition-all text-xs sm:text-sm flex flex-col items-center ${
                                  cheeseOption === "double"
                                    ? "border-red-500 bg-red-50 text-red-600 font-medium"
                                    : "border-gray-200 hover:border-red-200 text-gray-700"
                                }`}
                              >
                                <span>
                                  {t("productModal.extraCheese.double")
                                    .split("+")[0]
                                    .trim()}
                                </span>
                                <span className="text-[10px] sm:text-xs text-gray-500">
                                  (+
                                  {
                                    CHEESE_PRICES.double[
                                      language === "no" ? "no" : "en"
                                    ]
                                  }
                                  {currency})
                                </span>
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Cooking Preference - Only for Pizza */}
                        {isPizza && (
                          <div>
                            <h3 className="text-xs font-semibold mb-2 uppercase tracking-wide text-gray-700">
                              {t("productModal.cookingPreference.title")}
                            </h3>
                            <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
                              <button
                                onClick={() => setIsWellDone(false)}
                                className={`py-1.5 px-2 sm:py-1.5 sm:px-2.5 lg:py-2 lg:px-3 rounded-lg border transition-all text-xs sm:text-sm ${
                                  !isWellDone
                                    ? "border-red-500 bg-red-50 text-red-600 font-medium"
                                    : "border-gray-200 hover:border-red-200 text-gray-700"
                                }`}
                              >
                                {t("productModal.cookingPreference.normal")}
                              </button>
                              <button
                                onClick={() => setIsWellDone(true)}
                                className={`py-1.5 px-2 sm:py-1.5 sm:px-2.5 lg:py-2 lg:px-3 rounded-lg border transition-all text-xs sm:text-sm ${
                                  isWellDone
                                    ? "border-red-500 bg-red-50 text-red-600 font-medium"
                                    : "border-gray-200 hover:border-red-200 text-gray-700"
                                }`}
                              >
                                {t("productModal.cookingPreference.wellDone")}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                  {/* Drink Size Options */}
                  {product.type === "drinks" && product.sizes && (
                    <div className="space-y-4 mb-6">
                      <div>
                        <h3 className="text-xs font-semibold mb-2 uppercase tracking-wide text-gray-700">
                          {t("productModal.size.title")}
                        </h3>
                        <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                          {Object.entries(product.sizes).map(
                            ([size, price]) => (
                              <button
                                key={size}
                                onClick={() =>
                                  setDrinkSize(
                                    size as "0.33L" | "0.5L" | "1.5L"
                                  )
                                }
                                className={`py-1.5 px-2 sm:py-1.5 sm:px-2.5 lg:py-2 lg:px-3 rounded-lg border transition-all text-xs sm:text-sm flex flex-col items-center ${
                                  drinkSize === size
                                    ? "border-red-500 bg-red-50 text-red-600 font-medium"
                                    : "border-gray-200 hover:border-red-200 text-gray-700"
                                }`}
                              >
                                <span>{size}</span>
                                <span className="text-[10px] sm:text-xs text-gray-500">
                                  ({price}
                                  {currency})
                                </span>
                              </button>
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom fixed section with Add to Cart */}
              <div className="p-3 sm:p-4 border-t border-gray-100 bg-white flex-shrink-0">
                <div className="flex items-center justify-between mb-2 sm:mb-3">
                  <div className="flex items-baseline gap-1 sm:gap-1.5">
                    <span className="text-xs sm:text-sm text-gray-500 uppercase tracking-wider">
                      {t("productModal.total")}
                    </span>
                    <span className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 font-oswald tracking-tight">
                      {currency === "kr" ? (
                        <>
                          {totalPrice}
                          <span className="text-base sm:text-lg font-medium ml-0.5">
                            {currency}
                          </span>
                        </>
                      ) : (
                        <>
                          <span className="text-base sm:text-lg font-medium mr-0.5">
                            {currency}
                          </span>
                          {totalPrice}
                        </>
                      )}
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleAddToCart}
                  className="w-full h-9 sm:h-10 bg-red-600 text-white rounded-full font-medium tracking-wide shadow-md hover:bg-red-700 hover:shadow-lg active:scale-[0.98] transition-all duration-200 text-sm sm:text-base flex items-center justify-center gap-2"
                >
                  <span>{t("productModal.addToCart")}</span>
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
