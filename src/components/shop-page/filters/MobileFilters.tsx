"use client";

import React, { useState } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { FiSliders } from "react-icons/fi";
import Filters from "./index";

const MobileFilters = () => {
  const [open, setOpen] = useState(false);

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <button
          type="button"
          className="h-8 w-8 rounded-full bg-[#f5ede4] text-brand p-1 md:hidden"
        >
          <FiSliders className="text-base mx-auto" />
        </button>
      </DrawerTrigger>
      <DrawerContent className="max-h-[90%]">
        <DrawerHeader>
          <div className="flex items-center justify-between">
            <span className="font-bold text-brand text-xl">Filters</span>
            <FiSliders className="text-2xl text-brand/40" />
          </div>
          <DrawerTitle className="hidden">filters</DrawerTitle>
          <DrawerDescription className="hidden">filters</DrawerDescription>
        </DrawerHeader>
        <div className="max-h-[90%] overflow-y-auto w-full px-5 md:px-6 py-5 space-y-5 md:space-y-6">
          <Filters onApply={() => setOpen(false)} />
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default MobileFilters;
