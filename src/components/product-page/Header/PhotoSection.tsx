"use client";

import { Product } from "@/types/product.types";
import Image from "next/image";
import React, { useState, useEffect } from "react";

const PhotoSection = ({ data }: { data: Product }) => {
  const defaultSrc = data.srcUrl || data.mainImage || "/images/pic1.png";
  const [selected, setSelected] = useState<string>(defaultSrc);

  // When the variant changes (srcUrl changes), reset to the new variant's first image
  useEffect(() => {
    const newDefault = data.srcUrl || data.mainImage || "/images/pic1.png";
    setSelected(newDefault);
  }, [data.srcUrl, data.mainImage]);

  return (
    <div className="flex flex-col-reverse lg:flex-row lg:space-x-3.5">
      {data?.gallery && data.gallery.length > 0 && (
        <div className="flex lg:flex-col space-x-3 lg:space-x-0 lg:space-y-3.5 w-full lg:w-fit items-center lg:justify-start justify-center">
          {data.gallery.map((photo, index) => (
            <button
              key={index}
              type="button"
              className="relative bg-[#f5ede4] rounded-[13px] xl:rounded-[20px] w-full max-w-[111px] xl:max-w-[152px] max-h-[106px] xl:max-h-[167px] xl:min-h-[167px] aspect-square overflow-hidden"
              onClick={() => setSelected(photo)}
            >
              <Image
                src={photo}
                fill
                sizes="152px"
                className="rounded-md object-cover hover:scale-110 transition-all duration-500"
                alt={data.title || data.name || "Product"}
                priority
                unoptimized
              />
            </button>
          ))}
        </div>
      )}

      <div className="relative flex items-center justify-center bg-[#f5ede4] rounded-[13px] sm:rounded-[20px] w-full sm:w-96 md:w-full mx-auto h-full max-h-[530px] min-h-[330px] lg:min-h-[380px] xl:min-h-[530px] overflow-hidden mb-3 lg:mb-0">
        <Image
          src={selected}
          fill
          sizes="(max-width: 768px) 100vw, 444px"
          className="rounded-md object-cover hover:scale-110 transition-all duration-500"
          alt={data.title || data.name || "Product"}
          priority
          unoptimized
        />
      </div>
    </div>
  );
};

export default PhotoSection;
