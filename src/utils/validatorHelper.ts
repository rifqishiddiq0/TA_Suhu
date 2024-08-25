import { z } from 'zod'
// utils
import { parseBooleanish } from '~/utils/generalHelper'

// ---------------------------------------------------------------------------------------------
// GENERAL

/**
 * Same as z.boolean() but also accepts string 'true' and 'false' and number 1 and 0
 * if the value is not one of those, it will return the value itself
 */
export const zBooleanish = (
  errorMessage?: string
): z.ZodEffects<z.ZodBoolean, boolean, unknown> =>
  z.preprocess(
    (val) => {
      const parsedVal = parseBooleanish(val, null)

      return parsedVal ?? val
    },
    z.boolean({
      errorMap: () => ({
        message:
          errorMessage ??
          'must be a boolean or boolean like value (i.e. 1, 0, "true", "false")!'
      })
    })
  )

/**
 * Validate ISO Date string (YYYY-MM-DD)
 */
export const zDateISO = (errorMessage?: string): z.Schema<string> => {
  return z.custom<string>((val) => {
    return (
      typeof val === 'string' &&
      /^((19|20)\d\d)-(0?[1-9]|1[012])-(0?[1-9]|[12][0-9]|3[01])$/.test(val)
    )
  }, errorMessage ?? 'date must be a valid ISO8601 date (YYYY-MM-DD)!')
}

export const zPhone = (errorMessage?: string): z.Schema<string> => {
  return z.custom<string>((val) => {
    if (typeof val !== 'string') return false

    // remove + and replace 0 with 62
    const normalizedVal = val.replace(/^\+/, '').replace(/^0/, '62')

    // normal phone number length is:
    // 11 digits min for landline, i.e. 6221 1234567
    // 11 digits min for mobile, i.e. 62812 123456
    // 15 digits max for mobile, i.e. 62812 123456789
    return /^\d{11,15}$/.test(normalizedVal)
  }, errorMessage ?? 'invalid phone number, only 11-15 digits number are allowed!')
}

// ---------------------------------------------------------------------------------------------
// PASSWORD

export const VALIDATOR_PASSWORD_MIN_LENGTH = 8
export const VALIDATOR_PASSWORD_MAX_LENGTH = 32

export type ZStrongPasswordParams = {
  min?: string
  max?: string
  uppercase?: string
  lowercase?: string
  number?: string
}
/**
 * Validate strong password, with following rules:
 * - *min*: at least 8 characters
 * - *max*: at most 32 characters
 * - *uppercase*: at least one uppercase letter
 * - *lowercase*: at least one lowercase letter
 * - *number*: at least one number
 */
export const zStrongPassword = (
  errorMessage?: ZStrongPasswordParams
): z.Schema<string> => {
  return z
    .string()
    .min(
      VALIDATOR_PASSWORD_MIN_LENGTH,
      errorMessage?.min ?? 'Password must be at least 8 characters'
    )
    .max(
      VALIDATOR_PASSWORD_MAX_LENGTH,
      errorMessage?.max ?? 'Password must be at most 32 characters'
    )
    .refine(
      (val) => /[A-Z]/.test(val),
      errorMessage?.uppercase ??
        'Password must contain at least one uppercase letter.'
    )
    .refine(
      (val) => /[a-z]/.test(val),
      errorMessage?.lowercase ??
        'Password must contain at least one lowercase letter.'
    )
    .refine(
      (val) => /[0-9]/.test(val),
      errorMessage?.number ?? 'Password must contain at least one number.'
    )
}

/**
 * Helper function to validate password length
 * Useful for non-new password field, where we only need to check the length
 * without the need to check the complexity
 * Also important for BE to avoid password hash overloading attack
 */
export const zPasswordLength = (errorMessage?: string): z.Schema<string> => {
  return z
    .string()
    .min(
      VALIDATOR_PASSWORD_MIN_LENGTH,
      errorMessage ?? 'Password is not valid!'
    )
    .max(
      VALIDATOR_PASSWORD_MAX_LENGTH,
      errorMessage ?? 'Password is not valid!'
    )
}

// ---------------------------------------------------------------------------------------------
// FRONTEND FORMS

/**
 * By default, `z.optional()` will only allow undefined as optional value
 * This function will allow null and empty string as optional value,
 * which might be the default values by controlled forms in FE
 */
export function zOptionalInput<T extends z.ZodTypeAny>(
  schema: T,
  fallback?: null | undefined
): z.ZodEffects<z.ZodOptional<T>> {
  return z.preprocess((val) => {
    if (val === undefined || val === null || val === '') {
      return fallback
    }

    return val
  }, schema.optional())
}
