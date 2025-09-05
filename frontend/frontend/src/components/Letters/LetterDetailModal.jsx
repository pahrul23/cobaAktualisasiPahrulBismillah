// Path: /frontend/src/components/Letters/LetterDetailModal.jsx
import { useState, useEffect } from "react";
import useAuth from "../../hooks/useAuth";
import DisposisiButton from './DisposisiButton';

const LetterDetailModal = ({
  letter,
  isOpen,
  onClose,
  onUpdate,
  mode = "view",
}) => {
  const { token } = useAuth();
  const [editMode, setEditMode] = useState(mode === "edit");
  const [formData, setFormData] = useState({});
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (letter) {
      setFormData({ ...letter });
    }
  }, [letter]);

  // File upload handler
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "image/jpeg",
      "image/png",
      "image/jpg",
    ];

    const validFiles = files.filter((file) => {
      if (!allowedTypes.includes(file.type)) {
        alert(
          `File ${file.name} tidak didukung. Gunakan PDF, DOC, DOCX, atau gambar.`
        );
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert(`File ${file.name} terlalu besar. Maksimal 5MB.`);
        return false;
      }
      return true;
    });

    setSelectedFiles(validFiles);
  };

  const removeFile = (index) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
  };

  const getJenisIcon = (jenis) => {
    switch (jenis) {
      case "pengaduan":
        return "📝";
      case "pemberitahuan":
        return "📢";
      case "undangan":
        return "📅";
      case "audiensi":
        return "🤝";
      case "proposal":
        return "📋";
      default:
        return "📄";
    }
  };

  const getJenisGradient = (jenis) => {
    switch (jenis) {
      case "pengaduan":
        return "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)";
      case "pemberitahuan":
        return "linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)";
      case "undangan":
        return "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)";
      case "audiensi":
        return "linear-gradient(135deg, #f59e0b 0%, #f97316 100%)";
      case "proposal":
        return "linear-gradient(135deg, #10b981 0%, #059669 100%)";
      default:
        return "linear-gradient(135deg, #6b7280 0%, #4b5563 100%)";
    }
  };

  const getLabelColor = (label) => {
    switch (label) {
      case "merah":
        return "#ef4444";
      case "kuning":
        return "#f59e0b";
      case "hijau":
        return "#10b981";
      case "hitam":
        return "#374151";
      default:
        return "#6b7280";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "baru":
        return { bg: "#fef3c7", text: "#92400e", label: "Baru" };
      case "proses":
        return { bg: "#dbeafe", text: "#1e40af", label: "Dalam Proses" };
      case "selesai":
        return { bg: "#d1fae5", text: "#065f46", label: "Selesai" };
      case "ditolak":
        return { bg: "#fee2e2", text: "#991b1b", label: "Ditolak" };
      default:
        return { bg: "#f3f4f6", text: "#374151", label: status };
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };
  // Format date untuk input HTML
  const formatDateForInput = (dateValue) => {
    if (!dateValue) return "";

    // Jika sudah format YYYY-MM-DD, return as is
    if (
      typeof dateValue === "string" &&
      dateValue.match(/^\d{4}-\d{2}-\d{2}$/)
    ) {
      return dateValue;
    }

    // Convert ke format YYYY-MM-DD
    const date = new Date(dateValue);
    if (isNaN(date.getTime())) return "";

    return date.toISOString().split("T")[0];
  };

  const handleSave = async () => {
    setLoading(true);
    setMessage("");

    try {
      // Create FormData for multipart upload
      const submitData = new FormData();

      // Append form fields
      // Append form fields dengan format tanggal yang benar
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== null && formData[key] !== undefined) {
          let value = formData[key];

          // Format semua field tanggal ke YYYY-MM-DD
          if (
            key === "tanggal_terima" ||
            key === "tanggal_surat" ||
            key === "hari_tanggal" ||
            key === "audiensi_tanggal" ||
            key === "hari_tanggal_acara" ||
            key === "tanggal_kegiatan" ||
            key === "batas_waktu_respon"
          ) {
            value = formatDateForInput(value);
          }

          submitData.append(key, value);
        }
      });

      // Append files
      selectedFiles.forEach((file) => {
        submitData.append("file_surat", file);
      });

      const response = await fetch(
        `http://localhost:4000/api/letters/${letter.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            // Don't set Content-Type for FormData
          },
          body: submitData,
        }
      );

      const data = await response.json();

      if (data.success) {
        setMessage("Surat berhasil diupdate!");
        setEditMode(false);
        onUpdate();
        setTimeout(() => {
          setMessage("");
          onClose();
        }, 3000); // Ubah dari 1500 menjadi 3000 (3 detik)
      } else {
        setMessage(data.message || "Gagal mengupdate surat");
      }
    } catch (error) {
      setMessage("Gagal menyimpan perubahan");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus surat ini?")) return;

    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:4000/api/letters/${letter.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        setMessage("Surat berhasil dihapus!");
        onUpdate();
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        setMessage(data.message || "Gagal menghapus surat");
      }
    } catch (error) {
      setMessage("Gagal menghapus surat");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !letter) return null;

  const statusInfo = getStatusColor(letter.status);
  const jenisGradient = getJenisGradient(letter.jenis);
  const labelColor = getLabelColor(letter.label);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        padding: "20px",
        backdropFilter: "blur(4px)",
      }}
    >
      <div
        style={{
          background: "white",
          borderRadius: "24px",
          width: "100%",
          maxWidth: "1200px",
          maxHeight: "95vh",
          overflow: "hidden",
          boxShadow: "0 25px 50px rgba(0, 0, 0, 0.2)",
          fontFamily: "'Poppins', sans-serif",
          position: "relative",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
        <div
          style={{
            background: jenisGradient,
            padding: "24px 32px",
            color: "white",
            position: "relative",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "-20px",
              right: "-20px",
              width: "100px",
              height: "100px",
              background: "rgba(255,255,255,0.1)",
              borderRadius: "50%",
            }}
          ></div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
              }}
            >
              <div
                style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "16px",
                  background: "rgba(255,255,255,0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "24px",
                  backdropFilter: "blur(10px)",
                }}
              >
                {getJenisIcon(letter.jenis)}
              </div>
              <div>
                <h2
                  style={{
                    margin: "0 0 4px 0",
                    fontSize: "24px",
                    fontWeight: "700",
                  }}
                >
                  {letter.no_surat}
                </h2>
                <div
                  style={{
                    fontSize: "14px",
                    opacity: 0.9,
                    textTransform: "capitalize",
                    fontWeight: "500",
                  }}
                >
                  {letter.jenis}
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                background: "rgba(255,255,255,0.2)",
                border: "none",
                color: "white",
                fontSize: "18px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backdropFilter: "blur(10px)",
              }}
            >
              ✕
            </button>
          </div>

          {/* Status dan Label */}
          <div
            style={{
              display: "flex",
              gap: "12px",
              marginTop: "16px",
            }}
          >
            <div
              style={{
                background: "rgba(255,255,255,0.2)",
                padding: "6px 12px",
                borderRadius: "12px",
                fontSize: "12px",
                fontWeight: "600",
                backdropFilter: "blur(10px)",
              }}
            >
              {statusInfo.label}
            </div>
            <div
              style={{
                background: labelColor,
                padding: "6px 12px",
                borderRadius: "12px",
                fontSize: "12px",
                fontWeight: "600",
                color: "white",
              }}
            >
              Label: {letter.label}
            </div>
          </div>
        </div>

        {/* Content - Scrollable */}
        <div
          style={{
            flex: 1,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "32px",
              // maxHeight: "calc(95vh - 200px)",
            }}
          >
            {editMode ? (
              // Edit Mode
              <div style={{ display: "grid", gap: "20px" }}>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                    gap: "16px",
                  }}
                >
                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: "14px",
                        fontWeight: "600",
                        color: "#374151",
                        marginBottom: "8px",
                      }}
                    >
                      Perihal
                    </label>
                    <input
                      type="text"
                      value={formData.perihal || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, perihal: e.target.value })
                      }
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        border: "2px solid #e5e7eb",
                        borderRadius: "12px",
                        fontSize: "14px",
                        outline: "none",
                      }}
                    />
                  </div>

                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: "14px",
                        fontWeight: "600",
                        color: "#374151",
                        marginBottom: "8px",
                      }}
                    >
                      Status
                    </label>
                    <select
                      value={formData.status || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, status: e.target.value })
                      }
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        border: "2px solid #e5e7eb",
                        borderRadius: "12px",
                        fontSize: "14px",
                        outline: "none",
                        cursor: "pointer",
                      }}
                    >
                      <option value="baru">Baru</option>
                      <option value="proses">Dalam Proses</option>
                      <option value="selesai">Selesai</option>
                      <option value="ditolak">Ditolak</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "#374151",
                      marginBottom: "8px",
                    }}
                  >
                    Uraian
                  </label>
                  <textarea
                    value={formData.uraian || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, uraian: e.target.value })
                    }
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      border: "2px solid #e5e7eb",
                      borderRadius: "12px",
                      fontSize: "14px",
                      outline: "none",
                      minHeight: "100px",
                      resize: "vertical",
                    }}
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "#374151",
                      marginBottom: "8px",
                    }}
                  >
                    Keterangan
                  </label>
                  <textarea
                    value={formData.keterangan || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, keterangan: e.target.value })
                    }
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      border: "2px solid #e5e7eb",
                      borderRadius: "12px",
                      fontSize: "14px",
                      outline: "none",
                      minHeight: "80px",
                      resize: "vertical",
                    }}
                  />
                </div>

                {/* File Upload in Edit Mode */}
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "#374151",
                      marginBottom: "8px",
                    }}
                  >
                    Tambah Lampiran File
                  </label>

                  <div
                    style={{
                      border: "2px dashed #e5e7eb",
                      borderRadius: "12px",
                      padding: "20px",
                      textAlign: "center",
                      background: "#fafbfc",
                    }}
                  >
                    <input
                      type="file"
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      style={{ display: "none" }}
                      id="edit-file-upload"
                    />

                    <label
                      htmlFor="edit-file-upload"
                      style={{
                        display: "inline-block",
                        padding: "10px 20px",
                        background: "#0ea5e9",
                        color: "white",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontSize: "13px",
                        fontWeight: "600",
                      }}
                    >
                      📎 Pilih File
                    </label>
                  </div>

                  {/* Selected Files */}
                  {selectedFiles.length > 0 && (
                    <div
                      style={{
                        marginTop: "12px",
                        padding: "12px",
                        background: "white",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                      }}
                    >
                      {selectedFiles.map((file, index) => (
                        <div
                          key={index}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            padding: "6px 10px",
                            background: "#f8fafc",
                            borderRadius: "6px",
                            marginBottom:
                              index < selectedFiles.length - 1 ? "6px" : "0",
                          }}
                        >
                          <span style={{ fontSize: "12px", color: "#374151" }}>
                            {file.name}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                            style={{
                              background: "#ef4444",
                              color: "white",
                              border: "none",
                              borderRadius: "4px",
                              padding: "4px 8px",
                              fontSize: "10px",
                              cursor: "pointer",
                            }}
                          >
                            Hapus
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {/* Field Tambahan per Jenis Surat di Edit Mode - TAMBAHKAN INI */}

                {/* AUDIENSI */}
                {formData.jenis === "audiensi" && (
                  <div
                    style={{
                      marginTop: "20px",
                      padding: "20px",
                      background: "#f0fdf4",
                      borderRadius: "16px",
                      border: "2px solid #10b981",
                    }}
                  >
                    <h3
                      style={{
                        margin: "0 0 16px 0",
                        fontSize: "16px",
                        fontWeight: "700",
                        color: "#059669",
                      }}
                    >
                      Edit Field Audiensi
                    </h3>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(auto-fit, minmax(250px, 1fr))",
                        gap: "16px",
                      }}
                    >
                      <div>
                        <label
                          style={{
                            display: "block",
                            fontSize: "14px",
                            fontWeight: "600",
                            color: "#374151",
                            marginBottom: "8px",
                          }}
                        >
                          Hari/Tanggal
                        </label>
                        <input
                          type="date"
                          value={formData.hari_tanggal || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              hari_tanggal: e.target.value,
                            })
                          }
                          style={{
                            width: "100%",
                            padding: "12px 16px",
                            border: "2px solid #e5e7eb",
                            borderRadius: "12px",
                            fontSize: "14px",
                            outline: "none",
                          }}
                        />
                      </div>
                      <div>
                        <label
                          style={{
                            display: "block",
                            fontSize: "14px",
                            fontWeight: "600",
                            color: "#374151",
                            marginBottom: "8px",
                          }}
                        >
                          Pukul
                        </label>
                        <input
                          type="time"
                          value={formData.pukul || ""}
                          onChange={(e) =>
                            setFormData({ ...formData, pukul: e.target.value })
                          }
                          style={{
                            width: "100%",
                            padding: "12px 16px",
                            border: "2px solid #e5e7eb",
                            borderRadius: "12px",
                            fontSize: "14px",
                            outline: "none",
                          }}
                        />
                      </div>
                      <div>
                        <label
                          style={{
                            display: "block",
                            fontSize: "14px",
                            fontWeight: "600",
                            color: "#374151",
                            marginBottom: "8px",
                          }}
                        >
                          Tempat
                        </label>
                        <input
                          type="text"
                          value={formData.tempat || ""}
                          onChange={(e) =>
                            setFormData({ ...formData, tempat: e.target.value })
                          }
                          style={{
                            width: "100%",
                            padding: "12px 16px",
                            border: "2px solid #e5e7eb",
                            borderRadius: "12px",
                            fontSize: "14px",
                            outline: "none",
                          }}
                        />
                      </div>
                      <div>
                        <label
                          style={{
                            display: "block",
                            fontSize: "14px",
                            fontWeight: "600",
                            color: "#374151",
                            marginBottom: "8px",
                          }}
                        >
                          Nama Pemohon
                        </label>
                        <input
                          type="text"
                          value={formData.nama_pemohon || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              nama_pemohon: e.target.value,
                            })
                          }
                          style={{
                            width: "100%",
                            padding: "12px 16px",
                            border: "2px solid #e5e7eb",
                            borderRadius: "12px",
                            fontSize: "14px",
                            outline: "none",
                          }}
                        />
                      </div>
                      <div>
                        <label
                          style={{
                            display: "block",
                            fontSize: "14px",
                            fontWeight: "600",
                            color: "#374151",
                            marginBottom: "8px",
                          }}
                        >
                          Instansi/Organisasi
                        </label>
                        <input
                          type="text"
                          value={formData.instansi_organisasi || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              instansi_organisasi: e.target.value,
                            })
                          }
                          style={{
                            width: "100%",
                            padding: "12px 16px",
                            border: "2px solid #e5e7eb",
                            borderRadius: "12px",
                            fontSize: "14px",
                            outline: "none",
                          }}
                        />
                      </div>
                      <div>
                        <label
                          style={{
                            display: "block",
                            fontSize: "14px",
                            fontWeight: "600",
                            color: "#374151",
                            marginBottom: "8px",
                          }}
                        >
                          Jumlah Peserta
                        </label>
                        <input
                          type="number"
                          value={formData.jumlah_peserta || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              jumlah_peserta: e.target.value,
                            })
                          }
                          style={{
                            width: "100%",
                            padding: "12px 16px",
                            border: "2px solid #e5e7eb",
                            borderRadius: "12px",
                            fontSize: "14px",
                            outline: "none",
                          }}
                        />
                      </div>
                    </div>
                    <div style={{ marginTop: "16px" }}>
                      <label
                        style={{
                          display: "block",
                          fontSize: "14px",
                          fontWeight: "600",
                          color: "#374151",
                          marginBottom: "8px",
                        }}
                      >
                        Topik Audiensi
                      </label>
                      <textarea
                        value={formData.topik_audiensi || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            topik_audiensi: e.target.value,
                          })
                        }
                        style={{
                          width: "100%",
                          padding: "12px 16px",
                          border: "2px solid #e5e7eb",
                          borderRadius: "12px",
                          fontSize: "14px",
                          outline: "none",
                          minHeight: "80px",
                          resize: "vertical",
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* UNDANGAN */}
                {formData.jenis === "undangan" && (
                  <div
                    style={{
                      marginTop: "20px",
                      padding: "20px",
                      background: "#f0f9ff",
                      borderRadius: "16px",
                      border: "2px solid #0ea5e9",
                    }}
                  >
                    <h3
                      style={{
                        margin: "0 0 16px 0",
                        fontSize: "16px",
                        fontWeight: "700",
                        color: "#0369a1",
                      }}
                    >
                      Edit Field Undangan
                    </h3>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(auto-fit, minmax(250px, 1fr))",
                        gap: "16px",
                      }}
                    >
                      <div>
                        <label
                          style={{
                            display: "block",
                            fontSize: "14px",
                            fontWeight: "600",
                            color: "#374151",
                            marginBottom: "8px",
                          }}
                        >
                          Hari/Tanggal Acara
                        </label>
                        <input
                          type="date"
                          value={formData.hari_tanggal_acara || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              hari_tanggal_acara: e.target.value,
                            })
                          }
                          style={{
                            width: "100%",
                            padding: "12px 16px",
                            border: "2px solid #e5e7eb",
                            borderRadius: "12px",
                            fontSize: "14px",
                            outline: "none",
                          }}
                        />
                      </div>
                      <div>
                        <label
                          style={{
                            display: "block",
                            fontSize: "14px",
                            fontWeight: "600",
                            color: "#374151",
                            marginBottom: "8px",
                          }}
                        >
                          Pukul
                        </label>
                        <input
                          type="time"
                          value={formData.pukul || ""}
                          onChange={(e) =>
                            setFormData({ ...formData, pukul: e.target.value })
                          }
                          style={{
                            width: "100%",
                            padding: "12px 16px",
                            border: "2px solid #e5e7eb",
                            borderRadius: "12px",
                            fontSize: "14px",
                            outline: "none",
                          }}
                        />
                      </div>
                      <div>
                        <label
                          style={{
                            display: "block",
                            fontSize: "14px",
                            fontWeight: "600",
                            color: "#374151",
                            marginBottom: "8px",
                          }}
                        >
                          Tempat
                        </label>
                        <input
                          type="text"
                          value={formData.tempat || ""}
                          onChange={(e) =>
                            setFormData({ ...formData, tempat: e.target.value })
                          }
                          style={{
                            width: "100%",
                            padding: "12px 16px",
                            border: "2px solid #e5e7eb",
                            borderRadius: "12px",
                            fontSize: "14px",
                            outline: "none",
                          }}
                        />
                      </div>
                      <div>
                        <label
                          style={{
                            display: "block",
                            fontSize: "14px",
                            fontWeight: "600",
                            color: "#374151",
                            marginBottom: "8px",
                          }}
                        >
                          Jenis Acara
                        </label>
                        <input
                          type="text"
                          value={formData.jenis_acara || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              jenis_acara: e.target.value,
                            })
                          }
                          style={{
                            width: "100%",
                            padding: "12px 16px",
                            border: "2px solid #e5e7eb",
                            borderRadius: "12px",
                            fontSize: "14px",
                            outline: "none",
                          }}
                        />
                      </div>
                      <div>
                        <label
                          style={{
                            display: "block",
                            fontSize: "14px",
                            fontWeight: "600",
                            color: "#374151",
                            marginBottom: "8px",
                          }}
                        >
                          Dress Code
                        </label>
                        <input
                          type="text"
                          value={formData.dress_code || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              dress_code: e.target.value,
                            })
                          }
                          style={{
                            width: "100%",
                            padding: "12px 16px",
                            border: "2px solid #e5e7eb",
                            borderRadius: "12px",
                            fontSize: "14px",
                            outline: "none",
                          }}
                        />
                      </div>
                      <div>
                        <label
                          style={{
                            display: "block",
                            fontSize: "14px",
                            fontWeight: "600",
                            color: "#374151",
                            marginBottom: "8px",
                          }}
                        >
                          RSVP Required
                        </label>
                        <select
                          value={formData.rsvp_required || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              rsvp_required: e.target.value,
                            })
                          }
                          style={{
                            width: "100%",
                            padding: "12px 16px",
                            border: "2px solid #e5e7eb",
                            borderRadius: "12px",
                            fontSize: "14px",
                            outline: "none",
                            cursor: "pointer",
                          }}
                        >
                          <option value="">Pilih</option>
                          <option value="ya">Ya</option>
                          <option value="tidak">Tidak</option>
                        </select>
                      </div>
                    </div>
                    <div style={{ marginTop: "16px" }}>
                      <label
                        style={{
                          display: "block",
                          fontSize: "14px",
                          fontWeight: "600",
                          color: "#374151",
                          marginBottom: "8px",
                        }}
                      >
                        Dokumentasi
                      </label>
                      <textarea
                        value={formData.dokumentasi || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            dokumentasi: e.target.value,
                          })
                        }
                        style={{
                          width: "100%",
                          padding: "12px 16px",
                          border: "2px solid #e5e7eb",
                          borderRadius: "12px",
                          fontSize: "14px",
                          outline: "none",
                          minHeight: "80px",
                          resize: "vertical",
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* PROPOSAL */}
                {formData.jenis === "proposal" && (
                  <div
                    style={{
                      marginTop: "20px",
                      padding: "20px",
                      background: "#fff7ed",
                      borderRadius: "16px",
                      border: "2px solid #f97316",
                    }}
                  >
                    <h3
                      style={{
                        margin: "0 0 16px 0",
                        fontSize: "16px",
                        fontWeight: "700",
                        color: "#ea580c",
                      }}
                    >
                      Edit Field Proposal
                    </h3>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(auto-fit, minmax(250px, 1fr))",
                        gap: "16px",
                      }}
                    >
                      <div>
                        <label
                          style={{
                            display: "block",
                            fontSize: "14px",
                            fontWeight: "600",
                            color: "#374151",
                            marginBottom: "8px",
                          }}
                        >
                          Nama Pengirim
                        </label>
                        <input
                          type="text"
                          value={formData.nama_pengirim || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              nama_pengirim: e.target.value,
                            })
                          }
                          style={{
                            width: "100%",
                            padding: "12px 16px",
                            border: "2px solid #e5e7eb",
                            borderRadius: "12px",
                            fontSize: "14px",
                            outline: "none",
                          }}
                        />
                      </div>
                      <div>
                        <label
                          style={{
                            display: "block",
                            fontSize: "14px",
                            fontWeight: "600",
                            color: "#374151",
                            marginBottom: "8px",
                          }}
                        >
                          Instansi/Lembaga
                        </label>
                        <input
                          type="text"
                          value={formData.instansi_lembaga_komunitas || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              instansi_lembaga_komunitas: e.target.value,
                            })
                          }
                          style={{
                            width: "100%",
                            padding: "12px 16px",
                            border: "2px solid #e5e7eb",
                            borderRadius: "12px",
                            fontSize: "14px",
                            outline: "none",
                          }}
                        />
                      </div>
                      <div>
                        <label
                          style={{
                            display: "block",
                            fontSize: "14px",
                            fontWeight: "600",
                            color: "#374151",
                            marginBottom: "8px",
                          }}
                        >
                          Judul Proposal
                        </label>
                        <input
                          type="text"
                          value={formData.judul_proposal || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              judul_proposal: e.target.value,
                            })
                          }
                          style={{
                            width: "100%",
                            padding: "12px 16px",
                            border: "2px solid #e5e7eb",
                            borderRadius: "12px",
                            fontSize: "14px",
                            outline: "none",
                          }}
                        />
                      </div>
                      <div>
                        <label
                          style={{
                            display: "block",
                            fontSize: "14px",
                            fontWeight: "600",
                            color: "#374151",
                            marginBottom: "8px",
                          }}
                        >
                          Jenis Kegiatan
                        </label>
                        <select
                          value={formData.jenis_kegiatan || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              jenis_kegiatan: e.target.value,
                            })
                          }
                          style={{
                            width: "100%",
                            padding: "12px 16px",
                            border: "2px solid #e5e7eb",
                            borderRadius: "12px",
                            fontSize: "14px",
                            outline: "none",
                            cursor: "pointer",
                          }}
                        >
                          <option value="">Pilih jenis kegiatan</option>
                          <option value="sosial">Sosial</option>
                          <option value="pendidikan">Pendidikan</option>
                          <option value="kesehatan">Kesehatan</option>
                          <option value="ekonomi">Ekonomi</option>
                          <option value="budaya">Budaya</option>
                          <option value="lingkungan">Lingkungan</option>
                          <option value="lainnya">Lainnya</option>
                        </select>
                      </div>
                      <div>
                        <label
                          style={{
                            display: "block",
                            fontSize: "14px",
                            fontWeight: "600",
                            color: "#374151",
                            marginBottom: "8px",
                          }}
                        >
                          Tanggal Kegiatan
                        </label>
                        <input
                          type="date"
                          value={formData.tanggal_kegiatan || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              tanggal_kegiatan: e.target.value,
                            })
                          }
                          style={{
                            width: "100%",
                            padding: "12px 16px",
                            border: "2px solid #e5e7eb",
                            borderRadius: "12px",
                            fontSize: "14px",
                            outline: "none",
                          }}
                        />
                      </div>
                      <div>
                        <label
                          style={{
                            display: "block",
                            fontSize: "14px",
                            fontWeight: "600",
                            color: "#374151",
                            marginBottom: "8px",
                          }}
                        >
                          Total Anggaran
                        </label>
                        <input
                          type="number"
                          value={formData.total_anggaran || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              total_anggaran: e.target.value,
                            })
                          }
                          style={{
                            width: "100%",
                            padding: "12px 16px",
                            border: "2px solid #e5e7eb",
                            borderRadius: "12px",
                            fontSize: "14px",
                            outline: "none",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* PENGADUAN */}
                {formData.jenis === "pengaduan" && (
                  <div
                    style={{
                      marginTop: "20px",
                      padding: "20px",
                      background: "#fef3c7",
                      borderRadius: "16px",
                      border: "2px solid #f59e0b",
                    }}
                  >
                    <h3
                      style={{
                        margin: "0 0 16px 0",
                        fontSize: "16px",
                        fontWeight: "700",
                        color: "#92400e",
                      }}
                    >
                      Edit Field Pengaduan
                    </h3>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(auto-fit, minmax(250px, 1fr))",
                        gap: "16px",
                      }}
                    >
                      <div>
                        <label
                          style={{
                            display: "block",
                            fontSize: "14px",
                            fontWeight: "600",
                            color: "#374151",
                            marginBottom: "8px",
                          }}
                        >
                          Jenis Pengaduan
                        </label>
                        <select
                          value={formData.jenis_pengaduan || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              jenis_pengaduan: e.target.value,
                            })
                          }
                          style={{
                            width: "100%",
                            padding: "12px 16px",
                            border: "2px solid #e5e7eb",
                            borderRadius: "12px",
                            fontSize: "14px",
                            outline: "none",
                            cursor: "pointer",
                          }}
                        >
                          <option value="">Pilih jenis pengaduan</option>
                          <option value="pelayanan_publik">
                            Pelayanan Publik
                          </option>
                          <option value="korupsi">Korupsi</option>
                          <option value="lingkungan">Lingkungan</option>
                          <option value="infrastruktur">Infrastruktur</option>
                          <option value="lainnya">Lainnya</option>
                        </select>
                      </div>
                      <div>
                        <label
                          style={{
                            display: "block",
                            fontSize: "14px",
                            fontWeight: "600",
                            color: "#374151",
                            marginBottom: "8px",
                          }}
                        >
                          Tingkat Urgensi
                        </label>
                        <select
                          value={formData.tingkat_urgensi || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              tingkat_urgensi: e.target.value,
                            })
                          }
                          style={{
                            width: "100%",
                            padding: "12px 16px",
                            border: "2px solid #e5e7eb",
                            borderRadius: "12px",
                            fontSize: "14px",
                            outline: "none",
                            cursor: "pointer",
                          }}
                        >
                          <option value="">Pilih tingkat urgensi</option>
                          <option value="rendah">Rendah</option>
                          <option value="sedang">Sedang</option>
                          <option value="tinggi">Tinggi</option>
                          <option value="sangat_tinggi">Sangat Tinggi</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* PEMBERITAHUAN */}
                {formData.jenis === "pemberitahuan" && (
                  <div
                    style={{
                      marginTop: "20px",
                      padding: "20px",
                      background: "#fef2f2",
                      borderRadius: "16px",
                      border: "2px solid #ef4444",
                    }}
                  >
                    <h3
                      style={{
                        margin: "0 0 16px 0",
                        fontSize: "16px",
                        fontWeight: "700",
                        color: "#dc2626",
                      }}
                    >
                      Edit Field Pemberitahuan
                    </h3>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(auto-fit, minmax(250px, 1fr))",
                        gap: "16px",
                      }}
                    >
                      <div>
                        <label
                          style={{
                            display: "block",
                            fontSize: "14px",
                            fontWeight: "600",
                            color: "#374151",
                            marginBottom: "8px",
                          }}
                        >
                          Kategori
                        </label>
                        <select
                          value={formData.kategori_pemberitahuan || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              kategori_pemberitahuan: e.target.value,
                            })
                          }
                          style={{
                            width: "100%",
                            padding: "12px 16px",
                            border: "2px solid #e5e7eb",
                            borderRadius: "12px",
                            fontSize: "14px",
                            outline: "none",
                            cursor: "pointer",
                          }}
                        >
                          <option value="">Pilih kategori</option>
                          <option value="informasi_umum">Informasi Umum</option>
                          <option value="kebijakan_baru">Kebijakan Baru</option>
                          <option value="perubahan_jadwal">
                            Perubahan Jadwal
                          </option>
                          <option value="peringatan">Peringatan</option>
                          <option value="lainnya">Lainnya</option>
                        </select>
                      </div>
                      <div>
                        <label
                          style={{
                            display: "block",
                            fontSize: "14px",
                            fontWeight: "600",
                            color: "#374151",
                            marginBottom: "8px",
                          }}
                        >
                          Tingkat Prioritas
                        </label>
                        <select
                          value={formData.tingkat_prioritas || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              tingkat_prioritas: e.target.value,
                            })
                          }
                          style={{
                            width: "100%",
                            padding: "12px 16px",
                            border: "2px solid #e5e7eb",
                            borderRadius: "12px",
                            fontSize: "14px",
                            outline: "none",
                            cursor: "pointer",
                          }}
                        >
                          <option value="">Pilih prioritas</option>
                          <option value="rendah">Rendah</option>
                          <option value="normal">Normal</option>
                          <option value="tinggi">Tinggi</option>
                          <option value="mendesak">Mendesak</option>
                        </select>
                      </div>
                      <div>
                        <label
                          style={{
                            display: "block",
                            fontSize: "14px",
                            fontWeight: "600",
                            color: "#374151",
                            marginBottom: "8px",
                          }}
                        >
                          Batas Waktu Respon
                        </label>
                        <input
                          type="date"
                          value={formData.batas_waktu_respon || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              batas_waktu_respon: e.target.value,
                            })
                          }
                          style={{
                            width: "100%",
                            padding: "12px 16px",
                            border: "2px solid #e5e7eb",
                            borderRadius: "12px",
                            fontSize: "14px",
                            outline: "none",
                          }}
                        />
                      </div>
                      <div>
                        <label
                          style={{
                            display: "block",
                            fontSize: "14px",
                            fontWeight: "600",
                            color: "#374151",
                            marginBottom: "8px",
                          }}
                        >
                          Follow Up Required
                        </label>
                        <select
                          value={formData.follow_up_required || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              follow_up_required: e.target.value,
                            })
                          }
                          style={{
                            width: "100%",
                            padding: "12px 16px",
                            border: "2px solid #e5e7eb",
                            borderRadius: "12px",
                            fontSize: "14px",
                            outline: "none",
                            cursor: "pointer",
                          }}
                        >
                          <option value="">Pilih</option>
                          <option value="ya">Ya</option>
                          <option value="tidak">Tidak</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* AKHIR TAMBAHAN */}
              </div>
            ) : (
              // View Mode
              <div style={{ display: "grid", gap: "24px" }}>
                {/* Info Grid */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                    gap: "20px",
                  }}
                >
                  <div
                    style={{
                      background: "#f8fafc",
                      padding: "16px 20px",
                      borderRadius: "12px",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "12px",
                        color: "#64748b",
                        marginBottom: "4px",
                        fontWeight: "500",
                      }}
                    >
                      No Disposisi
                    </div>
                    <div
                      style={{
                        fontSize: "16px",
                        fontWeight: "700",
                        color: "#1a202c",
                      }}
                    >
                      {letter.no_disposisi}
                    </div>
                  </div>

                  <div
                    style={{
                      background: "#f8fafc",
                      padding: "16px 20px",
                      borderRadius: "12px",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "12px",
                        color: "#64748b",
                        marginBottom: "4px",
                        fontWeight: "500",
                      }}
                    >
                      Asal Surat
                    </div>
                    <div
                      style={{
                        fontSize: "16px",
                        fontWeight: "700",
                        color: "#1a202c",
                      }}
                    >
                      {letter.asal_surat}
                    </div>
                  </div>

                  <div
                    style={{
                      background: "#f8fafc",
                      padding: "16px 20px",
                      borderRadius: "12px",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "12px",
                        color: "#64748b",
                        marginBottom: "4px",
                        fontWeight: "500",
                      }}
                    >
                      Tanggal Terima
                    </div>
                    <div
                      style={{
                        fontSize: "16px",
                        fontWeight: "700",
                        color: "#1a202c",
                      }}
                    >
                      {formatDate(letter.tanggal_terima)}
                    </div>
                  </div>

                  <div
                    style={{
                      background: "#f8fafc",
                      padding: "16px 20px",
                      borderRadius: "12px",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "12px",
                        color: "#64748b",
                        marginBottom: "4px",
                        fontWeight: "500",
                      }}
                    >
                      Tanggal Surat
                    </div>
                    <div
                      style={{
                        fontSize: "16px",
                        fontWeight: "700",
                        color: "#1a202c",
                      }}
                    >
                      {formatDate(letter.tanggal_surat)}
                    </div>
                  </div>
                </div>

                {/* Perihal */}
                <div>
                  <h3
                    style={{
                      margin: "0 0 12px 0",
                      fontSize: "18px",
                      fontWeight: "700",
                      color: "#1a202c",
                    }}
                  >
                    Perihal
                  </h3>
                  <div
                    style={{
                      background: "#f8fafc",
                      padding: "20px",
                      borderRadius: "16px",
                      fontSize: "16px",
                      color: "#374151",
                      lineHeight: "1.6",
                    }}
                  >
                    {letter.perihal}
                  </div>
                </div>

                {/* Uraian */}
                <div>
                  <h3
                    style={{
                      margin: "0 0 12px 0",
                      fontSize: "18px",
                      fontWeight: "700",
                      color: "#1a202c",
                    }}
                  >
                    Uraian
                  </h3>
                  <div
                    style={{
                      background: "#f8fafc",
                      padding: "20px",
                      borderRadius: "16px",
                      fontSize: "15px",
                      color: "#374151",
                      lineHeight: "1.7",
                    }}
                  >
                    {letter.uraian}
                  </div>
                </div>

                {/* Keterangan */}
                {letter.keterangan && (
                  <div>
                    <h3
                      style={{
                        margin: "0 0 12px 0",
                        fontSize: "18px",
                        fontWeight: "700",
                        color: "#1a202c",
                      }}
                    >
                      Keterangan
                    </h3>
                    <div
                      style={{
                        background: "#fef3c7",
                        padding: "16px 20px",
                        borderRadius: "12px",
                        fontSize: "14px",
                        color: "#92400e",
                        fontStyle: "italic",
                        border: "1px solid #fbbf24",
                      }}
                    >
                      {letter.keterangan}
                    </div>
                  </div>
                )}

                {/* File attachments section - FIXED */}
                <div>
                  <h3
                    style={{
                      margin: "0 0 12px 0",
                      fontSize: "18px",
                      fontWeight: "700",
                      color: "#1a202c",
                    }}
                  >
                    Lampiran File
                  </h3>

                  {/* Cek apakah ada file */}
                  {letter.file_surat_name ? (
                    <div
                      style={{
                        background: "#f0f9ff",
                        border: "2px solid #0ea5e9",
                        padding: "16px 20px",
                        borderRadius: "16px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                        }}
                      >
                        <div
                          style={{
                            width: "40px",
                            height: "40px",
                            background: "#0ea5e9",
                            borderRadius: "8px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "white",
                            fontSize: "18px",
                          }}
                        >
                          📄
                        </div>
                        <div>
                          <div
                            style={{
                              fontSize: "14px",
                              fontWeight: "600",
                              color: "#1e293b",
                              marginBottom: "2px",
                            }}
                          >
                            {letter.file_surat_name}
                          </div>
                          <div
                            style={{
                              fontSize: "12px",
                              color: "#64748b",
                            }}
                          >
                            {letter.file_surat_size
                              ? `${Math.round(
                                  letter.file_surat_size / 1024
                                )} KB`
                              : "File tersedia"}
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() =>
                          window.open(
                            `http://localhost:4000/${letter.file_surat}`,
                            "_blank"
                          )
                        }
                        style={{
                          padding: "8px 16px",
                          background: "#0ea5e9",
                          color: "white",
                          border: "none",
                          borderRadius: "8px",
                          fontSize: "12px",
                          fontWeight: "600",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                        }}
                      >
                        👁️ Lihat
                      </button>
                    </div>
                  ) : (
                    <div
                      style={{
                        background: "#f8fafc",
                        padding: "20px",
                        borderRadius: "16px",
                        fontSize: "14px",
                        color: "#64748b",
                        textAlign: "center",
                      }}
                    >
                      Tidak ada file yang dilampirkan
                    </div>
                  )}
                </div>

                {/* TAMBAHKAN INI - Field Tambahan per Jenis Surat */}
                {letter.jenis === "undangan" && (
                  <div>
                    <h3
                      style={{
                        margin: "0 0 12px 0",
                        fontSize: "18px",
                        fontWeight: "700",
                        color: "#1a202c",
                      }}
                    >
                      Detail Undangan
                    </h3>
                    <div
                      style={{
                        background: "#f0f9ff",
                        padding: "20px",
                        borderRadius: "16px",
                        border: "2px solid #0ea5e9",
                      }}
                    >
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns:
                            "repeat(auto-fit, minmax(200px, 1fr))",
                          gap: "16px",
                        }}
                      >
                        <div>
                          <div
                            style={{
                              fontSize: "12px",
                              color: "#64748b",
                              fontWeight: "500",
                            }}
                          >
                            Tanggal Acara
                          </div>
                          <div
                            style={{
                              fontSize: "14px",
                              fontWeight: "600",
                              color: "#1a202c",
                            }}
                          >
                            {letter.hari_tanggal_acara
                              ? formatDate(letter.hari_tanggal_acara)
                              : "-"}
                          </div>
                        </div>
                        <div>
                          <div
                            style={{
                              fontSize: "12px",
                              color: "#64748b",
                              fontWeight: "500",
                            }}
                          >
                            Pukul
                          </div>
                          <div
                            style={{
                              fontSize: "14px",
                              fontWeight: "600",
                              color: "#1a202c",
                            }}
                          >
                            {letter.undangan_pukul || "-"}
                          </div>
                        </div>
                        <div>
                          <div
                            style={{
                              fontSize: "12px",
                              color: "#64748b",
                              fontWeight: "500",
                            }}
                          >
                            Tempat
                          </div>
                          <div
                            style={{
                              fontSize: "14px",
                              fontWeight: "600",
                              color: "#1a202c",
                            }}
                          >
                            {letter.undangan_tempat || "-"}
                          </div>
                        </div>
                        <div>
                          <div
                            style={{
                              fontSize: "12px",
                              color: "#64748b",
                              fontWeight: "500",
                            }}
                          >
                            Jenis Acara
                          </div>
                          <div
                            style={{
                              fontSize: "14px",
                              fontWeight: "600",
                              color: "#1a202c",
                            }}
                          >
                            {letter.jenis_acara || "-"}
                          </div>
                        </div>
                        <div>
                          <div
                            style={{
                              fontSize: "12px",
                              color: "#64748b",
                              fontWeight: "500",
                            }}
                          >
                            Dress Code
                          </div>
                          <div
                            style={{
                              fontSize: "14px",
                              fontWeight: "600",
                              color: "#1a202c",
                            }}
                          >
                            {letter.dress_code || "-"}
                          </div>
                        </div>
                        <div>
                          <div
                            style={{
                              fontSize: "12px",
                              color: "#64748b",
                              fontWeight: "500",
                            }}
                          >
                            RSVP Required
                          </div>
                          <div
                            style={{
                              fontSize: "14px",
                              fontWeight: "600",
                              color: "#1a202c",
                            }}
                          >
                            {letter.rsvp_required || "-"}
                          </div>
                        </div>
                      </div>
                      {letter.undangan_dokumentasi && (
                        <div style={{ marginTop: "16px" }}>
                          <div
                            style={{
                              fontSize: "12px",
                              color: "#64748b",
                              fontWeight: "500",
                            }}
                          >
                            Dokumentasi
                          </div>
                          <div
                            style={{
                              fontSize: "14px",
                              color: "#374151",
                              lineHeight: "1.5",
                              marginTop: "4px",
                            }}
                          >
                            {letter.undangan_dokumentasi}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                {letter.jenis === "audiensi" && (
                  <div>
                    <h3
                      style={{
                        margin: "0 0 12px 0",
                        fontSize: "18px",
                        fontWeight: "700",
                        color: "#1a202c",
                      }}
                    >
                      Detail Audiensi
                    </h3>
                    <div
                      style={{
                        background: "#f0fdf4",
                        padding: "20px",
                        borderRadius: "16px",
                        border: "2px solid #10b981",
                      }}
                    >
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns:
                            "repeat(auto-fit, minmax(200px, 1fr))",
                          gap: "16px",
                        }}
                      >
                        <div>
                          <div
                            style={{
                              fontSize: "12px",
                              color: "#64748b",
                              fontWeight: "500",
                            }}
                          >
                            Hari/Tanggal
                          </div>
                          <div
                            style={{
                              fontSize: "14px",
                              fontWeight: "600",
                              color: "#1a202c",
                            }}
                          >
                            {letter.audiensi_tanggal
                              ? formatDate(letter.audiensi_tanggal)
                              : "-"}
                          </div>
                        </div>
                        <div>
                          <div
                            style={{
                              fontSize: "12px",
                              color: "#64748b",
                              fontWeight: "500",
                            }}
                          >
                            Pukul
                          </div>
                          <div
                            style={{
                              fontSize: "14px",
                              fontWeight: "600",
                              color: "#1a202c",
                            }}
                          >
                            {letter.audiensi_pukul || "-"}
                          </div>
                        </div>
                        <div>
                          <div
                            style={{
                              fontSize: "12px",
                              color: "#64748b",
                              fontWeight: "500",
                            }}
                          >
                            Tempat
                          </div>
                          <div
                            style={{
                              fontSize: "14px",
                              fontWeight: "600",
                              color: "#1a202c",
                            }}
                          >
                            {letter.audiensi_tempat || "-"}
                          </div>
                        </div>
                        <div>
                          <div
                            style={{
                              fontSize: "12px",
                              color: "#64748b",
                              fontWeight: "500",
                            }}
                          >
                            Nama Pemohon
                          </div>
                          <div
                            style={{
                              fontSize: "14px",
                              fontWeight: "600",
                              color: "#1a202c",
                            }}
                          >
                            {letter.nama_pemohon || "-"}
                          </div>
                        </div>
                        <div>
                          <div
                            style={{
                              fontSize: "12px",
                              color: "#64748b",
                              fontWeight: "500",
                            }}
                          >
                            Instansi/Organisasi
                          </div>
                          <div
                            style={{
                              fontSize: "14px",
                              fontWeight: "600",
                              color: "#1a202c",
                            }}
                          >
                            {letter.instansi_organisasi || "-"}
                          </div>
                        </div>
                        <div>
                          <div
                            style={{
                              fontSize: "12px",
                              color: "#64748b",
                              fontWeight: "500",
                            }}
                          >
                            Jumlah Peserta
                          </div>
                          <div
                            style={{
                              fontSize: "14px",
                              fontWeight: "600",
                              color: "#1a202c",
                            }}
                          >
                            {letter.jumlah_peserta || "-"}
                          </div>
                        </div>
                      </div>

                      {/* Field text panjang */}
                      {letter.topik_audiensi && (
                        <div style={{ marginTop: "16px" }}>
                          <div
                            style={{
                              fontSize: "12px",
                              color: "#64748b",
                              fontWeight: "500",
                            }}
                          >
                            Topik Audiensi
                          </div>
                          <div
                            style={{
                              fontSize: "14px",
                              color: "#374151",
                              lineHeight: "1.5",
                              marginTop: "4px",
                            }}
                          >
                            {letter.topik_audiensi}
                          </div>
                        </div>
                      )}

                      {letter.audiensi_dokumentasi && (
                        <div style={{ marginTop: "16px" }}>
                          <div
                            style={{
                              fontSize: "12px",
                              color: "#64748b",
                              fontWeight: "500",
                            }}
                          >
                            Dokumentasi
                          </div>
                          <div
                            style={{
                              fontSize: "14px",
                              color: "#374151",
                              lineHeight: "1.5",
                              marginTop: "4px",
                            }}
                          >
                            {letter.audiensi_dokumentasi}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {letter.jenis === "proposal" && (
                  <div>
                    <h3
                      style={{
                        margin: "0 0 12px 0",
                        fontSize: "18px",
                        fontWeight: "700",
                        color: "#1a202c",
                      }}
                    >
                      Detail Proposal
                    </h3>
                    <div
                      style={{
                        background: "#fff7ed",
                        padding: "20px",
                        borderRadius: "16px",
                        border: "2px solid #f97316",
                      }}
                    >
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns:
                            "repeat(auto-fit, minmax(200px, 1fr))",
                          gap: "16px",
                        }}
                      >
                        <div>
                          <div
                            style={{
                              fontSize: "12px",
                              color: "#64748b",
                              fontWeight: "500",
                            }}
                          >
                            Nama Pengirim
                          </div>
                          <div
                            style={{
                              fontSize: "14px",
                              fontWeight: "600",
                              color: "#1a202c",
                            }}
                          >
                            {letter.nama_pengirim || "-"}
                          </div>
                        </div>
                        <div>
                          <div
                            style={{
                              fontSize: "12px",
                              color: "#64748b",
                              fontWeight: "500",
                            }}
                          >
                            Instansi
                          </div>
                          <div
                            style={{
                              fontSize: "14px",
                              fontWeight: "600",
                              color: "#1a202c",
                            }}
                          >
                            {letter.instansi || "-"}
                          </div>
                        </div>
                        <div>
                          <div
                            style={{
                              fontSize: "12px",
                              color: "#64748b",
                              fontWeight: "500",
                            }}
                          >
                            Instansi/Lembaga/Komunitas
                          </div>
                          <div
                            style={{
                              fontSize: "14px",
                              fontWeight: "600",
                              color: "#1a202c",
                            }}
                          >
                            {letter.instansi_lembaga_komunitas || "-"}
                          </div>
                        </div>
                        <div>
                          <div
                            style={{
                              fontSize: "12px",
                              color: "#64748b",
                              fontWeight: "500",
                            }}
                          >
                            Judul Proposal
                          </div>
                          <div
                            style={{
                              fontSize: "14px",
                              fontWeight: "600",
                              color: "#1a202c",
                            }}
                          >
                            {letter.judul_proposal || "-"}
                          </div>
                        </div>
                        <div>
                          <div
                            style={{
                              fontSize: "12px",
                              color: "#64748b",
                              fontWeight: "500",
                            }}
                          >
                            Jenis Kegiatan
                          </div>
                          <div
                            style={{
                              fontSize: "14px",
                              fontWeight: "600",
                              color: "#1a202c",
                            }}
                          >
                            {letter.jenis_kegiatan || "-"}
                          </div>
                        </div>
                        <div>
                          <div
                            style={{
                              fontSize: "12px",
                              color: "#64748b",
                              fontWeight: "500",
                            }}
                          >
                            Tanggal Kegiatan
                          </div>
                          <div
                            style={{
                              fontSize: "14px",
                              fontWeight: "600",
                              color: "#1a202c",
                            }}
                          >
                            {letter.tanggal_kegiatan
                              ? formatDate(letter.tanggal_kegiatan)
                              : "-"}
                          </div>
                        </div>
                        <div>
                          <div
                            style={{
                              fontSize: "12px",
                              color: "#64748b",
                              fontWeight: "500",
                            }}
                          >
                            Lokasi Kegiatan
                          </div>
                          <div
                            style={{
                              fontSize: "14px",
                              fontWeight: "600",
                              color: "#1a202c",
                            }}
                          >
                            {letter.lokasi_kegiatan || "-"}
                          </div>
                        </div>
                        <div>
                          <div
                            style={{
                              fontSize: "12px",
                              color: "#64748b",
                              fontWeight: "500",
                            }}
                          >
                            Total Anggaran
                          </div>
                          <div
                            style={{
                              fontSize: "14px",
                              fontWeight: "600",
                              color: "#1a202c",
                            }}
                          >
                            {letter.total_anggaran
                              ? `Rp ${Number(
                                  letter.total_anggaran
                                ).toLocaleString("id-ID")}`
                              : "-"}
                          </div>
                        </div>
                        <div>
                          <div
                            style={{
                              fontSize: "12px",
                              color: "#64748b",
                              fontWeight: "500",
                            }}
                          >
                            PIC Penanganan
                          </div>
                          <div
                            style={{
                              fontSize: "14px",
                              fontWeight: "600",
                              color: "#1a202c",
                            }}
                          >
                            {letter.pic_penanganan || "-"}
                          </div>
                        </div>
                        <div>
                          <div
                            style={{
                              fontSize: "12px",
                              color: "#64748b",
                              fontWeight: "500",
                            }}
                          >
                            Nomor Rekening
                          </div>
                          <div
                            style={{
                              fontSize: "14px",
                              fontWeight: "600",
                              color: "#1a202c",
                            }}
                          >
                            {letter.nomor_rekening || "-"}
                          </div>
                        </div>
                        <div>
                          <div
                            style={{
                              fontSize: "12px",
                              color: "#64748b",
                              fontWeight: "500",
                            }}
                          >
                            Jumlah Dibantu
                          </div>
                          <div
                            style={{
                              fontSize: "14px",
                              fontWeight: "600",
                              color: "#1a202c",
                            }}
                          >
                            {letter.jumlah_dibantu
                              ? `Rp ${Number(
                                  letter.jumlah_dibantu
                                ).toLocaleString("id-ID")}`
                              : "-"}
                          </div>
                        </div>
                      </div>

                      {/* Text fields yang panjang */}
                      {letter.ringkasan && (
                        <div style={{ marginTop: "16px" }}>
                          <div
                            style={{
                              fontSize: "12px",
                              color: "#64748b",
                              fontWeight: "500",
                            }}
                          >
                            Ringkasan
                          </div>
                          <div
                            style={{
                              fontSize: "14px",
                              color: "#374151",
                              lineHeight: "1.5",
                              marginTop: "4px",
                            }}
                          >
                            {letter.ringkasan}
                          </div>
                        </div>
                      )}

                      {letter.rekomendasi_dukungan && (
                        <div style={{ marginTop: "16px" }}>
                          <div
                            style={{
                              fontSize: "12px",
                              color: "#64748b",
                              fontWeight: "500",
                            }}
                          >
                            Rekomendasi/Dukungan
                          </div>
                          <div
                            style={{
                              fontSize: "14px",
                              color: "#374151",
                              lineHeight: "1.5",
                              marginTop: "4px",
                            }}
                          >
                            {letter.rekomendasi_dukungan}
                          </div>
                        </div>
                      )}

                      {letter.catatan_tindak_lanjut && (
                        <div style={{ marginTop: "16px" }}>
                          <div
                            style={{
                              fontSize: "12px",
                              color: "#64748b",
                              fontWeight: "500",
                            }}
                          >
                            Catatan/Tindak Lanjut
                          </div>
                          <div
                            style={{
                              fontSize: "14px",
                              color: "#374151",
                              lineHeight: "1.5",
                              marginTop: "4px",
                            }}
                          >
                            {letter.catatan_tindak_lanjut}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                {letter.jenis === "pengaduan" && (
                  <div>
                    <h3
                      style={{
                        margin: "0 0 12px 0",
                        fontSize: "18px",
                        fontWeight: "700",
                        color: "#1a202c",
                      }}
                    >
                      Detail Pengaduan
                    </h3>
                    <div
                      style={{
                        background: "#fef3c7",
                        padding: "20px",
                        borderRadius: "16px",
                        border: "2px solid #f59e0b",
                      }}
                    >
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns:
                            "repeat(auto-fit, minmax(200px, 1fr))",
                          gap: "16px",
                        }}
                      >
                        <div>
                          <div
                            style={{
                              fontSize: "12px",
                              color: "#64748b",
                              fontWeight: "500",
                            }}
                          >
                            Jenis Pengaduan
                          </div>
                          <div
                            style={{
                              fontSize: "14px",
                              fontWeight: "600",
                              color: "#1a202c",
                              textTransform: "capitalize",
                            }}
                          >
                            {letter.jenis_pengaduan?.replace("_", " ") || "-"}
                          </div>
                        </div>
                        <div>
                          <div
                            style={{
                              fontSize: "12px",
                              color: "#64748b",
                              fontWeight: "500",
                            }}
                          >
                            Tingkat Urgensi
                          </div>
                          <div
                            style={{
                              fontSize: "14px",
                              fontWeight: "600",
                              color: "#1a202c",
                              textTransform: "capitalize",
                            }}
                          >
                            {letter.tingkat_urgensi?.replace("_", " ") || "-"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {letter.jenis === "pemberitahuan" && (
                  <div>
                    <h3
                      style={{
                        margin: "0 0 12px 0",
                        fontSize: "18px",
                        fontWeight: "700",
                        color: "#1a202c",
                      }}
                    >
                      Detail Pemberitahuan
                    </h3>
                    <div
                      style={{
                        background: "#fef2f2",
                        padding: "20px",
                        borderRadius: "16px",
                        border: "2px solid #ef4444",
                      }}
                    >
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns:
                            "repeat(auto-fit, minmax(200px, 1fr))",
                          gap: "16px",
                        }}
                      >
                        <div>
                          <div
                            style={{
                              fontSize: "12px",
                              color: "#64748b",
                              fontWeight: "500",
                            }}
                          >
                            Kategori
                          </div>
                          <div
                            style={{
                              fontSize: "14px",
                              fontWeight: "600",
                              color: "#1a202c",
                              textTransform: "capitalize",
                            }}
                          >
                            {letter.kategori_pemberitahuan?.replace("_", " ") ||
                              "-"}
                          </div>
                        </div>
                        <div>
                          <div
                            style={{
                              fontSize: "12px",
                              color: "#64748b",
                              fontWeight: "500",
                            }}
                          >
                            Tingkat Prioritas
                          </div>
                          <div
                            style={{
                              fontSize: "14px",
                              fontWeight: "600",
                              color: "#1a202c",
                              textTransform: "capitalize",
                            }}
                          >
                            {letter.tingkat_prioritas || "-"}
                          </div>
                        </div>
                        <div>
                          <div
                            style={{
                              fontSize: "12px",
                              color: "#64748b",
                              fontWeight: "500",
                            }}
                          >
                            Batas Waktu Respon
                          </div>
                          <div
                            style={{
                              fontSize: "14px",
                              fontWeight: "600",
                              color: "#1a202c",
                            }}
                          >
                            {letter.batas_waktu_respon
                              ? formatDate(letter.batas_waktu_respon)
                              : "-"}
                          </div>
                        </div>
                        <div>
                          <div
                            style={{
                              fontSize: "12px",
                              color: "#64748b",
                              fontWeight: "500",
                            }}
                          >
                            Follow Up Required
                          </div>
                          <div
                            style={{
                              fontSize: "14px",
                              fontWeight: "600",
                              color: "#1a202c",
                              textTransform: "capitalize",
                            }}
                          >
                            {letter.follow_up_required || "-"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* AKHIR TAMBAHAN */}

                {/* Metadata */}
                <div
                  style={{
                    background: "#f1f5f9",
                    padding: "20px",
                    borderRadius: "16px",
                    fontSize: "14px",
                    color: "#64748b",
                  }}
                >
                  <div style={{ marginBottom: "8px" }}>
                    {/* <strong>Dibuat oleh:</strong> {letter.created_by_name} */}
                  </div>
                  <div>
                    <strong>Dibuat pada:</strong>{" "}
                    {formatDate(letter.created_at)}
                  </div>
                </div>
              </div>
            )}

            {/* Message */}
            {message && (
              <div
                style={{
                  marginTop: "20px",
                  padding: "16px 20px",
                  backgroundColor: message.includes("berhasil")
                    ? "#ecfdf5"
                    : "#fef2f2",
                  color: message.includes("berhasil") ? "#065f46" : "#dc2626",
                  borderRadius: "12px",
                  fontSize: "14px",
                  fontWeight: "500",
                  border: `1px solid ${
                    message.includes("berhasil") ? "#a7f3d0" : "#fecaca"
                  }`,
                  textAlign: "center",
                }}
              >
                {message}
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions - Fixed */}
        <div
          style={{
            flexShrink: 0,
            padding: "20px 32px",
            borderTop: "1px solid #f1f5f9",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "16px",
            background: "#fafbfc",
            borderBottomLeftRadius: "24px",
            borderBottomRightRadius: "24px",
          }}
        >
          {/* Left Actions */}
          <div style={{ display: "flex", gap: "12px" }}>
            {!editMode && (
              <button
                onClick={() => setEditMode(true)}
                style={{
                  padding: "10px 20px",
                  background:
                    "linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)",
                  color: "white",
                  border: "none",
                  borderRadius: "10px",
                  fontSize: "13px",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                Edit Surat
              </button>
            )}

            {!editMode && (
              <DisposisiButton
                letterId={letter.id}
                size="medium"
                variant="primary"
              />
            )}

            <button
              onClick={handleDelete}
              disabled={loading}
              style={{
                padding: "10px 20px",
                background: "#ef4444",
                color: "white",
                border: "none",
                borderRadius: "10px",
                fontSize: "13px",
                fontWeight: "600",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.7 : 1,
              }}
            >
              Hapus
            </button>
          </div>

          {/* Right Actions */}
          <div style={{ display: "flex", gap: "12px" }}>
            {editMode ? (
              <>
                <button
                  onClick={() => {
                    setEditMode(false);
                    setFormData({ ...letter });
                    setSelectedFiles([]);
                    setMessage("");
                  }}
                  style={{
                    padding: "10px 20px",
                    background: "#f8fafc",
                    border: "2px solid #e5e7eb",
                    borderRadius: "10px",
                    fontSize: "13px",
                    fontWeight: "600",
                    color: "#64748b",
                    cursor: "pointer",
                  }}
                >
                  Batal
                </button>

                <button
                  onClick={handleSave}
                  disabled={loading}
                  style={{
                    padding: "10px 20px",
                    background: loading
                      ? "#cbd5e0"
                      : "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                    color: "white",
                    border: "none",
                    borderRadius: "10px",
                    fontSize: "13px",
                    fontWeight: "600",
                    cursor: loading ? "not-allowed" : "pointer",
                  }}
                >
                  {loading ? "Menyimpan..." : "Simpan"}
                </button>
              </>
            ) : (
              <button
                onClick={onClose}
                style={{
                  padding: "10px 20px",
                  background: "#f8fafc",
                  border: "2px solid #e5e7eb",
                  borderRadius: "10px",
                  fontSize: "13px",
                  fontWeight: "600",
                  color: "#64748b",
                  cursor: "pointer",
                }}
              >
                Tutup
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LetterDetailModal;
