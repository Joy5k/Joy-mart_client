import { baseApi } from "../../api/baseApi";
import { tagTypes } from "../../tagTypes";

const paymentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Initiate payment with SSLCommerz
    initiatePayment: builder.mutation({
      query: (data) => ({
        url: '/payment/initiate',
        method: 'POST',
        body: data
      }),
      invalidatesTags: [tagTypes.payment]
    }),

    // Validate payment after SSLCommerz callback
    validatePayment: builder.mutation({
      query: ({ transactionId }) => ({
        url: `/payment/validate/${transactionId}`,
        method: 'POST'
      }),
      invalidatesTags: [tagTypes.payment, tagTypes.booking] // Also invalidate booking tags since payment affects booking status
    }),

    // Handle Instant Payment Notification (IPN) - typically called by SSLCommerz directly
    handleIPN: builder.mutation({
      query: (ipnData) => ({
        url: '/payment/ipn',
        method: 'POST',
        body: ipnData
      }),
      invalidatesTags: [tagTypes.payment, tagTypes.booking]
    }),

    // Optional: Get payment history
    getPaymentHistory: builder.query({
      query: () => ({
        url: '/payment/history',
        method: 'GET'
      }),
      providesTags: [tagTypes.payment]
    }),

    // Optional: Get single payment details
    getPaymentDetails: builder.query({
      query: (transactionId) => ({
        url: `/payment/${transactionId}`,
        method: 'GET'
      }),
      providesTags: [tagTypes.payment]
    }),
    trackOrder: builder.query({
      query: ({transId}) => ({
        url: `/payment/track/${transId}`,
        method: 'GET'
      }),
      providesTags: [tagTypes.payment]
    })
  })
});

export const {
  useInitiatePaymentMutation,
  useValidatePaymentMutation,
  useHandleIPNMutation,
  useGetPaymentHistoryQuery,
  useGetPaymentDetailsQuery,
  useTrackOrderQuery
} = paymentApi;