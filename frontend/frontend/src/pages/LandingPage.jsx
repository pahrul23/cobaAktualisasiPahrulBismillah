// Path: /frontend/src/pages/LandingPage.jsx - Modern Fintech Style
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
            background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
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
              color: '#1e293b',
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
          <nav style={{ display: 'flex', gap: '2rem' }}>
            {['How It Works', 'Features', 'About', 'Help'].map((item) => (
              <a
                key={item}
                href="#"
                style={{
                  color: '#64748b',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  transition: 'all 0.2s ease',
                  padding: '0.5rem 0'
                }}
                onMouseOver={(e) => e.target.style.color = '#1e293b'}
                onMouseOut={(e) => e.target.style.color = '#64748b'}
              >
                {item}
              </a>
            ))}
          </nav>

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <button style={{
              background: 'transparent',
              border: '1px solid #e2e8f0',
              color: '#64748b',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              fontSize: '0.875rem',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}>
              Sign In
            </button>
            
            <button
              onClick={handleLoginClick}
              style={{
                background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                border: 'none',
                color: 'white',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                fontSize: '0.875rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(139, 92, 246, 0.3)'
              }}
              onMouseOver={(e) => {
                e.target.style.transform = 'translateY(-1px)'
                e.target.style.boxShadow = '0 6px 20px rgba(139, 92, 246, 0.4)'
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'translateY(0)'
                e.target.style.boxShadow = '0 4px 15px rgba(139, 92, 246, 0.3)'
              }}
            >
              Sign Up
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
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(124, 58, 237, 0.1) 100%)',
            border: '1px solid rgba(139, 92, 246, 0.2)',
            borderRadius: '20px',
            padding: '0.5rem 1rem',
            display: 'inline-block',
            marginBottom: '2rem'
          }}>
            <span style={{
              color: '#7c3aed',
              fontSize: '0.875rem',
              fontWeight: '600'
            }}>
              🚀 ADMIRE
            </span>
          </div>

          <h1 style={{
            fontSize: '4rem',
            fontWeight: '800',
            color: '#1e293b',
            margin: '0 0 1.5rem 0',
            lineHeight: '1.1',
            letterSpacing: '-0.025em'
          }}>
            Digitalisasi Sistem
            <br />
            <span style={{
              background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Persuratan DPD RI
            </span>
          </h1>

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

          {/* Feature Points */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            marginBottom: '2.5rem'
          }}>
            {[
              'Proses persetujuan proposal yang efisien',
              'Manajemen surat masuk otomatis',
              'Dashboard analytics real-time'
            ].map((feature, index) => (
              <div key={index} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}>
                <div style={{
                  width: '20px',
                  height: '20px',
                  backgroundColor: '#10b981',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  color: 'white',
                  fontWeight: '700'
                }}>
                  ✓
                </div>
                <span style={{
                  color: '#374151',
                  fontSize: '0.875rem',
                  fontWeight: '500'
                }}>
                  {feature}
                </span>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div style={{
            display: 'flex',
            gap: '1rem',
            alignItems: 'center'
          }}>
            <button
              onClick={handleLoginClick}
              style={{
                background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                color: 'white',
                border: 'none',
                padding: '1rem 2rem',
                borderRadius: '12px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(139, 92, 246, 0.3)'
              }}
              onMouseOver={(e) => {
                e.target.style.transform = 'translateY(-2px)'
                e.target.style.boxShadow = '0 6px 20px rgba(139, 92, 246, 0.4)'
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'translateY(0)'
                e.target.style.boxShadow = '0 4px 15px rgba(139, 92, 246, 0.3)'
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
                backgroundColor: '#8b5cf6',
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
              See How It Works
            </button>
          </div>
        </div>

        {/* Right Illustration */}
        <div style={{
          flex: '1',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative'
        }}>
          
          {/* Main Card */}
          <div style={{
            position: 'relative',
            zIndex: 2
          }}>
            <div style={{
              width: '350px',
              height: '220px',
              background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
              borderRadius: '20px',
              padding: '2rem',
              color: 'white',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 20px 40px rgba(139, 92, 246, 0.3)'
            }}>
              
              {/* Card Content */}
              <div style={{
                position: 'relative',
                zIndex: 2
              }}>
                <h3 style={{
                  margin: '0 0 0.5rem 0',
                  fontSize: '1.5rem',
                  fontWeight: '700'
                }}>
                  ADMIRE System
                </h3>
                <p style={{
                  margin: '0 0 2rem 0',
                  fontSize: '0.875rem',
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
                      margin: '0 0 0.25rem 0',
                      fontSize: '0.75rem',
                      opacity: 0.8
                    }}>
                      Active Users
                    </p>
                    <p style={{
                      margin: 0,
                      fontSize: '1.25rem',
                      fontWeight: '700'
                    }}>
                      250+
                    </p>
                  </div>
                  
                  <div style={{
                    width: '40px',
                    height: '40px',
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.25rem'
                  }}>
                    🏛️
                  </div>
                </div>
              </div>

              {/* Decorative Elements */}
              <div style={{
                position: 'absolute',
                top: '-20px',
                right: '-20px',
                width: '100px',
                height: '100px',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '50%'
              }}></div>
              
              <div style={{
                position: 'absolute',
                bottom: '-30px',
                left: '-30px',
                width: '80px',
                height: '80px',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '50%'
              }}></div>
            </div>
          </div>

          {/* Floating Elements */}
          <div style={{
            position: 'absolute',
            top: '20%',
            left: '10%',
            zIndex: 1
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              backgroundColor: 'white',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
              fontSize: '1.5rem',
              animation: 'float 3s ease-in-out infinite'
            }}>
              📄
            </div>
          </div>

          <div style={{
            position: 'absolute',
            bottom: '20%',
            right: '10%',
            zIndex: 1
          }}>
            <div style={{
              width: '50px',
              height: '50px',
              backgroundColor: 'white',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 6px 20px rgba(0, 0, 0, 0.1)',
              fontSize: '1.25rem',
              animation: 'float 3s ease-in-out infinite 1s'
            }}>
              ✅
            </div>
          </div>

          <div style={{
            position: 'absolute',
            top: '50%',
            right: '5%',
            zIndex: 1
          }}>
            <div style={{
              width: '45px',
              height: '45px',
              backgroundColor: 'white',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
              fontSize: '1.125rem',
              animation: 'float 3s ease-in-out infinite 2s'
            }}>
              📊
            </div>
          </div>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div style={{
        padding: '4rem',
        backgroundColor: 'white'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          textAlign: 'center'
        }}>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: '700',
            color: '#1e293b',
            marginBottom: '1rem',
            letterSpacing: '-0.025em'
          }}>
            Mengapa Memilih ADMIRE?
          </h2>
          
          <p style={{
            fontSize: '1.125rem',
            color: '#64748b',
            marginBottom: '4rem',
            maxWidth: '600px',
            margin: '0 auto 4rem'
          }}>
            Sistem terintegrasi yang dirancang khusus untuk efisiensi operasional Sekretariat Ketua DPD RI
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '3rem'
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
                textAlign: 'center',
                padding: '2rem 1rem'
              }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  backgroundColor: `${index === 0 ? '#fef3c7' : index === 1 ? '#dbeafe' : '#dcfce7'}`,
                  borderRadius: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.5rem',
                  fontSize: '2rem'
                }}>
                  {feature.icon}
                </div>
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  color: '#1e293b',
                  marginBottom: '1rem'
                }}>
                  {feature.title}
                </h3>
                <p style={{
                  fontSize: '0.875rem',
                  color: '#64748b',
                  lineHeight: '1.6'
                }}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Organization Structure Section */}
      <div style={{
        padding: '4rem',
        backgroundColor: '#f8fafc'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          textAlign: 'center'
        }}>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: '700',
            color: '#1e293b',
            marginBottom: '1rem'
          }}>
            Struktur Organisasi
          </h2>
          <p style={{
            fontSize: '1.125rem',
            color: '#64748b',
            marginBottom: '3rem'
          }}>
            Sekretariat Ketua DPD RI
          </p>

          {/* Ketua */}
          <div style={{
            marginBottom: '3rem'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
              color: 'white',
              padding: '2rem',
              borderRadius: '16px',
              display: 'inline-block',
              minWidth: '300px'
            }}>
              <div style={{
                fontSize: '2rem',
                marginBottom: '1rem'
              }}>👑</div>
              <h3 style={{
                margin: '0 0 0.5rem 0',
                fontSize: '1.25rem',
                fontWeight: '700'
              }}>
                Ketua DPD RI
              </h3>
            </div>
          </div>

          {/* Sub Structure */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '2rem',
            marginBottom: '3rem'
          }}>
            <div style={{
              background: 'white',
              padding: '2rem',
              borderRadius: '16px',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)'
            }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>📄</div>
              <h4 style={{
                margin: '0 0 0.5rem 0',
                fontSize: '1.125rem',
                fontWeight: '600',
                color: '#1e293b'
              }}>
                Sub Bagian Materi
              </h4>
              <p style={{
                margin: 0,
                fontSize: '0.875rem',
                color: '#64748b'
              }}>
                Sekretariat Ketua DPD RI
              </p>
            </div>

            <div style={{
              background: 'white',
              padding: '2rem',
              borderRadius: '16px',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)'
            }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>🏠</div>
              <h4 style={{
                margin: '0 0 0.5rem 0',
                fontSize: '1.125rem',
                fontWeight: '600',
                color: '#1e293b'
              }}>
                Sub Bagian Tata Usaha
              </h4>
              <p style={{
                margin: 0,
                fontSize: '0.875rem',
                color: '#64748b'
              }}>
                Sekretariat Ketua DPD RI
              </p>
            </div>
          </div>

          {/* Staff Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: '1rem'
          }}>
            {Array.from({ length: 10 }, (_, i) => (
              <div key={i} style={{
                background: 'white',
                padding: '1.5rem 1rem',
                borderRadius: '12px',
                textAlign: 'center',
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)'
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.05)'
              }}
              >
                <div style={{
                  width: '40px',
                  height: '40px',
                  backgroundColor: '#f1f5f9',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem',
                  fontSize: '1rem'
                }}>
                  👤
                </div>
                <h5 style={{
                  margin: '0 0 0.25rem 0',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#1e293b'
                }}>
                  Staf {i + 1}
                </h5>
                <p style={{
                  margin: 0,
                  fontSize: '0.75rem',
                  color: '#64748b'
                }}>
                  Sekretariat
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div style={{
        padding: '4rem',
        background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
        color: 'white',
        textAlign: 'center'
      }}>
        <h2 style={{
          fontSize: '2.5rem',
          fontWeight: '700',
          marginBottom: '1rem'
        }}>
          Siap Menggunakan ADMIRE?
        </h2>
        <p style={{
          fontSize: '1.25rem',
          marginBottom: '2rem',
          opacity: 0.9
        }}>
          Bergabunglah dengan digitalisasi terdepan DPD RI
        </p>
        <button
          onClick={handleLoginClick}
          style={{
            background: 'white',
            color: '#7c3aed',
            border: 'none',
            padding: '1rem 2rem',
            borderRadius: '12px',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
        >
          Mulai Sekarang →
        </button>
      </div>

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