import { compareArrays } from "@/lib/utils";
import { Discount } from "@/types/product.types";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

// Helper function to calculate totals from cart items
const calculateCartTotals = (items: CartItem[]) => {
  let totalPrice = 0;
  let totalQuantities = 0;
  
  for (const item of items) {
    const itemPrice = item.price || 0;
    const itemQty = item.quantity || 0;
    totalPrice += itemPrice * itemQty;
    totalQuantities += itemQty;
  }
  
  return {
    totalPrice: Math.round(totalPrice),
    adjustedTotalPrice: Math.round(totalPrice),
    totalQuantities,
  };
};

export type RemoveCartItem = {
  id: number | string;
  attributes: string[];
};

export type CartItem = {
  id: number | string;
  name: string;
  srcUrl: string;
  price: number;
  attributes: string[];
  discount: Discount;
  quantity: number;
};

export type Cart = {
  items: CartItem[];
  totalQuantities: number;
};

// Define a type for the slice state
interface CartsState {
  cart: Cart | null;
  totalPrice: number;
  adjustedTotalPrice: number;
  action: "update" | "add" | "delete" | null;
}

// Define the initial state using that type
const initialState: CartsState = {
  cart: null,
  totalPrice: 0,
  adjustedTotalPrice: 0,
  action: null,
};

export const cartsSlice = createSlice({
  name: "carts",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      if (state.cart === null) {
        // First item in cart - create fresh cart
        state.cart = {
          items: [action.payload],
          totalQuantities: action.payload.quantity,
        };
      } else {
        // Check if item already exists
        const existingItem = state.cart.items.find(
          (item) =>
            action.payload.id === item.id &&
            compareArrays(action.payload.attributes, item.attributes)
        );

        if (existingItem) {
          // Update existing item quantity
          existingItem.quantity += action.payload.quantity;
        } else {
          // Add new item
          state.cart.items.push(action.payload);
        }
        state.cart.totalQuantities += action.payload.quantity;
      }

      // Recalculate totals from scratch
      if (state.cart && state.cart.items.length > 0) {
        const totals = calculateCartTotals(state.cart.items);
        state.totalPrice = totals.totalPrice;
        state.adjustedTotalPrice = totals.adjustedTotalPrice;
      }
    },

    removeCartItem: (state, action: PayloadAction<RemoveCartItem>) => {
      if (!state.cart) return;

      const itemIndex = state.cart.items.findIndex(
        (item) =>
          action.payload.id === item.id &&
          compareArrays(action.payload.attributes, item.attributes)
      );

      if (itemIndex !== -1) {
        const item = state.cart.items[itemIndex];
        
        // Decrease quantity by 1
        item.quantity -= 1;
        state.cart.totalQuantities -= 1;

        // Remove if quantity reaches 0
        if (item.quantity <= 0) {
          state.cart.items.splice(itemIndex, 1);
        }
      }

      // Recalculate totals from scratch
      if (state.cart && state.cart.items.length > 0) {
        const totals = calculateCartTotals(state.cart.items);
        state.totalPrice = totals.totalPrice;
        state.adjustedTotalPrice = totals.adjustedTotalPrice;
      } else {
        // Cart is empty
        state.cart = null;
        state.totalPrice = 0;
        state.adjustedTotalPrice = 0;
      }
    },

    remove: (
      state,
      action: PayloadAction<RemoveCartItem & { quantity: number }>
    ) => {
      if (!state.cart) return;

      const itemIndex = state.cart.items.findIndex(
        (item) =>
          action.payload.id === item.id &&
          compareArrays(action.payload.attributes, item.attributes)
      );

      if (itemIndex !== -1) {
        const item = state.cart.items[itemIndex];
        state.cart.totalQuantities -= item.quantity;
        state.cart.items.splice(itemIndex, 1);
      }

      // Recalculate totals from scratch
      if (state.cart && state.cart.items.length > 0) {
        const totals = calculateCartTotals(state.cart.items);
        state.totalPrice = totals.totalPrice;
        state.adjustedTotalPrice = totals.adjustedTotalPrice;
      } else {
        // Cart is empty
        state.cart = null;
        state.totalPrice = 0;
        state.adjustedTotalPrice = 0;
      }
    },

    // New action: Clear stale cart data
    clearCart: (state) => {
      state.cart = null;
      state.totalPrice = 0;
      state.adjustedTotalPrice = 0;
      state.action = null;
    },

    // New action: Recalculate totals from current cart items
    recalculateTotals: (state) => {
      if (state.cart && state.cart.items.length > 0) {
        const totals = calculateCartTotals(state.cart.items);
        state.totalPrice = totals.totalPrice;
        state.adjustedTotalPrice = totals.adjustedTotalPrice;
      }
    },
  },
});

export const { addToCart, removeCartItem, remove, clearCart, recalculateTotals } = cartsSlice.actions;

export default cartsSlice.reducer;
