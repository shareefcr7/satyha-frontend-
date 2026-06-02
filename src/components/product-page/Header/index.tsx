"use client";

import React, { useState } from "react";
import PhotoSection from "./PhotoSection";
import { Product } from "@/types/product.types";
import { integralCF } from "@/styles/fonts";
import { cn } from "@/lib/utils";
import AddToCardSection from "./AddToCardSection";

const Header = ({ data }: { data: Product }) => {
  const displayImages = data.gallery && data.gallery.length > 0
    ? [data.mainImage || "", ...data.gallery]
    : [data.mainImage || ""];

  const displayProduct: Product = {
    ...data,
    srcUrl: displayImages[0],
    gallery: displayImages,
    price: data.sellingPrice || data.price || 0,
  };

  // No variant attributes for simple product
  const cartAttributes: string[] = [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <div>
        <PhotoSection data={displayProduct} />
      </div>
      <div>
        {/* Title */}
        <h1
          className={cn([
            integralCF.className,
            "text-2xl md:text-[40px] md:leading-[40px] mb-3 md:mb-3.5 capitalize",
          ])}
        >
          {data.name || data.title}
        </h1>

        {/* Pricing Display */}
        <div className="flex items-center space-x-3 mb-5">
          {/* MRP (Strikethrough) */}
          {data.mrpPrice && (
            <span className="text-brand/60 text-lg sm:text-xl line-through">
              ₹{data.mrpPrice}
            </span>
          )}

          {/* Selling Price */}
          <span className="font-bold text-brand text-2xl sm:text-[32px]">
            ₹{data.sellingPrice || data.price || 0}
          </span>

          {/* Offer Badge */}
          {data.offerAmount && data.offerAmount > 0 && (
            <span className="font-medium text-[10px] xl:text-xs py-1.5 px-3.5 rounded-full bg-[#FF3333]/10 text-[#FF3333]">
              {`-₹${data.offerAmount}`}
            </span>
          )}
        </div>

        {/* Description */}
        <p className="text-sm sm:text-base text-brand/60 mb-5">
          {data.description ||
            data.shortDescription ||
            "This product is perfect for any occasion. Crafted from premium materials, it offers superior quality and performance."}
        </p>

        <hr className="h-[1px] border-t-brand/10 mb-5" />

        {/* Stock Status */}
        <div className="flex items-center space-x-2 mb-5">
          <span className="text-sm sm:text-base text-brand/60">Stock:</span>
          <span className={cn(
            "font-medium text-sm",
            (data.totalStock || 0) > 0 ? "text-green-600" : "text-red-600"
          )}>
            {(data.totalStock || 0) > 0 ? `${data.totalStock} units available` : "Out of Stock"}
          </span>
        </div>

        <hr className="h-[1px] border-t-brand/10 mb-5" />

        <AddToCardSection data={displayProduct} attributes={cartAttributes} />
      </div>
    </div>
  );
};

export default Header;
