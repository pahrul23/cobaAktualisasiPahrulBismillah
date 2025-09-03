const LetterFilters = ({ filters, setFilters }) => {
  const jenisOptions = [
    { value: 'all', label: 'Semua Jenis' },
    { value: 'pengaduan', label: 'Pengaduan' },
    { value: 'pemberitahuan', label: 'Pemberitahuan' },
    { value: 'undangan', label: 'Undangan' },
    { value: 'audiensi', label: 'Audiensi' },
    { value: 'proposal', label: 'Proposal' }
  ]

  const statusOptions = [
    { value: 'all', label: 'Semua Status' },
    { value: 'baru', label: 'Baru' },
    { value: 'proses', label: 'Dalam Proses' },
    { value: 'selesai', label: 'Selesai' },
    { value: 'ditolak', label: 'Ditolak' }
  ]

  const labelOptions = [
    { value: 'all', label: 'Semua Label' },
    { value: 'merah', label: 'Merah' },
    { value: 'kuning', label: 'Kuning' },
    { value: 'hijau', label: 'Hijau' },
    { value: 'hitam', label: 'Hitam' }
  ]

  return (
    <div style={{
      background: 'white',
      borderRadius: '16px',
      padding: '24px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '20px',
      alignItems: 'end',
      fontFamily: "'Poppins', sans-serif"
    }}>
      
      {/* Search */}
      <div>
        <label style={{
          display: 'block',
          fontSize: '14px',
          fontWeight: '600',
          color: '#374151',
          marginBottom: '8px'
        }}>
          Cari Surat
        </label>
        <input
          type="text"
          placeholder="No surat, perihal, asal..."
          value={filters.q}
          onChange={(e) => setFilters({ ...filters, q: e.target.value })}
          style={{
            width: '100%',
            padding: '12px 16px',
            border: '2px solid #e5e7eb',
            borderRadius: '12px',
            fontSize: '14px',
            outline: 'none',
            transition: 'border-color 0.2s ease',
            fontFamily: "'Poppins', sans-serif"
          }}
          onFocus={(e) => e.target.style.borderColor = '#0ea5e9'}
          onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
        />
      </div>

      {/* Filter Jenis */}
      <div>
        <label style={{
          display: 'block',
          fontSize: '14px',
          fontWeight: '600',
          color: '#374151',
          marginBottom: '8px'
        }}>
          Jenis Surat
        </label>
        <select
          value={filters.jenis}
          onChange={(e) => setFilters({ ...filters, jenis: e.target.value })}
          style={{
            width: '100%',
            padding: '12px 16px',
            border: '2px solid #e5e7eb',
            borderRadius: '12px',
            fontSize: '14px',
            outline: 'none',
            fontFamily: "'Poppins', sans-serif",
            cursor: 'pointer'
          }}
        >
          {jenisOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Filter Status */}
      <div>
        <label style={{
          display: 'block',
          fontSize: '14px',
          fontWeight: '600',
          color: '#374151',
          marginBottom: '8px'
        }}>
          Status
        </label>
        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          style={{
            width: '100%',
            padding: '12px 16px',
            border: '2px solid #e5e7eb',
            borderRadius: '12px',
            fontSize: '14px',
            outline: 'none',
            fontFamily: "'Poppins', sans-serif",
            cursor: 'pointer'
          }}
        >
          {statusOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Filter Label */}
      <div>
        <label style={{
          display: 'block',
          fontSize: '14px',
          fontWeight: '600',
          color: '#374151',
          marginBottom: '8px'
        }}>
          Label Warna
        </label>
        <select
          value={filters.label}
          onChange={(e) => setFilters({ ...filters, label: e.target.value })}
          style={{
            width: '100%',
            padding: '12px 16px',
            border: '2px solid #e5e7eb',
            borderRadius: '12px',
            fontSize: '14px',
            outline: 'none',
            fontFamily: "'Poppins', sans-serif",
            cursor: 'pointer'
          }}
        >
          {labelOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Reset Filters */}
      <div>
        <button
          onClick={() => setFilters({ jenis: 'all', status: 'all', label: 'all', q: '' })}
          style={{
            width: '100%',
            padding: '12px 16px',
            background: '#f8fafc',
            border: '2px solid #e5e7eb',
            borderRadius: '12px',
            fontSize: '14px',
            fontWeight: '600',
            color: '#64748b',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            fontFamily: "'Poppins', sans-serif"
          }}
          onMouseEnter={(e) => {
            e.target.style.background = '#e2e8f0'
            e.target.style.borderColor = '#cbd5e0'
          }}
          onMouseLeave={(e) => {
            e.target.style.background = '#f8fafc'
            e.target.style.borderColor = '#e5e7eb'
          }}
        >
          Reset Filter
        </button>
      </div>
    </div>
  )
}

export default LetterFilters