import { Navigate, Outlet } from 'react-router-dom'
import Lottie, { LottieRefCurrentProps } from 'lottie-react'
import AuthAnimation from '@/assets/animations/social-media-graphics.json'
import { useRef } from 'react'

const AuthLayout = () => {
  const animationRef = useRef<LottieRefCurrentProps | null>(null)
  const isAuthenticated = false

  return (
    <>
      {isAuthenticated ? (
        <Navigate to="/" />
      ) : (
        <>
          <section className="flex flex-1 flex-col items-center justify-center py-10 w-1/2">
            <Outlet />
          </section>

          <div className="hidden xl:flex items-center justify-center h-screen w-1/2 object-cover bg-no-repeat p-48 sticky top-0">
            <Lottie
              lottieRef={animationRef}
              animationData={AuthAnimation}
              loop={false}
              onComplete={() => animationRef.current?.goToAndPlay(174, true)}
            />
          </div>
        </>
      )}
    </>
  )
}

export default AuthLayout
