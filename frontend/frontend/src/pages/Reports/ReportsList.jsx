import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import useAuth from '../../hooks/useAuth';

const ReportsList = () => {
  const { user, token } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [stats, setStats] = useState({
    total_notifications: 0,
    unread_count: 0,
    attendance_updates: 0,
    today_count: 0
  });

  // Fetch notifications dari API
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/notifications/staff', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token || localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success && result.data) {
        setNotifications(result.data);
        
        // Fetch statistics
        try {
          const statsResponse = await fetch('/api/notifications/stats', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token || localStorage.getItem('token')}`
            }
          });

          if (statsResponse.ok) {
            const statsResult = await statsResponse.json();
            if (statsResult.success) {
              setStats(statsResult.data);
            }
          }
        } catch (statsError) {
          console.warn('Stats fetch failed:', statsError);
        }
      } else {
        throw new Error(result.error || 'Failed to fetch notifications');
      }
      
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setError(`Gagal memuat notifikasi: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Mark notification as read
  const markAsRead = async (notificationId) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}/read`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token || localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        setNotifications(prev => 
          prev.map(notif => 
            notif.id === notificationId 
              ? { ...notif, status_read: 1 }
              : notif
          )
        );
        
        setStats(prev => ({
          ...prev,
          unread_count: Math.max(0, prev.unread_count - 1)
        }));
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // Mark all as read
  const markAllAsRead = async () => {
    try {
      const response = await fetch('/api/notifications/mark-all-read', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token || localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        setNotifications(prev => 
          prev.map(notif => ({ ...notif, status_read: 1 }))
        );
        setStats(prev => ({ ...prev, unread_count: 0 }));
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get notification icon
  const getNotificationIcon = (jenis, letterJenis) => {
    if (jenis === 'attendance_update') {
      return letterJenis === 'undangan' ? '📅' : '🤝';
    }
    return '🔔';
  };

  // Filter notifications
  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread') return notification.status_read === 0;
    if (filter === 'attendance') return notification.jenis === 'attendance_update';
    return true;
  });

  useEffect(() => {
    fetchNotifications();
    
    // Auto refresh every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <DashboardLayout>
      <div style={{ fontFamily: "'Poppins', sans-serif", padding: '24px' }}>
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ fontSize: '32px' }}>📬</div>
              <h1 style={{
                margin: 0,
                fontSize: '28px',
                fontWeight: '700',
                color: '#1a202c'
              }}>
                Notifikasi Staf
              </h1>
              {stats.unread_count > 0 && (
                <span style={{
                  background: '#ef4444',
                  color: 'white',
                  padding: '4px 8px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: '600'
                }}>
                  {stats.unread_count}
                </span>
              )}
            </div>
            
            {stats.unread_count > 0 && (
              <button
                onClick={markAllAsRead}
                style={{
                  padding: '8px 16px',
                  background: '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600'
                }}
              >
                Tandai Semua Dibaca
              </button>
            )}
          </div>
          <p style={{
            margin: 0,
            fontSize: '16px',
            color: '#64748b'
          }}>
            Pemberitahuan keputusan approval dari Ketua DPD RI
          </p>
        </div>

        {/* Stats Row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '24px'
        }}>
          <div style={{
            background: 'white',
            padding: '20px',
            borderRadius: '12px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
            border: '2px solid #e5e7eb'
          }}>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#1a202c' }}>
              {stats.total_notifications}
            </div>
            <div style={{ fontSize: '14px', color: '#64748b' }}>Total Notifikasi</div>
          </div>
          
          <div style={{
            background: 'white',
            padding: '20px',
            borderRadius: '12px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
            border: '2px solid #fbbf24'
          }}>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#f59e0b' }}>
              {stats.unread_count}
            </div>
            <div style={{ fontSize: '14px', color: '#64748b' }}>Belum Dibaca</div>
          </div>
          
          <div style={{
            background: 'white',
            padding: '20px',
            borderRadius: '12px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
            border: '2px solid #10b981'
          }}>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#10b981' }}>
              {stats.attendance_updates}
            </div>
            <div style={{ fontSize: '14px', color: '#64748b' }}>Update Kehadiran</div>
          </div>
          
          <div style={{
            background: 'white',
            padding: '20px',
            borderRadius: '12px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
            border: '2px solid #0ea5e9'
          }}>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#0ea5e9' }}>
              {stats.today_count}
            </div>
            <div style={{ fontSize: '14px', color: '#64748b' }}>Hari Ini</div>
          </div>
        </div>

        {/* Filter */}
        <div style={{
          background: 'white',
          padding: '16px',
          borderRadius: '12px',
          marginBottom: '24px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
          display: 'flex',
          gap: '12px',
          alignItems: 'center'
        }}>
          <span style={{ fontSize: '14px', color: '#64748b', fontWeight: '600' }}>
            Filter:
          </span>
          {[
            { key: 'all', label: 'Semua' },
            { key: 'unread', label: 'Belum Dibaca' },
            { key: 'attendance', label: 'Update Kehadiran' }
          ].map(option => (
            <button
              key={option.key}
              onClick={() => setFilter(option.key)}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                border: 'none',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                background: filter === option.key ? '#10b981' : '#f3f4f6',
                color: filter === option.key ? 'white' : '#64748b'
              }}
            >
              {option.label}
            </button>
          ))}
          <span style={{ fontSize: '14px', color: '#64748b', marginLeft: '8px' }}>
            ({filteredNotifications.length} hasil)
          </span>
        </div>

        {/* Content */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
            <p style={{ color: '#64748b' }}>Memuat notifikasi...</p>
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '60px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>❌</div>
            <p style={{ color: '#ef4444' }}>{error}</p>
            <button 
              onClick={fetchNotifications}
              style={{
                marginTop: '16px',
                padding: '8px 16px',
                background: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              Coba Lagi
            </button>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px' }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>📭</div>
            <h2 style={{ 
              margin: '0 0 8px 0',
              fontSize: '20px',
              fontWeight: '600',
              color: '#1a202c'
            }}>
              Tidak Ada Notifikasi
            </h2>
            <p style={{ color: '#64748b' }}>
              {filter === 'unread' ? 'Semua notifikasi sudah dibaca' : 
               filter === 'attendance' ? 'Belum ada update kehadiran' :
               'Tidak ada notifikasi untuk ditampilkan'}
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '16px' }}>
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                onClick={() => notification.status_read === 0 && markAsRead(notification.id)}
                style={{
                  background: 'white',
                  borderRadius: '16px',
                  padding: '24px',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
                  border: `2px solid ${notification.status_read === 0 ? '#fbbf24' : '#e5e7eb'}`,
                  cursor: notification.status_read === 0 ? 'pointer' : 'default',
                  position: 'relative'
                }}
              >
                {notification.status_read === 0 && (
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    width: '8px',
                    height: '8px',
                    background: '#ef4444',
                    borderRadius: '50%'
                  }} />
                )}
                
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                  <div style={{ 
                    fontSize: '32px',
                    opacity: notification.status_read === 0 ? 1 : 0.6
                  }}>
                    {getNotificationIcon(notification.jenis, notification.letter_jenis)}
                  </div>
                  
                  <div style={{ flex: 1 }}>
                    <div style={{ marginBottom: '8px' }}>
                      <span style={{
                        background: notification.status_read === 0 ? '#fef3c7' : '#f3f4f6',
                        color: notification.status_read === 0 ? '#92400e' : '#64748b',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: '600',
                        textTransform: 'uppercase'
                      }}>
                        {notification.jenis === 'attendance_update' ? 'UPDATE KEHADIRAN' : 'NOTIFIKASI'}
                      </span>
                    </div>
                    
                    <p style={{
                      margin: '0 0 12px 0',
                      fontSize: '15px',
                      lineHeight: '1.5',
                      color: notification.status_read === 0 ? '#1a202c' : '#64748b',
                      fontWeight: notification.status_read === 0 ? '500' : '400'
                    }}>
                      {notification.pesan}
                    </p>
                    
                    {notification.perihal && (
                      <div style={{ marginBottom: '8px' }}>
                        <span style={{ 
                          fontSize: '13px', 
                          color: '#64748b',
                          fontWeight: '600'
                        }}>
                          Terkait: {notification.perihal}
                        </span>
                        {notification.asal_surat && (
                          <span style={{ 
                            fontSize: '13px', 
                            color: '#64748b',
                            marginLeft: '8px'
                          }}>
                            • {notification.asal_surat}
                          </span>
                        )}
                      </div>
                    )}
                    
                    <div style={{ 
                      fontSize: '12px', 
                      color: '#64748b',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <span>{formatDate(notification.created_at)}</span>
                      {notification.status_read === 0 && (
                        <span style={{ 
                          color: '#10b981',
                          fontWeight: '600'
                        }}>
                          Klik untuk tandai dibaca
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ReportsList;