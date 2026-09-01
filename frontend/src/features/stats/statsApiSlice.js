import { apiSlice } from '../api/apiSlice'

export const statsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getStats: builder.query({
      query: () => '/stats',
      transformResponse: (response) => response.stats,
      providesTags: ['Stats'],
    }),
  }),
})

export const { useGetStatsQuery } = statsApiSlice
