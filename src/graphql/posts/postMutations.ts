import { gql } from '@apollo/client'

export const CREATE_POST = gql`
  mutation CreatePost($postInput: postsInsertInput!) {
    insertIntopostsCollection(objects: [$postInput]) {
      records {
        id
        content
        image_url
        author_id
      }
    }
  }
`

export const CREATE_MENTIONS = gql`
  mutation CreateMentions($mentions: [mentionsInsertInput!]!) {
    insertIntomentionsCollection(objects: $mentions) {
      records {
        mentioned_users_id
        post_id
      }
    }
  }
`

export const DELETE_POST = gql`
  mutation DeletePost($filter: postsFilter!) {
    deleteFrompostsCollection(filter: $filter) {
      affectedCount
    }
  }
`
