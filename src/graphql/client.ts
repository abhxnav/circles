import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { supabase } from '@/lib/supabase/config'
import { envConfig } from '@/lib/envConfig'

const {
  supabase: { supabaseGraphqlApiUrl, supabasePublicKey },
} = envConfig

const httpLink = new HttpLink({
  uri: supabaseGraphqlApiUrl,
})

const authLink = setContext(async (_, { headers }) => {
  const {
    data: { session },
  } = await supabase.auth.getSession()

  return {
    headers: {
      ...headers,
      apikey: supabasePublicKey,
      Authorization: session ? `Bearer ${session.access_token}` : '',
    },
  }
})

const gqlClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
})

export default gqlClient
