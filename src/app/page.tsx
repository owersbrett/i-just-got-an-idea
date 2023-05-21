import {  SessionContextProvider } from '@/pages/auth-page/SessionContext'
import { UserContextProvider } from '@/pages/auth-page/UserContext'
import HomePage from '@/pages/home-page'

export default function Home() {
  return (
    <UserContextProvider>
      <SessionContextProvider>
        <HomePage />

      </SessionContextProvider>
    </UserContextProvider>
  )
}
