// Path: /frontend/src/pages/Ketua/Settings/SettingsPage.jsx
import { useState, useEffect } from 'react';
import useAuth from '../../../hooks/useAuth';

const SettingsPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [isMobile, setIsMobile] = useState(false);
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const [selectedTheme, setSelectedTheme] = useState(() => {
    return localStorage.getItem('theme') || 'terang';
  });

  // Presidential color scheme
  const colors = {
    primary: {
      gold: '#F59E0B',
      darkBlue: '#1E40AF',
      navy: '#0F172A',
      emerald: '#10B981',
      ruby: '#DC2626'
    },
    gradients: {
      presidential: 'linear-gradient(135deg, #0F172A 0%, #1E3A8A 50%, #1E40AF 100%)',
      gold: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
      emerald: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
      ruby: 'linear-gradient(135deg, #DC2626 0%, #991B1B 100%)',
      silver: 'linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 100%)'
    },
    neutral: {
      bg: '#F9FAFB',
      white: '#FFFFFF',
      border: '#E5E7EB',
      text: '#111827',
      textLight: '#6B7280'
    }
  };

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'terang';
    setSelectedTheme(savedTheme);
    applyTheme(savedTheme, false);
  }, []);

  const tabs = [
    { id: 'profile', label: 'Profil Ketua', icon: '👑' },
    { id: 'system', label: 'Sistem', icon: '⚙️' },
    { id: 'security', label: 'Keamanan', icon: '🔒' }
  ];

  const validatePassword = (password) => {
    if (password.length < 8) return 'Password minimal 8 karakter';
    if (!/[A-Z]/.test(password)) return 'Password harus mengandung minimal 1 huruf besar';
    if (!/[a-z]/.test(password)) return 'Password harus mengandung minimal 1 huruf kecil';
    if (!/[0-9]/.test(password)) return 'Password harus mengandung minimal 1 angka';
    return null;
  };

  const applyTheme = (theme, showAlert = true) => {
    const style = document.createElement('style');
    style.id = 'admire-theme';
    
    const oldStyle = document.getElementById('admire-theme');
    if (oldStyle) oldStyle.remove();
    
    if (theme === 'dark') {
      style.textContent = `
        body { background: #111827 !important; }
        .main-content, [style*="background: #f8fafc"], [style*="background: white"] {
          background: #1f2937 !important;
        }
        h1, h2, h3, h4, h5, h6 { color: #f9fafb !important; }
        p, span, label { color: #d1d5db !important; }
        input, select, textarea {
          background: #374151 !important;
          color: #f9fafb !important;
          border-color: #4b5563 !important;
        }
      `;
      document.head.appendChild(style);
    } else if (theme === 'lucu') {
      style.textContent = `
        body {
          background: linear-gradient(135deg, #fce7f3 0%, #fbcfe8 50%, #f9a8d4 100%) !important;
        }
        .main-content, [style*="background: #f8fafc"], [style*="background: white"] {
          background: rgba(252, 231, 243, 0.8) !important;
          backdrop-filter: blur(10px) !important;
        }
        h1, h2, h3, h4, h5, h6 {
          background: linear-gradient(135deg, #ec4899, #f472b6, #fb7185) !important;
          -webkit-background-clip: text !important;
          -webkit-text-fill-color: transparent !important;
          font-weight: 800 !important;
        }
      `;
      document.head.appendChild(style);
    }
    
    if (showAlert) {
      alert(`Tema ${theme === 'dark' ? '🌙 Gelap' : theme === 'lucu' ? '💖 Pink Lucu' : '☀️ Presidential'} berhasil diterapkan!`);
    }
  };

  const handleThemeChange = (theme) => {
    setSelectedTheme(theme);
    localStorage.setItem('theme', theme);
    applyTheme(theme, true);
  };

  const handlePasswordChange = async () => {
    setPasswordError('');
    setPasswordSuccess('');

    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setPasswordError('Semua field harus diisi');
      return;
    }

    const passwordValidation = validatePassword(passwordData.newPassword);
    if (passwordValidation) {
      setPasswordError(passwordValidation);
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('Password baru dan konfirmasi password tidak cocok');
      return;
    }

    if (passwordData.currentPassword === passwordData.newPassword) {
      setPasswordError('Password baru tidak boleh sama dengan password lama');
      return;
    }

    setIsUpdatingPassword(true);

    try {
      const response = await fetch('http://localhost:4000/api/users/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('ri7_token')}`
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Gagal mengubah password');
      }

      setPasswordSuccess('Password berhasil diubah! Silakan login kembali.');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });

      setTimeout(() => {
        localStorage.removeItem('ri7_token');
        localStorage.removeItem('ri7_user');
        window.location.href = '/login';
      }, 2000);

    } catch (error) {
      setPasswordError(error.message || 'Terjadi kesalahan saat mengubah password');
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  return (
    <>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }
      `}</style>

      <div style={{
        fontFamily: "'Poppins', sans-serif",
        backgroundColor: colors.neutral.bg,
        minHeight: '100vh',
        padding: isMobile ? '16px' : '32px'
      }}>
        
        {/* Presidential Header */}
        <div style={{
          background: colors.gradients.presidential,
          borderRadius: '32px',
          padding: isMobile ? '32px 24px' : '56px 48px',
          marginBottom: '32px',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 30px 60px rgba(15, 23, 42, 0.3)'
        }}>
          {/* Decorative Elements */}
          <div style={{
            position: 'absolute',
            top: '-100px',
            right: '-100px',
            width: '300px',
            height: '300px',
            background: 'rgba(245, 158, 11, 0.1)',
            borderRadius: '50%',
            filter: 'blur(80px)'
          }} />
          
          <div style={{ position: 'relative', zIndex: 2 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '16px' }}>
              <div style={{
                width: '80px',
                height: '80px',
                background: colors.gradients.gold,
                borderRadius: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '40px',
                boxShadow: '0 8px 24px rgba(245, 158, 11, 0.4)'
              }}>
                👑
              </div>
              <div>
                <h1 style={{
                  fontSize: isMobile ? '28px' : '42px',
                  fontWeight: '900',
                  color: 'white',
                  margin: '0 0 8px 0',
                  textShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                  letterSpacing: '-0.5px'
                }}>
                  Pengaturan Ketua DPD RI
                </h1>
                <p style={{
                  fontSize: isMobile ? '14px' : '18px',
                  color: 'rgba(255, 255, 255, 0.9)',
                  margin: 0,
                  fontWeight: '500'
                }}>
                  Kelola preferensi dan keamanan akun Ketua
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{
          background: 'white',
          borderRadius: '24px',
          padding: '12px',
          marginBottom: '24px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
          display: 'flex',
          gap: '8px',
          flexWrap: 'wrap'
        }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: isMobile ? '1 1 100%' : '1',
                padding: '16px 24px',
                borderRadius: '18px',
                border: 'none',
                background: activeTab === tab.id 
                  ? colors.gradients.presidential
                  : colors.gradients.silver,
                color: activeTab === tab.id ? 'white' : colors.neutral.text,
                fontSize: '15px',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                boxShadow: activeTab === tab.id ? '0 4px 16px rgba(15, 23, 42, 0.3)' : 'none'
              }}
              onMouseEnter={(e) => {
                if (activeTab !== tab.id) {
                  e.currentTarget.style.background = colors.gradients.gold;
                  e.currentTarget.style.color = 'white';
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== tab.id) {
                  e.currentTarget.style.background = colors.gradients.silver;
                  e.currentTarget.style.color = colors.neutral.text;
                }
              }}
            >
              <span style={{ fontSize: '24px' }}>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div style={{
          background: 'white',
          borderRadius: '24px',
          padding: isMobile ? '24px' : '40px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
          minHeight: '500px',
          animation: 'fadeIn 0.5s ease-out'
        }}>
          
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div style={{ display: 'grid', gap: '32px' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: '100px',
                  marginBottom: '24px'
                }}>
                  🏛️
                </div>
                <h2 style={{
                  margin: '0 0 12px 0',
                  fontSize: '32px',
                  fontWeight: '900',
                  background: colors.gradients.presidential,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  Ketua Dewan Perwakilan Daerah RI
                </h2>
                <p style={{
                  margin: 0,
                  fontSize: '16px',
                  color: colors.neutral.textLight,
                  fontWeight: '600'
                }}>
                  Lembaga Tinggi Negara Republik Indonesia
                </p>
              </div>

              <div style={{ display: 'grid', gap: '24px' }}>
                {/* Nama & Jabatan */}
                <div style={{
                  background: colors.gradients.gold,
                  borderRadius: '24px',
                  padding: isMobile ? '28px' : '36px',
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: '0 12px 40px rgba(245, 158, 11, 0.25)'
                }}>
                  <div style={{
                    position: 'absolute',
                    top: '-60px',
                    right: '-60px',
                    fontSize: '180px',
                    opacity: '0.1'
                  }}>
                    👑
                  </div>
                  
                  <div style={{ position: 'relative', zIndex: 2 }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      marginBottom: '20px'
                    }}>
                      <div style={{
                        width: '64px',
                        height: '64px',
                        background: 'rgba(255, 255, 255, 0.3)',
                        borderRadius: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '32px',
                        backdropFilter: 'blur(10px)'
                      }}>
                        👤
                      </div>
                      <div>
                        <h3 style={{
                          margin: '0 0 6px 0',
                          fontSize: '18px',
                          fontWeight: '800',
                          color: 'white',
                          textTransform: 'uppercase',
                          letterSpacing: '1px'
                        }}>
                          Nama Ketua
                        </h3>
                        <p style={{
                          margin: 0,
                          fontSize: '14px',
                          color: 'rgba(255, 255, 255, 0.9)',
                          fontWeight: '600'
                        }}>
                          Pimpinan Tertinggi DPD RI
                        </p>
                      </div>
                    </div>

                    <div style={{
                      background: 'rgba(255, 255, 255, 0.95)',
                      borderRadius: '16px',
                      padding: '24px',
                      backdropFilter: 'blur(20px)'
                    }}>
                      <p style={{
                        margin: 0,
                        fontSize: '24px',
                        fontWeight: '900',
                        color: colors.neutral.text,
                        letterSpacing: '-0.5px'
                      }}>
                        {user?.name || 'SULTAN BAKTIAR NAJAMUDDIN'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Email & Kontak */}
                <div style={{
                  background: colors.gradients.presidential,
                  borderRadius: '24px',
                  padding: isMobile ? '28px' : '36px',
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: '0 12px 40px rgba(15, 23, 42, 0.25)'
                }}>
                  <div style={{
                    position: 'absolute',
                    top: '-60px',
                    right: '-60px',
                    fontSize: '180px',
                    opacity: '0.1'
                  }}>
                    ✉️
                  </div>
                  
                  <div style={{ position: 'relative', zIndex: 2 }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      marginBottom: '20px'
                    }}>
                      <div style={{
                        width: '64px',
                        height: '64px',
                        background: 'rgba(255, 255, 255, 0.2)',
                        borderRadius: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '32px',
                        backdropFilter: 'blur(10px)'
                      }}>
                        📧
                      </div>
                      <div>
                        <h3 style={{
                          margin: '0 0 6px 0',
                          fontSize: '18px',
                          fontWeight: '800',
                          color: 'white',
                          textTransform: 'uppercase',
                          letterSpacing: '1px'
                        }}>
                          Email Resmi
                        </h3>
                        <p style={{
                          margin: 0,
                          fontSize: '14px',
                          color: 'rgba(255, 255, 255, 0.9)',
                          fontWeight: '600'
                        }}>
                          Komunikasi Resmi Ketua
                        </p>
                      </div>
                    </div>

                    <div style={{
                      background: 'rgba(255, 255, 255, 0.95)',
                      borderRadius: '16px',
                      padding: '24px',
                      backdropFilter: 'blur(20px)'
                    }}>
                      <p style={{
                        margin: 0,
                        fontSize: '20px',
                        fontWeight: '700',
                        color: colors.neutral.text,
                        wordBreak: 'break-all'
                      }}>
                        {user?.email || 'ketua@dpd.go.id'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Info Banner */}
              <div style={{
                background: colors.gradients.emerald,
                borderRadius: '20px',
                padding: '28px',
                textAlign: 'center',
                boxShadow: '0 8px 24px rgba(16, 185, 129, 0.2)'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '12px' }}>
                  ⭐✨🎖️
                </div>
                <h3 style={{
                  margin: '0 0 8px 0',
                  fontSize: '22px',
                  fontWeight: '800',
                  color: 'white'
                }}>
                  Sistem Manajemen Surat Digital Terintegrasi
                </h3>
                <p style={{
                  margin: 0,
                  fontSize: '15px',
                  color: 'rgba(255, 255, 255, 0.95)',
                  fontWeight: '600'
                }}>
                  ADMIRE - Aplikasi Digital Manajemen Informasi & Rekam Elektronik
                </p>
              </div>
            </div>
          )}

          {/* System Tab */}
          {activeTab === 'system' && (
            <div>
              <h2 style={{
                margin: '0 0 32px 0',
                fontSize: '28px',
                fontWeight: '900',
                color: colors.neutral.text
              }}>
                Pengaturan Sistem
              </h2>
              
              <div style={{ display: 'grid', gap: '24px' }}>
                <div style={{
                  background: colors.neutral.bg,
                  padding: isMobile ? '24px' : '32px',
                  borderRadius: '20px',
                  border: `2px solid ${colors.neutral.border}`
                }}>
                  <h3 style={{
                    margin: '0 0 16px 0',
                    fontSize: '20px',
                    fontWeight: '700',
                    color: colors.neutral.text,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}>
                    🎨 Tema Aplikasi
                  </h3>
                  <p style={{
                    margin: '0 0 24px 0',
                    fontSize: '15px',
                    color: colors.neutral.textLight,
                    lineHeight: '1.6'
                  }}>
                    Pilih tema tampilan yang sesuai dengan preferensi Anda
                  </p>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
                    gap: '16px'
                  }}>
                    <button
                      onClick={() => handleThemeChange('terang')}
                      style={{
                        padding: '24px',
                        border: selectedTheme === 'terang' ? `4px solid ${colors.primary.gold}` : `2px solid ${colors.neutral.border}`,
                        borderRadius: '16px',
                        background: selectedTheme === 'terang' ? '#FEF3C7' : 'white',
                        cursor: 'pointer',
                        transition: 'all 0.3s',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '12px',
                        boxShadow: selectedTheme === 'terang' ? '0 8px 24px rgba(245, 158, 11, 0.3)' : 'none'
                      }}
                    >
                      <div style={{ fontSize: '48px' }}>☀️</div>
                      <div style={{
                        fontSize: '16px',
                        fontWeight: '700',
                        color: selectedTheme === 'terang' ? colors.primary.gold : colors.neutral.text
                      }}>
                        Presidential
                      </div>
                      {selectedTheme === 'terang' && (
                        <div style={{ fontSize: '14px', color: colors.primary.gold, fontWeight: '700' }}>
                          ✓ Aktif
                        </div>
                      )}
                    </button>

                    <button
                      onClick={() => handleThemeChange('dark')}
                      style={{
                        padding: '24px',
                        border: selectedTheme === 'dark' ? '4px solid #6366F1' : `2px solid ${colors.neutral.border}`,
                        borderRadius: '16px',
                        background: selectedTheme === 'dark' ? '#E0E7FF' : 'white',
                        cursor: 'pointer',
                        transition: 'all 0.3s',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '12px',
                        boxShadow: selectedTheme === 'dark' ? '0 8px 24px rgba(99, 102, 241, 0.3)' : 'none'
                      }}
                    >
                      <div style={{ fontSize: '48px' }}>🌙</div>
                      <div style={{
                        fontSize: '16px',
                        fontWeight: '700',
                        color: selectedTheme === 'dark' ? '#6366F1' : colors.neutral.text
                      }}>
                        Gelap
                      </div>
                      {selectedTheme === 'dark' && (
                        <div style={{ fontSize: '14px', color: '#6366F1', fontWeight: '700' }}>
                          ✓ Aktif
                        </div>
                      )}
                    </button>

                    <button
                      onClick={() => handleThemeChange('lucu')}
                      style={{
                        padding: '24px',
                        border: selectedTheme === 'lucu' ? '4px solid #EC4899' : `2px solid ${colors.neutral.border}`,
                        borderRadius: '16px',
                        background: selectedTheme === 'lucu' ? '#FCE7F3' : 'white',
                        cursor: 'pointer',
                        transition: 'all 0.3s',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '12px',
                        boxShadow: selectedTheme === 'lucu' ? '0 8px 24px rgba(236, 72, 153, 0.3)' : 'none'
                      }}
                    >
                      <div style={{ fontSize: '48px' }}>💖</div>
                      <div style={{
                        fontSize: '16px',
                        fontWeight: '700',
                        color: selectedTheme === 'lucu' ? '#EC4899' : colors.neutral.text
                      }}>
                        Pink Lucu
                      </div>
                      {selectedTheme === 'lucu' && (
                        <div style={{ fontSize: '14px', color: '#EC4899', fontWeight: '700' }}>
                          ✓ Aktif
                        </div>
                      )}
                    </button>
                  </div>
                </div>

                {/* Info Card */}
                <div style={{
                  background: colors.gradients.presidential,
                  borderRadius: '20px',
                  padding: '28px',
                  color: 'white'
                }}>
                  <h3 style={{
                    margin: '0 0 12px 0',
                    fontSize: '18px',
                    fontWeight: '700',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}>
                    💡 Informasi Sistem
                  </h3>
                  <p style={{ margin: '0 0 16px 0', fontSize: '14px', opacity: 0.9, lineHeight: '1.6' }}>
                    Pengaturan tema akan disimpan di browser Anda dan akan digunakan setiap kali membuka aplikasi.
                  </p>
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    padding: '16px',
                    fontSize: '13px',
                    lineHeight: '1.6'
                  }}>
                    <strong>Versi Aplikasi:</strong> ADMIRE v1.0.0<br/>
                    <strong>Build:</strong> Presidential Edition<br/>
                    <strong>Last Update:</strong> Oktober 2025
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div>
              <h2 style={{
                margin: '0 0 32px 0',
                fontSize: '28px',
                fontWeight: '900',
                color: colors.neutral.text
              }}>
                Ubah Password
              </h2>

              <div style={{ maxWidth: '700px' }}>
                {passwordError && (
                  <div style={{
                    background: '#FEE2E2',
                    border: '2px solid #FCA5A5',
                    borderRadius: '16px',
                    padding: '20px',
                    marginBottom: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px'
                  }}>
                    <span style={{ fontSize: '32px' }}>⚠️</span>
                    <span style={{ color: colors.primary.ruby, fontSize: '15px', fontWeight: '600' }}>
                      {passwordError}
                    </span>
                  </div>
                )}

                {passwordSuccess && (
                  <div style={{
                    background: '#D1FAE5',
                    border: '2px solid #6EE7B7',
                    borderRadius: '16px',
                    padding: '20px',
                    marginBottom: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px'
                  }}>
                    <span style={{ fontSize: '32px' }}>✅</span>
                    <span style={{ color: colors.primary.emerald, fontSize: '15px', fontWeight: '600' }}>
                      {passwordSuccess}
                    </span>
                  </div>
                )}

                <div style={{ display: 'grid', gap: '28px' }}>
                  {/* Current Password */}
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '15px',
                      fontWeight: '700',
                      color: colors.neutral.text,
                      marginBottom: '10px'
                    }}>
                      Password Saat Ini <span style={{ color: colors.primary.ruby }}>*</span>
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={showPasswords.current ? 'text' : 'password'}
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                        placeholder="Masukkan password saat ini"
                        disabled={isUpdatingPassword}
                        style={{
                          width: '100%',
                          padding: '16px 56px 16px 20px',
                          border: `2px solid ${colors.neutral.border}`,
                          borderRadius: '14px',
                          fontSize: '15px',
                          outline: 'none',
                          transition: 'all 0.2s',
                          boxSizing: 'border-box',
                          fontWeight: '500'
                        }}
                        onFocus={(e) => e.target.style.borderColor = colors.primary.darkBlue}
                        onBlur={(e) => e.target.style.borderColor = colors.neutral.border}
                      />
                      <button
                        onClick={() => setShowPasswords({...showPasswords, current: !showPasswords.current})}
                        style={{
                          position: 'absolute',
                          right: '16px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: '24px',
                          padding: '4px'
                        }}
                      >
                        {showPasswords.current ? '👁️' : '😴'}
                      </button>
                    </div>
                  </div>

                  {/* New Password */}
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '15px',
                      fontWeight: '700',
                      color: colors.neutral.text,
                      marginBottom: '10px'
                    }}>
                      Password Baru <span style={{ color: colors.primary.ruby }}>*</span>
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={showPasswords.new ? 'text' : 'password'}
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                        placeholder="Masukkan password baru"
                        disabled={isUpdatingPassword}
                        style={{
                          width: '100%',
                          padding: '16px 56px 16px 20px',
                          border: `2px solid ${colors.neutral.border}`,
                          borderRadius: '14px',
                          fontSize: '15px',
                          outline: 'none',
                          transition: 'all 0.2s',
                          boxSizing: 'border-box',
                          fontWeight: '500'
                        }}
                        onFocus={(e) => e.target.style.borderColor = colors.primary.darkBlue}
                        onBlur={(e) => e.target.style.borderColor = colors.neutral.border}
                      />
                      <button
                        onClick={() => setShowPasswords({...showPasswords, new: !showPasswords.new})}
                        style={{
                          position: 'absolute',
                          right: '16px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: '24px',
                          padding: '4px'
                        }}
                      >
                        {showPasswords.new ? '👁️' : '😴'}
                      </button>
                    </div>
                    <p style={{
                      margin: '10px 0 0 0',
                      fontSize: '13px',
                      color: colors.neutral.textLight,
                      lineHeight: '1.5'
                    }}>
                      Password minimal 8 karakter, kombinasi huruf besar, huruf kecil, dan angka
                    </p>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '15px',
                      fontWeight: '700',
                      color: colors.neutral.text,
                      marginBottom: '10px'
                    }}>
                      Konfirmasi Password Baru <span style={{ color: colors.primary.ruby }}>*</span>
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={showPasswords.confirm ? 'text' : 'password'}
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                        placeholder="Konfirmasi password baru"
                        disabled={isUpdatingPassword}
                        style={{
                          width: '100%',
                          padding: '16px 56px 16px 20px',
                          border: `2px solid ${colors.neutral.border}`,
                          borderRadius: '14px',
                          fontSize: '15px',
                          outline: 'none',
                          transition: 'all 0.2s',
                          boxSizing: 'border-box',
                          fontWeight: '500'
                        }}
                        onFocus={(e) => e.target.style.borderColor = colors.primary.darkBlue}
                        onBlur={(e) => e.target.style.borderColor = colors.neutral.border}
                      />
                      <button
                        onClick={() => setShowPasswords({...showPasswords, confirm: !showPasswords.confirm})}
                        style={{
                          position: 'absolute',
                          right: '16px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: '24px',
                          padding: '4px'
                        }}
                      >
                        {showPasswords.confirm ? '👁️' : '😴'}
                      </button>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div style={{ display: 'flex', gap: '16px', marginTop: '12px', flexWrap: 'wrap' }}>
                    <button
                      onClick={handlePasswordChange}
                      disabled={isUpdatingPassword}
                      style={{
                        flex: isMobile ? '1 1 100%' : '0 1 auto',
                        padding: '16px 32px',
                        background: isUpdatingPassword ? colors.neutral.textLight : colors.gradients.presidential,
                        color: 'white',
                        border: 'none',
                        borderRadius: '14px',
                        fontSize: '15px',
                        fontWeight: '700',
                        cursor: isUpdatingPassword ? 'not-allowed' : 'pointer',
                        transition: 'all 0.2s',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '10px',
                        boxShadow: !isUpdatingPassword ? '0 4px 16px rgba(15, 23, 42, 0.3)' : 'none'
                      }}
                    >
                      {isUpdatingPassword ? (
                        <>
                          <span style={{
                            width: '18px',
                            height: '18px',
                            border: '2px solid white',
                            borderTopColor: 'transparent',
                            borderRadius: '50%',
                            animation: 'spin 0.6s linear infinite'
                          }}></span>
                          Menyimpan...
                        </>
                      ) : (
                        <>
                          🔒 Ubah Password
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => {
                        setPasswordData({
                          currentPassword: '',
                          newPassword: '',
                          confirmPassword: ''
                        });
                        setPasswordError('');
                        setPasswordSuccess('');
                      }}
                      disabled={isUpdatingPassword}
                      style={{
                        flex: isMobile ? '1 1 100%' : '0 1 auto',
                        padding: '16px 32px',
                        background: 'white',
                        color: colors.neutral.textLight,
                        border: `2px solid ${colors.neutral.border}`,
                        borderRadius: '14px',
                        fontSize: '15px',
                        fontWeight: '700',
                        cursor: isUpdatingPassword ? 'not-allowed' : 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      Reset Form
                    </button>
                  </div>
                </div>
              </div>

              {/* Security Tips */}
              <div style={{
                marginTop: '48px',
                background: colors.neutral.bg,
                borderRadius: '20px',
                padding: isMobile ? '24px' : '32px',
                border: `2px solid ${colors.neutral.border}`
              }}>
                <h3 style={{
                  margin: '0 0 20px 0',
                  fontSize: '18px',
                  fontWeight: '700',
                  color: colors.neutral.text,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  🛡️ Tips Keamanan Password untuk Ketua
                </h3>
                <ul style={{
                  margin: 0,
                  paddingLeft: '24px',
                  color: colors.neutral.textLight,
                  fontSize: '14px',
                  lineHeight: '2',
                  fontWeight: '500'
                }}>
                  <li>Gunakan kombinasi huruf besar, huruf kecil, angka, dan simbol</li>
                  <li>Jangan gunakan informasi pribadi yang mudah ditebak</li>
                  <li>Ubah password secara berkala (minimal 3 bulan sekali)</li>
                  <li>Jangan gunakan password yang sama untuk berbagai akun</li>
                  <li>Gunakan password manager untuk menyimpan password dengan aman</li>
                  <li>Aktifkan autentikasi dua faktor jika tersedia</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SettingsPage;
