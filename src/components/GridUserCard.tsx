import { FollowButton } from '@/components'

interface GridUserCardProps {
  user: User
}

const GridUserCard = ({ user }: GridUserCardProps) => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-dark-muted overflow-hidden cursor-pointer size-full bg-dark-secondary p-6">
      <img
        src={user.avatar_url || '/assets/images/avatar-placeholder.png'}
        alt={user.username}
        className="rounded-full size-10 object-cover"
      />

      <div className="flex flex-col items-center justify-center">
        <p className="text-light-primary whitespace-nowrap">
          @ {user.username}
        </p>
        <p className="text-light-muted whitespace-nowrap">{user.name}</p>
      </div>

      <FollowButton
        followeeId={user?.id}
        isFollowing={user?.isFollowing || false}
      />
    </div>
  )
}

export default GridUserCard
