// Path: /frontend/src/pages/Executive/KetuaDashboard.jsx
import React, { useState, useEffect } from 'react'
import useAuth from '../../hooks/useAuth'

const KetuaDashboard = () => {
  const { user, logout } = useAuth()
  const [suratSummary, setSuratSummary] = useState(null)
  const [proposals, setProposals] = useState([])
  const [undangan, setUndangan] = useState([])
  const [notifications, setNotifications] = useState([])
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7))
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('week')

  useEffect(() => {
    fetchDashboardData()
  }, [selectedMonth])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      
      const suratResponse = await fetch(`http://localhost:4000/api/executive/surat-summary?month=${selectedMonth}`)
      const suratData = await suratResponse.json()
      if (suratData.success) {
        setSuratSummary(suratData.data)
      }

      const proposalResponse = await fetch('http://localhost:4000/api/executive/proposals')
      const proposalData = await proposalResponse.json()
      if (proposalData.success) {
        setProposals(proposalData.data)
      }

      const undanganResponse = await fetch('http://localhost:4000/api/executive/undangan')
      const undanganData = await undanganResponse.json()
      if (undanganData.success) {
        setUndangan(undanganData.data)
      }

      const notifResponse = await fetch('http://localhost:4000/api/executive/notifications')
      const notifData = await notifResponse.json()
      if (notifData.success) {
        setNotifications(notifData.data.notifications)
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    window.location.href = '/login'
  }

  const handleProposalDecision = async (proposalId, keputusan, nominalBantuan, catatan) => {
    try {
      const response = await fetch(`http://localhost:4000/api/executive/proposals/${proposalId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          keputusan,
          nominal_bantuan: nominalBantuan,
          catatan_ketua: catatan
        })
      })

      const data = await response.json()
      if (data.success) {
        alert('Decision saved successfully')
        fetchDashboardData()
      }
    } catch (error) {
      console.error('Error updating proposal:', error)
    }
  }

  const handleAttendanceUpdate = async (letterId, statusKehadiran, catatan) => {
    try {
      const response = await fetch(`http://localhost:4000/api/executive/undangan/${letterId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status_kehadiran: statusKehadiran,
          catatan_ketua: catatan
        })
      })

      const data = await response.json()
      if (data.success) {
        alert('Attendance status updated')
        fetchDashboardData()
      }
    } catch (error) {
      console.error('Error updating attendance:', error)
    }
  }

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#f8fdfb',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: '4px solid #e5f7f3',
            borderTop: '4px solid #4ade80',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }}></div>
          <h3 style={{ color: '#065f46', fontSize: '1.125rem', fontWeight: '500' }}>Loading Dashboard...</h3>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: '#f8fdfb',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
    }}>
      
      {/* Sidebar */}
      <div style={{
        width: '280px',
        background: 'linear-gradient(180deg, #059669 0%, #047857 100%)',
        color: 'white',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Decorative Background */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          opacity: 0.3
        }}></div>
        
        <div style={{ position: 'relative', zIndex: 1, padding: '2rem' }}>
          {/* Logo */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            marginBottom: '3rem'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.25rem'
            }}>
              🏛️
            </div>
            <div>
              <h2 style={{
                margin: 0,
                fontSize: '1.25rem',
                fontWeight: '700',
                letterSpacing: '-0.025em'
              }}>
                DPD RI
              </h2>
              <p style={{
                margin: 0,
                fontSize: '0.75rem',
                opacity: 0.8
              }}>
                Executive Portal
              </p>
            </div>
          </div>

          {/* Navigation */}
          <nav style={{ marginBottom: '3rem' }}>
            {[
              { icon: '📊', label: 'Dashboard', active: true },
              { icon: '💰', label: 'Proposals', count: proposals.length },
              { icon: '📅', label: 'Meetings', count: undangan.length },
              { icon: '📄', label: 'Documents' },
              { icon: '⚙️', label: 'Settings' },
              { icon: '📊', label: 'Analytics' }
            ].map((item, index) => (
              <div key={index} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.75rem 1rem',
                borderRadius: '12px',
                marginBottom: '0.5rem',
                backgroundColor: item.active ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ fontSize: '1.125rem' }}>{item.icon}</span>
                  <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>{item.label}</span>
                </div>
                {item.count && (
                  <span style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '6px',
                    minWidth: '1.5rem',
                    textAlign: 'center'
                  }}>
                    {item.count}
                  </span>
                )}
              </div>
            ))}
          </nav>

          {/* User Profile */}
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            padding: '1rem',
            marginBottom: '2rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <div style={{
                width: '40px',
                height: '40px',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.125rem'
              }}>
                👤
              </div>
              <div>
                <h4 style={{
                  margin: 0,
                  fontSize: '0.875rem',
                  fontWeight: '600'
                }}>
                  {user?.name}
                </h4>
                <p style={{
                  margin: 0,
                  fontSize: '0.75rem',
                  opacity: 0.8,
                  textTransform: 'capitalize'
                }}>
                  {user?.role} DPD RI
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              style={{
                width: '100%',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: 'white',
                padding: '0.5rem',
                borderRadius: '8px',
                fontSize: '0.75rem',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'}
              onMouseOut={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        flex: 1,
        padding: '2rem',
        overflowY: 'auto'
      }}>
        
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem'
        }}>
          <div>
            <h1 style={{
              margin: 0,
              fontSize: '2rem',
              fontWeight: '700',
              color: '#065f46',
              letterSpacing: '-0.025em'
            }}>
              Executive Overview
            </h1>
            <p style={{
              margin: '0.25rem 0 0 0',
              color: '#6b7280',
              fontSize: '0.875rem'
            }}>
              Welcome back, let's review today's insights
            </p>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
          }}>
            <div style={{
              backgroundColor: 'white',
              border: '1px solid #d1d5db',
              borderRadius: '12px',
              padding: '0.5rem 1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Search or type command</span>
              <div style={{
                width: '20px',
                height: '20px',
                backgroundColor: '#f3f4f6',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem',
                color: '#6b7280'
              }}>
                🔍
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <div style={{
                width: '40px',
                height: '40px',
                backgroundColor: 'white',
                border: '1px solid #d1d5db',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}>
                ⚙️
              </div>
              <div style={{
                width: '40px',
                height: '40px',
                backgroundColor: 'white',
                border: '1px solid #d1d5db',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}>
                🔔
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards Row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: '2rem',
          marginBottom: '2rem'
        }}>
          
          {/* Main Stats Card */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '20px',
            padding: '2rem',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            border: '1px solid #f3f4f6'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '1.5rem'
            }}>
              <div>
                <h3 style={{
                  margin: 0,
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  color: '#111827'
                }}>
                  Letters Overview
                </h3>
                <p style={{
                  margin: '0.25rem 0 0 0',
                  fontSize: '0.875rem',
                  color: '#6b7280'
                }}>
                  Monthly summary
                </p>
              </div>
              
              <select 
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '8px',
                  border: '1px solid #d1d5db',
                  fontSize: '0.875rem',
                  backgroundColor: 'white',
                  cursor: 'pointer'
                }}
              >
                <option value="2025-09">September 2025</option>
                <option value="2025-08">August 2025</option>
                <option value="2025-07">July 2025</option>
              </select>
            </div>

            {/* Balance Display */}
            <div style={{
              background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
              borderRadius: '16px',
              padding: '1.5rem',
              color: 'white',
              position: 'relative',
              overflow: 'hidden',
              marginBottom: '1.5rem'
            }}>
              <div style={{
                position: 'absolute',
                top: '-50px',
                right: '-50px',
                width: '100px',
                height: '100px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '50%'
              }}></div>
              
              <div style={{ position: 'relative', zIndex: 1 }}>
                <p style={{
                  margin: '0 0 0.5rem 0',
                  fontSize: '0.875rem',
                  opacity: 0.9
                }}>
                  Total Letters
                </p>
                <h2 style={{
                  margin: '0 0 0.5rem 0',
                  fontSize: '2.5rem',
                  fontWeight: '700'
                }}>
                  {suratSummary?.total || 0}
                </h2>
                <p style={{
                  margin: 0,
                  fontSize: '0.75rem',
                  opacity: 0.8
                }}>
                  This month
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '1rem'
            }}>
              <div style={{
                backgroundColor: '#f0fdf4',
                border: '1px solid #bbf7d0',
                borderRadius: '12px',
                padding: '1rem',
                textAlign: 'center',
                cursor: 'pointer'
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  backgroundColor: '#22c55e',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 0.5rem',
                  color: 'white',
                  fontSize: '1.125rem'
                }}>
                  📄
                </div>
                <h4 style={{
                  margin: '0 0 0.25rem 0',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#065f46'
                }}>
                  View Details
                </h4>
                <p style={{
                  margin: 0,
                  fontSize: '0.75rem',
                  color: '#16a34a'
                }}>
                  All letters
                </p>
              </div>

              <div style={{
                backgroundColor: '#eff6ff',
                border: '1px solid #bfdbfe',
                borderRadius: '12px',
                padding: '1rem',
                textAlign: 'center',
                cursor: 'pointer'
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  backgroundColor: '#3b82f6',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 0.5rem',
                  color: 'white',
                  fontSize: '1.125rem'
                }}>
                  📊
                </div>
                <h4 style={{
                  margin: '0 0 0.25rem 0',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#1e40af'
                }}>
                  Analytics
                </h4>
                <p style={{
                  margin: 0,
                  fontSize: '0.75rem',
                  color: '#2563eb'
                }}>
                  Insights
                </p>
              </div>

              <div style={{
                backgroundColor: '#fef3c7',
                border: '1px solid #fde68a',
                borderRadius: '12px',
                padding: '1rem',
                textAlign: 'center',
                cursor: 'pointer'
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  backgroundColor: '#f59e0b',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 0.5rem',
                  color: 'white',
                  fontSize: '1.125rem'
                }}>
                  📋
                </div>
                <h4 style={{
                  margin: '0 0 0.25rem 0',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#92400e'
                }}>
                  Reports
                </h4>
                <p style={{
                  margin: 0,
                  fontSize: '0.75rem',
                  color: '#d97706'
                }}>
                  Generate
                </p>
              </div>
            </div>
          </div>

          {/* Performance Chart */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '20px',
            padding: '1.5rem',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            border: '1px solid #f3f4f6'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1rem'
            }}>
              <h3 style={{
                margin: 0,
                fontSize: '1.125rem',
                fontWeight: '600',
                color: '#111827'
              }}>
                Performance
              </h3>
              <button
                style={{
                  backgroundColor: '#f3f4f6',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '0.25rem 0.5rem',
                  fontSize: '0.75rem',
                  color: '#6b7280',
                  cursor: 'pointer'
                }}
              >
                Show all ↗
              </button>
            </div>

            {/* Tab Navigation */}
            <div style={{
              display: 'flex',
              backgroundColor: '#f9fafb',
              borderRadius: '8px',
              padding: '0.25rem',
              marginBottom: '1.5rem'
            }}>
              {['Week', 'Month', 'Year'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab.toLowerCase())}
                  style={{
                    flex: 1,
                    padding: '0.5rem',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    fontWeight: '500',
                    backgroundColor: activeTab === tab.toLowerCase() ? 'white' : 'transparent',
                    color: activeTab === tab.toLowerCase() ? '#111827' : '#6b7280',
                    cursor: 'pointer',
                    boxShadow: activeTab === tab.toLowerCase() ? '0 1px 2px rgba(0, 0, 0, 0.05)' : 'none'
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Simple Chart Representation */}
            <div style={{
              height: '120px',
              background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
              borderRadius: '12px',
              position: 'relative',
              overflow: 'hidden',
              marginBottom: '1rem'
            }}>
              <svg
                width="100%"
                height="100%"
                viewBox="0 0 200 120"
                style={{ position: 'absolute', top: 0, left: 0 }}
              >
                <path
                  d="M20,80 Q60,20 100,40 T180,30"
                  stroke="#22c55e"
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                />
                <circle cx="180" cy="30" r="4" fill="#22c55e" />
              </svg>
            </div>

            {/* Stats */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1rem'
            }}>
              <div>
                <p style={{
                  margin: '0 0 0.25rem 0',
                  fontSize: '0.75rem',
                  color: '#6b7280'
                }}>
                  Processed
                </p>
                <p style={{
                  margin: 0,
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  color: '#111827'
                }}>
                  85%
                </p>
              </div>
              <div>
                <p style={{
                  margin: '0 0 0.25rem 0',
                  fontSize: '0.75rem',
                  color: '#6b7280'
                }}>
                  Pending
                </p>
                <p style={{
                  margin: 0,
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  color: '#111827'
                }}>
                  15%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Sections */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '2rem',
          marginBottom: '2rem'
        }}>
          
          {/* Quick Actions */}
          {suratSummary && suratSummary.summary.map((item, index) => (
            <div key={item.jenis} style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              padding: '1.5rem',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              border: '1px solid #f3f4f6',
              textAlign: 'center'
            }}>
              <div style={{
                width: '50px',
                height: '50px',
                backgroundColor: ['#fef3c7', '#dbeafe', '#dcfce7', '#fce7f3', '#f3e8ff'][index],
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem',
                fontSize: '1.25rem'
              }}>
                {['📋', '📅', '👥', '💰', '📢'][index]}
              </div>
              <h4 style={{
                margin: '0 0 0.5rem 0',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#111827',
                textTransform: 'capitalize'
              }}>
                {item.jenis}
              </h4>
              <p style={{
                margin: '0 0 1rem 0',
                fontSize: '1.5rem',
                fontWeight: '700',
                color: '#111827'
              }}>
                {item.jumlah}
              </p>
              <button style={{
                backgroundColor: '#f9fafb',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '0.5rem 1rem',
                fontSize: '0.75rem',
                fontWeight: '500',
                color: '#374151',
                cursor: 'pointer',
                width: '100%'
              }}>
                View Details →
              </button>
            </div>
          ))}
        </div>

        {/* Bottom Section - Actions */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '2rem'
        }}>
          
          {/* Proposals */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            border: '1px solid #f3f4f6',
            overflow: 'hidden'
          }}>
            <div style={{
              padding: '1.5rem 1.5rem 1rem',
              borderBottom: '1px solid #f3f4f6'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <h3 style={{
                  margin: 0,
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  color: '#111827'
                }}>
                  Recent Proposals
                </h3>
                <button style={{
                  backgroundColor: '#f3f4f6',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '0.25rem 0.5rem',
                  fontSize: '0.75rem',
                  color: '#6b7280',
                  cursor: 'pointer'
                }}>
                  Add new ⊕
                </button>
              </div>
            </div>

            <div style={{ padding: '1rem', maxHeight: '300px', overflowY: 'auto' }}>
              {proposals.slice(0, 2).map(proposal => (
                <div key={proposal.id} style={{
                  padding: '1rem',
                  borderRadius: '12px',
                  backgroundColor: '#fafafb',
                  marginBottom: '1rem',
                  border: '1px solid #f3f4f6'
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '0.75rem'
                  }}>
                    <div>
                      <h4 style={{
                        margin: '0 0 0.25rem 0',
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        color: '#111827'
                      }}>
                        {proposal.judul_proposal}
                      </h4>
                      <p style={{
                        margin: 0,
                        fontSize: '0.75rem',
                        color: '#6b7280'
                      }}>
                        {proposal.asal_surat}
                      </p>
                    </div>
                    <span style={{
                      backgroundColor: '#fef3c7',
                      color: '#92400e',
                      fontSize: '0.75rem',
                      fontWeight: '500',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '6px'
                    }}>
                      Rp {proposal.total_anggaran?.toLocaleString('id-ID')}
                    </span>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => handleProposalDecision(proposal.id, 'setuju', proposal.total_anggaran, 'Approved')}
                      style={{
                        flex: 1,
                        backgroundColor: '#22c55e',
                        color: 'white',
                        border: 'none',
                        padding: '0.5rem',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        fontWeight: '500',
                        cursor: 'pointer'
                      }}
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleProposalDecision(proposal.id, 'tidak_setuju', 0, 'Rejected')}
                      style={{
                        flex: 1,
                        backgroundColor: '#ef4444',
                        color: 'white',
                        border: 'none',
                        padding: '0.5rem',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        fontWeight: '500',
                        cursor: 'pointer'
                      }}
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Feed */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            border: '1px solid #f3f4f6',
            overflow: 'hidden'
          }}>
            <div style={{
              padding: '1.5rem 1.5rem 1rem',
              borderBottom: '1px solid #f3f4f6'
            }}>
              <h3 style={{
                margin: 0,
                fontSize: '1.125rem',
                fontWeight: '600',
                color: '#111827'
              }}>
                Recent Activity
              </h3>
            </div>

            <div style={{ padding: '1rem', maxHeight: '300px', overflowY: 'auto' }}>
              {notifications.slice(0, 4).map((notif, index) => (
                <div key={notif.id} style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.75rem',
                  padding: '0.75rem 0',
                  borderBottom: index < 3 ? '1px solid #f3f4f6' : 'none'
                }}>
                  <div style={{
                    width: '8px',
                    height: '8px',
                    backgroundColor: notif.jenis === 'proposal_decision' ? '#22c55e' : '#3b82f6',
                    borderRadius: '50%',
                    marginTop: '0.375rem'
                  }}></div>
                  <div style={{ flex: 1 }}>
                    <p style={{
                      margin: '0 0 0.25rem 0',
                      fontSize: '0.875rem',
                      color: '#111827',
                      fontWeight: '500'
                    }}>
                      {notif.pesan.substring(0, 60)}...
                    </p>
                    <p style={{
                      margin: 0,
                      fontSize: '0.75rem',
                      color: '#6b7280'
                    }}>
                      {new Date(notif.created_at).toLocaleDateString('id-ID')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

export default KetuaDashboard