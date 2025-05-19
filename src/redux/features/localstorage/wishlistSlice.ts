

// src/redux/features/wishlistSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

interface Product {
  id: string;
  name: string;
  price: number;
}

interface WishlistState {
  items: Product[];
}

const loadFromLocalStorage = (): Product[] => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('wishlist');
    return saved ? JSON.parse(saved) : [];
  }
  return [];
};

const initialState: WishlistState = {
  items: loadFromLocalStorage(),
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<Product>) => {
      // Check if the item already exists in the wishlist
      const exists = state.items.some(item => item.id === action.payload.id);
      if (exists) {
        console.log(exists)
        toast.error("Product already in wishlist",{
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
        return;
      }
      // If not, add it to the wishlist
      state.items.push(action.payload);
      // Save to localStorage

      localStorage.setItem('wishlist', JSON.stringify(state.items));
      toast.success("Product added to wishlist",{
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });

    },
    removeItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      localStorage.setItem('wishlist', JSON.stringify(state.items));
    },
  },
});

export const { addItem, removeItem } = wishlistSlice.actions;
export default wishlistSlice.reducer;