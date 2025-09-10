// Path: /frontend/src/pages/Disposisi/DisposisiPage.jsx
import React, { useState, useEffect } from "react";
import DashboardLayout from "../../components/Layout/DashboardLayout";

const DisposisiPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLetter, setSelectedLetter] = useState(null);
  const [loading, setLoading] = useState(false);
  const [disposisiData, setDisposisiData] = useState({
    disposisi_kepada: "",
    disposisi_kepada_lainnya: "",
    instruksi: [],
    catatan: "",
    file_disposisi: null,
  });
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  const disposisiOptions = [
    "Wakil Ketua Bid. I",
    "Wakil Ketua Bid. II",
    "Wakil Ketua Bid. III",
    "Sesjen",
    "Deputi Persidangan",
    "Deputi Administrasi",
    "Staf Khusus",
    "Komite I",
    "Komite II",
    "Komite III",
    "Komite IV",
    "PURT",
    "Panitia Musyawarah",
    "PPUU",
    "BK",
    "BAP",
    "BKSP",
    "BULD",
    "Karo. Setpim",
    "Kabag. Set. Ketua",
    "Lainnya",
  ];

  const instruksiOptions = [
    "Hadir",
    "Hadir Virtual",
    "Tidak Hadir",
    "Kirim Bunga",
    "Temui Saya",
    "Siapkan Jawaban",
    "Siapkan Draft",
    "Siapkan Protokol",
    "Check",
    "Humas",
    "Siapkan Foto Video",
    "Siapkan Media",
    "Untuk Dipelajari",
    "Untuk Diketahui",
    "Untuk Diselesaikan",
    "Dapat Disetujui",
    "Harap Dipenuhi",
    "Koordinasikan",
    "File",
  ];

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      alert("Masukkan kata kunci pencarian");
      return;
    }

    setLoading(true);
    try {
      console.log("Searching for:", searchTerm);

      const response = await fetch(
        `http://localhost:4000/api/letters?q=${encodeURIComponent(searchTerm)}`
      );
      console.log("Response status:", response.status);

      const data = await response.json();
      console.log("Response data:", data);

      if (response.ok && data.success) {
        if (data.data && data.data.letters && data.data.letters.length > 0) {
          setSearchResults(data.data.letters);
        } else if (
          data.data &&
          Array.isArray(data.data) &&
          data.data.length > 0
        ) {
          setSearchResults(data.data);
        } else {
          alert("Surat tidak ditemukan");
          setSearchResults([]);
        }
      } else {
        console.error("Search failed:", data);
        alert(data.message || "Gagal mencari surat");
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Error searching letter:", error);
      alert("Gagal mencari surat. Pastikan server berjalan di localhost:4000");
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectLetter = (letter) => {
    console.log("Selected letter:", letter);
    setSelectedLetter(letter);
    setShowCreateForm(true);
    setSearchResults([]);
  };

  const handleInstruksiToggle = (instruksi) => {
    setDisposisiData((prev) => ({
      ...prev,
      instruksi: prev.instruksi.includes(instruksi)
        ? prev.instruksi.filter((i) => i !== instruksi)
        : [...prev.instruksi, instruksi],
    }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File terlalu besar. Maksimal 5MB");
        return;
      }

      const allowedTypes = [
        "application/pdf",
        "image/jpeg",
        "image/jpg",
        "image/png",
      ];
      if (!allowedTypes.includes(file.type)) {
        alert("Format file tidak didukung. Gunakan PDF, JPG, JPEG, atau PNG");
        return;
      }
    }

    setDisposisiData((prev) => ({
      ...prev,
      file_disposisi: file,
    }));
  };

  const handleSubmit = async () => {
    if (!selectedLetter) {
      alert("Pilih surat terlebih dahulu");
      return;
    }

    if (!disposisiData.disposisi_kepada) {
      alert("Pilih unit kerja tujuan disposisi");
      return;
    }

    if (
      disposisiData.disposisi_kepada === "Lainnya" &&
      !disposisiData.disposisi_kepada_lainnya.trim()
    ) {
      alert("Sebutkan unit kerja lainnya");
      return;
    }

    if (disposisiData.instruksi.length === 0) {
      alert("Pilih minimal satu instruksi");
      return;
    }

    const formData = new FormData();
    formData.append("letter_id", selectedLetter.id);
    formData.append("no_surat", selectedLetter.no_surat);
    formData.append("disposisi_kepada", disposisiData.disposisi_kepada);

    if (disposisiData.disposisi_kepada === "Lainnya") {
      formData.append(
        "disposisi_kepada_lainnya",
        disposisiData.disposisi_kepada_lainnya
      );
    }

    formData.append("instruksi", JSON.stringify(disposisiData.instruksi));
    formData.append("catatan", disposisiData.catatan || "");

    if (disposisiData.file_disposisi) {
      formData.append("file_disposisi", disposisiData.file_disposisi);
    }

    try {
      console.log("Creating disposition for letter:", selectedLetter.id);

      const response = await fetch("http://localhost:4000/api/dispositions", {
        method: "POST",
        body: formData,
      });

      console.log("Create response status:", response.status);
      const data = await response.json();
      console.log("Create response data:", data);

      if (response.ok && data.success) {
        alert("Disposisi berhasil dibuat!");
        resetForm();
      } else {
        alert("Gagal membuat disposisi: " + (data.message || "Unknown error"));
        console.error("Create failed:", data);
      }
    } catch (error) {
      console.error("Error creating disposition:", error);
      alert("Gagal membuat disposisi. Pastikan server berjalan dengan baik.");
    }
  };

  const resetForm = () => {
    setSelectedLetter(null);
    setShowCreateForm(false);
    setSearchTerm("");
    setSearchResults([]);
    setDisposisiData({
      disposisi_kepada: "",
      disposisi_kepada_lainnya: "",
      instruksi: [],
      catatan: "",
      file_disposisi: null,
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });
    } catch (e) {
      return dateString;
    }
  };

  const getJenisIcon = (jenis) => {
    const icons = {
      pengaduan: "📝",
      pemberitahuan: "📢",
      undangan: "📅",
      audiensi: "🤝",
      proposal: "📋",
    };
    return icons[jenis] || "📄";
  };

  const getJenisColor = (jenis) => {
    const colors = {
      pengaduan: "#ef4444",
      pemberitahuan: "#0ea5e9",
      undangan: "#8b5cf6",
      audiensi: "#f59e0b",
      proposal: "#10b981",
    };
    return colors[jenis] || "#64748b";
  };

  useEffect(() => {
    const testConnection = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/dispositions");
        const data = await response.json();
        console.log("API connection test:", data);
      } catch (error) {
        console.error("API connection failed:", error);
      }
    };

    testConnection();
  }, []);

  return (
    <DashboardLayout>
      <div
        style={{
          fontFamily: "'Poppins', sans-serif",
          maxWidth: "1400px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            borderRadius: "24px",
            padding: "32px",
            marginBottom: "32px",
            color: "white",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "-20px",
              right: "-20px",
              width: "120px",
              height: "120px",
              background: "rgba(255,255,255,0.1)",
              borderRadius: "50%",
            }}
          ></div>

          <div style={{ position: "relative", zIndex: 1 }}>
            <h1
              style={{
                fontSize: "32px",
                fontWeight: "800",
                margin: "0 0 8px 0",
              }}
            >
              📝 Manajemen Disposisi
            </h1>
            <p
              style={{
                fontSize: "18px",
                opacity: 0.9,
                margin: 0,
              }}
            >
              Kelola dan distribusikan surat ke unit kerja yang tepat
            </p>
          </div>
        </div>

        <div
          style={{
            background: "white",
            borderRadius: "20px",
            padding: "32px",
            marginBottom: "32px",
            boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
          }}
        >
          <h2
            style={{
              fontSize: "24px",
              fontWeight: "700",
              margin: "0 0 24px 0",
              color: "#1a202c",
            }}
          >
            🔍 Cari Surat untuk Disposisi
          </h2>

          <div
            style={{
              display: "flex",
              gap: "16px",
              alignItems: "center",
              marginBottom: "24px",
            }}
          >
            <div style={{ flex: 1, position: "relative" }}>
              <input
                type="text"
                placeholder="Masukkan nomor surat, perihal, atau asal surat..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                style={{
                  width: "100%",
                  padding: "16px 24px",
                  border: "2px solid #e2e8f0",
                  borderRadius: "16px",
                  fontSize: "16px",
                  outline: "none",
                  transition: "all 0.2s ease",
                  paddingRight: "60px",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#667eea")}
                onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
              />
              <div
                style={{
                  position: "absolute",
                  right: "20px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#94a3b8",
                  fontSize: "20px",
                }}
              >
                🔍
              </div>
            </div>

            <button
              onClick={handleSearch}
              disabled={loading || !searchTerm.trim()}
              style={{
                padding: "16px 32px",
                background:
                  loading || !searchTerm.trim()
                    ? "#cbd5e0"
                    : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
                border: "none",
                borderRadius: "16px",
                fontSize: "16px",
                fontWeight: "600",
                cursor:
                  loading || !searchTerm.trim() ? "not-allowed" : "pointer",
                transition: "all 0.3s ease",
                minWidth: "120px",
              }}
            >
              {loading ? "⏳ Cari..." : "Cari Surat"}
            </button>
          </div>

          {searchResults.length > 0 && (
            <div
              style={{
                border: "2px solid #e2e8f0",
                borderRadius: "16px",
                maxHeight: "400px",
                overflowY: "auto",
              }}
            >
              <div
                style={{
                  padding: "16px 24px",
                  background: "#f8fafc",
                  borderBottom: "1px solid #e2e8f0",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#64748b",
                }}
              >
                Ditemukan {searchResults.length} surat
              </div>

              {searchResults.map((letter, index) => (
                <div
                  key={letter.id}
                  onClick={() => handleSelectLetter(letter)}
                  style={{
                    padding: "20px 24px",
                    borderBottom:
                      index < searchResults.length - 1
                        ? "1px solid #f1f5f9"
                        : "none",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                  }}
                  onMouseEnter={(e) => (e.target.style.background = "#f8fafc")}
                  onMouseLeave={(e) => (e.target.style.background = "white")}
                >
                  <div
                    style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "12px",
                      background: getJenisColor(letter.jenis),
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "20px",
                      color: "white",
                    }}
                  >
                    {getJenisIcon(letter.jenis)}
                  </div>

                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontSize: "16px",
                        fontWeight: "600",
                        color: "#1a202c",
                        marginBottom: "4px",
                      }}
                    >
                      {letter.no_surat}
                    </div>
                    <div
                      style={{
                        fontSize: "14px",
                        color: "#64748b",
                        marginBottom: "4px",
                      }}
                    >
                      {letter.perihal}
                    </div>
                    <div
                      style={{
                        fontSize: "12px",
                        color: "#94a3b8",
                      }}
                    >
                      {letter.asal_surat} • {formatDate(letter.tanggal_terima)}
                    </div>
                  </div>

                  <div
                    style={{
                      padding: "6px 12px",
                      background: getJenisColor(letter.jenis),
                      color: "white",
                      borderRadius: "8px",
                      fontSize: "12px",
                      fontWeight: "600",
                      textTransform: "uppercase",
                    }}
                  >
                    {letter.jenis}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        {showCreateForm && selectedLetter && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "32px",
              marginBottom: "32px",
            }}
          >
            <div
              style={{
                background: "white",
                borderRadius: "20px",
                padding: "32px",
                boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
              }}
            >
              <h3
                style={{
                  fontSize: "20px",
                  fontWeight: "700",
                  margin: "0 0 24px 0",
                  color: "#1a202c",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                📄 Preview Surat
              </h3>

              <div
                style={{
                  padding: "24px",
                  background: "#f8fafc",
                  borderRadius: "16px",
                  border: "2px solid #e2e8f0",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                    marginBottom: "20px",
                  }}
                >
                  <div
                    style={{
                      width: "56px",
                      height: "56px",
                      borderRadius: "16px",
                      background: getJenisColor(selectedLetter.jenis),
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "24px",
                      color: "white",
                    }}
                  >
                    {getJenisIcon(selectedLetter.jenis)}
                  </div>

                  <div>
                    <div
                      style={{
                        fontSize: "18px",
                        fontWeight: "700",
                        color: "#1a202c",
                        marginBottom: "4px",
                      }}
                    >
                      {selectedLetter.no_surat}
                    </div>
                    <div
                      style={{
                        padding: "4px 12px",
                        background: getJenisColor(selectedLetter.jenis),
                        color: "white",
                        borderRadius: "8px",
                        fontSize: "12px",
                        fontWeight: "600",
                        textTransform: "uppercase",
                        display: "inline-block",
                      }}
                    >
                      {selectedLetter.jenis}
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    display: "grid",
                    gap: "16px",
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: "12px",
                        color: "#64748b",
                        fontWeight: "600",
                        marginBottom: "4px",
                      }}
                    >
                      Perihal
                    </div>
                    <div
                      style={{
                        fontSize: "14px",
                        color: "#1a202c",
                      }}
                    >
                      {selectedLetter.perihal}
                    </div>
                  </div>

                  <div>
                    <div
                      style={{
                        fontSize: "12px",
                        color: "#64748b",
                        fontWeight: "600",
                        marginBottom: "4px",
                      }}
                    >
                      Asal Surat
                    </div>
                    <div
                      style={{
                        fontSize: "14px",
                        color: "#1a202c",
                      }}
                    >
                      {selectedLetter.asal_surat}
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
                      <div
                        style={{
                          fontSize: "12px",
                          color: "#64748b",
                          fontWeight: "600",
                          marginBottom: "4px",
                        }}
                      >
                        Tanggal Terima
                      </div>
                      <div
                        style={{
                          fontSize: "14px",
                          color: "#1a202c",
                        }}
                      >
                        {formatDate(selectedLetter.tanggal_terima)}
                      </div>
                    </div>

                    <div>
                      <div
                        style={{
                          fontSize: "12px",
                          color: "#64748b",
                          fontWeight: "600",
                          marginBottom: "4px",
                        }}
                      >
                        Tanggal Surat
                      </div>
                      <div
                        style={{
                          fontSize: "14px",
                          color: "#1a202c",
                        }}
                      >
                        {formatDate(selectedLetter.tanggal_surat)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div
              style={{
                background: "white",
                borderRadius: "20px",
                padding: "32px",
                boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
              }}
            >
              <h3
                style={{
                  fontSize: "20px",
                  fontWeight: "700",
                  margin: "0 0 24px 0",
                  color: "#1a202c",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                📝 Form Disposisi
              </h3>

              <div
                style={{
                  display: "grid",
                  gap: "24px",
                }}
              >
                <div>
                  <label
                    style={{
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "#374151",
                      display: "block",
                      marginBottom: "8px",
                    }}
                  >
                    Disposisi Kepada *
                  </label>
                  <select
                    value={disposisiData.disposisi_kepada}
                    onChange={(e) =>
                      setDisposisiData((prev) => ({
                        ...prev,
                        disposisi_kepada: e.target.value,
                        disposisi_kepada_lainnya:
                          e.target.value !== "Lainnya"
                            ? ""
                            : prev.disposisi_kepada_lainnya,
                      }))
                    }
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      border: "2px solid #e2e8f0",
                      borderRadius: "12px",
                      fontSize: "14px",
                      outline: "none",
                      cursor: "pointer",
                    }}
                  >
                    <option value="">Pilih Unit Kerja</option>
                    {disposisiOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                {disposisiData.disposisi_kepada === "Lainnya" && (
                  <div>
                    <label
                      style={{
                        fontSize: "14px",
                        fontWeight: "600",
                        color: "#374151",
                        display: "block",
                        marginBottom: "8px",
                      }}
                    >
                      Sebutkan Unit Kerja Lainnya *
                    </label>
                    <input
                      type="text"
                      placeholder="Masukkan nama unit kerja..."
                      value={disposisiData.disposisi_kepada_lainnya}
                      onChange={(e) =>
                        setDisposisiData((prev) => ({
                          ...prev,
                          disposisi_kepada_lainnya: e.target.value,
                        }))
                      }
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        border: "2px solid #e2e8f0",
                        borderRadius: "12px",
                        fontSize: "14px",
                        outline: "none",
                      }}
                    />
                  </div>
                )}

                <div>
                  <label
                    style={{
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "#374151",
                      display: "block",
                      marginBottom: "12px",
                    }}
                  >
                    Instruksi Disposisi *
                  </label>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(160px, 1fr))",
                      gap: "8px",
                      maxHeight: "200px",
                      overflowY: "auto",
                      padding: "16px",
                      border: "2px solid #e2e8f0",
                      borderRadius: "12px",
                      background: "#f8fafc",
                    }}
                  >
                    {instruksiOptions.map((instruksi) => (
                      <label
                        key={instruksi}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          padding: "8px 12px",
                          borderRadius: "8px",
                          cursor: "pointer",
                          fontSize: "13px",
                          background: disposisiData.instruksi.includes(
                            instruksi
                          )
                            ? "#667eea"
                            : "white",
                          color: disposisiData.instruksi.includes(instruksi)
                            ? "white"
                            : "#374151",
                          border: disposisiData.instruksi.includes(instruksi)
                            ? "2px solid #667eea"
                            : "2px solid #e2e8f0",
                          transition: "all 0.2s ease",
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={disposisiData.instruksi.includes(instruksi)}
                          onChange={() => handleInstruksiToggle(instruksi)}
                          style={{ display: "none" }}
                        />
                        {instruksi}
                      </label>
                    ))}
                  </div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#64748b",
                      marginTop: "8px",
                    }}
                  >
                    Dipilih: {disposisiData.instruksi.length} instruksi
                  </div>
                </div>

                <div>
                  <label
                    style={{
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "#374151",
                      display: "block",
                      marginBottom: "8px",
                    }}
                  >
                    Catatan Tambahan
                  </label>
                  <textarea
                    placeholder="Tambahkan catatan atau instruksi khusus..."
                    value={disposisiData.catatan}
                    onChange={(e) =>
                      setDisposisiData((prev) => ({
                        ...prev,
                        catatan: e.target.value,
                      }))
                    }
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      border: "2px solid #e2e8f0",
                      borderRadius: "12px",
                      fontSize: "14px",
                      outline: "none",
                      minHeight: "80px",
                      resize: "vertical",
                    }}
                  />
                </div>

                <div>
                  <label
                    style={{
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "#374151",
                      display: "block",
                      marginBottom: "8px",
                    }}
                  >
                    Upload File Disposisi (TTD)
                  </label>
                  <div
                    style={{
                      border: "2px dashed #e2e8f0",
                      borderRadius: "12px",
                      padding: "24px",
                      textAlign: "center",
                      background: "#f8fafc",
                    }}
                  >
                    <input
                      type="file"
                      onChange={handleFileUpload}
                      accept=".pdf,.jpg,.jpeg,.png"
                      style={{ display: "none" }}
                      id="file-upload"
                    />
                    <label
                      htmlFor="file-upload"
                      style={{
                        display: "inline-block",
                        padding: "12px 24px",
                        background: "#667eea",
                        color: "white",
                        borderRadius: "10px",
                        cursor: "pointer",
                        fontSize: "14px",
                        fontWeight: "600",
                        transition: "all 0.2s ease",
                      }}
                    >
                      Pilih File
                    </label>
                    <div
                      style={{
                        fontSize: "12px",
                        color: "#64748b",
                        marginTop: "8px",
                      }}
                    >
                      PDF, JPG, PNG (Max 5MB)
                    </div>
                    {disposisiData.file_disposisi && (
                      <div
                        style={{
                          marginTop: "12px",
                          padding: "8px 12px",
                          background: "#dcfce7",
                          border: "1px solid #16a34a",
                          borderRadius: "8px",
                          fontSize: "12px",
                          color: "#166534",
                        }}
                      >
                        File dipilih: {disposisiData.file_disposisi.name}
                      </div>
                    )}
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: "16px",
                    marginTop: "8px",
                  }}
                >
                  <button
                    onClick={resetForm}
                    style={{
                      flex: 1,
                      padding: "14px",
                      background: "#f1f5f9",
                      color: "#64748b",
                      border: "2px solid #e2e8f0",
                      borderRadius: "12px",
                      fontSize: "14px",
                      fontWeight: "600",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                  >
                    Batal
                  </button>

                  <button
                    onClick={handleSubmit}
                    disabled={
                      !disposisiData.disposisi_kepada ||
                      disposisiData.instruksi.length === 0
                    }
                    style={{
                      flex: 1,
                      padding: "14px",
                      background:
                        disposisiData.disposisi_kepada &&
                        disposisiData.instruksi.length > 0
                          ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                          : "#cbd5e0",
                      color: "white",
                      border: "none",
                      borderRadius: "12px",
                      fontSize: "14px",
                      fontWeight: "600",
                      cursor:
                        disposisiData.disposisi_kepada &&
                        disposisiData.instruksi.length > 0
                          ? "pointer"
                          : "not-allowed",
                      transition: "all 0.2s ease",
                    }}
                  >
                    Buat Disposisi
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default DisposisiPage;
