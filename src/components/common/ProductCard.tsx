import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types/product.types";

type ProductCardProps = {
  data: Product;
  priority?: boolean;
  isCircle?: boolean;
};

const ProductCard = ({ data, priority = false, isCircle = false }: ProductCardProps) => {
  const title = data.title || data.name || "Product";
  const price = data.price || data.sellingPrice || 0;
  const mrpPrice = data.mrpPrice;
  const offerAmount = data.offerAmount;
  
  // Only show product if it has a main image (admin-entered)
  // Don't show with placeholder/fallback images
  if (!data.mainImage && !data.srcUrl) {
    return null; // Skip products without images
  }

  return (
    <Link
      href={`/shop/product/${data.id}/${title.split(" ").join("-")}`}
      className="flex flex-col items-start aspect-auto"
    >
      <div
        className={
          isCircle
            ? "relative bg-white rounded-2xl w-[150px] h-[200px] sm:w-[200px] sm:h-[266px] md:w-[240px] md:h-[320px] lg:w-[280px] lg:h-[373px] xl:w-[320px] xl:h-[426px] mx-auto mb-4 overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500"
            : "relative bg-white rounded-2xl w-full aspect-[4/5] mb-2.5 xl:mb-4 overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300"
        }
      >
        <Image
          src={data.mainImage || data.srcUrl || ""}
          fill
          sizes="(max-width: 768px) 50vw, 320px"
          className="object-cover hover:scale-110 transition-all duration-700 ease-out"
          alt={title}
          priority={priority}
        />
      </div>
      <strong className="text-brand xl:text-xl">{title}</strong>
      <p className="text-brand/60 text-sm xl:text-base">{data.category}</p>
      <div className="flex items-center space-x-[5px] xl:space-x-2.5">
        {/* MRP (strikethrough if available) */}
        {mrpPrice && mrpPrice > 0 && (
          <span className="text-brand/60 text-sm line-through">₹{mrpPrice}</span>
        )}
        {/* Selling Price */}
        <span className="font-bold text-brand text-xl xl:text-2xl">
          ₹{Math.round(price)}
        </span>
        {/* Offer Badge */}
        {offerAmount && offerAmount > 0 && (
          <span className="font-medium text-[10px] xl:text-xs py-1 px-2 rounded-full bg-[#FF3333]/10 text-[#FF3333]">
            -{offerAmount}
          </span>
        )}
      </div>
    </Link>
  );
};

export default React.memo(ProductCard);
