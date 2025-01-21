import { CreateProduct } from "@/components/ui/products/buttons";
import Search from "@/components/ui/search";
import { Suspense } from "react";
import Table from "@/components/ui/products/table";
import {
  fetchArticulos,
  fetchCustomers,
  fetchProductos,
  fetchColaborators,
} from "@/app/lib/data";
import Breadcrumbs from "@/components/ui/ventas/breadcrumbs";
import FormCreateVenta from "@/components/ui/ventas/create-venta";

export default async function Page() {
  const customers = await fetchCustomers();
  const products = await fetchArticulos();
  const colaborators = await fetchColaborators();

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Ventas", href: "/dashboard/invoices" },
          {
            label: "Crear Venta",
            href: "/dashboard/invoices/create",
            active: true,
          },
        ]}
      />
      <FormCreateVenta
        customers={customers}
        products={products}
        colaborators={colaborators}
      />
    </main>
  );
}
