import { apiSlice } from '../api/apiSlice'

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (userData) => ({
        url: '/auth/register',
        method: 'POST',
        body: userData,
      }),
      invalidatesTags: ['Auth', 'Users', 'Stats'],
    }),

    login: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['Auth'],
    }),

    forgotPassword: builder.mutation({
      query: (body) => ({
        url: '/auth/forgot-password',
        method: 'POST',
        body,
      }),
    }),

    resetPassword: builder.mutation({
      query: (body) => ({
        url: '/auth/reset-password',
        method: 'POST',
        body,
      }),
    }),

    getMe: builder.query({
      query: () => '/auth/me',
      transformResponse: (response) => response.user,
      providesTags: ['Auth'],
    }),

    updateProfile: builder.mutation({
      query: (body) => ({
        url: '/auth/profile',
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Auth'],
    }),
  }),
})

export const {
  useRegisterMutation,
  useLoginMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useGetMeQuery,
  useUpdateProfileMutation,
} = authApiSlice
