// Path: /frontend/src/components/Forms/UndanganFormFields.jsx
import FileUpload from './FileUpload'

const UndanganFormFields = ({ formData, setFormData, readOnly = false }) => {
  
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
        background: 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)',
        color: 'white',
        padding: '20px',
        borderRadius: '12px',
        marginBottom: '30px',
        textAlign: 'center'
      }}>
        <h2 style={{ margin: '0 0 8px 0', fontSize: '24px', fontWeight: '700' }}>
          🎉 SURAT UNDANGAN
        </h2>
        <p style={{ margin: 0, opacity: 0.9, fontSize: '14px' }}>
          Form khusus untuk undangan acara/rapat
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
        label="Upload File Surat Undangan *"
        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
        maxSize={10}
      />

      {/* Field Khusus Undangan */}
      <div style={{
        padding: '24px',
        background: '#f0f9ff',
        borderRadius: '12px',
        border: '2px solid #0ea5e9'
      }}>
        <h3 style={{ 
          margin: '0 0 20px 0', 
          fontSize: '18px', 
          fontWeight: '700', 
          color: '#0369a1' 
        }}>
          🎪 Field Khusus Undangan
        </h3>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '20px',
          marginBottom: '20px'
        }}>
          <div>
            <label style={labelStyle}>Hari/Tanggal Acara *</label>
            <input 
              type="date" 
              value={formData.hari_tanggal_acara || ''} 
              onChange={(e) => handleChange('hari_tanggal_acara', e.target.value)} 
              style={inputStyle} 
              required
              readOnly={readOnly} 
            />
          </div>
          
          <div>
            <label style={labelStyle}>Pukul *</label>
            <input 
              type="time" 
              value={formData.pukul || ''} 
              onChange={(e) => handleChange('pukul', e.target.value)} 
              style={inputStyle}
              required 
              readOnly={readOnly} 
            />
          </div>

          <div>
            <label style={labelStyle}>Tempat *</label>
            <input 
              type="text" 
              value={formData.tempat || ''} 
              onChange={(e) => handleChange('tempat', e.target.value)} 
              style={inputStyle} 
              placeholder="Ruang Rapat Utama DPD RI"
              required 
              readOnly={readOnly} 
            />
          </div>

          <div>
            <label style={labelStyle}>Jenis Acara</label>
            <input 
              type="text" 
              value={formData.jenis_acara || ''} 
              onChange={(e) => handleChange('jenis_acara', e.target.value)} 
              style={inputStyle} 
              placeholder="Rapat, Seminar, Workshop" 
              readOnly={readOnly} 
            />
          </div>

          <div>
            <label style={labelStyle}>Dress Code</label>
            <input 
              type="text" 
              value={formData.dress_code || ''} 
              onChange={(e) => handleChange('dress_code', e.target.value)} 
              style={inputStyle} 
              placeholder="Formal, Semi Formal, Casual" 
              readOnly={readOnly} 
            />
          </div>

          <div>
            <label style={labelStyle}>RSVP Required</label>
            <select 
              value={formData.rsvp_required || ''} 
              onChange={(e) => handleChange('rsvp_required', e.target.value)} 
              style={{...inputStyle, cursor: readOnly ? 'not-allowed' : 'pointer'}} 
              disabled={readOnly}
            >
              <option value="">Pilih</option>
              <option value="ya">Ya</option>
              <option value="tidak">Tidak</option>
            </select>
          </div>
        </div>

        <div>
          <label style={labelStyle}>Dokumentasi</label>
          <textarea 
            value={formData.dokumentasi || ''} 
            onChange={(e) => handleChange('dokumentasi', e.target.value)} 
            style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }} 
            placeholder="Catatan khusus untuk dokumentasi acara" 
            readOnly={readOnly} 
          />
        </div>
      </div>
    </div>
  )
}

export default UndanganFormFields