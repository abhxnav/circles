import { navLinks } from '@/constants'
import { NavLink, useLocation } from 'react-router-dom'

const BottomBar = () => {
  const { pathname } = useLocation() // Get the current route for highlighting active links

  return (
    <section className="z-50 flex items-center justify-around w-full sticky bottom-0 bg-dark-secondary py-2 md:hidden">
      {/* Iterate through the navigation links and render them */}
      {navLinks.map((link: NavLink) => {
        const isActive = pathname === link.route // Check if the link is active

        return (
          <NavLink
            key={link.label}
            to={link.route}
            className={`rounded-full flex flex-col items-center gap-2 group p-1 transition`}
          >
            {/* Icon for each navigation link */}
            <img
              src={link.iconUrl}
              alt={link.label}
              className={`size-5 ${!isActive && 'filter-white'}`} // Apply a different style for inactive links
            />
          </NavLink>
        )
      })}
    </section>
  )
}

export default BottomBar
