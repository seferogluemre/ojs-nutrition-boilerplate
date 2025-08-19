"use client"

import { ConfirmDialog } from "#components/confirm-dialog.js"
import { Button } from "#components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "#components/ui/dropdown-menu"
import { Input } from "#components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "#components/ui/table"
import { EditParcelModal } from "#features/admin/parcels/components/edit-parcel-modal.js"
import { ParcelStatusBadge } from "#features/admin/parcels/components/parcel-status-badge.js"
import {
    type ColumnDef,
    type ColumnFiltersState,
    type SortingState,
    type VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"
import {
    Calendar,
    ChevronLeft,
    ChevronRight,
    Edit,
    Eye,
    MoreHorizontal,
    Package,
    Search,
    Trash2,
    User,
} from "lucide-react"
import { useState } from "react"
import type { Parcel } from "../types/parcel-types"

interface ParcelsDataTableProps {
  data: Parcel[]
}

export function ParcelsDataTable({ data }: ParcelsDataTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})

  // Modal states
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedParcel, setSelectedParcel] = useState<Parcel | null>(null)

  const handleEdit = (parcel: Parcel) => {
    setSelectedParcel(parcel)
    setEditModalOpen(true)
  }

  const handleDelete = (parcel: Parcel) => {
    setSelectedParcel(parcel)
    setDeleteDialogOpen(true)
  }

  const handleView = (parcel: Parcel) => {
    console.log("Viewing parcel:", parcel)
  }

  const handleSaveParcel = (updatedParcel: Parcel) => {
    console.log("Saving parcel:", updatedParcel)
  }

  const handleConfirmDelete = (parcel: Parcel) => {
    console.log("Deleting parcel:", parcel)
  }

  const columns: ColumnDef<Parcel>[] = [
    {
      accessorKey: "trackingNumber",
      header: "Takip Numarası",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Package className="h-4 w-4 text-muted-foreground" />
          <span className="font-mono text-sm">{row.getValue("trackingNumber")}</span>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Durum",
      cell: ({ row }) => <ParcelStatusBadge status={row.getValue("status")} />,
    },
    {
      accessorKey: "courier",
      header: "Kurye",
      cell: ({ row }) => {
        const courier = row.getValue("courier") as Parcel["courier"]
        return (
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <span>
              {courier.firstName} {courier.lastName}
            </span>
          </div>
        )
      },
    },
    {
      accessorKey: "estimatedDelivery",
      header: "Tahmini Teslimat",
      cell: ({ row }) => {
        const date = new Date(row.getValue("estimatedDelivery"))
        return (
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>
              {date.toLocaleDateString("tr-TR")}{" "}
              {date.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}
            </span>
          </div>
        )
      },
    },
    {
      accessorKey: "createdAt",
      header: "Oluşturulma",
      cell: ({ row }) => {
        const date = new Date(row.getValue("createdAt"))
        return <span className="text-sm text-muted-foreground">{date.toLocaleDateString("tr-TR")}</span>
      },
    },
    {
      id: "actions",
      header: "İşlemler",
      cell: ({ row }) => {
        const parcel = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Menüyü aç</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleView(parcel)}>
                <Eye className="mr-2 h-4 w-4" />
                Görüntüle
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleEdit(parcel)}>
                <Edit className="mr-2 h-4 w-4" />
                Düzenle
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDelete(parcel)} className="text-red-600">
                <Trash2 className="mr-2 h-4 w-4" />
                Sil
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Takip numarası ile ara..."
            value={(table.getColumn("trackingNumber")?.getFilterValue() as string) ?? ""}
            onChange={(event) => table.getColumn("trackingNumber")?.setFilterValue(event.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Sonuç bulunamadı.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} / {table.getFilteredRowModel().rows.length} satır seçildi.
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
          <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            Sonraki
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <EditParcelModal
        parcel={selectedParcel}
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        onSave={handleSaveParcel}
      />

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Kargo Sil"
        desc="Kargoyu silmek istediğinize emin misiniz?"
        cancelBtnText="İptal"
        confirmText="Sil"
        destructive
        handleConfirm={() => handleConfirmDelete(selectedParcel)}
      />
    </div>
  )
}
