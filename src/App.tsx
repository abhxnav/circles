import { Routes, Route } from 'react-router-dom'
import { Home } from '@/_root/pages'
import { SigninForm, SignupForm } from '@/_auth/forms'
import AuthLayout from '@/_auth/AuthLayout'
import RootLayout from '@/_root/RootLayout'
import '@/App.css'

const App = () => {
  return (
    <main className="flex min-h-screen bg-dark-primary relative font-sans">
      <Routes>
        {/* public routes */}
        <Route element={<AuthLayout />}>
          <Route path="/sign-in" element={<SigninForm />} />
          <Route path="/sign-up" element={<SignupForm />} />
        </Route>

        {/* private routes */}
        <Route element={<RootLayout />}>
          <Route index element={<Home />} />
        </Route>
      </Routes>
    </main>
  )
}

export default App
