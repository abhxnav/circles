import { Link } from 'react-router-dom'
import { Logo } from '@/components'
import { useToast } from '@/hooks/use-toast'
import { useLogout } from '@/react-query/mutations'
import { useUserContext } from '@/context/UserContext'

const TopBar = () => {
  const { toast } = useToast() // Toast notifications for feedback
  const { mutateAsync: logout } = useLogout() // Mutation for logging out
  const { user } = useUserContext() // Get the logged-in user's data

  // Handle logout action
  const handleLogout = async () => {
    try {
      const { success, message } = await logout()
      if (success) {
        toast({ description: message }) // Show success message
      }
    } catch (error) {
      console.error('Error logging out: ', error)
      toast({ variant: 'destructive', description: 'Failed to log out' }) // Show error message
    }
  }

  return (
    <section className="sticky top-0 z-50 md:hidden bg-transparent w-full">
      <div className="flex items-center justify-between py-4 px-5 bg-dark-primary">
        {/* App logo */}
        <Link to="/" className="flex gap-3 items-center">
          <div className="flex items-center gap-1">
            <Logo type="icon" className="h-5" />
            <Logo type="text" className="h-4" />
          </div>
        </Link>

        {/* Logout and user profile */}
        <div className="flex gap-4 items-center">
          <div className="cursor-pointer" onClick={handleLogout}>
            <img
              src="/assets/icons/logout.svg"
              alt="Logout"
              className="h-5 w-fit"
            />
          </div>
          <Link to={`/profile/${user?.id}`} className="flex-center gap-3">
            <img
              src={user?.avatar_url || '/assets/images/avatar-placeholder.png'}
              alt={user?.username}
              className="size-8 rounded-full"
            />
          </Link>
        </div>
      </div>
    </section>
  )
}

export default TopBar
