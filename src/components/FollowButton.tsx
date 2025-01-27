import { useUserContext } from '@/context/UserContext'
import { useFollowUser, useUnfollowUser } from '@/react-query/mutations'
import { Button } from '@/components/ui'
import { Loader2 } from 'lucide-react'
import { useState } from 'react'

interface FollowButtonProps {
  followeeId: string // ID of the user to be followed/unfollowed
  isFollowing: boolean // Initial state indicating if the current user is following the followee
}

const FollowButton = ({
  followeeId,
  isFollowing: initialIsFollowing,
}: FollowButtonProps) => {
  const { user } = useUserContext() // Get the current user context
  const followerId = user?.id // Current user's ID

  const [isFollowing, setIsFollowing] = useState(initialIsFollowing) // Local state for follow status

  const { mutateAsync: followUser, isPending: isFollowLoading } =
    useFollowUser() // Mutation for following a user
  const { mutateAsync: unFollowUser, isPending: isUnfollowLoading } =
    useUnfollowUser() // Mutation for unfollowing a user

  // Handle follow action
  const handleFollow = async () => {
    setIsFollowing(true)
    try {
      await followUser({
        followerId,
        followeeId,
      })
    } catch (error) {
      setIsFollowing(false) // Revert state on error
    }
  }

  // Handle unfollow action
  const handleUnfollow = async () => {
    setIsFollowing(false)
    try {
      await unFollowUser({
        followerId,
        followeeId,
      })
    } catch (error) {
      setIsFollowing(true) // Revert state on error
    }
  }

  return isFollowLoading || isUnfollowLoading ? (
    // Show loading state while mutation is in progress
    <Button className="bg-dark-muted/50 !border-none !outline-none flex items-center justify-center gap-1">
      <p className="text-light-secondary font-semibold">
        {isFollowing ? 'Following...' : 'Unfollowing...'}
      </p>
      <Loader2 size={20} className="animate-spin" />
    </Button>
  ) : (
    // Render the follow/unfollow button
    <Button
      onClick={isFollowing ? handleUnfollow : handleFollow}
      className={`${
        isFollowing
          ? 'bg-dark-muted/50 hover:bg-dark-muted/70'
          : 'bg-accent-coral hover:bg-accent-coral/90'
      } !border-none !outline-none flex items-center justify-center gap-1`}
    >
      <p
        className={`${
          isFollowing ? 'text-light-secondary' : 'text-dark-primary'
        } font-semibold`}
      >
        {isFollowing ? 'Following' : 'Follow'}
      </p>
      <img
        src={`/assets/icons/${isFollowing ? 'check' : 'plus'}.svg`}
        className="size-4"
      />
    </Button>
  )
}

export default FollowButton
