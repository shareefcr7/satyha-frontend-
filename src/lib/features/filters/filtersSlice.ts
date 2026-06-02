import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface FiltersState {
  categories: string[];
  subcategories: string[];
  priceRange: [number, number];
  sizes: string[];
}

const initialState: FiltersState = {
  categories: [],
  subcategories: [],
  priceRange: [0, 5000],
  sizes: [],
};

export const filtersSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setCategories: (state, action: PayloadAction<string[]>) => {
      state.categories = action.payload;
    },
    toggleCategory: (state, action: PayloadAction<string>) => {
      const idx = state.categories.indexOf(action.payload);
      if (idx > -1) state.categories.splice(idx, 1);
      else state.categories.push(action.payload);
      // clear subcategory selections when category changes
      state.subcategories = [];
    },
    toggleSubcategory: (state, action: PayloadAction<string>) => {
      const idx = state.subcategories.indexOf(action.payload);
      if (idx > -1) state.subcategories.splice(idx, 1);
      else state.subcategories.push(action.payload);
    },
    setPriceRange: (state, action: PayloadAction<[number, number]>) => {
      state.priceRange = action.payload;
    },
    setSizes: (state, action: PayloadAction<string[]>) => {
      state.sizes = action.payload;
    },
    toggleSize: (state, action: PayloadAction<string>) => {
      const idx = state.sizes.indexOf(action.payload);
      if (idx > -1) state.sizes.splice(idx, 1);
      else state.sizes.push(action.payload);
    },
    resetFilters: (state) => {
      state.categories = [];
      state.subcategories = [];
      state.priceRange = [0, 5000];
      state.sizes = [];
    },
  },
});

export const {
  setCategories,
  toggleCategory,
  toggleSubcategory,
  setPriceRange,
  setSizes,
  toggleSize,
  resetFilters,
} = filtersSlice.actions;

export default filtersSlice.reducer;
