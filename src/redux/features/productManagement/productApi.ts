import { baseApi } from "../../api/baseApi";
import { tagTypes } from "../../tagTypes";

const productApi=baseApi.injectEndpoints({
    endpoints: (builder) => ({
          getProducts: builder.query({
      query: (params) => {
        // Build query string from all available parameters
        const queryParams = new URLSearchParams();
        
        // Search term
        if (params?.searchTerm) queryParams.append('searchTerm', params.searchTerm);
        
      
        
        // Price range
        if (params?.minPrice) {
          queryParams.append('minPrice', params.minPrice.toString());
        }
        if (params?.maxPrice) {
          queryParams.append('maxPrice', params.maxPrice.toString());
        }
        
        // Sorting
        if (params?.sort) {
          queryParams.append('sort', params.sort);
        }
        
        // Stock filter
        if (params?.inStock) {
          queryParams.append('inStock', params.inStock.toString());
        }
        
        // Pagination
        if (params?.page) {
          queryParams.append('page', params.page.toString());
        }
        if (params?.limit) {
          queryParams.append('limit', params.limit.toString());
        }
        
        return {
          url: `/product/get-all-products?${queryParams.toString()}`,
          method: 'GET',
        };
      },
      providesTags: [tagTypes.product],
    }),

   getAllProductsForAdmin: builder.query({
    query: (queryParams) => {
    const params = new URLSearchParams();
    
    // Add all possible parameters
    if (queryParams.searchTerm) params.append('searchTerm', queryParams.searchTerm);
    if (queryParams.title) params.append('title', queryParams.title);
    if (queryParams.category) params.append('category', queryParams.category);
    if (queryParams.minPrice) params.append('minPrice', queryParams.minPrice.toString());
    if (queryParams.maxPrice) params.append('maxPrice', queryParams.maxPrice.toString());
    if (queryParams.sort) params.append('sort', queryParams.sort);
    if (queryParams.inStock) params.append('inStock', queryParams.inStock.toString());
    if (queryParams.discountPercentage) params.append('discountPercentage', queryParams.discountPercentage.toString());
    params.append('page', queryParams.page.toString());
    params.append('limit', queryParams.limit.toString());
    
    return {
      url: `/product/get-all-products-for-admin?${params.toString()}`,
      method: 'GET',
    };
  },
  providesTags: [tagTypes.product],
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
              invalidatesTags:[tagTypes.product]

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
    useGetAllProductsForAdminQuery,
    useGetProductByIdQuery,
    useCreateProductMutation,
    useUpdateProductMutation,
    useDeleteProductMutation,
} = productApi;