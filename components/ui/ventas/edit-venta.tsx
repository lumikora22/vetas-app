"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CurrencyInput } from "@/components/ui/currency-input";

import { toast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProductSelector } from "./product-selector";
import { ProductTable } from "./product-table";
import { useState } from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FormSchema = z.object({
  folioContrato: z
    .string()
    .min(1, { message: "Folio de Contrato es requerido." }),
  diaPago: z
    .enum([
      "Lunes",
      "Martes",
      "Miercoles",
      "Jueves",
      "Viernes",
      "Sábado",
      "Domingo",
    ])
    .optional(),
  cobroSemana: z
    .number()
    .min(1, { message: "Cobro por Semana debe ser mayor a 0." }),
  fechaInicio: z
    .string()
    .nonempty({ message: "Fecha de Inicio es requerida." }),
  fechaFinal: z.string().nonempty({ message: "Fecha Final es requerida." }),
  cliente: z.string().min(1, { message: "Cliente es requerido." }),
  cobrador: z.string().min(1, { message: "Cobrador es requerido." }),
  semanasPago: z
    .string()
    .min(1, { message: "Cantidad de Semanas debe ser mayor a 0." }),
  enganche: z.string().min(0, { message: "Enganche no puede ser negativo." }),
});

export default function FormEditVenta({
  sale,
  colaborators,
  customers,
  products,
}: {
  sale: any;
  colaborators: any[];
  customers: any[];
  products: any[];
}) {
  console.log(sale);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      folioContrato: sale.folio_contrato,
      diaPago: sale.dias_pago,
      cobroSemana: sale.cobro_pago,
      fechaInicio: sale.start_date,
      fechaFinal: sale.end_date,
      cliente: sale.Cliente.id_cliente,
      cobrador: sale.Cobrador.id_cobrador,
      semanasPago: sale.cantidad_semanas_pago,
      enganche: sale.enganche,
    },
  });

  const [selectedProducts, setSelectedProducts] = useState<any[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const addProduct = (product: any) => {
    // Verificar si el producto ya está en la lista
    const isProductInList = selectedProducts.some(
      (p) => p.id_articulo === product.id_articulo
    );

    if (isProductInList) {
      // Mostrar mensaje de error si el producto ya fue agregado
      setErrorMessage("El producto ya fue agregado.");
      return;
    }

    setSelectedProducts((prevProducts) => [
      ...prevProducts,
      { ...product, amount: 1 },
    ]);
    setErrorMessage(""); // Limpiar el mensaje de error si la adición fue exitosa
    // setSelectedProducts((prevProducts) => [
    //   ...prevProducts,
    //   { ...product, amount: 1 },
    // ]);
  };

  const updateProductAmount = (productId: any, newAmount: number) => {
    setSelectedProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id_articulo === productId
          ? { ...product, amount: newAmount }
          : product
      )
    );
  };

  const onDeleteProductAction = (productId: any) => {
    console.log(productId);
    setSelectedProducts((prevProducts) =>
      prevProducts.filter((product) => product.id_articulo !== productId)
    );
  };

  const handleSubmit = (form: any) => {
    // onSubmit(form, selectedProducts); // Llamamos la función que recibimos como prop del componente padre
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-6 max-w-4xl mx-auto p-4"
      >
        {/* <FormField
          control={form.control}
          name="folioContrato"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Folio de Contrato</FormLabel>
              <FormControl>
                <Input placeholder="Folio de Contrato" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        /> */}
        <div className="flex flex-col sm:flex-row sm:space-x-2 w-full justify-between">
          <FormField
            control={form.control}
            name="diaPago"
            render={({ field }) => (
              <FormItem className="w-[40%]">
                <FormLabel>Día de Pago</FormLabel>
                <FormControl>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange} // Cambia de `onChange` a `onValueChange` si el componente lo requiere
                  >
                    <SelectTrigger className="w-[100%]">
                      <SelectValue placeholder="Seleccionar un día" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Días de Pago</SelectLabel>
                        <SelectItem value="Lunes">Lunes</SelectItem>
                        <SelectItem value="Martes">Martes</SelectItem>
                        <SelectItem value="Miercoles">Miércoles</SelectItem>
                        <SelectItem value="Jueves">Jueves</SelectItem>
                        <SelectItem value="Viernes">Viernes</SelectItem>
                        <SelectItem value="Sábado">Sábado</SelectItem>
                        <SelectItem value="Domingo">Domingo</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="cobroSemana"
            render={({ field }) => <CurrencyInput field={field} form={form} />}
          />
        </div>

        <div className="flex flex-col sm:flex-row sm:space-x-4 w-full justify-between">
          <FormField
            control={form.control}
            name="fechaInicio"
            render={({ field }) => (
              <FormItem className="w-full sm:w-1/3">
                <FormLabel>Fecha de Inicio</FormLabel>
                <FormControl>
                  <Input type="date" {...field} className="w-full" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="fechaFinal"
            render={({ field }) => (
              <FormItem className="w-full sm:w-1/3">
                <FormLabel>Fecha Final</FormLabel>
                <FormControl>
                  <Input type="date" {...field} className="w-full" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="semanasPago"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-size: 13px">
                Cantidad Semanas de Pago
              </FormLabel>
              <FormControl>
                <Input type="number" placeholder="0" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="enganche"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Enganche</FormLabel>
              <FormControl>
                <Input type="number" placeholder="0" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>Productos Comprados</AccordionTrigger>
            <AccordionContent>
              Yes. It adheres to the WAI-ARIA design pattern.
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* <FormField
          control={form.control}
          name="cliente"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cliente:</FormLabel>
              <FormControl>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-[100%]">
                    <SelectValue placeholder="Selecciona un cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Clientes Registrados</SelectLabel>
                      {customers.map((customer) => (
                        <SelectItem
                          key={customer.id_cliente}
                          value={String(customer.id_cliente)} // Asegúrate de que el value sea una cadena o el tipo correcto
                        >
                          {customer.name_cliente}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="cobrador"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cobrador</FormLabel>
              <FormControl>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-[100%]">
                    <SelectValue placeholder="Selecciona un cobrador" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Cobradores Registrados</SelectLabel>
                      {colaborators.map((cobrador) => (
                        <SelectItem
                          key={cobrador.id_cobrador}
                          value={String(cobrador.id_cobrador)}
                        >
                          {cobrador.name_cobrador}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        /> */}

        {/* <FormLabel className="text-center">Seleccionar los productos</FormLabel>
        <ProductSelector products={products} onProductSelect={addProduct} /> */}

        {/* <ProductTable
          products={selectedProducts}
          onAmountChange={updateProductAmount}
          onDelete={onDeleteProductAction}
        /> */}
        {/* <Button type="submit">Generar Venta</Button> */}
      </form>
    </Form>
  );
}
