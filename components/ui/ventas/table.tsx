"use client";
import * as React from "react";

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
// import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHead,
  TableRow,
  TableFooter,
} from "@/components/ui/table";
import ShowVenta from "./show-venta"; // Asegúrate de tener este componente

export default function SalesTable({
  ventas, // La página predeterminada es la 1
}: {
  ventas: any;
}) {
  // Estado para manejar la visibilidad del modal y la venta seleccionada
  const [showModal, setShowModal] = React.useState<boolean>(false);
  const [selectedVenta, setSelectedVenta] = React.useState<any>(null);
  const [searchValue, setSearchValue] = React.useState("");

  // Definir las columnas para la tabla
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "folio_contrato",
      header: "Folio",
      cell: ({ row }) => row.getValue("folio_contrato"),
    },
    {
      // Nueva columna para el nombre del cliente
      accessorFn: (row) => row.Cliente.name_cliente, // Usamos `accessorFn` para acceder a `name_cliente` de `Cliente`
      header: "Nombre del Cliente",
      cell: ({ row }) => row.getValue("Cliente.name_cliente"),
    },
    {
      accessorKey: "dias_pago",
      header: "Dia de pago",
      cell: ({ row }) => row.getValue("dias_pago"),
    },
    {
      accessorKey: "cobro_pago",
      header: "Cobro semana",
      cell: ({ row }) => row.getValue("cobro_pago"),
    },
    {
      accessorKey: "start_date",
      header: "Fecha de inicio",
      cell: ({ row }) => row.getValue("start_date"),
    },
    {
      accessorKey: "end_date",
      header: "Fecha de fin",
      cell: ({ row }) => row.getValue("end_date"),
    },
    {
      accessorKey: "cantidad_semanas_pago",
      header: "Cantidad de semanas a pagar",
      cell: ({ row }) => row.getValue("cantidad_semanas_pago"),
    },
    {
      accessorKey: "enganche",
      header: "Enganche",
      cell: ({ row }) => row.getValue("enganche"),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                setSelectedVenta(row.original); // Set selected sale
                setShowModal(true); // Show modal
              }}
            >
              Ver detalles de Venta
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const filteredVentas = ventas.filter((venta: any) => {
    const nameMatch = venta.Cliente.name_cliente
      .toLowerCase()
      .includes(searchValue.toLowerCase());
    const folioMatch = venta.folio_contrato
      .toLowerCase()
      .includes(searchValue.toLowerCase());
    return nameMatch || folioMatch;
  });

  const table = useReactTable({
    data: filteredVentas,
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
  });

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Buscar por Folio o Nombre de Cliente..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
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
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
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
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          {/* <TableFooter>
            <TableRow>
              <TableCell colSpan={6}>Total Down Payment</TableCell>
              <TableCell className="text-right">
                {ventas.reduce(
                  (total: number, venta: any) => total + venta.enganche,
                  0
                )}
              </TableCell>
            </TableRow>
          </TableFooter> */}
        </Table>
      </div>

      {/* Mostrar el componente ShowVenta cuando showModal es verdadero */}
      {showModal && selectedVenta && (
        <ShowVenta sale={selectedVenta} onClose={() => setShowModal(false)} />
      )}

      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
