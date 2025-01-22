import { useUserContext } from '@/context/UserContext'
import { useFollowUser, useUnfollowUser } from '@/react-query/mutations'
import { Button } from '@/components/ui'
import { Loader2 } from 'lucide-react'
import { useState } from 'react'

interface FollowButtonProps {
  followeeId: string
  isFollowing: boolean
}

const FollowButton = ({
  followeeId,
  isFollowing: initialIsFollowing,
}: FollowButtonProps) => {
  const { user } = useUserContext()
  const followerId = user?.id

  const [isFollowing, setIsFollowing] = useState(initialIsFollowing)

  const { mutateAsync: followUser, isPending: isFollowLoading } =
    useFollowUser()
  const { mutateAsync: unFollowUser, isPending: isUnfollowLoading } =
    useUnfollowUser()

  const handleFollow = async () => {
    setIsFollowing(true)
    try {
      await followUser({
        followerId,
        followeeId,
      })
    } catch (error) {
      setIsFollowing(false)
    }
  }

  const handleUnfollow = async () => {
    setIsFollowing(false)
    try {
      await unFollowUser({
        followerId,
        followeeId,
      })
    } catch (error) {
      setIsFollowing(true)
    }
  }

  return isFollowLoading || isUnfollowLoading ? (
    <Button className="bg-dark-muted/50 !border-none !outline-none flex items-center justify-center gap-1">
      <p className="text-light-secondary font-semibold">
        {isFollowing ? 'Following...' : 'Unfollowing...'}
      </p>
      <Loader2 size={20} className="animate-spin" />
    </Button>
  ) : (
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
