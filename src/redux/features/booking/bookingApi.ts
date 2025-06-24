import { baseApi } from "../../api/baseApi";
import { tagTypes } from "../../tagTypes";

const bookingApi=baseApi.injectEndpoints({
    endpoints:(builder)=>({
        getAllBookings:builder.query({
            query:()=>({
                url:'/booking/my-bookings',
                method:'GET',
            }),
            providesTags:[tagTypes.booking]
        }),
           getSingleBooking:builder.query({
            query:(id)=>({
                url:`/booking/${id}`,
                method:'GET',
            }),
            providesTags:[tagTypes.booking]
        }),
        updateBooking:builder.mutation({
            query:({payload})=>({
                url:`/booking/${payload.id}/status`,
                method:'patch',
                body:payload.data
            }),
            invalidatesTags:[tagTypes.booking]
        }),
         createBooking:builder.mutation({
            query:(data)=>({
                url:'/booking',
                method:'POST',
                body:data
            }),
            invalidatesTags:[tagTypes.booking]
        }),
            deleteBooking:builder.mutation({
            query:({id})=>({
                url:`/booking/delete/${id}`,
                method:'DELETE',
            }),
            invalidatesTags:[tagTypes.booking]
        }),
    })
})

export const {
    useCreateBookingMutation,
    useGetAllBookingsQuery,
    useGetSingleBookingQuery,
    useUpdateBookingMutation,
    useDeleteBookingMutation
}=bookingApi