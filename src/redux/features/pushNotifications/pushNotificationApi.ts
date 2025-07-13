import { baseApi } from "../../api/baseApi";
import { tagTypes } from "../../tagTypes";

const pushNotificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Submit token endpoint (public)
    submitToken: builder.mutation({
      query: (tokenData) => ({
        url: "/push-notifications/submit-token",
        method: "POST",
        body: tokenData,
      }),
      invalidatesTags: [tagTypes.pushNotification],
    }),

    // Send notification endpoint (admin only)
    sendNotification: builder.mutation({
      query: ({message}) => ({
        url: "/push-notifications/send-notification",
        method: "POST",
        body: message,
      }),
      invalidatesTags: [tagTypes.pushNotification],
    }),

    // Get user's notification tokens
    getUserNotificationTokens: builder.query({
      query: () => ({
        url: "/push-notifications/my-tokens",
        method: "GET",
      }),
      providesTags: [tagTypes.pushNotification],
    }),

    // Remove token endpoint
    removeToken: builder.mutation({
      query: (tokenData) => ({
        url: "/push-notifications/remove-token",
        method: "DELETE",
        body: tokenData,
      }),
      invalidatesTags: [tagTypes.pushNotification],
    }),

    // Admin-only endpoint to get all tokens
    getAllNotificationTokens: builder.query({
      query: () => ({
        url: "/push-notifications/all-tokens",
        method: "GET",
      }),
      providesTags: [tagTypes.pushNotification],
    }),
  }),
  overrideExisting: false,
});

export const {
  useSubmitTokenMutation,
  useSendNotificationMutation,
  useGetUserNotificationTokensQuery,
  useRemoveTokenMutation,
  useGetAllNotificationTokensQuery,
} = pushNotificationApi;