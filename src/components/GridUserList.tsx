import { GridUserCard } from '@/components'

interface GridUserListProps {
  users: User[] // Array of user objects to display in the grid
}

const GridUserList = ({ users }: GridUserListProps) => {
  return (
    <div className="w-full grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 max-w-5xl">
      {/* Iterate through the user array and render a GridUserCard for each */}
      {users?.map((user: User) => (
        <GridUserCard user={user} key={user.id} />
      ))}
    </div>
  )
}

export default GridUserList
