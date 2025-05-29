import { CreateProduct } from "@/components/ui/products/buttons";
import Search from "@/components/ui/search";
import { Suspense } from "react";
import Table from "@/components/ui/products/table";
import {
  fetchArticulos,
  fetchCustomers,
  fetchProductos,
  fetchColaborators,
  fetchPagosParaConfirmar,
} from "@/app/lib/data";
import Breadcrumbs from "@/components/ui/ventas/breadcrumbs";
import FormCreateVenta from "@/components/ui/ventas/create-venta";
import { TablePagos } from "@/components/ui/aprobar-pagos/table-pagos";

export default async function Page() {
  const pagosConfirmar = await fetchPagosParaConfirmar();
  // console.log(pagosConfirmar);
  return (
    <main>
      <div className="flex w-full items-center justify-between">
        <h1 className={`text-2xl`}>Aprobar Pagos</h1>
      </div>
      <div className="mt-4 flex items-center justify-center gap-2 md:mt-8">
        <TablePagos pagosConfirmar={pagosConfirmar} />
      </div>
    </main>
  );
}
