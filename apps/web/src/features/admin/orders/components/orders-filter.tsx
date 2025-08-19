"use client"

import { Button } from "#components/ui/button"
import { Input } from "#components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "#components/ui/select"
import { Filter, Search, X } from "lucide-react"
import type { OrderFilters as OrderFiltersType, OrderStatus } from "../types/types"

interface OrderFiltersProps {
  filters: OrderFiltersType
  onFiltersChange: (filters: OrderFiltersType) => void
  onClearFilters: () => void
}

const statusOptions: { value: OrderStatus; label: string }[] = [
  { value: "PENDING", label: "Beklemede" },
  { value: "PROCESSING", label: "İşleniyor" },
  { value: "SHIPPED", label: "Kargoda" },
  { value: "DELIVERED", label: "Teslim Edildi" },
  { value: "CANCELLED", label: "İptal Edildi" },
  { value: "REFUNDED", label: "İade Edildi" },
]

export function OrderFiltersComponent({ filters, onFiltersChange, onClearFilters }: OrderFiltersProps) {
  const hasActiveFilters = filters.status || filters.search || filters.dateFrom || filters.dateTo

  return (
    <div className="flex flex-col gap-4 p-4 bg-card rounded-lg border">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium text-sm">Filtreler</span>
        </div>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={onClearFilters} className="h-8 px-2 text-xs">
            <X className="h-3 w-3 mr-1" />
            Temizle
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Sipariş ara..."
            value={filters.search || ""}
            onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
            className="pl-9"
          />
        </div>

        <Select
          value={filters.status || ""}
          onValueChange={(value) => onFiltersChange({ ...filters, status: value as OrderStatus })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Durum seçin" />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input
          type="date"
          placeholder="Başlangıç tarihi"
          value={filters.dateFrom || ""}
          onChange={(e) => onFiltersChange({ ...filters, dateFrom: e.target.value })}
        />

        <Input
          type="date"
          placeholder="Bitiş tarihi"
          value={filters.dateTo || ""}
          onChange={(e) => onFiltersChange({ ...filters, dateTo: e.target.value })}
        />
      </div>
    </div>
  )
}

export { OrderFiltersComponent as OrderFilters }

