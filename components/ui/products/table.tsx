"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { formatCurrency, formatDateToLocal } from "@/app/lib/utils";
import { fetchFilteredProducts } from "@/app/lib/data";
import { useEffect, useState } from "react";
import { DeleteProduct, EditProduct } from "./buttons";
import { Button } from "../button";

export default function Table({
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

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const loadData = async () => {
      const { products, totalPages, totalItems } = await fetchFilteredProducts(
        query,
        currentPage,
        sortBy,
        sortOrder as "asc" | "desc"
      );
      setProducts(products);
      setTotalPages(totalPages);
      setTotalItems(totalItems);
    };
    loadData();
  }, [query, currentPage, sortBy, sortOrder, reloadFlag, reloadFlag2]); // Añadido reloadFlag2 para forzar recarga

  const reloadData = () => setReloadFlag((prev) => !prev);

  const startIndex = (currentPage - 1) * 10 + 1; // El primer elemento de la página actual
  const endIndex = Math.min(currentPage * 10, totalItems); // El último elemento de la página actual

  const updateSearchParams = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(key, value);
    if (key === "page") {
      params.set("pageProductos", value);
    } else if (key === "sortBy") {
      params.set("sortByProductos", value);
      params.set("pageProductos", "1"); // reset page when sorting
    } else if (key === "sortOrder") {
      params.set("sortOrderProductos", value);
      params.set("pageProductos", "1"); // reset page when sorting
    }

    router.push(`${pathname}?${params.toString()}`);
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
      <div className="rounded-lg border bg-white overflow-x-auto">
        <table className="min-w-full text-sm text-left text-gray-900">
          <thead className="bg-gray-100 text-sm font-medium">
            <tr>
              <th
                className="cursor-pointer px-4 py-4"
                onClick={() => toggleSort("name_articulo")}
              >
                Nombre{" "}
                {sortBy === "name_articulo" &&
                  (sortOrder === "asc" ? "🔼" : "🔽")}
              </th>
              <th
                className="cursor-pointer px-4 py-4"
                onClick={() => toggleSort("cantidad_articulo")}
              >
                Cantidad{" "}
                {sortBy === "cantidad_articulo" &&
                  (sortOrder === "asc" ? "🔼" : "🔽")}
              </th>
              <th
                className="cursor-pointer px-4 py-4"
                onClick={() => toggleSort("precio_articulo")}
              >
                Precio{" "}
                {sortBy === "precio_articulo" &&
                  (sortOrder === "asc" ? "🔼" : "🔽")}
              </th>
              <th className="px-4 py-4">Fecha</th>
              <th className="px-4 py-4">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.length > 0 ? (
              products.map((product) => (
                <tr key={product.id_articulo} className="border-b">
                  <td className="px-4 py-3">{product.name_articulo}</td>
                  <td className="px-4 py-3">{product.cantidad_articulo}</td>
                  <td className="px-4 py-3">
                    {formatCurrency(product.precio_articulo)}
                  </td>
                  <td className="px-4 py-3">
                    {formatDateToLocal(product.created_at)}
                  </td>
                  <td className="px-4 py-3 space-x-2">
                    <EditProduct product={product} onSuccess={reloadData} />
                    <DeleteProduct
                      id={product.id_articulo}
                      name={product.name_articulo}
                      onDeleted={reloadData} // función para recargar los productos
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center py-6">
                  No se encontraron resultados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Información de resultados + paginación */}
      <div className="flex justify-between items-center">
        {/* Total de resultados */}
        <div className="text-sm text-gray-500">
          Mostrando {startIndex} - {endIndex} de {totalItems} resultados
        </div>

        {/* Paginación */}
        <div className="flex gap-4">
          <button
            disabled={currentPage <= 1}
            onClick={() => goToPage(currentPage - 1)}
            className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            Anterior
          </button>
          <div className="flex items-center justify-center px-4 text-sm font-medium">
            {currentPage} / {totalPages}
          </div>
          <button
            disabled={currentPage >= totalPages}
            onClick={() => goToPage(currentPage + 1)}
            className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
}
