// Path: /frontend/src/components/Forms/PemberitahuanFormFields.jsx
import FileUpload from './FileUpload'

const PemberitahuanFormFields = ({ formData, setFormData, readOnly = false }) => {
  
  const handleChange = (field, value) => {
    if (!readOnly) {
      setFormData({ ...formData, [field]: value })
    }
  }

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    border: '2px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '14px',
    fontFamily: "'Poppins', sans-serif",
    outline: 'none',
    background: readOnly ? '#f9fafb' : '#ffffff',
    color: readOnly ? '#6b7280' : '#374151',
    cursor: readOnly ? 'not-allowed' : 'text'
  }

  const labelStyle = {
    display: 'block',
    fontSize: '14px',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '6px'
  }

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif" }}>
      
      {/* Header Jenis Surat */}
      <div style={{
        background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
        color: 'white',
        padding: '20px',
        borderRadius: '12px',
        marginBottom: '30px',
        textAlign: 'center'
      }}>
        <h2 style={{ margin: '0 0 8px 0', fontSize: '24px', fontWeight: '700' }}>
          📢 SURAT PEMBERITAHUAN
        </h2>
        <p style={{ margin: 0, opacity: 0.9, fontSize: '14px' }}>
          Form khusus untuk pemberitahuan resmi
        </p>
      </div>

      {/* Basic Fields */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '20px',
        marginBottom: '20px'
      }}>
        
        <div>
          <label style={labelStyle}>No Disposisi *</label>
          <input
            type="text"
            value={formData.no_disposisi || ''}
            onChange={(e) => handleChange('no_disposisi', e.target.value)}
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
            value={formData.no_surat || ''}
            onChange={(e) => handleChange('no_surat', e.target.value)}
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
            value={formData.asal_surat || ''}
            onChange={(e) => handleChange('asal_surat', e.target.value)}
            style={inputStyle}
            placeholder="Kementerian/Instansi/Organisasi"
            required
            readOnly={readOnly}
          />
        </div>

        <div>
          <label style={labelStyle}>Label Warna *</label>
          <select
            value={formData.label || 'hitam'}
            onChange={(e) => handleChange('label', e.target.value)}
            style={{...inputStyle, cursor: readOnly ? 'not-allowed' : 'pointer'}}
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
            value={formData.tanggal_terima || ''}
            onChange={(e) => handleChange('tanggal_terima', e.target.value)}
            style={inputStyle}
            required
            readOnly={readOnly}
          />
        </div>

        <div>
          <label style={labelStyle}>Tanggal Surat *</label>
          <input
            type="date"
            value={formData.tanggal_surat || ''}
            onChange={(e) => handleChange('tanggal_surat', e.target.value)}
            style={inputStyle}
            required
            readOnly={readOnly}
          />
        </div>
      </div>

      {/* Perihal */}
      <div style={{ marginBottom: '20px' }}>
        <label style={labelStyle}>Perihal *</label>
        <input
          type="text"
          value={formData.perihal || ''}
          onChange={(e) => handleChange('perihal', e.target.value)}
          style={inputStyle}
          placeholder="Ringkasan singkat tentang isi surat"
          required
          readOnly={readOnly}
        />
      </div>

      {/* Uraian */}
      <div style={{ marginBottom: '20px' }}>
        <label style={labelStyle}>Uraian *</label>
        <textarea
          value={formData.uraian || ''}
          onChange={(e) => handleChange('uraian', e.target.value)}
          style={{
            ...inputStyle,
            minHeight: '120px',
            resize: 'vertical'
          }}
          placeholder="Jelaskan secara detail isi dan maksud surat"
          required
          readOnly={readOnly}
        />
      </div>

      {/* Keterangan */}
      <div style={{ marginBottom: '30px' }}>
        <label style={labelStyle}>Keterangan (Opsional)</label>
        <textarea
          value={formData.keterangan || ''}
          onChange={(e) => handleChange('keterangan', e.target.value)}
          style={{
            ...inputStyle,
            minHeight: '80px',
            resize: 'vertical'
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
        label="Upload File Surat Pemberitahuan *"
        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
        maxSize={10}
      />

      {/* Field Khusus Pemberitahuan */}
      <div style={{
        padding: '24px',
        background: '#fef2f2',
        borderRadius: '12px',
        border: '2px solid #ef4444'
      }}>
        <h3 style={{ 
          margin: '0 0 20px 0', 
          fontSize: '18px', 
          fontWeight: '700', 
          color: '#dc2626' 
        }}>
          📋 Field Khusus Pemberitahuan
        </h3>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '20px' 
        }}>
          <div>
            <label style={labelStyle}>Kategori Pemberitahuan</label>
            <select 
              value={formData.kategori_pemberitahuan || ''} 
              onChange={(e) => handleChange('kategori_pemberitahuan', e.target.value)} 
              style={{...inputStyle, cursor: readOnly ? 'not-allowed' : 'pointer'}} 
              disabled={readOnly}
            >
              <option value="">Pilih kategori</option>
              <option value="informasi_umum">Informasi Umum</option>
              <option value="kebijakan_baru">Kebijakan Baru</option>
              <option value="perubahan_jadwal">Perubahan Jadwal</option>
              <option value="peringatan">Peringatan</option>
              <option value="lainnya">Lainnya</option>
            </select>
          </div>
          
          <div>
            <label style={labelStyle}>Tingkat Prioritas</label>
            <select 
              value={formData.tingkat_prioritas || ''} 
              onChange={(e) => handleChange('tingkat_prioritas', e.target.value)} 
              style={{...inputStyle, cursor: readOnly ? 'not-allowed' : 'pointer'}} 
              disabled={readOnly}
            >
              <option value="">Pilih prioritas</option>
              <option value="rendah">Rendah</option>
              <option value="normal">Normal</option>
              <option value="tinggi">Tinggi</option>
              <option value="mendesak">Mendesak</option>
            </select>
          </div>

          <div>
            <label style={labelStyle}>Batas Waktu Respon</label>
            <input 
              type="date" 
              value={formData.batas_waktu_respon || ''} 
              onChange={(e) => handleChange('batas_waktu_respon', e.target.value)} 
              style={inputStyle} 
              readOnly={readOnly} 
            />
          </div>

          <div>
            <label style={labelStyle}>Follow Up Required</label>
            <select 
              value={formData.follow_up_required || ''} 
              onChange={(e) => handleChange('follow_up_required', e.target.value)} 
              style={{...inputStyle, cursor: readOnly ? 'not-allowed' : 'pointer'}} 
              disabled={readOnly}
            >
              <option value="">Pilih</option>
              <option value="ya">Ya</option>
              <option value="tidak">Tidak</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PemberitahuanFormFields