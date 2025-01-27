import gqlClient from '@/graphql/client'
import {
  CREATE_MENTIONS,
  CREATE_POST,
  DELETE_POST,
} from '@/graphql/posts/postMutations'
import {
  FETCH_LIKES_FOR_POST,
  FETCH_POPULAR_POSTS,
  FETCH_RECENT_POSTS,
  FETCH_USER_POSTS,
  FETCH_USERS_BY_IDS,
  SEARCH_POSTS,
} from '@/graphql/posts/postQueries'
import { LIKE_POST, UNLIKE_POST } from '@/graphql/posts/postMutations'
import { supabase } from '@/lib/supabase/config'

// Uploads a file to Supabase Storage
export const uploadFileToSupabase = async (file: File) => {
  const fileName = `${Date.now()}-${file.name}` // Unique file name

  try {
    // Upload file to the 'posts' bucket
    const { error } = await supabase.storage
      .from('posts')
      .upload(fileName, file)

    if (error) throw new Error(error.message)

    // Get public URL for the uploaded file
    const {
      data: { publicUrl },
    } = supabase.storage.from('posts').getPublicUrl(fileName)

    return {
      success: true,
      message: 'File uploaded successfully',
      data: publicUrl,
    }
  } catch (error: any) {
    return { success: false, message: error.message }
  }
}

// Deletes a file from Supabase Storage
export const deleteFileFromSupabase = async (filePath: string) => {
  try {
    const { error } = await supabase.storage.from('posts').remove([filePath])
    if (error) throw error
    return { success: true, message: 'File deleted successfully' }
  } catch (error: any) {
    console.error('Error deleting file:', error)
    return { success: false, message: error.message }
  }
}

// Creates a new post in the database
export const createPost = async ({ postInput }: { postInput: any }) => {
  const { data } = await gqlClient.mutate({
    mutation: CREATE_POST,
    variables: { postInput }, // Provide the post details
  })
  return data
}

// Creates mentions for a post in the database
export const createMentions = async ({ mentions }: { mentions: any[] }) => {
  const { data } = await gqlClient.mutate({
    mutation: CREATE_MENTIONS,
    variables: { mentions }, // Provide the mentions data
  })
  return data
}

// Deletes a post by its ID
export const deletePost = async (postId: string) => {
  const { data } = await gqlClient.mutate({
    mutation: DELETE_POST,
    variables: { filter: { id: { eq: postId } } },
  })
  return data
}

// Processes post data by resolving additional information like mentioned users and likes
const processPosts = async (edges: any[]) => {
  return Promise.all(
    edges.map(async (edge: any) => {
      const post = edge?.node
      const author = post.users

      // Fetch mentioned users and likes for each post
      const mentionedUserIds = post.mentionsCollection.edges.flatMap(
        (edge: any) => edge.node.mentioned_users_id
      )
      const mentionedUsers = await fetchUsersByIds(mentionedUserIds)
      const likes = await fetchPostLikes(post.id)

      return {
        id: post.id,
        content: post.content,
        image_url: post.image_url,
        created_at: post.created_at,
        author: {
          id: author.id,
          name: author.name,
          username: author.username,
          avatar_url: author.avatar_url,
        },
        mentionedUsers,
        likes,
      }
    })
  )
}

// Fetches the most recent posts with pagination
export const fetchRecentPosts = async ({ pageParam = null }) => {
  const { data } = await gqlClient.query({
    query: FETCH_RECENT_POSTS,
    variables: { cursor: pageParam, limit: 10 }, // Fetch 10 posts per page
  })

  const edges = data?.postsCollection?.edges || []
  const posts = (await processPosts(edges)) || []

  return {
    posts, // List of processed posts
    nextCursor: data.postsCollection.pageInfo.endCursor,
    hasNextPage: data.postsCollection.pageInfo.hasNextPage,
  }
}

// Fetches popular posts based on likes and sorts them
export const fetchPopularPosts = async ({ pageParam = null }) => {
  const today = new Date()
  today.setUTCHours(0, 0, 0, 0)
  const isoDate = today.toISOString() // Start of the current day in ISO format

  const { data } = await gqlClient.query({
    query: FETCH_POPULAR_POSTS,
    variables: { date: isoDate, cursor: pageParam, limit: 10 },
  })

  const edges = data?.postsCollection?.edges || []
  const posts = await processPosts(edges)
  const sortedPosts =
    posts.sort((a, b) => b.likes.length - a.likes.length) || [] // Sort by number of likes

  return {
    posts: sortedPosts,
    nextCursor: data.postsCollection.pageInfo.endCursor,
    hasNextPage: data.postsCollection.pageInfo.hasNextPage,
  }
}

// Fetches users by their IDs
const fetchUsersByIds = async (userIds: string[]) => {
  if (!userIds || userIds.length === 0) return []

  const { data } = await gqlClient.query({
    query: FETCH_USERS_BY_IDS,
    variables: { userIds },
  })

  return data?.usersCollection?.edges.map((edge: any) => edge.node) || []
}

// Fetches likes for a specific post
export const fetchPostLikes = async (postId: string) => {
  const { data } = await gqlClient.query({
    query: FETCH_LIKES_FOR_POST,
    variables: { postId },
  })

  const likes =
    data?.postsCollection?.edges[0]?.node?.likesCollection?.edges?.map(
      (edge: any) => edge.node
    ) || []

  const likeUserIds = likes.map((like: any) => like.user_id)

  return fetchUsersByIds(likeUserIds) // Return users who liked the post
}

// Adds a like to a post
export const likePost = async ({ likeInput }: { likeInput: any }) => {
  const { data } = await gqlClient.mutate({
    mutation: LIKE_POST,
    variables: { likeInput },
  })
  return data
}

// Removes a like from a post
export const unlikePost = async ({ filter }: { filter: any }) => {
  const { data } = await gqlClient.mutate({
    mutation: UNLIKE_POST,
    variables: { filter },
  })
  return data
}

// Searches posts by a term and returns results with pagination
export const searchPosts = async ({
  searchTerm,
  pageParam = null,
}: {
  searchTerm: string
  pageParam?: any
}) => {
  const wildcardSearch = `%${searchTerm}%`

  const { data } = await gqlClient.query({
    query: SEARCH_POSTS,
    variables: { searchTerm: wildcardSearch, cursor: pageParam, limit: 10 },
  })

  const edges = data?.postsCollection?.edges || []
  const posts = await processPosts(edges)

  return {
    posts, // List of processed posts
    nextCursor: data.postsCollection.pageInfo.endCursor,
    hasNextPage: data.postsCollection.pageInfo.hasNextPage,
  }
}

// Fetches posts for a specific user with pagination
export const fetchUserPosts = async ({
  authorId,
  pageParam = null,
}: {
  authorId: string
  pageParam?: any
}) => {
  const { data } = await gqlClient.query({
    query: FETCH_USER_POSTS,
    variables: { authorId, cursor: pageParam, limit: 10 },
  })

  const edges = data?.postsCollection?.edges || []
  const posts = await processPosts(edges)

  return {
    posts,
    nextCursor: data?.postsCollection?.pageInfo?.endCursor,
    hasNextPage: data?.postsCollection?.pageInfo?.hasNextPage,
  }
}
