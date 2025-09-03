// Path: /frontend/src/components/Forms/LetterFormFields.jsx
import { useEffect } from 'react'

const LetterFormFields = ({ formData, setFormData, readOnly = false }) => {
  
  const handleChange = (field, value) => {
    if (!readOnly) {
      setFormData({ ...formData, [field]: value })
    }
  }

  // Auto generate no_disposisi berdasarkan jenis
  useEffect(() => {
    if (formData.jenis && !formData.no_disposisi) {
      const prefix = {
        'pengaduan': 'PG',
        'pemberitahuan': 'PB', 
        'undangan': 'UN',
        'audiensi': 'AD',
        'proposal': 'PR'
      }
      
      const currentDate = new Date()
      const month = String(currentDate.getMonth() + 1).padStart(2, '0')
      const year = currentDate.getFullYear()
      const randomNum = String(Math.floor(Math.random() * 1000)).padStart(3, '0')
      
      const noDisposisi = `${prefix[formData.jenis]}-${randomNum}/${month}/${year}`
      setFormData(prev => ({ ...prev, no_disposisi: noDisposisi }))
    }
  }, [formData.jenis, formData.no_disposisi, setFormData])

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
      
      {/* Basic Fields - Selalu Ada */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '20px',
        marginBottom: '20px'
      }}>
        
        {/* No Disposisi - Always Disabled */}
        <div>
          <label style={labelStyle}>No Disposisi *</label>
          <input
            type="text"
            value={formData.no_disposisi || ''}
            style={{
              ...inputStyle,
              background: '#f3f4f6',
              cursor: 'not-allowed'
            }}
            disabled
          />
        </div>

        {/* No Surat */}
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

        {/* Asal Surat */}
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

        {/* Label Warna */}
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

        {/* Tanggal Terima */}
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

        {/* Tanggal Surat */}
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

      {/* DROPDOWN JENIS SURAT - WAJIB ADA */}
      <div style={{ marginBottom: '20px' }}>
        <label style={labelStyle}>Jenis Surat *</label>
        <select
          value={formData.jenis || ''}
          onChange={(e) => handleChange('jenis', e.target.value)}
          style={{...inputStyle, cursor: readOnly ? 'not-allowed' : 'pointer'}}
          disabled={readOnly}
          required
        >
          <option value="">-- Pilih Jenis Surat --</option>
          <option value="pengaduan">Pengaduan</option>
          <option value="undangan">Undangan</option>
          <option value="audiensi">Audiensi</option>
          <option value="proposal">Proposal</option>
          <option value="pemberitahuan">Pemberitahuan</option>
        </select>
      </div>

      {/* Perihal - Full Width */}
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
      <div style={{ marginBottom: '20px' }}>
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

      {/* FILE UPLOAD - PERBAIKAN UTAMA */}
      {!readOnly && (
        <div style={{ marginBottom: '20px' }}>
          <label style={labelStyle}>File Surat (PDF, DOC, DOCX)</label>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => {
              const file = e.target.files[0]
              if (file) {
                // Validasi tipe file
                const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
                if (!allowedTypes.includes(file.type)) {
                  alert('Hanya file PDF, DOC, atau DOCX yang diizinkan')
                  e.target.value = ''
                  return
                }
                
                // Validasi ukuran (10MB)
                if (file.size > 10 * 1024 * 1024) {
                  alert('Ukuran file tidak boleh lebih dari 10MB')
                  e.target.value = ''
                  return
                }
                
                // SIMPAN FILE OBJECT, BUKAN BASE64
                handleChange('file_surat', file)
              }
            }}
            style={{
              ...inputStyle,
              cursor: 'pointer'
            }}
          />
          {formData.file_surat && (
            <div style={{ marginTop: '8px', fontSize: '12px', color: '#10b981' }}>
              File dipilih: {formData.file_surat.name}
            </div>
          )}
        </div>
      )}

      {/* Field Tambahan Pengaduan */}
      {formData.jenis === 'pengaduan' && (
        <div style={{
          marginTop: '30px',
          padding: '24px',
          background: '#fef3c7',
          borderRadius: '12px',
          border: '2px solid #f59e0b'
        }}>
          <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: '700', color: '#92400e' }}>
            Form Tambahan Pengaduan
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            <div>
              <label style={labelStyle}>Jenis Pengaduan</label>
              <select 
                value={formData.jenis_pengaduan || ''} 
                onChange={(e) => handleChange('jenis_pengaduan', e.target.value)} 
                style={{...inputStyle, cursor: readOnly ? 'not-allowed' : 'pointer'}} 
                disabled={readOnly}
              >
                <option value="">Pilih jenis pengaduan</option>
                <option value="pelayanan_publik">Pelayanan Publik</option>
                <option value="korupsi">Korupsi</option>
                <option value="lingkungan">Lingkungan</option>
                <option value="infrastruktur">Infrastruktur</option>
                <option value="lainnya">Lainnya</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Tingkat Urgensi</label>
              <select 
                value={formData.tingkat_urgensi || ''} 
                onChange={(e) => handleChange('tingkat_urgensi', e.target.value)} 
                style={{...inputStyle, cursor: readOnly ? 'not-allowed' : 'pointer'}} 
                disabled={readOnly}
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

      {/* Field Tambahan Undangan */}
      {formData.jenis === 'undangan' && (
        <div style={{ 
          marginTop: '30px', 
          padding: '24px', 
          background: '#f0f9ff', 
          borderRadius: '12px', 
          border: '2px solid #0ea5e9' 
        }}>
          <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: '700', color: '#0369a1' }}>
            Form Tambahan Undangan
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            <div>
              <label style={labelStyle}>Hari/Tanggal Acara *</label>
              <input 
                type="date" 
                value={formData.hari_tanggal_acara || ''} 
                onChange={(e) => handleChange('hari_tanggal_acara', e.target.value)} 
                style={inputStyle} 
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
          <div style={{ marginTop: '20px' }}>
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
      )}

      {/* Field Tambahan Audiensi */}
      {formData.jenis === 'audiensi' && (
        <div style={{ 
          marginTop: '30px', 
          padding: '24px', 
          background: '#f0fdf4', 
          borderRadius: '12px', 
          border: '2px solid #10b981' 
        }}>
          <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: '700', color: '#059669' }}>
            Form Tambahan Audiensi
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            <div>
              <label style={labelStyle}>Hari/Tanggal *</label>
              <input 
                type="date" 
                value={formData.hari_tanggal || ''} 
                onChange={(e) => handleChange('hari_tanggal', e.target.value)} 
                style={inputStyle} 
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
                placeholder="Ruang Kerja Ketua DPD RI" 
                readOnly={readOnly} 
              />
            </div>
            <div>
              <label style={labelStyle}>Nama Pemohon</label>
              <input 
                type="text" 
                value={formData.nama_pemohon || ''} 
                onChange={(e) => handleChange('nama_pemohon', e.target.value)} 
                style={inputStyle} 
                placeholder="Nama lengkap pemohon audiensi" 
                readOnly={readOnly} 
              />
            </div>
            <div>
              <label style={labelStyle}>Instansi/Organisasi</label>
              <input 
                type="text" 
                value={formData.instansi_organisasi || ''} 
                onChange={(e) => handleChange('instansi_organisasi', e.target.value)} 
                style={inputStyle} 
                placeholder="Instansi/organisasi asal pemohon" 
                readOnly={readOnly} 
              />
            </div>
            <div>
              <label style={labelStyle}>Jumlah Peserta</label>
              <input 
                type="number" 
                value={formData.jumlah_peserta || ''} 
                onChange={(e) => handleChange('jumlah_peserta', e.target.value)} 
                style={inputStyle} 
                placeholder="Jumlah orang yang akan hadir" 
                min="1" 
                readOnly={readOnly} 
              />
            </div>
          </div>
          <div style={{ marginTop: '20px' }}>
            <label style={labelStyle}>Topik Audiensi</label>
            <textarea 
              value={formData.topik_audiensi || ''} 
              onChange={(e) => handleChange('topik_audiensi', e.target.value)} 
              style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }} 
              placeholder="Topik yang akan dibahas dalam audiensi" 
              readOnly={readOnly} 
            />
          </div>
        </div>
      )}

      {/* Field Tambahan Proposal */}
      {formData.jenis === 'proposal' && (
        <div style={{ 
          marginTop: '30px', 
          padding: '24px', 
          background: '#fff7ed', 
          borderRadius: '12px', 
          border: '2px solid #f97316' 
        }}>
          <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: '700', color: '#ea580c' }}>
            Form Tambahan Proposal
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
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
          <div style={{ marginTop: '20px' }}>
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
          <div style={{ marginTop: '20px' }}>
            <label style={labelStyle}>Ringkasan</label>
            <textarea 
              value={formData.ringkasan || ''} 
              onChange={(e) => handleChange('ringkasan', e.target.value)} 
              style={{ ...inputStyle, minHeight: '120px', resize: 'vertical' }} 
              placeholder="Jelaskan secara singkat tentang kegiatan yang diusulkan" 
              readOnly={readOnly} 
            />
          </div>
        </div>
      )}

      {/* Field Tambahan Pemberitahuan */}
      {formData.jenis === 'pemberitahuan' && (
        <div style={{ 
          marginTop: '30px', 
          padding: '24px', 
          background: '#fef2f2', 
          borderRadius: '12px', 
          border: '2px solid #ef4444' 
        }}>
          <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: '700', color: '#dc2626' }}>
            Form Tambahan Pemberitahuan
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
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
      )}
    </div>
  )
}

export default LetterFormFields