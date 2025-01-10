import gqlClient from '@/graphql/client'
import {
  CREATE_MENTIONS,
  CREATE_POST,
  DELETE_POST,
} from '@/graphql/posts/postMutations'
import {
  FETCH_LIKES_FOR_POST,
  FETCH_RECENT_POSTS,
  FETCH_USERS_BY_IDS,
  LIKE_POST,
  UNLIKE_POST,
} from '@/graphql/posts/postQueries'
import { supabase } from '@/lib/supabase/config'

export const uploadFileToSupabase = async (file: File) => {
  const fileName = `${Date.now()}-${file.name}`

  try {
    const { error } = await supabase.storage
      .from('posts')
      .upload(fileName, file)

    if (error) throw new Error(error.message)

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

export const createPost = async ({ postInput }: { postInput: any }) => {
  const { data } = await gqlClient.mutate({
    mutation: CREATE_POST,
    variables: { postInput },
  })

  return data
}

export const createMentions = async ({ mentions }: { mentions: any[] }) => {
  const { data } = await gqlClient.mutate({
    mutation: CREATE_MENTIONS,
    variables: { mentions },
  })
  return data
}

export const deletePost = async (postId: string) => {
  const { data } = await gqlClient.mutate({
    mutation: DELETE_POST,
    variables: { filter: { id: { eq: postId } } },
  })
  return data
}

export const fetchRecentPosts = async () => {
  const { data } = await gqlClient.query({
    query: FETCH_RECENT_POSTS,
  })

  const posts = data?.postsCollection?.edges.map(async (edge: any) => {
    const post = edge?.node
    const author = post.users
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
      mentionedUsers, // Array of mentioned user IDs
      likes,
    }
  })

  return Promise.all(posts)
}

const fetchUsersByIds = async (userIds: string[]) => {
  if (!userIds || userIds.length === 0) return []

  const { data } = await gqlClient.query({
    query: FETCH_USERS_BY_IDS,
    variables: { userIds },
  })

  return data?.usersCollection?.edges.map((edge: any) => edge.node) || []
}

export const fetchPostLikes = async (postId: string) => {
  const { data } = await gqlClient.query({
    query: FETCH_LIKES_FOR_POST,
    variables: { postId },
  })

  const likes =
    data?.postsCollection?.edges[0]?.node?.likesCollection?.edges?.map(
      (edge: any) => edge.node
    )

  const likeUserIds = likes.map((like: any) => like.user_id)

  return fetchUsersByIds(likeUserIds)
}

export const likePost = async ({ likeInput }: { likeInput: any }) => {
  const { data } = await gqlClient.mutate({
    mutation: LIKE_POST,
    variables: { likeInput },
  })
  return data
}

export const unlikePost = async ({ filter }: { filter: any }) => {
  const { data } = await gqlClient.mutate({
    mutation: UNLIKE_POST,
    variables: { filter },
  })
  return data
}
