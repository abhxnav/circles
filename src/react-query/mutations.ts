import { login, logout, signUpUser } from '@/actions/auth.actions'
import { SigninFormSchema, SignupFormSchema } from '@/lib/validations'
import { useMutation } from '@tanstack/react-query'
import { useMutation as useGQLMutation } from '@apollo/client'
import { z } from 'zod'
import {
  CREATE_MENTIONS,
  CREATE_POST,
  DELETE_POST,
} from '@/graphql/posts/postMutations'

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

export const useLogout = () => {
  return useMutation({
    mutationFn: () => logout(),
  })
}

export const useCreatePost = () => {
  const [createPost, { loading, error }] = useGQLMutation(CREATE_POST)

  return {
    createPost,
    isLoading: loading,
    error,
  }
}

export const useCreateMentions = () => {
  const [createMentions, { loading, error }] = useGQLMutation(CREATE_MENTIONS)

  return {
    createMentions,
    isLoading: loading,
    error,
  }
}

export const useDeletePost = () => {
  const [deletePost, { loading, error }] = useGQLMutation(DELETE_POST)

  return {
    deletePost,
    isLoading: loading,
    error,
  }
}
