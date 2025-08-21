'use client';

import { Button } from '#/components/ui/button';
import { Card, CardContent } from '#/components/ui/card';
import { ConfirmDialog } from '#components/confirm-dialog';
import { useToast } from '#hooks/use-toast';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { ArrowLeft, MessageCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { CommentCard, RatingSummary } from './components';
import { commentsApi } from './data';
import { DeleteDialogState, ProductComment } from './types';



export function ProductComments() {
  const [comments, setComments] = useState<ProductComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState<DeleteDialogState>({
    open: false,
    comment: null,
  });
  const [deleting, setDeleting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // URL search parametrelerini al
  const search = useSearch({ strict: false }) as { productId?: string; productName?: string };
  const { productId, productName } = search;

  useEffect(() => {
    loadComments();
  }, [productId]);

  const loadComments = async () => {
    try {
      setLoading(true);
      const data = await commentsApi.getComments(productId);
      setComments(data);
    } catch (error) {
      console.error('Yorumlar yüklenirken hata:', error);
      toast({
        variant: "destructive",
        title: "Yükleme hatası!",
        description: "Yorumlar yüklenirken bir hata oluştu. Lütfen sayfayı yenileyin.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate({ to: '/admin/products' });
  };

  const handleDeleteComment = (comment: ProductComment) => {
    setDeleteDialog({
      open: true,
      comment: comment,
    });
  };

  const handleConfirmDelete = async () => {
    if (!deleteDialog.comment) return;
    
    try {
      setDeleting(true);
      await commentsApi.deleteComment(deleteDialog.comment.id);
      
      toast({
        title: "Yorum silindi!",
        description: "Yorum başarıyla silindi.",
      });
      
      setDeleteDialog({ open: false, comment: null });
      
      // Listeyi yeniden yükle
      await loadComments();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Silme hatası!",
        description: "Yorum silinirken bir hata oluştu.",
      });
    } finally {
      setDeleting(false);
    }
  };

  const calculateAverageRating = () => {
    if (comments.length === 0) return 0;
    const sum = comments.reduce((acc, comment) => acc + comment.rating, 0);
    return (sum / comments.length).toFixed(1);
  };

  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    comments.forEach(comment => {
      distribution[comment.rating as keyof typeof distribution]++;
    });
    return distribution;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Yorumlar yükleniyor...</p>
        </div>
      </div>
    );
  }

  const ratingDistribution = getRatingDistribution();

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Geri Dön</span>
          </Button>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Ürün Yorumları</h1>
            <p className="text-muted-foreground">
              {productName ? `"${productName}" ürününün müşteri yorumları` : 'Ürün yorumlarını görüntüleyin'}
            </p>
          </div>
        </div>
      </div>


      <RatingSummary 
        comments={comments}
        averageRating={calculateAverageRating().toString()}
        ratingDistribution={getRatingDistribution()}
      />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Tüm Yorumlar ({comments.length})</h3>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Sırala:</span>
            <Button variant="outline" size="sm">
              En Yeni
            </Button>
          </div>
        </div>
        
        {comments.length > 0 ? (
          <div className="space-y-4">
            {comments.map((comment) => (
              <CommentCard key={comment.id} comment={comment} onDelete={handleDeleteComment} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <MessageCircle className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Henüz yorum yok</h3>
              <p className="text-muted-foreground text-center">
                {productName ? `"${productName}" ürünü için henüz müşteri yorumu bulunmuyor.` : 'Bu ürün için henüz müşteri yorumu bulunmuyor.'}
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ open, comment: null })}
        title="Yorumu Sil"
        desc={
          deleteDialog.comment
            ? `Bu yorumu silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.`
            : ''
        }
        confirmText="Sil"
        cancelBtnText="İptal"
        destructive={true}
        handleConfirm={handleConfirmDelete}
        isLoading={deleting}
      />
    </div>
  );
}