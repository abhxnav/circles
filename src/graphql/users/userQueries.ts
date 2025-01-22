import { gql } from '@apollo/client'

export const FETCH_RANDOM_USERS = gql`
  query FetchRandomUsers($userId: UUID!) {
    usersCollection(filter: { id: { neq: $userId } }, first: 50) {
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
    }
  }
`

export const SEARCH_USERS = gql`
  query SearchUsers($searchTerm: String!) {
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
    ) {
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
