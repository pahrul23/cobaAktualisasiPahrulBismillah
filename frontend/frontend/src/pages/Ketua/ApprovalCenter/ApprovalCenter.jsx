import React, { useState, useEffect } from "react";

const ApprovalCenter = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [approvalData, setApprovalData] = useState({
    undangan: [],
    audiensi: [],
    stats: {
      totalPending: 0,
      undanganCount: 0,
      audiensiCount: 0,
    },
  });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const colors = {
    primary: {
      skyBlue: "#0ea5e9",
      teal: "#06b6d4",
      emerald: "#10b981",
      purple: "#8b5cf6",
      orange: "#f59e0b",
    },
    gradients: {
      skyBlue: "linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)",
      teal: "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)",
      emerald: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
      purple: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
      admire: "linear-gradient(135deg, #0ea5e9 0%, #06b6d4 50%, #10b981 100%)",
      sunset: "linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)",
    },
    neutral: {
      lightGray: "#e2e8f0",
      formBg: "#f8fafc",
      white: "#ffffff",
      textSecondary: "#64748b",
      textDark: "#0f172a",
      border: "#e2e8f0",
    },
  };

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    loadApprovalData();
  }, []);

  const loadApprovalData = async () => {
    try {
      setLoading(true);

      const response = await fetch("/api/approval/all", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      console.log("📡 Response status:", response.status);
      console.log("📡 Response headers:", response.headers);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        setApprovalData({
          undangan: result.data.undangan || [],
          audiensi: result.data.audiensi || [],
          stats: result.data.stats || {
            totalPending: 0,
            undanganCount: 0,
            audiensiCount: 0,
          },
        });
      } else {
        throw new Error(result.error || "Failed to fetch data");
      }
    } catch (error) {
      console.error("Error loading approval data:", error);

      // Fallback dummy data
      const dummyData = {
        undangan: [
          {
            id: 61,
            jenis: "undangan",
            no_disposisi: "0123/UND/DPD/IX/2025",
            no_surat: "045/BPSDM/IX/2025",
            asal_surat: "BPSDM Kemendagri",
            perihal: "Rapat Koordinasi Nasional Transformasi Digital",
            tanggal_terima: "2025-09-07",
            uraian:
              "Rapat koordinasi transformasi digital pemerintahan daerah.",
            label: "merah",
            status: "baru",
            hari_tanggal_acara: "2025-09-10",
            pukul: "09:39:00",
            tempat: "Ruang Rapat DPD RI",
            jenis_acara: "Rapat Koordinasi",
            status_kehadiran: "belum_konfirmasi",
            type: "undangan",
          },
        ],
        audiensi: [
          {
            id: 67,
            jenis: "audiensi",
            no_disposisi: "078/AUD/DPD/2025",
            no_surat: "456/AUDIENSI/IX/2025",
            asal_surat: "LSM Transparansi Digital Indonesia",
            perihal: "Permohonan Audiensi RUU Perlindungan Data Pribadi",
            tanggal_terima: "2025-09-08",
            uraian:
              "Audiensi terkait implementasi RUU Perlindungan Data Pribadi.",
            label: "merah",
            status: "baru",
            hari_tanggal: "2025-09-16",
            pukul: "10:00:00",
            nama_pemohon: "Budi Santoso",
            instansi_organisasi: "LSM Transparansi Bangsa",
            jumlah_peserta: 8,
            status_kehadiran: "belum_konfirmasi",
            type: "audiensi",
          },
        ],
        stats: {
          totalPending: 2,
          undanganCount: 1,
          audiensiCount: 1,
        },
      };

      setApprovalData(dummyData);
    } finally {
      setLoading(false);
    }
  };

  const handleKehadiranUpdate = async (
    type,
    letterId,
    statusKehadiran,
    catatan = ""
  ) => {
    try {
      const response = await fetch(`/api/approval/agenda/${letterId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          jenis_surat: type,
          status_kehadiran: statusKehadiran,
          catatan_kehadiran: catatan,
          created_by: 1,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Failed to update attendance status");
      }

      // Update local state
      setApprovalData((prev) => ({
        ...prev,
        [type]: prev[type].map((item) =>
          item.id === letterId
            ? {
                ...item,
                status_kehadiran: statusKehadiran,
                catatan_kehadiran: catatan,
                tanggal_konfirmasi: new Date().toISOString(),
              }
            : item
        ),
      }));

      console.log(
        `Successfully updated ${type} attendance status for letter ID ${letterId} to ${statusKehadiran}`
      );
    } catch (error) {
      console.error("Error updating attendance status:", error);
      alert("Gagal memperbarui status kehadiran. Silakan coba lagi.");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "TBD";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return "TBD";
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return "TBD";
    try {
      const time = timeString.substring(0, 5);
      return `${time} WIB`;
    } catch {
      return "TBD";
    }
  };

  const getPriorityColor = (label) => {
    switch (label) {
      case "merah":
        return { bg: "#fef2f2", color: "#dc2626", text: "Tinggi" };
      case "kuning":
        return { bg: "#fefce8", color: "#ca8a04", text: "Sedang" };
      case "hijau":
        return { bg: "#f0fdf4", color: "#16a34a", text: "Normal" };
      default:
        return { bg: "#f8fafc", color: "#64748b", text: "Normal" };
    }
  };

  const getStatusKehadiranColor = (status) => {
    switch (status) {
      case "hadir":
        return { bg: "#d1fae5", color: "#065f46" };
      case "tidak_hadir":
        return { bg: "#fee2e2", color: "#991b1b" };
      case "belum_konfirmasi":
        return { bg: "#fef3c7", color: "#92400e" };
      default:
        return { bg: "#f3f4f6", color: "#374151" };
    }
  };

  const getAllItems = () => {
    const combined = [
      ...approvalData.undangan.map((item) => ({ ...item, type: "undangan" })),
      ...approvalData.audiensi.map((item) => ({ ...item, type: "audiensi" })),
    ];
    return combined.sort(
      (a, b) =>
        new Date(b.tanggal_terima || 0) - new Date(a.tanggal_terima || 0)
    );
  };

  const filteredItems = getAllItems().filter((item) => {
    if (filter === "all") return true;
    if (filter === "urgent") return item.label === "merah";
    if (filter === "undangan") return item.type === "undangan";
    if (filter === "audiensi") return item.type === "audiensi";
    if (filter === "pending")
      return item.status_kehadiran === "belum_konfirmasi";
    return true;
  });

  // Statistics Card Component
  const StatCard = ({ title, count, icon, gradient, description }) => (
    <div
      style={{
        background: gradient,
        borderRadius: "24px",
        padding: isMobile ? "24px" : "32px",
        color: "white",
        position: "relative",
        overflow: "hidden",
        transition: "all 0.4s ease",
        cursor: "pointer",
        minHeight: isMobile ? "140px" : "160px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "-50%",
          right: "-30%",
          width: "200px",
          height: "200px",
          borderRadius: "50%",
          background: "rgba(255, 255, 255, 0.1)",
          filter: "blur(60px)",
        }}
      />

      <div style={{ position: "relative", zIndex: 2 }}>
        <div
          style={{
            fontSize: isMobile ? "36px" : "48px",
            marginBottom: "16px",
            opacity: "0.9",
          }}
        >
          {icon}
        </div>

        <div>
          <h3
            style={{
              fontSize: isMobile ? "36px" : "48px",
              fontWeight: "900",
              margin: "0 0 8px 0",
              textShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
              lineHeight: "1",
            }}
          >
            {count || 0}
          </h3>
          <p
            style={{
              fontSize: isMobile ? "14px" : "16px",
              margin: "0 0 4px 0",
              opacity: "0.95",
              fontWeight: "600",
            }}
          >
            {title}
          </p>
          <p
            style={{
              fontSize: isMobile ? "12px" : "13px",
              margin: "0",
              opacity: "0.8",
              fontWeight: "400",
            }}
          >
            {description}
          </p>
        </div>
      </div>
    </div>
  );

  // Approval Item Component
  const ApprovalItem = ({ item }) => {
    const priority = getPriorityColor(item.label);
    const statusKehadiran = getStatusKehadiranColor(item.status_kehadiran);
    const isUndangan = item.type === "undangan";

    return (
      <div
        style={{
          backgroundColor: colors.neutral.white,
          borderRadius: "20px",
          padding: isMobile ? "20px" : "24px",
          marginBottom: "16px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
          border: `1px solid ${colors.neutral.border}`,
          transition: "all 0.3s ease",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Priority bar */}
        <div
          style={{
            position: "absolute",
            top: "0",
            left: "0",
            right: "0",
            height: "4px",
            background: priority.color,
          }}
        />

        <div style={{ marginBottom: "20px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "12px",
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "4px 12px",
                borderRadius: "12px",
                fontSize: "12px",
                fontWeight: "700",
                backgroundColor: isUndangan
                  ? colors.primary.teal + "20"
                  : colors.primary.emerald + "20",
                color: isUndangan
                  ? colors.primary.teal
                  : colors.primary.emerald,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              <span>{isUndangan ? "📅" : "🤝"}</span>
              {isUndangan ? "UNDANGAN" : "AUDIENSI"}
            </div>

            <span
              style={{
                padding: "4px 12px",
                borderRadius: "12px",
                fontSize: "11px",
                fontWeight: "700",
                backgroundColor: priority.bg,
                color: priority.color,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              {priority.text}
            </span>

            <span
              style={{
                padding: "4px 12px",
                borderRadius: "12px",
                fontSize: "11px",
                fontWeight: "700",
                backgroundColor: statusKehadiran.bg,
                color: statusKehadiran.color,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              {item.status_kehadiran === "hadir"
                ? "AKAN HADIR"
                : item.status_kehadiran === "tidak_hadir"
                ? "TIDAK HADIR"
                : "BELUM KONFIRMASI"}
            </span>
          </div>

          <h3
            style={{
              fontSize: isMobile ? "16px" : "18px",
              fontWeight: "700",
              color: colors.neutral.textDark,
              margin: "0 0 12px 0",
              lineHeight: "1.3",
            }}
          >
            {item.perihal || "Judul tidak tersedia"}
          </h3>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)",
              gap: "12px",
              marginBottom: "16px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <div
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  backgroundColor: colors.primary.skyBlue,
                }}
              />
              <span
                style={{
                  fontSize: "14px",
                  color: colors.neutral.textSecondary,
                  fontWeight: "500",
                }}
              >
                {item.asal_surat || "Tidak diketahui"}
              </span>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <div
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  backgroundColor: colors.primary.emerald,
                }}
              />
              <span
                style={{
                  fontSize: "14px",
                  color: colors.neutral.textSecondary,
                  fontWeight: "500",
                }}
              >
                {formatDate(
                  isUndangan ? item.hari_tanggal_acara : item.hari_tanggal
                )}{" "}
                • {formatTime(item.pukul)}
              </span>
            </div>

            {!isUndangan && (
              <>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <div
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      backgroundColor: colors.primary.purple,
                    }}
                  />
                  <span
                    style={{
                      fontSize: "14px",
                      color: colors.neutral.textSecondary,
                      fontWeight: "500",
                    }}
                  >
                    Pemohon: {item.nama_pemohon || "TBD"}
                  </span>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <div
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      backgroundColor: colors.primary.orange,
                    }}
                  />
                  <span
                    style={{
                      fontSize: "14px",
                      color: colors.neutral.textSecondary,
                      fontWeight: "500",
                    }}
                  >
                    Peserta: {item.jumlah_peserta || "TBD"} orang
                  </span>
                </div>
              </>
            )}
          </div>

          <p
            style={{
              fontSize: "14px",
              color: colors.neutral.textSecondary,
              margin: "0 0 20px 0",
              lineHeight: "1.5",
            }}
          >
            {item.uraian
              ? item.uraian.length > 120
                ? `${item.uraian.substring(0, 120)}...`
                : item.uraian
              : "Deskripsi tidak tersedia"}
          </p>

          {/* Action buttons */}
          {item.status_kehadiran === "belum_konfirmasi" ? (
            <div
              style={{
                display: "flex",
                gap: "8px",
                flexWrap: "wrap",
              }}
            >
              <button
                onClick={() =>
                  handleKehadiranUpdate(
                    item.type,
                    item.id,
                    "hadir",
                    `Ketua akan hadir dalam ${
                      isUndangan ? "acara" : "audiensi"
                    } ini`
                  )
                }
                style={{
                  padding: "10px 20px",
                  background: colors.gradients.emerald,
                  color: "white",
                  border: "none",
                  borderRadius: "12px",
                  fontSize: "13px",
                  fontWeight: "700",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                ✅ Akan Hadir
              </button>

              <button
                onClick={() =>
                  handleKehadiranUpdate(
                    item.type,
                    item.id,
                    "tidak_hadir",
                    `Ketua berhalangan hadir dalam ${
                      isUndangan ? "acara" : "audiensi"
                    } ini`
                  )
                }
                style={{
                  padding: "10px 20px",
                  background:
                    "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                  color: "white",
                  border: "none",
                  borderRadius: "12px",
                  fontSize: "13px",
                  fontWeight: "700",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                ❌ Tidak Hadir
              </button>
            </div>
          ) : (
            <div
              style={{
                padding: "12px 16px",
                borderRadius: "12px",
                background:
                  item.status_kehadiran === "hadir"
                    ? colors.primary.emerald + "20"
                    : "#fee2e2",
                color:
                  item.status_kehadiran === "hadir"
                    ? colors.primary.emerald
                    : "#dc2626",
                textAlign: "center",
                fontWeight: "700",
                fontSize: "14px",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              {item.status_kehadiran === "hadir"
                ? "✅ Akan Hadir"
                : "❌ Tidak Hadir"}
            </div>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          flexDirection: "column",
          backgroundColor: colors.neutral.formBg,
        }}
      >
        <div
          style={{
            width: "60px",
            height: "60px",
            border: "6px solid #e2e8f0",
            borderTop: "6px solid #0ea5e9",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            marginBottom: "24px",
          }}
        />
        <div
          style={{
            fontSize: "18px",
            color: colors.neutral.textSecondary,
            fontWeight: "600",
          }}
        >
          Memuat data approval...
        </div>
      </div>
    );
  }

  return (
    <>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>

      <div
        style={{
          fontFamily: "'Inter', 'Poppins', sans-serif",
          backgroundColor: colors.neutral.formBg,
          minHeight: "100vh",
          margin: 0,
          padding: isMobile ? "16px" : "32px",
        }}
      >
        {/* Header */}
        <div
          style={{
            background: colors.gradients.admire,
            borderRadius: "32px",
            padding: isMobile ? "40px 32px" : "60px 48px",
            marginBottom: "40px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div style={{ position: "relative", zIndex: 2 }}>
            <h1
              style={{
                fontSize: isMobile ? "32px" : "48px",
                fontWeight: "900",
                color: "white",
                margin: "0 0 12px 0",
                textShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                lineHeight: "1.1",
              }}
            >
              Approval Center
            </h1>
            <p
              style={{
                fontSize: isMobile ? "16px" : "20px",
                color: "rgba(255, 255, 255, 0.9)",
                margin: "0",
                fontWeight: "500",
              }}
            >
              Kelola konfirmasi kehadiran undangan dan audiensi
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile
              ? "1fr"
              : "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "24px",
            marginBottom: "48px",
          }}
        >
          <StatCard
            title="Total Item"
            count={approvalData.stats.totalPending}
            icon="📋"
            gradient={colors.gradients.sunset}
            description="Perlu konfirmasi"
          />
          <StatCard
            title="Undangan"
            count={approvalData.stats.undanganCount}
            icon="📅"
            gradient={colors.gradients.teal}
            description="Acara & kegiatan"
          />
          <StatCard
            title="Audiensi"
            count={approvalData.stats.audiensiCount}
            icon="🤝"
            gradient={colors.gradients.emerald}
            description="Permohonan audiensi"
          />
        </div>

        {/* Filter Section */}
        <div
          style={{
            backgroundColor: colors.neutral.white,
            borderRadius: "20px",
            padding: isMobile ? "20px" : "24px",
            marginBottom: "24px",
            border: `1px solid ${colors.neutral.border}`,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              gap: "16px",
              alignItems: isMobile ? "stretch" : "center",
              justifyContent: "space-between",
            }}
          >
            <h3
              style={{
                fontSize: "18px",
                fontWeight: "700",
                color: colors.neutral.textDark,
                margin: "0",
              }}
            >
              Filter Items ({filteredItems.length} hasil)
            </h3>

            <div
              style={{
                display: "flex",
                gap: "8px",
                flexWrap: "wrap",
              }}
            >
              {[
                { key: "all", label: "Semua" },
                { key: "pending", label: "Belum Konfirmasi" },
                { key: "urgent", label: "Urgent" },
                { key: "undangan", label: "Undangan" },
                { key: "audiensi", label: "Audiensi" },
              ].map((filterOption) => (
                <button
                  key={filterOption.key}
                  onClick={() => setFilter(filterOption.key)}
                  style={{
                    padding: "8px 16px",
                    borderRadius: "8px",
                    border: "none",
                    fontSize: "14px",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    backgroundColor:
                      filter === filterOption.key
                        ? colors.primary.teal
                        : colors.neutral.lightGray,
                    color:
                      filter === filterOption.key
                        ? "white"
                        : colors.neutral.textSecondary,
                  }}
                >
                  {filterOption.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div>
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <ApprovalItem key={`${item.type}-${item.id}`} item={item} />
            ))
          ) : (
            <div
              style={{
                backgroundColor: colors.neutral.white,
                borderRadius: "20px",
                padding: "40px",
                textAlign: "center",
                border: `1px solid ${colors.neutral.border}`,
              }}
            >
              <div
                style={{ fontSize: "64px", marginBottom: "16px", opacity: 0.3 }}
              >
                📭
              </div>
              <h3
                style={{
                  fontSize: "18px",
                  fontWeight: "600",
                  color: colors.neutral.textDark,
                  margin: "0 0 8px 0",
                }}
              >
                Tidak ada data
              </h3>
              <p
                style={{
                  fontSize: "14px",
                  color: colors.neutral.textSecondary,
                  margin: "0",
                }}
              >
                Tidak ada item yang sesuai dengan filter yang dipilih
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ApprovalCenter;