import { bottombarLinks } from '@/constants'
import { NavLink, useLocation } from 'react-router-dom'

const BottomBar = () => {
  const { pathname } = useLocation()

  return (
    <section className="z-50 flex items-center justify-around w-full sticky bottom-0 bg-dark-secondary py-2 md:hidden">
      {bottombarLinks.map((link: NavLink) => {
        const isActive = pathname === link.route

        return (
          <NavLink
            key={link.label}
            to={link.route}
            className={`rounded-full flex flex-col items-center gap-2 group p-1 transition`}
          >
            <img
              src={link.iconUrl}
              alt={link.label}
              className={`size-5 ${!isActive && 'filter-white'}`}
            />
          </NavLink>
        )
      })}
    </section>
  )
}

export default BottomBar
