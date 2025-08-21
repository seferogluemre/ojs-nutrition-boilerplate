'use client';

import { ProductsDataTable } from '#components/data-table/products-data-table';
import { Button } from '#components/ui/button';
import { useToast } from '#hooks/use-toast';
import { useNavigate } from '@tanstack/react-router';
import { MessageSquare, Palette } from 'lucide-react';
import { useEffect, useState } from 'react';
import { productsApi } from './data/data';
import { Product } from './types/types';

export function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
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
    console.log('Ürün düzenleme modalı açılıyor:', product.name);
    // TODO: Ürün düzenleme modal veya sayfası açılacak
    toast({
      title: "Ürün Düzenleme",
      description: `"${product.name}" ürünü düzenleme modunda açılıyor.`,
    });
  };

  const handleDelete = (product: Product) => {
    console.log('Ürün silme onayı:', product.name);
    // TODO: Silme onay modalı açılacak
    toast({
      title: "Ürün Silme",
      description: `"${product.name}" ürününü silmek için onay bekleniyor.`,
    });
  };

  const handleAddNew = () => {
    console.log('Yeni ürün ekleme modalı açılıyor');
    // TODO: Yeni ürün ekleme modal veya sayfası açılacak
    toast({
      title: "Yeni Ürün",
      description: "Yeni ürün ekleme formu açılıyor.",
    });
  };

  const handleViewComments = (product: Product) => {
    navigate({ to: '/admin/products/product-comments' });
    toast({
      title: "Ürün Yorumları",
      description: `"${product.name}" ürününün yorumları görüntüleniyor.`,
    });
  };

  const handleViewVariants = (product: Product) => {
    navigate({ to: '/admin/products/product-variants' });
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
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            onClick={() => navigate({ to: '/admin/products/product-comments' })}
            className="flex items-center space-x-2"
          >
            <MessageSquare className="h-4 w-4" />
            <span>Ürün Yorumları</span>
          </Button>
          <Button 
            variant="outline" 
            onClick={() => navigate({ to: '/admin/products/product-variants' })}
            className="flex items-center space-x-2"
          >
            <Palette className="h-4 w-4" />
            <span>Ürün Varyantları</span>
          </Button>
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
    </div>
  );
}