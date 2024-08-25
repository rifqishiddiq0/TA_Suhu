import useSWR, { type SWRConfiguration, type SWRResponse } from 'swr'
import { type AxiosError } from 'axios'
// service
import { type ServiceFnResponse } from '~/services/_factory'

// ------------------------------------------------------------------------

type ServiceFn = (...args: any[]) => ServiceFnResponse
// SWR hook always wrap service function, which expect
// a {message: string, results: any} response from server
type CustomSWRData<T extends ServiceFn> = Awaited<
  ReturnType<T>
>['data']['results']

// adjust SWRResponse type to include isLoading
type CustomSWRReturn<T extends ServiceFn> = SWRResponse<
  CustomSWRData<T>,
  AxiosError
>

// type for swr hook returned from createSWR
type CustomSWR<T extends ServiceFn> = (
  ...args: Parameters<T> | [null]
) => CustomSWRReturn<T>

export type CreateSWROptions<T> = {
  key: string
  fetcher: T
  SWROption?: SWRConfiguration
}

export function createSWR<T extends ServiceFn>({
  key,
  fetcher,
  SWROption
}: CreateSWROptions<T>): CustomSWR<T> {
  return (...hookArgs): CustomSWRReturn<T> => {
    const isBlockFetch =
      // condition 1: explicitly block fetch
      // i.e. args passed to hook is null and only null (e.g. useUser(null))
      hookArgs.length === 1 && hookArgs[0] === null

    const swr = useSWR<CustomSWRData<T>, AxiosError>(
      // set swrKey is set to null to block fetch,
      isBlockFetch ? null : [key, hookArgs],
      async (swrFetcherArgs): Promise<CustomSWRData<T>> => {
        const response = await fetcher(
          ...(swrFetcherArgs[1] as Parameters<T>)
        ).then((res) => res.data?.results)

        return response
      },
      SWROption
    )

    return swr
  }
}
