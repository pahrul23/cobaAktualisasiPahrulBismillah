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
          </div>
        </div>

        {/* Right Illustration - MODIFIED */}
        <div style={{
          flex: '1.3',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          padding: '0 2rem'
        }}>
          
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
              
              <div style={{
                position: 'relative',
                zIndex: 2
              }}>
                <h3 style={{
                  margin: '0 0 0.75rem 0',
                  fontSize: '2rem',
                  fontWeight: '800'
                }}>
                  ADMIRE SYSTEM
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
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                  <div style={{
                    width: '80px',
                    height: '80px',
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2.5rem'
                  }}>
                    🏛️
                  </div>
                </div>
              </div>

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
      {/* Struktur Organisasi Section - REDESIGNED MODERN & CREATIVE */}
      <div style={{
        padding: '6rem 4rem',
        background: 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 50%, #10b981 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Animated Background Elements */}
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
          maxWidth: '1400px',
          margin: '0 auto',
          position: 'relative',
          zIndex: 2
        }}>
          {/* Header */}
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
                👥 Tim Kami
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
              Struktur Organisasi
              <br />
              <span style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                Sekretariat Ketua DPD RI
              </span>
            </h2>
          </div>

          {/* Kepala Bagian - TOP CARD */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '3rem'
          }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.25)',
              backdropFilter: 'blur(20px)',
              borderRadius: '24px',
              padding: '2.5rem 3rem',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              maxWidth: '450px',
              width: '100%',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Shine Effect */}
              <div style={{
                position: 'absolute',
                top: '-50%',
                left: '-50%',
                width: '200%',
                height: '200%',
                background: 'linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.1) 50%, transparent 70%)',
                transform: 'rotate(45deg)'
              }}></div>
              
              <div style={{ position: 'relative', zIndex: 2 }}>
                {/* Photo Placeholder */}
                <div style={{
                  width: '120px',
                  height: '120px',
                  background: 'linear-gradient(135deg, #fff 0%, #f0f0f0 100%)',
                  borderRadius: '50%',
                  margin: '0 auto 1.5rem',
                  border: '4px solid rgba(255, 255, 255, 0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '3rem',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)'
                }}>
                  👤
                </div>
                
                <div style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: '12px',
                  padding: '0.5rem 1rem',
                  marginBottom: '1rem',
                  textAlign: 'center'
                }}>
                  <p style={{
                    color: 'white',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    margin: 0,
                    textTransform: 'uppercase',
                    letterSpacing: '1px'
                  }}>
                    Kepala Bagian Sekretariat Ketua DPD RI
                  </p>
                </div>
                
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  color: 'white',
                  margin: '0 0 0.5rem 0',
                  textAlign: 'center',
                  letterSpacing: '-0.025em'
                }}>
                  MOHAMMAD IKHSAN DEDY HASIBUAN
                </h3>
                
                <p style={{
                  fontSize: '0.875rem',
                  color: 'rgba(255, 255, 255, 0.8)',
                  textAlign: 'center',
                  margin: 0,
                  fontWeight: '500'
                }}>
                  NIP: 197305251993031001
                </p>
              </div>
            </div>
          </div>

          {/* Kepala Sub Bagian - 2 CARDS */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '2rem',
            marginBottom: '3rem',
            maxWidth: '1000px',
            margin: '0 auto 3rem'
          }}>
            {/* Kepala Sub Bag 1 */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(20px)',
              borderRadius: '20px',
              padding: '2rem',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              transition: 'all 0.3s ease',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)'
              e.currentTarget.style.boxShadow = '0 15px 40px rgba(0, 0, 0, 0.2)'
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = 'none'
            }}
            >
              <div style={{
                width: '90px',
                height: '90px',
                background: 'linear-gradient(135deg, #fff 0%, #f0f0f0 100%)',
                borderRadius: '50%',
                margin: '0 auto 1.5rem',
                border: '3px solid rgba(255, 255, 255, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2.5rem'
              }}>
                👤
              </div>
              
              <div style={{
                background: 'rgba(255, 255, 255, 0.15)',
                borderRadius: '8px',
                padding: '0.4rem 0.8rem',
                marginBottom: '1rem',
                textAlign: 'center'
              }}>
                <p style={{
                  color: 'white',
                  fontSize: '0.7rem',
                  fontWeight: '600',
                  margin: 0,
                  textTransform: 'uppercase'
                }}>
                  Kepala Sub Bagian Tata Usaha
                </p>
              </div>
              
              <h4 style={{
                fontSize: '1.25rem',
                fontWeight: '700',
                color: 'white',
                margin: '0 0 0.5rem 0',
                textAlign: 'center'
              }}>
                DIYAH TRI IRAWATI
              </h4>
              
              <p style={{
                fontSize: '0.8rem',
                color: 'rgba(255, 255, 255, 0.8)',
                textAlign: 'center',
                margin: 0
              }}>
                NIP: 198101172009112001
              </p>
            </div>

            {/* Kepala Sub Bag 2 */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(20px)',
              borderRadius: '20px',
              padding: '2rem',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              transition: 'all 0.3s ease',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)'
              e.currentTarget.style.boxShadow = '0 15px 40px rgba(0, 0, 0, 0.2)'
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = 'none'
            }}
            >
              <div style={{
                width: '90px',
                height: '90px',
                background: 'linear-gradient(135deg, #fff 0%, #f0f0f0 100%)',
                borderRadius: '50%',
                margin: '0 auto 1.5rem',
                border: '3px solid rgba(255, 255, 255, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2.5rem'
              }}>
                👤
              </div>
              
              <div style={{
                background: 'rgba(255, 255, 255, 0.15)',
                borderRadius: '8px',
                padding: '0.4rem 0.8rem',
                marginBottom: '1rem',
                textAlign: 'center'
              }}>
                <p style={{
                  color: 'white',
                  fontSize: '0.7rem',
                  fontWeight: '600',
                  margin: 0,
                  textTransform: 'uppercase'
                }}>
                  Kepala Sub Bagian Penyiapan Materi
                </p>
              </div>
              
              <h4 style={{
                fontSize: '1.25rem',
                fontWeight: '700',
                color: 'white',
                margin: '0 0 0.5rem 0',
                textAlign: 'center'
              }}>
                GITA PRISSANDI
              </h4>
              
              <p style={{
                fontSize: '0.8rem',
                color: 'rgba(255, 255, 255, 0.8)',
                textAlign: 'center',
                margin: 0
              }}>
                NIP: 198411232008011001
              </p>
            </div>
          </div>

          {/* STAF Section Header */}
          <div style={{
            textAlign: 'center',
            marginBottom: '2.5rem'
          }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '20px',
              padding: '0.75rem 2rem',
              display: 'inline-block'
            }}>
              <span style={{
                color: 'white',
                fontSize: '1.25rem',
                fontWeight: '700',
                letterSpacing: '2px'
              }}>
                ⭐ STAF PELAKSANA
              </span>
            </div>
          </div>

          {/* STAF Grid - 4 columns modern cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '1.5rem'
          }}>
            {[
              { nama: 'FABBIOLA MAUREEN', nip: '198502172011012010' },
              { nama: 'RAMA MAHESA', nip: '198505032015031002' },
              { nama: 'ALFYANDA SHIRLEY', nip: '199804152022032011' },
              { nama: 'NADIRA SWANDANI', nip: '199706062022032008' },
              { nama: 'LINDA BR GINTING', nip: '199601032022032012' },
              { nama: 'SIGIT KAMSENO', nip: '198208272007101002' },
              { nama: 'GIGIH SIBADIO', nip: '199009222025211013' },
              { nama: 'PAHRUL', nip: '200107282025061004' },
              { nama: 'AZIS DIYANTO PRAMUNDITO', nip: '200005272025061004' },
              { nama: 'BAIQ TIARA LOVYSAMINA ZAHIR', nip: '199708152025062004' },
              { nama: 'LEONARD RODRIQUE OME', nip: '200104062025061005' },
              { nama: 'DIDIN ARDIANSYAH PRAYOGO', nip: '200105232025061008' }
            ].map((staf, index) => (
              <div key={index} style={{
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(15px)',
                borderRadius: '16px',
                padding: '1.5rem 1rem',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                transition: 'all 0.3s ease',
                textAlign: 'center'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)'
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)'
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'scale(1)'
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)'
              }}
              >
                <div style={{
                  width: '70px',
                  height: '70px',
                  background: 'linear-gradient(135deg, #fff 0%, #e0e0e0 100%)',
                  borderRadius: '50%',
                  margin: '0 auto 1rem',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2rem'
                }}>
                  👤
                </div>
                
                <h5 style={{
                  fontSize: '0.875rem',
                  fontWeight: '700',
                  color: 'white',
                  margin: '0 0 0.5rem 0',
                  lineHeight: '1.3'
                }}>
                  {staf.nama}
                </h5>
                
                <p style={{
                  fontSize: '0.7rem',
                  color: 'rgba(255, 255, 255, 0.75)',
                  margin: 0,
                  fontFamily: 'monospace'
                }}>
                  {staf.nip}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section - MODIFIED */}
      <div style={{
        padding: '5rem 4rem',
        background: 'linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 50%, #94a3b8 100%)',
        color: '#0f172a',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
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
            Siap Bergabung dengan ADMIRE?
          </h2>
          <p style={{
            fontSize: '1.25rem',
            marginBottom: '2.5rem',
            color: '#64748b',
            lineHeight: '1.6'
          }}>
            Wujudkan transformasi digital dalam pengelolaan administrasi persuratan di Sekretariat Ketua DPD RI
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

      {/* Footer */}
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
            Dikembangkan oleh <strong style={{ color: '#e2e8f0' }}>Pahrul</strong> CPNS Penata Kelola Sistem dan Teknologi Informasi - Bagian Pengelolaan Sistem Informasi Biro Sindok Setjen <strong style={{ color: '#0ea5e9' }}>DPD RI</strong>
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


