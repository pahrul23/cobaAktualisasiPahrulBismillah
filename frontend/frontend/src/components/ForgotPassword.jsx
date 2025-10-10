import { useState } from 'react'
import LogoSetjen from '../assets/LogoSetjen.png'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [success, setSuccess] = useState(false)
  const [captchaNum1] = useState(Math.floor(Math.random() * 10) + 1)
  const [captchaNum2] = useState(Math.floor(Math.random() * 10) + 1)
  const [captchaAnswer, setCaptchaAnswer] = useState('')
  const [captchaError, setCaptchaError] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    setCaptchaError(false)
    setSuccess(false)

    const correctAnswer = captchaNum1 + captchaNum2
    if (parseInt(captchaAnswer) !== correctAnswer) {
      setCaptchaError(true)
      setMessage('Captcha salah! Silakan coba lagi.')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('http://localhost:4000/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })

      const data = await response.json()

      if (data.success) {
        setSuccess(true)
        setMessage('Link reset password telah dikirim ke email Anda.')
      } else {
        setMessage(data.error?.message || 'Gagal mengirim link')
      }
    } catch (error) {
      setMessage('Koneksi ke server gagal.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 50%, #10b981 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Poppins', sans-serif", padding: '20px' }}>
      
      <div style={{ position: 'absolute', top: '10%', left: '10%', width: '100px', height: '100px', borderRadius: '50%', background: 'rgba(255, 255, 255, 0.1)', animation: 'float 6s ease-in-out infinite' }}></div>

      <div style={{ width: '100%', maxWidth: '480px', background: 'white', borderRadius: '32px', padding: '60px 50px', boxShadow: '0 25px 50px rgba(0, 0, 0, 0.2)', position: 'relative' }}>
        
        <a href="/login" style={{ position: 'absolute', top: '30px', left: '30px', width: '40px', height: '40px', borderRadius: '12px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', fontSize: '20px', border: '2px solid #e2e8f0' }}>←</a>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '32px' }}>
          <div style={{ width: '100px', height: '100px', background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '3px solid #e2e8f0' }}>
            <img src={LogoSetjen} alt="Logo" style={{ width: '70px', height: '70px', objectFit: 'contain' }} />
          </div>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#0f172a', marginBottom: '12px' }}>Forgot Password?</h1>
          <p style={{ fontSize: '15px', color: '#64748b', lineHeight: '1.6', maxWidth: '340px', margin: '0 auto' }}>Enter your email and we will send you reset instructions.</p>
        </div>

        {success ? (
          <div style={{ textAlign: 'center', padding: '32px 20px' }}>
            <div style={{ width: '80px', height: '80px', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', fontSize: '40px', color: 'white' }}>✓</div>
            <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#0f172a', marginBottom: '12px' }}>Check Your Email!</h2>
            <p style={{ fontSize: '15px', color: '#64748b', lineHeight: '1.6', marginBottom: '32px' }}>{message}</p>
            <a href="/login" style={{ display: 'inline-block', padding: '14px 32px', background: 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)', color: 'white', textDecoration: 'none', borderRadius: '12px', fontSize: '15px', fontWeight: '600' }}>Back to Login</a>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '15px', fontWeight: '600', color: '#0f172a', marginBottom: '10px' }}>Email Address</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" style={{ width: '100%', boxSizing: 'border-box', padding: '16px 18px', border: '2px solid #e2e8f0', borderRadius: '12px', fontSize: '16px', outline: 'none', background: '#fafbfc' }} required />
            </div>

            <div style={{ marginBottom: '32px' }}>
              <label style={{ display: 'block', fontSize: '15px', fontWeight: '600', color: '#0f172a', marginBottom: '10px' }}>Security Check</label>
              <div style={{ background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)', padding: '20px', borderRadius: '12px', textAlign: 'center', border: captchaError ? '2px solid #ef4444' : '2px solid #e2e8f0', fontWeight: '700', fontSize: '24px', color: '#0f172a', marginBottom: '12px', userSelect: 'none' }}>{captchaNum1} + {captchaNum2} = ?</div>
              <input type="number" value={captchaAnswer} onChange={(e) => { setCaptchaAnswer(e.target.value); setCaptchaError(false); }} placeholder="Enter answer" style={{ width: '100%', boxSizing: 'border-box', padding: '16px 18px', border: captchaError ? '2px solid #ef4444' : '2px solid #e2e8f0', borderRadius: '12px', fontSize: '16px', outline: 'none', background: '#fafbfc' }} required />
              {captchaError && <p style={{ color: '#ef4444', fontSize: '13px', marginTop: '8px', fontWeight: '500' }}>❌ Wrong answer!</p>}
            </div>

            <button type="submit" disabled={loading} style={{ width: '100%', boxSizing: 'border-box', padding: '18px', background: loading ? '#cbd5e0' : 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)', color: 'white', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer', marginBottom: '20px' }}>{loading ? 'Sending...' : 'Send Reset Link'}</button>

            {message && !success && <div style={{ padding: '16px', backgroundColor: '#fef2f2', color: '#dc2626', borderRadius: '12px', fontSize: '14px', fontWeight: '500', border: '1px solid #fecaca', textAlign: 'center' }}>{message}</div>}

            <div style={{ textAlign: 'center', marginTop: '24px' }}>
              <a href="/login" style={{ fontSize: '14px', color: '#64748b', textDecoration: 'none', fontWeight: '500' }}>← Back to Login</a>
            </div>
          </form>
        )}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');
        @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-20px); } }
      `}</style>
    </div>
  )
}

export default ForgotPassword