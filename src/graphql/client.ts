import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { supabase } from '@/lib/supabase/config'
import { envConfig } from '@/lib/envConfig'

// Extract configuration for Supabase GraphQL API
const {
  supabase: { supabaseGraphqlApiUrl, supabasePublicKey },
} = envConfig

// Define HTTP link for Apollo client
const httpLink = new HttpLink({
  uri: supabaseGraphqlApiUrl, // GraphQL endpoint URL
})

// Add authentication context to each request
const authLink = setContext(async (_, { headers }) => {
  const {
    data: { session }, // Fetch the current session from Supabase
  } = await supabase.auth.getSession()

  return {
    headers: {
      ...headers, // Preserve existing headers
      apikey: supabasePublicKey, // Supabase public key
      Authorization: session ? `Bearer ${session.access_token}` : '', // Add Bearer token if session exists
    },
  }
})

// Create an Apollo Client instance
const gqlClient = new ApolloClient({
  link: authLink.concat(httpLink), // Combine authLink with HTTP link
  cache: new InMemoryCache(), // Enable caching for queries
})

export default gqlClient
