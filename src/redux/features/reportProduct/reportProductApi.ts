import { baseApi } from "../../api/baseApi";
import { tagTypes } from "../../tagTypes";

const profileApi=baseApi.injectEndpoints({
    endpoints: (builder) => ({
        reportProduct: builder.mutation({
            query: (reportData) => ({
                url: '/report/create',
                method: 'POST',
                body: reportData
            }),
            invalidatesTags: [tagTypes.reportedProduct]
        }),
        getMyReportedProducts: builder.query({
            query: () => ({
                url: '/report/all-my-reported',
                method: 'GET'
            }),
            providesTags: [tagTypes.reportedProduct]
        }),
        getAllReportedProductByAdmin: builder.query({
            query: (query) => ({
                url: `/report/all-by-admin`,
                method: 'GET'
            }),
            providesTags: [tagTypes.reportedProduct]
        }),
        replyReportedProduct: builder.mutation({
            query: ({reportId, reply}) => ({
                url: `/report/reply/${reportId}`,
                method: 'PUT',
                body: { reply }
            }),
            invalidatesTags: [tagTypes.reportedProduct]
        }),


        deleteReportedProduct: builder.mutation({
            query: ({reportId}) => ({
                url: `/report/delete/${reportId}`,
                method: 'DELETE'
            }),
            invalidatesTags: [tagTypes.reportedProduct]
        }),
        deleteReportedProductByAdmin: builder.mutation({
            query: ({reportId}) => ({
                url: `/report/delete-by-admin/${reportId}`,
                method: 'DELETE'
            }),
            invalidatesTags: [tagTypes.reportedProduct]
        })
    })
})

export const {
    useReportProductMutation,
    useGetMyReportedProductsQuery,
    useDeleteReportedProductMutation,
    useDeleteReportedProductByAdminMutation,
    useReplyReportedProductMutation,
    useGetAllReportedProductByAdminQuery
} = profileApi;