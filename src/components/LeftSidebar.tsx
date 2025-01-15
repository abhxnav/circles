import { Link, NavLink, useLocation } from 'react-router-dom'
import { Logo } from '@/components'
import { useUserContext } from '@/context/UserContext'
import { navLinks } from '@/constants'
import { useLogout } from '@/react-query/mutations'
import { useToast } from '@/hooks/use-toast'

const LeftSidebar = () => {
  const { user } = useUserContext()
  const { pathname } = useLocation()
  const { mutateAsync: logout } = useLogout()
  const { toast } = useToast()

  const handleLogout = async () => {
    try {
      const { success, message } = await logout()
      if (success) {
        toast({ description: message })
      }
    } catch (error) {
      console.error('Error logging out: ', error)
      toast({ variant: 'destructive', description: 'Failed to log out' })
    }
  }

  return (
    <nav className="hidden md:flex px-5 py-7 flex-col min-w-[270px] h-screen bg-dark-secondary sticky top-0">
      <Link to="/" className="w-fit flex items-center gap-2 pb-10 ml-2">
        <Logo type="icon" className="h-8" />
        <Logo type="text" className="h-6" />
      </Link>

      <div className="flex flex-col justify-between h-full">
        <ul className="flex flex-col gap-6">
          {navLinks.map((link: NavLink) => {
            const isActive = pathname === link.route

            return (
              <li
                key={link.label}
                className={`rounded-lg text-lg font-medium group hover:bg-accent-coral transition ${
                  isActive && 'bg-accent-coral'
                }`}
              >
                <NavLink
                  to={link.route}
                  className={`flex gap-4 items-center py-2 px-4 hover:text-dark-primary ${
                    isActive ? 'text-dark-primary' : 'text-light-primary'
                  }`}
                >
                  <img
                    src={link.iconUrl}
                    alt={link.label}
                    className={`size-5 group-hover:brightness-0 group-hover:transition ${
                      isActive && 'brightness-0 transition'
                    }`}
                  />
                  {link.label}
                </NavLink>
              </li>
            )
          })}
        </ul>

        <div className="flex items-center justify-between">
          <Link to={`/profile/${user?.id}`} className="flex items-center gap-3">
            <img
              src={user?.avatar_url || '/assets/images/avatar-placeholder.png'}
              alt={user?.username}
              className="size-10 rounded-full"
            />
            <div className="flex flex-col gap-1">
              <p className="font-bold text-light-primary leading-none">
                {user?.name}
              </p>
              <p className="text-xs text-light-muted leading-none">
                @{user?.username}
              </p>
            </div>
          </Link>
          <div className="cursor-pointer pr-4" onClick={handleLogout}>
            <img
              src="/assets/icons/logout.svg"
              alt="Logout"
              className="h-5 w-fit"
            />
          </div>
        </div>
      </div>
    </nav>
  )
}

export default LeftSidebar
