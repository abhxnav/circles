import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@/index.css'
import App from '@/App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from '@/components/ui'
import UserProvider from '@/context/UserContext'
import QueryProvider from '@/react-query/QueryProvider'
import { ApolloProvider } from '@apollo/client'
import client from '@/graphql/client'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <QueryProvider>
        <UserProvider>
          <ApolloProvider client={client}>
            <App />
          </ApolloProvider>
          <Toaster />
        </UserProvider>
      </QueryProvider>
    </BrowserRouter>
  </StrictMode>
)
