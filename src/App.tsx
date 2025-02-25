import { Routes, Route } from 'react-router-dom'
import {
  AllUsers,
  CreatePost,
  EditPost,
  Explore,
  Home,
  PostDetails,
  Profile,
  Saved,
  UpdateProfile,
} from '@/_root/pages'
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
          <Route path="/explore" element={<Explore />} />
          <Route path="/saved" element={<Saved />} />
          <Route path="/all-users" element={<AllUsers />} />
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/update-post/:postId" element={<EditPost />} />
          <Route path="/posts/:postId" element={<PostDetails />} />
          <Route path="/profile/:userId/*" element={<Profile />} />
          <Route path="/update-profile/:userId" element={<UpdateProfile />} />
        </Route>
      </Routes>
    </main>
  )
}

export default App
