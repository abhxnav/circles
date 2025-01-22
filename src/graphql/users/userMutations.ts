import { gql } from '@apollo/client'

export const FOLLOW_USER = gql`
  mutation FollowUser($followerId: UUID!, $followeeId: UUID!) {
    insertIntofollowsCollection(
      objects: { follower_id: $followerId, followee_id: $followeeId }
    ) {
      affectedCount
    }
  }
`

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
