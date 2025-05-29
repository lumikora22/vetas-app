import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";

import { editarPrestamo, eliminarVenta } from "@/app/lib/data"; // Asegúrate de tener la función `guardarPrestamo`

import { useEffect, useState } from "react";
import { DialogFooter } from "@/components/ui/dialog";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CurrencyInput } from "@/components/ui/currency-input";
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
import { PencilIcon } from "lucide-react";
import { toast } from "../use-toast";

const FormSchema = z.object({
  folioContrato: z.string().min(1),
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
  cobroSemana: z.number().min(1),
  fechaInicio: z.string().nonempty(),
  fechaFinal: z.string().nonempty(),
  cliente: z.string().min(1),
  cobrador: z.string().min(1),
  semanasPago: z.string().min(1),
  enganche: z.string().min(0),
});

interface EditLoanProps {
  loan: {
    id_prestamo: number;
    subtotal_prestamo: number;
    interes: number;
    total_prestamo: number;
  };
  onUpdated: () => void;
}

// import { PlusIcon } from "lucide-react";
export function EditVentaForm({
  venta,
  colaborators,
  customers,
  products,
  onSubmit,
}: {
  venta: any;
  colaborators: any[];
  customers: any[];
  products: any[];
  onSubmit: (formData: any, selectedProducts: any[]) => void;
}) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    mode: "onChange",
    defaultValues: {
      folioContrato: venta.folioContrato || "",
      diaPago: venta.diaPago || undefined,
      cobroSemana: Number(venta.cobroSemana) || 0,
      fechaInicio: venta.fechaInicio || "",
      fechaFinal: venta.fechaFinal || "",
      cliente: String(venta.cliente) || "",
      cobrador: String(venta.cobrador) || "",
      semanasPago: String(venta.semanasPago) || "",
      enganche: String(venta.enganche) || "",
    },
  });

  const [selectedProducts, setSelectedProducts] = useState<any[]>(
    venta.productos || []
  );
  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const addProduct = (product: any) => {
    const exists = selectedProducts.some(
      (p) => p.id_articulo === product.id_articulo
    );
    if (exists) {
      setErrorMessage("El producto ya fue agregado.");
      return;
    }
    setSelectedProducts((prev) => [...prev, { ...product, amount: 1 }]);
    setErrorMessage("");
  };

  const updateProductAmount = (productId: any, newAmount: number) => {
    setSelectedProducts((prev) =>
      prev.map((p) =>
        p.id_articulo === productId ? { ...p, amount: newAmount } : p
      )
    );
  };

  const onDeleteProductAction = (productId: any) => {
    setSelectedProducts((prev) =>
      prev.filter((p) => p.id_articulo !== productId)
    );
  };

  const handleSubmit = (formData: any) => {
    if (selectedProducts.length === 0) {
      toast({
        title: "Error",
        description: "Debes agregar al menos un producto.",
        variant: "destructive",
      });
      return;
    }

    onSubmit(formData, selectedProducts);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="text-blue-600 hover:underline px-2">
          <PencilIcon className="h-4 w-4" /> Editar
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar Venta</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6 max-w-4xl mx-auto p-4"
          >
            <FormField
              control={form.control}
              name="folioContrato"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Folio de Contrato</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Seleccionar un día" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Días</SelectLabel>
                          {[
                            "Lunes",
                            "Martes",
                            "Miercoles",
                            "Jueves",
                            "Viernes",
                            "Sábado",
                            "Domingo",
                          ].map((dia) => (
                            <SelectItem key={dia} value={dia}>
                              {dia}
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

            <div className="flex flex-col sm:flex-row sm:space-x-4">
              <FormField
                control={form.control}
                name="cobroSemana"
                render={({ field }) => (
                  <CurrencyInput field={field} form={form} />
                )}
              />

              <FormField
                control={form.control}
                name="fechaInicio"
                render={({ field }) => (
                  <FormItem className="w-full sm:w-1/2">
                    <FormLabel>Fecha de Inicio</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fechaFinal"
                render={({ field }) => (
                  <FormItem className="w-full sm:w-1/2">
                    <FormLabel>Fecha Final</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="cliente"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cliente</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un cliente" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {customers.map((c) => (
                            <SelectItem
                              key={c.id_cliente}
                              value={String(c.id_cliente)}
                            >
                              {c.name_cliente}
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
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un cobrador" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {colaborators.map((c) => (
                            <SelectItem
                              key={c.id_cobrador}
                              value={String(c.id_cobrador)}
                            >
                              {c.name_cobrador}
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

            <div className="flex flex-col sm:flex-row sm:space-x-4">
              <FormField
                control={form.control}
                name="semanasPago"
                render={({ field }) => (
                  <FormItem className="w-full sm:w-1/2">
                    <FormLabel>Semanas de Pago</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="enganche"
                render={({ field }) => (
                  <FormItem className="w-full sm:w-1/2">
                    <FormLabel>Enganche</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormLabel className="text-center">
              Productos Seleccionados
            </FormLabel>
            <ProductSelector products={products} onProductSelect={addProduct} />
            <ProductTable
              products={selectedProducts}
              onAmountChange={updateProductAmount}
              onDelete={onDeleteProductAction}
            />

            <Button
              type="submit"
              disabled={
                !form.formState.isValid || selectedProducts.length === 0
              }
            >
              Guardar Cambios
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
export function DeleteVenta({
  loanId,
  onDeleted,
}: {
  loanId: number;
  onDeleted: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await eliminarVenta(loanId);
      // toast.success("Préstamo eliminado exitosamente.");
      setOpen(false);
      onDeleted();
      1;
    } catch (error) {
      // toast.error("Error al eliminar el préstamo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="text-red-600 hover:bg-red-50"
          onClick={() => setOpen(true)}
        >
          <TrashIcon className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>¿Eliminar Venta?</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-gray-500">
          Esta acción no se puede deshacer.
        </p>
        <DialogFooter className="mt-4">
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? "Eliminando..." : "Eliminar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
