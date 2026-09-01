import { apiSlice } from '../api/apiSlice'

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => '/users',
      transformResponse: (response) => response.users || [],
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: 'Users', id: _id })),
              { type: 'Users', id: 'LIST' },
            ]
          : [{ type: 'Users', id: 'LIST' }],
    }),

    getUserById: builder.query({
      query: (id) => `/users/${id}`,
      transformResponse: (response) => response.user,
      providesTags: (result, error, id) => [{ type: 'Users', id }],
    }),

    createUser: builder.mutation({
      query: (body) => ({
        url: '/users',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Users', id: 'LIST' }, 'Stats'],
    }),

    updateUser: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/users/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Users', id },
        { type: 'Users', id: 'LIST' },
        'Stats',
      ],
    }),

    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Users', id },
        { type: 'Users', id: 'LIST' },
        'Stats',
      ],
    }),
  }),
})

export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = usersApiSlice
