"use client";

import { useEffect, useState } from "react";
import ProductListSec from "@/components/common/ProductListSec";
import { Product } from "@/types/product.types";

interface ApiProduct {
  _id: string;
  name: string;
  category?: { name: string; _id?: string };
  subcategory?: { name: string; _id?: string };
  variants?: Array<{
    images?: string[];
    price?: number;
    isDefault?: boolean;
  }>;
}

export default function TopSelling() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const api = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (!api) {
      setLoading(false);
      return;
    }

    // For now we just fetch products, in a real app we might have a specific endpoint for top selling
    fetch(`${api}/product?limit=4&skip=4`)
      .then((res) => {
        if (!res.ok || !res.headers.get("content-type")?.includes("application/json")) {
          throw new Error("Invalid response");
        }
        return res.json();
      })
      .then((data) => {
        if (data.products && Array.isArray(data.products)) {
          const mapped: Product[] = data.products.map((p: ApiProduct) => {
            const v = p.variants?.find((v) => v.isDefault) || p.variants?.[0];
            return {
              id: p._id,
              title: p.name,
              category: p.category?.name || "General",
              subcategory: p.subcategory?.name || "",
              srcUrl: v?.images?.[0] || "/images/pic1.png",
              gallery: v?.images || [],
              price: v?.price || 0,
              discount: { amount: 0, percentage: 0 },
              rating: 4,
            };
          });
          setProducts(mapped);
        }
      })
      .catch((err) => console.error("Failed to fetch top selling products:", err))
      .finally(() => setLoading(false));
  }, [api]);

  if (!loading && products.length === 0) return null;

  return (
    <div id="top-selling" className="my-10 sm:my-20">
      <ProductListSec 
        title="top selling" 
        data={products} 
        viewAllLink="/shop" 
      />
    </div>
  );
}
