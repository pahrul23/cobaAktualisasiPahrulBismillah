import { useState, useEffect } from 'react'

const CalendarView = ({ agendaData, onDateSelect, currentDate }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date(currentDate))
  
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
      const dateStr = date.toISOString().split('T')[0]
      const dayAgenda = agendaData.filter(item => 
        new Date(item.tanggal_konfirmasi).toDateString() === date.toDateString()
      )
      
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

  const days = getDaysInMonth(currentMonth)
  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ]

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
            cursor: 'pointer'
          }}
        >
          ← Prev
        </button>
        
        <h3 style={{
          margin: 0,
          fontSize: '18px',
          fontWeight: '600'
        }}>
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h3>
        
        <button
          onClick={() => navigateMonth(1)}
          style={{
            padding: '8px 12px',
            background: '#f1f5f9',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          Next →
        </button>
      </div>

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
            color: '#64748b'
          }}>
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        gap: '1px'
      }}>
        {days.map((dayData, index) => (
          <div
            key={index}
            onClick={() => dayData && onDateSelect(dayData.date)}
            style={{
              minHeight: '80px',
              padding: '4px',
              background: dayData ? '#f8fafc' : 'transparent',
              border: '1px solid #e2e8f0',
              borderRadius: '4px',
              cursor: dayData ? 'pointer' : 'default',
              position: 'relative'
            }}
          >
            {dayData && (
              <>
                <div style={{
                  fontSize: '14px',
                  fontWeight: dayData.dateStr === currentDate.toISOString().split('T')[0] ? '700' : '400',
                  color: dayData.dateStr === currentDate.toISOString().split('T')[0] ? '#3b82f6' : '#1a202c'
                }}>
                  {dayData.day}
                </div>
                {dayData.agenda.length > 0 && (
                  <div style={{
                    position: 'absolute',
                    bottom: '4px',
                    left: '4px',
                    right: '4px'
                  }}>
                    {dayData.agenda.slice(0, 2).map((agenda, idx) => (
                      <div
                        key={idx}
                        style={{
                          fontSize: '10px',
                          background: '#3b82f6',
                          color: 'white',
                          padding: '2px 4px',
                          borderRadius: '2px',
                          marginBottom: '2px',
                          overflow: 'hidden',
                          whiteSpace: 'nowrap',
                          textOverflow: 'ellipsis'
                        }}
                      >
                        {agenda.perihal || agenda.title}
                      </div>
                    ))}
                    {dayData.agenda.length > 2 && (
                      <div style={{
                        fontSize: '9px',
                        color: '#64748b',
                        textAlign: 'center'
                      }}>
                        +{dayData.agenda.length - 2} lagi
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default CalendarView