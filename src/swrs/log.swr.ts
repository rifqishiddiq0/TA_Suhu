import { createSWR } from './_factory'
// services
import logService from '~/services/log.service'

// --------------------------------------------------------------------------------------------

export const useLogList = createSWR({
  key: 'log/list',
  fetcher: logService.getList,
  SWROption: {
    revalidateOnFocus: true,
    refreshInterval: 300000
  }
})
