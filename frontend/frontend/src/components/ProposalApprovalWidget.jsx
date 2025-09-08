// Path: /frontend/src/components/ProposalApprovalWidget.jsx
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCircle, XCircle, Edit, FileText, Calendar, Building, DollarSign } from 'lucide-react';
import { toast } from 'react-hot-toast';

const ProposalApprovalWidget = ({ proposals, onUpdate }) => {
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    keputusan: '',
    nominal_bantuan: '',
    catatan_ketua: ''
  });

  const handleOpenDialog = (proposal) => {
    setSelectedProposal(proposal);
    setFormData({
      keputusan: '',
      nominal_bantuan: '',
      catatan_ketua: ''
    });
    setIsDialogOpen(true);
  };

  const handleSubmitDecision = async () => {
    if (!formData.keputusan) {
      toast.error('Silakan pilih keputusan terlebih dahulu');
      return;
    }

    if (formData.keputusan === 'setuju' && !formData.nominal_bantuan) {
      toast.error('Silakan masukkan nominal bantuan untuk proposal yang disetujui');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/executive/proposals/${selectedProposal.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          keputusan: formData.keputusan,
          nominal_bantuan: formData.keputusan === 'setuju' ? parseInt(formData.nominal_bantuan) : 0,
          catatan_ketua: formData.catatan_ketua
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        toast.success('Keputusan proposal berhasil disimpan');
        setIsDialogOpen(false);
        onUpdate(); // Refresh data
      } else {
        toast.error(data.message || 'Terjadi kesalahan');
      }
    } catch (error) {
      console.error('Error submitting decision:', error);
      toast.error('Terjadi kesalahan saat menyimpan keputusan');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { label: 'Menunggu', color: 'bg-yellow-100 text-yellow-800' },
      diproses: { label: 'Diproses', color: 'bg-blue-100 text-blue-800' },
      verifikasi: { label: 'Verifikasi', color: 'bg-purple-100 text-purple-800' },
      selesai: { label: 'Selesai', color: 'bg-green-100 text-green-800' },
      ditolak: { label: 'Ditolak', color: 'bg-red-100 text-red-800' }
    };

    const config = statusConfig[status] || statusConfig.pending;
    return (
      <Badge className={config.color}>
        {config.label}
      </Badge>
    );
  };

  const getDecisionButton = (keputusan) => {
    const config = {
      setuju: { icon: CheckCircle, color: 'bg-green-600 hover:bg-green-700', text: 'Setuju' },
      tidak_setuju: { icon: XCircle, color: 'bg-red-600 hover:bg-red-700', text: 'Tolak' },
      perlu_revisi: { icon: Edit, color: 'bg-yellow-600 hover:bg-yellow-700', text: 'Revisi' }
    };

    const { icon: Icon, color, text } = config[keputusan];
    
    return (
      <Button
        variant={formData.keputusan === keputusan ? 'default' : 'outline'}
        size="sm"
        className={formData.keputusan === keputusan ? color : ''}
        onClick={() => setFormData({ ...formData, keputusan })}
      >
        <Icon className="h-4 w-4 mr-2" />
        {text}
      </Button>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Proposal Menunggu Persetujuan
          {proposals.length > 0 && (
            <Badge variant="secondary" className="ml-2">
              {proposals.length} proposal
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {proposals.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Tidak ada proposal yang menunggu persetujuan</p>
          </div>
        ) : (
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {proposals.map((proposal) => (
              <div key={proposal.id} className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">
                      {proposal.judul_proposal || proposal.perihal}
                    </h4>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                      <span className="flex items-center gap-1">
                        <Building className="h-4 w-4" />
                        {proposal.asal_surat}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formatDate(proposal.created_at)}
                      </span>
                    </div>
                    {proposal.total_anggaran && (
                      <div className="flex items-center gap-1 text-sm">
                        <DollarSign className="h-4 w-4 text-green-600" />
                        <span className="text-green-600 font-medium">
                          Diminta: {formatCurrency(proposal.total_anggaran)}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(proposal.status)}
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">No. Surat:</span> {proposal.no_surat}
                  </div>
                  
                  <Dialog open={isDialogOpen && selectedProposal?.id === proposal.id} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button 
                        size="sm"
                        onClick={() => handleOpenDialog(proposal)}
                      >
                        Beri Keputusan
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Keputusan Proposal</DialogTitle>
                      </DialogHeader>
                      
                      {selectedProposal && (
                        <div className="space-y-6">
                          {/* Proposal Details */}
                          <div className="bg-gray-50 rounded-lg p-4">
                            <h3 className="font-semibold mb-2">{selectedProposal.judul_proposal || selectedProposal.perihal}</h3>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="font-medium">Pengusul:</span> {selectedProposal.asal_surat}
                              </div>
                              <div>
                                <span className="font-medium">No. Surat:</span> {selectedProposal.no_surat}
                              </div>
                              <div>
                                <span className="font-medium">Tanggal:</span> {formatDate(selectedProposal.created_at)}
                              </div>
                              {selectedProposal.total_anggaran && (
                                <div>
                                  <span className="font-medium">Anggaran Diminta:</span> {formatCurrency(selectedProposal.total_anggaran)}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Decision Buttons */}
                          <div>
                            <Label className="text-base font-medium mb-3 block">Keputusan Ketua DPD RI</Label>
                            <div className="flex gap-3">
                              {getDecisionButton('setuju')}
                              {getDecisionButton('tidak_setuju')}
                              {getDecisionButton('perlu_revisi')}
                            </div>
                          </div>

                          {/* Nominal Bantuan - Only show if approved */}
                          {formData.keputusan === 'setuju' && (
                            <div>
                              <Label htmlFor="nominal_bantuan">Nominal Bantuan (Rp)</Label>
                              <Input
                                id="nominal_bantuan"
                                type="number"
                                placeholder="Masukkan nominal bantuan"
                                value={formData.nominal_bantuan}
                                onChange={(e) => setFormData({ ...formData, nominal_bantuan: e.target.value })}
                                className="mt-1"
                              />
                            </div>
                          )}

                          {/* Notes */}
                          <div>
                            <Label htmlFor="catatan_ketua">Catatan Ketua (Opsional)</Label>
                            <Textarea
                              id="catatan_ketua"
                              placeholder="Tambahkan catatan atau alasan keputusan..."
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
                              onClick={handleSubmitDecision}
                              disabled={loading || !formData.keputusan}
                            >
                              {loading ? 'Menyimpan...' : 'Simpan Keputusan'}
                            </Button>
                          </div>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProposalApprovalWidget;