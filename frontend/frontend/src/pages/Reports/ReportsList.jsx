import DashboardLayout from '../../components/Layout/DashboardLayout'

const ReportsList = () => {
  return (
    <DashboardLayout>
      <div style={{
        fontFamily: "'Poppins', sans-serif",
        textAlign: 'center',
        padding: '60px 20px'
      }}>
        <div style={{ fontSize: '64px', marginBottom: '20px' }}>📊</div>
        <h1 style={{
          margin: '0 0 12px 0',
          fontSize: '28px',
          fontWeight: '700',
          color: '#1a202c'
        }}>
          Laporan & Analisis
        </h1>
        <p style={{
          margin: 0,
          fontSize: '16px',
          color: '#64748b'
        }}>
          Fitur laporan dan analisis sedang dalam pengembangan
        </p>
      </div>
    </DashboardLayout>
  )
}

export default ReportsList