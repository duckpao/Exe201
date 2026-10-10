import { createContext, useContext, useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import { useAuth } from './AuthContext.jsx'

const apiUrl = import.meta.env.VITE_API_URL || 'https://rentmate-qd9h.onrender.com'

const SocketContext = createContext(null)

export function SocketProvider({ children }) {
  const { user } = useAuth()
  const [socket, setSocket] = useState(null)

  useEffect(() => {
    if (!user) {
      setSocket(null)
      return
    }

    const instance = io(apiUrl, { withCredentials: true })
    setSocket(instance)

    return () => {
      instance.disconnect()
      setSocket(null)
    }
  }, [user])

  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
}

export function useSocket() {
  return useContext(SocketContext)
}
