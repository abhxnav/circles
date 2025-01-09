interface User {
  id: string
  name: string
  username: string
  email: string
  avatar_url: string
  createdAt: string
}

interface UserContextType {
  user: User
  isLoading: boolean
  isAuthenticated: boolean
  setUser: React.Dispatch<React.SetStateAction<User>>
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>
  checkAuthUser: () => Promise<boolean>
}

interface NavLink {
  iconUrl: string
  route: string
  label: string
}

interface Post {
  id: string
  author: User
  content: string
  image_url: string
  created_at: string
  mentionedUsers: User[]
  likes: User[]
}
