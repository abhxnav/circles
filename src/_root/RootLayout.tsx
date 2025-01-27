import { BottomBar, LeftSidebar, TopBar } from '@/components'
import { Outlet } from 'react-router-dom'

const RootLayout = () => {
  return (
    <div className="w-full md:flex">
      {/* Top navigation bar */}
      <TopBar />
      {/* Sidebar for navigation links */}
      <LeftSidebar />

      {/* Main content area */}
      <section className="flex flex-1">
        <Outlet />
      </section>

      {/* Bottom navigation bar for smaller screens */}
      <BottomBar />
    </div>
  )
}

export default RootLayout
