import { baseApi } from "../../api/baseApi";

const categoryApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getCategories: builder.query({
            query: () => ({
                url: "/categories",
                method: "GET",
            }),
        }),
        getCategoryById: builder.query({
            query: (id) => ({
                url: `/categories/get/${id}`,
                method: "GET",
            }),
        }),
        createCategory: builder.mutation({
            query: (categoryData) => ({
                url: "/categories/create",
                method: "POST",
                body: categoryData,
            }),
        }),
        updateCategory: builder.mutation({
            query: ({ id, categoryData }) => ({
                url: `/categories/${id}`,
                method: "PUT",
                body: categoryData,
            }),
        }),
        deleteCategory: builder.mutation({
            query: (id) => ({
                url: `/categories/delete/${id}`,
                method: "DELETE",
            }),
        }),
    }),
});

export const {
    useGetCategoriesQuery,
    useGetCategoryByIdQuery,
    useCreateCategoryMutation,
    useUpdateCategoryMutation,
    useDeleteCategoryMutation,
} = categoryApi;
