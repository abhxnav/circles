import { gql } from '@apollo/client'

export const GET_ALL_POSTS = gql`
  query GetAllPosts {
    postsCollection {
      edges {
        node {
          id
          content
          image_url
          mentions {
            id
            username
            avatar_url
          }
        }
      }
    }
  }
`
