import gqlClient from '@/graphql/client'
import {
  FOLLOW_USER,
  IS_FOLLOWING,
  UNFOLLOW_USER,
} from '@/graphql/users/userMutations'
import { FETCH_RANDOM_USERS, SEARCH_USERS } from '@/graphql/users/userQueries'
import { supabase } from '@/lib/supabase/config'
import { shuffle } from 'lodash'

export const getAllUsers = async () => {
  try {
    const { data: users, error: fetchError } = await supabase
      .from('users')
      .select('*')

    if (fetchError) throw new Error(fetchError.message)
    return { success: true, message: 'Users fetched successfully', data: users }
  } catch (error: any) {
    return { success: false, message: error.message }
  }
}

export const searchUsers = async (searchTerm: string, userId: string) => {
  const { data } = await gqlClient.query({
    query: SEARCH_USERS,
    variables: { searchTerm: `%${searchTerm}%`, userId },
  })

  return data?.usersCollection?.edges?.map((edge: any) => edge.node) || []
}

export const fetchRandomUsers = async (userId: string) => {
  const { data } = await gqlClient.query({
    query: FETCH_RANDOM_USERS,
    variables: { userId },
  })

  const users =
    data?.usersCollection?.edges.map((edge: any) => ({
      ...edge.node,
      isFollowing: edge.node.is_following?.edges?.length > 0,
    })) || []

  // Randomize users and return the first 10
  return shuffle(users).slice(0, 10)
}

export const followUser = async ({
  followerId,
  followeeId,
}: {
  followerId: string
  followeeId: string
}) => {
  const { data } = await gqlClient.mutate({
    mutation: FOLLOW_USER,
    variables: { followerId, followeeId },
  })

  return data
}

export const unfollowUser = async ({
  followerId,
  followeeId,
}: {
  followerId: string
  followeeId: string
}) => {
  const { data } = await gqlClient.mutate({
    mutation: UNFOLLOW_USER,
    variables: { followerId, followeeId },
  })

  return data
}

export const isFollowing = async ({
  followerId,
  followeeId,
}: {
  followerId: string
  followeeId: string
}) => {
  const { data } = await gqlClient.query({
    query: IS_FOLLOWING,
    variables: { followerId, followeeId },
  })

  return data
}
