import gqlClient from '@/graphql/client'
import { FETCH_RANDOM_USERS, SEARCH_USERS } from '@/graphql/users/userQueries'
import { supabase } from '@/lib/supabase/config'
import { shuffle } from 'lodash'

export const getAllUsers = async () => {
  try {
    const { data: users, error: fetchError } = await supabase
      .from('users')
      .select('*')

    if (fetchError) throw new Error(fetchError.message)
    return { success: true, message: 'Users fetched successfully', data: users }
  } catch (error: any) {
    return { success: false, message: error.message }
  }
}

export const searchUsers = async (searchTerm: string) => {
  const { data } = await gqlClient.query({
    query: SEARCH_USERS,
    variables: { searchTerm: `%${searchTerm}%` },
  })

  return data?.usersCollection?.edges?.map((edge: any) => edge.node) || []
}

export const fetchRandomUsers = async () => {
  const { data } = await gqlClient.query({
    query: FETCH_RANDOM_USERS,
  })

  const users = data?.usersCollection?.edges.map((edge: any) => edge.node) || []

  // Randomize users and return the first 10
  return shuffle(users).slice(0, 10)
}
