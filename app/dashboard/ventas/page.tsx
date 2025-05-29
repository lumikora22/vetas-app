import { CreateProduct } from "@/components/ui/products/buttons";
import Search from "@/components/ui/search";
import { Suspense } from "react";
import Table from "@/components/ui/ventas/table";
import {
  fetchArticulos,
  fetchColaborators,
  fetchCustomers,
  fetchFilteredSales,
  getLastFolio,
} from "@/app/lib/data";
export default async function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;

  const customers = await fetchCustomers();
  const products = await fetchArticulos();
  const colaborators = await fetchColaborators();
  const lastFolio = await getLastFolio();

  const sales = await fetchFilteredSales(query, currentPage);
  console.log(sales);
  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`text-2xl`}>Ventas</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        {/* <Search placeholder="Buscar venta..." />
        <CreateProduct /> */}
      </div>
      <Suspense key={query + currentPage}>
        <Table
          ventas={sales}
          customers={customers}
          products={products}
          colaborators={colaborators}
          lastFolio={lastFolio}
        />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        {/* <Pagination totalPages={totalPages} /> */}
      </div>
    </div>
  );
}
