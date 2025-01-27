import { gql } from '@apollo/client'

// Mutation to follow a user
export const FOLLOW_USER = gql`
  mutation FollowUser($followerId: UUID!, $followeeId: UUID!) {
    insertIntofollowsCollection(
      objects: { follower_id: $followerId, followee_id: $followeeId }
    ) {
      affectedCount
    }
  }
`

// Mutation to unfollow a user
export const UNFOLLOW_USER = gql`
  mutation UnfollowUser($followerId: UUID!, $followeeId: UUID!) {
    deleteFromfollowsCollection(
      filter: {
        follower_id: { eq: $followerId }
        followee_id: { eq: $followeeId }
      }
    ) {
      affectedCount
    }
  }
`

// Query to check if the current user is following another user
export const IS_FOLLOWING = gql`
  query IsFollowing($followerId: UUID!, $followeeId: UUID!) {
    followsCollection(
      filter: {
        follower_id: { eq: $followerId }
        followee_id: { eq: $followeeId }
      }
    ) {
      edges {
        node {
          id
        }
      }
    }
  }
`
