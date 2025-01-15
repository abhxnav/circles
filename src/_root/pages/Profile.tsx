import { UserStat } from '@/components'
import { Button } from '@/components/ui'
import { useState } from 'react'

const user = {
  photo: '/assets/images/avatar-placeholder.png',
  name: 'John Doe',
  username: 'johndoe',
  followers: 1200,
  following: 300,
  posts: 45,
}

const Profile = () => {
  const [following, setFollowing] = useState(false)

  const handleFollow = () => {
    setFollowing(!following)
  }

  return (
    <div className="flex flex-col gap-10 flex-1 items-center overflow-scroll py-4 px-4 md:py-8 md:px-8 lg:p-14 scrollbar-styled min-h-[calc(100vh-108px)]">
      <div className="max-w-screen-md flex flex-col w-full gap-2 md:gap-4">
        <div className="flex items-center justify-between">
          <img
            src={user.photo}
            alt={`${user.name}'s profile`}
            className="rounded-full size-20 md:size-36 object-cover border-4 border-dark-muted"
          />

          <div className="w-3/4 flex">
            <UserStat value={user.posts} label="Posts" />
            <UserStat value={user.followers} label="Followers" />
            <UserStat value={user.following} label="Following" />
          </div>
        </div>

        <div>
          <h1 className="text-light-primary text-xl md:text-3xl font-bold">
            {user.name}
          </h1>
          <p className="text-light-muted text-sm md:text-base">
            @ {user.username}
          </p>
        </div>

        <Button
          onClick={handleFollow}
          className={`${
            following
              ? 'bg-dark-muted/50 hover:bg-dark-muted/70'
              : 'bg-accent-coral hover:bg-accent-coral/90'
          } !border-none !outline-none flex items-center justify-center py-2 px-6 gap-1 transition mt-4 md:mt-6`}
        >
          <p
            className={`${
              following ? 'text-light-secondary' : 'text-dark-primary'
            } font-semibold text-sm md:text-base`}
          >
            {following ? 'Following' : 'Follow'}
          </p>
          <img
            src={`/assets/icons/${following ? 'check' : 'plus'}.svg`}
            className="size-4"
          />
        </Button>
      </div>

      <div className="w-full h-px bg-dark-muted" />

      <div className="text-light-secondary">Grid</div>
    </div>
  )
}

export default Profile
