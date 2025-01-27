import { FollowButton } from '@/components'
import { useNavigate } from 'react-router-dom'

interface GridUserCardProps {
  user: User // User data including ID, name, and avatar
}

const GridUserCard = ({ user }: GridUserCardProps) => {
  const navigate = useNavigate()

  const handleCardClick = () => {
    navigate(`/profile/${user.id}`) // Navigate to the user's profile
  }
  return (
    <div
      onClick={handleCardClick} // Handle navigation for the entire card
      className="rounded-xl border border-dark-muted overflow-hidden cursor-pointer size-full bg-dark-secondary p-6"
    >
      <div className="flex flex-col items-center justify-center gap-4">
        {/* User avatar */}
        <img
          src={user.avatar_url || '/assets/images/avatar-placeholder.png'}
          alt={user.username}
          className="rounded-full size-10 object-cover"
        />

        {/* User name and username */}
        <div className="flex flex-col items-center justify-center">
          <p className="text-light-primary whitespace-nowrap">
            @ {user.username}
          </p>
          <p className="text-light-muted whitespace-nowrap">{user.name}</p>
        </div>

        {/* Follow button */}
        <div
          onClick={(e) => {
            e.stopPropagation() // Prevent card click when FollowButton is clicked
            e.preventDefault() // Prevent default action from triggering
          }}
        >
          <FollowButton
            followeeId={user?.id}
            isFollowing={user?.isFollowing || false}
          />
        </div>
      </div>
    </div>
  )
}

export default GridUserCard
