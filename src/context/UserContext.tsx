import { addUserToDatabase, getCurrentUser } from '@/actions/auth.actions'
import { supabase } from '@/lib/supabase/config'
import { getLocalStorageKey } from '@/lib/utils'
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react'
import { useNavigate } from 'react-router-dom'

// Initial state for the user object
export const INITIAL_USER = {
  id: '',
  name: '',
  username: '',
  email: '',
  avatar_url: '',
  createdAt: '',
}

// Default context state
const INITIAL_STATE = {
  user: INITIAL_USER, // Initial user object
  isLoading: false, // Indicates if the user data is being loaded
  isAuthenticated: false, // Authentication status
  setUser: () => {}, // Placeholder function for setting the user state
  setIsAuthenticated: () => {}, // Placeholder function for setting authentication status
  checkAuthUser: async () => false as boolean, // Placeholder async function for checking authentication
}

// Create a React context with the initial state
const UserContext = createContext<UserContextType>(INITIAL_STATE)

// UserProvider component to wrap the app and provide context values
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate() // Hook to handle navigation

  const localStorageKey = getLocalStorageKey() // Key used for identifying localStorage items

  // State variables for user, loading status, and authentication status
  const [user, setUser] = useState<User>(INITIAL_USER)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)

  // Function to check if the user is authenticated and update state accordingly
  const checkAuthUser = async () => {
    setIsLoading(true) // Start loading
    try {
      const { currentUser, success } = await getCurrentUser() // Fetch the current user details
      if (success) {
        setUser(currentUser) // Update user state with the fetched data
        setIsAuthenticated(true) // Set authentication status to true
      } else {
        setIsAuthenticated(false) // Set authentication status to false if unsuccessful
      }
      return success // Return the result of the authentication check
    } catch (error) {
      console.error('Error checking auth user: ', error) // Log errors for debugging
      setIsAuthenticated(false) // Set authentication status to false on error
      return false
    } finally {
      setIsLoading(false) // Stop loading
    }
  }

  // Effect: Handle Supabase authentication state changes (e.g., login, logout, refresh)
  useEffect(() => {
    // Subscribe to Supabase authentication state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        // Avoid re-adding the user to the database if already added
        if (localStorage.getItem(localStorageKey)) return
        try {
          // Add the signed-in user to the database if necessary
          const { success, message } = await addUserToDatabase()
          if (!success) {
            console.error('Error adding user to database:', message)
            throw new Error(message)
          }
        } catch (error) {
          console.error('Error during SIGNED_IN event:', error)
        }
        checkAuthUser() // When a user signs in, fetch and update the user data in context
      }

      if (event === 'SIGNED_OUT') {
        // Reset the user state and redirect to sign-in on logout
        setUser(INITIAL_USER)
        setIsAuthenticated(false)
        navigate('/sign-in') // Redirect the user to the sign-in page
      }
    })

    return () => subscription.unsubscribe() // Cleanup the subscription on component unmount
  }, [])

  // Effect: Run an initial check for user authentication when the provider mounts
  useEffect(() => {
    const checkAndNavigate = async () => {
      const authSuccess = await checkAuthUser() // Check if the user is authenticated

      if (!authSuccess) {
        navigate('/sign-in') // Redirect to sign-in if the user is not authenticated
      }
    }

    checkAndNavigate()
  }, [])

  // Context value to be provided to consumers
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

// Export the default UserProvider component
export default UserProvider

// Custom hook for consuming the UserContext
export const useUserContext = () => useContext(UserContext)
