import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface SearchProduct {
  id: string;
  title: string;
  category: string;
  price: number;
  srcUrl: string;
}

interface SearchState {
  query: string;
  suggestions: SearchProduct[];
  isLoading: boolean;
}

const initialState: SearchState = {
  query: "",
  suggestions: [],
  isLoading: false,
};

export const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setQuery: (state, action: PayloadAction<string>) => {
      state.query = action.payload;
    },
    setSuggestions: (state, action: PayloadAction<SearchProduct[]>) => {
      state.suggestions = action.payload;
    },
    setIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    clearSearch: (state) => {
      state.query = "";
      state.suggestions = [];
      state.isLoading = false;
    },
  },
});

export const { setQuery, setSuggestions, setIsLoading, clearSearch } =
  searchSlice.actions;

export default searchSlice.reducer;
