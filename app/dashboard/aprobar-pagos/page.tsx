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
      <Breadcrumbs
        breadcrumbs={[
          { label: "Pagos", href: "/dashboard/invoices" },
          {
            label: "Aprobar Pagos",
            href: "/dashboard/invoices/create",
            active: true,
          },
        ]}
      />
      <TablePagos pagosConfirmar={pagosConfirmar} />
    </main>
  );
}
