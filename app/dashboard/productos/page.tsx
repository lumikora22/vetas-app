"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import Search from "@/components/ui/search";
import Table from "@/components/ui/products/table";
import TablePrestamos from "@/components/ui/prestamos/table";
import { CreateLoan, CreateProduct } from "@/components/ui/products/buttons";

export default function Page() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [reloadFlag, setReloadFlag] = useState(false);

  const query = searchParams.get("query") || "";

  const currentPageProductos = Number(searchParams.get("pageProductos") || 1);
  const sortByProductos =
    searchParams.get("sortByProductos") || "name_articulo";
  const sortOrderProductos = searchParams.get("sortOrderProductos") || "asc";

  // para tabla prestamos
  const currentPagePrestamos = Number(searchParams.get("pagePrestamos") || 1);
  const sortByPrestamos = searchParams.get("sortByPrestamos") || "id_prestamo";
  const sortOrderPrestamos = searchParams.get("sortOrderPrestamos") || "asc";

  const [productoSearch, setProductoSearch] = useState(query);
  const [prestamoSearch, setPrestamoSearch] = useState("");

  const handleSearch = (type: "productos" | "prestamos", value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1");
    if (type === "productos") {
      setProductoSearch(value);
      params.set("query", value);
    } else {
      setPrestamoSearch(value);
      // puedes usar otra query si estás usando otro componente
      params.set("prestamoQuery", value);
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleCreateSuccess = () => {
    setReloadFlag((prev) => !prev);
  };
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {/* Panel de Productos */}
      <div className="w-full">
        <div className="flex w-full items-center justify-between">
          <h1 className="text-2xl">Productos</h1>
        </div>

        <div className="mt-4 flex items-center justify-between gap-2 md:mt-6">
          <Search
            placeholder="Buscar productos..."
            onChange={(e) => handleSearch("productos", e.target.value)}
            defaultValue={productoSearch}
          />

          <div className="flex items-center gap-2">
            <CreateProduct onSuccess={handleCreateSuccess}></CreateProduct>
          </div>
        </div>

        <Suspense
          key={
            "productos-" +
            productoSearch +
            currentPageProductos +
            sortByProductos +
            sortOrderProductos
          }
        >
          <Table
            query={productoSearch}
            currentPage={currentPageProductos}
            sortBy={sortByProductos}
            sortOrder={sortOrderProductos}
            reloadFlag2={reloadFlag}
          />
        </Suspense>
      </div>

      {/* Panel de Préstamos */}
      <div className="w-full">
        <div className="flex w-full items-center justify-between">
          <h1 className="text-2xl">Préstamos</h1>
        </div>

        <div className="mt-4 flex items-center justify-between gap-2 md:mt-6">
          <Search
            placeholder="Buscar préstamos..."
            onChange={(e) => handleSearch("prestamos", e.target.value)}
            defaultValue={prestamoSearch}
          />
          <div className="flex items-center gap-2">
            <CreateLoan onSuccess={handleCreateSuccess}></CreateLoan>
          </div>
        </div>

        <Suspense
          key={
            "prestamos-" +
            prestamoSearch +
            currentPagePrestamos +
            sortByPrestamos +
            sortOrderPrestamos
          }
        >
          <TablePrestamos
            query={prestamoSearch}
            currentPage={currentPagePrestamos}
            sortBy={sortByPrestamos}
            sortOrder={sortOrderPrestamos}
            reloadFlag2={reloadFlag} // Prop para recargar los préstamos
          />
        </Suspense>
      </div>
    </div>
  );
}
