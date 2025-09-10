import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import LogoSetjen from '../assets/LogoSetjen.png'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [mounted, setMounted] = useState(false)
  
  const { login, isAuthenticated, user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    setMounted(true)
    // Redirect if already logged in - SMART REDIRECT
    if (isAuthenticated && user) {
      if (user.role === 'ketua' || user.role === 'admin') {
        navigate('/dashboard') // Will show KetuaDashboard
      } else {
        navigate('/dashboard') // Will show StafDashboard
      }
    }
  }, [isAuthenticated, user, navigate])

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const response = await fetch('http://localhost:4000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()

      if (data.success) {
        const userData = data.data.user
        setMessage(`Login berhasil! Selamat datang ${userData.name}`)
        
        // Use the login function from useAuth
        login(userData, data.data.token)
        
        // SMART REDIRECT based on role
        setTimeout(() => {
          if (userData.role === 'ketua' || userData.role === 'admin') {
            navigate('/executive') // KetuaDashboard
          } else {
            navigate('/dashboard') // StafDashboard
          }
        }, 1000)
      } else {
        setMessage(`${data.error.message}`)
      }
    } catch (error) {
      setMessage('Koneksi ke server gagal')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: '#e2e8f0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Poppins', 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif",
      padding: '20px'
    }}>
      
      {/* Main container with border radius */}
      <div style={{
        width: '100%',
        maxWidth: '1200px',
        height: '700px',
        display: 'flex',
        borderRadius: '32px',
        overflow: 'hidden',
        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15)',
        transform: mounted ? 'scale(1)' : 'scale(0.95)',
        opacity: mounted ? 1 : 0,
        transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
      }}>
        
        {/* Left side */}
        <div style={{
          flex: '1',
          background: 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 50%, #10b981 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          color: 'white'
        }}>
          {/* Floating decorative elements */}
          <div style={{
            position: 'absolute',
            top: '15%',
            left: '15%',
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.15)',
            animation: 'float 4s ease-in-out infinite'
          }}></div>
          <div style={{
            position: 'absolute',
            bottom: '20%',
            right: '20%',
            width: '60px',
            height: '60px',
            borderRadius: '30px',
            background: 'rgba(255, 255, 255, 0.1)',
            animation: 'float 6s ease-in-out infinite reverse'
          }}></div>
          
          {/* Logo area */}
          <div style={{
            width: '200px',
            height: '200px',
            background: 'rgba(255, 255, 255, 0.15)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '50px',
            backdropFilter: 'blur(20px)',
            border: '3px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)'
          }}>
            <img 
              src={LogoSetjen} 
              alt="Logo Setjen DPD RI"
              style={{
                width: '140px',
                height: '140px',
                objectFit: 'contain'
              }}
            />
          </div>
          
          <h2 style={{
            fontSize: '42px',
            fontWeight: '700',
            marginBottom: '24px',
            textAlign: 'center',
            lineHeight: '1.1',
            color: 'white',
            textShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
            letterSpacing: '-0.5px'
          }}>
            Sistem Manajemen<br />Surat dan Agenda RI 7
          </h2>
          <p style={{
            fontSize: '20px',
            textAlign: 'center',
            maxWidth: '380px',
            lineHeight: '1.5',
            color: 'rgba(255, 255, 255, 0.9)',
            marginBottom: '12px',
            fontWeight: '500'
          }}>
            Sekretariat Ketua DPD RI
          </p>
          <p style={{
            fontSize: '18px',
            textAlign: 'center',
            maxWidth: '380px',
            lineHeight: '1.5',
            color: 'rgba(255, 255, 255, 0.8)',
            fontWeight: '400'
          }}>
            Sekretariat Jenderal DPD RI
          </p>

          {/* Demo credentials info */}
          <div style={{
            position: 'absolute',
            bottom: '30px',
            left: '30px',
            background: 'rgba(255, 255, 255, 0.1)',
            padding: '15px',
            borderRadius: '12px',
            backdropFilter: 'blur(10px)',
            fontSize: '12px',
            lineHeight: '1.4'
          }}>
            {/* <div style={{ fontWeight: '600', marginBottom: '8px' }}>🧪 Demo Accounts:</div> */}
            {/* <div>👑 Ketua: ketua@test.com / password</div> */}
            {/* <div>👤 Staff: staff@test.com / password</div> */}
          </div>
        </div>

        {/* Right side */}
        <div style={{
          flex: '1',
          background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px'
        }}>
          
          {/* Form Container Box */}
          <div style={{
            width: '100%',
            maxWidth: '420px',
            background: 'white',
            borderRadius: '24px',
            padding: '50px 45px',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.08), 0 15px 30px rgba(0, 0, 0, 0.05)',
            border: '1px solid rgba(226, 232, 240, 0.8)'
          }}>
            
            {/* Header */}
            <div style={{ marginBottom: '40px', textAlign: 'center' }}>
              <h1 style={{
                fontSize: '36px',
                fontWeight: '700',
                color: '#0f172a',
                marginBottom: '8px',
                letterSpacing: '-0.5px'
              }}>
                Sign In
              </h1>
              <p style={{
                fontSize: '16px',
                color: '#64748b',
                fontWeight: '400'
              }}>
                Welcome back! Please enter your details.
              </p>
            </div>

            <form onSubmit={handleLogin}>
              {/* Email Field */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '15px',
                  fontWeight: '600',
                  color: '#0f172a',
                  marginBottom: '10px'
                }}>
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  style={{
                    width: '100%',
                    boxSizing: 'border-box',
                    padding: '16px 18px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '12px',
                    fontSize: '16px',
                    transition: 'all 0.3s ease',
                    outline: 'none',
                    fontWeight: '400',
                    letterSpacing: '0.25px',
                    background: '#fafbfc'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#0ea5e9'
                    e.target.style.boxShadow = '0 0 0 3px rgba(14, 165, 233, 0.1)'
                    e.target.style.background = '#ffffff'
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e2e8f0'
                    e.target.style.boxShadow = 'none'
                    e.target.style.background = '#fafbfc'
                  }}
                  required
                />
              </div>

              {/* Password Field */}
              <div style={{ marginBottom: '32px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '15px',
                  fontWeight: '600',
                  color: '#0f172a',
                  marginBottom: '10px'
                }}>
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    style={{
                      width: '100%',
                      boxSizing: 'border-box',
                      padding: '16px 50px 16px 18px',
                      border: '2px solid #e2e8f0',
                      borderRadius: '12px',
                      fontSize: '16px',
                      transition: 'all 0.3s ease',
                      outline: 'none',
                      fontWeight: '400',
                      letterSpacing: '0.25px',
                      background: '#fafbfc'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#0ea5e9'
                      e.target.style.boxShadow = '0 0 0 3px rgba(14, 165, 233, 0.1)'
                      e.target.style.background = '#ffffff'
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e2e8f0'
                      e.target.style.boxShadow = 'none'
                      e.target.style.background = '#fafbfc'
                    }}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '16px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '18px',
                      color: '#64748b'
                    }}
                  >
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
              </div>

              {/* Sign In Button */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  padding: '18px',
                  background: loading 
                    ? '#cbd5e0' 
                    : 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  marginBottom: '24px',
                  letterSpacing: '0.5px'
                }}
              >
                {loading ? (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{
                      width: '20px',
                      height: '20px',
                      border: '2px solid transparent',
                      borderTop: '2px solid white',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite',
                      marginRight: '8px'
                    }}></div>
                    Signing in...
                  </div>
                ) : 'Sign in'}
              </button>

              {/* Message */}
              {message && (
                <div style={{
                  padding: '16px',
                  backgroundColor: message.includes('berhasil') ? '#ecfdf5' : '#fef2f2',
                  color: message.includes('berhasil') ? '#065f46' : '#dc2626',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: '500',
                  border: `1px solid ${message.includes('berhasil') ? '#a7f3d0' : '#fecaca'}`,
                  textAlign: 'center'
                }}>
                  {message}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');
        
        * {
          box-sizing: border-box;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-15px) rotate(3deg); }
          66% { transform: translateY(-8px) rotate(-2deg); }
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

export default Login