import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { tokenStore } from '../../api/axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers) => {
      const token = tokenStore.get()
      if (token) {
        headers.set('Authorization', `Bearer ${token}`)
      }
      return headers
    },
  }),
  tagTypes: ['Services', 'Inquiries', 'Users', 'Stats', 'Auth'],
  endpoints: () => ({}),
})
