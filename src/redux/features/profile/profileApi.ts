import { baseApi } from "../../api/baseApi";
import { tagTypes } from "../../tagTypes";

const profileApi=baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getProfile: builder.query({
            query: (id) => ({
                url: `/profiles/me`,
                method: "GET",
            }),
            providesTags:[tagTypes.profile]
        }),
        getAllProfiles: builder.query({
            query: () => ({
                url: `/profiles/all`,
                method: "GET",
            }),
            providesTags:[tagTypes.profile]
        }),
        createProfile: builder.mutation({
            query: (data) => ({
                url: `/profiles/create`,
                method: "POST",
                body: data,
            }),
            invalidatesTags:[tagTypes.profile]
        }),
        deleteProfile: builder.mutation({
            query: (id) => ({
                url: `/profiles/${id}`,
                method: "DELETE",
            }),
            invalidatesTags:[tagTypes.profile]
        }),

        updateProfile: builder.mutation({
            query: ({ updatedData }) => ({
                url: `/profiles`,
                method: "PUT",
                body: updatedData,
            }),
            invalidatesTags:[tagTypes.profile]
        }),
    }),
})

export const {
    useGetProfileQuery,
    useCreateProfileMutation,
    useDeleteProfileMutation,
    useUpdateProfileMutation

} = profileApi;