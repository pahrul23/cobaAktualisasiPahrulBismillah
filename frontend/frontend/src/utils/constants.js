export const LETTER_TYPES = {
  pengaduan: { 
    label: 'Pengaduan', 
    color: '#ef4444',
    bgColor: 'bg-red-100',
    textColor: 'text-red-800'
  },
  undangan: { 
    label: 'Undangan', 
    color: '#3b82f6',
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-800'
  },
  audiensi: { 
    label: 'Audiensi', 
    color: '#10b981',
    bgColor: 'bg-green-100',
    textColor: 'text-green-800'
  },
  proposal: { 
    label: 'Proposal', 
    color: '#f59e0b',
    bgColor: 'bg-yellow-100',
    textColor: 'text-yellow-800'
  },
  pemberitahuan: { 
    label: 'Pemberitahuan', 
    color: '#8b5cf6',
    bgColor: 'bg-purple-100',
    textColor: 'text-purple-800'
  }
};

export const PROPOSAL_STATUS = {
  pending: { 
    label: 'Menunggu', 
    color: 'bg-yellow-100 text-yellow-800',
    priority: 1
  },
  diproses: { 
    label: 'Diproses', 
    color: 'bg-blue-100 text-blue-800',
    priority: 2
  },
  verifikasi: { 
    label: 'Verifikasi', 
    color: 'bg-purple-100 text-purple-800',
    priority: 3
  },
  selesai: { 
    label: 'Selesai', 
    color: 'bg-green-100 text-green-800',
    priority: 5
  },
  ditolak: { 
    label: 'Ditolak', 
    color: 'bg-red-100 text-red-800',
    priority: 4
  }
};

export const ATTENDANCE_STATUS = {
  hadir: { 
    label: 'Akan Hadir', 
    color: 'bg-green-100 text-green-800',
    icon: 'CheckCircle'
  },
  tidak_hadir: { 
    label: 'Tidak Hadir', 
    color: 'bg-red-100 text-red-800',
    icon: 'XCircle'
  },
  ditunda: { 
    label: 'Ditunda', 
    color: 'bg-yellow-100 text-yellow-800',
    icon: 'Clock'
  },
  '': { 
    label: 'Belum Dikonfirmasi', 
    color: 'bg-gray-100 text-gray-800',
    icon: 'Clock'
  }
};

export const NOTIFICATION_TYPES = {
  proposal_decision: { 
    label: 'Proposal', 
    color: 'bg-blue-100 text-blue-800',
    icon: 'FileText'
  },
  attendance_update: { 
    label: 'Kehadiran', 
    color: 'bg-green-100 text-green-800',
    icon: 'Calendar'
  },
  general: { 
    label: 'Umum', 
    color: 'bg-gray-100 text-gray-800',
    icon: 'Bell'
  }
};

export const DECISION_OPTIONS = [
  {
    value: 'setuju',
    label: 'Setuju',
    icon: 'CheckCircle',
    color: 'bg-green-600 hover:bg-green-700',
    description: 'Menyetujui proposal dengan nominal bantuan'
  },
  {
    value: 'tidak_setuju',
    label: 'Tolak',
    icon: 'XCircle',
    color: 'bg-red-600 hover:bg-red-700',
    description: 'Menolak proposal'
  },
  {
    value: 'perlu_revisi',
    label: 'Revisi',
    icon: 'Edit',
    color: 'bg-yellow-600 hover:bg-yellow-700',
    description: 'Memerlukan revisi atau perbaikan'
  }
];