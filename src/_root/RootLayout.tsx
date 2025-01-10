import { BottomBar, LeftSidebar, TopBar } from '@/components'
import { Outlet } from 'react-router-dom'

const RootLayout = () => {
  return (
    <div className="w-full md:flex">
      <TopBar />
      <LeftSidebar />

      <section className="flex flex-1">
        <Outlet />
      </section>

      <BottomBar />
    </div>
  )
}

export default RootLayout
