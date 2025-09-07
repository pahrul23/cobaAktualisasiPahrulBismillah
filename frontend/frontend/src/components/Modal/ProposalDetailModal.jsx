// Path: /frontend/src/components/Modal/ProposalDetailModal.jsx
import { useState, useEffect } from "react";

const ProposalDetailModal = ({ isOpen, onClose, proposalId, onStatusUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [proposalDetail, setProposalDetail] = useState(null);
  const [statusHistory, setStatusHistory] = useState([]);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("detail");

  // Fetch detailed proposal information
  const fetchProposalDetail = async () => {
    if (!proposalId) return;

    try {
      setLoading(true);
      setError("");

      const response = await fetch(`http://localhost:4000/api/proposals/${proposalId}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (data.success) {
        setProposalDetail(data.data);
      } else {
        setError("Gagal memuat detail proposal");
      }
    } catch (error) {
      console.error("Error fetching proposal detail:", error);
      setError("Terjadi kesalahan saat memuat detail");
    } finally {
      setLoading(false);
    }
  };

  // Fetch status history
  const fetchStatusHistory = async () => {
    if (!proposalId) return;

    try {
      const response = await fetch(`http://localhost:4000/api/proposals/${proposalId}/history`, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (data.success) {
        setStatusHistory(data.data);
      }
    } catch (error) {
      console.error("Error fetching status history:", error);
    }
  };

  useEffect(() => {
    if (isOpen && proposalId) {
      fetchProposalDetail();
      fetchStatusHistory();
    }
  }, [isOpen, proposalId]);

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatRupiah = (amount) => {
    if (!amount) return "Rp 0";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusInfo = (status) => {
    switch (status) {
      case "pending": return { bg: "#fef3c7", text: "#92400e", label: "Pending" };
      case "diproses": return { bg: "#dbeafe", text: "#1e40af", label: "Diproses" };
      case "verifikasi": return { bg: "#e0e7ff", text: "#5b21b6", label: "Verifikasi" };
      case "selesai": return { bg: "#d1fae5", text: "#065f46", label: "Selesai" };
      case "ditolak": return { bg: "#fee2e2", text: "#991b1b", label: "Ditolak" };
      case "ditindaklanjuti": return { bg: "#ecfdf5", text: "#064e3b", label: "Ditindaklanjuti" };
      default: return { bg: "#f3f4f6", text: "#374151", label: status };
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    if (onStatusUpdate) {
      await onStatusUpdate(proposalId, newStatus);
      // Refresh detail and history
      fetchProposalDetail();
      fetchStatusHistory();
    }
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
          maxWidth: "900px",
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
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ fontSize: "24px" }}>📋</span>
              <h2 style={{ margin: 0, fontSize: "20px", fontWeight: "700", color: "#1f2937" }}>
                Detail Proposal
              </h2>
              {proposalDetail && (
                <span
                  style={{
                    background: getStatusInfo(proposalDetail.status).bg,
                    color: getStatusInfo(proposalDetail.status).text,
                    padding: "4px 8px",
                    borderRadius: "6px",
                    fontSize: "11px",
                    fontWeight: "600",
                    textTransform: "uppercase",
                  }}
                >
                  {getStatusInfo(proposalDetail.status).label}
                </span>
              )}
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

          {/* Tabs */}
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              onClick={() => setActiveTab("detail")}
              style={{
                padding: "8px 16px",
                background: activeTab === "detail" ? "#3b82f6" : "transparent",
                color: activeTab === "detail" ? "white" : "#64748b",
                border: "none",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              Detail
            </button>
            <button
              onClick={() => setActiveTab("history")}
              style={{
                padding: "8px 16px",
                background: activeTab === "history" ? "#3b82f6" : "transparent",
                color: activeTab === "history" ? "white" : "#64748b",
                border: "none",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              Riwayat Status
            </button>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: "24px" }}>
          {loading ? (
            <div style={{ textAlign: "center", padding: "40px", color: "#6b7280" }}>
              <div style={{ fontSize: "32px", marginBottom: "16px" }}>⏳</div>
              <div>Memuat detail proposal...</div>
            </div>
          ) : error ? (
            <div style={{ textAlign: "center", padding: "40px", color: "#ef4444" }}>
              <div style={{ fontSize: "32px", marginBottom: "16px" }}>❌</div>
              <div>{error}</div>
            </div>
          ) : proposalDetail ? (
            <>
              {/* Detail Tab */}
              {activeTab === "detail" && (
                <div style={{ display: "grid", gap: "24px" }}>
                  {/* Basic Info */}
                  <div>
                    <h3 style={{ margin: "0 0 16px 0", fontSize: "16px", fontWeight: "600", color: "#374151" }}>
                      Informasi Umum
                    </h3>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                      <div>
                        <label style={{ fontSize: "14px", fontWeight: "600", color: "#374151", display: "block", marginBottom: "4px" }}>
                          Nomor Surat
                        </label>
                        <div style={{ padding: "8px 12px", background: "#f9fafb", borderRadius: "6px", fontSize: "14px" }}>
                          {proposalDetail.no_surat || "-"}
                        </div>
                      </div>
                      <div>
                        <label style={{ fontSize: "14px", fontWeight: "600", color: "#374151", display: "block", marginBottom: "4px" }}>
                          Tanggal Surat
                        </label>
                        <div style={{ padding: "8px 12px", background: "#f9fafb", borderRadius: "6px", fontSize: "14px" }}>
                          {formatDate(proposalDetail.tanggal_surat)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Proposal Details */}
                  <div>
                    <h3 style={{ margin: "0 0 16px 0", fontSize: "16px", fontWeight: "600", color: "#374151" }}>
                      Detail Proposal
                    </h3>
                    <div style={{ display: "grid", gap: "16px" }}>
                      <div>
                        <label style={{ fontSize: "14px", fontWeight: "600", color: "#374151", display: "block", marginBottom: "4px" }}>
                          Judul Proposal
                        </label>
                        <div style={{ padding: "8px 12px", background: "#f9fafb", borderRadius: "6px", fontSize: "14px" }}>
                          {proposalDetail.judul_proposal || "-"}
                        </div>
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                        <div>
                          <label style={{ fontSize: "14px", fontWeight: "600", color: "#374151", display: "block", marginBottom: "4px" }}>
                            Nama Pengirim
                          </label>
                          <div style={{ padding: "8px 12px", background: "#f9fafb", borderRadius: "6px", fontSize: "14px" }}>
                            {proposalDetail.nama_pengirim || "-"}
                          </div>
                        </div>
                        <div>
                          <label style={{ fontSize: "14px", fontWeight: "600", color: "#374151", display: "block", marginBottom: "4px" }}>
                            Instansi
                          </label>
                          <div style={{ padding: "8px 12px", background: "#f9fafb", borderRadius: "6px", fontSize: "14px" }}>
                            {proposalDetail.instansi || "-"}
                          </div>
                        </div>
                      </div>

                      <div>
                        <label style={{ fontSize: "14px", fontWeight: "600", color: "#374151", display: "block", marginBottom: "4px" }}>
                          Instansi/Lembaga/Komunitas
                        </label>
                        <div style={{ padding: "8px 12px", background: "#f9fafb", borderRadius: "6px", fontSize: "14px" }}>
                          {proposalDetail.instansi_lembaga_komunitas || "-"}
                        </div>
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                        <div>
                          <label style={{ fontSize: "14px", fontWeight: "600", color: "#374151", display: "block", marginBottom: "4px" }}>
                            Jenis Kegiatan
                          </label>
                          <div style={{ padding: "8px 12px", background: "#f9fafb", borderRadius: "6px", fontSize: "14px" }}>
                            {proposalDetail.jenis_kegiatan || "-"}
                          </div>
                        </div>
                        <div>
                          <label style={{ fontSize: "14px", fontWeight: "600", color: "#374151", display: "block", marginBottom: "4px" }}>
                            Tanggal Kegiatan
                          </label>
                          <div style={{ padding: "8px 12px", background: "#f9fafb", borderRadius: "6px", fontSize: "14px" }}>
                            {formatDate(proposalDetail.tanggal_kegiatan)}
                          </div>
                        </div>
                      </div>

                      <div>
                        <label style={{ fontSize: "14px", fontWeight: "600", color: "#374151", display: "block", marginBottom: "4px" }}>
                          Lokasi Kegiatan
                        </label>
                        <div style={{ padding: "8px 12px", background: "#f9fafb", borderRadius: "6px", fontSize: "14px" }}>
                          {proposalDetail.lokasi_kegiatan || "-"}
                        </div>
                      </div>

                      <div>
                        <label style={{ fontSize: "14px", fontWeight: "600", color: "#374151", display: "block", marginBottom: "4px" }}>
                          Ringkasan
                        </label>
                        <div style={{ padding: "8px 12px", background: "#f9fafb", borderRadius: "6px", fontSize: "14px", minHeight: "60px" }}>
                          {proposalDetail.ringkasan || "-"}
                        </div>
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                        <div>
                          <label style={{ fontSize: "14px", fontWeight: "600", color: "#374151", display: "block", marginBottom: "4px" }}>
                            Total Anggaran
                          </label>
                          <div style={{ 
                            padding: "8px 12px", 
                            background: "#ecfdf5", 
                            borderRadius: "6px", 
                            fontSize: "16px", 
                            fontWeight: "700",
                            color: "#065f46"
                          }}>
                            {formatRupiah(proposalDetail.total_anggaran)}
                          </div>
                        </div>
                        <div>
                          <label style={{ fontSize: "14px", fontWeight: "600", color: "#374151", display: "block", marginBottom: "4px" }}>
                            Jumlah Dibantu
                          </label>
                          <div style={{ padding: "8px 12px", background: "#f9fafb", borderRadius: "6px", fontSize: "14px" }}>
                            {formatRupiah(proposalDetail.jumlah_dibantu)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Administrative Info */}
                  <div>
                    <h3 style={{ margin: "0 0 16px 0", fontSize: "16px", fontWeight: "600", color: "#374151" }}>
                      Informasi Administratif
                    </h3>
                    <div style={{ display: "grid", gap: "16px" }}>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                        <div>
                          <label style={{ fontSize: "14px", fontWeight: "600", color: "#374151", display: "block", marginBottom: "4px" }}>
                            PIC Penanganan
                          </label>
                          <div style={{ padding: "8px 12px", background: "#f9fafb", borderRadius: "6px", fontSize: "14px" }}>
                            {proposalDetail.pic_penanganan || "-"}
                          </div>
                        </div>
                        <div>
                          <label style={{ fontSize: "14px", fontWeight: "600", color: "#374151", display: "block", marginBottom: "4px" }}>
                            Nomor Rekening
                          </label>
                          <div style={{ padding: "8px 12px", background: "#f9fafb", borderRadius: "6px", fontSize: "14px" }}>
                            {proposalDetail.nomor_rekening || "-"}
                          </div>
                        </div>
                      </div>

                      <div>
                        <label style={{ fontSize: "14px", fontWeight: "600", color: "#374151", display: "block", marginBottom: "4px" }}>
                          Rekomendasi Dukungan
                        </label>
                        <div style={{ padding: "8px 12px", background: "#f9fafb", borderRadius: "6px", fontSize: "14px" }}>
                          {proposalDetail.rekomendasi_dukungan || "-"}
                        </div>
                      </div>

                      <div>
                        <label style={{ fontSize: "14px", fontWeight: "600", color: "#374151", display: "block", marginBottom: "4px" }}>
                          Catatan Tindak Lanjut
                        </label>
                        <div style={{ padding: "8px 12px", background: "#f9fafb", borderRadius: "6px", fontSize: "14px", minHeight: "60px" }}>
                          {proposalDetail.catatan_tindak_lanjut || "-"}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Status Update */}
                  <div style={{ padding: "16px", background: "#f8fafc", borderRadius: "8px" }}>
                    <h4 style={{ margin: "0 0 12px 0", fontSize: "14px", fontWeight: "600", color: "#374151" }}>
                      Update Status
                    </h4>
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                      {["pending", "diproses", "verifikasi", "selesai", "ditolak", "ditindaklanjuti"].map(status => (
                        <button
                          key={status}
                          onClick={() => handleStatusUpdate(status)}
                          style={{
                            padding: "8px 16px",
                            background: proposalDetail.status === status ? getStatusInfo(status).bg : "#ffffff",
                            color: proposalDetail.status === status ? getStatusInfo(status).text : "#64748b",
                            border: `1px solid ${proposalDetail.status === status ? getStatusInfo(status).text : "#e2e8f0"}`,
                            borderRadius: "6px",
                            fontSize: "12px",
                            fontWeight: "600",
                            cursor: "pointer",
                          }}
                        >
                          {getStatusInfo(status).label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* History Tab */}
              {activeTab === "history" && (
                <div>
                  <h3 style={{ margin: "0 0 16px 0", fontSize: "16px", fontWeight: "600", color: "#374151" }}>
                    Riwayat Perubahan Status
                  </h3>
                  {statusHistory.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>
                      <div style={{ fontSize: "32px", marginBottom: "16px" }}>📋</div>
                      <div>Belum ada riwayat perubahan status</div>
                    </div>
                  ) : (
                    <div style={{ display: "grid", gap: "12px" }}>
                      {statusHistory.map((historyItem, index) => (
                        <div
                          key={index}
                          style={{
                            background: "#ffffff",
                            border: "1px solid #e5e7eb",
                            borderRadius: "8px",
                            padding: "16px",
                          }}
                        >
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                            <span
                              style={{
                                background: getStatusInfo(historyItem.status).bg,
                                color: getStatusInfo(historyItem.status).text,
                                padding: "4px 8px",
                                borderRadius: "6px",
                                fontSize: "12px",
                                fontWeight: "600",
                              }}
                            >
                              {getStatusInfo(historyItem.status).label}
                            </span>
                            <div style={{ fontSize: "12px", color: "#64748b" }}>
                              {formatDate(historyItem.created_at)}
                            </div>
                          </div>
                          <div style={{ fontSize: "13px", color: "#64748b", marginBottom: "4px" }}>
                            Oleh: {historyItem.changed_by_name || "System"}
                          </div>
                          {historyItem.notes && (
                            <div style={{ fontSize: "14px", color: "#374151" }}>
                              {historyItem.notes}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default ProposalDetailModal;