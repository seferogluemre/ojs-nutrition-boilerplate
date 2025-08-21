'use client';

import { Button } from '#/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '#/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '#/components/ui/form';
import { Input } from '#/components/ui/input';
import { useToast } from '#hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { ProductVariant } from '../../types/types';

const variantFormSchema = z.object({
  name: z.string().min(2, 'Varyant adı en az 2 karakter olmalıdır'),
  sku: z.string().min(2, 'SKU en az 2 karakter olmalıdır'),
  price: z.number().min(0, 'Fiyat 0 veya daha büyük olmalıdır'),
  comparePrice: z.number().min(0).optional(),
  stock: z.number().min(0, 'Stok 0 veya daha büyük olmalıdır'),
  image: z.string().optional(),
  aroma: z.string().min(1, 'Aroma belirtilmelidir'),
  weight: z.string().min(1, 'Ağırlık belirtilmelidir'),
  type: z.string().min(1, 'Tip belirtilmelidir'),
});

export interface VariantFormData {
  name: string;
  sku: string;
  price: number;
  comparePrice?: number;
  stock: number;
  image?: string;
  attributes: {
    [key: string]: string;
  };
}

interface VariantFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  variant?: ProductVariant | null;
  productName?: string;
  onSubmit: (data: VariantFormData) => Promise<void>;
}

export function VariantFormModal({ open, onOpenChange, variant, productName, onSubmit }: VariantFormModalProps) {
  const { toast } = useToast();
  const isEditing = !!variant;

  const form = useForm<z.infer<typeof variantFormSchema>>({
    resolver: zodResolver(variantFormSchema),
    defaultValues: {
      name: variant?.name || '',
      sku: variant?.sku || '',
      price: variant?.price || 0,
      comparePrice: variant?.comparePrice || 0,
      stock: variant?.stock || 0,
      image: variant?.image || '',
      aroma: variant?.attributes?.['Aroma'] || '',
      weight: variant?.attributes?.['Ağırlık'] || '',
      type: variant?.attributes?.['Tip'] || 'Whey Protein',
    },
  });

  const handleSubmit = async (values: z.infer<typeof variantFormSchema>) => {
    try {
      const formData: VariantFormData = {
        name: values.name,
        sku: values.sku,
        price: values.price,
        comparePrice: values.comparePrice,
        stock: values.stock,
        image: values.image,
        attributes: {
          'Aroma': values.aroma,
          'Ağırlık': values.weight,
          'Tip': values.type,
        },
      };
      
      await onSubmit(formData);
      
      toast({
        title: isEditing ? "Varyant güncellendi!" : "Varyant oluşturuldu!",
        description: `"${values.name}" ${isEditing ? 'başarıyla güncellendi' : 'başarıyla oluşturuldu'}.`,
      });
      
      onOpenChange(false);
      form.reset();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Hata!",
        description: `Varyant ${isEditing ? 'güncellenirken' : 'oluşturulurken'} bir hata oluştu.`,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Varyant Düzenle' : 'Yeni Varyant Ekle'}
          </DialogTitle>
          <DialogDescription>
            {productName && (
              <span className="block mb-2">
                <strong>Ürün:</strong> {productName}
              </span>
            )}
            {isEditing 
              ? 'Varyant bilgilerini düzenleyin ve kaydedin.'
              : 'Yeni varyant bilgilerini girin ve oluşturun.'
            }
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Varyant Adı *</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Çilek Aromalı - 500g" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sku"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SKU *</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="PROT-CILEK-500" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fiyat (₺) *</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        type="number" 
                        step="0.01"
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="comparePrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Karşılaştırma Fiyatı (₺)</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        type="number" 
                        step="0.01"
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="stock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stok *</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        type="number"
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="aroma"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Aroma *</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Çilek, Vanilya, Çikolata..." />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="weight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ağırlık *</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="500g, 1kg, 2kg..." />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tip *</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Whey Protein, Casein..." />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Görsel URL</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="https://example.com/image.jpg" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                İptal
              </Button>
              <Button type="submit">
                {isEditing ? 'Güncelle' : 'Oluştur'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
