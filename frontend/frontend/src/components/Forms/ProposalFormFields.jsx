// Path: /frontend/src/components/Forms/ProposalFormFields.jsx
import FileUpload from './FileUpload'

const ProposalFormFields = ({ formData, setFormData, readOnly = false }) => {
  
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
        background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
        color: 'white',
        padding: '20px',
        borderRadius: '12px',
        marginBottom: '30px',
        textAlign: 'center'
      }}>
        <h2 style={{ margin: '0 0 8px 0', fontSize: '24px', fontWeight: '700' }}>
          📋 SURAT PROPOSAL
        </h2>
        <p style={{ margin: 0, opacity: 0.9, fontSize: '14px' }}>
          Form khusus untuk proposal kegiatan/bantuan
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
        label="Upload File Surat Proposal *"
        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
        maxSize={10}
      />

      {/* Field Khusus Proposal */}
      <div style={{
        padding: '24px',
        background: '#fff7ed',
        borderRadius: '12px',
        border: '2px solid #f97316'
      }}>
        <h3 style={{ 
          margin: '0 0 20px 0', 
          fontSize: '18px', 
          fontWeight: '700', 
          color: '#ea580c' 
        }}>
          💼 Field Khusus Proposal
        </h3>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '20px',
          marginBottom: '20px'
        }}>
          <div>
            <label style={labelStyle}>Nama Pengirim</label>
            <input 
              type="text" 
              value={formData.nama_pengirim || ''} 
              onChange={(e) => handleChange('nama_pengirim', e.target.value)} 
              style={inputStyle} 
              placeholder="Nama lengkap pengirim proposal" 
              readOnly={readOnly} 
            />
          </div>
          
          <div>
            <label style={labelStyle}>Instansi/Lembaga/Komunitas</label>
            <input 
              type="text" 
              value={formData.instansi_lembaga_komunitas || ''} 
              onChange={(e) => handleChange('instansi_lembaga_komunitas', e.target.value)} 
              style={inputStyle} 
              placeholder="Nama instansi atau organisasi" 
              readOnly={readOnly} 
            />
          </div>

          <div>
            <label style={labelStyle}>Judul Proposal</label>
            <input 
              type="text" 
              value={formData.judul_proposal || ''} 
              onChange={(e) => handleChange('judul_proposal', e.target.value)} 
              style={inputStyle} 
              placeholder="Judul lengkap proposal" 
              readOnly={readOnly} 
            />
          </div>

          <div>
            <label style={labelStyle}>Jenis Kegiatan</label>
            <select 
              value={formData.jenis_kegiatan || ''} 
              onChange={(e) => handleChange('jenis_kegiatan', e.target.value)} 
              style={{...inputStyle, cursor: readOnly ? 'not-allowed' : 'pointer'}} 
              disabled={readOnly}
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
            <label style={labelStyle}>Tanggal Kegiatan</label>
            <input 
              type="date" 
              value={formData.tanggal_kegiatan || ''} 
              onChange={(e) => handleChange('tanggal_kegiatan', e.target.value)} 
              style={inputStyle} 
              readOnly={readOnly} 
            />
          </div>

          <div>
            <label style={labelStyle}>Total Anggaran</label>
            <input 
              type="number" 
              value={formData.total_anggaran || ''} 
              onChange={(e) => handleChange('total_anggaran', e.target.value)} 
              style={inputStyle} 
              placeholder="Masukkan nominal dalam Rupiah" 
              min="0" 
              readOnly={readOnly} 
            />
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={labelStyle}>Lokasi Kegiatan</label>
          <input 
            type="text" 
            value={formData.lokasi_kegiatan || ''} 
            onChange={(e) => handleChange('lokasi_kegiatan', e.target.value)} 
            style={inputStyle} 
            placeholder="Alamat lengkap lokasi kegiatan" 
            readOnly={readOnly} 
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={labelStyle}>Ringkasan</label>
          <textarea 
            value={formData.ringkasan || ''} 
            onChange={(e) => handleChange('ringkasan', e.target.value)} 
            style={{ ...inputStyle, minHeight: '120px', resize: 'vertical' }} 
            placeholder="Jelaskan secara singkat tentang kegiatan yang diusulkan" 
            readOnly={readOnly} 
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={labelStyle}>Rekomendasi/Dukungan</label>
          <textarea 
            value={formData.rekomendasi_dukungan || ''} 
            onChange={(e) => handleChange('rekomendasi_dukungan', e.target.value)} 
            style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }} 
            placeholder="Jelaskan bantuan atau dukungan yang diharapkan" 
            readOnly={readOnly} 
          />
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '20px',
          marginBottom: '20px'
        }}>
          <div>
            <label style={labelStyle}>PIC Penanganan</label>
            <input 
              type="text" 
              value={formData.pic_penanganan || ''} 
              onChange={(e) => handleChange('pic_penanganan', e.target.value)} 
              style={inputStyle} 
              placeholder="Nama PIC yang menangani" 
              readOnly={readOnly} 
            />
          </div>

          <div>
            <label style={labelStyle}>Nomor Rekening</label>
            <input 
              type="text" 
              value={formData.nomor_rekening || ''} 
              onChange={(e) => handleChange('nomor_rekening', e.target.value)} 
              style={inputStyle} 
              placeholder="Nomor rekening untuk bantuan dana" 
              readOnly={readOnly} 
            />
          </div>
        </div>

        <div>
          <label style={labelStyle}>Catatan/Tindak Lanjut</label>
          <textarea 
            value={formData.catatan_tindak_lanjut || ''} 
            onChange={(e) => handleChange('catatan_tindak_lanjut', e.target.value)} 
            style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }} 
            placeholder="Catatan khusus atau rencana tindak lanjut" 
            readOnly={readOnly} 
          />
        </div>
      </div>
    </div>
  )
}

export default ProposalFormFields