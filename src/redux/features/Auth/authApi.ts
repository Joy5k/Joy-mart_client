import { baseApi } from "../../api/baseApi";

const authApi = baseApi.injectEndpoints({
    endpoints: (builder) =>( {
        login: builder.mutation({
            query: (userInfo) => ({
                url: "/auth/login",
                    method: "POST",
                    body:userInfo
            })
        }),
        register: builder.mutation({
            query: (userInfo) => ({
                url: "/auth/register",
                    method: "POST",
                    body:userInfo
            })
        }),
        auth2: builder.mutation({
            query: () => ({
                url: "/auth/2fa/setup",
                    method: "POST",
                
            })
        }),
        verifyAuth2: builder.mutation({
            query: () => ({
                url: "/auth/2fa/verify",
                    method: "POST",
                
            }),
        

        }
    ),
    changePassword:builder.mutation({
            query:(data)=>({
                url: '/auth//change-password',
                method:'POST',
                body:data
            })
        }),
     genareteAuthTokenUsingRefreshToken: builder.mutation({
            // Add your query implementation here
            query: () => ({
                url: "/auth/refresh-token",
                method: "POST",
            })
        }),
    logout: builder.mutation({
            query: () => ({
                url: "/auth/logout",
                method: "POST",
            }),
        })
    })
});

export const {
    useLoginMutation,
    useRegisterMutation,
    useAuth2Mutation,
    useVerifyAuth2Mutation,
    useChangePasswordMutation,
    useGenareteAuthTokenUsingRefreshTokenMutation,
    useLogoutMutation
} = authApi;