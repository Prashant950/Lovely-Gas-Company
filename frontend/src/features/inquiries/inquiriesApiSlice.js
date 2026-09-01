import { apiSlice } from '../api/apiSlice'

export const inquiriesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getInquiries: builder.query({
      query: () => '/inquiries',
      transformResponse: (response) => response.inquiries || [],
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: 'Inquiries', id: _id })),
              { type: 'Inquiries', id: 'LIST' },
            ]
          : [{ type: 'Inquiries', id: 'LIST' }],
    }),

    getMyInquiries: builder.query({
      query: () => '/inquiries/my',
      transformResponse: (response) => response.inquiries || [],
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: 'Inquiries', id: _id })),
              { type: 'Inquiries', id: 'MY_LIST' },
            ]
          : [{ type: 'Inquiries', id: 'MY_LIST' }],
    }),

    createInquiry: builder.mutation({
      query: (body) => ({
        url: '/inquiries',
        method: 'POST',
        body,
      }),
      invalidatesTags: [
        { type: 'Inquiries', id: 'LIST' },
        { type: 'Inquiries', id: 'MY_LIST' },
        'Stats',
      ],
    }),

    updateInquiry: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/inquiries/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Inquiries', id },
        { type: 'Inquiries', id: 'LIST' },
        { type: 'Inquiries', id: 'MY_LIST' },
        'Stats',
      ],
    }),

    deleteInquiry: builder.mutation({
      query: (id) => ({
        url: `/inquiries/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Inquiries', id },
        { type: 'Inquiries', id: 'LIST' },
        { type: 'Inquiries', id: 'MY_LIST' },
        'Stats',
      ],
    }),
  }),
})

export const {
  useGetInquiriesQuery,
  useGetMyInquiriesQuery,
  useCreateInquiryMutation,
  useUpdateInquiryMutation,
  useDeleteInquiryMutation,
} = inquiriesApiSlice
