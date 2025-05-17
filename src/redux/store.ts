/* eslint-disable @typescript-eslint/no-explicit-any */
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/Auth/authSlice";
import { baseApi } from "./api/baseApi";
import storage from "redux-persist/lib/storage";
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist'
import wishlistReducer from"./features/localstorage/wishlistSlice"

const persistConfig = ({
    key: "auth",
    storage
})
const persistedAuthReducer = persistReducer(persistConfig, authReducer)

export const store = configureStore({
    reducer: {
        [baseApi.reducerPath]:baseApi.reducer,
        auth:persistedAuthReducer,
        wishlist: wishlistReducer,
    },
    middleware: (getDefaultMiddlewares:any) => getDefaultMiddlewares({
        serializableCheck: {
            ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
          },
    }).concat(baseApi.middleware)
})
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
export const persistor=persistStore(store)