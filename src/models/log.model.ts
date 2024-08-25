import mongoose, { Schema } from 'mongoose'

// ---------------------------------------------------------------------

// define schema
const schema = new Schema(
  {
    status: {
      type: Number,
      required: true
    },
    temperature: {
      type: Number,
      required: true
    }
  },
  { timestamps: true }
)

// infer type from schema
export type LogSchema = mongoose.InferSchemaType<typeof schema>

// define model
const Log =
  (mongoose.models.Log as mongoose.Model<LogSchema>) ??
  mongoose.model('Log', schema)

export default Log
