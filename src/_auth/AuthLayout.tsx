import { Navigate, Outlet } from 'react-router-dom'
import Lottie, { LottieRefCurrentProps } from 'lottie-react'
import AuthAnimation from '@/animations/social-media-graphics.json'
import { useRef } from 'react'
import { useUserContext } from '@/context/UserContext'

const AuthLayout = () => {
  const animationRef = useRef<LottieRefCurrentProps | null>(null) // Ref for Lottie animation control
  const { isAuthenticated } = useUserContext() // Access user authentication state

  return (
    <>
      {isAuthenticated ? ( // Redirect authenticated users to the home page
        <Navigate to="/" />
      ) : (
        <>
          {/* Main content section for authentication forms */}
          <section className="flex flex-1 flex-col items-center justify-center py-10 w-1/2">
            <Outlet />
          </section>

          {/* Animation section displayed on larger screens */}
          <div className="hidden xl:flex items-center justify-center h-screen w-1/2 object-cover bg-no-repeat p-48 sticky top-0">
            <Lottie
              lottieRef={animationRef}
              animationData={AuthAnimation}
              loop={false} // Play animation only once
              onComplete={
                () => animationRef.current?.goToAndPlay(174, true) // Loop a section of the animation after completion
              }
            />
          </div>
        </>
      )}
    </>
  )
}

export default AuthLayout
