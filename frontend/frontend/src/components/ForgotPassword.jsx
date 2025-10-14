import { useState } from 'react'
import LogoSetjen from '../assets/LogoSetjen.png'

const ForgotPassword = () => {
  const [step, setStep] = useState(1) // 1: email, 2: security question, 3: new password, 4: success
  const [email, setEmail] = useState('')
  const [securityAnswer, setSecurityAnswer] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [securityQuestion, setSecurityQuestion] = useState('')

  // Daftar pertanyaan keamanan
  const securityQuestions = [
    { question: 'Apa warna kesukaan Ketua DPD RI?', answer: 'hijau' },
    { question: 'Berapa tinggi badan Ketua DPD RI? (dalam cm)', answer: '170' },
    { question: 'Di kota mana Ketua DPD RI dilahirkan?', answer: 'jakarta' },
    { question: 'Apa hobby Ketua DPD RI?', answer: 'membaca' }
  ]

  const handleEmailSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      // Cek apakah email terdaftar
      const response = await fetch('http://localhost:4000/api/auth/check-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })

      const data = await response.json()

      if (data.success) {
        // Email ditemukan, random pilih pertanyaan keamanan
        const randomQuestion = securityQuestions[Math.floor(Math.random() * securityQuestions.length)]
        setSecurityQuestion(randomQuestion.question)
        setStep(2)
      } else {
        setMessage('Email tidak ditemukan di sistem.')
      }
    } catch (error) {
      setMessage('Koneksi ke server gagal.')
    } finally {
      setLoading(false)
    }
  }

  const handleSecurityQuestionSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    // Cari pertanyaan dan jawaban yang benar
    const currentQuestion = securityQuestions.find(q => q.question === securityQuestion)
    
    if (currentQuestion && securityAnswer.toLowerCase().trim() === currentQuestion.answer.toLowerCase()) {
      setMessage('')
      setStep(3)
    } else {
      setMessage('Jawaban salah! Silakan coba lagi.')
      setSecurityAnswer('')
    }
    
    setLoading(false)
  }

  const handlePasswordReset = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    // Validasi password
    if (newPassword.length < 6) {
      setMessage('Password minimal 6 karakter.')
      setLoading(false)
      return
    }

    if (newPassword !== confirmPassword) {
      setMessage('Password dan konfirmasi password tidak sama.')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('http://localhost:4000/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, newPassword })
      })

      const data = await response.json()

      if (data.success) {
        setStep(4)
      } else {
        setMessage(data.error?.message || 'Gagal reset password.')
      }
    } catch (error) {
      setMessage('Koneksi ke server gagal.')
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
      background: 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 50%, #10b981 100%)', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      fontFamily: "'Poppins', sans-serif", 
      padding: '20px' 
    }}>
      
      <div style={{ 
        position: 'absolute', 
        top: '10%', 
        left: '10%', 
        width: '100px', 
        height: '100px', 
        borderRadius: '50%', 
        background: 'rgba(255, 255, 255, 0.1)', 
        animation: 'float 6s ease-in-out infinite' 
      }}></div>

      <div style={{ 
        width: '100%', 
        maxWidth: '480px', 
        background: 'white', 
        borderRadius: '32px', 
        padding: '50px 45px', 
        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.2)', 
        position: 'relative' 
      }}>
        
        <a href="/login" style={{ 
          position: 'absolute', 
          top: '25px', 
          left: '25px', 
          width: '40px', 
          height: '40px', 
          borderRadius: '12px', 
          background: '#f1f5f9', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          textDecoration: 'none', 
          fontSize: '20px', 
          border: '2px solid #e2e8f0',
          color: '#64748b',
          fontWeight: '600'
        }}>←</a>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '28px' }}>
          <div style={{ 
            width: '90px', 
            height: '90px', 
            background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)', 
            borderRadius: '50%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            border: '3px solid #e2e8f0' 
          }}>
            <img src={LogoSetjen} alt="Logo" style={{ width: '65px', height: '65px', objectFit: 'contain' }} />
          </div>
        </div>

        {/* Step 1: Email Input */}
        {step === 1 && (
          <>
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#0f172a', marginBottom: '10px' }}>
                Forgot Password?
              </h1>
              <p style={{ fontSize: '15px', color: '#64748b', lineHeight: '1.6', maxWidth: '340px', margin: '0 auto' }}>
                Masukkan email Anda untuk memverifikasi identitas.
              </p>
            </div>

            <form onSubmit={handleEmailSubmit}>
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '15px', fontWeight: '600', color: '#0f172a', marginBottom: '10px' }}>
                  Email Address
                </label>
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  placeholder="Enter your email" 
                  style={{ 
                    width: '100%', 
                    boxSizing: 'border-box', 
                    padding: '14px 16px', 
                    border: '2px solid #e2e8f0', 
                    borderRadius: '12px', 
                    fontSize: '16px', 
                    outline: 'none', 
                    background: '#fafbfc' 
                  }} 
                  required 
                />
              </div>

              <button 
                type="submit" 
                disabled={loading} 
                style={{ 
                  width: '100%', 
                  boxSizing: 'border-box', 
                  padding: '16px', 
                  background: loading ? '#cbd5e0' : 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '12px', 
                  fontSize: '16px', 
                  fontWeight: '600', 
                  cursor: loading ? 'not-allowed' : 'pointer', 
                  marginBottom: '16px' 
                }}
              >
                {loading ? 'Memverifikasi...' : 'Lanjutkan'}
              </button>

              {message && (
                <div style={{ 
                  padding: '14px', 
                  backgroundColor: '#fef2f2', 
                  color: '#dc2626', 
                  borderRadius: '12px', 
                  fontSize: '14px', 
                  fontWeight: '500', 
                  border: '1px solid #fecaca', 
                  textAlign: 'center' 
                }}>
                  {message}
                </div>
              )}
            </form>
          </>
        )}

        {/* Step 2: Security Question */}
        {step === 2 && (
          <>
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#0f172a', marginBottom: '10px' }}>
                Pertanyaan Keamanan
              </h1>
              <p style={{ fontSize: '15px', color: '#64748b', lineHeight: '1.6', maxWidth: '340px', margin: '0 auto' }}>
                Jawab pertanyaan berikut untuk verifikasi identitas Anda.
              </p>
            </div>

            <form onSubmit={handleSecurityQuestionSubmit}>
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '15px', fontWeight: '600', color: '#0f172a', marginBottom: '10px' }}>
                  Pertanyaan Keamanan
                </label>
                <div style={{ 
                  background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)', 
                  padding: '16px', 
                  borderRadius: '12px', 
                  border: '2px solid #e2e8f0', 
                  fontWeight: '600', 
                  fontSize: '15px', 
                  color: '#0f172a', 
                  marginBottom: '12px',
                  textAlign: 'center'
                }}>
                  {securityQuestion}
                </div>
                <input 
                  type="text" 
                  value={securityAnswer} 
                  onChange={(e) => setSecurityAnswer(e.target.value)} 
                  placeholder="Masukkan jawaban Anda" 
                  style={{ 
                    width: '100%', 
                    boxSizing: 'border-box', 
                    padding: '14px 16px', 
                    border: '2px solid #e2e8f0', 
                    borderRadius: '12px', 
                    fontSize: '16px', 
                    outline: 'none', 
                    background: '#fafbfc' 
                  }} 
                  required 
                />
              </div>

              <button 
                type="submit" 
                disabled={loading} 
                style={{ 
                  width: '100%', 
                  boxSizing: 'border-box', 
                  padding: '16px', 
                  background: loading ? '#cbd5e0' : 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '12px', 
                  fontSize: '16px', 
                  fontWeight: '600', 
                  cursor: loading ? 'not-allowed' : 'pointer', 
                  marginBottom: '16px' 
                }}
              >
                {loading ? 'Memverifikasi...' : 'Verifikasi'}
              </button>

              {message && (
                <div style={{ 
                  padding: '14px', 
                  backgroundColor: '#fef2f2', 
                  color: '#dc2626', 
                  borderRadius: '12px', 
                  fontSize: '14px', 
                  fontWeight: '500', 
                  border: '1px solid #fecaca', 
                  textAlign: 'center' 
                }}>
                  {message}
                </div>
              )}
            </form>
          </>
        )}

        {/* Step 3: New Password */}
        {step === 3 && (
          <>
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#0f172a', marginBottom: '10px' }}>
                Reset Password
              </h1>
              <p style={{ fontSize: '15px', color: '#64748b', lineHeight: '1.6', maxWidth: '340px', margin: '0 auto' }}>
                Masukkan password baru Anda.
              </p>
            </div>

            <form onSubmit={handlePasswordReset}>
              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '15px', fontWeight: '600', color: '#0f172a', marginBottom: '10px' }}>
                  Password Baru
                </label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type={showPassword ? "text" : "password"}
                    value={newPassword} 
                    onChange={(e) => setNewPassword(e.target.value)} 
                    placeholder="Masukkan password baru" 
                    style={{ 
                      width: '100%', 
                      boxSizing: 'border-box', 
                      padding: '14px 50px 14px 16px', 
                      border: '2px solid #e2e8f0', 
                      borderRadius: '12px', 
                      fontSize: '16px', 
                      outline: 'none', 
                      background: '#fafbfc' 
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

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '15px', fontWeight: '600', color: '#0f172a', marginBottom: '10px' }}>
                  Konfirmasi Password
                </label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword} 
                    onChange={(e) => setConfirmPassword(e.target.value)} 
                    placeholder="Konfirmasi password baru" 
                    style={{ 
                      width: '100%', 
                      boxSizing: 'border-box', 
                      padding: '14px 50px 14px 16px', 
                      border: '2px solid #e2e8f0', 
                      borderRadius: '12px', 
                      fontSize: '16px', 
                      outline: 'none', 
                      background: '#fafbfc' 
                    }} 
                    required 
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
                    {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading} 
                style={{ 
                  width: '100%', 
                  boxSizing: 'border-box', 
                  padding: '16px', 
                  background: loading ? '#cbd5e0' : 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '12px', 
                  fontSize: '16px', 
                  fontWeight: '600', 
                  cursor: loading ? 'not-allowed' : 'pointer', 
                  marginBottom: '16px' 
                }}
              >
                {loading ? 'Mereset Password...' : 'Reset Password'}
              </button>

              {message && (
                <div style={{ 
                  padding: '14px', 
                  backgroundColor: '#fef2f2', 
                  color: '#dc2626', 
                  borderRadius: '12px', 
                  fontSize: '14px', 
                  fontWeight: '500', 
                  border: '1px solid #fecaca', 
                  textAlign: 'center' 
                }}>
                  {message}
                </div>
              )}
            </form>
          </>
        )}

        {/* Step 4: Success */}
        {step === 4 && (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <div style={{ 
              width: '80px', 
              height: '80px', 
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              margin: '0 auto 24px', 
              fontSize: '40px', 
              color: 'white' 
            }}>✓</div>
            <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#0f172a', marginBottom: '12px' }}>
              Password Berhasil Direset!
            </h2>
            <p style={{ fontSize: '15px', color: '#64748b', lineHeight: '1.6', marginBottom: '32px' }}>
              Password Anda telah berhasil diubah. Silakan login dengan password baru Anda.
            </p>
            <a 
              href="/login" 
              style={{ 
                display: 'inline-block', 
                padding: '16px 40px', 
                background: 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)', 
                color: 'white', 
                textDecoration: 'none', 
                borderRadius: '12px', 
                fontSize: '16px', 
                fontWeight: '600' 
              }}
            >
              Kembali ke Login
            </a>
          </div>
        )}

        {step < 4 && (
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <a 
              href="/login" 
              style={{ 
                fontSize: '14px', 
                color: '#64748b', 
                textDecoration: 'none', 
                fontWeight: '500' 
              }}
            >
              ← Kembali ke Login
            </a>
          </div>
        )}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');
        @keyframes float { 
          0%, 100% { transform: translateY(0px); } 
          50% { transform: translateY(-20px); } 
        }
      `}</style>
    </div>
  )
}

export default ForgotPassword