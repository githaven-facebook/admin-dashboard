import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { getSession } from 'next-auth/react'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1'

const MAX_RETRIES = 3
const RETRY_DELAY_MS = 1000

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function isRetryableError(error: AxiosError): boolean {
  if (!error.response) return true
  const status = error.response.status
  return status === 429 || status === 502 || status === 503 || status === 504
}

const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use(
  async (config) => {
    const session = await getSession()
    if (session?.accessToken) {
      config.headers.Authorization = `Bearer ${session.accessToken}`
    }
    return config
  },
  (error: AxiosError) => Promise.reject(error)
)

apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const config = error.config as AxiosRequestConfig & { _retryCount?: number }
    if (!config) return Promise.reject(error)

    config._retryCount = config._retryCount ?? 0

    if (isRetryableError(error) && config._retryCount < MAX_RETRIES) {
      config._retryCount += 1
      const delay = RETRY_DELAY_MS * Math.pow(2, config._retryCount - 1)
      await sleep(delay)
      return apiClient(config)
    }

    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        window.location.href = '/login'
      }
    }

    return Promise.reject(error)
  }
)

export default apiClient

export type { AxiosError, AxiosResponse }
