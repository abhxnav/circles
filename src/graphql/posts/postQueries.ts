import { gql } from '@apollo/client'

export const FETCH_RECENT_POSTS = gql`
  query FetchRecentPosts {
    postsCollection(orderBy: [{ created_at: DescNullsLast }], first: 20) {
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
        hasNextPage
        hasPreviousPage
      }
    }
  }
`

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

export const FETCH_POPULAR_POSTS = gql`
  query FetchPopularPosts($date: Date!, $orderBy: [postsOrderBy!]) {
    postsCollection(filter: { created_at: { gte: $date } }, first: 20) {
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
        hasNextPage
        hasPreviousPage
      }
    }
  }
`

export const SEARCH_POSTS = gql`
  query SearchPosts($searchTerm: String!) {
    postsCollection(filter: { content: { ilike: $searchTerm } }) {
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
    }
  }
`
