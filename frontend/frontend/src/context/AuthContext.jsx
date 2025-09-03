// PERBAIKAN - Buat file hooks/useAuth.js
import { useState, useEffect, createContext, useContext } from 'react'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = () => {
      try {
        const savedUser = localStorage.getItem('ri7_user')
        const savedToken = localStorage.getItem('ri7_token')
        
        if (savedUser && savedToken) {
          setUser(JSON.parse(savedUser))
        }
      } catch (error) {
        console.error('Auth check error:', error)
        localStorage.removeItem('ri7_user')
        localStorage.removeItem('ri7_token')
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = (userData, token) => {
    setUser(userData)
    localStorage.setItem('ri7_user', JSON.stringify(userData))
    localStorage.setItem('ri7_token', token)
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('ri7_user')
    localStorage.removeItem('ri7_token')
  }

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      loading,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  )
}

const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export default useAuth