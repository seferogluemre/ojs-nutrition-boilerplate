'use client';

import { ConfirmDialog } from '#components/confirm-dialog';
import { ProductsDataTable } from '#components/data-table/products-data-table';
import { useToast } from '#hooks/use-toast';
import { useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { ProductFormModal } from './components/product-form-modal';
import { productsApi } from './data/data';
import { Product, ProductFormData } from './types/types';

export function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [productFormModal, setProductFormModal] = useState<{
    open: boolean;
    product: Product | null;
  }>({
    open: false,
    product: null,
  });
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    product: Product | null;
  }>({
    open: false,
    product: null,
  });
  const [deleting, setDeleting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await productsApi.getProducts();
      setProducts(data);
    } catch (error) {
      console.error('Ürünler yüklenirken hata:', error);
      toast({
        variant: "destructive",
        title: "Yükleme hatası!",
        description: "Ürünler yüklenirken bir hata oluştu. Lütfen sayfayı yenileyin.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleView = (product: Product) => {
    console.log('Ürün görüntüle:', product);
    // TODO: Ürün detay modal veya sayfası açılacak
    toast({
      title: "Ürün Detayı",
      description: `"${product.name}" ürününün detayları görüntüleniyor.`,
    });
  };

  const handleEdit = (product: Product) => {
    setProductFormModal({
      open: true,
      product: product,
    });
  };

  const handleDelete = (product: Product) => {
    setDeleteDialog({
      open: true,
      product: product,
    });
  };

  const handleAddNew = () => {
    setProductFormModal({
      open: true,
      product: null,
    });
  };

  const handleProductSubmit = async (data: ProductFormData) => {
    try {
      if (productFormModal.product) {
        // Güncelleme işlemi
        console.log('Ürün güncelleme:', data);
        // TODO: API çağrısı yapılacak
        // await productsApi.updateProduct(productFormModal.product.id, data);
      } else {
        // Yeni ürün ekleme
        console.log('Yeni ürün ekleme:', data);
        // TODO: API çağrısı yapılacak
        // await productsApi.createProduct(data);
      }
      
      // Listeyi yeniden yükle
      await loadProducts();
    } catch (error) {
      throw error; // Modal'da hata gösterilmesi için
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteDialog.product) return;
    
    try {
      setDeleting(true);
      console.log('Ürün siliniyor:', deleteDialog.product.name);
      // TODO: API çağrısı yapılacak
      // await productsApi.deleteProduct(deleteDialog.product.id);
      
      toast({
        title: "Ürün silindi!",
        description: `"${deleteDialog.product.name}" başarıyla silindi.`,
      });
      
      setDeleteDialog({ open: false, product: null });
      
      // Listeyi yeniden yükle
      await loadProducts();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Silme hatası!",
        description: "Ürün silinirken bir hata oluştu.",
      });
    } finally {
      setDeleting(false);
    }
  };

  const handleViewComments = (product: Product) => {
    navigate({ 
      to: '/admin/products/product-comments',
      search: { productId: product.id, productName: product.name }
    });
    toast({
      title: "Ürün Yorumları",
      description: `"${product.name}" ürününün yorumları görüntüleniyor.`,
    });
  };

  const handleViewVariants = (product: Product) => {
    navigate({ 
      to: '/admin/products/product-variants',
      search: { productId: product.id, productName: product.name }
    });
    toast({
      title: "Ürün Varyantları",
      description: `"${product.name}" ürününün varyantları görüntüleniyor.`,
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Ürünler yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Ürün Yönetimi</h1>
          <p className="text-muted-foreground">
            E-ticaret sitenizin ürünlerini yönetin
          </p>
        </div>
       
      </div>

      {/* Data Table */}
      <ProductsDataTable
        data={products}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAddNew={handleAddNew}
        onViewComments={handleViewComments}
        onViewVariants={handleViewVariants}
      />

      {/* Product Form Modal */}
      <ProductFormModal
        open={productFormModal.open}
        onOpenChange={(open) => setProductFormModal({ open, product: null })}
        product={productFormModal.product}
        onSubmit={handleProductSubmit}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ open, product: null })}
        title="Ürünü Sil"
        desc={
          deleteDialog.product
            ? `"${deleteDialog.product.name}" ürününü silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.`
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