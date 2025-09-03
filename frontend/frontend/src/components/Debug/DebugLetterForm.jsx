// Path: /frontend/src/components/Debug/DebugLetterForm.jsx
// Komponen untuk testing dan debug field tambahan

import { useState, useEffect } from 'react'
import LetterFormFields from '../Forms/LetterFormFields'

const DebugLetterForm = () => {
  const [formData, setFormData] = useState({
    no_disposisi: '',
    no_surat: '001/A/DPD/2025',
    asal_surat: 'Kementerian/Instansi/Organisasi',
    label: 'hitam',
    tanggal_terima: '2025-09-02',
    tanggal_surat: '2025-09-01',
    jenis: 'audiensi', // FORCE SET untuk testing
    perihal: 'Testing form fields',
    uraian: 'Testing additional fields functionality',
    keterangan: 'Debug mode active'
  })

  const [manualJenis, setManualJenis] = useState('audiensi')

  // Force update jenis via button untuk testing
  const handleForceJenis = (jenis) => {
    console.log(`🔧 FORCE SET JENIS: ${jenis}`)
    setManualJenis(jenis)
    setFormData(prev => ({ ...prev, jenis: jenis }))
  }

  const jenisOptions = [
    { value: '', label: '-- Kosong --', color: '#6b7280' },
    { value: 'pengaduan', label: 'Pengaduan', color: '#dc2626' },
    { value: 'undangan', label: 'Undangan', color: '#7c3aed' },
    { value: 'audiensi', label: 'Audiensi', color: '#059669' },
    { value: 'proposal', label: 'Proposal', color: '#ea580c' },
    { value: 'pemberitahuan', label: 'Pemberitahuan', color: '#0369a1' }
  ]

  return (
    <div style={{ 
      fontFamily: "'Poppins', sans-serif", 
      maxWidth: '1200px', 
      margin: '20px auto',
      padding: '0 20px'
    }}>
      
      {/* Debug Control Panel */}
      <div style={{
        background: '#fef3c7',
        border: '2px solid #f59e0b',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '20px'
      }}>
        <h2 style={{ margin: '0 0 16px 0', color: '#92400e' }}>
          🐛 DEBUG MODE - Letter Form Testing
        </h2>
        
        <div style={{ marginBottom: '16px' }}>
          <strong>Quick Test Jenis Surat:</strong>
        </div>
        
        <div style={{ 
          display: 'flex', 
          gap: '12px', 
          flexWrap: 'wrap',
          marginBottom: '16px' 
        }}>
          {jenisOptions.map(option => (
            <button
              key={option.value}
              onClick={() => handleForceJenis(option.value)}
              style={{
                padding: '8px 16px',
                background: manualJenis === option.value ? option.color : 'white',
                color: manualJenis === option.value ? 'white' : option.color,
                border: `2px solid ${option.color}`,
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600'
              }}
            >
              {option.label}
            </button>
          ))}
        </div>

        {/* Current State Display */}
        <div style={{
          background: '#1f2937',
          color: '#f3f4f6',
          padding: '12px',
          borderRadius: '8px',
          fontSize: '13px',
          fontFamily: 'monospace'
        }}>
          <div><strong>Current formData.jenis:</strong> "{formData.jenis || 'undefined'}"</div>
          <div><strong>Manual jenis state:</strong> "{manualJenis || 'undefined'}"</div>
          <div><strong>Additional fields should show:</strong> {formData.jenis ? '✅ YES' : '❌ NO'}</div>
          <div><strong>No disposisi:</strong> "{formData.no_disposisi || 'not generated'}"</div>
        </div>
      </div>

      {/* Actual Form */}
      <div style={{
        background: 'white',
        borderRadius: '20px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
        overflow: 'hidden'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)',
          color: 'white',
          padding: '24px'
        }}>
          <h2 style={{ margin: '0 0 8px 0', fontSize: '24px', fontWeight: '600' }}>
            Form Testing - Current Jenis: {formData.jenis || 'None'}
          </h2>
          <p style={{ margin: 0, opacity: 0.9, fontSize: '14px' }}>
            Form ini menggunakan LetterFormFields component yang sama dengan aplikasi utama
          </p>
        </div>

        <div style={{ padding: '32px' }}>
          <LetterFormFields
            formData={formData}
            setFormData={setFormData}
            readOnly={false}
          />
        </div>
      </div>

      {/* Current Form Data JSON */}
      <div style={{
        background: '#f8fafc',
        border: '1px solid #e2e8f0',
        borderRadius: '12px',
        padding: '20px',
        marginTop: '20px'
      }}>
        <h3 style={{ margin: '0 0 12px 0', color: '#374151' }}>Current Form Data:</h3>
        <pre style={{
          background: '#1f2937',
          color: '#f3f4f6',
          padding: '16px',
          borderRadius: '8px',
          fontSize: '12px',
          overflow: 'auto',
          margin: 0
        }}>
          {JSON.stringify(formData, null, 2)}
        </pre>
      </div>
    </div>
  )
}

export default DebugLetterForm