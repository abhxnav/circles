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

// Fetches all users from the database without any filters
export const getAllUsers = async () => {
  try {
    const { data: users, error: fetchError } = await supabase
      .from('users')
      .select('*') // Fetch all fields from the 'users' table

    if (fetchError) throw new Error(fetchError.message) // Handle any errors during the fetch
    return { success: true, message: 'Users fetched successfully', data: users }
  } catch (error: any) {
    return { success: false, message: error.message } // Return an error message if something goes wrong
  }
}

// Searches for users whose username or name matches the search term
// Excludes the currently logged-in user (userId)
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
    variables: { searchTerm: `%${searchTerm}%`, userId, pageParam, limit: 10 }, // Paginated results
  })

  // Extract user nodes from the query response
  const searchedUsers =
    data?.usersCollection?.edges?.map((edge: any) => edge.node) || []

  return {
    users: searchedUsers, // List of users matching the search term
    nextCursor: data?.usersCollection?.pageInfo?.endCursor, // Cursor for fetching the next page
    hasNextPage: data?.usersCollection?.pageInfo?.hasNextPage, // Whether more pages are available
  }
}

// Fetches random users, excluding the logged-in user (userId)
// Supports pagination and shuffles the results for variety
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

  // Extract users and mark if the current user is following them
  const users =
    data?.usersCollection?.edges.map((edge: any) => ({
      ...edge.node,
      isFollowing: edge.node.is_following?.edges?.length > 0, // Check if the logged-in user follows them
    })) || []

  // Shuffle the users for randomness and limit to 10 results
  const shuffledUsers = shuffle(users).slice(0, 10)

  return {
    users: shuffledUsers, // Shuffled list of users
    nextCursor: data?.usersCollection?.pageInfo?.endCursor, // Cursor for next page
    hasNextPage: data?.usersCollection?.pageInfo?.hasNextPage, // Whether more pages are available
  }
}

// Sends a follow request for the target user
export const followUser = async ({
  followerId,
  followeeId,
}: {
  followerId: string
  followeeId: string
}) => {
  const { data } = await gqlClient.mutate({
    mutation: FOLLOW_USER,
    variables: { followerId, followeeId }, // Specify the IDs for the follow relationship
  })

  return data // Return the mutation response
}

// Sends an unfollow request for the target user
export const unfollowUser = async ({
  followerId,
  followeeId,
}: {
  followerId: string
  followeeId: string
}) => {
  const { data } = await gqlClient.mutate({
    mutation: UNFOLLOW_USER,
    variables: { followerId, followeeId }, // Specify the IDs for the unfollow relationship
  })

  return data // Return the mutation response
}

// Checks if the logged-in user is following the target user
export const isFollowing = async ({
  followerId,
  followeeId,
}: {
  followerId: string
  followeeId: string
}) => {
  const { data } = await gqlClient.query({
    query: IS_FOLLOWING,
    variables: { followerId, followeeId }, // Provide follower and followee IDs
  })

  return data // Return the query response
}

// Fetches detailed information about a user, including followers, following, and post count
export const FetchUserDetails = async (userId: string) => {
  const { data } = await gqlClient.query({
    query: FETCH_USER_DETAILS,
    variables: { userId }, // Fetch data for the specified user
  })

  const user = data?.usersCollection?.edges[0]?.node || null // Extract user details
  const followersCount = data?.followers?.edges.length || 0 // Number of followers
  const followingCount = data?.following?.edges.length || 0 // Number of users they follow

  // Calculate the total number of posts for the user using pagination
  const postsCount = await fetchPostsCount(userId)

  return user
    ? {
        ...user,
        postsCount, // Total posts by the user
        followersCount, // Total followers
        followingCount, // Total following
      }
    : null
}

// Helper function to fetch the total number of posts for a user
const fetchPostsCount = async (authorId: string) => {
  let totalPostsCount = 0 // Initialize count
  let hasNextPage = true // Continue fetching until all pages are retrieved
  let cursor = null // Cursor for pagination

  while (hasNextPage) {
    const { data }: any = await gqlClient.query({
      query: FETCH_POSTS_COUNT,
      variables: { authorId, cursor }, // Fetch posts for the current page
    })

    totalPostsCount += data?.postsCollection?.edges?.length || 0 // Add count from the current page

    // Update pagination info for the next iteration
    hasNextPage = data?.postsCollection?.pageInfo?.hasNextPage
    cursor = data?.postsCollection?.pageInfo?.endCursor
  }

  return totalPostsCount // Return the total post count
}
