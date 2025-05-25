import { baseApi } from "../../api/baseApi";

const productApi=baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getProducts: builder.query({
            query: () => ({
                url: `/product/get-all-products`,
                method: "GET",
            }),
        }),
        getProductById: builder.query({
            query: (id) => ({
                url: `/product/getSingle-product/${id}`,
                method: "GET",
            }),
        }),
        createProduct: builder.mutation({
            query: (productData) => ({
                url: "/product/create",
                method: "POST",
                body: productData,
            }),
        }),
        updateProduct: builder.mutation({
            query: ({ id, productData }) => ({
                url: `/product/update/${id}`,
                method: "PUT",
                body: productData,
            }),
        }),
        deleteProduct: builder.mutation({
            query: (id) => ({
                url: `/product/delete/${id}`,
                method: "DELETE",
            }),
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