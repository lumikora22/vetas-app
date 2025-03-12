"use client";
import * as React from "react";
import {
  ColumnDef,
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
} from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ShowVenta from "./show-venta";
import { flexRender } from "@tanstack/react-table";

export default function SalesTable({ ventas }: { ventas: any[] }) {
  console.log(ventas);
  const [searchValue, setSearchValue] = React.useState("");
  const [selectedVenta, setSelectedVenta] = React.useState<any | null>(null);
  const [showModal, setShowModal] = React.useState(false);

  // 🔹 Definir columnas de la tabla
  const columns: ColumnDef<any>[] = React.useMemo(
    () => [
      { accessorKey: "folio_contrato", header: "Folio" },
      { accessorKey: "dias_pago", header: "Día de Pago" },
      { accessorKey: "cobro_pago", header: "Cobro Semana" },
      { accessorKey: "start_date", header: "Fecha de Inicio" },
      { accessorKey: "end_date", header: "Fecha de Fin" },
      { accessorKey: "cantidad_semanas_pago", header: "Semanas a Pagar" },
      { accessorKey: "enganche", header: "Enganche" },
      {
        id: "actions",
        header: "Acciones",
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleVerDetalles(row.original)}>
                Ver detalles de Venta
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    []
  );

  // 🔹 Filtrar ventas por folio o nombre de cliente
  const filteredVentas = React.useMemo(
    () =>
      ventas.filter((venta) => {
        const nameMatch = venta.Cliente?.name_cliente
          ?.toLowerCase()
          .includes(searchValue.toLowerCase());
        const folioMatch = venta.folio_contrato
          ?.toLowerCase()
          .includes(searchValue.toLowerCase());
        return nameMatch || folioMatch;
      }),
    [ventas, searchValue]
  );

  // 🔹 Configuración de la tabla con `useMemo`
  const table = useReactTable({
    data: filteredVentas,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  // 🔹 Función para ver detalles de venta (Evita actualizar si ya está seleccionada)
  const handleVerDetalles = (venta: any) => {
    if (
      !selectedVenta ||
      selectedVenta.folio_contrato !== venta.folio_contrato
    ) {
      setSelectedVenta(venta);
      setShowModal(true);
    }
  };

  return (
    <div className="w-full">
      {/* 🔹 Barra de búsqueda */}
      <div className="flex items-center py-4">
        <Input
          placeholder="Buscar por Folio o Nombre de Cliente..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {/* 🔹 Tabla */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
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
                  No se encontraron resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* 🔹 Botones de paginación */}
      <div className="flex justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Anterior
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Siguiente
        </Button>
      </div>

      {/* 🔹 Modal de detalles de venta */}
      {showModal && selectedVenta && (
        <ShowVenta sale={selectedVenta} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
}
