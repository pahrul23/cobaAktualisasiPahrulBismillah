// Path: /frontend/src/components/Modal/AgendaDetailModal.jsx
import { useState, useEffect } from "react";

const AgendaDetailModal = ({ isOpen, onClose, agendaId, agendaType }) => {
  const [loading, setLoading] = useState(false);
  const [agendaDetail, setAgendaDetail] = useState(null);
  const [error, setError] = useState("");

  // Fetch detailed agenda information
  const fetchAgendaDetail = async () => {
    if (!agendaId) return;

    try {
      setLoading(true);
      setError("");

      console.log("=== AGENDA DETAIL DEBUG ===");
      console.log("Fetching agenda detail for ID:", agendaId);
      console.log("Agenda type:", agendaType);

      const response = await fetch(
        `http://localhost:4000/api/agenda/${agendaId}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Response status:", response.status);
      console.log("Response ok:", response.ok);

      const data = await response.json();
      console.log("=== RAW RESPONSE DATA ===");
      console.log("Full response:", data);

      if (data.success) {
        console.log("=== AGENDA DETAIL DATA ===");
        console.log("Agenda detail received:", data.data);
        console.log("Letter perihal:", data.data.letter_perihal);
        console.log("Asal surat:", data.data.asal_surat);
        console.log("Undangan pukul:", data.data.undangan_pukul);
        console.log("Undangan tempat:", data.data.undangan_tempat);
        console.log("Audiensi pukul:", data.data.audiensi_pukul);
        console.log("Audiensi tempat:", data.data.audiensi_tempat);
        console.log("================================");

        setAgendaDetail(data.data);
      } else {
        console.error("API returned error:", data);
        setError("Gagal memuat detail agenda");
      }
    } catch (error) {
      console.error("=== FETCH ERROR ===");
      console.error("Error fetching agenda detail:", error);
      console.error("Error message:", error.message);
      console.error("===================");
      setError("Terjadi kesalahan saat memuat detail");
    } finally {
      setLoading(false);
    }
  };

  // useEffect to trigger fetch when modal opens
  useEffect(() => {
    console.log("=== USEEFFECT TRIGGERED ===");
    console.log("isOpen:", isOpen);
    console.log("agendaId:", agendaId);
    
    if (isOpen && agendaId) {
      console.log("Calling fetchAgendaDetail...");
      fetchAgendaDetail();
    } else {
      console.log("Not calling fetchAgendaDetail because:");
      console.log("isOpen:", isOpen);
      console.log("agendaId:", agendaId);
    }
  }, [isOpen, agendaId]);

  // Helper functions
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return "-";
    return timeString;
  };

  const renderUndanganDetails = (details) => {
    console.log("Rendering undangan details:", details); // Debug log

    return (
      <div style={{ display: "grid", gap: "16px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "16px",
          }}
        >
          <div>
            <label
              style={{
                fontSize: "14px",
                fontWeight: "600",
                color: "#374151",
                display: "block",
                marginBottom: "4px",
              }}
            >
              Tanggal Acara
            </label>
            <div
              style={{
                padding: "8px 12px",
                background: "#f9fafb",
                borderRadius: "6px",
                fontSize: "14px",
              }}
            >
              {formatDate(
                details.undangan_tanggal_acara || details.tanggal_agenda
              )}
            </div>
          </div>
          <div>
            <label
              style={{
                fontSize: "14px",
                fontWeight: "600",
                color: "#374151",
                display: "block",
                marginBottom: "4px",
              }}
            >
              Pukul
            </label>
            <div
              style={{
                padding: "8px 12px",
                background: "#f9fafb",
                borderRadius: "6px",
                fontSize: "14px",
              }}
            >
              {formatTime(details.undangan_pukul)}
            </div>
          </div>
        </div>

        <div>
          <label
            style={{
              fontSize: "14px",
              fontWeight: "600",
              color: "#374151",
              display: "block",
              marginBottom: "4px",
            }}
          >
            Tempat
          </label>
          <div
            style={{
              padding: "8px 12px",
              background: "#f9fafb",
              borderRadius: "6px",
              fontSize: "14px",
            }}
          >
            {details.undangan_tempat || "-"}
          </div>
        </div>

        <div>
          <label
            style={{
              fontSize: "14px",
              fontWeight: "600",
              color: "#374151",
              display: "block",
              marginBottom: "4px",
            }}
          >
            Jenis Acara
          </label>
          <div
            style={{
              padding: "8px 12px",
              background: "#f9fafb",
              borderRadius: "6px",
              fontSize: "14px",
            }}
          >
            {details.jenis_acara || "-"}
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "16px",
          }}
        >
          <div>
            <label
              style={{
                fontSize: "14px",
                fontWeight: "600",
                color: "#374151",
                display: "block",
                marginBottom: "4px",
              }}
            >
              Dress Code
            </label>
            <div
              style={{
                padding: "8px 12px",
                background: "#f9fafb",
                borderRadius: "6px",
                fontSize: "14px",
              }}
            >
              {details.dress_code || "-"}
            </div>
          </div>
          <div>
            <label
              style={{
                fontSize: "14px",
                fontWeight: "600",
                color: "#374151",
                display: "block",
                marginBottom: "4px",
              }}
            >
              RSVP Required
            </label>
            <div
              style={{
                padding: "8px 12px",
                background: "#f9fafb",
                borderRadius: "6px",
                fontSize: "14px",
              }}
            >
              {details.rsvp_required === "ya"
                ? "Ya"
                : details.rsvp_required === "tidak"
                ? "Tidak"
                : "-"}
            </div>
          </div>
        </div>

        <div>
          <label
            style={{
              fontSize: "14px",
              fontWeight: "600",
              color: "#374151",
              display: "block",
              marginBottom: "4px",
            }}
          >
            Dokumentasi
          </label>
          <div
            style={{
              padding: "8px 12px",
              background: "#f9fafb",
              borderRadius: "6px",
              fontSize: "14px",
            }}
          >
            {details.undangan_dokumentasi || "-"}
          </div>
        </div>
      </div>
    );
  };

  const renderAudiensiDetails = (details) => {
    console.log("Rendering audiensi details:", details); // Debug log

    return (
      <div style={{ display: "grid", gap: "16px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "16px",
          }}
        >
          <div>
            <label
              style={{
                fontSize: "14px",
                fontWeight: "600",
                color: "#374151",
                display: "block",
                marginBottom: "4px",
              }}
            >
              Tanggal
            </label>
            <div
              style={{
                padding: "8px 12px",
                background: "#f9fafb",
                borderRadius: "6px",
                fontSize: "14px",
              }}
            >
              {formatDate(details.audiensi_tanggal || details.tanggal_agenda)}
            </div>
          </div>
          <div>
            <label
              style={{
                fontSize: "14px",
                fontWeight: "600",
                color: "#374151",
                display: "block",
                marginBottom: "4px",
              }}
            >
              Pukul
            </label>
            <div
              style={{
                padding: "8px 12px",
                background: "#f9fafb",
                borderRadius: "6px",
                fontSize: "14px",
              }}
            >
              {formatTime(details.audiensi_pukul)}
            </div>
          </div>
        </div>

        <div>
          <label
            style={{
              fontSize: "14px",
              fontWeight: "600",
              color: "#374151",
              display: "block",
              marginBottom: "4px",
            }}
          >
            Tempat
          </label>
          <div
            style={{
              padding: "8px 12px",
              background: "#f9fafb",
              borderRadius: "6px",
              fontSize: "14px",
            }}
          >
            {details.audiensi_tempat || "-"}
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "16px",
          }}
        >
          <div>
            <label
              style={{
                fontSize: "14px",
                fontWeight: "600",
                color: "#374151",
                display: "block",
                marginBottom: "4px",
              }}
            >
              Nama Pemohon
            </label>
            <div
              style={{
                padding: "8px 12px",
                background: "#f9fafb",
                borderRadius: "6px",
                fontSize: "14px",
              }}
            >
              {details.nama_pemohon || "-"}
            </div>
          </div>
          <div>
            <label
              style={{
                fontSize: "14px",
                fontWeight: "600",
                color: "#374151",
                display: "block",
                marginBottom: "4px",
              }}
            >
              Jumlah Peserta
            </label>
            <div
              style={{
                padding: "8px 12px",
                background: "#f9fafb",
                borderRadius: "6px",
                fontSize: "14px",
              }}
            >
              {details.jumlah_peserta ? `${details.jumlah_peserta} orang` : "-"}
            </div>
          </div>
        </div>

        <div>
          <label
            style={{
              fontSize: "14px",
              fontWeight: "600",
              color: "#374151",
              display: "block",
              marginBottom: "4px",
            }}
          >
            Instansi/Organisasi
          </label>
          <div
            style={{
              padding: "8px 12px",
              background: "#f9fafb",
              borderRadius: "6px",
              fontSize: "14px",
            }}
          >
            {details.instansi_organisasi || "-"}
          </div>
        </div>

        <div>
          <label
            style={{
              fontSize: "14px",
              fontWeight: "600",
              color: "#374151",
              display: "block",
              marginBottom: "4px",
            }}
          >
            Topik Audiensi
          </label>
          <div
            style={{
              padding: "8px 12px",
              background: "#f9fafb",
              borderRadius: "6px",
              fontSize: "14px",
            }}
          >
            {details.topik_audiensi || "-"}
          </div>
        </div>

        <div>
          <label
            style={{
              fontSize: "14px",
              fontWeight: "600",
              color: "#374151",
              display: "block",
              marginBottom: "4px",
            }}
          >
            Disposisi
          </label>
          <div
            style={{
              padding: "8px 12px",
              background: "#f9fafb",
              borderRadius: "6px",
              fontSize: "14px",
            }}
          >
            {details.audiensi_dokumentasi || "-"}
          </div>
        </div>
      </div>
    );
  };

  const getTypeIcon = (type) => {
    const icons = {
      undangan: "🎉",
      audiensi: "🤝",
      rapat: "🏛️",
    };
    return icons[type] || "📅";
  };

  const getTypeColor = (type) => {
    const colors = {
      undangan: "#ef4444",
      audiensi: "#10b981",
      rapat: "#3b82f6",
    };
    return colors[type] || "#64748b";
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "20px",
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "20px",
          width: "100%",
          maxWidth: "600px",
          maxHeight: "90vh",
          overflow: "auto",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: "24px 24px 0 24px",
            borderBottom: "1px solid #e5e7eb",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "16px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ fontSize: "24px" }}>
                {getTypeIcon(agendaType)}
              </span>
              <h2
                style={{
                  margin: 0,
                  fontSize: "20px",
                  fontWeight: "700",
                  color: "#1f2937",
                }}
              >
                Detail{" "}
                {agendaType === "undangan"
                  ? "Undangan"
                  : agendaType === "audiensi"
                  ? "Audiensi"
                  : "Agenda"}
              </h2>
              <span
                style={{
                  background: getTypeColor(agendaType),
                  color: "white",
                  padding: "4px 8px",
                  borderRadius: "6px",
                  fontSize: "11px",
                  fontWeight: "600",
                  textTransform: "uppercase",
                }}
              >
                {agendaType}
              </span>
            </div>
            <button
              onClick={onClose}
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "8px",
                border: "none",
                background: "#f3f4f6",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "16px",
                color: "#6b7280",
              }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: "24px" }}>
          {loading ? (
            <div
              style={{ textAlign: "center", padding: "40px", color: "#6b7280" }}
            >
              <div style={{ fontSize: "32px", marginBottom: "16px" }}>⏳</div>
              <div>Memuat detail agenda...</div>
            </div>
          ) : error ? (
            <div
              style={{ textAlign: "center", padding: "40px", color: "#ef4444" }}
            >
              <div style={{ fontSize: "32px", marginBottom: "16px" }}>❌</div>
              <div>{error}</div>
            </div>
          ) : agendaDetail ? (
            <div>
              {/* Basic Info */}
              <div style={{ marginBottom: "24px" }}>
                <h3
                  style={{
                    margin: "0 0 16px 0",
                    fontSize: "16px",
                    fontWeight: "600",
                    color: "#374151",
                  }}
                >
                  Informasi Umum
                </h3>
                <div style={{ display: "grid", gap: "12px" }}>
                  <div>
                    <label
                      style={{
                        fontSize: "14px",
                        fontWeight: "600",
                        color: "#374151",
                        display: "block",
                        marginBottom: "4px",
                      }}
                    >
                      Perihal
                    </label>
                    <div
                      style={{
                        padding: "8px 12px",
                        background: "#f9fafb",
                        borderRadius: "6px",
                        fontSize: "14px",
                      }}
                    >
                      {agendaDetail.letter_perihal || "-"}
                    </div>
                  </div>
                  <div>
                    <label
                      style={{
                        fontSize: "14px",
                        fontWeight: "600",
                        color: "#374151",
                        display: "block",
                        marginBottom: "4px",
                      }}
                    >
                      Asal Surat
                    </label>
                    <div
                      style={{
                        padding: "8px 12px",
                        background: "#f9fafb",
                        borderRadius: "6px",
                        fontSize: "14px",
                      }}
                    >
                      {agendaDetail.asal_surat || "-"}
                    </div>
                  </div>
                  {agendaDetail.letter_no_surat && (
                    <div>
                      <label
                        style={{
                          fontSize: "14px",
                          fontWeight: "600",
                          color: "#374151",
                          display: "block",
                          marginBottom: "4px",
                        }}
                      >
                        Nomor Surat
                      </label>
                      <div
                        style={{
                          padding: "8px 12px",
                          background: "#f9fafb",
                          borderRadius: "6px",
                          fontSize: "14px",
                        }}
                      >
                        {agendaDetail.letter_no_surat}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Type-specific Details */}
              <div>
                <h3
                  style={{
                    margin: "0 0 16px 0",
                    fontSize: "16px",
                    fontWeight: "600",
                    color: "#374151",
                  }}
                >
                  Detail{" "}
                  {agendaType === "undangan"
                    ? "Undangan"
                    : agendaType === "audiensi"
                    ? "Audiensi"
                    : "Agenda"}
                </h3>
                {agendaType === "undangan"
                  ? renderUndanganDetails(agendaDetail)
                  : renderAudiensiDetails(agendaDetail)}
              </div>

              {/* Status Kehadiran */}
              <div
                style={{
                  marginTop: "24px",
                  padding: "16px",
                  background: "#f8fafc",
                  borderRadius: "8px",
                }}
              >
                <h4
                  style={{
                    margin: "0 0 8px 0",
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#374151",
                  }}
                >
                  Status Kehadiran
                </h4>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <span
                    style={{
                      padding: "4px 8px",
                      borderRadius: "6px",
                      fontSize: "12px",
                      fontWeight: "600",
                      background:
                        agendaDetail.status_kehadiran === "hadir"
                          ? "#10b981"
                          : agendaDetail.status_kehadiran === "tidak_hadir"
                          ? "#ef4444"
                          : "#f59e0b",
                      color: "white",
                    }}
                  >
                    {agendaDetail.status_kehadiran === "hadir"
                      ? "Hadir"
                      : agendaDetail.status_kehadiran === "tidak_hadir"
                      ? "Tidak Hadir"
                      : "Belum Konfirmasi"}
                  </span>
                </div>
                {agendaDetail.catatan_kehadiran && (
                  <div
                    style={{
                      marginTop: "8px",
                      fontSize: "12px",
                      color: "#6b7280",
                    }}
                  >
                    {agendaDetail.catatan_kehadiran}
                  </div>
                )}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default AgendaDetailModal;