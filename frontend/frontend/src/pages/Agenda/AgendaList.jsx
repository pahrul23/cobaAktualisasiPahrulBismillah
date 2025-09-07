// Path: /frontend/src/pages/Agenda/AgendaList.jsx
import { useState, useEffect } from "react";
import DashboardLayout from "../../components/Layout/DashboardLayout";
import useAuth from "../../hooks/useAuth";
import CalendarView from "../../components/Calendar/CalendarView";
import AgendaDetailModal from "../../components/Modal/AgendaDetailModal";

const AgendaList = () => {
  const { token } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [agendaData, setAgendaData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [viewMode, setViewMode] = useState("timeline");
  
  // Modal states
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedAgendaId, setSelectedAgendaId] = useState(null);
  const [selectedAgendaType, setSelectedAgendaType] = useState(null);

  // Helper function to format date to YYYY-MM-DD without timezone issues
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

      // Pass date filter to backend
      const currentDateStr = formatDateToString(currentDate);
      const url = `http://localhost:4000/api/agenda?date=${currentDateStr}`;

      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (data.success) {
        // Transform data without additional filtering (backend already filtered)
        const transformedData = data.data.agenda.map((item) => {
          // Ekstraksi informasi dari catatan_kehadiran dan letter details
          const isUndangan = item.jenis_surat === "undangan";
          const isAudiensi = item.jenis_surat === "audiensi";

          // Default values
          let time = "09:00";
          let location = "TBD";
          let participants = 1;
          let title = item.catatan_kehadiran || "Agenda";

          // Parse dari catatan_kehadiran
          if (item.catatan_kehadiran) {
            // Extract title
            if (isUndangan && item.catatan_kehadiran.includes("Undangan:")) {
              const titleMatch =
                item.catatan_kehadiran.match(/Undangan:\s*([^.]+)/);
              if (titleMatch) title = `Undangan: ${titleMatch[1].trim()}`;
            } else if (
              isAudiensi &&
              item.catatan_kehadiran.includes("Audiensi:")
            ) {
              const titleMatch =
                item.catatan_kehadiran.match(/Audiensi:\s*([^.]+)/);
              if (titleMatch) title = `Audiensi: ${titleMatch[1].trim()}`;
            }

            // Extract time - coba berbagai format
            const timeMatch = item.catatan_kehadiran.match(
              /(?:pukul|jam)[:\s]+(\d{1,2}[:.]\d{2})/i
            );
            if (timeMatch) {
              time = timeMatch[1].replace(".", ":");
            }

            // Extract location
            const locationMatch =
              item.catatan_kehadiran.match(/Tempat[:\s]+([^.]+)/i);
            if (locationMatch) {
              location = locationMatch[1].trim();
            }

            // Extract participants for audiensi
            if (isAudiensi) {
              const participantMatch =
                item.catatan_kehadiran.match(/(\d+)\s*orang/i);
              if (participantMatch) {
                participants = parseInt(participantMatch[1]);
              }
            }
          }

          // Jika ada letter_details, gunakan data yang lebih akurat
          if (item.letter_details) {
            try {
              const letterDetails =
                typeof item.letter_details === "string"
                  ? JSON.parse(item.letter_details)
                  : item.letter_details;

              if (isUndangan) {
                time =
                  letterDetails.undangan_pukul || letterDetails.pukul || time;
                location =
                  letterDetails.undangan_tempat ||
                  letterDetails.tempat ||
                  location;
                if (letterDetails.perihal) {
                  title = `Undangan: ${letterDetails.perihal}`;
                }
                if (letterDetails.jenis_acara) {
                  title += ` - ${letterDetails.jenis_acara}`;
                }
              } else if (isAudiensi) {
                time =
                  letterDetails.audiensi_pukul || letterDetails.pukul || time;
                location =
                  letterDetails.audiensi_tempat ||
                  letterDetails.tempat ||
                  location;
                participants = letterDetails.jumlah_peserta || participants;
                if (letterDetails.perihal) {
                  title = `Audiensi: ${letterDetails.perihal}`;
                }
                if (letterDetails.topik_audiensi) {
                  title += ` - ${letterDetails.topik_audiensi}`;
                }
              }
            } catch (e) {
              console.log("Error parsing letter_details:", e);
            }
          }

          return {
            id: item.id,
            title: title,
            time: time,
            duration: "1 jam",
            location: location,
            participants: participants,
            type: item.jenis_surat || "rapat",
            attendance_status: item.status_kehadiran || "belum_konfirmasi",
            status: item.status_kehadiran || "belum_konfirmasi",
            no_surat: item.letter_no_surat || null,
            letter_id: item.letter_id,
            // Untuk sorting berdasarkan jam
            timeSort: time.replace(":", ""), // "09:00" -> "0900"
          };
        })
        // Sort berdasarkan jam (terkecil ke terbesar)
        .sort((a, b) => {
          return a.timeSort.localeCompare(b.timeSort);
        });

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
    // Always switch to timeline when date is selected from calendar
    if (viewMode === "calendar") {
      setViewMode("timeline");
    }
  };

  // Open detail modal
  const handleShowDetail = (agendaId, agendaType) => {
    setSelectedAgendaId(agendaId);
    setSelectedAgendaType(agendaType);
    setShowDetailModal(true);
  };

  // Close detail modal
  const handleCloseDetail = () => {
    setShowDetailModal(false);
    setSelectedAgendaId(null);
    setSelectedAgendaType(null);
  };

  // Update attendance
  const updateAttendance = async (agendaId, status) => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/agenda/${agendaId}/attendance`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status_kehadiran: status,
            catatan_kehadiran: `Update dari agenda list - ${status}`,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        // Update local state
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

  // Load agenda ketika tanggal berubah (only for timeline view)
  useEffect(() => {
    if (viewMode === "timeline") {
      fetchAgenda();
    }
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
    const colors = {
      rapat: "#3b82f6",
      audiensi: "#10b981",
      review: "#f59e0b",
      briefing: "#8b5cf6",
      undangan: "#ef4444",
    };
    return colors[type] || "#64748b";
  };

  const getAttendanceColor = (status) => {
    const colors = {
      hadir: "#10b981",
      tidak_hadir: "#ef4444",
      belum_konfirmasi: "#f59e0b",
    };
    return colors[status] || "#64748b";
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

  return (
    <DashboardLayout>
      <div
        style={{
          fontFamily: "'Poppins', sans-serif",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        {/* Header Controls */}
        <div
          style={{
            background: "white",
            padding: "24px",
            borderRadius: "20px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
            marginBottom: "24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "16px",
          }}
        >
          {/* Date Navigation - Only show for timeline view */}
          {viewMode === "timeline" && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
              }}
            >
              <button
                onClick={() => navigateDate(-1)}
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "10px",
                  border: "2px solid #e2e8f0",
                  background: "white",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "16px",
                }}
              >
                ←
              </button>

              <div style={{ textAlign: "center" }}>
                <h2
                  style={{
                    margin: "0 0 4px 0",
                    fontSize: "24px",
                    fontWeight: "700",
                    color: "#1a202c",
                  }}
                >
                  {formatDate(currentDate)}
                </h2>
                <p
                  style={{
                    margin: 0,
                    color: "#64748b",
                    fontSize: "14px",
                  }}
                >
                  {agendaData.length} agenda hari ini
                </p>
              </div>

              <button
                onClick={() => navigateDate(1)}
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "10px",
                  border: "2px solid #e2e8f0",
                  background: "white",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "16px",
                }}
              >
                →
              </button>
            </div>
          )}

          {/* Calendar view title */}
          {viewMode === "calendar" && (
            <div style={{ textAlign: "center" }}>
              <h2
                style={{
                  margin: "0 0 4px 0",
                  fontSize: "24px",
                  fontWeight: "700",
                  color: "#1a202c",
                }}
              >
                Calendar View
              </h2>
              <p
                style={{
                  margin: 0,
                  color: "#64748b",
                  fontSize: "14px",
                }}
              >
                Pilih tanggal untuk melihat agenda
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div
            style={{
              display: "flex",
              gap: "12px",
            }}
          >
            {viewMode === "timeline" && (
              <button
                onClick={fetchAgenda}
                style={{
                  padding: "10px 20px",
                  background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                  color: "white",
                  border: "none",
                  borderRadius: "10px",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                🔄 Refresh
              </button>
            )}

            <button
              onClick={() =>
                setViewMode(viewMode === "calendar" ? "timeline" : "calendar")
              }
              style={{
                padding: "10px 20px",
                background: viewMode === "calendar" ? "#3b82f6" : "#f1f5f9",
                color: viewMode === "calendar" ? "white" : "#64748b",
                border: "2px solid #e2e8f0",
                borderRadius: "10px",
                fontSize: "14px",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              {viewMode === "calendar"
                ? "📋 View Timeline"
                : "📊 View Calendar"}
            </button>
          </div>
        </div>

        {/* Calendar View */}
        {viewMode === "calendar" && (
          <CalendarView
            onDateSelect={handleDateSelect}
            currentDate={currentDate}
          />
        )}

        {/* Timeline View */}
        {viewMode === "timeline" && (
          <div
            style={{
              background: "white",
              borderRadius: "20px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
              overflow: "hidden",
            }}
          >
            {/* Timeline Header */}
            <div
              style={{
                background: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
                color: "white",
                padding: "20px 24px",
              }}
            >
              <h3
                style={{
                  margin: "0 0 8px 0",
                  fontSize: "20px",
                  fontWeight: "700",
                }}
              >
                Agenda Hari Ini
              </h3>
              <p
                style={{
                  margin: 0,
                  opacity: 0.9,
                  fontSize: "14px",
                }}
              >
                Timeline kegiatan dan acara terjadwal (diurutkan berdasarkan jam)
              </p>
            </div>

            {/* Content */}
            <div style={{ padding: "24px" }}>
              {loading ? (
                <div
                  style={{
                    textAlign: "center",
                    padding: "40px",
                    color: "#64748b",
                  }}
                >
                  <div style={{ fontSize: "32px", marginBottom: "16px" }}>⏳</div>
                  <div>Loading agenda...</div>
                </div>
              ) : error ? (
                <div
                  style={{
                    textAlign: "center",
                    padding: "40px",
                    color: "#ef4444",
                  }}
                >
                  <div style={{ fontSize: "32px", marginBottom: "16px" }}>❌</div>
                  <div>{error}</div>
                  <button
                    onClick={fetchAgenda}
                    style={{
                      marginTop: "16px",
                      padding: "8px 16px",
                      background: "#3b82f6",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer",
                    }}
                  >
                    Coba Lagi
                  </button>
                </div>
              ) : agendaData.length === 0 ? (
                <div
                  style={{
                    textAlign: "center",
                    padding: "40px",
                    color: "#64748b",
                  }}
                >
                  <div style={{ fontSize: "48px", marginBottom: "16px" }}>📅</div>
                  <h3 style={{ margin: "0 0 8px 0", fontSize: "18px" }}>
                    Tidak ada agenda hari ini
                  </h3>
                  <p style={{ margin: 0, fontSize: "14px" }}>
                    Pilih tanggal lain atau buat surat undangan/audiensi baru
                  </p>
                </div>
              ) : (
                <div
                  style={{
                    display: "grid",
                    gap: "16px",
                  }}
                >
                  {agendaData.map((item) => (
                    <div
                      key={item.id}
                      style={{
                        background: "#f8fafc",
                        borderRadius: "16px",
                        padding: "20px",
                        border: "2px solid #f1f5f9",
                        position: "relative",
                        transition: "all 0.2s ease",
                      }}
                    >
                      {/* Attendance Status Indicator */}
                      <div
                        style={{
                          position: "absolute",
                          top: "20px",
                          right: "20px",
                          width: "12px",
                          height: "12px",
                          borderRadius: "50%",
                          background: getAttendanceColor(item.attendance_status),
                        }}
                      ></div>

                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "80px 1fr auto",
                          gap: "20px",
                          alignItems: "center",
                        }}
                      >
                        {/* Time */}
                        <div style={{ textAlign: "center" }}>
                          <div
                            style={{
                              fontSize: "18px",
                              fontWeight: "700",
                              color: "#1a202c",
                              marginBottom: "4px",
                            }}
                          >
                            {item.time}
                          </div>
                          <div
                            style={{
                              fontSize: "12px",
                              color: "#64748b",
                              background: "#e2e8f0",
                              padding: "4px 8px",
                              borderRadius: "6px",
                            }}
                          >
                            {item.duration}
                          </div>
                        </div>

                        {/* Content */}
                        <div>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "12px",
                              marginBottom: "8px",
                            }}
                          >
                            <span style={{ fontSize: "20px" }}>
                              {getTypeIcon(item.type)}
                            </span>
                            <h4
                              style={{
                                margin: 0,
                                fontSize: "16px",
                                fontWeight: "600",
                                color: "#1a202c",
                              }}
                            >
                              {item.title}
                            </h4>
                            <span
                              style={{
                                background: getTypeColor(item.type),
                                color: "white",
                                padding: "4px 8px",
                                borderRadius: "6px",
                                fontSize: "11px",
                                fontWeight: "600",
                                textTransform: "uppercase",
                              }}
                            >
                              {item.type}
                            </span>
                          </div>

                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "16px",
                              fontSize: "14px",
                              color: "#64748b",
                              marginBottom: "8px",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "6px",
                              }}
                            >
                              📍 {item.location}
                            </div>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "6px",
                              }}
                            >
                              👥 {item.participants} orang
                            </div>
                            {item.no_surat && (
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "6px",
                                }}
                              >
                                📄 {item.no_surat}
                              </div>
                            )}
                          </div>

                          {/* Attendance Buttons */}
                          <div
                            style={{
                              display: "flex",
                              gap: "8px",
                              marginTop: "12px",
                            }}
                          >
                            <button
                              onClick={() => updateAttendance(item.id, "hadir")}
                              style={{
                                padding: "6px 12px",
                                background:
                                  item.attendance_status === "hadir"
                                    ? "#10b981"
                                    : "#f3f4f6",
                                color:
                                  item.attendance_status === "hadir"
                                    ? "white"
                                    : "#6b7280",
                                border: "none",
                                borderRadius: "6px",
                                fontSize: "12px",
                                fontWeight: "600",
                                cursor: "pointer",
                              }}
                            >
                              ✓ Hadir
                            </button>
                            <button
                              onClick={() =>
                                updateAttendance(item.id, "tidak_hadir")
                              }
                              style={{
                                padding: "6px 12px",
                                background:
                                  item.attendance_status === "tidak_hadir"
                                    ? "#ef4444"
                                    : "#f3f4f6",
                                color:
                                  item.attendance_status === "tidak_hadir"
                                    ? "white"
                                    : "#6b7280",
                                border: "none",
                                borderRadius: "6px",
                                fontSize: "12px",
                                fontWeight: "600",
                                cursor: "pointer",
                              }}
                            >
                              ✗ Tidak Hadir
                            </button>
                            <button
                              onClick={() =>
                                updateAttendance(item.id, "belum_konfirmasi")
                              }
                              style={{
                                padding: "6px 12px",
                                background:
                                  item.attendance_status === "belum_konfirmasi"
                                    ? "#f59e0b"
                                    : "#f3f4f6",
                                color:
                                  item.attendance_status === "belum_konfirmasi"
                                    ? "white"
                                    : "#6b7280",
                                border: "none",
                                borderRadius: "6px",
                                fontSize: "12px",
                                fontWeight: "600",
                                cursor: "pointer",
                              }}
                            >
                              ? Pending
                            </button>
                          </div>
                        </div>

                        {/* Actions */}
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "8px",
                          }}
                        >
                          <button
                            onClick={() => handleShowDetail(item.id, item.type)}
                            style={{
                              padding: "8px 12px",
                              background: "#3b82f6",
                              color: "white",
                              border: "none",
                              borderRadius: "8px",
                              fontSize: "12px",
                              fontWeight: "600",
                              cursor: "pointer",
                              transition: "all 0.2s ease",
                            }}
                            onMouseOver={(e) => {
                              e.target.style.background = "#2563eb";
                            }}
                            onMouseOut={(e) => {
                              e.target.style.background = "#3b82f6";
                            }}
                          >
                            Detail
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Quick Stats - Only show for timeline view */}
        {viewMode === "timeline" && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "16px",
              marginTop: "24px",
            }}
          >
            {[
              {
                label: "Total Agenda",
                value: agendaData.length.toString(),
                color: "#3b82f6",
                icon: "📅",
              },
              {
                label: "Hadir",
                value: agendaData
                  .filter((item) => item.attendance_status === "hadir")
                  .length.toString(),
                color: "#10b981",
                icon: "✅",
              },
              {
                label: "Tidak Hadir",
                value: agendaData
                  .filter((item) => item.attendance_status === "tidak_hadir")
                  .length.toString(),
                color: "#ef4444",
                icon: "❌",
              },
              {
                label: "Pending",
                value: agendaData
                  .filter((item) => item.attendance_status === "belum_konfirmasi")
                  .length.toString(),
                color: "#f59e0b",
                icon: "⏳",
              },
            ].map((stat, index) => (
              <div
                key={index}
                style={{
                  background: "white",
                  padding: "20px",
                  borderRadius: "16px",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontSize: "32px",
                    marginBottom: "8px",
                  }}
                >
                  {stat.icon}
                </div>
                <div
                  style={{
                    fontSize: "24px",
                    fontWeight: "700",
                    color: stat.color,
                    marginBottom: "4px",
                  }}
                >
                  {stat.value}
                </div>
                <div
                  style={{
                    fontSize: "14px",
                    color: "#64748b",
                  }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Detail Modal */}
        <AgendaDetailModal
          isOpen={showDetailModal}
          onClose={handleCloseDetail}
          agendaId={selectedAgendaId}
          agendaType={selectedAgendaType}
        />
      </div>
    </DashboardLayout>
  );
};

export default AgendaList;