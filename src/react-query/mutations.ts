import { login, logout, signUpUser } from '@/actions/auth.actions'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  createMentions,
  createPost,
  deletePost,
  likePost,
  unlikePost,
} from '@/actions/posts.actions'
import { QUERY_KEYS } from '@/graphql/posts/queryKeys'

export const useSignUpUser = () => {
  return useMutation({
    mutationFn: signUpUser,
  })
}

export const useLogin = () => {
  return useMutation({
    mutationFn: login,
  })
}

export const useLogout = () => {
  return useMutation({
    mutationFn: logout,
  })
}

export const useCreatePost = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_RECENT_POSTS] })
    },
  })
}

export const useCreateMentions = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createMentions,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_RECENT_POSTS] })
    },
  })
}

export const useDeletePost = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deletePost,
    onMutate: async (postId) => {
      await queryClient.cancelQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      })

      const previousPosts = queryClient.getQueryData([
        QUERY_KEYS.GET_RECENT_POSTS,
      ])

      queryClient.setQueryData(
        [QUERY_KEYS.GET_RECENT_POSTS],
        (oldPosts: any) => {
          return oldPosts?.filter((post: any) => post.id !== postId)
        }
      )

      return { previousPosts }
    },
    onError: (error, postId, context) => {
      queryClient.setQueryData(
        [QUERY_KEYS.GET_RECENT_POSTS],
        context?.previousPosts
      )
      console.error('Error deleting post:', error)
    },
  })
}

export const useLikePost = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: likePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_RECENT_POSTS] })
    },
  })
}

export const useUnlikePost = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: unlikePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_RECENT_POSTS] })
    },
  })
}
