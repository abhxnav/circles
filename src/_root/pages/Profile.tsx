import {
  FollowButton,
  GridPostList,
  SearchPostsSkeleton,
  UserStat,
} from '@/components'
import { useFetchUserDetails, useFetchUserPosts } from '@/react-query/queries'
import { useState } from 'react'
import { useParams } from 'react-router-dom'

const Profile = () => {
  const { userId } = useParams<{ userId: string }>()

  const { data: user } = useFetchUserDetails(userId!)
  const { data: posts, isLoading: isPostsLoading } = useFetchUserPosts(userId!)

  const [following, setFollowing] = useState(false)

  return (
    <div className="flex flex-col gap-10 flex-1 items-center overflow-scroll py-4 px-4 md:py-8 md:px-8 lg:p-14 scrollbar-styled min-h-[calc(100vh-108px)]">
      <div className="max-w-screen-md flex flex-col w-full gap-2 md:gap-4">
        <div className="flex items-center justify-between">
          <img
            src={user?.avatar_url || '/assets/images/avatar-placeholder.png'}
            alt={`${user?.name}'s profile`}
            className="rounded-full size-20 md:size-36 object-cover border-4 border-dark-muted"
          />

          <div className="w-3/4 flex">
            <UserStat value={user?.postsCount} label="Posts" />
            <UserStat value={user?.followersCount} label="Followers" />
            <UserStat value={user?.followingCount} label="Following" />
          </div>
        </div>

        <div>
          <h1 className="text-light-primary text-xl md:text-3xl font-bold">
            {user?.name}
          </h1>
          <p className="text-light-muted text-sm md:text-base">
            @ {user?.username}
          </p>
        </div>

        {userId !== user?.id && (
          <FollowButton followeeId={userId!} isFollowing={user?.isFollowing} />
        )}

        <div className="w-full h-px bg-dark-muted my-3" />

        <div className="flex flex-wrap gap-9 w-full max-w-5xl">
          {isPostsLoading ? (
            <SearchPostsSkeleton />
          ) : posts?.length! > 0 ? (
            <GridPostList posts={posts!} />
          ) : (
            <p className="text-light-muted text-center text-sm w-full">
              No posts yet
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default Profile
