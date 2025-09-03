// Path: /frontend/src/components/Forms/FileUpload.jsx
import { useState, useRef } from 'react'

const FileUpload = ({ 
  formData, 
  setFormData, 
  readOnly = false,
  label = "Upload File Surat",
  accept = ".pdf,.doc,.docx,.jpg,.jpeg,.png",
  maxSize = 10 // MB
}) => {
  const [dragActive, setDragActive] = useState(false)
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef(null)

  const labelStyle = {
    display: 'block',
    fontSize: '14px',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '6px'
  }

  const handleFiles = async (files) => {
    if (!files || files.length === 0) return
    
    const file = files[0]
    
    // Validasi ukuran file
    if (file.size > maxSize * 1024 * 1024) {
      alert(`File terlalu besar. Maksimal ${maxSize}MB`)
      return
    }

    // Validasi tipe file
    const allowedTypes = accept.split(',').map(type => type.trim())
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase()
    
    if (!allowedTypes.includes(fileExtension)) {
      alert(`Tipe file tidak didukung. Yang diperbolehkan: ${accept}`)
      return
    }

    setUploading(true)
    
    try {
      // Convert file ke base64 hanya untuk preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setFormData({
          ...formData,
          file_surat: {
            name: file.name,
            size: file.size,
            type: file.type,
            data: e.target.result,     // base64 (preview)
            originalFile: file         // simpan File asli (untuk upload ke server)
          }
        })
        setUploading(false)
      }
      reader.readAsDataURL(file)
      
    } catch (error) {
      console.error('Error uploading file:', error)
      alert('Gagal upload file')
      setUploading(false)
    }
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (readOnly) return
    const files = e.dataTransfer.files
    handleFiles(files)
  }

  const handleChange = (e) => {
    e.preventDefault()
    if (readOnly) return
    const files = e.target.files
    handleFiles(files)
  }

  const handleButtonClick = () => {
    if (readOnly) return
    inputRef.current?.click()
  }

  const handleRemoveFile = () => {
    if (readOnly) return
    setFormData({
      ...formData,
      file_surat: null
    })
    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div style={{ marginBottom: '20px' }}>
      <label style={labelStyle}>{label}</label>
      
      {!formData.file_surat ? (
        // Upload Area
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          style={{
            border: `2px dashed ${dragActive ? '#0ea5e9' : '#d1d5db'}`,
            borderRadius: '12px',
            padding: '40px 20px',
            textAlign: 'center',
            background: dragActive ? '#f0f9ff' : (readOnly ? '#f9fafb' : '#ffffff'),
            cursor: readOnly ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s ease'
          }}
          onClick={handleButtonClick}
        >
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            onChange={handleChange}
            style={{ display: 'none' }}
            disabled={readOnly}
          />
          
          <div style={{
            fontSize: '48px',
            marginBottom: '16px',
            opacity: uploading ? 0.5 : 1
          }}>
            {uploading ? '⏳' : '📎'}
          </div>
          
          <div style={{
            fontSize: '16px',
            fontWeight: '600',
            color: '#374151',
            marginBottom: '8px'
          }}>
            {uploading ? 'Mengupload file...' : (
              readOnly ? 'Upload disabled' : 'Klik atau drag file ke sini'
            )}
          </div>
          
          <div style={{
            fontSize: '14px',
            color: '#6b7280'
          }}>
            Format: {accept} | Maks: {maxSize}MB
          </div>
        </div>
      ) : (
        // File Preview
        <div style={{
          border: '2px solid #10b981',
          borderRadius: '12px',
          padding: '16px',
          background: '#f0fdf4',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ fontSize: '24px' }}>
              {formData.file_surat.type?.includes('pdf') ? '📄' : 
               formData.file_surat.type?.includes('image') ? '🖼️' : '📄'}
            </div>
            <div>
              <div style={{
                fontSize: '14px',
                fontWeight: '600',
                color: '#059669'
              }}>
                {formData.file_surat.name}
              </div>
              <div style={{
                fontSize: '12px',
                color: '#6b7280'
              }}>
                {formatFileSize(formData.file_surat.size)}
              </div>
            </div>
          </div>
          
          {!readOnly && (
            <button
              type="button"
              onClick={handleRemoveFile}
              style={{
                background: '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 12px',
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              ✕ Hapus
            </button>
          )}
        </div>
      )}
      
      {/* File Guidelines */}
      <div style={{
        fontSize: '12px',
        color: '#6b7280',
        marginTop: '8px'
      }}>
        💡 Upload file surat asli (PDF/gambar) sebagai bukti dokumentasi
      </div>
    </div>
  )
}

export default FileUpload