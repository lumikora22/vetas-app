"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import ShowVenta from "./show-venta";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Eye, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { formatCurrency } from "@/app/lib/utils";
import { DeleteVenta, EditVentaForm } from "./buttons";

export default function SalesTable({
  ventas,
  colaborators,
  customers,
  products,
  lastFolio,
}: {
  ventas: any[];
  colaborators: any[];
  customers: any[];
  products: any[];
  lastFolio: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [searchValue, setSearchValue] = useState("");
  const [selectedVenta, setSelectedVenta] = useState<any | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [reloadFlag, setReloadFlag] = useState(false);

  // Parámetros de URL controlados
  const currentPage = parseInt(searchParams.get("pageVentas") || "1");
  const sortBy = searchParams.get("sortByVentas") || "folio_contrato";
  const sortOrder = searchParams.get("sortOrderVentas") || "asc";

  // Actualizar parámetros en URL
  const updateSearchParams = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (key === "page") {
      params.set("pageVentas", value);
    } else if (key === "sortBy") {
      params.set("sortByVentas", value);
      params.set("pageVentas", "1");
    } else if (key === "sortOrder") {
      params.set("sortOrderVentas", value);
      params.set("pageVentas", "1");
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const toggleSort = (column: string) => {
    const isSame = sortBy === column;
    const newOrder = isSame && sortOrder === "asc" ? "desc" : "asc";
    updateSearchParams("sortBy", column);
    updateSearchParams("sortOrder", newOrder);
  };

  const goToPage = (page: number) =>
    updateSearchParams("page", page.toString());

  // Filtrar ventas
  const filteredVentas = useMemo(() => {
    return ventas.filter((venta) => {
      const name = venta.Cliente?.name_cliente?.toLowerCase() || "";
      const folio = venta.folio_contrato?.toLowerCase() || "";
      return (
        name.includes(searchValue.toLowerCase()) ||
        folio.includes(searchValue.toLowerCase())
      );
    });
  }, [ventas, searchValue]);

  // Ordenar ventas
  const sortedVentas = useMemo(() => {
    return [...filteredVentas].sort((a, b) => {
      const aVal = a[sortBy];
      const bVal = b[sortBy];
      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredVentas, sortBy, sortOrder]);

  // Paginación
  const itemsPerPage = 10;
  const totalItems = sortedVentas.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedVentas = sortedVentas.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, totalItems);

  const handleVerDetalles = (venta: any) => {
    if (
      !selectedVenta ||
      selectedVenta.folio_contrato !== venta.folio_contrato
    ) {
      setSelectedVenta(venta);
      setShowModal(true);
    }
  };

  const reloadData = () => setReloadFlag((prev) => !prev);

  return (
    <div className="space-y-4">
      <div className="flex items-center py-4">
        <Input
          placeholder="Buscar por Folio o Nombre de Cliente..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="rounded-lg border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                className="cursor-pointer"
                onClick={() => toggleSort("folio_contrato")}
              >
                Folio{" "}
                {sortBy === "folio_contrato" &&
                  (sortOrder === "asc" ? "🔼" : "🔽")}
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => toggleSort("dias_pago")}
              >
                Día de Pago{" "}
                {sortBy === "dias_pago" && (sortOrder === "asc" ? "🔼" : "🔽")}
              </TableHead>
              <TableHead>Cobro Semana</TableHead>
              <TableHead>Fecha de Inicio</TableHead>
              <TableHead>Fecha de Fin</TableHead>
              <TableHead>Semanas a Pagar</TableHead>
              <TableHead>Enganche</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedVentas.length ? (
              paginatedVentas.map((venta) => (
                <TableRow key={venta.folio_contrato}>
                  <TableCell>{venta.folio_contrato}</TableCell>
                  <TableCell>{venta.dias_pago}</TableCell>
                  <TableCell>{formatCurrency(venta.cobro_pago)}</TableCell>
                  <TableCell>{venta.start_date}</TableCell>
                  <TableCell>{venta.end_date}</TableCell>
                  <TableCell>{venta.cantidad_semanas_pago}</TableCell>
                  <TableCell>{formatCurrency(venta.enganche)}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleVerDetalles(venta)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <EditVentaForm
                      venta={venta} // objeto de la venta actual
                      colaborators={colaborators}
                      customers={customers}
                      products={products}
                      onSubmit={reloadData}
                    />
                    <DeleteVenta
                      loanId={venta.folio_contrato}
                      onDeleted={reloadData}
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-6">
                  No se encontraron resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-between items-center text-sm text-gray-600">
        <div>
          Mostrando {startIndex} - {endIndex} de {totalItems} resultados
        </div>
        <div className="flex gap-4">
          <Button
            variant="outline"
            disabled={currentPage <= 1}
            onClick={() => goToPage(currentPage - 1)}
          >
            Anterior
          </Button>
          <div className="px-4 font-medium">
            {currentPage} / {totalPages}
          </div>
          <Button
            variant="outline"
            disabled={currentPage >= totalPages}
            onClick={() => goToPage(currentPage + 1)}
          >
            Siguiente
          </Button>
        </div>
      </div>

      {showModal && selectedVenta && (
        <ShowVenta sale={selectedVenta} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
}
