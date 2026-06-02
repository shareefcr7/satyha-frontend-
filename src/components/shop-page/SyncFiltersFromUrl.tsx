"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { setCategories } from "@/lib/features/filters/filtersSlice";

export default function SyncFiltersFromUrl() {
  const searchParams = useSearchParams();
  const dispatch = useDispatch();

  useEffect(() => {
    const cats = searchParams.get("categories");
    if (cats) {
      dispatch(setCategories(cats.split(",").map(c => c.trim()).filter(Boolean)));
    } else {
      dispatch(setCategories([]));
    }
  }, [searchParams, dispatch]);

  return null;
}
