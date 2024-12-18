import { addUserToDatabase } from '@/actions/auth.actions'
import { supabase } from '@/lib/supabase/config'
import { useEffect } from 'react'

const useAuthListener = () => {
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        try {
          // Run addUserToDatabase to insert user into database if not already present
          const { success, message } = await addUserToDatabase()
          if (!success) {
            console.error(message)
            throw new Error(message)
          }
        } catch (error) {
          console.error('Error in auth listener: ', error)
        }
      }
    })

    return () => subscription.unsubscribe()
  }, [])
}

export default useAuthListener
