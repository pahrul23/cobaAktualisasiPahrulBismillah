// Path: /frontend/src/components/NotificationWidget.jsx
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, CheckCircle, XCircle, Edit, FileText, Calendar, Clock, Eye } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const NotificationWidget = ({ notifications }) => {
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) {
      return 'Baru saja';
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} menit yang lalu`;
    } else if (diffInMinutes < 1440) { // 24 hours
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours} jam yang lalu`;
    } else {
      return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  const getNotificationIcon = (jenis) => {
    const iconConfig = {
      proposal_decision: { icon: FileText, color: 'text-blue-600' },
      attendance_update: { icon: Calendar, color: 'text-green-600' },
      general: { icon: Bell, color: 'text-gray-600' }
    };

    return iconConfig[jenis] || iconConfig.general;
  };

  const getNotificationBadge = (jenis) => {
    const badgeConfig = {
      proposal_decision: { label: 'Proposal', color: 'bg-blue-100 text-blue-800' },
      attendance_update: { label: 'Kehadiran', color: 'bg-green-100 text-green-800' },
      general: { label: 'Umum', color: 'bg-gray-100 text-gray-800' }
    };

    const config = badgeConfig[jenis] || badgeConfig.general;
    return (
      <Badge className={config.color}>
        {config.label}
      </Badge>
    );
  };

  const getActionIcon = (message) => {
    if (message.includes('DISETUJUI')) {
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    } else if (message.includes('DITOLAK')) {
      return <XCircle className="h-4 w-4 text-red-600" />;
    } else if (message.includes('REVISI')) {
      return <Edit className="h-4 w-4 text-yellow-600" />;
    } else if (message.includes('HADIR')) {
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    } else if (message.includes('TIDAK HADIR')) {
      return <XCircle className="h-4 w-4 text-red-600" />;
    } else if (message.includes('DITUNDA')) {
      return <Clock className="h-4 w-4 text-yellow-600" />;
    }
    return null;
  };

  const handleViewDetails = (notification) => {
    setSelectedNotification(notification);
    setIsDialogOpen(true);
  };

  const truncateMessage = (message, maxLength = 120) => {
    if (message.length <= maxLength) return message;
    return message.substring(0, maxLength) + '...';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Riwayat Aksi & Notifikasi
          {notifications.length > 0 && (
            <Badge variant="secondary" className="ml-2">
              {notifications.length} notifikasi
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {notifications.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Belum ada riwayat aksi atau notifikasi</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {notifications.map((notification) => {
              const { icon: Icon, color } = getNotificationIcon(notification.jenis);
              const actionIcon = getActionIcon(notification.pesan);
              
              return (
                <div key={notification.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-full bg-gray-100 ${color}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {getNotificationBadge(notification.jenis)}
                          {actionIcon}
                        </div>
                        <span className="text-xs text-gray-500">
                          {formatDateTime(notification.created_at)}
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-900 leading-relaxed">
                        {truncateMessage(notification.pesan)}
                      </p>
                      
                      {notification.subject_title && (
                        <div className="mt-2 text-xs text-gray-600">
                          <span className="font-medium">Terkait:</span> {notification.subject_title}
                        </div>
                      )}
                      
                      {notification.pesan.length > 120 && (
                        <Dialog open={isDialogOpen && selectedNotification?.id === notification.id} onOpenChange={setIsDialogOpen}>
                          <DialogTrigger asChild>
                            <Button
                              variant="link"
                              size="sm"
                              className="mt-2 p-0 h-auto text-blue-600"
                              onClick={() => handleViewDetails(notification)}
                            >
                              <Eye className="h-3 w-3 mr-1" />
                              Lihat detail
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle className="flex items-center gap-2">
                                <Icon className={`h-5 w-5 ${color}`} />
                                Detail Notifikasi
                                {getNotificationBadge(notification.jenis)}
                              </DialogTitle>
                            </DialogHeader>
                            
                            {selectedNotification && (
                              <div className="space-y-4">
                                <div className="bg-gray-50 rounded-lg p-4">
                                  <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                      {actionIcon}
                                      <span className="font-medium">Aksi Ketua DPD RI</span>
                                    </div>
                                    <span className="text-sm text-gray-600">
                                      {formatDateTime(selectedNotification.created_at)}
                                    </span>
                                  </div>
                                  
                                  <p className="text-gray-900 leading-relaxed">
                                    {selectedNotification.pesan}
                                  </p>
                                  
                                  {selectedNotification.subject_title && (
                                    <div className="mt-3 pt-3 border-t border-gray-200">
                                      <span className="text-sm font-medium text-gray-600">Subjek: </span>
                                      <span className="text-sm text-gray-900">{selectedNotification.subject_title}</span>
                                    </div>
                                  )}
                                </div>
                                
                                <div className="text-sm text-gray-600">
                                  <p><span className="font-medium">Jenis:</span> {notification.jenis === 'proposal_decision' ? 'Keputusan Proposal' : notification.jenis === 'attendance_update' ? 'Update Kehadiran' : 'Notifikasi Umum'}</p>
                                  <p><span className="font-medium">ID Notifikasi:</span> {selectedNotification.id}</p>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        
        {notifications.length > 0 && (
          <div className="mt-4 pt-4 border-t text-center">
            <Button variant="outline" size="sm">
              Lihat Semua Riwayat
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NotificationWidget;