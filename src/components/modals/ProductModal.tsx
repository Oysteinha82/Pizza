import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslation } from "@/hooks/useTranslation";

interface ProductModalProps {
  onClose: () => void;
  product: {
    name: string;
    description: string;
    price: number;
    image: string;
    type?: "pizza" | "pasta" | "salad" | "dessert" | "drinks" | "dips";
    ingredients?: string[];
    pizzas?: Array<{
      name: string;
      ingredients: string[];
    }>;
    includedItems?: string[];
    defaultOptions?: {
      cheeseOption?: "normal" | "extra" | "double";
      includedDrink?: string;
      size?: "small" | "large";
    };
  };
}

export default function ProductModal({ onClose, product }: ProductModalProps) {
  const { language } = useLanguage();
  const { t } = useTranslation(language);
  const currency = t("productModal.currency");

  // Sjekker om det er en pizza eller pizza-promotion
  const isPizza =
    product.type === "pizza" ||
    (product.name && product.name.toLowerCase().includes("pizza")) ||
    (product.description &&
      product.description.toLowerCase().includes("pizza"));

  // State for pizza options - nå med standardvalg fra props
  const [size, setSize] = useState<"small" | "large">("small");
  const [cheeseOption, setCheeseOption] = useState<
    "normal" | "extra" | "double"
  >(product.defaultOptions?.cheeseOption || "normal");
  const [isWellDone, setIsWellDone] = useState(false);
  const [quantity, setQuantity] = useState(1);

  // Calculate price adjustments
  const basePrice = product.price;
  const sizeMultiplier = size === "large" ? 1.4 : 1; // 40% more for large

  // Cheese price adjustments in NOK
  const cheeseNOK =
    cheeseOption === "extra" ? 20 : cheeseOption === "double" ? 35 : 0;
  // Convert cheese price to USD if needed
  const cheesePrice =
    currency === "$" ? Math.round(cheeseNOK / 10.5) : cheeseNOK;

  const totalPrice = Math.round(
    (basePrice * sizeMultiplier + cheesePrice) * quantity
  );

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= 99) {
      setQuantity(newQuantity);
    }
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
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-8 bg-black/70 backdrop-blur-sm">
      <div className="relative bg-white rounded-2xl w-full max-w-6xl h-[90vh] sm:h-[85vh] overflow-hidden flex flex-col lg:flex-row">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 text-white hover:text-gray-200 transition-colors bg-black/30 p-2 rounded-full"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Left side - Image - adjusted to 60% */}
        <div className="w-full lg:w-[60%] relative h-1/3 sm:h-2/5 lg:h-full">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right side - Content - adjusted to 40% */}
        <div className="w-full lg:w-[40%] p-6 sm:p-8 overflow-y-auto flex flex-col">
          {/* Header */}
          <div className="mb-4">
            <h2 className="text-2xl sm:text-3xl font-bold font-playfair mb-2">
              {product.name}
            </h2>
            <p className="text-gray-600 text-sm mb-3">{product.description}</p>

            {/* Regular Ingredients or Multiple Pizzas */}
            {product.ingredients && product.ingredients.length > 0 && (
              <div className="mb-3">
                <h3 className="text-sm font-semibold mb-2">
                  {t("productModal.ingredients")}
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {product.ingredients.map((ingredient, index) => (
                    <span
                      key={index}
                      className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                    >
                      {t(`ingredients.${normalizeIngredient(ingredient)}`)}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Multiple Pizzas Section */}
            {product.pizzas && product.pizzas.length > 0 && (
              <div className="mb-3">
                <h3 className="text-sm font-semibold mb-2">
                  {t("productModal.pizzas")}
                </h3>
                <div className="space-y-3">
                  {product.pizzas.map((pizza, index) => (
                    <div key={index} className="bg-gray-50 p-3 rounded-lg">
                      <h4 className="font-medium text-sm mb-1.5">
                        {pizza.name}
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {pizza.ingredients.map((ingredient, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                          >
                            {t(
                              `ingredients.${normalizeIngredient(ingredient)}`
                            )}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Included Items */}
            {product.includedItems && product.includedItems.length > 0 && (
              <div className="mb-3">
                <h3 className="text-sm font-semibold mb-2">
                  {t("productModal.included")}
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {product.includedItems.map((item, index) => (
                    <span
                      key={index}
                      className="px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-xs flex items-center gap-1"
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
          </div>

          {/* Quantity Selection - For all products */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">
              {t("productModal.quantity")}
            </h3>
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleQuantityChange(-1)}
                className="w-10 h-10 rounded-full border-2 border-gray-200 flex items-center justify-center text-lg hover:border-red-500 hover:text-red-500 transition-colors"
              >
                -
              </button>
              <span className="text-xl font-bold w-10 text-center">
                {quantity}
              </span>
              <button
                onClick={() => handleQuantityChange(1)}
                className="w-10 h-10 rounded-full border-2 border-gray-200 flex items-center justify-center text-lg hover:border-red-500 hover:text-red-500 transition-colors"
              >
                +
              </button>
            </div>
          </div>

          {/* Pizza-specific options */}
          {isPizza && (
            <div className="space-y-6">
              {/* Size Selection */}
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  {t("productModal.size.title")}
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setSize("small")}
                    className={`py-2 px-3 rounded-xl border-2 transition-all ${
                      size === "small"
                        ? "border-red-500 bg-red-50 text-red-600"
                        : "border-gray-200 hover:border-red-200"
                    }`}
                  >
                    <div className="text-base font-medium">
                      {t("productModal.size.small")}
                    </div>
                  </button>
                  <button
                    onClick={() => setSize("large")}
                    className={`py-2 px-3 rounded-xl border-2 transition-all ${
                      size === "large"
                        ? "border-red-500 bg-red-50 text-red-600"
                        : "border-gray-200 hover:border-red-200"
                    }`}
                  >
                    <div className="text-base font-medium">
                      {t("productModal.size.large")}
                    </div>
                  </button>
                </div>
              </div>

              {/* Cheese Options */}
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  {t("productModal.extraCheese.title")}
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => setCheeseOption("normal")}
                    className={`py-2 px-3 rounded-xl border-2 transition-all ${
                      cheeseOption === "normal"
                        ? "border-red-500 bg-red-50 text-red-600"
                        : "border-gray-200 hover:border-red-200"
                    }`}
                  >
                    <div className="text-base font-medium">
                      {t("productModal.extraCheese.normal")}
                    </div>
                  </button>
                  <button
                    onClick={() => setCheeseOption("extra")}
                    className={`py-2 px-3 rounded-xl border-2 transition-all ${
                      cheeseOption === "extra"
                        ? "border-red-500 bg-red-50 text-red-600"
                        : "border-gray-200 hover:border-red-200"
                    }`}
                  >
                    <div className="text-base font-medium">
                      {t("productModal.extraCheese.extra")}
                    </div>
                  </button>
                  <button
                    onClick={() => setCheeseOption("double")}
                    className={`py-2 px-3 rounded-xl border-2 transition-all ${
                      cheeseOption === "double"
                        ? "border-red-500 bg-red-50 text-red-600"
                        : "border-gray-200 hover:border-red-200"
                    }`}
                  >
                    <div className="text-base font-medium">
                      {t("productModal.extraCheese.double")}
                    </div>
                  </button>
                </div>
              </div>

              {/* Cooking Preference */}
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  {t("productModal.cookingPreference.title")}
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setIsWellDone(false)}
                    className={`py-2 px-3 rounded-xl border-2 transition-all ${
                      !isWellDone
                        ? "border-red-500 bg-red-50 text-red-600"
                        : "border-gray-200 hover:border-red-200"
                    }`}
                  >
                    <div className="text-base font-medium">
                      {t("productModal.cookingPreference.normal")}
                    </div>
                  </button>
                  <button
                    onClick={() => setIsWellDone(true)}
                    className={`py-2 px-3 rounded-xl border-2 transition-all ${
                      isWellDone
                        ? "border-red-500 bg-red-50 text-red-600"
                        : "border-gray-200 hover:border-red-200"
                    }`}
                  >
                    <div className="text-base font-medium">
                      {t("productModal.cookingPreference.wellDone")}
                    </div>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Footer with Price and Add to Cart */}
          <div className="mt-auto pt-4 border-t">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">
                  {t("productModal.total")}
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {currency === "$" ? "$" : ""}
                  {totalPrice}
                  {currency === "kr" ? " kr" : ""}
                </p>
              </div>
              <button
                onClick={onClose}
                className="bg-red-500 hover:bg-red-600 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-full transition-colors font-medium text-base sm:text-lg shadow-lg hover:shadow-xl flex items-center gap-2"
              >
                {t("productModal.addToCart")}
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
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
  );
}
