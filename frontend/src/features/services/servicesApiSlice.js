import { apiSlice } from '../api/apiSlice'

export const servicesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getServices: builder.query({
      query: (params = {}) => ({
        url: '/services',
        params: params.all ? { all: 'true' } : {},
      }),
      transformResponse: (response) => response.services || [],
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: 'Services', id: _id })),
              { type: 'Services', id: 'LIST' },
            ]
          : [{ type: 'Services', id: 'LIST' }],
    }),

    getServiceById: builder.query({
      query: (id) => `/services/${id}`,
      transformResponse: (response) => response.service,
      providesTags: (result, error, id) => [{ type: 'Services', id }],
    }),

    createService: builder.mutation({
      query: (body) => ({
        url: '/services',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Services', id: 'LIST' }, 'Stats'],
    }),

    updateService: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/services/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Services', id },
        { type: 'Services', id: 'LIST' },
        'Stats',
      ],
    }),

    deleteService: builder.mutation({
      query: (id) => ({
        url: `/services/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Services', id },
        { type: 'Services', id: 'LIST' },
        'Stats',
      ],
    }),

    uploadImage: builder.mutation({
      query: (formData) => ({
        url: '/upload',
        method: 'POST',
        body: formData,
      }),
    }),
  }),
})

export const {
  useGetServicesQuery,
  useGetServiceByIdQuery,
  useCreateServiceMutation,
  useUpdateServiceMutation,
  useDeleteServiceMutation,
  useUploadImageMutation,
} = servicesApiSlice
