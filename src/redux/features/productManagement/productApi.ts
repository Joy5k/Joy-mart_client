import { baseApi } from "../../api/baseApi";
import { tagTypes } from "../../tagTypes";

const productApi=baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getProducts: builder.query({
            query: (searchText) => {
                return {
                 // `/product/get-all-products?searchTerm=Men's Slim T-Shirt`

                url: `/product/get-all-products?searchTerm=${searchText?searchText:""}`,
                method: "GET",
            }            },
            providesTags:[tagTypes.product],
        }),
        getProductById: builder.query({
            query: (id) => ({
                url: `/product/getSingle-product/${id}`,
                method: "GET",
            }),
            providesTags:[tagTypes.product]
        }),
        createProduct: builder.mutation({
            query: (productData) => ({
                url: "/product/create",
                method: "POST",
                body: productData,
            }),
        }),
        updateProduct: builder.mutation({
            query: ({ id, data }) => ({
                url: `/product/update/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags:[tagTypes.product]
        }),
        deleteProduct: builder.mutation({
            query: (id) => ({
                url: `/product/delete/${id}`,
                method: "DELETE",
            }),
            invalidatesTags:[tagTypes.product]
        }),
    }),
})

export const {
    useGetProductsQuery,
    useGetProductByIdQuery,
    useCreateProductMutation,
    useUpdateProductMutation,
    useDeleteProductMutation,
} = productApi;