import mongoose, { type Mongoose } from 'mongoose'

// ---------------------------------------------------------------------

type cachedConnection = {
  conn: Mongoose | null
  promise: Promise<Mongoose> | null
}

declare global {
  // eslint-disable-next-line no-var
  var mongoose: cachedConnection
}

// ---------------------------------------------------------------------

const MONGODB_URI: string | undefined = process.env.MONGODB_URI

if (MONGODB_URI == null) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  )
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached: cachedConnection = global.mongoose

if (cached == null) {
  cached = global.mongoose = { conn: null, promise: null }
}

async function dbConnect(): Promise<Mongoose> {
  if (cached.conn != null) {
    return cached.conn
  }

  if (cached.promise == null) {
    const opts = {
      bufferCommands: false
    }

    cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
      return mongoose
    })
  }

  try {
    cached.conn = await cached.promise
  } catch (e) {
    cached.promise = null
    throw e
  }

  return cached.conn
}

export default dbConnect
