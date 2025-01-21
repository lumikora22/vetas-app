import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDateToLocal, formatCurrency } from "@/app/lib/utils";
import { fetchFilteredSales } from "@/app/lib/data";
import ShowVenta from "./show-venta";
import Link from "next/link";

export default async function SalesTable({
  query,
  currentPage = 1, // La página predeterminada es la 1
}: {
  query: string;
  currentPage: number;
}) {
  const { sales, totalPages } = await fetchFilteredSales(query, currentPage);

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden">
            {sales?.map((sale: any) => (
              <div
                key={sale.id_venta}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <p>{sale.folio_contrato}</p>
                    <p className="text-sm text-gray-500">{sale.dias_pago}</p>
                  </div>
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div>
                    <p className="text-xl font-medium">
                      {formatCurrency(sale.cobro_pago)}
                    </p>
                    <p>{formatDateToLocal(sale.start_date)}</p>
                  </div>
                  <div className="flex justify-end gap-2">
                    <ShowVenta sale={sale} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Tabla para pantallas grandes */}
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Folio Contrato
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Días de Pago
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Cobro
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Fecha de Compra
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Fecha de Vencimiento
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Cliente
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Cobrador
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Semanas de pago
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Enganche
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {sales?.map((sale: any) => (
                <tr
                  key={sale.id_venta}
                  className="w-full border-b py-3 text-sm last-of-type:border-none"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    {sale.folio_contrato}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {sale.dias_pago}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {formatCurrency(sale.cobro_pago)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {formatDateToLocal(sale.start_date)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {formatDateToLocal(sale.end_date)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {sale.Cliente.name_cliente}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {sale.Cobrador.name_cobrador}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {sale.cantidad_semanas_pago}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {sale.enganche}
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <ShowVenta sale={sale} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Paginación */}
          <div className="mt-4 flex justify-between items-center">
            <div>
              {/* Página anterior */}
              {currentPage > 1 && (
                <Link href={`?query=${query}&page=${currentPage - 1}`}>
                  <button className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-md">
                    Anterior
                  </button>
                </Link>
              )}
            </div>

            <p>
              Página {currentPage} de {totalPages}
            </p>

            <div>
              {/* Página siguiente */}
              {currentPage < totalPages && (
                <Link href={`?query=${query}&page=${currentPage + 1}`}>
                  <button className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-md">
                    Siguiente
                  </button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
