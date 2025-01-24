import { gql } from '@apollo/client'

export const FETCH_RANDOM_USERS = gql`
  query FetchRandomUsers($userId: UUID!, $cursor: String, $limit: Int!) {
    usersCollection(
      filter: { id: { neq: $userId } }
      after: $cursor
      first: $limit
    ) {
      edges {
        node {
          id
          username
          name
          avatar_url
          is_following: followsCollection(
            filter: { follower_id: { eq: $userId } }
          ) {
            edges {
              node {
                id
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

export const SEARCH_USERS = gql`
  query SearchUsers($searchTerm: String!, $cursor: String, $limit: Int!) {
    usersCollection(
      filter: {
        and: [
          {
            or: [
              { username: { ilike: $searchTerm } }
              { name: { ilike: $searchTerm } }
            ]
          }
          { id: { neq: $userId } }
        ]
      }
      orderBy: [{ username: AscNullsLast }]
      after: $cursor
      first: $limit
    ) {
      edges {
        node {
          id
          name
          username
          avatar_url
        }
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
`

export const FETCH_USER_DETAILS = gql`
  query FetchUserDetails($userId: UUID!) {
    usersCollection(filter: { id: { eq: $userId } }) {
      edges {
        node {
          id
          name
          username
          avatar_url
        }
      }
    }
    postsCollection(filter: { author_id: { eq: $userId } }, first: 100) {
      edges {
        node {
          id
        }
      }
    }
    followers: followsCollection(filter: { followee_id: { eq: $userId } }) {
      edges {
        node {
          follower_id
        }
      }
    }
    following: followsCollection(filter: { follower_id: { eq: $userId } }) {
      edges {
        node {
          followee_id
        }
      }
    }
  }
`

export const FETCH_POSTS_COUNT = gql`
  query FetchPostsCount($authorId: UUID!, $cursor: String) {
    postsCollection(filter: { author_id: { eq: $authorId } }, after: $cursor) {
      edges {
        node {
          id
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`
