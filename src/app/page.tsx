import { UserContextProvider } from '@/pages/auth-page/UserContext'
import HomePage from '@/pages/home-page'

export default function Home() {
  return (
    <UserContextProvider>
      <HomePage />
    </UserContextProvider>
  )
}
