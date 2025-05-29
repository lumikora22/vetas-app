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

export default function FormInfoVenta({
  colaborators,
  customers,
  products,
  onSubmit,
  lastFolio,
}: {
  colaborators: any[];
  customers: any[];
  products: any[];
  onSubmit: any;
  lastFolio: string;
}) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    mode: "onChange",
    defaultValues: {
      folioContrato: lastFolio,
      diaPago: undefined,
      cobroSemana: 0,
      fechaInicio: "",
      fechaFinal: "",
      cliente: "",
      cobrador: "",
      semanasPago: "",
      enganche: "",
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
    if (selectedProducts.length === 0) {
      toast({
        title: "Error",
        description: "Debes agregar al menos un producto.",
        variant: "destructive",
      });
      return;
    }

    // onSubmit(formData, selectedProducts);
    onSubmit(form, selectedProducts); // Llamamos la función que recibimos como prop del componente padre
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-6 max-w-4xl mx-auto p-4"
      >
        <h2 className="text-xl font-semibold mb-4">Información general</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="folioContrato"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Folio de Contrato</FormLabel>
                <FormControl>
                  <Input placeholder="Folio de Contrato" disabled {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="diaPago"
            render={({ field }) => (
              <FormItem>
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
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4">Fechas y cobro</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="cobroSemana"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cobro por Semana</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="fechaInicio"
              render={({ field }) => (
                <FormItem>
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
                <FormItem>
                  <FormLabel>Fecha Final</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} className="w-full" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4">Cliente y Cobrador</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
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
            />
          </div>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4">Pagos adicionales</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="semanasPago"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cantidad de Semanas de Pago</FormLabel>
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
          </div>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4">Productos</h2>
          <ProductSelector products={products} onProductSelect={addProduct} />

          <ProductTable
            products={selectedProducts}
            onAmountChange={updateProductAmount}
            onDelete={onDeleteProductAction}
          />
        </div>
        <div className="text-center pt-6">
          <Button
            disabled={!form.formState.isValid}
            type="submit"
            className="px-8 py-3 text-lg"
          >
            Generar Venta
          </Button>
        </div>
      </form>
    </Form>
  );
}
