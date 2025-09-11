import React from 'react'

const LandingPage = () => {
  const handleLoginClick = () => {
    window.location.href = '/login'
  }

  return (
    <div style={{
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 25%, #f1f5f9 75%, #ffffff 100%)',
      minHeight: '100vh',
      position: 'relative'
    }}>
      
      {/* Navigation Header */}
      <nav style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1.5rem 4rem',
        position: 'relative',
        zIndex: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(226, 232, 240, 0.5)'
      }}>
        {/* Logo */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            background: 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 50%, #10b981 100%)',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.25rem',
            color: 'white',
            fontWeight: '700'
          }}>
            A
          </div>
          <div>
            <h2 style={{
              margin: 0,
              color: '#0f172a',
              fontSize: '1.25rem',
              fontWeight: '700',
              letterSpacing: '-0.025em'
            }}>
              ADMIRE
            </h2>
          </div>
        </div>

        {/* Navigation Menu */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '2rem'
        }}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <button 
              onClick={handleLoginClick}
              style={{
                background: 'transparent',
                border: '1px solid #e2e8f0',
                color: '#64748b',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                fontSize: '0.875rem',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              Sign In
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        padding: '4rem',
        maxWidth: '1400px',
        margin: '0 auto',
        minHeight: '80vh'
      }}>
        
        {/* Left Content */}
        <div style={{
          flex: '1',
          paddingRight: '4rem'
        }}>
          
          {/* Badge */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.1) 0%, rgba(6, 182, 212, 0.1) 100%)',
            border: '1px solid rgba(14, 165, 233, 0.2)',
            borderRadius: '20px',
            padding: '0.5rem 1rem',
            display: 'inline-block',
            marginBottom: '2rem'
          }}>
            <span style={{
              color: '#0ea5e9',
              fontSize: '0.875rem',
              fontWeight: '600'
            }}>
              🚀 ADMIRE
            </span>
          </div>

          <h1 style={{
            fontSize: '4rem',
            fontWeight: '800',
            color: '#0f172a',
            margin: '0 0 1.5rem 0',
            lineHeight: '1.1',
            letterSpacing: '-0.025em'
          }}>
            Digitalisasi Sistem
            <br />
            <span style={{
              background: 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 50%, #10b981 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Persuratan Sekretariat Ketua DPD RI
            </span>
          </h1>x

          <p style={{
            fontSize: '1.25rem',
            color: '#64748b',
            margin: '0 0 2rem 0',
            lineHeight: '1.7',
            fontWeight: '400',
            maxWidth: '500px'
          }}>
            Administrative Mail and Information Record for Efficiency (ADMIRE) - 
            Solusi inovatif untuk mengelola surat, proposal, dan agenda secara digital di Sekretariat Ketua DPD RI.
          </p>

          {/* CTA Buttons */}
          <div style={{
            display: 'flex',
            gap: '1rem',
            alignItems: 'center'
          }}>
            <button
              onClick={handleLoginClick}
              style={{
                background: 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 50%, #10b981 100%)',
                color: 'white',
                border: 'none',
                padding: '1rem 2rem',
                borderRadius: '12px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(14, 165, 233, 0.3)'
              }}
              onMouseOver={(e) => {
                e.target.style.transform = 'translateY(-2px)'
                e.target.style.boxShadow = '0 6px 20px rgba(14, 165, 233, 0.4)'
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'translateY(0)'
                e.target.style.boxShadow = '0 4px 15px rgba(14, 165, 233, 0.3)'
              }}
            >
              Akses Sistem
            </button>

            <button style={{
              background: 'transparent',
              color: '#64748b',
              border: '2px solid #e2e8f0',
              padding: '1rem 2rem',
              borderRadius: '12px',
              fontSize: '1rem',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <div style={{
                width: '16px',
                height: '16px',
                backgroundColor: '#0ea5e9',
                borderRadius: '50%',
                position: 'relative'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '0',
                  height: '0',
                  borderLeft: '4px solid white',
                  borderTop: '3px solid transparent',
                  borderBottom: '3px solid transparent',
                  marginLeft: '1px'
                }}></div>
              </div>
              {/* See How It Works */}
            </button>
          </div>
        </div>

        {/* Right Illustration - ENLARGED */}
        <div style={{
          flex: '1.3',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          padding: '0 2rem'
        }}>
          
          {/* Main Card - BIGGER */}
          <div style={{
            position: 'relative',
            zIndex: 2,
            transform: 'scale(1.3)'
          }}>
            <div style={{
              width: '420px',
              height: '280px',
              background: 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 50%, #10b981 100%)',
              borderRadius: '24px',
              padding: '2.5rem',
              color: 'white',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 25px 50px rgba(14, 165, 233, 0.4)'
            }}>
              
              {/* Card Content */}
              <div style={{
                position: 'relative',
                zIndex: 2
              }}>
                <h3 style={{
                  margin: '0 0 0.75rem 0',
                  fontSize: '2rem',
                  fontWeight: '800'
                }}>
                  ADMIRE System
                </h3>
                <p style={{
                  margin: '0 0 2.5rem 0',
                  fontSize: '1rem',
                  opacity: 0.9
                }}>
                  Sekretariat Ketua DPD RI
                </p>
                
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <p style={{
                      margin: '0 0 0.5rem 0',
                      fontSize: '0.875rem',
                      opacity: 0.8
                    }}>
                      Active Users
                    </p>
                    <p style={{
                      margin: 0,
                      fontSize: '1.75rem',
                      fontWeight: '800'
                    }}>
                      250+
                    </p>
                  </div>
                  
                  <div style={{
                    width: '50px',
                    height: '50px',
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem'
                  }}>
                    🏛️
                  </div>
                </div>
              </div>

              {/* Decorative Elements - BIGGER */}
              <div style={{
                position: 'absolute',
                top: '-30px',
                right: '-30px',
                width: '150px',
                height: '150px',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '50%'
              }}></div>
              
              <div style={{
                position: 'absolute',
                bottom: '-40px',
                left: '-40px',
                width: '120px',
                height: '120px',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '50%'
              }}></div>
            </div>
          </div>

          {/* Floating Elements - BIGGER */}
          <div style={{
            position: 'absolute',
            top: '15%',
            left: '5%',
            zIndex: 1
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              backgroundColor: 'white',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 12px 30px rgba(0, 0, 0, 0.15)',
              fontSize: '2rem',
              animation: 'float 3s ease-in-out infinite'
            }}>
              📄
            </div>
          </div>

          <div style={{
            position: 'absolute',
            bottom: '15%',
            right: '5%',
            zIndex: 1
          }}>
            <div style={{
              width: '70px',
              height: '70px',
              backgroundColor: 'white',
              borderRadius: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
              fontSize: '1.75rem',
              animation: 'float 3s ease-in-out infinite 1s'
            }}>
              ✅
            </div>
          </div>

          <div style={{
            position: 'absolute',
            top: '50%',
            right: '0%',
            zIndex: 1
          }}>
            <div style={{
              width: '65px',
              height: '65px',
              backgroundColor: 'white',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)',
              fontSize: '1.5rem',
              animation: 'float 3s ease-in-out infinite 2s'
            }}>
              📊
            </div>
          </div>
        </div>
      </div>

      {/* Why Choose Us Section - REDESIGNED WITH GRADIENT BACKGROUND */}
      <div style={{
        padding: '6rem 4rem',
        background: 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 50%, #10b981 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Floating Decorative Shapes */}
        <div style={{
          position: 'absolute',
          top: '10%',
          left: '5%',
          width: '100px',
          height: '100px',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
          animation: 'float 6s ease-in-out infinite'
        }}></div>
        
        <div style={{
          position: 'absolute',
          top: '60%',
          right: '10%',
          width: '80px',
          height: '80px',
          background: 'rgba(255, 255, 255, 0.08)',
          borderRadius: '50%',
          animation: 'float 4s ease-in-out infinite 2s'
        }}></div>
        
        <div style={{
          position: 'absolute',
          bottom: '20%',
          left: '15%',
          width: '60px',
          height: '60px',
          background: 'rgba(255, 255, 255, 0.06)',
          borderRadius: '20px',
          transform: 'rotate(45deg)',
          animation: 'float 5s ease-in-out infinite 1s'
        }}></div>
        
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          position: 'relative',
          zIndex: 2
        }}>
          {/* Header Section */}
          <div style={{
            textAlign: 'center',
            marginBottom: '4rem'
          }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '30px',
              padding: '0.75rem 2rem',
              display: 'inline-block',
              marginBottom: '2rem'
            }}>
              <span style={{
                color: 'white',
                fontSize: '0.875rem',
                fontWeight: '600'
              }}>
                ✨ Keunggulan Sistem
              </span>
            </div>
            
            <h2 style={{
              fontSize: '3.5rem',
              fontWeight: '800',
              color: 'white',
              marginBottom: '1.5rem',
              letterSpacing: '-0.025em',
              lineHeight: '1.1',
              textShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
            }}>
              Mengapa Memilih
              <br />
              <span style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                ADMIRE?
              </span>
            </h2>
            
            <p style={{
              fontSize: '1.25rem',
              color: 'rgba(255, 255, 255, 0.9)',
              maxWidth: '700px',
              margin: '0 auto',
              lineHeight: '1.6'
            }}>
              Sistem terintegrasi yang dirancang khusus untuk efisiensi operasional Sekretariat Ketua DPD RI
            </p>
          </div>

          {/* Features Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '2rem'
          }}>
            {[
              {
                icon: '⚡',
                title: 'Proses Cepat',
                description: 'Otomatisasi proses persetujuan dan pengelolaan surat untuk efisiensi maksimal'
              },
              {
                icon: '🔒',
                title: '100% Aman',
                description: 'Keamanan data tingkat enterprise dengan enkripsi dan backup otomatis'
              },
              {
                icon: '📱',
                title: 'Mudah Digunakan',
                description: 'Interface intuitif yang dapat diakses dari berbagai perangkat dan platform'
              }
            ].map((feature, index) => (
              <div key={index} style={{
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(20px)',
                borderRadius: '24px',
                padding: '3rem 2.5rem',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                transition: 'all 0.4s ease',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-10px)'
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)'
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.4)'
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)'
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)'
              }}
              >
                {/* Shine Effect */}
                <div style={{
                  position: 'absolute',
                  top: '-50%',
                  left: '-50%',
                  width: '200%',
                  height: '200%',
                  background: 'linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.1) 50%, transparent 70%)',
                  transform: 'rotate(45deg)',
                  transition: 'all 0.6s ease'
                }}></div>
                
                {/* Icon */}
                <div style={{
                  width: '80px',
                  height: '80px',
                  background: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2.5rem',
                  marginBottom: '2rem',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.3)'
                }}>
                  {feature.icon}
                </div>
                
                <h3 style={{
                  fontSize: '1.75rem',
                  fontWeight: '700',
                  color: 'white',
                  marginBottom: '1rem',
                  letterSpacing: '-0.025em'
                }}>
                  {feature.title}
                </h3>
                
                <p style={{
                  fontSize: '1rem',
                  color: 'rgba(255, 255, 255, 0.9)',
                  lineHeight: '1.6',
                  margin: 0
                }}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section - CHANGED TO GRAY BACKGROUND */}
      <div style={{
        padding: '5rem 4rem',
        background: 'linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 50%, #94a3b8 100%)',
        color: '#0f172a',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background Pattern */}
        <div style={{
          position: 'absolute',
          top: '0',
          left: '0',
          right: '0',
          bottom: '0',
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.2) 0%, transparent 50%),
                           radial-gradient(circle at 75% 75%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)`,
          zIndex: 1
        }}></div>
        
        <div style={{
          position: 'relative',
          zIndex: 2,
          maxWidth: '800px',
          margin: '0 auto'
        }}>
          <h2 style={{
            fontSize: '3rem',
            fontWeight: '800',
            marginBottom: '1rem',
            letterSpacing: '-0.025em',
            color: '#0f172a'
          }}>
            Siap Menggunakan ADMIRE?
          </h2>
          <p style={{
            fontSize: '1.25rem',
            marginBottom: '2.5rem',
            color: '#64748b',
            lineHeight: '1.6'
          }}>
            Bergabunglah dengan digitalisasi terdepan DPD RI dan rasakan efisiensi yang sesungguhnya
          </p>
          <button
            onClick={handleLoginClick}
            style={{
              background: 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 50%, #10b981 100%)',
              color: 'white',
              border: 'none',
              padding: '1.25rem 2.5rem',
              borderRadius: '12px',
              fontSize: '1.125rem',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 20px rgba(14, 165, 233, 0.3)'
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'translateY(-2px)'
              e.target.style.boxShadow = '0 8px 25px rgba(14, 165, 233, 0.4)'
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0)'
              e.target.style.boxShadow = '0 4px 20px rgba(14, 165, 233, 0.3)'
            }}
          >
            Mulai Sekarang →
          </button>
        </div>
      </div>

      {/* Footer - Developer Credits */}
      <footer style={{
        padding: '3rem 4rem 2rem',
        backgroundColor: '#0f172a',
        color: '#64748b',
        textAlign: 'center',
        borderTop: '1px solid #1e293b'
      }}>
        <div style={{
          maxWidth: '800px',
          margin: '0 auto'
        }}>
          <p style={{
            fontSize: '0.875rem',
            lineHeight: '1.6',
            margin: 0,
            color: '#94a3b8'
          }}>
            Dikembangkan oleh <strong style={{ color: '#e2e8f0' }}>Pahrul</strong> CPNS Penata Kelola Sistem dan Teknologi Informasi dan Bagian Pengelolaan Sistem Informasi Biro Sindok Setjen <strong style={{ color: '#0ea5e9' }}>DPD RI</strong>
          </p>
        </div>
      </footer>

      <style>{`
        @keyframes float {
          0%, 100% { 
            transform: translateY(0px); 
          }
          50% { 
            transform: translateY(-10px); 
          }
        }
      `}</style>
    </div>
  )
}

export default LandingPage
