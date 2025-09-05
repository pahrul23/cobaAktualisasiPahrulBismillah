// Path: /frontend/src/pages/Letters/LetterDetailPage.jsx
import { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import DashboardLayout from '../../components/Layout/DashboardLayout'
import DisposisiButton from '../../components/Letters/DisposisiButton'
import useAuth from '../../hooks/useAuth'

const LetterDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { token } = useAuth()
  
  const [letter, setLetter] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editMode, setEditMode] = useState(location.state?.editMode || false)
  const [formData, setFormData] = useState({})
  const [selectedFiles, setSelectedFiles] = useState([])
  const [message, setMessage] = useState("")
  const [saveLoading, setSaveLoading] = useState(false)

  // Fetch letter detail
  const fetchLetterDetail = async () => {
    try {
      setLoading(true)
      const response = await fetch(`http://localhost:4000/api/letters/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      const data = await response.json()
      
      if (data.success) {
        setLetter(data.data)
        setFormData({ ...data.data })
      } else {
        setMessage("Surat tidak ditemukan")
      }
    } catch (error) {
      console.error('Error fetching letter detail:', error)
      setMessage("Gagal memuat detail surat")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (token && id) {
      fetchLetterDetail()
    }
  }, [token, id])

  // Utility functions
  const getJenisIcon = (jenis) => {
    switch (jenis) {
      case "pengaduan": return "📝";
      case "pemberitahuan": return "📢";
      case "undangan": return "📅";
      case "audiensi": return "🤝";
      case "proposal": return "📋";
      default: return "📄";
    }
  };

  const getJenisGradient = (jenis) => {
    switch (jenis) {
      case "pengaduan": return "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)";
      case "pemberitahuan": return "linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)";
      case "undangan": return "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)";
      case "audiensi": return "linear-gradient(135deg, #f59e0b 0%, #f97316 100%)";
      case "proposal": return "linear-gradient(135deg, #10b981 0%, #059669 100%)";
      default: return "linear-gradient(135deg, #6b7280 0%, #4b5563 100%)";
    }
  };

  const getLabelColor = (label) => {
    switch (label) {
      case "merah": return "#ef4444";
      case "kuning": return "#f59e0b";
      case "hijau": return "#10b981";
      case "hitam": return "#374151";
      default: return "#6b7280";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "baru": return { bg: "#fef3c7", text: "#92400e", label: "Baru" };
      case "diproses": return { bg: "#dbeafe", text: "#1e40af", label: "Dalam Proses" };
      case "selesai": return { bg: "#d1fae5", text: "#065f46", label: "Selesai" };
      case "ditolak": return { bg: "#fee2e2", text: "#991b1b", label: "Ditolak" };
      case "verifikasi": return { bg: "#e0e7ff", text: "#3730a3", label: "Verifikasi" };
      case "ditindaklanjuti": return { bg: "#fdf4ff", text: "#86198f", label: "Ditindaklanjuti" };
      default: return { bg: "#f3f4f6", text: "#374151", label: status };
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const formatDateForInput = (dateValue) => {
    if (!dateValue) return "";
    if (typeof dateValue === "string" && dateValue.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return dateValue;
    }
    const date = new Date(dateValue);
    if (isNaN(date.getTime())) return "";
    return date.toISOString().split("T")[0];
  };

  const formatTime = (timeString) => {
    if (!timeString) return "";
    if (timeString.includes(':')) {
      return timeString.substring(0, 5); // HH:MM format
    }
    return timeString;
  };

  // Form handlers
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // File handling
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const allowedTypes = [
      "application/pdf",
      "application/msword", 
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "image/jpeg",
      "image/png",
      "image/jpg",
    ];

    const validFiles = files.filter((file) => {
      if (!allowedTypes.includes(file.type)) {
        alert(`File ${file.name} tidak didukung. Gunakan PDF, DOC, DOCX, atau gambar.`);
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert(`File ${file.name} terlalu besar. Maksimal 5MB.`);
        return false;
      }
      return true;
    });

    setSelectedFiles(validFiles);
  };

  const removeFile = (index) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
  };

  // Save handler
  const handleSave = async () => {
    setSaveLoading(true);
    setMessage("");

    try {
      const submitData = new FormData();

      Object.keys(formData).forEach((key) => {
        if (formData[key] !== null && formData[key] !== undefined && formData[key] !== '') {
          let value = formData[key];

          if (
            key === "tanggal_terima" ||
            key === "tanggal_surat" ||
            key === "hari_tanggal" ||
            key === "hari_tanggal_acara" ||
            key === "tanggal_kegiatan" ||
            key === "batas_waktu_respon"
          ) {
            value = formatDateForInput(value);
          }

          submitData.append(key, value);
        }
      });

      selectedFiles.forEach((file) => {
        submitData.append("file_surat", file);
      });

      const response = await fetch(`http://localhost:4000/api/letters/${letter.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: submitData,
      });

      const data = await response.json();

      if (data.success) {
        setMessage("Surat berhasil diupdate!");
        setEditMode(false);
        fetchLetterDetail();
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage(data.message || "Gagal mengupdate surat");
      }
    } catch (error) {
      setMessage("Gagal menyimpan perubahan");
    } finally {
      setSaveLoading(false);
    }
  };

  // Delete handler  
  const handleDelete = async () => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus surat ini?")) return;

    setSaveLoading(true);
    try {
      const response = await fetch(`http://localhost:4000/api/letters/${letter.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setMessage("Surat berhasil dihapus!");
        setTimeout(() => {
          navigate('/letters');
        }, 1500);
      } else {
        setMessage(data.message || "Gagal menghapus surat");
      }
    } catch (error) {
      setMessage("Gagal menghapus surat");
    } finally {
      setSaveLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '60vh',
          flexDirection: 'column',
          gap: '16px'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid #e2e8f0',
            borderTop: '4px solid #0ea5e9',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          <div style={{
            fontSize: '16px',
            color: '#64748b',
            fontFamily: "'Poppins', sans-serif"
          }}>
            Loading detail surat...
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (!letter) {
    return (
      <DashboardLayout>
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          fontFamily: "'Poppins', sans-serif"
        }}>
          <h2 style={{ color: '#ef4444', marginBottom: '16px' }}>Surat Tidak Ditemukan</h2>
          <button 
            onClick={() => navigate('/letters')}
            style={{
              background: '#0ea5e9',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            Kembali ke Daftar Surat
          </button>
        </div>
      </DashboardLayout>
    )
  }

  const statusInfo = getStatusColor(letter.status);
  const jenisGradient = getJenisGradient(letter.jenis);
  const labelColor = getLabelColor(letter.label);

  return (
    <DashboardLayout>
      <div style={{
        fontFamily: "'Poppins', sans-serif",
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 20px'
      }}>
        
        {/* Back Button */}
        <button 
          onClick={() => navigate('/letters')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'transparent',
            border: 'none',
            color: '#64748b',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            padding: '8px 12px',
            borderRadius: '8px',
            marginBottom: '24px',
            transition: 'background-color 0.2s'
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#f1f5f9'}
          onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
        >
          ← Kembali ke Daftar Surat
        </button>

        {/* Header */}
        <div style={{
          background: jenisGradient,
          padding: '32px',
          borderRadius: '24px 24px 0 0',
          color: 'white',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: '-20px',
            right: '-20px',
            width: '100px',
            height: '100px',
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '50%'
          }}></div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            marginBottom: '20px'
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '16px',
              background: 'rgba(255,255,255,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '28px',
              backdropFilter: 'blur(10px)'
            }}>
              {getJenisIcon(letter.jenis)}
            </div>
            <div>
              <h1 style={{
                margin: '0 0 8px 0',
                fontSize: '28px',
                fontWeight: '700'
              }}>
                {letter.no_surat}
              </h1>
              <div style={{
                fontSize: '16px',
                opacity: 0.9,
                textTransform: 'capitalize',
                fontWeight: '500'
              }}>
                {letter.jenis}
              </div>
            </div>
          </div>

          <div style={{
            display: 'flex',
            gap: '12px',
            flexWrap: 'wrap'
          }}>
            <div style={{
              background: 'rgba(255,255,255,0.2)',
              padding: '8px 16px',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: '600',
              backdropFilter: 'blur(10px)'
            }}>
              {statusInfo.label}
            </div>
            <div style={{
              background: labelColor,
              padding: '8px 16px',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: '600',
              color: 'white'
            }}>
              Label: {letter.label}
            </div>
          </div>
        </div>

        {/* Content */}
        <div style={{
          background: 'white',
          borderRadius: '0 0 24px 24px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          overflow: 'hidden'
        }}>
          
          {/* Action Buttons */}
          <div style={{
            padding: '24px 32px',
            borderBottom: '1px solid #f1f5f9',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '16px',
            flexWrap: 'wrap'
          }}>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {!editMode && (
                <>
                  <button
                    onClick={() => setEditMode(true)}
                    style={{
                      padding: '12px 24px',
                      background: 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '12px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    Edit Surat
                  </button>
                  
                  <DisposisiButton
                    letterId={letter.id}
                    size="medium"
                    variant="primary"
                  />
                </>
              )}

              <button
                onClick={handleDelete}
                disabled={saveLoading}
                style={{
                  padding: '12px 24px',
                  background: '#ef4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: saveLoading ? 'not-allowed' : 'pointer',
                  opacity: saveLoading ? 0.7 : 1
                }}
              >
                Hapus
              </button>
            </div>

            {editMode && (
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => {
                    setEditMode(false);
                    setFormData({ ...letter });
                    setSelectedFiles([]);
                    setMessage("");
                  }}
                  style={{
                    padding: '12px 24px',
                    background: '#f8fafc',
                    border: '2px solid #e5e7eb',
                    borderRadius: '12px',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#64748b',
                    cursor: 'pointer'
                  }}
                >
                  Batal
                </button>

                <button
                  onClick={handleSave}
                  disabled={saveLoading}
                  style={{
                    padding: '12px 24px',
                    background: saveLoading ? '#cbd5e0' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: saveLoading ? 'not-allowed' : 'pointer'
                  }}
                >
                  {saveLoading ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>
            )}
          </div>

          {/* Main Content */}
          <div style={{ padding: '32px' }}>
            {editMode ? (
              // Edit Mode Content - LENGKAP dengan semua field per jenis
              <div style={{ display: 'grid', gap: '24px' }}>
                
                {/* Basic Fields */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                  gap: '20px'
                }}>
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#374151',
                      marginBottom: '8px'
                    }}>
                      No Disposisi
                    </label>
                    <input
                      type="text"
                      value={formData.no_disposisi || ""}
                      onChange={(e) => handleChange('no_disposisi', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '2px solid #e5e7eb',
                        borderRadius: '12px',
                        fontSize: '14px',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#374151',
                      marginBottom: '8px'
                    }}>
                      No Surat
                    </label>
                    <input
                      type="text"
                      value={formData.no_surat || ""}
                      onChange={(e) => handleChange('no_surat', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '2px solid #e5e7eb',
                        borderRadius: '12px',
                        fontSize: '14px',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#374151',
                      marginBottom: '8px'
                    }}>
                      Asal Surat
                    </label>
                    <input
                      type="text"
                      value={formData.asal_surat || ""}
                      onChange={(e) => handleChange('asal_surat', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '2px solid #e5e7eb',
                        borderRadius: '12px',
                        fontSize: '14px',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>

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
                      value={formData.status || ""}
                      onChange={(e) => handleChange('status', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '2px solid #e5e7eb',
                        borderRadius: '12px',
                        fontSize: '14px',
                        outline: 'none',
                        cursor: 'pointer',
                        boxSizing: 'border-box'
                      }}
                    >
                      <option value="baru">Baru</option>
                      <option value="diproses">Diproses</option>
                      <option value="selesai">Selesai</option>
                      <option value="ditolak">Ditolak</option>
                      <option value="verifikasi">Verifikasi</option>
                      <option value="ditindaklanjuti">Ditindaklanjuti</option>
                    </select>
                  </div>

                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#374151',
                      marginBottom: '8px'
                    }}>
                      Label
                    </label>
                    <select
                      value={formData.label || ""}
                      onChange={(e) => handleChange('label', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '2px solid #e5e7eb',
                        borderRadius: '12px',
                        fontSize: '14px',
                        outline: 'none',
                        cursor: 'pointer',
                        boxSizing: 'border-box'
                      }}
                    >
                      <option value="hitam">Hitam</option>
                      <option value="merah">Merah</option>
                      <option value="kuning">Kuning</option>
                      <option value="hijau">Hijau</option>
                    </select>
                  </div>

                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#374151',
                      marginBottom: '8px'
                    }}>
                      Tanggal Terima
                    </label>
                    <input
                      type="date"
                      value={formatDateForInput(formData.tanggal_terima) || ""}
                      onChange={(e) => handleChange('tanggal_terima', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '2px solid #e5e7eb',
                        borderRadius: '12px',
                        fontSize: '14px',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#374151',
                      marginBottom: '8px'
                    }}>
                      Tanggal Surat
                    </label>
                    <input
                      type="date"
                      value={formatDateForInput(formData.tanggal_surat) || ""}
                      onChange={(e) => handleChange('tanggal_surat', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '2px solid #e5e7eb',
                        borderRadius: '12px',
                        fontSize: '14px',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '8px'
                  }}>
                    Perihal
                  </label>
                  <input
                    type="text"
                    value={formData.perihal || ""}
                    onChange={(e) => handleChange('perihal', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '12px',
                      fontSize: '14px',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '8px'
                  }}>
                    Uraian
                  </label>
                  <textarea
                    value={formData.uraian || ""}
                    onChange={(e) => handleChange('uraian', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '12px',
                      fontSize: '14px',
                      outline: 'none',
                      minHeight: '120px',
                      resize: 'vertical',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '8px'
                  }}>
                    Keterangan
                  </label>
                  <textarea
                    value={formData.keterangan || ""}
                    onChange={(e) => handleChange('keterangan', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '12px',
                      fontSize: '14px',
                      outline: 'none',
                      minHeight: '80px',
                      resize: 'vertical',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                {/* File Upload */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '8px'
                  }}>
                    Tambah Lampiran File
                  </label>

                  <div style={{
                    border: '2px dashed #e5e7eb',
                    borderRadius: '12px',
                    padding: '20px',
                    textAlign: 'center',
                    background: '#fafbfc'
                  }}>
                    <input
                      type="file"
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      style={{ display: 'none' }}
                      id="edit-file-upload"
                    />

                    <label
                      htmlFor="edit-file-upload"
                      style={{
                        display: 'inline-block',
                        padding: '10px 20px',
                        background: '#0ea5e9',
                        color: 'white',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '13px',
                        fontWeight: '600'
                      }}
                    >
                      Pilih File
                    </label>
                  </div>

                  {/* Selected Files */}
                  {selectedFiles.length > 0 && (
                    <div style={{
                      marginTop: '12px',
                      padding: '12px',
                      background: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px'
                    }}>
                      {selectedFiles.map((file, index) => (
                        <div
                          key={index}
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '6px 10px',
                            background: '#f8fafc',
                            borderRadius: '6px',
                            marginBottom: index < selectedFiles.length - 1 ? '6px' : '0'
                          }}
                        >
                          <span style={{ fontSize: '12px', color: '#374151' }}>
                            {file.name}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                            style={{
                              background: '#ef4444',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              padding: '4px 8px',
                              fontSize: '10px',
                              cursor: 'pointer'
                            }}
                          >
                            Hapus
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* FIELD TAMBAHAN PER JENIS SURAT - EDIT MODE */}
                
                {/* UNDANGAN */}
                {formData.jenis === "undangan" && (
                  <div style={{
                    marginTop: '20px',
                    padding: '20px',
                    background: '#f0f9ff',
                    borderRadius: '16px',
                    border: '2px solid #0ea5e9'
                  }}>
                    <h3 style={{
                      margin: '0 0 16px 0',
                      fontSize: '16px',
                      fontWeight: '700',
                      color: '#0369a1'
                    }}>
                      Edit Field Undangan
                    </h3>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                      gap: '16px'
                    }}>
                      <div>
                        <label style={{
                          display: 'block',
                          fontSize: '14px',
                          fontWeight: '600',
                          color: '#374151',
                          marginBottom: '8px'
                        }}>
                          Hari/Tanggal Acara
                        </label>
                        <input
                          type="date"
                          value={formatDateForInput(formData.hari_tanggal_acara) || ""}
                          onChange={(e) => handleChange('hari_tanggal_acara', e.target.value)}
                          style={{
                            width: '100%',
                            padding: '12px 16px',
                            border: '2px solid #e5e7eb',
                            borderRadius: '12px',
                            fontSize: '14px',
                            outline: 'none',
                            boxSizing: 'border-box'
                          }}
                        />
                      </div>
                      <div>
                        <label style={{
                          display: 'block',
                          fontSize: '14px',
                          fontWeight: '600',
                          color: '#374151',
                          marginBottom: '8px'
                        }}>
                          Pukul
                        </label>
                        <input
                          type="time"
                          value={formatTime(formData.pukul) || ""}
                          onChange={(e) => handleChange('pukul', e.target.value)}
                          style={{
                            width: '100%',
                            padding: '12px 16px',
                            border: '2px solid #e5e7eb',
                            borderRadius: '12px',
                            fontSize: '14px',
                            outline: 'none',
                            boxSizing: 'border-box'
                          }}
                        />
                      </div>
                      <div>
                        <label style={{
                          display: 'block',
                          fontSize: '14px',
                          fontWeight: '600',
                          color: '#374151',
                          marginBottom: '8px'
                        }}>
                          Tempat
                        </label>
                        <input
                          type="text"
                          value={formData.tempat || ""}
                          onChange={(e) => handleChange('tempat', e.target.value)}
                          style={{
                            width: '100%',
                            padding: '12px 16px',
                            border: '2px solid #e5e7eb',
                            borderRadius: '12px',
                            fontSize: '14px',
                            outline: 'none',
                            boxSizing: 'border-box'
                          }}
                        />
                      </div>
                      <div>
                        <label style={{
                          display: 'block',
                          fontSize: '14px',
                          fontWeight: '600',
                          color: '#374151',
                          marginBottom: '8px'
                        }}>
                          Jenis Acara
                        </label>
                        <input
                          type="text"
                          value={formData.jenis_acara || ""}
                          onChange={(e) => handleChange('jenis_acara', e.target.value)}
                          style={{
                            width: '100%',
                            padding: '12px 16px',
                            border: '2px solid #e5e7eb',
                            borderRadius: '12px',
                            fontSize: '14px',
                            outline: 'none',
                            boxSizing: 'border-box'
                          }}
                        />
                      </div>
                      <div>
                        <label style={{
                          display: 'block',
                          fontSize: '14px',
                          fontWeight: '600',
                          color: '#374151',
                          marginBottom: '8px'
                        }}>
                          Dress Code
                        </label>
                        <input
                          type="text"
                          value={formData.dress_code || ""}
                          onChange={(e) => handleChange('dress_code', e.target.value)}
                          style={{
                            width: '100%',
                            padding: '12px 16px',
                            border: '2px solid #e5e7eb',
                            borderRadius: '12px',
                            fontSize: '14px',
                            outline: 'none',
                            boxSizing: 'border-box'
                          }}
                        />
                      </div>
                      <div>
                        <label style={{
                          display: 'block',
                          fontSize: '14px',
                          fontWeight: '600',
                          color: '#374151',
                          marginBottom: '8px'
                        }}>
                          RSVP Required
                        </label>
                        <select
                          value={formData.rsvp_required || ""}
                          onChange={(e) => handleChange('rsvp_required', e.target.value)}
                          style={{
                            width: '100%',
                            padding: '12px 16px',
                            border: '2px solid #e5e7eb',
                            borderRadius: '12px',
                            fontSize: '14px',
                            outline: 'none',
                            cursor: 'pointer',
                            boxSizing: 'border-box'
                          }}
                        >
                          <option value="">Pilih</option>
                          <option value="ya">Ya</option>
                          <option value="tidak">Tidak</option>
                        </select>
                      </div>
                    </div>
                    <div style={{ marginTop: '16px' }}>
                      <label style={{
                        display: 'block',
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#374151',
                        marginBottom: '8px'
                      }}>
                        Dokumentasi
                      </label>
                      <textarea
                        value={formData.dokumentasi || ""}
                        onChange={(e) => handleChange('dokumentasi', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          border: '2px solid #e5e7eb',
                          borderRadius: '12px',
                          fontSize: '14px',
                          outline: 'none',
                          minHeight: '80px',
                          resize: 'vertical',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* AUDIENSI */}
                {formData.jenis === "audiensi" && (
                  <div style={{
                    marginTop: '20px',
                    padding: '20px',
                    background: '#f0fdf4',
                    borderRadius: '16px',
                    border: '2px solid #10b981'
                  }}>
                    <h3 style={{
                      margin: '0 0 16px 0',
                      fontSize: '16px',
                      fontWeight: '700',
                      color: '#059669'
                    }}>
                      Edit Field Audiensi
                    </h3>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                      gap: '16px'
                    }}>
                      <div>
                        <label style={{
                          display: 'block',
                          fontSize: '14px',
                          fontWeight: '600',
                          color: '#374151',
                          marginBottom: '8px'
                        }}>
                          Hari/Tanggal
                        </label>
                        <input
                          type="date"
                          value={formatDateForInput(formData.hari_tanggal) || ""}
                          onChange={(e) => handleChange('hari_tanggal', e.target.value)}
                          style={{
                            width: '100%',
                            padding: '12px 16px',
                            border: '2px solid #e5e7eb',
                            borderRadius: '12px',
                            fontSize: '14px',
                            outline: 'none',
                            boxSizing: 'border-box'
                          }}
                        />
                      </div>
                      <div>
                        <label style={{
                          display: 'block',
                          fontSize: '14px',
                          fontWeight: '600',
                          color: '#374151',
                          marginBottom: '8px'
                        }}>
                          Pukul
                        </label>
                        <input
                          type="time"
                          value={formatTime(formData.pukul) || ""}
                          onChange={(e) => handleChange('pukul', e.target.value)}
                          style={{
                            width: '100%',
                            padding: '12px 16px',
                            border: '2px solid #e5e7eb',
                            borderRadius: '12px',
                            fontSize: '14px',
                            outline: 'none',
                            boxSizing: 'border-box'
                          }}
                        />
                      </div>
                      <div>
                        <label style={{
                          display: 'block',
                          fontSize: '14px',
                          fontWeight: '600',
                          color: '#374151',
                          marginBottom: '8px'
                        }}>
                          Tempat
                        </label>
                        <input
                          type="text"
                          value={formData.tempat || ""}
                          onChange={(e) => handleChange('tempat', e.target.value)}
                          style={{
                            width: '100%',
                            padding: '12px 16px',
                            border: '2px solid #e5e7eb',
                            borderRadius: '12px',
                            fontSize: '14px',
                            outline: 'none',
                            boxSizing: 'border-box'
                          }}
                        />
                      </div>
                      <div>
                        <label style={{
                          display: 'block',
                          fontSize: '14px',
                          fontWeight: '600',
                          color: '#374151',
                          marginBottom: '8px'
                        }}>
                          Nama Pemohon
                        </label>
                        <input
                          type="text"
                          value={formData.nama_pemohon || ""}
                          onChange={(e) => handleChange('nama_pemohon', e.target.value)}
                          style={{
                            width: '100%',
                            padding: '12px 16px',
                            border: '2px solid #e5e7eb',
                            borderRadius: '12px',
                            fontSize: '14px',
                            outline: 'none',
                            boxSizing: 'border-box'
                          }}
                        />
                      </div>
                      <div>
                        <label style={{
                          display: 'block',
                          fontSize: '14px',
                          fontWeight: '600',
                          color: '#374151',
                          marginBottom: '8px'
                        }}>
                          Instansi/Organisasi
                        </label>
                        <input
                          type="text"
                          value={formData.instansi_organisasi || ""}
                          onChange={(e) => handleChange('instansi_organisasi', e.target.value)}
                          style={{
                            width: '100%',
                            padding: '12px 16px',
                            border: '2px solid #e5e7eb',
                            borderRadius: '12px',
                            fontSize: '14px',
                            outline: 'none',
                            boxSizing: 'border-box'
                          }}
                        />
                      </div>
                      <div>
                        <label style={{
                          display: 'block',
                          fontSize: '14px',
                          fontWeight: '600',
                          color: '#374151',
                          marginBottom: '8px'
                        }}>
                          Jumlah Peserta
                        </label>
                        <input
                          type="number"
                          value={formData.jumlah_peserta || ""}
                          onChange={(e) => handleChange('jumlah_peserta', e.target.value)}
                          style={{
                            width: '100%',
                            padding: '12px 16px',
                            border: '2px solid #e5e7eb',
                            borderRadius: '12px',
                            fontSize: '14px',
                            outline: 'none',
                            boxSizing: 'border-box'
                          }}
                        />
                      </div>
                    </div>
                    <div style={{ marginTop: '16px' }}>
                      <label style={{
                        display: 'block',
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#374151',
                        marginBottom: '8px'
                      }}>
                        Topik Audiensi
                      </label>
                      <textarea
                        value={formData.topik_audiensi || ""}
                        onChange={(e) => handleChange('topik_audiensi', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          border: '2px solid #e5e7eb',
                          borderRadius: '12px',
                          fontSize: '14px',
                          outline: 'none',
                          minHeight: '80px',
                          resize: 'vertical',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* PROPOSAL */}
                {formData.jenis === "proposal" && (
                  <div style={{
                    marginTop: '20px',
                    padding: '20px',
                    background: '#fff7ed',
                    borderRadius: '16px',
                    border: '2px solid #f97316'
                  }}>
                    <h3 style={{
                      margin: '0 0 16px 0',
                      fontSize: '16px',
                      fontWeight: '700',
                      color: '#ea580c'
                    }}>
                      Edit Field Proposal
                    </h3>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                      gap: '16px'
                    }}>
                      <div>
                        <label style={{
                          display: 'block',
                          fontSize: '14px',
                          fontWeight: '600',
                          color: '#374151',
                          marginBottom: '8px'
                        }}>
                          Nama Pengirim
                        </label>
                        <input
                          type="text"
                          value={formData.nama_pengirim || ""}
                          onChange={(e) => handleChange('nama_pengirim', e.target.value)}
                          style={{
                            width: '100%',
                            padding: '12px 16px',
                            border: '2px solid #e5e7eb',
                            borderRadius: '12px',
                            fontSize: '14px',
                            outline: 'none',
                            boxSizing: 'border-box'
                          }}
                        />
                      </div>
                      <div>
                        <label style={{
                          display: 'block',
                          fontSize: '14px',
                          fontWeight: '600',
                          color: '#374151',
                          marginBottom: '8px'
                        }}>
                          Instansi/Lembaga/Komunitas
                        </label>
                        <input
                          type="text"
                          value={formData.instansi_lembaga_komunitas || ""}
                          onChange={(e) => handleChange('instansi_lembaga_komunitas', e.target.value)}
                          style={{
                            width: '100%',
                            padding: '12px 16px',
                            border: '2px solid #e5e7eb',
                            borderRadius: '12px',
                            fontSize: '14px',
                            outline: 'none',
                            boxSizing: 'border-box'
                          }}
                        />
                      </div>
                      <div>
                        <label style={{
                          display: 'block',
                          fontSize: '14px',
                          fontWeight: '600',
                          color: '#374151',
                          marginBottom: '8px'
                        }}>
                          Judul Proposal
                        </label>
                        <input
                          type="text"
                          value={formData.judul_proposal || ""}
                          onChange={(e) => handleChange('judul_proposal', e.target.value)}
                          style={{
                            width: '100%',
                            padding: '12px 16px',
                            border: '2px solid #e5e7eb',
                            borderRadius: '12px',
                            fontSize: '14px',
                            outline: 'none',
                            boxSizing: 'border-box'
                          }}
                        />
                      </div>
                      <div>
                        <label style={{
                          display: 'block',
                          fontSize: '14px',
                          fontWeight: '600',
                          color: '#374151',
                          marginBottom: '8px'
                        }}>
                          Jenis Kegiatan
                        </label>
                        <input
                          type="text"
                          value={formData.jenis_kegiatan || ""}
                          onChange={(e) => handleChange('jenis_kegiatan', e.target.value)}
                          style={{
                            width: '100%',
                            padding: '12px 16px',
                            border: '2px solid #e5e7eb',
                            borderRadius: '12px',
                            fontSize: '14px',
                            outline: 'none',
                            boxSizing: 'border-box'
                          }}
                        />
                      </div>
                      <div>
                        <label style={{
                          display: 'block',
                          fontSize: '14px',
                          fontWeight: '600',
                          color: '#374151',
                          marginBottom: '8px'
                        }}>
                          Tanggal Kegiatan
                        </label>
                        <input
                          type="date"
                          value={formatDateForInput(formData.tanggal_kegiatan) || ""}
                          onChange={(e) => handleChange('tanggal_kegiatan', e.target.value)}
                          style={{
                            width: '100%',
                            padding: '12px 16px',
                            border: '2px solid #e5e7eb',
                            borderRadius: '12px',
                            fontSize: '14px',
                            outline: 'none',
                            boxSizing: 'border-box'
                          }}
                        />
                      </div>
                      <div>
                        <label style={{
                          display: 'block',
                          fontSize: '14px',
                          fontWeight: '600',
                          color: '#374151',
                          marginBottom: '8px'
                        }}>
                          Total Anggaran
                        </label>
                        <input
                          type="number"
                          value={formData.total_anggaran || ""}
                          onChange={(e) => handleChange('total_anggaran', e.target.value)}
                          style={{
                            width: '100%',
                            padding: '12px 16px',
                            border: '2px solid #e5e7eb',
                            borderRadius: '12px',
                            fontSize: '14px',
                            outline: 'none',
                            boxSizing: 'border-box'
                          }}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* PENGADUAN */}
                {formData.jenis === "pengaduan" && (
                  <div style={{
                    marginTop: '20px',
                    padding: '20px',
                    background: '#fef3c7',
                    borderRadius: '16px',
                    border: '2px solid #f59e0b'
                  }}>
                    <h3 style={{
                      margin: '0 0 16px 0',
                      fontSize: '16px',
                      fontWeight: '700',
                      color: '#d97706'
                    }}>
                      Edit Field Pengaduan
                    </h3>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                      gap: '16px'
                    }}>
                      <div>
                        <label style={{
                          display: 'block',
                          fontSize: '14px',
                          fontWeight: '600',
                          color: '#374151',
                          marginBottom: '8px'
                        }}>
                          Jenis Pengaduan
                        </label>
                        <select
                          value={formData.jenis_pengaduan || ""}
                          onChange={(e) => handleChange('jenis_pengaduan', e.target.value)}
                          style={{
                            width: '100%',
                            padding: '12px 16px',
                            border: '2px solid #e5e7eb',
                            borderRadius: '12px',
                            fontSize: '14px',
                            outline: 'none',
                            cursor: 'pointer',
                            boxSizing: 'border-box'
                          }}
                        >
                          <option value="">Pilih Jenis Pengaduan</option>
                          <option value="pelayanan_publik">Pelayanan Publik</option>
                          <option value="korupsi">Korupsi</option>
                          <option value="lingkungan">Lingkungan</option>
                          <option value="infrastruktur">Infrastruktur</option>
                          <option value="lainnya">Lainnya</option>
                        </select>
                      </div>
                      <div>
                        <label style={{
                          display: 'block',
                          fontSize: '14px',
                          fontWeight: '600',
                          color: '#374151',
                          marginBottom: '8px'
                        }}>
                          Tingkat Urgensi
                        </label>
                        <select
                          value={formData.tingkat_urgensi || ""}
                          onChange={(e) => handleChange('tingkat_urgensi', e.target.value)}
                          style={{
                            width: '100%',
                            padding: '12px 16px',
                            border: '2px solid #e5e7eb',
                            borderRadius: '12px',
                            fontSize: '14px',
                            outline: 'none',
                            cursor: 'pointer',
                            boxSizing: 'border-box'
                          }}
                        >
                          <option value="">Pilih Tingkat Urgensi</option>
                          <option value="rendah">Rendah</option>
                          <option value="sedang">Sedang</option>
                          <option value="tinggi">Tinggi</option>
                          <option value="sangat_tinggi">Sangat Tinggi</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* PEMBERITAHUAN */}
                {formData.jenis === "pemberitahuan" && (
                  <div style={{
                    marginTop: '20px',
                    padding: '20px',
                    background: '#fef2f2',
                    borderRadius: '16px',
                    border: '2px solid #ef4444'
                  }}>
                    <h3 style={{
                      margin: '0 0 16px 0',
                      fontSize: '16px',
                      fontWeight: '700',
                      color: '#dc2626'
                    }}>
                      Edit Field Pemberitahuan
                    </h3>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                      gap: '16px'
                    }}>
                      <div>
                        <label style={{
                          display: 'block',
                          fontSize: '14px',
                          fontWeight: '600',
                          color: '#374151',
                          marginBottom: '8px'
                        }}>
                          Kategori Pemberitahuan
                        </label>
                        <select
                          value={formData.kategori_pemberitahuan || ""}
                          onChange={(e) => handleChange('kategori_pemberitahuan', e.target.value)}
                          style={{
                            width: '100%',
                            padding: '12px 16px',
                            border: '2px solid #e5e7eb',
                            borderRadius: '12px',
                            fontSize: '14px',
                            outline: 'none',
                            cursor: 'pointer',
                            boxSizing: 'border-box'
                          }}
                        >
                          <option value="">Pilih Kategori</option>
                          <option value="informasi_umum">Informasi Umum</option>
                          <option value="kebijakan_baru">Kebijakan Baru</option>
                          <option value="perubahan_jadwal">Perubahan Jadwal</option>
                          <option value="peringatan">Peringatan</option>
                          <option value="lainnya">Lainnya</option>
                        </select>
                      </div>
                      <div>
                        <label style={{
                          display: 'block',
                          fontSize: '14px',
                          fontWeight: '600',
                          color: '#374151',
                          marginBottom: '8px'
                        }}>
                          Tingkat Prioritas
                        </label>
                        <select
                          value={formData.tingkat_prioritas || ""}
                          onChange={(e) => handleChange('tingkat_prioritas', e.target.value)}
                          style={{
                            width: '100%',
                            padding: '12px 16px',
                            border: '2px solid #e5e7eb',
                            borderRadius: '12px',
                            fontSize: '14px',
                            outline: 'none',
                            cursor: 'pointer',
                            boxSizing: 'border-box'
                          }}
                        >
                          <option value="">Pilih Prioritas</option>
                          <option value="rendah">Rendah</option>
                          <option value="normal">Normal</option>
                          <option value="tinggi">Tinggi</option>
                          <option value="mendesak">Mendesak</option>
                        </select>
                      </div>
                      <div>
                        <label style={{
                          display: 'block',
                          fontSize: '14px',
                          fontWeight: '600',
                          color: '#374151',
                          marginBottom: '8px'
                        }}>
                          Batas Waktu Respon
                        </label>
                        <input
                          type="date"
                          value={formatDateForInput(formData.batas_waktu_respon) || ""}
                          onChange={(e) => handleChange('batas_waktu_respon', e.target.value)}
                          style={{
                            width: '100%',
                            padding: '12px 16px',
                            border: '2px solid #e5e7eb',
                            borderRadius: '12px',
                            fontSize: '14px',
                            outline: 'none',
                            boxSizing: 'border-box'
                          }}
                        />
                      </div>
                      <div>
                        <label style={{
                          display: 'block',
                          fontSize: '14px',
                          fontWeight: '600',
                          color: '#374151',
                          marginBottom: '8px'
                        }}>
                          Follow Up Required
                        </label>
                        <select
                          value={formData.follow_up_required || ""}
                          onChange={(e) => handleChange('follow_up_required', e.target.value)}
                          style={{
                            width: '100%',
                            padding: '12px 16px',
                            border: '2px solid #e5e7eb',
                            borderRadius: '12px',
                            fontSize: '14px',
                            outline: 'none',
                            cursor: 'pointer',
                            boxSizing: 'border-box'
                          }}
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
            ) : (
              // View Mode Content - FIXED FIELD MAPPING
              <div style={{ display: 'grid', gap: '32px' }}>
                
                {/* Info Grid */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                  gap: '20px'
                }}>
                  <div style={{
                    background: '#f8fafc',
                    padding: '20px',
                    borderRadius: '16px'
                  }}>
                    <div style={{
                      fontSize: '12px',
                      color: '#64748b',
                      marginBottom: '8px',
                      fontWeight: '500'
                    }}>
                      No Disposisi
                    </div>
                    <div style={{
                      fontSize: '18px',
                      fontWeight: '700',
                      color: '#1a202c'
                    }}>
                      {letter.no_disposisi}
                    </div>
                  </div>

                  <div style={{
                    background: '#f8fafc',
                    padding: '20px',
                    borderRadius: '16px'
                  }}>
                    <div style={{
                      fontSize: '12px',
                      color: '#64748b',
                      marginBottom: '8px',
                      fontWeight: '500'
                    }}>
                      Tanggal Terima
                    </div>
                    <div style={{
                      fontSize: '18px',
                      fontWeight: '700',
                      color: '#1a202c'
                    }}>
                      {formatDate(letter.tanggal_terima)}
                    </div>
                  </div>

                  <div style={{
                    background: '#f8fafc',
                    padding: '20px',
                    borderRadius: '16px'
                  }}>
                    <div style={{
                      fontSize: '12px',
                      color: '#64748b',
                      marginBottom: '8px',
                      fontWeight: '500'
                    }}>
                      Tanggal Surat
                    </div>
                    <div style={{
                      fontSize: '18px',
                      fontWeight: '700',
                      color: '#1a202c'
                    }}>
                      {formatDate(letter.tanggal_surat)}
                    </div>
                  </div>
                </div>

                {/* Perihal */}
                <div>
                  <h3 style={{
                    margin: '0 0 16px 0',
                    fontSize: '20px',
                    fontWeight: '700',
                    color: '#1a202c'
                  }}>
                    Perihal
                  </h3>
                  <div style={{
                    background: '#f8fafc',
                    padding: '24px',
                    borderRadius: '16px',
                    fontSize: '16px',
                    color: '#374151',
                    lineHeight: '1.7'
                  }}>
                    {letter.perihal}
                  </div>
                </div>

                {/* Uraian */}
                <div>
                  <h3 style={{
                    margin: '0 0 16px 0',
                    fontSize: '20px',
                    fontWeight: '700',
                    color: '#1a202c'
                  }}>
                    Uraian
                  </h3>
                  <div style={{
                    background: '#f8fafc',
                    padding: '24px',
                    borderRadius: '16px',
                    fontSize: '16px',
                    color: '#374151',
                    lineHeight: '1.7'
                  }}>
                    {letter.uraian}
                  </div>
                </div>

                {/* Keterangan */}
                {letter.keterangan && (
                  <div>
                    <h3 style={{
                      margin: '0 0 16px 0',
                      fontSize: '20px',
                      fontWeight: '700',
                      color: '#1a202c'
                    }}>
                      Keterangan
                    </h3>
                    <div style={{
                      background: '#fef3c7',
                      padding: '20px',
                      borderRadius: '16px',
                      fontSize: '15px',
                      color: '#92400e',
                      fontStyle: 'italic',
                      border: '1px solid #fbbf24'
                    }}>
                      {letter.keterangan}
                    </div>
                  </div>
                )}

                {/* File attachments */}
                <div>
                  <h3 style={{
                    margin: '0 0 16px 0',
                    fontSize: '20px',
                    fontWeight: '700',
                    color: '#1a202c'
                  }}>
                    Lampiran File
                  </h3>

                  {letter.file_surat_name ? (
                    <div style={{
                      background: '#f0f9ff',
                      border: '2px solid #0ea5e9',
                      padding: '24px',
                      borderRadius: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '16px'
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        flex: 1,
                        minWidth: '200px'
                      }}>
                        <div style={{
                          width: '48px',
                          height: '48px',
                          background: '#0ea5e9',
                          borderRadius: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontSize: '20px',
                          flexShrink: 0
                        }}>
                          📄
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <div style={{
                            fontSize: '16px',
                            fontWeight: '600',
                            color: '#1e293b',
                            marginBottom: '4px',
                            wordBreak: 'break-word'
                          }}>
                            {letter.file_surat_name}
                          </div>
                          <div style={{
                            fontSize: '14px',
                            color: '#64748b'
                          }}>
                            {letter.file_surat_size 
                              ? `${Math.round(letter.file_surat_size / 1024)} KB`
                              : "File tersedia"}
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => window.open(`http://localhost:4000/${letter.file_surat}`, "_blank")}
                        style={{
                          padding: '12px 24px',
                          background: '#0ea5e9',
                          color: 'white',
                          border: 'none',
                          borderRadius: '12px',
                          fontSize: '14px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          flexShrink: 0
                        }}
                      >
                        👁️ Lihat File
                      </button>
                    </div>
                  ) : (
                    <div style={{
                      background: '#f8fafc',
                      padding: '32px',
                      borderRadius: '16px',
                      fontSize: '15px',
                      color: '#64748b',
                      textAlign: 'center'
                    }}>
                      Tidak ada file yang dilampirkan
                    </div>
                  )}
                </div>

                {/* ADDITIONAL FIELDS PER JENIS - FIXED MAPPING */}
                
                {/* UNDANGAN - Fixed field names */}
                {letter.jenis === "undangan" && (letter.hari_tanggal_acara || letter.jenis_acara || letter.pukul || letter.tempat || letter.dress_code || letter.rsvp_required || letter.dokumentasi) && (
                  <div>
                    <h3 style={{
                      margin: '0 0 16px 0',
                      fontSize: '20px',
                      fontWeight: '700',
                      color: '#1a202c'
                    }}>
                      Detail Undangan
                    </h3>
                    <div style={{
                      background: '#f0f9ff',
                      padding: '24px',
                      borderRadius: '16px',
                      border: '2px solid #0ea5e9'
                    }}>
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '20px'
                      }}>
                        {letter.hari_tanggal_acara && (
                          <div>
                            <div style={{
                              fontSize: '12px',
                              color: '#64748b',
                              fontWeight: '500',
                              marginBottom: '4px'
                            }}>
                              Tanggal Acara
                            </div>
                            <div style={{
                              fontSize: '16px',
                              fontWeight: '600',
                              color: '#1a202c'
                            }}>
                              {formatDate(letter.hari_tanggal_acara)}
                            </div>
                          </div>
                        )}
                        {letter.pukul && (
                          <div>
                            <div style={{
                              fontSize: '12px',
                              color: '#64748b',
                              fontWeight: '500',
                              marginBottom: '4px'
                            }}>
                              Pukul
                            </div>
                            <div style={{
                              fontSize: '16px',
                              fontWeight: '600',
                              color: '#1a202c'
                            }}>
                              {formatTime(letter.pukul)}
                            </div>
                          </div>
                        )}
                        {letter.tempat && (
                          <div>
                            <div style={{
                              fontSize: '12px',
                              color: '#64748b',
                              fontWeight: '500',
                              marginBottom: '4px'
                            }}>
                              Tempat
                            </div>
                            <div style={{
                              fontSize: '16px',
                              fontWeight: '600',
                              color: '#1a202c'
                            }}>
                              {letter.tempat}
                            </div>
                          </div>
                        )}
                        {letter.jenis_acara && (
                          <div>
                            <div style={{
                              fontSize: '12px',
                              color: '#64748b',
                              fontWeight: '500',
                              marginBottom: '4px'
                            }}>
                              Jenis Acara
                            </div>
                            <div style={{
                              fontSize: '16px',
                              fontWeight: '600',
                              color: '#1a202c'
                            }}>
                              {letter.jenis_acara}
                            </div>
                          </div>
                        )}
                        {letter.dress_code && (
                          <div>
                            <div style={{
                              fontSize: '12px',
                              color: '#64748b',
                              fontWeight: '500',
                              marginBottom: '4px'
                            }}>
                              Dress Code
                            </div>
                            <div style={{
                              fontSize: '16px',
                              fontWeight: '600',
                              color: '#1a202c'
                            }}>
                              {letter.dress_code}
                            </div>
                          </div>
                        )}
                        {letter.rsvp_required && (
                          <div>
                            <div style={{
                              fontSize: '12px',
                              color: '#64748b',
                              fontWeight: '500',
                              marginBottom: '4px'
                            }}>
                              RSVP Required
                            </div>
                            <div style={{
                              fontSize: '16px',
                              fontWeight: '600',
                              color: '#1a202c'
                            }}>
                              {letter.rsvp_required === 'ya' ? 'Ya' : 'Tidak'}
                            </div>
                          </div>
                        )}
                      </div>
                      {letter.dokumentasi && (
                        <div style={{ marginTop: '20px' }}>
                          <div style={{
                            fontSize: '12px',
                            color: '#64748b',
                            fontWeight: '500',
                            marginBottom: '8px'
                          }}>
                            Dokumentasi
                          </div>
                          <div style={{
                            fontSize: '15px',
                            color: '#374151',
                            lineHeight: '1.6'
                          }}>
                            {letter.dokumentasi}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* AUDIENSI - Fixed field names */}
                {letter.jenis === "audiensi" && (letter.hari_tanggal || letter.nama_pemohon || letter.pukul || letter.tempat || letter.instansi_organisasi || letter.jumlah_peserta || letter.topik_audiensi || letter.dokumentasi) && (
                  <div>
                    <h3 style={{
                      margin: '0 0 16px 0',
                      fontSize: '20px',
                      fontWeight: '700',
                      color: '#1a202c'
                    }}>
                      Detail Audiensi
                    </h3>
                    <div style={{
                      background: '#f0fdf4',
                      padding: '24px',
                      borderRadius: '16px',
                      border: '2px solid #10b981'
                    }}>
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '20px'
                      }}>
                        {letter.hari_tanggal && (
                          <div>
                            <div style={{
                              fontSize: '12px',
                              color: '#64748b',
                              fontWeight: '500',
                              marginBottom: '4px'
                            }}>
                              Hari/Tanggal
                            </div>
                            <div style={{
                              fontSize: '16px',
                              fontWeight: '600',
                              color: '#1a202c'
                            }}>
                              {formatDate(letter.hari_tanggal)}
                            </div>
                          </div>
                        )}
                        {letter.pukul && (
                          <div>
                            <div style={{
                              fontSize: '12px',
                              color: '#64748b',
                              fontWeight: '500',
                              marginBottom: '4px'
                            }}>
                              Pukul
                            </div>
                            <div style={{
                              fontSize: '16px',
                              fontWeight: '600',
                              color: '#1a202c'
                            }}>
                              {formatTime(letter.pukul)}
                            </div>
                          </div>
                        )}
                        {letter.tempat && (
                          <div>
                            <div style={{
                              fontSize: '12px',
                              color: '#64748b',
                              fontWeight: '500',
                              marginBottom: '4px'
                            }}>
                              Tempat
                            </div>
                            <div style={{
                              fontSize: '16px',
                              fontWeight: '600',
                              color: '#1a202c'
                            }}>
                              {letter.tempat}
                            </div>
                          </div>
                        )}
                        {letter.nama_pemohon && (
                          <div>
                            <div style={{
                              fontSize: '12px',
                              color: '#64748b',
                              fontWeight: '500',
                              marginBottom: '4px'
                            }}>
                              Nama Pemohon
                            </div>
                            <div style={{
                              fontSize: '16px',
                              fontWeight: '600',
                              color: '#1a202c'
                            }}>
                              {letter.nama_pemohon}
                            </div>
                          </div>
                        )}
                        {letter.instansi_organisasi && (
                          <div>
                            <div style={{
                              fontSize: '12px',
                              color: '#64748b',
                              fontWeight: '500',
                              marginBottom: '4px'
                            }}>
                              Instansi/Organisasi
                            </div>
                            <div style={{
                              fontSize: '16px',
                              fontWeight: '600',
                              color: '#1a202c'
                            }}>
                              {letter.instansi_organisasi}
                            </div>
                          </div>
                        )}
                        {letter.jumlah_peserta && (
                          <div>
                            <div style={{
                              fontSize: '12px',
                              color: '#64748b',
                              fontWeight: '500',
                              marginBottom: '4px'
                            }}>
                              Jumlah Peserta
                            </div>
                            <div style={{
                              fontSize: '16px',
                              fontWeight: '600',
                              color: '#1a202c'
                            }}>
                              {letter.jumlah_peserta} orang
                            </div>
                          </div>
                        )}
                      </div>
                      {letter.topik_audiensi && (
                        <div style={{ marginTop: '20px' }}>
                          <div style={{
                            fontSize: '12px',
                            color: '#64748b',
                            fontWeight: '500',
                            marginBottom: '8px'
                          }}>
                            Topik Audiensi
                          </div>
                          <div style={{
                            fontSize: '15px',
                            color: '#374151',
                            lineHeight: '1.6'
                          }}>
                            {letter.topik_audiensi}
                          </div>
                        </div>
                      )}
                      {letter.dokumentasi && (
                        <div style={{ marginTop: '20px' }}>
                          <div style={{
                            fontSize: '12px',
                            color: '#64748b',
                            fontWeight: '500',
                            marginBottom: '8px'
                          }}>
                            Dokumentasi
                          </div>
                          <div style={{
                            fontSize: '15px',
                            color: '#374151',
                            lineHeight: '1.6'
                          }}>
                            {letter.dokumentasi}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* PROPOSAL - Sesuai database */}
                {letter.jenis === "proposal" && (letter.nama_pengirim || letter.judul_proposal || letter.instansi_lembaga_komunitas || letter.jenis_kegiatan || letter.tanggal_kegiatan || letter.total_anggaran) && (
                  <div>
                    <h3 style={{
                      margin: '0 0 16px 0',
                      fontSize: '20px',
                      fontWeight: '700',
                      color: '#1a202c'
                    }}>
                      Detail Proposal
                    </h3>
                    <div style={{
                      background: '#fff7ed',
                      padding: '24px',
                      borderRadius: '16px',
                      border: '2px solid #f97316'
                    }}>
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '20px'
                      }}>
                        {letter.nama_pengirim && (
                          <div>
                            <div style={{
                              fontSize: '12px',
                              color: '#64748b',
                              fontWeight: '500',
                              marginBottom: '4px'
                            }}>
                              Nama Pengirim
                            </div>
                            <div style={{
                              fontSize: '16px',
                              fontWeight: '600',
                              color: '#1a202c'
                            }}>
                              {letter.nama_pengirim}
                            </div>
                          </div>
                        )}
                        {letter.instansi_lembaga_komunitas && (
                          <div>
                            <div style={{
                              fontSize: '12px',
                              color: '#64748b',
                              fontWeight: '500',
                              marginBottom: '4px'
                            }}>
                              Instansi/Lembaga/Komunitas
                            </div>
                            <div style={{
                              fontSize: '16px',
                              fontWeight: '600',
                              color: '#1a202c'
                            }}>
                              {letter.instansi_lembaga_komunitas}
                            </div>
                          </div>
                        )}
                        {letter.judul_proposal && (
                          <div>
                            <div style={{
                              fontSize: '12px',
                              color: '#64748b',
                              fontWeight: '500',
                              marginBottom: '4px'
                            }}>
                              Judul Proposal
                            </div>
                            <div style={{
                              fontSize: '16px',
                              fontWeight: '600',
                              color: '#1a202c'
                            }}>
                              {letter.judul_proposal}
                            </div>
                          </div>
                        )}
                        {letter.jenis_kegiatan && (
                          <div>
                            <div style={{
                              fontSize: '12px',
                              color: '#64748b',
                              fontWeight: '500',
                              marginBottom: '4px'
                            }}>
                              Jenis Kegiatan
                            </div>
                            <div style={{
                              fontSize: '16px',
                              fontWeight: '600',
                              color: '#1a202c'
                            }}>
                              {letter.jenis_kegiatan}
                            </div>
                          </div>
                        )}
                        {letter.tanggal_kegiatan && (
                          <div>
                            <div style={{
                              fontSize: '12px',
                              color: '#64748b',
                              fontWeight: '500',
                              marginBottom: '4px'
                            }}>
                              Tanggal Kegiatan
                            </div>
                            <div style={{
                              fontSize: '16px',
                              fontWeight: '600',
                              color: '#1a202c'
                            }}>
                              {formatDate(letter.tanggal_kegiatan)}
                            </div>
                          </div>
                        )}
                        {letter.total_anggaran && (
                          <div>
                            <div style={{
                              fontSize: '12px',
                              color: '#64748b',
                              fontWeight: '500',
                              marginBottom: '4px'
                            }}>
                              Total Anggaran
                            </div>
                            <div style={{
                              fontSize: '16px',
                              fontWeight: '600',
                              color: '#1a202c'
                            }}>
                              Rp {Number(letter.total_anggaran).toLocaleString('id-ID')}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* PENGADUAN - Sesuai database */}
                {letter.jenis === "pengaduan" && (letter.jenis_pengaduan || letter.tingkat_urgensi) && (
                  <div>
                    <h3 style={{
                      margin: '0 0 16px 0',
                      fontSize: '20px',
                      fontWeight: '700',
                      color: '#1a202c'
                    }}>
                      Detail Pengaduan
                    </h3>
                    <div style={{
                      background: '#fef3c7',
                      padding: '24px',
                      borderRadius: '16px',
                      border: '2px solid #f59e0b'
                    }}>
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '20px'
                      }}>
                        {letter.jenis_pengaduan && (
                          <div>
                            <div style={{
                              fontSize: '12px',
                              color: '#64748b',
                              fontWeight: '500',
                              marginBottom: '4px'
                            }}>
                              Jenis Pengaduan
                            </div>
                            <div style={{
                              fontSize: '16px',
                              fontWeight: '600',
                              color: '#1a202c',
                              textTransform: 'capitalize'
                            }}>
                              {letter.jenis_pengaduan.replace(/_/g, ' ')}
                            </div>
                          </div>
                        )}
                        {letter.tingkat_urgensi && (
                          <div>
                            <div style={{
                              fontSize: '12px',
                              color: '#64748b',
                              fontWeight: '500',
                              marginBottom: '4px'
                            }}>
                              Tingkat Urgensi
                            </div>
                            <div style={{
                              fontSize: '16px',
                              fontWeight: '600',
                              color: '#1a202c',
                              textTransform: 'capitalize'
                            }}>
                              {letter.tingkat_urgensi.replace(/_/g, ' ')}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* PEMBERITAHUAN - Sesuai database */}
                {letter.jenis === "pemberitahuan" && (letter.kategori_pemberitahuan || letter.tingkat_prioritas || letter.batas_waktu_respon || letter.follow_up_required) && (
                  <div>
                    <h3 style={{
                      margin: '0 0 16px 0',
                      fontSize: '20px',
                      fontWeight: '700',
                      color: '#1a202c'
                    }}>
                      Detail Pemberitahuan
                    </h3>
                    <div style={{
                      background: '#fef2f2',
                      padding: '24px',
                      borderRadius: '16px',
                      border: '2px solid #ef4444'
                    }}>
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '20px'
                      }}>
                        {letter.kategori_pemberitahuan && (
                          <div>
                            <div style={{
                              fontSize: '12px',
                              color: '#64748b',
                              fontWeight: '500',
                              marginBottom: '4px'
                            }}>
                              Kategori
                            </div>
                            <div style={{
                              fontSize: '16px',
                              fontWeight: '600',
                              color: '#1a202c',
                              textTransform: 'capitalize'
                            }}>
                              {letter.kategori_pemberitahuan.replace(/_/g, ' ')}
                            </div>
                          </div>
                        )}
                        {letter.tingkat_prioritas && (
                          <div>
                            <div style={{
                              fontSize: '12px',
                              color: '#64748b',
                              fontWeight: '500',
                              marginBottom: '4px'
                            }}>
                              Tingkat Prioritas
                            </div>
                            <div style={{
                              fontSize: '16px',
                              fontWeight: '600',
                              color: '#1a202c',
                              textTransform: 'capitalize'
                            }}>
                              {letter.tingkat_prioritas}
                            </div>
                          </div>
                        )}
                        {letter.batas_waktu_respon && (
                          <div>
                            <div style={{
                              fontSize: '12px',
                              color: '#64748b',
                              fontWeight: '500',
                              marginBottom: '4px'
                            }}>
                              Batas Waktu Respon
                            </div>
                            <div style={{
                              fontSize: '16px',
                              fontWeight: '600',
                              color: '#1a202c'
                            }}>
                              {formatDate(letter.batas_waktu_respon)}
                            </div>
                          </div>
                        )}
                        {letter.follow_up_required && (
                          <div>
                            <div style={{
                              fontSize: '12px',
                              color: '#64748b',
                              fontWeight: '500',
                              marginBottom: '4px'
                            }}>
                              Follow Up Required
                            </div>
                            <div style={{
                              fontSize: '16px',
                              fontWeight: '600',
                              color: '#1a202c',
                              textTransform: 'capitalize'
                            }}>
                              {letter.follow_up_required === 'ya' ? 'Ya' : 'Tidak'}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Metadata */}
                <div style={{
                  background: '#f1f5f9',
                  padding: '24px',
                  borderRadius: '16px',
                  fontSize: '15px',
                  color: '#64748b'
                }}>
                  <div style={{ marginBottom: '8px' }}>
                    <strong>Dibuat oleh:</strong> {letter.created_by_name || 'System'}
                  </div>
                  <div>
                    <strong>Dibuat pada:</strong> {formatDate(letter.created_at)}
                  </div>
                </div>
              </div>
            )}

            {/* Message */}
            {message && (
              <div style={{
                marginTop: '24px',
                padding: '16px 24px',
                backgroundColor: message.includes("berhasil") ? "#ecfdf5" : "#fef2f2",
                color: message.includes("berhasil") ? "#065f46" : "#dc2626",
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: '500',
                border: `1px solid ${message.includes("berhasil") ? "#a7f3d0" : "#fecaca"}`,
                textAlign: 'center'
              }}>
                {message}
              </div>
            )}
          </div>
        </div>

        {/* Loading Animation CSS */}
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </DashboardLayout>
  )
}

export default LetterDetailPage