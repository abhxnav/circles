import { GridUserCard } from '@/components'

interface GridUserListProps {
  users: User[]
}

const GridUserList = ({ users }: GridUserListProps) => {
  return (
    <div className="w-full grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 max-w-5xl">
      {users?.map((user: User) => (
        <GridUserCard user={user} key={user.id} />
      ))}
    </div>
  )
}

export default GridUserList
