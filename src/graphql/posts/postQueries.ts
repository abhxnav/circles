import { gql } from '@apollo/client'

// Fetch recent posts with pagination, including details like content, image, author info, and mentions
export const FETCH_RECENT_POSTS = gql`
  query FetchRecentPosts($cursor: String, $limit: Int!) {
    postsCollection(
      orderBy: [{ created_at: DescNullsLast }]
      first: $limit
      after: $cursor
    ) {
      edges {
        node {
          id
          content
          image_url
          author_id
          created_at
          users {
            id
            username
            name
            avatar_url
          }
          mentionsCollection {
            edges {
              node {
                mentioned_users_id
              }
            }
          }
        }
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
`

// Fetch user details for a list of user IDs
export const FETCH_USERS_BY_IDS = gql`
  query FetchUsersByIds($userIds: [UUID!]!) {
    usersCollection(filter: { id: { in: $userIds } }) {
      edges {
        node {
          id
          name
          username
          avatar_url
        }
      }
    }
  }
`

// Fetch all likes for a specific post
export const FETCH_LIKES_FOR_POST = gql`
  query FetchLikesForPost($postId: UUID!) {
    postsCollection(filter: { id: { eq: $postId } }) {
      edges {
        node {
          id
          content
          likesCollection {
            edges {
              node {
                id
                user_id
                post_id
              }
            }
            pageInfo {
              hasNextPage
              hasPreviousPage
            }
          }
        }
      }
    }
  }
`

// Fetch popular posts within a specific time period
export const FETCH_POPULAR_POSTS = gql`
  query FetchPopularPosts($date: Date!, $cursor: String, $limit: Int!) {
    postsCollection(
      filter: { created_at: { gte: $date } }
      after: $cursor
      first: $limit
    ) {
      edges {
        node {
          id
          content
          image_url
          author_id
          created_at
          users {
            id
            username
            name
            avatar_url
          }
          mentionsCollection {
            edges {
              node {
                mentioned_users_id
              }
            }
          }
        }
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
`

// Search posts based on content with pagination
export const SEARCH_POSTS = gql`
  query SearchPosts($searchTerm: String!, $cursor: String, $limit: Int!) {
    postsCollection(
      filter: { content: { ilike: $searchTerm } }
      after: $cursor
      first: $limit
    ) {
      edges {
        node {
          id
          content
          image_url
          author_id
          created_at
          users {
            id
            username
            name
            avatar_url
          }
          mentionsCollection {
            edges {
              node {
                mentioned_users_id
              }
            }
          }
        }
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
`

// Fetch all posts by a specific user with pagination
export const FETCH_USER_POSTS = gql`
  query FetchUserPosts($authorId: UUID!, $cursor: String, $limit: Int!) {
    postsCollection(
      filter: { author_id: { eq: $authorId } }
      orderBy: [{ created_at: DescNullsLast }]
      after: $cursor
      first: $limit
    ) {
      edges {
        node {
          id
          content
          image_url
          author_id
          created_at
          users {
            id
            username
            name
            avatar_url
          }
          mentionsCollection {
            edges {
              node {
                mentioned_users_id
              }
            }
          }
        }
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
`
