import { baseApi } from "../../api/baseApi";

const productApi=baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getProducts: builder.query({
            query: ({query}) => ({
                url: `/products/get-all-products?limit=${query.limit}&offset=${query.offset}&search=${query.search}`,
                method: "GET",
            }),
        }),
        getProductById: builder.query({
            query: (id) => ({
                url: `/products/getSingle-product/${id}`,
                method: "GET",
            }),
        }),
        createProduct: builder.mutation({
            query: (productData) => ({
                url: "/products/create",
                method: "POST",
                body: productData,
            }),
        }),
        updateProduct: builder.mutation({
            query: ({ id, productData }) => ({
                url: `/products/update/${id}`,
                method: "PUT",
                body: productData,
            }),
        }),
        deleteProduct: builder.mutation({
            query: (id) => ({
                url: `/products/delete/${id}`,
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