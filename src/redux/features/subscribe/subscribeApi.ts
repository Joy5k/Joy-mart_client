import { baseApi } from "../../api/baseApi";
import { tagTypes } from "../../tagTypes";

const subscribeApi=baseApi.injectEndpoints({
    endpoints:(builder)=>({
        getALlSubscribedUsers:builder.query({
            query:()=>({
                url:'/subscribe',
                method:'GET',
            }),
            providesTags:[tagTypes.subscrible]
        }),
        createSubscribe:builder.mutation({
            query:(email)=>({
                url:'/subscribe/createByEmail',
                method:'POST',
                body:email
            }),
            invalidatesTags:[tagTypes.subscrible]
        }),
         createSubscribeUsingToken:builder.mutation({
            query:()=>({
                url:'/subscribe/createUsingToken',
                method:'POST',
            }),
            invalidatesTags:[tagTypes.subscrible]
        }),
            unsubscribe:builder.mutation({
            query:()=>({
                url:'/subscribe/unsubscribe',
                method:'DELETE',
            }),
            invalidatesTags:[tagTypes.subscrible]
        }),
        handleSubscribeUser:builder.mutation({
            query:()=>({
                url:'/subscribe/unsubscribeUsingToken',
                method:'DELETE',
            }),
            invalidatesTags:[tagTypes.subscrible]
        }),
    })
})

export const {
    useGetALlSubscribedUsersQuery,
    useCreateSubscribeMutation,
    useCreateSubscribeUsingTokenMutation,
    useUnsubscribeMutation,
    useHandleSubscribeUserMutation
}=subscribeApi