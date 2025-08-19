"use client";

import { ConfirmDialog } from "#components/confirm-dialog";
import { Badge } from "#components/ui/badge";
import { Button } from "#components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "#components/ui/dropdown-menu";
import { Input } from "#components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "#components/ui/table";
import { EditOrderModal } from "#features/admin/orders/components/edit-order-modal";
import { OrderStatusBadge } from "#features/admin/orders/components/order-status-badge";
import type { Order } from "#features/admin/orders/types/types";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
} from "@tanstack/react-table";
import {
  ArrowUpDown,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Edit,
  Eye,
  Hash,
  MoreHorizontal,
  Package2,
  Search,
  ShoppingCart,
  Trash2
} from "lucide-react";
import { useState } from "react";

interface OrdersDataTableProps {
  data: Order[];
  onView: (order: Order) => void;
  onEdit: (order: Order) => void;
  onDelete: (order: Order) => void;
}

export const OrdersDataTable = ({
  data,
  onView,
  onEdit,
  onDelete,
}: OrdersDataTableProps) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [deletingOrder, setDeletingOrder] = useState<Order | null>(null);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("tr-TR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("tr-TR", {
      style: "currency",
      currency: "TRY",
      minimumFractionDigits: 2,
    }).format(price / 100);
  };

  const columns: ColumnDef<Order>[] = [
    {
      accessorKey: "firstProduct.primary_photo_url",
      header: "",
      cell: ({ row }) => {
        const order = row.original;
        return (
          <div className="flex items-center justify-center">
            <img
              src={
                order.firstProduct.primary_photo_url ||
                "/placeholder.svg?height=48&width=48&query=product"
              }
              alt={order.firstProduct.name}
              className="h-12 w-12 rounded-lg border object-cover shadow-sm"
            />
          </div>
        );
      },
      enableSorting: false,
    },
    {
      accessorKey: "orderNumber",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-8 px-2"
          >
            <Hash className="mr-2 h-4 w-4" />
            Sipariş No
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="font-mono text-sm font-medium">
          {row.getValue("orderNumber")}
        </div>
      ),
    },
    {
      accessorKey: "firstProduct.name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-8 px-2"
          >
            <Package2 className="mr-2 h-4 w-4" />
            Ürün Bilgisi
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const order = row.original;
        return (
          <div className="space-y-1">
            <p className="text-sm font-medium leading-tight">
              {order.firstProduct.name}
            </p>
            <p className="text-xs leading-tight text-muted-foreground">
              {order.productDisplayText}
            </p>
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Durum",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return <OrderStatusBadge status={status} />;
      },
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-8 px-2"
          >
            <Calendar className="mr-2 h-4 w-4" />
            Tarih
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const date = row.getValue("createdAt") as string;
        return (
          <div className="text-sm text-muted-foreground">
            {formatDate(date)}
          </div>
        );
      },
    },
    {
      accessorKey: "itemCount",
      header: "Adet",
      cell: ({ row }) => {
        const count = row.getValue("itemCount") as number;
        return (
          <Badge variant="secondary" className="font-mono font-medium">
            {count}
          </Badge>
        );
      },
    },
    {
      accessorKey: "subtotal",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-8 px-2"
          >
            Tutar
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const amount = row.getValue("subtotal") as number;
        return (
          <div className="font-semibold text-foreground">
            {formatPrice(amount)}
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => {
        const order = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Menüyü aç</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onView(order)}>
                <Eye className="mr-2 h-4 w-4" />
                Görüntüle
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setEditingOrder(order)}>
                <Edit className="mr-2 h-4 w-4" />
                Düzenle
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setDeletingOrder(order)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Sil
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
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
        <div className="flex px-3 items-center space-x-2">
          <div className="relative ">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Sipariş ara..."
              value={
                (table.getColumn("orderNumber")?.getFilterValue() as string) ??
                ""
              }
              onChange={(event) =>
                table
                  .getColumn("orderNumber")
                  ?.setFilterValue(event.target.value)
              }
              className="max-w-sm pl-8"
            />
          </div>
        </div>
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
                            header.getContext(),
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
                  data-state={row.getIsSelected() && "selected"}
                  className="hover:bg-muted/50"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
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
                    <ShoppingCart className="h-8 w-8 text-muted-foreground" />
                    <p className="text-muted-foreground">Sipariş bulunamadı.</p>
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
          {table.getFilteredRowModel().rows.length} siparişten{" "}
          {table.getState().pagination.pageIndex *
            table.getState().pagination.pageSize +
            1}
          -
          {Math.min(
            (table.getState().pagination.pageIndex + 1) *
              table.getState().pagination.pageSize,
            table.getFilteredRowModel().rows.length,
          )}{" "}
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

      {/* Modals */}
      {editingOrder && (
        <EditOrderModal
          order={editingOrder}
          open={!!editingOrder}
          onOpenChange={() => setEditingOrder(null)}
          onSave={(updatedOrder) => {
            onEdit(updatedOrder);
            setEditingOrder(null);
          }}
        />
      )}

      {deletingOrder && (
        <ConfirmDialog
          open={!!deletingOrder}
          onOpenChange={() => setDeletingOrder(null)}
          title="Sipariş Sil"
          desc="Siparişi silmek istediğinize emin misiniz?"
          cancelBtnText="İptal"
          confirmText="Sil"
          destructive
          onConfirm={() => {
            onDelete(deletingOrder);
            setDeletingOrder(null);
          }}
        />
      )}
    </div>
  );
};
