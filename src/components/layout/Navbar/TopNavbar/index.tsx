import Link from "next/link";
import React, { Suspense } from "react";
import CartBtn from "./CartBtn";
import SearchInput from "../SearchInput";
import Image from "next/image";

const TopNavbar = () => {
  return (
    <nav className="sticky top-0 bg-white z-20 shadow-sm border-b border-gray-100">
      <div className="flex relative max-w-frame mx-auto items-center justify-between md:justify-start py-1 md:py-2 px-4 xl:px-0">
        <div className="flex items-center">
          <Link
            href="/"
            className="flex items-center mr-3 lg:mr-10"
          >
            <Image
              src="/icon-192x192.png"
              alt="CG Logo"
              width={160}
              height={160}
              className="object-contain h-14 md:h-20 w-auto"
              priority
            />
          </Link>
        </div>
        <Suspense fallback={<div className="w-full md:mr-3 lg:mr-10 h-10 bg-gray-100 rounded-full animate-pulse" />}>
          <SearchInput />
        </Suspense>
        <div className="flex items-center">
          <Suspense fallback={<div className="w-6 h-6 mr-[14px]" />}>
            <CartBtn />
          </Suspense>
        </div>
      </div>
    </nav>
  );
};

export default TopNavbar;
