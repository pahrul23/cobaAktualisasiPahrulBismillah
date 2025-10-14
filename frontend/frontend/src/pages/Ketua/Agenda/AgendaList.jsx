// Path: /frontend/src/pages/Ketua/Agenda/AgendaList.jsx
import { useState, useEffect } from "react";
import useAuth from "../../../hooks/useAuth";
import CalendarView from "../../../components/Calendar/CalendarView";
import AgendaDetailModal from "../../../components/Modal/AgendaDetailModal";

const AgendaList = () => {
  const { user } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [agendaData, setAgendaData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [viewMode, setViewMode] = useState("timeline");
  const [isMobile, setIsMobile] = useState(false);

  // Modal states
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedAgendaId, setSelectedAgendaId] = useState(null);
  const [selectedAgendaType, setSelectedAgendaType] = useState(null);

  // Color system - Presidential theme
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
      silver: 'linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 100%)',
      admire: 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 50%, #10b981 100%)'
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

  const formatDateToString = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const fetchAgenda = async () => {
    try {
      setLoading(true);
      setError("");

      const currentDateStr = formatDateToString(currentDate);
      const url = `http://localhost:4000/api/agenda?date=${currentDateStr}`;

      const response = await fetch(url, {
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      if (data.success) {
        const transformedData = data.data.agenda.map((item) => {
          const isUndangan = item.jenis_surat === "undangan";
          const isAudiensi = item.jenis_surat === "audiensi";

          let time = "-";
          let location = "TBD";
          let participants = 1;
          let title = item.catatan_kehadiran || "Agenda";

          if (item.catatan_kehadiran) {
            if (isUndangan && item.catatan_kehadiran.includes("Undangan:")) {
              const titleMatch = item.catatan_kehadiran.match(/Undangan:\s*([^.]+)/);
              if (titleMatch) title = `Undangan: ${titleMatch[1].trim()}`;
            } else if (isAudiensi && item.catatan_kehadiran.includes("Audiensi:")) {
              const titleMatch = item.catatan_kehadiran.match(/Audiensi:\s*([^.]+)/);
              if (titleMatch) title = `Audiensi: ${titleMatch[1].trim()}`;
            }

            const timeMatch = item.catatan_kehadiran.match(/(?:pukul|jam)[:\s]+(\d{1,2}[:.]\d{2})/i);
            if (timeMatch) time = timeMatch[1].replace(".", ":");

            const locationMatch = item.catatan_kehadiran.match(/Tempat[:\s]+([^.]+)/i);
            if (locationMatch) location = locationMatch[1].trim();

            if (isAudiensi) {
              const participantMatch = item.catatan_kehadiran.match(/(\d+)\s*orang/i);
              if (participantMatch) participants = parseInt(participantMatch[1]);
            }
          }

          if (item.letter_details) {
            try {
              const letterDetails = typeof item.letter_details === "string" 
                ? JSON.parse(item.letter_details) 
                : item.letter_details;

              if (isUndangan) {
                const undanganTime = letterDetails.undangan_pukul || letterDetails.pukul;
                if (undanganTime) time = undanganTime;
                
                location = letterDetails.undangan_tempat || letterDetails.tempat || location;
                
                if (letterDetails.perihal) title = `Undangan: ${letterDetails.perihal}`;
                if (letterDetails.jenis_acara) title += ` - ${letterDetails.jenis_acara}`;
              } else if (isAudiensi) {
                const audiensiTime = letterDetails.audiensi_pukul || letterDetails.pukul;
                if (audiensiTime) time = audiensiTime;
                
                location = letterDetails.audiensi_tempat || letterDetails.tempat || location;
                participants = letterDetails.jumlah_peserta || participants;
                
                if (letterDetails.perihal) title = `Audiensi: ${letterDetails.perihal}`;
                if (letterDetails.topik_audiensi) title += ` - ${letterDetails.topik_audiensi}`;
              }
            } catch (e) {
              console.log("Error parsing letter_details:", e);
            }
          }

          if (time && time !== "-") {
            if (time.includes(':')) {
              const parts = time.split(':');
              if (parts.length >= 2) {
                time = `${parts[0].padStart(2, '0')}:${parts[1].padStart(2, '0')}`;
              }
            }
          }

          return {
            id: item.id,
            title: title,
            time: time,
            location: location,
            participants: participants,
            type: item.jenis_surat || "rapat",
            attendance_status: item.status_kehadiran || "belum_konfirmasi",
            status: item.status_kehadiran || "belum_konfirmasi",
            no_surat: item.letter_no_surat || null,
            letter_id: item.letter_id,
            timeSort: time === "-" ? "9999" : time.replace(":", ""),
          };
        }).sort((a, b) => a.timeSort.localeCompare(b.timeSort));

        setAgendaData(transformedData);
      }
    } catch (error) {
      console.error("Error fetching agenda:", error);
      setError("Gagal memuat agenda");
    } finally {
      setLoading(false);
    }
  };

  const handleDateSelect = (date) => {
    setCurrentDate(date);
    if (viewMode === "calendar") setViewMode("timeline");
  };

  const handleShowDetail = (agendaId, agendaType) => {
    setSelectedAgendaId(agendaId);
    setSelectedAgendaType(agendaType);
    setShowDetailModal(true);
  };

  const handleCloseDetail = () => {
    setShowDetailModal(false);
    setSelectedAgendaId(null);
    setSelectedAgendaType(null);
  };

  const updateAttendance = async (agendaId, status) => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/agenda/${agendaId}/attendance`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            status_kehadiran: status,
            catatan_kehadiran: `Update oleh ${user.name} - ${status}`,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setAgendaData((prev) =>
          prev.map((item) =>
            item.id === agendaId
              ? { ...item, attendance_status: status, status: status }
              : item
          )
        );
      } else {
        alert("Gagal mengupdate kehadiran");
      }
    } catch (error) {
      console.error("Error updating attendance:", error);
      alert("Gagal mengupdate kehadiran");
    }
  };

  useEffect(() => {
    if (viewMode === "timeline") fetchAgenda();
  }, [currentDate, viewMode]);

  const getTypeIcon = (type) => {
    const icons = {
      rapat: "🏛️",
      audiensi: "🤝",
      review: "📋",
      briefing: "📢",
      undangan: "🎉",
    };
    return icons[type] || "📅";
  };

  const getTypeColor = (type) => {
    const colorMap = {
      rapat: colors.primary.darkBlue,
      audiensi: colors.primary.emerald,
      review: colors.primary.gold,
      briefing: '#8B5CF6',
      undangan: colors.primary.ruby,
    };
    return colorMap[type] || colors.neutral.textLight;
  };

  const getAttendanceInfo = (status) => {
    const statusMap = {
      hadir: { label: 'Hadir', color: colors.primary.emerald, icon: '✓', bg: '#D1FAE5' },
      tidak_hadir: { label: 'Tidak Hadir', color: colors.primary.ruby, icon: '✗', bg: '#FEE2E2' },
      belum_konfirmasi: { label: 'Pending', color: colors.primary.gold, icon: '?', bg: '#FEF3C7' }
    };
    return statusMap[status] || statusMap.belum_konfirmasi;
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const navigateDate = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + direction);
    setCurrentDate(newDate);
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: colors.neutral.bg,
        flexDirection: 'column',
        fontFamily: "'Poppins', sans-serif"
      }}>
        <div style={{
          width: '80px',
          height: '80px',
          border: '8px solid #E5E7EB',
          borderTop: '8px solid ' + colors.primary.darkBlue,
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <p style={{
          marginTop: '24px',
          fontSize: '18px',
          color: colors.neutral.textLight,
          fontWeight: '600'
        }}>
          Memuat agenda Ketua DPD RI...
        </p>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }
        .agenda-card {
          animation: fadeIn 0.5s ease-out;
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
              <div style={{
                width: '60px',
                height: '60px',
                background: colors.gradients.gold,
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '32px',
                boxShadow: '0 8px 24px rgba(245, 158, 11, 0.4)'
              }}>
                📅
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
                  Agenda Ketua DPD RI
                </h1>
                <p style={{
                  fontSize: isMobile ? '14px' : '18px',
                  color: 'rgba(255, 255, 255, 0.9)',
                  margin: 0,
                  fontWeight: '500'
                }}>
                  Kelola jadwal dan kehadiran Ketua Dewan Perwakilan Daerah
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Control Panel */}
        <div style={{
          background: 'white',
          borderRadius: '24px',
          padding: isMobile ? '20px' : '32px',
          marginBottom: '24px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
          border: `1px solid ${colors.neutral.border}`
        }}>
          <div style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            justifyContent: 'space-between',
            alignItems: isMobile ? 'stretch' : 'center',
            gap: '20px'
          }}>
            
            {/* Date Navigation - Timeline Only */}
            {viewMode === "timeline" && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                flex: 1
              }}>
                <button
                  onClick={() => navigateDate(-1)}
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '14px',
                    border: 'none',
                    background: colors.gradients.silver,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px',
                    fontWeight: '700',
                    color: colors.neutral.text,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(-4px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateX(0)'}
                >
                  ←
                </button>

                <div style={{ textAlign: 'center', flex: 1 }}>
                  <h2 style={{
                    margin: '0 0 6px 0',
                    fontSize: isMobile ? '18px' : '24px',
                    fontWeight: '800',
                    color: colors.neutral.text,
                    letterSpacing: '-0.5px'
                  }}>
                    {formatDate(currentDate)}
                  </h2>
                  <p style={{
                    margin: 0,
                    color: colors.neutral.textLight,
                    fontSize: '14px',
                    fontWeight: '600'
                  }}>
                    📊 {agendaData.length} agenda terjadwal
                  </p>
                </div>

                <button
                  onClick={() => navigateDate(1)}
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '14px',
                    border: 'none',
                    background: colors.gradients.silver,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px',
                    fontWeight: '700',
                    color: colors.neutral.text,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(4px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateX(0)'}
                >
                  →
                </button>
              </div>
            )}

            {/* Calendar View Title */}
            {viewMode === "calendar" && (
              <div style={{ textAlign: 'center', flex: 1 }}>
                <h2 style={{
                  margin: '0 0 6px 0',
                  fontSize: '24px',
                  fontWeight: '800',
                  color: colors.neutral.text
                }}>
                  📊 Kalender Agenda
                </h2>
                <p style={{
                  margin: 0,
                  color: colors.neutral.textLight,
                  fontSize: '14px'
                }}>
                  Klik tanggal untuk melihat detail agenda
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div style={{
              display: 'flex',
              gap: '12px',
              flexWrap: 'wrap'
            }}>
              {viewMode === "timeline" && (
                <button
                  onClick={fetchAgenda}
                  style={{
                    padding: '12px 24px',
                    background: colors.gradients.emerald,
                    color: 'white',
                    border: 'none',
                    borderRadius: '14px',
                    fontSize: '14px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 16px rgba(16, 185, 129, 0.3)',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  🔄 Refresh Data
                </button>
              )}

              <button
                onClick={() => setViewMode(viewMode === "calendar" ? "timeline" : "calendar")}
                style={{
                  padding: '12px 24px',
                  background: viewMode === "calendar" 
                    ? colors.gradients.gold 
                    : colors.gradients.silver,
                  color: viewMode === "calendar" ? 'white' : colors.neutral.text,
                  border: 'none',
                  borderRadius: '14px',
                  fontSize: '14px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  boxShadow: viewMode === "calendar" 
                    ? '0 4px 16px rgba(245, 158, 11, 0.3)' 
                    : '0 2px 8px rgba(0,0,0,0.08)',
                  transition: 'all 0.2s ease'
                }}
              >
                {viewMode === "calendar" ? "📋 View Timeline" : "📊 View Calendar"}
              </button>
            </div>
          </div>
        </div>

        {/* Calendar View */}
        {viewMode === "calendar" && (
          <CalendarView
            onDateSelect={handleDateSelect}
            currentDate={currentDate}
          />
        )}

        {/* Timeline View - Premium Cards */}
        {viewMode === "timeline" && (
          <>
            {error ? (
              <div style={{
                background: 'white',
                borderRadius: '24px',
                padding: '60px',
                textAlign: 'center',
                boxShadow: '0 8px 32px rgba(0,0,0,0.08)'
              }}>
                <div style={{ fontSize: '64px', marginBottom: '20px' }}>❌</div>
                <h3 style={{ fontSize: '20px', fontWeight: '700', color: colors.primary.ruby, marginBottom: '12px' }}>
                  {error}
                </h3>
                <button
                  onClick={fetchAgenda}
                  style={{
                    marginTop: '16px',
                    padding: '12px 24px',
                    background: colors.gradients.emerald,
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    fontSize: '14px',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  🔄 Coba Lagi
                </button>
              </div>
            ) : agendaData.length === 0 ? (
              <div style={{
                background: 'white',
                borderRadius: '24px',
                padding: '80px 40px',
                textAlign: 'center',
                boxShadow: '0 8px 32px rgba(0,0,0,0.08)'
              }}>
                <div style={{ fontSize: '80px', marginBottom: '24px', opacity: 0.5 }}>📅</div>
                <h3 style={{
                  fontSize: '24px',
                  fontWeight: '800',
                  color: colors.neutral.text,
                  marginBottom: '12px'
                }}>
                  Tidak Ada Agenda Hari Ini
                </h3>
                <p style={{
                  fontSize: '16px',
                  color: colors.neutral.textLight,
                  margin: '0 0 24px 0'
                }}>
                  Jadwal Ketua DPD RI untuk tanggal ini kosong
                </p>
                <button
                  onClick={() => setViewMode('calendar')}
                  style={{
                    padding: '12px 24px',
                    background: colors.gradients.gold,
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    fontSize: '14px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    boxShadow: '0 4px 16px rgba(245, 158, 11, 0.3)'
                  }}
                >
                  📊 Lihat Kalender
                </button>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '20px' }}>
                {agendaData.map((item, index) => {
                  const attendanceInfo = getAttendanceInfo(item.attendance_status);
                  
                  return (
                    <div
                      key={item.id}
                      className="agenda-card"
                      style={{
                        background: 'white',
                        borderRadius: '24px',
                        padding: isMobile ? '20px' : '32px',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                        border: `2px solid ${colors.neutral.border}`,
                        position: 'relative',
                        overflow: 'hidden',
                        transition: 'all 0.3s ease',
                        animationDelay: `${index * 0.1}s`
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow = '0 12px 48px rgba(0,0,0,0.15)';
                        e.currentTarget.style.transform = 'translateY(-4px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.08)';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                    >
                      {/* Status Bar */}
                      <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '6px',
                        background: getTypeColor(item.type)
                      }} />

                      {/* Content Grid */}
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: isMobile ? '1fr' : '120px 1fr auto',
                        gap: '24px',
                        alignItems: 'start'
                      }}>
                        
                        {/* Time Badge - Presidential Style */}
                        <div style={{
                          background: colors.gradients.gold,
                          borderRadius: '20px',
                          padding: '20px',
                          textAlign: 'center',
                          boxShadow: '0 8px 24px rgba(245, 158, 11, 0.3)',
                          minWidth: isMobile ? 'auto' : '120px'
                        }}>
                          <div style={{
                            fontSize: '32px',
                            fontWeight: '900',
                            color: 'white',
                            marginBottom: '4px',
                            textShadow: '0 2px 4px rgba(0,0,0,0.2)',
                            fontFamily: "'Poppins', sans-serif"
                          }}>
                            {item.time}
                          </div>
                          <div style={{
                            fontSize: '11px',
                            fontWeight: '700',
                            color: 'rgba(255,255,255,0.9)',
                            textTransform: 'uppercase',
                            letterSpacing: '1px'
                          }}>
                            WIB
                          </div>
                        </div>

                        {/* Details */}
                        <div>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            marginBottom: '12px',
                            flexWrap: 'wrap'
                          }}>
                            <span style={{ fontSize: '28px' }}>
                              {getTypeIcon(item.type)}
                            </span>
                            <h3 style={{
                              margin: 0,
                              fontSize: isMobile ? '16px' : '20px',
                              fontWeight: '800',
                              color: colors.neutral.text,
                              letterSpacing: '-0.5px'
                            }}>
                              {item.title}
                            </h3>
                            <span style={{
                              background: getTypeColor(item.type),
                              color: 'white',
                              padding: '6px 14px',
                              borderRadius: '10px',
                              fontSize: '11px',
                              fontWeight: '800',
                              textTransform: 'uppercase',
                              letterSpacing: '0.5px'
                            }}>
                              {item.type}
                            </span>
                          </div>

                          {/* Info Grid */}
                          <div style={{
                            display: 'grid',
                            gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
                            gap: '16px',
                            marginBottom: '20px'
                          }}>
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              fontSize: '14px',
                              color: colors.neutral.textLight,
                              fontWeight: '600'
                            }}>
                              <span style={{ fontSize: '18px' }}>📍</span>
                              {item.location}
                            </div>
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              fontSize: '14px',
                              color: colors.neutral.textLight,
                              fontWeight: '600'
                            }}>
                              <span style={{ fontSize: '18px' }}>👥</span>
                              {item.participants} peserta
                            </div>
                            {item.no_surat && (
                              <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                fontSize: '14px',
                                color: colors.neutral.textLight,
                                fontWeight: '600'
                              }}>
                                <span style={{ fontSize: '18px' }}>📄</span>
                                {item.no_surat}
                              </div>
                            )}
                          </div>

                          {/* Attendance Status Display */}
                          <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '10px 16px',
                            background: attendanceInfo.bg,
                            borderRadius: '12px',
                            marginBottom: '16px'
                          }}>
                            <span style={{
                              fontSize: '18px',
                              fontWeight: '900',
                              color: attendanceInfo.color
                            }}>
                              {attendanceInfo.icon}
                            </span>
                            <span style={{
                              fontSize: '14px',
                              fontWeight: '700',
                              color: attendanceInfo.color
                            }}>
                              Status: {attendanceInfo.label}
                            </span>
                          </div>

                          {/* Attendance Action Buttons */}
                          <div style={{
                            display: 'flex',
                            gap: '10px',
                            flexWrap: 'wrap'
                          }}>
                            <button
                              onClick={() => updateAttendance(item.id, "hadir")}
                              style={{
                                padding: '10px 20px',
                                background: item.attendance_status === "hadir" 
                                  ? colors.gradients.emerald 
                                  : colors.gradients.silver,
                                color: item.attendance_status === "hadir" ? 'white' : colors.neutral.text,
                                border: 'none',
                                borderRadius: '12px',
                                fontSize: '13px',
                                fontWeight: '700',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                boxShadow: item.attendance_status === "hadir" 
                                  ? '0 4px 12px rgba(16, 185, 129, 0.3)' 
                                  : 'none'
                              }}
                            >
                              ✓ Hadir
                            </button>
                            <button
                              onClick={() => updateAttendance(item.id, "tidak_hadir")}
                              style={{
                                padding: '10px 20px',
                                background: item.attendance_status === "tidak_hadir" 
                                  ? colors.gradients.ruby 
                                  : colors.gradients.silver,
                                color: item.attendance_status === "tidak_hadir" ? 'white' : colors.neutral.text,
                                border: 'none',
                                borderRadius: '12px',
                                fontSize: '13px',
                                fontWeight: '700',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                boxShadow: item.attendance_status === "tidak_hadir" 
                                  ? '0 4px 12px rgba(220, 38, 38, 0.3)' 
                                  : 'none'
                              }}
                            >
                              ✗ Tidak Hadir
                            </button>
                            <button
                              onClick={() => updateAttendance(item.id, "belum_konfirmasi")}
                              style={{
                                padding: '10px 20px',
                                background: item.attendance_status === "belum_konfirmasi" 
                                  ? colors.gradients.gold 
                                  : colors.gradients.silver,
                                color: item.attendance_status === "belum_konfirmasi" ? 'white' : colors.neutral.text,
                                border: 'none',
                                borderRadius: '12px',
                                fontSize: '13px',
                                fontWeight: '700',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                boxShadow: item.attendance_status === "belum_konfirmasi" 
                                  ? '0 4px 12px rgba(245, 158, 11, 0.3)' 
                                  : 'none'
                              }}
                            >
                              ? Pending
                            </button>
                          </div>
                        </div>

                        {/* Detail Button */}
                        <div>
                          <button
                            onClick={() => handleShowDetail(item.id, item.type)}
                            style={{
                              padding: '14px 24px',
                              background: colors.gradients.presidential,
                              color: 'white',
                              border: 'none',
                              borderRadius: '14px',
                              fontSize: '14px',
                              fontWeight: '700',
                              cursor: 'pointer',
                              boxShadow: '0 4px 16px rgba(15, 23, 42, 0.3)',
                              transition: 'all 0.2s ease',
                              whiteSpace: 'nowrap'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform = 'translateY(-2px)';
                              e.currentTarget.style.boxShadow = '0 6px 24px rgba(15, 23, 42, 0.4)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = 'translateY(0)';
                              e.currentTarget.style.boxShadow = '0 4px 16px rgba(15, 23, 42, 0.3)';
                            }}
                          >
                            📋 Detail
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Presidential Stats - Only for Timeline */}
            {agendaData.length > 0 && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : 'repeat(4, 1fr)',
                gap: '20px',
                marginTop: '32px'
              }}>
                {[
                  {
                    label: 'Total Agenda',
                    value: agendaData.length,
                    gradient: colors.gradients.presidential,
                    icon: '📅'
                  },
                  {
                    label: 'Hadir',
                    value: agendaData.filter(i => i.attendance_status === 'hadir').length,
                    gradient: colors.gradients.emerald,
                    icon: '✅'
                  },
                  {
                    label: 'Tidak Hadir',
                    value: agendaData.filter(i => i.attendance_status === 'tidak_hadir').length,
                    gradient: colors.gradients.ruby,
                    icon: '❌'
                  },
                  {
                    label: 'Pending',
                    value: agendaData.filter(i => i.attendance_status === 'belum_konfirmasi').length,
                    gradient: colors.gradients.gold,
                    icon: '⏳'
                  }
                ].map((stat, index) => (
                  <div
                    key={index}
                    style={{
                      background: stat.gradient,
                      borderRadius: '24px',
                      padding: '28px',
                      textAlign: 'center',
                      position: 'relative',
                      overflow: 'hidden',
                      boxShadow: '0 8px 32px rgba(0,0,0,0.15)'
                    }}
                  >
                    <div style={{
                      position: 'absolute',
                      top: '-50px',
                      right: '-50px',
                      width: '150px',
                      height: '150px',
                      background: 'rgba(255,255,255,0.1)',
                      borderRadius: '50%',
                      filter: 'blur(40px)'
                    }} />
                    
                    <div style={{ position: 'relative', zIndex: 2 }}>
                      <div style={{ fontSize: '40px', marginBottom: '12px' }}>
                        {stat.icon}
                      </div>
                      <div style={{
                        fontSize: '36px',
                        fontWeight: '900',
                        color: 'white',
                        marginBottom: '8px',
                        textShadow: '0 2px 4px rgba(0,0,0,0.2)'
                      }}>
                        {stat.value}
                      </div>
                      <div style={{
                        fontSize: '14px',
                        fontWeight: '700',
                        color: 'rgba(255,255,255,0.95)',
                        textTransform: 'uppercase',
                        letterSpacing: '1px'
                      }}>
                        {stat.label}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Detail Modal */}
        <AgendaDetailModal
          isOpen={showDetailModal}
          onClose={handleCloseDetail}
          agendaId={selectedAgendaId}
          agendaType={selectedAgendaType}
        />
      </div>
    </>
  );
};

export default AgendaList;