import { z } from 'zod'

export const SignupFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Name must be at least 2 characters' })
    .regex(/^[a-zA-Z\s]+$/, {
      message: 'Name can not contain numbers or special characters',
    }),
  username: z
    .string()
    .min(2, { message: 'Username must be at least 2 characters' }),
  email: z.string().email({ message: 'Invalid email address' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters' })
    .regex(/(?=.*[A-Z])/, {
      message: 'Password must contain at least one uppercase letter',
    })
    .regex(/(?=.*[a-z])/, {
      message: 'Password must contain at least one lowercase letter',
    })
    .regex(/(?=.*\d)/, { message: 'Password must contain at least one digit' })
    .regex(/(?=.*[@$!%*?&])/, {
      message: 'Password must contain at least one special character (@$!%*?&)',
    }),
})

export const SigninFormSchema = z.object({
  username: z
    .string()
    .min(2, { message: 'Username must be at least 2 characters' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters' })
    .regex(/(?=.*[A-Z])/, {
      message: 'Password must contain at least one uppercase letter',
    })
    .regex(/(?=.*[a-z])/, {
      message: 'Password must contain at least one lowercase letter',
    })
    .regex(/(?=.*\d)/, { message: 'Password must contain at least one digit' })
    .regex(/(?=.*[@$!%*?&])/, {
      message: 'Password must contain at least one special character (@$!%*?&)',
    }),
})
