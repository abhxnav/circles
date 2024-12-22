import { addUserToDatabase, getCurrentUser } from '@/actions/auth.actions'
import { supabase } from '@/lib/supabase/config'
import { getLocalStorageKey } from '@/lib/utils'
import {
  createContext,
  Dispatch,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react'
import { useNavigate } from 'react-router-dom'

interface User {
  id: string
  name: string
  username: string
  email: string
  avatar_url: string
  createdAt: string
}

interface ContextType {
  user: User
  isLoading: boolean
  isAuthenticated: boolean
  setUser: Dispatch<React.SetStateAction<User>>
  setIsAuthenticated: Dispatch<React.SetStateAction<boolean>>
  checkAuthUser: () => Promise<boolean>
}

export const INITIAL_USER = {
  id: '',
  name: '',
  username: '',
  email: '',
  avatar_url: '',
  createdAt: '',
}

const INITIAL_STATE = {
  user: INITIAL_USER,
  isLoading: false,
  isAuthenticated: false,
  setUser: () => {},
  setIsAuthenticated: () => {},
  checkAuthUser: async () => false as boolean,
}

const UserContext = createContext<ContextType>(INITIAL_STATE)

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate()

  const localStorageKey = getLocalStorageKey()

  const [user, setUser] = useState<User>(INITIAL_USER)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)

  const checkAuthUser = async () => {
    setIsLoading(true)

    try {
      const { currentUser, success } = await getCurrentUser()
      if (success) {
        setUser(currentUser)
        setIsAuthenticated(true)
      } else {
        setIsAuthenticated(false)
      }
      return success
    } catch (error) {
      console.error('Error checking auth user: ', error)
      setIsAuthenticated(false)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  // Listener to handle changes in Supabase authentication state (e.g., login, logout, session refresh)
  useEffect(() => {
    // Subscribe to Supabase authentication state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        if (localStorage.getItem(localStorageKey)) return
        try {
          // Run addUserToDatabase to ensure the user is added
          const { success, message } = await addUserToDatabase()
          if (!success) {
            console.error('Error adding user to database:', message)
            throw new Error(message)
          }
        } catch (error) {
          console.error('Error during SIGNED_IN event:', error)
        }

        checkAuthUser() // If a user signs in, fetch and update the user data in context
      }

      if (event === 'SIGNED_OUT') {
        setUser(INITIAL_USER) // If a user signs out, reset the user state to the initial state
        setIsAuthenticated(false) // Update authentication status to false
        navigate('/sign-in') // Redirect the user to the sign-in page
      }
    })

    return () => subscription.unsubscribe() // Cleanup the subscription when the component unmounts
  }, [])

  // Run an initial check for user authentication when the provider mounts
  useEffect(() => {
    if (
      localStorage.getItem(localStorageKey) === '[]' ||
      localStorage.getItem(localStorageKey) === null
    ) {
      navigate('/sign-in')
    } else {
      navigate('/')
    }

    checkAuthUser() // Check if the user is already authenticated (e.g., on app load)
  }, [])

  const value = {
    user,
    setUser,
    isLoading,
    isAuthenticated,
    setIsAuthenticated,
    checkAuthUser,
  }

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

export default UserProvider

export const useUserContext = () => useContext(UserContext)
