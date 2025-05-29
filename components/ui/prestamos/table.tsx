"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { formatCurrency, formatDateToLocal } from "@/app/lib/utils";
import { fetchFilteredPrestamos } from "@/app/lib/data";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { DeleteLoan, EditLoan } from "./buttons";

export default function PrestamosTable({
  query,
  currentPage,
  sortBy,
  sortOrder,
  reloadFlag2,
}: {
  query: string;
  currentPage: number;
  sortBy: string;
  sortOrder: string;
  reloadFlag2: boolean; // Añadido para forzar recarga
}) {
  const [products, setProducts] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0); // Nuevo estado para total de registros
  const [reloadFlag, setReloadFlag] = useState(false);

  const searchParams = useSearchParams();

  useEffect(() => {
    const loadData = async () => {
      const { products, totalPages, totalItems } = await fetchFilteredPrestamos(
        query,
        currentPage,
        sortBy,
        sortOrder as "asc" | "desc"
      );
      setProducts(products);
      setTotalPages(totalPages);
      setTotalItems(totalItems || 0); // Asegura valor si viene null/undefined
    };
    loadData();
  }, [query, currentPage, sortBy, sortOrder, reloadFlag, reloadFlag2]); // Añadido reloadFlag2 para forzar recarga

  const reloadData = () => setReloadFlag((prev) => !prev);
  const startIndex = (currentPage - 1) * 10 + 1; // El primer elemento de la página actual
  const endIndex = Math.min(currentPage * 10, totalItems); // El último elemento de la página actual

  const updateSearchParams = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(key, value);
    // usar claves específicas para prestamos
    if (key === "page") {
      params.set("pagePrestamos", value);
    } else if (key === "sortBy") {
      params.set("sortByPrestamos", value);
      params.set("pagePrestamos", "1"); // reset page when sorting
    } else if (key === "sortOrder") {
      params.set("sortOrderPrestamos", value);
      params.set("pagePrestamos", "1"); // reset page when sorting
    }
  };

  const toggleSort = (column: string) => {
    const isSameColumn = sortBy === column;
    const newOrder = isSameColumn && sortOrder === "asc" ? "desc" : "asc";
    updateSearchParams("sortBy", column);
    updateSearchParams("sortOrder", newOrder);
  };

  const goToPage = (page: number) =>
    updateSearchParams("page", page.toString());

  return (
    <div className="mt-6 space-y-4">
      <div className="rounded-lg border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              {/* <TableHead
                className="cursor-pointer"
                onClick={() => toggleSort("id_prestamo")}
              >
                ID{" "}
                {sortBy === "id_prestamo" &&
                  (sortOrder === "asc" ? "🔼" : "🔽")}
              </TableHead> */}
              <TableHead
                className="cursor-pointer"
                onClick={() => toggleSort("subtotal_prestamo")}
              >
                SubTotal Préstamo{" "}
                {sortBy === "subtotal_prestamo" &&
                  (sortOrder === "asc" ? "🔼" : "🔽")}
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => toggleSort("interes")}
              >
                Interés{" "}
                {sortBy === "interes" && (sortOrder === "asc" ? "🔼" : "🔽")}
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => toggleSort("total_prestamo")}
              >
                Total Préstamo{" "}
                {sortBy === "total_prestamo" &&
                  (sortOrder === "asc" ? "🔼" : "🔽")}
              </TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length > 0 ? (
              products.map((product) => (
                <TableRow key={product.id_prestamo}>
                  {/* <TableCell>{product.id_prestamo}</TableCell> */}
                  <TableCell>
                    {formatCurrency(product.subtotal_prestamo)}
                  </TableCell>
                  <TableCell>{product.interes}%</TableCell>
                  <TableCell>
                    {formatCurrency(product.total_prestamo)}
                  </TableCell>
                  <TableCell>{formatDateToLocal(product.created_at)}</TableCell>
                  <TableCell>
                    <EditLoan loan={product} onUpdated={reloadData} />
                    <DeleteLoan
                      loanId={product.id_prestamo}
                      onDeleted={reloadData} // función para recargar los productos
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6">
                  No se encontraron resultados
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Nuevo: Mostrar total de registros */}
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
          <div className="flex items-center justify-center px-4 font-medium">
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
    </div>
  );
}
