// axios
import axios, { type AxiosResponse } from 'axios'
// utils
import { type JSONValue } from '~/types/json'

// ------------------------------------------------------------------------
// CUSTOM AXIOS DEFINITIONS

export const getEndpointUrl = (path: string): string => `/api/${path}`

const axs = axios.create({
  withCredentials: true
})

axs.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.code === 'ERR_NETWORK') {
      error.message =
        'Unable to connect to server, please try again in a while.'
    }

    if (error.response == null) {
      error.message =
        'Unable to get response from server, please try again in a while.'
    }

    return await Promise.reject(error)
  }
)

// ------------------------------------------------------------------------
// SERVICE FUNCTIONS

export type ServiceFnResponse<T = JSONValue | undefined> = Promise<
  AxiosResponse<{
    message: string
    results: T
  }>
>

// GET
export function serviceGet<T = JSONValue | undefined>(
  endpoint: string,
  query?: Record<string, JSONValue>
): ServiceFnResponse<T> {
  return axs.get(getEndpointUrl(endpoint), {
    params: query ?? {}
  })
}

// POST
export function servicePost<T = JSONValue | undefined>(
  endpoint: string,
  payload?: Record<string, JSONValue>
): ServiceFnResponse<T> {
  return axs.post(getEndpointUrl(endpoint), payload)
}

// PATCH
export function servicePatch<T = JSONValue | undefined>(
  endpoint: string,
  payload?: Record<string, JSONValue>
): ServiceFnResponse<T> {
  return axs.patch(getEndpointUrl(endpoint), payload)
}

// PUT
export function servicePut<T = JSONValue | undefined>(
  endpoint: string,
  payload?: Record<string, JSONValue>
): ServiceFnResponse<T> {
  return axs.put(getEndpointUrl(endpoint), payload)
}

// DELETE
export function serviceDelete<T = JSONValue | undefined>(
  endpoint: string,
  payload?: Record<string, JSONValue>
): ServiceFnResponse<T> {
  return axs.delete(getEndpointUrl(endpoint), payload)
}
