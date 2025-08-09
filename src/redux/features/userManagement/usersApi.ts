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
     
        changeStatus: builder.mutation<any, { id: string; data: any }>({
            query: ({ id, data }) => ({
                url: `/change-status/${id}`,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: [tagTypes.user],
        }),
        getAllUsers: builder.query<any, {firstName?: string; lastName?: string; email?: string; role?: string}>({
            query: (query) => {
                console.log(query,'in redux')
                return {
                url: `/users?${query.firstName ? `firstName=${query.firstName}` : ''}${query.lastName ? `&lastName=${query.lastName}` : ''}${query.email ? `&email=${query.email}` : ''}${query.role ? `&role=${query.role}` : ''}`,
                method: 'GET',
            }
            },
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
     restoredUser:builder.mutation<any, {email: string;}>({
            query: ({ email }) => ({
                url: `/users/restoredUser`,
                method: 'PUT',
                body: {email},
            }),
            invalidatesTags: [tagTypes.user],
    }),
    deleteUserBySuperAdmin:builder.mutation<any,{email:string}>({
        query:({email})=>{
           return {
                 url:`/users/deleteBySuperAdmin`,
                method:'DELETE',
                body:{email}
            }
        },
         invalidatesTags: [tagTypes.user],
    })


})

})


export const {
    useCreateUserMutation,
    useCreateAdminMutation,
    useCreateUserByAdminMutation,
    useChangeStatusMutation,
    useGetAllUsersQuery,
    useUpdateUserMutation,
    useRestoredUserMutation,
    useDeleteUserBySuperAdminMutation

} = usersApi;