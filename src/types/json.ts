export type JSONValue =
  | JSONPrimitive
  | JSONValue[]
  | { [key: string]: JSONValue }
  // while technically not a JSON value, we allow undefined in our JSON objects
  // to make submitting partial updates easier
  | undefined

export type JSONPrimitive = string | number | boolean | null

export type JSONObject = Record<string, JSONValue>

export type FlatJSONObject = Record<string, JSONPrimitive>
