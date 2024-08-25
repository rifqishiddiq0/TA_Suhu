import z from 'zod'

// ---------------------------------------------------------------------

export type LogCreate = z.infer<typeof create>
const create = z.object({
  temperature: z.number(),
  status: z
    .number()
    .int('Status must be either -1, 0, 1!')
    .lte(1, 'Status must be either -1, 0, 1!')
    .gte(-1, 'Status must be either -1, 0, 1!')
})

const logValidator = {
  create
}

export default logValidator
