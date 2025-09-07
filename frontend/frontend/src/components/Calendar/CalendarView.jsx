// Path: /frontend/src/components/Calendar/CalendarView.jsx
import { useState, useEffect } from 'react'

const CalendarView = ({ onDateSelect, currentDate }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date(currentDate))
  const [monthlyAgenda, setMonthlyAgenda] = useState([])
  const [loading, setLoading] = useState(false)
  
  // Helper function to format date to YYYY-MM-DD without timezone issues
  const formatDateToString = (date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  // Helper function to extract date from datetime string without timezone conversion
  const extractDateOnly = (dateTimeString) => {
    if (!dateTimeString) return null
    return dateTimeString.split('T')[0]
  }

  // Fetch agenda for the entire month by making multiple single-day requests
  const fetchMonthlyAgenda = async (monthDate) => {
    try {
      setLoading(true)
      
      // Get first and last day of the month
      const year = monthDate.getFullYear()
      const month = monthDate.getMonth()
      const daysInMonth = new Date(year, month + 1, 0).getDate()
      
      const allAgenda = []
      
      // Fetch agenda for each day of the month
      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day)
        const dateStr = formatDateToString(date)
        
        try {
          const response = await fetch(
            `http://localhost:4000/api/agenda?date=${dateStr}`,
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          )

          const data = await response.json()
          
          if (data.success && data.data.agenda.length > 0) {
            // Transform the agenda data with proper date handling
            const dayAgenda = data.data.agenda.map(item => {
              // Extract title from catatan_kehadiran or use letter perihal
              let title = 'Agenda'
              if (item.catatan_kehadiran) {
                if (item.jenis_surat === 'undangan' && item.catatan_kehadiran.includes('Undangan:')) {
                  const titleMatch = item.catatan_kehadiran.match(/Undangan:\s*([^.]+)/)
                  if (titleMatch) title = titleMatch[1].trim()
                } else if (item.jenis_surat === 'audiensi' && item.catatan_kehadiran.includes('Audiensi:')) {
                  const titleMatch = item.catatan_kehadiran.match(/Audiensi:\s*([^.]+)/)
                  if (titleMatch) title = titleMatch[1].trim()
                }
              }
              if (item.letter_perihal) {
                title = item.letter_perihal
              }

              return {
                ...item,
                agendaDate: dateStr, // Use the requested date, not the database date
                title,
                type: item.jenis_surat || 'rapat'
              }
            })
            
            allAgenda.push(...dayAgenda)
          }
        } catch (dayError) {
          console.log(`No agenda for ${dateStr}:`, dayError)
          // Continue to next day even if this day fails
        }
      }
      
      console.log('Monthly agenda loaded:', allAgenda)
      setMonthlyAgenda(allAgenda)
      
    } catch (error) {
      console.error('Error fetching monthly agenda:', error)
      setMonthlyAgenda([])
    } finally {
      setLoading(false)
    }
  }

  // Load agenda when month changes
  useEffect(() => {
    fetchMonthlyAgenda(currentMonth)
  }, [currentMonth])

  const getDaysInMonth = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()
    
    const days = []
    
    // Empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }
    
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day)
      const dateStr = formatDateToString(date)
      
      // Find agenda for this specific date using string comparison
      const dayAgenda = monthlyAgenda.filter(item => item.agendaDate === dateStr)
      
      console.log(`Day ${day} (${dateStr}):`, dayAgenda.length, 'agenda items')
      
      days.push({
        day,
        date,
        dateStr,
        agenda: dayAgenda
      })
    }
    
    return days
  }

  const navigateMonth = (direction) => {
    const newMonth = new Date(currentMonth)
    newMonth.setMonth(newMonth.getMonth() + direction)
    setCurrentMonth(newMonth)
  }

  // Go to today
  const goToToday = () => {
    const today = new Date()
    setCurrentMonth(today)
    onDateSelect(today)
  }

  const days = getDaysInMonth(currentMonth)
  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ]

  const getTypeColor = (type) => {
    const colors = {
      rapat: '#3b82f6',
      audiensi: '#10b981',
      review: '#f59e0b', 
      briefing: '#8b5cf6',
      undangan: '#ef4444',
    }
    return colors[type] || '#64748b'
  }

  const getTypeIcon = (type) => {
    const icons = {
      rapat: '🏛️',
      audiensi: '🤝',
      review: '📋',
      briefing: '📢', 
      undangan: '🎉',
    }
    return icons[type] || '📅'
  }

  return (
    <div style={{
      background: 'white',
      borderRadius: '20px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
      padding: '24px'
    }}>
      {/* Calendar Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <button
          onClick={() => navigateMonth(-1)}
          style={{
            padding: '8px 12px',
            background: '#f1f5f9',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500'
          }}
        >
          ← Prev
        </button>
        
        <div style={{ textAlign: 'center' }}>
          <h3 style={{
            margin: '0 0 4px 0',
            fontSize: '18px',
            fontWeight: '600'
          }}>
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </h3>
          <button
            onClick={goToToday}
            style={{
              padding: '4px 8px',
              background: 'transparent',
              border: '1px solid #e2e8f0',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px',
              color: '#64748b'
            }}
          >
            Hari Ini
          </button>
        </div>
        
        <button
          onClick={() => navigateMonth(1)}
          style={{
            padding: '8px 12px',
            background: '#f1f5f9',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500'
          }}
        >
          Next →
        </button>
      </div>

      {/* Loading indicator */}
      {loading && (
        <div style={{
          textAlign: 'center',
          padding: '20px',
          color: '#64748b',
          fontSize: '14px'
        }}>
          Loading agenda bulan ini...
        </div>
      )}

      {/* Days of Week */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        gap: '1px',
        marginBottom: '8px'
      }}>
        {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map(day => (
          <div key={day} style={{
            padding: '8px',
            textAlign: 'center',
            fontSize: '12px',
            fontWeight: '600',
            color: '#64748b',
            background: '#f8fafc'
          }}>
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        gap: '2px'
      }}>
        {days.map((dayData, index) => {
          const isToday = dayData && formatDateToString(new Date()) === dayData.dateStr
          const isSelected = dayData && formatDateToString(currentDate) === dayData.dateStr
          
          return (
            <div
              key={index}
              onClick={() => dayData && onDateSelect(dayData.date)}
              style={{
                minHeight: '100px',
                padding: '8px',
                background: dayData ? 
                  isSelected ? '#e0f2fe' : 
                  isToday ? '#f0f9ff' : 
                  '#f8fafc' : 'transparent',
                border: `1px solid ${
                  isSelected ? '#0ea5e9' :
                  isToday ? '#38bdf8' : 
                  '#e2e8f0'
                }`,
                borderRadius: '6px',
                cursor: dayData ? 'pointer' : 'default',
                position: 'relative',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                if (dayData && !isSelected) {
                  e.target.style.background = '#f1f5f9'
                }
              }}
              onMouseOut={(e) => {
                if (dayData && !isSelected) {
                  e.target.style.background = isToday ? '#f0f9ff' : '#f8fafc'
                }
              }}
            >
              {dayData && (
                <>
                  <div style={{
                    fontSize: '14px',
                    fontWeight: isToday ? '700' : isSelected ? '600' : '400',
                    color: isSelected ? '#0ea5e9' : isToday ? '#0284c7' : '#1a202c',
                    marginBottom: '4px'
                  }}>
                    {dayData.day}
                  </div>
                  
                  {/* Debug info - REMOVE THIS IN PRODUCTION */}
                  <div style={{
                    fontSize: '8px',
                    color: '#94a3b8',
                    marginBottom: '4px'
                  }}>
                    {dayData.dateStr} ({dayData.agenda.length})
                  </div>
                  
                  {/* Agenda Items */}
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2px'
                  }}>
                    {dayData.agenda.slice(0, 2).map((agenda, idx) => (
                      <div
                        key={idx}
                        style={{
                          fontSize: '9px',
                          background: getTypeColor(agenda.type),
                          color: 'white',
                          padding: '2px 4px',
                          borderRadius: '3px',
                          overflow: 'hidden',
                          whiteSpace: 'nowrap',
                          textOverflow: 'ellipsis',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '2px'
                        }}
                        title={`${getTypeIcon(agenda.type)} ${agenda.title}`}
                      >
                        <span style={{ fontSize: '8px' }}>{getTypeIcon(agenda.type)}</span>
                        <span>{agenda.title}</span>
                      </div>
                    ))}
                    
                    {dayData.agenda.length > 2 && (
                      <div style={{
                        fontSize: '8px',
                        color: '#64748b',
                        textAlign: 'center',
                        marginTop: '2px'
                      }}>
                        +{dayData.agenda.length - 2} lagi
                      </div>
                    )}
                  </div>

                  {/* Agenda count indicator */}
                  {dayData.agenda.length > 0 && (
                    <div style={{
                      position: 'absolute',
                      top: '4px',
                      right: '4px',
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: '#ef4444'
                    }}></div>
                  )}
                </>
              )}
            </div>
          )
        })}
      </div>

      {/* Legend */}
      <div style={{
        marginTop: '16px',
        padding: '12px',
        background: '#f8fafc',
        borderRadius: '8px',
        fontSize: '11px'
      }}>
        <div style={{ marginBottom: '8px', fontWeight: '600', color: '#374151' }}>
          Legenda:
        </div>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          {[
            { type: 'undangan', label: 'Undangan' },
            { type: 'audiensi', label: 'Audiensi' },
            { type: 'rapat', label: 'Rapat' },
            { type: 'briefing', label: 'Briefing' },
            { type: 'review', label: 'Review' }
          ].map(item => (
            <div key={item.type} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <div style={{
                width: '12px',
                height: '12px',
                borderRadius: '2px',
                background: getTypeColor(item.type)
              }}></div>
              <span style={{ color: '#64748b' }}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default CalendarView