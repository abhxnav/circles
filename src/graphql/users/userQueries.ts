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
