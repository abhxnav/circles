import { login, signUpUser } from '@/actions/auth.actions'
import { SigninFormSchema, SignupFormSchema } from '@/lib/validations'
import { useMutation } from '@tanstack/react-query'
import { z } from 'zod'

export const useSignUpUser = () => {
  return useMutation({
    mutationFn: (values: z.infer<typeof SignupFormSchema>) =>
      signUpUser(values),
  })
}

export const useLogin = () => {
  return useMutation({
    mutationFn: (values: z.infer<typeof SigninFormSchema>) => login(values),
  })
}
