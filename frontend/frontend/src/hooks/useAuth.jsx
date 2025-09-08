// Path: /frontend/src/contexts/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Helper function untuk cek token expiry
  const isTokenExpired = (token) => {
    if (!token) return true
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      const currentTime = Date.now() / 1000
      
      // Cek apakah token sudah expired
      if (payload.exp < currentTime) {
        console.log('Token expired at:', new Date(payload.exp * 1000))
        return true
      }
      
      // Log remaining time
      const remainingTime = (payload.exp - currentTime) / 3600 // in hours
      console.log(`Token valid for ${remainingTime.toFixed(1)} hours`)
      
      return false
    } catch (error) {
      console.error('Error checking token expiry:', error)
      return true
    }
  }

  // Auto logout function
  const autoLogout = () => {
    console.log('Auto logout: Token expired')
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    setToken(null)
    setIsAuthenticated(false)
    
    // Show notification
    if (window.location.pathname !== '/login') {
      alert('Sesi Anda telah berakhir. Silakan login kembali.')
      window.location.href = '/login'
    }
  }

  // Check authentication status on app start
  useEffect(() => {
    const checkAuth = () => {
      try {
        const storedToken = localStorage.getItem('token')
        const storedUser = localStorage.getItem('user')

        if (storedToken && storedUser) {
          // Check if token is expired
          if (isTokenExpired(storedToken)) {
            autoLogout()
            return
          }

          const parsedUser = JSON.parse(storedUser)
          setUser(parsedUser)
          setToken(storedToken)
          setIsAuthenticated(true)
          
          console.log('User authenticated from localStorage:', parsedUser.email)
        } else {
          console.log('No authentication data found')
        }
      } catch (error) {
        console.error('Auth check error:', error)
        // Clear corrupted data
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  // Set up periodic token check (every 5 minutes)
  useEffect(() => {
    if (!isAuthenticated) return

    const interval = setInterval(() => {
      const storedToken = localStorage.getItem('token')
      if (storedToken && isTokenExpired(storedToken)) {
        autoLogout()
      }
    }, 5 * 60 * 1000) // Check every 5 minutes

    return () => clearInterval(interval)
  }, [isAuthenticated])

  // Set up automatic logout timer when user logs in
  useEffect(() => {
    if (!token) return

    const payload = JSON.parse(atob(token.split('.')[1]))
    const currentTime = Date.now() / 1000
    const timeUntilExpiry = (payload.exp - currentTime) * 1000 // in milliseconds

    if (timeUntilExpiry > 0) {
      const timeoutId = setTimeout(() => {
        autoLogout()
      }, timeUntilExpiry)

      console.log(`Auto logout scheduled in ${(timeUntilExpiry / 1000 / 3600).toFixed(1)} hours`)

      return () => clearTimeout(timeoutId)
    }
  }, [token])

  const login = (userData, authToken) => {
    try {
      // Validate token before storing
      if (isTokenExpired(authToken)) {
        throw new Error('Received expired token')
      }

      localStorage.setItem('token', authToken)
      localStorage.setItem('user', JSON.stringify(userData))
      
      setUser(userData)
      setToken(authToken)
      setIsAuthenticated(true)
      
      console.log('Login successful:', userData.email)
      
      // Calculate expiry time for user info
      const payload = JSON.parse(atob(authToken.split('.')[1]))
      const expiryDate = new Date(payload.exp * 1000)
      console.log('Session will expire at:', expiryDate.toLocaleString())
      
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    setToken(null)
    setIsAuthenticated(false)
    
    console.log('User logged out')
  }

  // API call wrapper dengan auto token refresh
  const apiCall = async (url, options = {}) => {
    const currentToken = localStorage.getItem('token')
    
    if (!currentToken || isTokenExpired(currentToken)) {
      autoLogout()
      throw new Error('Token expired')
    }

    return fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${currentToken}`,
        'Content-Type': 'application/json',
        ...options.headers
      }
    })
  }

  const value = {
    user,
    token,
    loading,
    isAuthenticated,
    login,
    logout,
    apiCall
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}