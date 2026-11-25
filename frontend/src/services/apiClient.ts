import axios from 'axios'

const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL
  ?.replace(/\/+$/, '')
  .replace(/\/api$/i, '')

export const apiClient = axios.create({
  baseURL: `${configuredBaseUrl ?? ''}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
})
