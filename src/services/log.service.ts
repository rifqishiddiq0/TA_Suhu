import { serviceGet, type ServiceFnResponse } from './_factory'

// --------------------------------------------------------------------------------------------

const getList = (): ServiceFnResponse<
  Array<{
    temperature: number
    status: number
    createdAt: string
    updatedAt: string
  }>
> => serviceGet('/logs')

const logService = {
  getList
}

export default logService
