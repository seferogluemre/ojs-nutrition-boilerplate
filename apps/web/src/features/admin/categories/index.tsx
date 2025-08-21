'use client';

import { ConfirmDialog } from '#components/confirm-dialog';
import { CategoriesDataTable } from '#components/data-table/categories-data-table';
import { useToast } from '#hooks/use-toast';
import { useEffect, useState } from 'react';
import { CategoryFormModal } from './components/category-form-modal';
import { categoriesApi } from './data/data';
import { Category, CategoryFormData } from './types/types';

export function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await categoriesApi.getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Kategoriler yüklenirken hata:', error);
      toast({
        variant: "destructive",
        title: "Yükleme hatası!",
        description: "Kategoriler yüklenirken bir hata oluştu. Lütfen sayfayı yenileyin.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleView = (category: Category) => {
    console.log('Kategori görüntüle:', category);
    // TODO: Kategori detay modal veya sayfası açılacak
  };

  const handleEdit = (category: Category) => {
    console.log('Kategori düzenleme modalı açılıyor:', category.name);
    setEditingCategory(category);
    setFormModalOpen(true);
  };

  const handleDelete = (category: Category) => {
    setDeletingCategory(category);
  };

  const handleAddNew = () => {
    setEditingCategory(null);
    setFormModalOpen(true);
  };

  const handleSaveCategory = async (categoryData: CategoryFormData) => {
    try {
      if (editingCategory) {
        // Düzenleme
        const updatedCategory = await categoriesApi.updateCategory(editingCategory.id, categoryData);
        setCategories(prev => 
          prev.map(cat => cat.id === editingCategory.id ? updatedCategory : cat)
        );
        toast({
          title: "Kategori güncellendi!",
          description: `"${updatedCategory.name}" kategorisi başarıyla güncellendi.`,
        });
      } else {
        // Yeni ekleme
        const newCategory = await categoriesApi.createCategory(categoryData);
        setCategories(prev => [...prev, newCategory]);
        toast({
          title: "Kategori eklendi!",
          description: `"${newCategory.name}" kategorisi başarıyla oluşturuldu.`,
        });
      }
    } catch (error) {
      console.error('Kategori kaydedilirken hata:', error);
      toast({
        variant: "destructive",
        title: "Hata!",
        description: "Kategori kaydedilirken bir hata oluştu. Lütfen tekrar deneyin.",
      });
    }
  };

  const handleModalClose = () => {
    setFormModalOpen(false);
    setEditingCategory(null);
  };

  const confirmDelete = async () => {
    if (!deletingCategory) return;

    try {
      await categoriesApi.deleteCategory(deletingCategory.id);
      setCategories(prev => prev.filter(cat => cat.id !== deletingCategory.id));
      toast({
        title: "Kategori silindi!",
        description: `"${deletingCategory.name}" kategorisi başarıyla silindi.`,
      });
      setDeletingCategory(null);
    } catch (error) {
      console.error('Kategori silinirken hata:', error);
      toast({
        variant: "destructive",
        title: "Hata!",
        description: "Kategori silinirken bir hata oluştu. Lütfen tekrar deneyin.",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Kategoriler yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Kategori Yönetimi</h1>
          <p className="text-muted-foreground">
            E-ticaret sitenizin kategorilerini yönetin
          </p>
        </div>
      </div>

      {/* Data Table */}
      <CategoriesDataTable
        data={categories}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAddNew={handleAddNew}
      />

      {/* Category Form Modal */}
      <CategoryFormModal
        open={formModalOpen}
        onOpenChange={handleModalClose}
        category={editingCategory || undefined}
        categories={categories}
        onSave={handleSaveCategory}
        mode={editingCategory ? 'edit' : 'create'}
      />

      {/* Delete Confirmation Dialog */}
      {deletingCategory && (
        <ConfirmDialog
          open={!!deletingCategory}
          onOpenChange={() => setDeletingCategory(null)}
          title="Kategori Sil"
          desc={`"${deletingCategory.name}" kategorisini silmek istediğinize emin misiniz? Bu işlem geri alınamaz.`}
          cancelBtnText="İptal"
          confirmText="Sil"
          destructive
          handleConfirm={confirmDelete}
        />
      )}
    </div>
  );
}