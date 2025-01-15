import { gql } from '@apollo/client'

export const FETCH_RANDOM_USERS = gql`
  query FetchRandomUsers($offset: Int!) {
    usersCollection(first: 50) {
      edges {
        node {
          id
          username
          name
          avatar_url
        }
      }
    }
  }
`

export const SEARCH_USERS = gql`
  query SearchUsers($searchTerm: String!) {
    usersCollection(
      filter: {
        or: [
          { username: { ilike: $searchTerm } }
          { name: { ilike: $searchTerm } }
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
