// next
import { type NextApiRequest, type NextApiResponse } from 'next'
// types
import { ZodError, ZodSchema } from 'zod'
// utils
import { serializeError } from 'serialize-error'

// ---------------------------------------------------------------------

export type HTTPMethod =
  | 'GET'
  | 'POST'
  | 'PUT'
  | 'PATCH'
  | 'DELETE'
  | 'CONNECT'
  | 'OPTIONS'
  | 'TRACE'
  | 'HEAD'

export type APIhandler<
  ReqQuery = Record<string, string | string[]>,
  ReqBody = Record<string, any>
> = (
  req: NextApiRequest & {
    query: ReqQuery
    body: ReqBody
  },
  res: NextApiResponse
) => Promise<void>

export function createApiHandler(
  handler: Partial<Record<HTTPMethod, APIhandler>>
): APIhandler {
  return async (req, res) => {
    const methodName = req.method
    const methodHandler = methodName ? handler[methodName as HTTPMethod] : null

    if (methodHandler == null) {
      res.status(405).json({ message: `Method ${methodName} is not allowed!` })
    } else {
      // global error handling
      try {
        await methodHandler(req, res)
      } catch (err) {
        console.error(
          // log message
          `[${req.method}] ${req.url} - Unhandled error: ${(err as Error).message}`,
          // dump request data
          { query: req.query, body: req.body, headers: req.headers },
          // dump error stack trace
          serializeError(err)
        )

        res.status(500).json({
          code: 'server-error',
          message:
            'There is an error when processing your request, please try again later.'
        })
      }
    }
  }
}

/**
 * Validate request data based on the provided schema
 * Note: pass `true` to schema to allow any data type
 */
export function validateRequest(
  req: NextApiRequest,
  res: NextApiResponse,
  schema?: {
    body?: ZodSchema | true
    query?: ZodSchema | true
  }
): boolean {
  try {
    if (schema?.body instanceof ZodSchema) {
      const bodyResult = schema.body.parse(req.body)

      req.body = bodyResult
    } else if (schema?.body !== true) {
      req.body = {}
    }

    if (schema?.query instanceof ZodSchema) {
      const queryResult = schema.query.parse(req.query)

      req.query = queryResult
    } else if (schema?.query !== true) {
      req.query = {}
    }

    return true
  } catch (err) {
    // handle validation error
    if (err instanceof ZodError) {
      res.status(400).json({
        code: 'validation-error',
        message:
          'Invalid input data provided. Make sure your input is correct and try again.',
        results: err.flatten().fieldErrors
      })
    }

    return false
  }
}
