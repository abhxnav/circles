import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactNode } from 'react'

// Initialize a new Query Client for React Query
const queryClient = new QueryClient()

// React Query provider for the app
const QueryProvider = ({ children }: { children: ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children} {/* Provide the Query Client to the children */}
    </QueryClientProvider>
  )
}

export default QueryProvider
