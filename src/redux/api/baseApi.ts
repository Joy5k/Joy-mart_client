/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  BaseQueryApi,
  BaseQueryFn,
  DefinitionType,
  FetchArgs,
  createApi,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
import { RootState } from "../store";
import { logout, setUser } from "../features/Auth/authSlice";

const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:5000/api/v1",
  // baseUrl: "https://electon-server-three.vercel.app/",
  //below the line set the cookies on browser
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const state = getState() as RootState;
    const token = state.auth && 'token' in state.auth ? (state.auth as any).token as string : undefined;
    if (token) {
      headers.set("authorization", `${token}`);
    }
    return headers;
  },
});

const baseQueryWithRefreshToken:BaseQueryFn<FetchArgs,BaseQueryApi,DefinitionType> = async (arg, api,extraOptions
):Promise<any> => {
  let result:any = await baseQuery(arg, api, extraOptions);

  if (result?.error?.status === 404) {
    console.error(result?.error?.data.massage)
   }

  if (result?.error?.status === 401) {
    const res = await fetch("http://localhost:5000/api/v1/auth/refresh-token", {
    // const res = await fetch("https: //electon-server-three.vercel.app/auth/refresh-token", {
      method: "POST",
      credentials: "include",
    });
    const data = await res.json();

    if (data?.data?.accessToken) {
      const state = api.getState() as RootState;
      const user = state.auth && 'user' in state.auth ? state.auth.user : null;
      api.dispatch(
        setUser({
          user: user,
          token: data.data.accessToken,
        })
      );
      result = await baseQuery(arg, api, extraOptions);
    } else {
      api.dispatch(logout());
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQueryWithRefreshToken,
  tagTypes:["auth2","products","users","bookings","payments","subscribe","offers"],
  endpoints: () => ({}),
});