import { baseApi } from "../../api/baseApi";
import { tagTypes } from "../../tagTypes";

const productCommentApi=baseApi.injectEndpoints({
    endpoints: (builder) => ({
        createProductComment: builder.mutation({
            query: (commentData) => ({
                url: '/productComment',
                method: 'POST',
                body: commentData,
            }),
            invalidatesTags: [tagTypes.productComment],
        }),

        getProductComments: builder.query({
            query: ({productId}) => {
                return {
                    url: `/productComment/${productId}`,
                    method: 'GET',
                }
            },
            providesTags: [tagTypes.productComment]
        
        }),
        updateProductComment: builder.mutation({
            query: ({ commentId, commentData }) => ({
                url: `/productComment/${commentId}`,
                method: 'PUT',
                body: commentData,
            }),
            invalidatesTags: [tagTypes.productComment],
        }),

       deleteProductComment: builder.mutation({
           query: (commentId) => ({
               url: `/productComment/${commentId}`,
               method: 'DELETE',
           }),
           invalidatesTags: [tagTypes.productComment],
       })

    }),
})

export const { 
    useGetProductCommentsQuery,
     useDeleteProductCommentMutation,
     useUpdateProductCommentMutation,
     useCreateProductCommentMutation
} = productCommentApi