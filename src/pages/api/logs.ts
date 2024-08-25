// instances
import dbConnect from '~/instances/dbConnect'
// models
import Log from '~/models/log.model'
// utils
import {
  createApiHandler,
  validateRequest,
  type APIhandler
} from '~/utils/apiHelper'
// validators
import logValidator from '~/validators/log.validator'

// ---------------------------------------------------------------------

const postCreateLog: APIhandler = async (req, res) => {
  if (!validateRequest(req, res, { body: logValidator.create })) return

  await dbConnect()

  const log = new Log(req.body)

  await log.save()

  res.status(200).json({ results: log })
}

const getLogs: APIhandler = async (_req, res) => {
  await dbConnect()

  const results = await Log.find().sort({ createdAt: -1 }).limit(20)

  res.status(200).json({ results })
}

const handler = createApiHandler({
  POST: postCreateLog,
  GET: getLogs
})

export default handler
