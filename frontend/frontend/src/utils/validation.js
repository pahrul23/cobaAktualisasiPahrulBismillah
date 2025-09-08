export const validateProposalDecision = (formData) => {
  const errors = {};

  if (!formData.keputusan) {
    errors.keputusan = 'Keputusan harus dipilih';
  }

  if (formData.keputusan === 'setuju') {
    if (!formData.nominal_bantuan || formData.nominal_bantuan <= 0) {
      errors.nominal_bantuan = 'Nominal bantuan harus diisi untuk proposal yang disetujui';
    }
    
    if (formData.nominal_bantuan > 10000000000) { // 10 billion limit
      errors.nominal_bantuan = 'Nominal bantuan terlalu besar';
    }
  }

  if (formData.catatan_ketua && formData.catatan_ketua.length > 500) {
    errors.catatan_ketua = 'Catatan tidak boleh lebih dari 500 karakter';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateAttendanceStatus = (formData) => {
  const errors = {};

  if (!formData.status_kehadiran) {
    errors.status_kehadiran = 'Status kehadiran harus dipilih';
  }

  const validStatuses = ['hadir', 'tidak_hadir', 'ditunda'];
  if (formData.status_kehadiran && !validStatuses.includes(formData.status_kehadiran)) {
    errors.status_kehadiran = 'Status kehadiran tidak valid';
  }

  if (formData.catatan_ketua && formData.catatan_ketua.length > 500) {
    errors.catatan_ketua = 'Catatan tidak boleh lebih dari 500 karakter';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
