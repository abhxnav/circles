import { useState } from 'react'
import { Button } from './ui'

interface GridUserCardProps {
  user: User
}

const GridUserCard = ({ user }: GridUserCardProps) => {
  const [following, setFollowing] = useState(false)

  const handleFollow = () => {
    setFollowing(!following)
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-dark-muted overflow-hidden cursor-pointer size-full bg-dark-secondary p-6">
      <img
        src={user.avatar_url || '/assets/images/avatar-placeholder.png'}
        alt={user.username}
        className="rounded-full size-10 object-cover"
      />

      <div className="flex flex-col items-center justify-center">
        <p className="text-light-primary">@ {user.username}</p>
        <p className="text-light-muted">{user.name}</p>
      </div>

      <Button
        onClick={handleFollow}
        className={`${
          following
            ? 'bg-dark-muted/50 hover:bg-dark-muted/70'
            : 'bg-accent-coral hover:bg-accent-coral/90'
        } !border-none !outline-none flex items-center justify-center gap-1`}
      >
        <p
          className={`${
            following ? 'text-light-secondary' : 'text-dark-primary'
          } font-semibold`}
        >
          {following ? 'Following' : 'Follow'}
        </p>
        <img
          src={`/assets/icons/${following ? 'check' : 'plus'}.svg`}
          className="size-4"
        />
      </Button>
    </div>
  )
}

export default GridUserCard
