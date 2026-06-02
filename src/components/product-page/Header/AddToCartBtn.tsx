"use client";

import { addToCart } from "@/lib/features/carts/cartsSlice";
import { useAppDispatch } from "@/lib/hooks/redux";
import { Product } from "@/types/product.types";
import React from "react";

type Props = {
  data: Product & { quantity: number };
  attributes?: string[];
};

const AddToCartBtn = ({ data, attributes = [] }: Props) => {
  const dispatch = useAppDispatch();

  const handleAddToCart = () => {
    const productName = data.title || data.name || "Product";
    const productPrice = data.price || data.sellingPrice || 0;
    const productSrc = data.srcUrl || data.mainImage || "/images/pic1.png";

    dispatch(
      addToCart({
        id: data.id as number,
        name: productName,
        srcUrl: productSrc,
        price: productPrice,
        attributes,
        discount: data.discount || { percentage: 0, amount: 0 },
        quantity: data.quantity,
      })
    );
  };

  return (
    <button
      type="button"
      className="bg-brand w-full ml-3 sm:ml-5 rounded-full h-11 md:h-[52px] text-sm sm:text-base text-white hover:bg-brand-dark transition-all"
      onClick={handleAddToCart}
    >
      Add to Cart
    </button>
  );
};

export default AddToCartBtn;
