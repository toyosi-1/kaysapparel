"use client";

import { useEffect, useState } from "react";
import { Product } from "./types";

const STORAGE_KEY = "kaysapparel-recently-viewed";
const MAX_ITEMS = 8;

export function addRecentlyViewed(product: Product) {
  if (typeof window === "undefined") return;
  const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]") as Product[];
  const filtered = existing.filter((p) => p.id !== product.id);
  const updated = [product, ...filtered].slice(0, MAX_ITEMS);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export function useRecentlyViewed(excludeId?: string): Product[] {
  const [items, setItems] = useState<Product[]>([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]") as Product[];
    setItems(excludeId ? stored.filter((p) => p.id !== excludeId) : stored);
  }, [excludeId]);

  return items;
}
