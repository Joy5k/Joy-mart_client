import { baseApi } from "../../api/baseApi";
import { tagTypes } from "../../tagTypes";

const categoryApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getCategories: builder.query({
            query: () => ({
                url: "/categories",
                method: "GET",
            }),
       providesTags:[tagTypes.category],
            
        }),
        getCategoryById: builder.query({
            query: (id) => ({
                url: `/categories/get/${id}`,
                method: "GET",
            }),
        providesTags:[tagTypes.category],

        }),
        createCategory: builder.mutation({
            query: (categoryData) => ({
                url: "/categories/create",
                method: "POST",
                body: categoryData,
            }),
             invalidatesTags:[tagTypes.category],

        }),
        updateCategory: builder.mutation({
            query: ({ id, data }) => {
                console.log(data,'in redux')
                return {
                url: `/categories/update/${id}`,
                method: "PUT",
                body: data,
            }
            },
            invalidatesTags:[tagTypes.category]
        }),
        deleteCategory: builder.mutation({
           query: ({ id }) => {
  console.log("ID received by API:", id); // Temporarily log
  return {
    url: `/categories/delete/${id}`,
    method: "DELETE",
  };
},
  invalidatesTags:[tagTypes.category],

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
