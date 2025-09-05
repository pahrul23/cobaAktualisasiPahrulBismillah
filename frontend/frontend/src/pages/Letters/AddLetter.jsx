// Path: /frontend/src/pages/Letters/AddLetter.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/Layout/DashboardLayout";

// Import 5 komponen form terpisah
import PengaduanFormFields from "../../components/Forms/PengaduanFormFields";
import UndanganFormFields from "../../components/Forms/UndanganFormFields";
import AudiensiFormFields from "../../components/Forms/AudiensiFormFields";
import ProposalFormFields from "../../components/Forms/ProposalFormFields";
import PemberitahuanFormFields from "../../components/Forms/PemberitahuanFormFields";

import useAuth from "../../hooks/useAuth";

const AddLetter = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [selectedJenis, setSelectedJenis] = useState(""); // Step 1: Pilih jenis
  const [formData, setFormData] = useState({
    // Basic fields - akan di-set otomatis oleh setiap komponen
    no_disposisi: "",
    no_surat: "",
    asal_surat: "",
    label: "hitam",
    tanggal_terima: "",
    tanggal_surat: "",
    jenis: "",
    perihal: "",
    uraian: "",
    keterangan: "",
  });

  const jenisOptions = [
    {
      value: "pengaduan",
      label: "Pengaduan",
      icon: "📝",
      color: "#f59e0b",
      desc: "Form untuk pengaduan masyarakat",
    },
    {
      value: "undangan",
      label: "Undangan",
      icon: "🎉",
      color: "#0ea5e9",
      desc: "Form untuk undangan acara/rapat",
    },
    {
      value: "audiensi",
      label: "Audiensi",
      icon: "🤝",
      color: "#10b981",
      desc: "Form untuk permohonan audiensi",
    },
    {
      value: "proposal",
      label: "Proposal",
      icon: "📋",
      color: "#f97316",
      desc: "Form untuk proposal kegiatan/bantuan",
    },
    {
      value: "pemberitahuan",
      label: "Pemberitahuan",
      icon: "📢",
      color: "#ef4444",
      desc: "Form untuk pemberitahuan resmi",
    },
  ];

  const handleJenisSelect = (jenis) => {
    setSelectedJenis(jenis);
    // Reset form data ketika ganti jenis
    setFormData({
      no_disposisi: "",
      no_surat: "",
      asal_surat: "",
      label: "hitam",
      tanggal_terima: "",
      tanggal_surat: "",
      jenis: jenis,
      perihal: "",
      uraian: "",
      keterangan: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!selectedJenis) {
      alert("Silakan pilih jenis surat terlebih dahulu");
      return;
    }

    if (
      !formData.no_surat ||
      !formData.asal_surat ||
      !formData.perihal ||
      !formData.uraian
    ) {
      alert("Silakan lengkapi field yang wajib diisi");
      return;
    }

    setLoading(true);

    try {
      // BUAT FORMDATA UNTUK UPLOAD FILE
      const submitData = new FormData();

      // Append semua field dari formData KECUALI file_surat
      Object.keys(formData).forEach((key) => {
        if (
          key !== "file_surat" &&
          formData[key] !== null &&
          formData[key] !== undefined &&
          formData[key] !== ""
        ) {
          submitData.append(key, formData[key]);
        }
      });

      // Handle file_surat secara terpisah
      if (formData.file_surat && formData.file_surat.originalFile) {
        submitData.append("file_surat", formData.file_surat.originalFile);
      } else {
        alert("File surat wajib diupload");
        setLoading(false);
        return;
      }

      const response = await fetch("http://localhost:4000/api/letters", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: submitData,
      });

      const result = await response.json();

      if (result.success) {
        alert("Surat berhasil ditambahkan!");
        navigate("/letters");
      } else {
        alert(`Gagal menambah surat: ${result.message}`);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Terjadi kesalahan saat mengirim data");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (selectedJenis) {
      // Jika sudah pilih jenis, kembali ke step 1
      setSelectedJenis("");
      setFormData({
        no_disposisi: "",
        no_surat: "",
        asal_surat: "",
        label: "hitam",
        tanggal_terima: "",
        tanggal_surat: "",
        jenis: "",
        perihal: "",
        uraian: "",
        keterangan: "",
      });
    } else {
      // Jika belum pilih jenis, kembali ke list
      navigate("/letters");
    }
  };

  // Render form component berdasarkan jenis yang dipilih
  const renderFormComponent = () => {
    switch (selectedJenis) {
      case "pengaduan":
        return (
          <PengaduanFormFields
            formData={formData}
            setFormData={setFormData}
            readOnly={false}
          />
        );
      case "undangan":
        return (
          <UndanganFormFields
            formData={formData}
            setFormData={setFormData}
            readOnly={false}
          />
        );
      case "audiensi":
        return (
          <AudiensiFormFields
            formData={formData}
            setFormData={setFormData}
            readOnly={false}
          />
        );
      case "proposal":
        return (
          <ProposalFormFields
            formData={formData}
            setFormData={setFormData}
            readOnly={false}
          />
        );
      case "pemberitahuan":
        return (
          <PemberitahuanFormFields
            formData={formData}
            setFormData={setFormData}
            readOnly={false}
          />
        );
      default:
        return null;
    }
  };

  return (
    <DashboardLayout>
      <div
        style={{
          fontFamily: "'Poppins', sans-serif",
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 20px",
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: "32px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "8px",
            }}
          >
            <button
              onClick={handleCancel}
              style={{
                background: "none",
                border: "none",
                fontSize: "24px",
                cursor: "pointer",
                color: "#64748b",
                padding: "4px",
              }}
            >
              ←
            </button>
            <h1
              style={{
                margin: 0,
                fontSize: "32px",
                fontWeight: "700",
                color: "#1a202c",
              }}
            >
              {selectedJenis
                ? `Form ${
                    jenisOptions.find((j) => j.value === selectedJenis)?.label
                  }`
                : "Pilih Jenis Surat"}
            </h1>
          </div>
          <p
            style={{
              margin: 0,
              color: "#64748b",
              fontSize: "16px",
            }}
          >
            {selectedJenis
              ? "Lengkapi informasi surat sesuai jenis yang dipilih"
              : "Pilih jenis surat yang akan dibuat"}
          </p>
        </div>

        {/* Step 1: Pilih Jenis Surat */}
        {!selectedJenis && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "24px",
              marginBottom: "32px",
            }}
          >
            {jenisOptions.map((jenis) => (
              <div
                key={jenis.value}
                onClick={() => handleJenisSelect(jenis.value)}
                style={{
                  background: "white",
                  border: "2px solid #e5e7eb",
                  borderRadius: "16px",
                  padding: "24px",
                  textAlign: "center",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  ":hover": {
                    borderColor: jenis.color,
                    transform: "translateY(-4px)",
                  },
                }}
                onMouseEnter={(e) => {
                  e.target.style.borderColor = jenis.color;
                  e.target.style.transform = "translateY(-4px)";
                  e.target.style.boxShadow = `0 8px 32px rgba(0,0,0,0.12)`;
                }}
                onMouseLeave={(e) => {
                  e.target.style.borderColor = "#e5e7eb";
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = "none";
                }}
              >
                <div
                  style={{
                    fontSize: "48px",
                    marginBottom: "16px",
                  }}
                >
                  {jenis.icon}
                </div>
                <h3
                  style={{
                    margin: "0 0 8px 0",
                    fontSize: "20px",
                    fontWeight: "700",
                    color: jenis.color,
                  }}
                >
                  {jenis.label}
                </h3>
                <p
                  style={{
                    margin: 0,
                    fontSize: "14px",
                    color: "#64748b",
                  }}
                >
                  {jenis.desc}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Step 2: Form Detail */}
        {selectedJenis && (
          <form onSubmit={handleSubmit}>
            <div
              style={{
                background: "white",
                borderRadius: "20px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
                overflow: "hidden",
                marginBottom: "32px",
              }}
            >
              <div style={{ padding: "32px" }}>{renderFormComponent()}</div>

              {/* Form Actions */}
              <div
                style={{
                  borderTop: "1px solid #e2e8f0",
                  padding: "24px 32px",
                  background: "#f8fafc",
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "16px",
                }}
              >
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={loading}
                  style={{
                    padding: "12px 24px",
                    border: "2px solid #e2e8f0",
                    borderRadius: "12px",
                    background: "white",
                    color: "#64748b",
                    fontSize: "14px",
                    fontWeight: "600",
                    cursor: loading ? "not-allowed" : "pointer",
                    opacity: loading ? 0.6 : 1,
                  }}
                >
                  ← Ubah Jenis Surat
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    padding: "12px 32px",
                    background: loading
                      ? "#94a3b8"
                      : "linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)",
                    color: "white",
                    border: "none",
                    borderRadius: "12px",
                    fontSize: "14px",
                    fontWeight: "600",
                    cursor: loading ? "not-allowed" : "pointer",
                    boxShadow: loading
                      ? "none"
                      : "0 4px 20px rgba(14, 165, 233, 0.3)",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  {loading ? (
                    <>
                      <div
                        style={{
                          width: "16px",
                          height: "16px",
                          border: "2px solid rgba(255,255,255,0.3)",
                          borderTop: "2px solid white",
                          borderRadius: "50%",
                          animation: "spin 1s linear infinite",
                        }}
                      ></div>
                      Menyimpan...
                    </>
                  ) : (
                    <>💾 Simpan Surat</>
                  )}
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Loading Animation */}
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </DashboardLayout>
  );
};

export default AddLetter;
