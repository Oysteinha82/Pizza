"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { useLanguage } from "./LanguageContext";

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  options?: {
    size?: string;
    extraCheese?: string;
    cooking?: string;
  };
}

interface Order {
  id: string;
  userId: string;
  date: Date;
  items: OrderItem[];
  totalPrice: number;
  status: "pending" | "preparing" | "ready" | "delivered" | "completed";
  deliveryMethod: "delivery" | "pickup";
  address?: string;
  location: string;
  estimatedTime: Date;
  orderLanguage: "no" | "en";
}

interface OrderContextType {
  orders: Order[];
  addOrder: (
    order: Omit<Order, "id" | "userId" | "status" | "orderLanguage">
  ) => void;
  getOrders: () => Order[];
  updateOrderStatus: (orderId: string) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

const STORAGE_KEY = "pizza_orders";

export function OrderProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const userId = user?.email || "anonymous";
  const [orders, setOrders] = useState<Order[]>([]);
  const { language } = useLanguage();

  // Last inn ordre når komponenten mountes eller når bruker endres
  useEffect(() => {
    const storedOrders = localStorage.getItem(`orders_${userId}`);
    if (storedOrders) {
      const parsedOrders = JSON.parse(storedOrders).map((order: any) => ({
        ...order,
        date: new Date(order.date),
      }));
      setOrders(parsedOrders);
    } else {
      setOrders([]);
    }
  }, [userId]);

  // Lagre ordre når de endres
  useEffect(() => {
    if (orders.length > 0) {
      localStorage.setItem(`orders_${userId}`, JSON.stringify(orders));
    } else {
      localStorage.removeItem(`orders_${userId}`);
    }
  }, [orders, userId]);

  // Oppdater ordre-status basert på estimert tid
  useEffect(() => {
    const interval = setInterval(() => {
      setOrders((currentOrders) =>
        currentOrders.map((order) => {
          const now = new Date();
          const estimatedTime = new Date(order.estimatedTime);

          if (now > estimatedTime) {
            if (order.status === "preparing") {
              return { ...order, status: "ready" };
            } else if (order.status === "ready") {
              return { ...order, status: "completed" };
            }
          }
          return order;
        })
      );
    }, 60000); // Sjekk hvert minutt

    return () => clearInterval(interval);
  }, []);

  const addOrder = (
    orderData: Omit<Order, "id" | "userId" | "status" | "orderLanguage">
  ) => {
    if (!user) return;

    const newOrder: Order = {
      ...orderData,
      id: Math.random().toString(36).substr(2, 9),
      date: new Date(),
      userId: user.email,
      status: "preparing",
      orderLanguage: language,
    };

    setOrders((prev) => [newOrder, ...prev]);
  };

  const getOrders = () => {
    if (!user) return [];
    return orders;
  };

  const updateOrderStatus = (orderId: string) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id !== orderId) return order;

        const now = new Date();
        const estimatedTime = new Date(order.estimatedTime);

        if (now > estimatedTime) {
          if (order.status === "preparing") {
            return { ...order, status: "ready" };
          } else if (order.status === "ready") {
            return { ...order, status: "completed" };
          }
        }
        return order;
      })
    );
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        addOrder,
        getOrders,
        updateOrderStatus,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error("useOrders must be used within an OrderProvider");
  }
  return context;
}
