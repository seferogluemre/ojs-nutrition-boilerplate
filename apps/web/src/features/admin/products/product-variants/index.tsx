'use client';

import { Button } from '#/components/ui/button';
import { ConfirmDialog } from '#components/confirm-dialog';
import { ProductVariantsDataTable } from '#components/data-table/product-variants-data-table';
import { useToast } from '#hooks/use-toast';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { ArrowLeft } from 'lucide-react';
import { useEffect, useState } from 'react';
import { ProductVariant } from '../types/types';
import { VariantFormData, VariantFormModal } from './components/variant-form-modal';

// Mock data for variants - gerçek API'den gelecek
const mockVariants: ProductVariant[] = [
  {
    id: '1',
    productId: '1',
    name: 'Çilek Aromalı - 500g',
    sku: 'PROT-CILEK-500',
    price: 149.99,
    comparePrice: 169.99,
    stock: 25,
    image: '/images/protein-strawberry.jpg',
    attributes: {
      'Aroma': 'Çilek',
      'Ağırlık': '500g',
      'Tip': 'Whey Protein'
    }
  },
  {
    id: '2',
    productId: '1',
    name: 'Vanilya Aromalı - 500g',
    sku: 'PROT-VANILYA-500',
    price: 149.99,
    stock: 15,
    image: '/images/protein-vanilla.jpg',
    attributes: {
      'Aroma': 'Vanilya',
      'Ağırlık': '500g',
      'Tip': 'Whey Protein'
    }
  },
  {
    id: '3',
    productId: '1',
    name: 'Çikolata Aromalı - 1kg',
    sku: 'PROT-CIKOLATA-1KG',
    price: 279.99,
    comparePrice: 299.99,
    stock: 8,
    image: '/images/protein-chocolate.jpg',
    attributes: {
      'Aroma': 'Çikolata',
      'Ağırlık': '1kg',
      'Tip': 'Whey Protein'
    }
  }
];

export function ProductVariants() {
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [loading, setLoading] = useState(true);
  const [variantFormModal, setVariantFormModal] = useState<{
    open: boolean;
    variant: ProductVariant | null;
  }>({
    open: false,
    variant: null,
  });
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    variant: ProductVariant | null;
  }>({
    open: false,
    variant: null,
  });
  const [deleting, setDeleting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // URL search parametrelerini al
  const search = useSearch({ strict: false }) as { productId?: string; productName?: string };
  const { productId, productName } = search;

  useEffect(() => {
    loadVariants();
  }, [productId]);

  const loadVariants = async () => {
    try {
      setLoading(true);
      // TODO: Gerçek API çağrısı yapılacak
      // const data = await variantsApi.getVariants(productId);
      
      // Şimdilik mock data kullanıyoruz
      const filteredVariants = mockVariants.filter(v => v.productId === productId);
      setVariants(filteredVariants);
    } catch (error) {
      console.error('Varyantlar yüklenirken hata:', error);
      toast({
        variant: "destructive",
        title: "Yükleme hatası!",
        description: "Varyantlar yüklenirken bir hata oluştu. Lütfen sayfayı yenileyin.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (variant: ProductVariant) => {
    setVariantFormModal({
      open: true,
      variant: variant,
    });
  };

  const handleDelete = (variant: ProductVariant) => {
    setDeleteDialog({
      open: true,
      variant: variant,
    });
  };

  const handleAddNew = () => {
    setVariantFormModal({
      open: true,
      variant: null,
    });
  };

  const handleVariantSubmit = async (data: VariantFormData) => {
    try {
      if (variantFormModal.variant) {
        // Güncelleme işlemi
        console.log('Varyant güncelleme:', data);
        // TODO: API çağrısı yapılacak
        // await variantsApi.updateVariant(variantFormModal.variant.id, data);
      } else {
        // Yeni varyant ekleme
        console.log('Yeni varyant ekleme:', data);
        // TODO: API çağrısı yapılacak
        // await variantsApi.createVariant(productId, data);
      }
      
      // Listeyi yeniden yükle
      await loadVariants();
    } catch (error) {
      throw error; // Modal'da hata gösterilmesi için
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteDialog.variant) return;
    
    try {
      setDeleting(true);
      console.log('Varyant siliniyor:', deleteDialog.variant.name);
      // TODO: API çağrısı yapılacak
      // await variantsApi.deleteVariant(deleteDialog.variant.id);
      
      toast({
        title: "Varyant silindi!",
        description: `"${deleteDialog.variant.name}" başarıyla silindi.`,
      });
      
      setDeleteDialog({ open: false, variant: null });
      
      // Listeyi yeniden yükle
      await loadVariants();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Silme hatası!",
        description: "Varyant silinirken bir hata oluştu.",
      });
    } finally {
      setDeleting(false);
    }
  };

  const handleBack = () => {
    navigate({ to: '/admin/products' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Varyantlar yükleniyor...</p>
        </div>
      </div>
    );
  }

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
            <h1 className="text-2xl font-semibold tracking-tight">Ürün Varyantları</h1>
            <p className="text-muted-foreground">
              {productName ? `"${productName}" ürününün varyantlarını yönetin` : 'Ürün varyantlarını yönetin'}
            </p>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <ProductVariantsDataTable
        data={variants}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAddNew={handleAddNew}
        productName={productName}
      />

      {/* Variant Form Modal */}
      <VariantFormModal
        open={variantFormModal.open}
        onOpenChange={(open) => setVariantFormModal({ open, variant: null })}
        variant={variantFormModal.variant}
        productName={productName}
        onSubmit={handleVariantSubmit}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ open, variant: null })}
        title="Varyantı Sil"
        desc={
          deleteDialog.variant
            ? `"${deleteDialog.variant.name}" varyantını silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.`
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