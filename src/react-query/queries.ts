import { GET_ALL_POSTS } from '@/graphql/posts/postQueries'
import { useQuery } from '@apollo/client'

export const useFetchAllPosts = () => {
  const { data, loading, error } = useQuery(GET_ALL_POSTS)

  return {
    posts: data?.posts || [],
    isLoading: loading,
    error,
  }
}
