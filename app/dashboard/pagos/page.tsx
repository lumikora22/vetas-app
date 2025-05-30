import { CreateProduct } from "@/components/ui/products/buttons";
import Search from "@/components/ui/search";
import React, { Suspense } from "react";
import Table from "@/components/ui/products/table";
import { ClienteCombobox } from "@/components/ui/pagos/buscar-clientes";
export default async function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`text-2xl`}>Pagos</h1>
      </div>
      <div className="mt-4 flex items-center justify-center gap-2 md:mt-8">
        {/* <Search placeholder="Buscar clientes..." /> */}
        <ClienteCombobox />

        {/* <CreateProduct /> */}
      </div>
      {/* <Suspense key={query + currentPage}>
        <Table query={query} currentPage={currentPage} />
      </Suspense> */}
      <div className="mt-5 flex w-full justify-center">
        {/* <Pagination totalPages={totalPages} /> */}
      </div>
    </div>
  );
}
