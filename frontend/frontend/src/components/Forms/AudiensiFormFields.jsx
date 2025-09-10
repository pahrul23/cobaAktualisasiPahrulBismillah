// Path: /frontend/src/components/Forms/AudiensiFormFields.jsx
import FileUpload from "./FileUpload";

const AudiensiFormFields = ({ formData, setFormData, readOnly = false }) => {
  const handleChange = (field, value) => {
    if (!readOnly) {
      setFormData({ ...formData, [field]: value });
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "12px 16px",
    border: "2px solid #e5e7eb",
    borderRadius: "8px",
    fontSize: "14px",
    fontFamily: "'Poppins', sans-serif",
    outline: "none",
    background: readOnly ? "#f9fafb" : "#ffffff",
    color: readOnly ? "#6b7280" : "#374151",
    cursor: readOnly ? "not-allowed" : "text",
  };

  const labelStyle = {
    display: "block",
    fontSize: "14px",
    fontWeight: "600",
    color: "#374151",
    marginBottom: "6px",
  };

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif" }}>
      {/* Header Jenis Surat */}
      <div
        style={{
          background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
          color: "white",
          padding: "20px",
          borderRadius: "12px",
          marginBottom: "30px",
          textAlign: "center",
        }}
      >
        <h2
          style={{ margin: "0 0 8px 0", fontSize: "24px", fontWeight: "700" }}
        >
          🤝 SURAT AUDIENSI
        </h2>
        <p style={{ margin: 0, opacity: 0.9, fontSize: "14px" }}>
          Form khusus untuk permohonan audiensi
        </p>
      </div>

      {/* Basic Fields */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "20px",
          marginBottom: "20px",
        }}
      >
        <div>
          <label style={labelStyle}>No Disposisi *</label>
          <input
            type="text"
            value={formData.no_disposisi || ""}
            onChange={(e) => handleChange("no_disposisi", e.target.value)}
            style={inputStyle}
            placeholder="Masukkan nomor disposisi"
            required
            readOnly={readOnly}
          />
        </div>

        <div>
          <label style={labelStyle}>No Surat *</label>
          <input
            type="text"
            value={formData.no_surat || ""}
            onChange={(e) => handleChange("no_surat", e.target.value)}
            style={inputStyle}
            placeholder="001/A/DPD/2025"
            required
            readOnly={readOnly}
          />
        </div>

        <div>
          <label style={labelStyle}>Asal Surat *</label>
          <input
            type="text"
            value={formData.asal_surat || ""}
            onChange={(e) => handleChange("asal_surat", e.target.value)}
            style={inputStyle}
            placeholder="Kementerian/Instansi/Organisasi"
            required
            readOnly={readOnly}
          />
        </div>

        <div>
          <label style={labelStyle}>Label Warna *</label>
          <select
            value={formData.label || "hitam"}
            onChange={(e) => handleChange("label", e.target.value)}
            style={{
              ...inputStyle,
              cursor: readOnly ? "not-allowed" : "pointer",
            }}
            disabled={readOnly}
            required
          >
            <option value="merah">Merah</option>
            <option value="kuning">Kuning</option>
            <option value="hijau">Hijau</option>
            <option value="hitam">Hitam</option>
          </select>
        </div>

        <div>
          <label style={labelStyle}>Tanggal Terima *</label>
          <input
            type="date"
            value={formData.tanggal_terima || ""}
            onChange={(e) => handleChange("tanggal_terima", e.target.value)}
            style={inputStyle}
            required
            readOnly={readOnly}
          />
        </div>

        <div>
          <label style={labelStyle}>Tanggal Surat *</label>
          <input
            type="date"
            value={formData.tanggal_surat || ""}
            onChange={(e) => handleChange("tanggal_surat", e.target.value)}
            style={inputStyle}
            required
            readOnly={readOnly}
          />
        </div>
      </div>

      {/* Perihal */}
      <div style={{ marginBottom: "20px" }}>
        <label style={labelStyle}>Perihal *</label>
        <input
          type="text"
          value={formData.perihal || ""}
          onChange={(e) => handleChange("perihal", e.target.value)}
          style={inputStyle}
          placeholder="Ringkasan singkat tentang isi surat"
          required
          readOnly={readOnly}
        />
      </div>

      {/* Uraian */}
      <div style={{ marginBottom: "20px" }}>
        <label style={labelStyle}>Uraian *</label>
        <textarea
          value={formData.uraian || ""}
          onChange={(e) => handleChange("uraian", e.target.value)}
          style={{
            ...inputStyle,
            minHeight: "120px",
            resize: "vertical",
          }}
          placeholder="Jelaskan secara detail isi dan maksud surat"
          required
          readOnly={readOnly}
        />
      </div>

      {/* Keterangan */}
      <div style={{ marginBottom: "30px" }}>
        <label style={labelStyle}>Keterangan (Opsional)</label>
        <textarea
          value={formData.keterangan || ""}
          onChange={(e) => handleChange("keterangan", e.target.value)}
          style={{
            ...inputStyle,
            minHeight: "80px",
            resize: "vertical",
          }}
          placeholder="Catatan tambahan atau keterangan khusus"
          readOnly={readOnly}
        />
      </div>

      {/* File Upload */}
      <FileUpload
        formData={formData}
        setFormData={setFormData}
        readOnly={readOnly}
        label="Upload File Surat Audiensi *"
        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
        maxSize={10}
      />

      {/* Field Khusus Audiensi - UPDATED */}
      <div
        style={{
          padding: "24px",
          background: "#f0fdf4",
          borderRadius: "12px",
          border: "2px solid #10b981",
        }}
      >
        <h3
          style={{
            margin: "0 0 20px 0",
            fontSize: "18px",
            fontWeight: "700",
            color: "#059669",
          }}
        >
          📅 Field Khusus Audiensi
        </h3>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "20px",
            marginBottom: "20px",
          }}
        >
          <div>
            <label style={labelStyle}>
              Hari/Tanggal
              <span
                style={{
                  fontSize: "12px",
                  color: "#6b7280",
                  fontWeight: "400",
                }}
              >
                (Akan ditentukan Ketua)
              </span>
            </label>
            <input
              type="date"
              value={formData.hari_tanggal || ""}
              onChange={(e) => handleChange("hari_tanggal", e.target.value)}
              style={inputStyle}
              readOnly={readOnly}
              placeholder="Menunggu konfirmasi ketua"
            />
          </div>
          {/* UPDATED: Pukul jadi optional */}
          <div>
            <label style={labelStyle}>
              Pukul
              <span
                style={{
                  fontSize: "12px",
                  color: "#6b7280",
                  fontWeight: "400",
                }}
              >
                (Akan ditentukan Ketua)
              </span>
            </label>
            <input
              type="time"
              value={formData.pukul || ""}
              onChange={(e) => handleChange("pukul", e.target.value)}
              style={inputStyle}
              readOnly={readOnly}
              placeholder="Menunggu konfirmasi ketua"
            />
          </div>

          {/* UPDATED: Tempat jadi optional */}
          <div>
            <label style={labelStyle}>
              Tempat
              <span
                style={{
                  fontSize: "12px",
                  color: "#6b7280",
                  fontWeight: "400",
                }}
              >
                (Akan ditentukan Ketua)
              </span>
            </label>
            <input
              type="text"
              value={formData.tempat || ""}
              onChange={(e) => handleChange("tempat", e.target.value)}
              style={inputStyle}
              placeholder="Menunggu konfirmasi ketua"
              readOnly={readOnly}
            />
          </div>

          <div>
            <label style={labelStyle}>Nama Pemohon</label>
            <input
              type="text"
              value={formData.nama_pemohon || ""}
              onChange={(e) => handleChange("nama_pemohon", e.target.value)}
              style={inputStyle}
              placeholder="Nama lengkap pemohon audiensi"
              readOnly={readOnly}
            />
          </div>

          <div>
            <label style={labelStyle}>Instansi/Organisasi</label>
            <input
              type="text"
              value={formData.instansi_organisasi || ""}
              onChange={(e) =>
                handleChange("instansi_organisasi", e.target.value)
              }
              style={inputStyle}
              placeholder="Instansi/organisasi asal pemohon"
              readOnly={readOnly}
            />
          </div>

          <div>
            <label style={labelStyle}>Jumlah Peserta</label>
            <input
              type="number"
              value={formData.jumlah_peserta || ""}
              onChange={(e) => handleChange("jumlah_peserta", e.target.value)}
              style={inputStyle}
              placeholder="Jumlah orang yang akan hadir"
              min="1"
              readOnly={readOnly}
            />
          </div>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label style={labelStyle}>Topik Audiensi</label>
          <textarea
            value={formData.topik_audiensi || ""}
            onChange={(e) => handleChange("topik_audiensi", e.target.value)}
            style={{ ...inputStyle, minHeight: "100px", resize: "vertical" }}
            placeholder="Topik yang akan dibahas dalam audiensi"
            readOnly={readOnly}
          />
        </div>

        {/* UPDATED: Label Dokumentasi jadi Disposisi */}
        <div>
          <label style={labelStyle}>Disposisi</label>
          <textarea
            value={formData.dokumentasi || ""}
            onChange={(e) => handleChange("dokumentasi", e.target.value)}
            style={{ ...inputStyle, minHeight: "80px", resize: "vertical" }}
            placeholder="Catatan disposisi untuk audiensi"
            readOnly={readOnly}
          />
        </div>

        {/* Info Box tentang Approval */}
        <div
          style={{
            marginTop: "20px",
            padding: "16px",
            background: "#fef3c7",
            borderRadius: "8px",
            border: "1px solid #f59e0b",
          }}
        >
          <div
            style={{
              fontSize: "14px",
              fontWeight: "600",
              color: "#92400e",
              marginBottom: "8px",
            }}
          >
            ℹ️ Informasi Penting
          </div>
          <div
            style={{ fontSize: "13px", color: "#92400e", lineHeight: "1.5" }}
          >
            • Audiensi memerlukan persetujuan dari Ketua sebelum masuk agenda
            <br />
            • Tanggal, waktu dan tempat final akan ditentukan oleh Ketua saat
            approval
            <br />• Anda akan mendapat notifikasi setelah audiensi
            disetujui/ditolak
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudiensiFormFields;
