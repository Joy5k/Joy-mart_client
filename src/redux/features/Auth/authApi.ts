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
                
            })
        }
    )
    })
})
export const {useLoginMutation,useRegisterMutation,useAuth2Mutation,useVerifyAuth2Mutation } = authApi