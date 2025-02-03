"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useLanguage } from "./LanguageContext";

interface ProductPrices {
  id: string;
  prices: {
    en: {
      normal?: number;
      large?: number;
      "0.33L"?: number;
      "0.5L"?: number;
      "1.5L"?: number;
    };
    no: {
      normal?: number;
      large?: number;
      "0.33L"?: number;
      "0.5L"?: number;
      "1.5L"?: number;
    };
  };
}

export const PRODUCT_PRICES: { [key: string]: ProductPrices } = {
  // Promotions
  christmas_special: {
    id: "christmas_special",
    prices: {
      en: { normal: 25, large: 32 },
      no: { normal: 249, large: 319 },
    },
  },
  pepperoni_special: {
    id: "pepperoni_special",
    prices: {
      en: { normal: 25, large: 32 },
      no: { normal: 249, large: 319 },
    },
  },
  triple_pizza: {
    id: "triple_pizza",
    prices: {
      en: { normal: 40, large: 61 },
      no: { normal: 399, large: 609 },
    },
  },
  quattro_special: {
    id: "quattro_special",
    prices: {
      en: { normal: 29, large: 36 },
      no: { normal: 289, large: 359 },
    },
  },
  family_deal: {
    id: "family_deal",
    prices: {
      en: { normal: 45, large: 59 },
      no: { normal: 449, large: 589 },
    },
  },
  // Pizzas - unique prices for each pizza
  margherita: {
    id: "margherita",
    prices: {
      en: { normal: 15, large: 22 },
      no: { normal: 149, large: 219 },
    },
  },
  pepperoni: {
    id: "pepperoni",
    prices: {
      en: { normal: 17, large: 24 },
      no: { normal: 169, large: 239 },
    },
  },
  diavola: {
    id: "diavola",
    prices: {
      en: { normal: 17, large: 24 },
      no: { normal: 169, large: 239 },
    },
  },
  quattro_formaggi: {
    id: "quattro_formaggi",
    prices: {
      en: { normal: 18, large: 25 },
      no: { normal: 179, large: 249 },
    },
  },
  vegetariana: {
    id: "vegetariana",
    prices: {
      en: { normal: 16, large: 23 },
      no: { normal: 159, large: 229 },
    },
  },
  prosciutto_rucola: {
    id: "prosciutto_rucola",
    prices: {
      en: { normal: 18, large: 25 },
      no: { normal: 179, large: 249 },
    },
  },
  capricciosa: {
    id: "capricciosa",
    prices: {
      en: { normal: 17, large: 24 },
      no: { normal: 169, large: 239 },
    },
  },
  hawaiian: {
    id: "hawaiian",
    prices: {
      en: { normal: 16, large: 23 },
      no: { normal: 159, large: 229 },
    },
  },
  // Pasta - unique prices for each dish
  carbonara: {
    id: "carbonara",
    prices: {
      en: { normal: 13, large: 16 },
      no: { normal: 129, large: 159 },
    },
  },
  bolognese: {
    id: "bolognese",
    prices: {
      en: { normal: 14, large: 17 },
      no: { normal: 139, large: 169 },
    },
  },
  alfredo: {
    id: "alfredo",
    prices: {
      en: { normal: 15, large: 18 },
      no: { normal: 149, large: 179 },
    },
  },
  pesto: {
    id: "pesto",
    prices: {
      en: { normal: 12, large: 15 },
      no: { normal: 119, large: 149 },
    },
  },
  // Salads - unique prices for each salad
  caesar: {
    id: "caesar",
    prices: {
      en: { normal: 13, large: 16 },
      no: { normal: 129, large: 159 },
    },
  },
  greek: {
    id: "greek",
    prices: {
      en: { normal: 12, large: 15 },
      no: { normal: 119, large: 149 },
    },
  },
  caprese: {
    id: "caprese",
    prices: {
      en: { normal: 14, large: 17 },
      no: { normal: 139, large: 169 },
    },
  },
  cobb: {
    id: "cobb",
    prices: {
      en: { normal: 15, large: 18 },
      no: { normal: 149, large: 179 },
    },
  },
  // Drinks - all drinks have same price structure
  coca_cola: {
    id: "coca_cola",
    prices: {
      en: { "0.33L": 4.5, "0.5L": 5.5, "1.5L": 7.5 },
      no: { "0.33L": 45, "0.5L": 55, "1.5L": 75 },
    },
  },
  sprite: {
    id: "sprite",
    prices: {
      en: { "0.33L": 4.5, "0.5L": 5.5, "1.5L": 7.5 },
      no: { "0.33L": 45, "0.5L": 55, "1.5L": 75 },
    },
  },
  fanta: {
    id: "fanta",
    prices: {
      en: { "0.33L": 4.5, "0.5L": 5.5, "1.5L": 7.5 },
      no: { "0.33L": 45, "0.5L": 55, "1.5L": 75 },
    },
  },
  san_pellegrino: {
    id: "san_pellegrino",
    prices: {
      en: { "0.33L": 4.5, "0.5L": 5.5, "1.5L": 7.5 },
      no: { "0.33L": 45, "0.5L": 55, "1.5L": 75 },
    },
  },
  cola: {
    id: "cola",
    prices: {
      en: { "0.33L": 4.5, "0.5L": 5.5, "1.5L": 7.5 },
      no: { "0.33L": 45, "0.5L": 55, "1.5L": 75 },
    },
  },
  // Desserts - fixed prices
  tiramisu: {
    id: "tiramisu",
    prices: {
      en: { normal: 8 },
      no: { normal: 79 },
    },
  },
  panna_cotta: {
    id: "panna_cotta",
    prices: {
      en: { normal: 8 },
      no: { normal: 79 },
    },
  },
  gelato: {
    id: "gelato",
    prices: {
      en: { normal: 7 },
      no: { normal: 69 },
    },
  },
  chocolate_fondant: {
    id: "chocolate_fondant",
    prices: {
      en: { normal: 9 },
      no: { normal: 89 },
    },
  },
  // Dips - unique prices for each dip
  aioli: {
    id: "aioli",
    prices: {
      en: { normal: 2.5 },
      no: { normal: 25 },
    },
  },
  salsa: {
    id: "salsa",
    prices: {
      en: { normal: 2 },
      no: { normal: 20 },
    },
  },
  bearnaise: {
    id: "bearnaise",
    prices: {
      en: { normal: 3 },
      no: { normal: 30 },
    },
  },
  garlic: {
    id: "garlic",
    prices: {
      en: { normal: 2.5 },
      no: { normal: 25 },
    },
  },
};

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  type: string;
  quantity: number;
  currency: "NOK" | "USD";
  options: {
    size?: "small" | "large";
    cheeseOption?: "normal" | "extra" | "double";
    isWellDone?: boolean;
    drinkSize?: string;
    extraPrices?: {
      size: number;
      cheese: number;
    };
    basePrice?: number;
    totalPrice?: number;
    originalLanguage?: "no" | "en";
  };
  translationKey: string;
  isPromotion?: boolean;
  includedWith?: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  totalPrice: number;
  totalItems: number;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { language } = useLanguage();

  const calculatePrice = (item: CartItem) => {
    // Get base price from PRODUCT_PRICES using the original language
    const productPrices = PRODUCT_PRICES[item.productId];
    if (!productPrices) return item.price;

    // Use the original language for price calculation
    const priceLanguage = item.options?.originalLanguage || language;

    // Get base price based on size
    const basePrice =
      item.options?.size === "small"
        ? productPrices.prices[priceLanguage].normal || 0
        : productPrices.prices[priceLanguage].large ||
          productPrices.prices[priceLanguage].normal ||
          0;

    // Calculate total price including extras
    let totalPrice = item.options?.basePrice || basePrice;

    // Add extra prices if they exist
    if (item.options?.extraPrices) {
      totalPrice += item.options.extraPrices.size || 0;
      totalPrice += item.options.extraPrices.cheese || 0;
    }

    return totalPrice * item.quantity;
  };

  const addItem = (item: CartItem) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find(
        (i) =>
          i.productId === item.productId &&
          i.options?.size === item.options?.size &&
          i.options?.cheeseOption === item.options?.cheeseOption &&
          i.options?.isWellDone === item.options?.isWellDone &&
          i.options?.drinkSize === item.options?.drinkSize &&
          i.currency === item.currency
      );

      if (existingItem) {
        return prevItems.map((i) =>
          i.id === existingItem.id
            ? {
                ...i,
                quantity: i.quantity + item.quantity,
                price:
                  (item.options?.totalPrice || item.price) *
                  (i.quantity + item.quantity),
              }
            : i
        );
      }

      return [
        ...prevItems,
        { ...item, price: item.options?.totalPrice || item.price },
      ];
    });
  };

  const removeItem = (id: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }

    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id !== id) return item;
        return {
          ...item,
          quantity,
          price:
            (item.options.totalPrice || item.price / item.quantity) * quantity,
        };
      })
    );
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.price, 0);

  const clearCart = () => {
    setItems([]);
    setIsCartOpen(false);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        totalPrice,
        totalItems,
        clearCart,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
