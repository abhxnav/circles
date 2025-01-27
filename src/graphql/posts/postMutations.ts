import { gql } from '@apollo/client'

// Mutation to create a new post
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

// Mutation to add mentions for a post
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

// Mutation to delete a post based on a filter
export const DELETE_POST = gql`
  mutation DeletePost($filter: postsFilter!) {
    deleteFrompostsCollection(filter: $filter) {
      affectedCount
    }
  }
`

// Mutation to like a post
export const LIKE_POST = gql`
  mutation LikePost($likeInput: likesInsertInput!) {
    insertIntolikesCollection(objects: [$likeInput]) {
      records {
        id
        post_id
        user_id
      }
    }
  }
`

// Mutation to unlike a post
export const UNLIKE_POST = gql`
  mutation UnlikePost($filter: likesFilter!) {
    deleteFromlikesCollection(filter: $filter) {
      affectedCount
    }
  }
`
