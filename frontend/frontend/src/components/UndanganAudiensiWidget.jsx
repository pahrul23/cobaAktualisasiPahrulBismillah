// Path: /frontend/src/components/UndanganAudiensiWidget.jsx
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CheckCircle, XCircle, Clock, Calendar, MapPin, Users, Building } from 'lucide-react';
import { toast } from 'react-hot-toast';

const UndanganAudiensiWidget = ({ undanganList, onUpdate }) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    status_kehadiran: '',
    catatan_ketua: ''
  });

  const handleOpenDialog = (item) => {
    setSelectedItem(item);
    setFormData({
      status_kehadiran: item.status_kehadiran || '',
      catatan_ketua: ''
    });
    setIsDialogOpen(true);
  };

  const handleSubmitStatus = async () => {
    if (!formData.status_kehadiran) {
      toast.error('Silakan pilih status kehadiran terlebih dahulu');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/executive/undangan/${selectedItem.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status_kehadiran: formData.status_kehadiran,
          catatan_ketua: formData.catatan_ketua
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        toast.success('Status kehadiran berhasil diupdate');
        setIsDialogOpen(false);
        onUpdate(); // Refresh data
      } else {
        toast.error(data.message || 'Terjadi kesalahan');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Terjadi kesalahan saat mengupdate status');
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (dateString, timeString) => {
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    return timeString ? `${formattedDate}, ${timeString}` : formattedDate;
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      hadir: { label: 'Akan Hadir', color: 'bg-green-100 text-green-800', icon: CheckCircle },
      tidak_hadir: { label: 'Tidak Hadir', color: 'bg-red-100 text-red-800', icon: XCircle },
      ditunda: { label: 'Ditunda', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      '': { label: 'Belum Dikonfirmasi', color: 'bg-gray-100 text-gray-800', icon: Clock }
    };

    const config = statusConfig[status] || statusConfig[''];
    const Icon = config.icon;
    
    return (
      <Badge className={config.color}>
        <Icon className="h-3 w-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  const getStatusButton = (status) => {
    const config = {
      hadir: { icon: CheckCircle, color: 'bg-green-600 hover:bg-green-700', text: 'Hadir' },
      tidak_hadir: { icon: XCircle, color: 'bg-red-600 hover:bg-red-700', text: 'Tidak Hadir' },
      ditunda: { icon: Clock, color: 'bg-yellow-600 hover:bg-yellow-700', text: 'Tunda' }
    };

    const { icon: Icon, color, text } = config[status];
    
    return (
      <Button
        variant={formData.status_kehadiran === status ? 'default' : 'outline'}
        size="sm"
        className={formData.status_kehadiran === status ? color : ''}
        onClick={() => setFormData({ ...formData, status_kehadiran: status })}
      >
        <Icon className="h-4 w-4 mr-2" />
        {text}
      </Button>
    );
  };

  const getTypeIcon = (jenis) => {
    return jenis === 'undangan' ? Calendar : Users;
  };

  const getTypeColor = (jenis) => {
    return jenis === 'undangan' ? 'text-blue-600' : 'text-purple-600';
  };

  // Filter items that are upcoming or recent
  const sortedItems = undanganList
    .sort((a, b) => new Date(b.tanggal_acara) - new Date(a.tanggal_acara))
    .slice(0, 10); // Show latest 10 items

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Undangan & Audiensi
          {undanganList.length > 0 && (
            <Badge variant="secondary" className="ml-2">
              {undanganList.length} acara
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {sortedItems.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Tidak ada undangan atau audiensi terbaru</p>
          </div>
        ) : (
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {sortedItems.map((item) => {
              const TypeIcon = getTypeIcon(item.jenis);
              const typeColor = getTypeColor(item.jenis);
              
              return (
                <div key={item.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <TypeIcon className={`h-5 w-5 ${typeColor}`} />
                        <span className={`text-sm font-medium ${typeColor} capitalize`}>
                          {item.jenis}
                        </span>
                      </div>
                      
                      <h4 className="font-semibold text-gray-900 mb-2">
                        {item.perihal}
                      </h4>
                      
                      <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Building className="h-4 w-4" />
                          <span>{item.asal_surat}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDateTime(item.tanggal_acara, item.pukul)}</span>
                        </div>
                        
                        {item.tempat && (
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            <span>{item.tempat}</span>
                          </div>
                        )}
                        
                        {item.jenis_acara && (
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            <span>{item.jenis_acara}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end gap-2">
                      {getStatusBadge(item.status_kehadiran)}
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center pt-3 border-t">
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">No. Surat:</span> {item.no_surat}
                    </div>
                    
                    <Dialog open={isDialogOpen && selectedItem?.id === item.id} onOpenChange={setIsDialogOpen}>
                      <DialogTrigger asChild>
                        <Button 
                          size="sm"
                          variant={item.status_kehadiran ? "outline" : "default"}
                          onClick={() => handleOpenDialog(item)}
                        >
                          {item.status_kehadiran ? 'Ubah Status' : 'Konfirmasi'}
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>
                            Konfirmasi Kehadiran - {selectedItem?.jenis === 'undangan' ? 'Undangan' : 'Audiensi'}
                          </DialogTitle>
                        </DialogHeader>
                        
                        {selectedItem && (
                          <div className="space-y-6">
                            {/* Event Details */}
                            <div className="bg-gray-50 rounded-lg p-4">
                              <div className="flex items-center gap-2 mb-3">
                                <TypeIcon className={`h-5 w-5 ${getTypeColor(selectedItem.jenis)}`} />
                                <span className={`font-medium ${getTypeColor(selectedItem.jenis)} capitalize`}>
                                  {selectedItem.jenis}
                                </span>
                              </div>
                              
                              <h3 className="font-semibold mb-3">{selectedItem.perihal}</h3>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div>
                                  <span className="font-medium">Penyelenggara:</span>
                                  <p>{selectedItem.asal_surat}</p>
                                </div>
                                
                                <div>
                                  <span className="font-medium">No. Surat:</span>
                                  <p>{selectedItem.no_surat}</p>
                                </div>
                                
                                <div>
                                  <span className="font-medium">Waktu:</span>
                                  <p>{formatDateTime(selectedItem.tanggal_acara, selectedItem.pukul)}</p>
                                </div>
                                
                                {selectedItem.tempat && (
                                  <div>
                                    <span className="font-medium">Tempat:</span>
                                    <p>{selectedItem.tempat}</p>
                                  </div>
                                )}
                                
                                {selectedItem.jenis_acara && (
                                  <div className="md:col-span-2">
                                    <span className="font-medium">
                                      {selectedItem.jenis === 'undangan' ? 'Jenis Acara:' : 'Topik Audiensi:'}
                                    </span>
                                    <p>{selectedItem.jenis_acara}</p>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Status Selection */}
                            <div>
                              <Label className="text-base font-medium mb-3 block">
                                Status Kehadiran Ketua DPD RI
                              </Label>
                              <div className="flex gap-3 flex-wrap">
                                {getStatusButton('hadir')}
                                {getStatusButton('tidak_hadir')}
                                {getStatusButton('ditunda')}
                              </div>
                            </div>

                            {/* Notes */}
                            <div>
                              <Label htmlFor="catatan_ketua">Catatan Ketua (Opsional)</Label>
                              <Textarea
                                id="catatan_ketua"
                                placeholder="Tambahkan catatan atau alasan..."
                                value={formData.catatan_ketua}
                                onChange={(e) => setFormData({ ...formData, catatan_ketua: e.target.value })}
                                className="mt-1"
                                rows={3}
                              />
                            </div>

                            {/* Action Buttons */}
                            <div className="flex justify-end gap-3 pt-4 border-t">
                              <Button
                                variant="outline"
                                onClick={() => setIsDialogOpen(false)}
                                disabled={loading}
                              >
                                Batal
                              </Button>
                              <Button
                                onClick={handleSubmitStatus}
                                disabled={loading || !formData.status_kehadiran}
                              >
                                {loading ? 'Menyimpan...' : 'Simpan Status'}
                              </Button>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UndanganAudiensiWidget;