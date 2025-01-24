import gqlClient from '@/graphql/client'
import {
  FOLLOW_USER,
  IS_FOLLOWING,
  UNFOLLOW_USER,
} from '@/graphql/users/userMutations'
import {
  FETCH_POSTS_COUNT,
  FETCH_RANDOM_USERS,
  FETCH_USER_DETAILS,
  SEARCH_USERS,
} from '@/graphql/users/userQueries'
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

export const searchUsers = async ({
  searchTerm,
  userId,
  pageParam = null,
}: {
  searchTerm: string
  userId: string
  pageParam: any
}) => {
  const { data } = await gqlClient.query({
    query: SEARCH_USERS,
    variables: { searchTerm: `%${searchTerm}%`, userId, pageParam, limit: 10 },
  })

  const searchedUsers =
    data?.usersCollection?.edges?.map((edge: any) => edge.node) || []

  return {
    users: searchedUsers,
    nextCursor: data?.usersCollection?.pageInfo?.endCursor,
    hasNextPage: data?.usersCollection?.pageInfo?.hasNextPage,
  }
}

export const fetchRandomUsers = async ({
  userId,
  pageParam = null,
}: {
  userId: string
  pageParam: any
}) => {
  const { data } = await gqlClient.query({
    query: FETCH_RANDOM_USERS,
    variables: { userId, cursor: pageParam, limit: 10 },
  })

  const users =
    data?.usersCollection?.edges.map((edge: any) => ({
      ...edge.node,
      isFollowing: edge.node.is_following?.edges?.length > 0,
    })) || []

  // Randomize users and return the first 10
  const shuffledUsers = shuffle(users).slice(0, 10)

  return {
    users: shuffledUsers,
    nextCursor: data?.usersCollection?.pageInfo?.endCursor,
    hasNextPage: data?.usersCollection?.pageInfo?.hasNextPage,
  }
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

export const FetchUserDetails = async (userId: string) => {
  const { data } = await gqlClient.query({
    query: FETCH_USER_DETAILS,
    variables: { userId },
  })
  const user = data?.usersCollection?.edges[0]?.node || null
  const followersCount = data?.followers?.edges.length || 0
  const followingCount = data?.following?.edges.length || 0

  const postsCount = await fetchPostsCount(userId)

  return user
    ? {
        ...user,
        postsCount,
        followersCount,
        followingCount,
      }
    : null
}

const fetchPostsCount = async (authorId: string) => {
  let totalPostsCount = 0
  let hasNextPage = true
  let cursor = null

  while (hasNextPage) {
    const { data }: any = await gqlClient.query({
      query: FETCH_POSTS_COUNT,
      variables: { authorId, cursor },
    })

    totalPostsCount += data?.postsCollection?.edges?.length || 0

    hasNextPage = data?.postsCollection?.pageInfo?.hasNextPage
    cursor = data?.postsCollection?.pageInfo?.endCursor
  }

  return totalPostsCount
}
