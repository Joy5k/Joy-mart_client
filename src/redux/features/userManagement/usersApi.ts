import { tagTypes } from '../../tagTypes';
import { baseApi } from '../../api/baseApi';

export const usersApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        createUser: builder.mutation<any, any>({
            query: (data) => ({
                url: '/create',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: [tagTypes.user],
        }),
        createAdmin: builder.mutation<any, FormData>({
            query: (formData) => ({
                url: '/create-admin',
                method: 'POST',
                body: formData,
            }),
            invalidatesTags: [tagTypes.user],
        }),
          createUserByAdmin: builder.mutation<any, any>({
            query: (data) => ({
                url: '/users/createUserByAdmin',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: [tagTypes.user],
        }),
        getMe: builder.query({
            query: () => ({
                url: '/me',
            }),
            providesTags: [tagTypes.user],
        }),
        changeStatus: builder.mutation<any, { id: string; data: any }>({
            query: ({ id, data }) => ({
                url: `/change-status/${id}`,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: [tagTypes.user],
        }),
        getAllUsers: builder.query<any, void>({
            query: () => ({
                url: '/users',
                method: 'GET',
            }),
            providesTags: [tagTypes.user],
        }),
           updateUser:builder.mutation<any, {  email: string; data: any }>({
            query: ({ email,data }) => ({
                url: `/users/updateByAdmin/${email}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: [tagTypes.user],
    }),
    })
})


export const {
    useCreateUserMutation,
    useCreateAdminMutation,
    useCreateUserByAdminMutation,
    useGetMeQuery,
    useChangeStatusMutation,
    useGetAllUsersQuery,
    useUpdateUserMutation
} = usersApi;