// Path: /frontend/src/pages/Agenda/AgendaList.jsx
import { useState, useEffect } from 'react'
import DashboardLayout from '../../components/Layout/DashboardLayout'

const AgendaList = () => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedView, setSelectedView] = useState('day') // day, week, month
  const [agendaData, setAgendaData] = useState([])

  // Sample agenda data
  useEffect(() => {
    setAgendaData([
      {
        id: 1,
        time: '09:00',
        duration: '2 jam',
        title: 'Rapat Koordinasi Bulanan',
        type: 'rapat',
        location: 'Ruang Rapat Utama',
        participants: 12,
        status: 'scheduled',
        priority: 'high'
      },
      {
        id: 2,
        time: '11:30',
        duration: '1.5 jam',
        title: 'Audiensi dengan Pengusaha Lokal',
        type: 'audiensi',
        location: 'Ruang Ketua',
        participants: 5,
        status: 'confirmed',
        priority: 'medium'
      },
      {
        id: 3,
        time: '14:00',
        duration: '1 jam',
        title: 'Review Proposal Pendidikan',
        type: 'review',
        location: 'Ruang Review',
        participants: 8,
        status: 'scheduled',
        priority: 'medium'
      },
      {
        id: 4,
        time: '16:00',
        duration: '1 jam',
        title: 'Briefing Tim Sekretariat',
        type: 'briefing',
        location: 'Ruang Briefing',
        participants: 15,
        status: 'scheduled',
        priority: 'low'
      }
    ])
  }, [])

  const getTypeIcon = (type) => {
    const icons = {
      rapat: '🏛️',
      audiensi: '🤝',
      review: '📋',
      briefing: '📢',
      undangan: '🎉'
    }
    return icons[type] || '📅'
  }

  const getTypeColor = (type) => {
    const colors = {
      rapat: '#3b82f6',
      audiensi: '#10b981',
      review: '#f59e0b',
      briefing: '#8b5cf6',
      undangan: '#ef4444'
    }
    return colors[type] || '#64748b'
  }

  const getPriorityColor = (priority) => {
    const colors = {
      high: '#ef4444',
      medium: '#f59e0b',
      low: '#10b981'
    }
    return colors[priority] || '#64748b'
  }

  const formatDate = (date) => {
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const navigateDate = (direction) => {
    const newDate = new Date(currentDate)
    newDate.setDate(newDate.getDate() + direction)
    setCurrentDate(newDate)
  }

  return (
    <DashboardLayout>
      <div style={{
        fontFamily: "'Poppins', sans-serif",
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        
        {/* Header Controls */}
        <div style={{
          background: 'white',
          padding: '24px',
          borderRadius: '20px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
          marginBottom: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          
          {/* Date Navigation */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
          }}>
            <button
              onClick={() => navigateDate(-1)}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                border: '2px solid #e2e8f0',
                background: 'white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px'
              }}
            >
              ←
            </button>
            
            <div style={{ textAlign: 'center' }}>
              <h2 style={{
                margin: '0 0 4px 0',
                fontSize: '24px',
                fontWeight: '700',
                color: '#1a202c'
              }}>
                {formatDate(currentDate)}
              </h2>
              <p style={{
                margin: 0,
                color: '#64748b',
                fontSize: '14px'
              }}>
                {agendaData.length} agenda hari ini
              </p>
            </div>
            
            <button
              onClick={() => navigateDate(1)}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                border: '2px solid #e2e8f0',
                background: 'white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px'
              }}
            >
              →
            </button>
          </div>

          {/* Action Buttons */}
          <div style={{
            display: 'flex',
            gap: '12px'
          }}>
            <button style={{
              padding: '10px 20px',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              📅 Tambah Agenda
            </button>
            
            <button style={{
              padding: '10px 20px',
              background: '#f1f5f9',
              color: '#64748b',
              border: '2px solid #e2e8f0',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer'
            }}>
              📊 View Calendar
            </button>
          </div>
        </div>

        {/* Timeline View */}
        <div style={{
          background: 'white',
          borderRadius: '20px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
          overflow: 'hidden'
        }}>
          
          {/* Timeline Header */}
          <div style={{
            background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
            color: 'white',
            padding: '20px 24px'
          }}>
            <h3 style={{
              margin: '0 0 8px 0',
              fontSize: '20px',
              fontWeight: '700'
            }}>
              Agenda Hari Ini
            </h3>
            <p style={{
              margin: 0,
              opacity: 0.9,
              fontSize: '14px'
            }}>
              Timeline kegiatan dan acara terjadwal
            </p>
          </div>

          {/* Agenda Items */}
          <div style={{ padding: '24px' }}>
            {agendaData.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '40px',
                color: '#64748b'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>📅</div>
                <h3 style={{ margin: '0 0 8px 0', fontSize: '18px' }}>
                  Tidak ada agenda hari ini
                </h3>
                <p style={{ margin: 0, fontSize: '14px' }}>
                  Tambahkan agenda baru atau pilih tanggal lain
                </p>
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gap: '16px'
              }}>
                {agendaData.map((item, index) => (
                  <div
                    key={item.id}
                    style={{
                      background: '#f8fafc',
                      borderRadius: '16px',
                      padding: '20px',
                      border: '2px solid #f1f5f9',
                      position: 'relative',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'translateY(-2px)'
                      e.target.style.boxShadow = '0 8px 32px rgba(0,0,0,0.1)'
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'translateY(0)'
                      e.target.style.boxShadow = 'none'
                    }}
                  >
                    
                    {/* Priority Indicator */}
                    <div style={{
                      position: 'absolute',
                      top: '20px',
                      right: '20px',
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: getPriorityColor(item.priority)
                    }}></div>

                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '80px 1fr auto',
                      gap: '20px',
                      alignItems: 'center'
                    }}>
                      
                      {/* Time */}
                      <div style={{ textAlign: 'center' }}>
                        <div style={{
                          fontSize: '18px',
                          fontWeight: '700',
                          color: '#1a202c',
                          marginBottom: '4px'
                        }}>
                          {item.time}
                        </div>
                        <div style={{
                          fontSize: '12px',
                          color: '#64748b',
                          background: '#e2e8f0',
                          padding: '4px 8px',
                          borderRadius: '6px'
                        }}>
                          {item.duration}
                        </div>
                      </div>

                      {/* Content */}
                      <div>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          marginBottom: '8px'
                        }}>
                          <span style={{ fontSize: '20px' }}>
                            {getTypeIcon(item.type)}
                          </span>
                          <h4 style={{
                            margin: 0,
                            fontSize: '16px',
                            fontWeight: '600',
                            color: '#1a202c'
                          }}>
                            {item.title}
                          </h4>
                          <span style={{
                            background: getTypeColor(item.type),
                            color: 'white',
                            padding: '4px 8px',
                            borderRadius: '6px',
                            fontSize: '11px',
                            fontWeight: '600',
                            textTransform: 'uppercase'
                          }}>
                            {item.type}
                          </span>
                        </div>
                        
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '16px',
                          fontSize: '14px',
                          color: '#64748b'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            📍 {item.location}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            👥 {item.participants} orang
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div style={{
                        display: 'flex',
                        gap: '8px'
                      }}>
                        <button style={{
                          padding: '8px 12px',
                          background: '#3b82f6',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          fontSize: '12px',
                          fontWeight: '600',
                          cursor: 'pointer'
                        }}>
                          Detail
                        </button>
                        <button style={{
                          padding: '8px 12px',
                          background: '#f1f5f9',
                          color: '#64748b',
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px',
                          fontSize: '12px',
                          fontWeight: '600',
                          cursor: 'pointer'
                        }}>
                          Edit
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginTop: '24px'
        }}>
          {[
            { label: 'Total Agenda', value: '4', color: '#3b82f6', icon: '📅' },
            { label: 'Rapat', value: '1', color: '#10b981', icon: '🏛️' },
            { label: 'Audiensi', value: '1', color: '#f59e0b', icon: '🤝' },
            { label: 'Review', value: '2', color: '#8b5cf6', icon: '📋' }
          ].map((stat, index) => (
            <div
              key={index}
              style={{
                background: 'white',
                padding: '20px',
                borderRadius: '16px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                textAlign: 'center'
              }}
            >
              <div style={{
                fontSize: '32px',
                marginBottom: '8px'
              }}>
                {stat.icon}
              </div>
              <div style={{
                fontSize: '24px',
                fontWeight: '700',
                color: stat.color,
                marginBottom: '4px'
              }}>
                {stat.value}
              </div>
              <div style={{
                fontSize: '14px',
                color: '#64748b'
              }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}

export default AgendaList