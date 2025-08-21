import { Button } from '#/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '#/components/ui/dialog';
import { Input } from '#/components/ui/input';
import { Label } from '#/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '#/components/ui/select';
import { Switch } from '#/components/ui/switch';
import { useEffect, useState } from 'react';
import { Category, CategoryFormData } from '../types/types';

interface CategoryFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category?: Category;
  categories: Category[]; // Ana kategoriler için
  onSave: (categoryData: CategoryFormData) => void;
  mode: 'create' | 'edit';
}

export const CategoryFormModal = ({ open, onOpenChange, category, categories, onSave, mode }: CategoryFormModalProps) => {
  const [formData, setFormData] = useState<CategoryFormData & { isActive: boolean }>({
    name: '',
    slug: '',
    parentId: '',
    order: 0,
    isActive: true
  });

  useEffect(() => {
    if (category && mode === 'edit') {
      setFormData({
        name: category.name,
        slug: category.slug,
        parentId: category.parentId || '',
        order: category.order,
        isActive: category.isActive
      });
    } else {
      setFormData({
        name: '',
        slug: '',
        parentId: '',
        order: 0,
        isActive: true
      });
    }
  }, [category, mode, open]);

  const handleNameChange = (name: string) => {
    const slug = name
      .toLowerCase()
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ı/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c')
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .trim();

    setFormData({ ...formData, name, slug });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { isActive, ...categoryData } = formData;
    onSave({
      ...categoryData,
      parentId: categoryData.parentId || undefined
    });
    onOpenChange(false);
  };

  // Ana kategorileri filtrele (kendisini ve alt kategorilerini hariç tut)
  const parentOptions = categories.filter(cat => {
    if (mode === 'edit' && category) {
      return cat.id !== category.id && !cat.parentId;
    }
    return !cat.parentId;
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Yeni Kategori Ekle' : 'Kategoriyi Düzenle'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'create' 
              ? 'Yeni kategori bilgilerini girin.' 
              : 'Kategori bilgilerini güncelleyin.'
            }
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Kategori Adı</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Örn: Elektronik"
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="Otomatik oluşturulur"
                required
              />
              <p className="text-xs text-muted-foreground">
                URL'de kullanılacak benzersiz tanımlayıcı
              </p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="parentId">Ana Kategori</Label>
              <Select 
                value={formData.parentId || "none"} 
                onValueChange={(value) => setFormData({ ...formData, parentId: value === "none" ? "" : value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Ana kategori seçin (isteğe bağlı)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Ana Kategori Olarak Ekle</SelectItem>
                  {parentOptions.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="order">Sıra Numarası</Label>
              <Input
                id="order"
                type="number"
                min="0"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                placeholder="0"
              />
              <p className="text-xs text-muted-foreground">
                Kategorinin gösterim sırası (0 = en üstte)
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
              />
              <Label htmlFor="isActive">Aktif</Label>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              İptal
            </Button>
            <Button type="submit">
              {mode === 'create' ? 'Ekle' : 'Güncelle'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
