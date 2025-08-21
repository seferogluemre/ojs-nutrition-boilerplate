import { Badge } from '#/components/ui/badge';
import { Button } from '#/components/ui/button';
import { Input } from '#/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '#/components/ui/table';
import { Product } from '#features/admin/products/types/types';
import { ColumnDef, ColumnFiltersState, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, SortingState, useReactTable } from '@tanstack/react-table';
import { ArrowUpDown, ChevronLeft, ChevronRight, Edit, Eye, MessageSquare, Package, PackagePlus, Palette, Search, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface ProductsDataTableProps {
  data: Product[];
  onView: (product: Product) => void;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  onAddNew: () => void;
  onViewComments: (product: Product) => void;
  onViewVariants: (product: Product) => void;
}

const ProductStatusBadge = ({ status }: { status: 'active' | 'inactive' | 'draft' }) => {
  const variants = {
    active: { variant: 'default' as const, text: 'Aktif' },
    inactive: { variant: 'secondary' as const, text: 'Pasif' },
    draft: { variant: 'outline' as const, text: 'Taslak' },
  };
  
  const config = variants[status];
  return <Badge variant={config.variant}>{config.text}</Badge>;
};

export const ProductsDataTable = ({ 
  data, 
  onView, 
  onEdit, 
  onDelete, 
  onAddNew,
  onViewComments,
  onViewVariants 
}: ProductsDataTableProps) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const columns: ColumnDef<Product>[] = [
    {
      accessorKey: 'name',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="h-8 px-2"
          >
            <Package className="mr-2 h-4 w-4" />
            Ürün Adı
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const product = row.original;
        return (
          <div className="space-y-1">
            <div className="font-medium">{product.name}</div>
            <div className="text-xs text-muted-foreground">
              SKU: {product.sku}
            </div>
            {product.category && (
              <div className="text-xs text-muted-foreground">
                Kategori: {product.category.name}
              </div>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: 'price',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="h-8 px-2"
          >
            Fiyat
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const product = row.original;
        return (
          <div className="space-y-1">
            <div className="font-medium">₺{product.price.toFixed(2)}</div>
            {product.comparePrice && (
              <div className="text-xs text-muted-foreground line-through">
                ₺{product.comparePrice.toFixed(2)}
              </div>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: 'stock',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="h-8 px-2"
          >
            Stok
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const product = row.original;
        const isLowStock = product.stock <= 10;
        const isOutOfStock = product.stock === 0;
        
        return (
          <div className="space-y-1">
            <Badge 
              variant={isOutOfStock ? "destructive" : isLowStock ? "secondary" : "default"}
              className="font-mono font-medium"
            >
              {product.stock}
            </Badge>
            {isLowStock && !isOutOfStock && (
              <div className="text-xs text-orange-600">
                Düşük stok
              </div>
            )}
            {isOutOfStock && (
              <div className="text-xs text-red-600">
                Stok yok
              </div>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: 'status',
      header: 'Durum',
      cell: ({ row }) => {
        const status = row.getValue('status') as 'active' | 'inactive' | 'draft';
        return <ProductStatusBadge status={status} />;
      },
    },
    {
      accessorKey: 'brand',
      header: 'Marka',
      cell: ({ row }) => {
        const brand = row.getValue('brand') as string;
        return brand ? (
          <div className="text-sm">{brand}</div>
        ) : (
          <div className="text-xs text-muted-foreground">-</div>
        );
      },
    },
    {
      accessorKey: 'createdAt',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="h-8 px-2"
          >
            Oluşturulma
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const date = new Date(row.getValue('createdAt'));
        return (
          <div className="text-sm text-muted-foreground">
            {date.toLocaleDateString('tr-TR')}
          </div>
        );
      },
    },
    {
      id: 'actions',
      header: 'İşlemler',
      cell: ({ row }) => {
        const product = row.original;
        return (
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onView(product)}
              className="h-8 w-8 p-0"
              title="Görüntüle"
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(product)}
              className="h-8 w-8 p-0"
              title="Düzenle"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onViewComments(product)}
              className="h-8 w-8 p-0"
              title="Yorumlar"
            >
              <MessageSquare className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onViewVariants(product)}
              className="h-8 w-8 p-0"
              title="Varyantlar"
            >
              <Palette className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(product)}
              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
              title="Sil"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      },
      enableSorting: false,
    },
  ];

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Ürün ara..."
              value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
              onChange={(event) =>
                table.getColumn('name')?.setFilterValue(event.target.value)
              }
              className="pl-8 max-w-sm"
            />
          </div>
        </div>
        <Button onClick={onAddNew} className="flex items-center space-x-2">
          <PackagePlus className="h-4 w-4" />
          <span>Yeni Ürün</span>
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className="hover:bg-muted/50"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <Package className="h-8 w-8 text-muted-foreground" />
                    <p className="text-muted-foreground">Ürün bulunamadı.</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="text-sm text-muted-foreground">
          Toplam {table.getFilteredRowModel().rows.length} üründen{' '}
          {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}-
          {Math.min(
            (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
            table.getFilteredRowModel().rows.length
          )}{' '}
          arası gösteriliyor
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft className="h-4 w-4" />
            Önceki
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Sonraki
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
