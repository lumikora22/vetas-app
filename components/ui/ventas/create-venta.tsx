"use client";

import FormInfoVenta from "./form-info-venta";
import { guardarVenta } from "@/app/lib/data";
import Swal from "sweetalert2";

export default function FormCreateVenta({
  customers,
  products,
  colaborators,
}: {
  customers: any[];
  products: any[];
  colaborators: any[];
}) {
  const handleFormSubmit = async (formData: any, selectedProducts: any) => {
    console.log(selectedProducts);
    const venta = {
      folio_contrato: formData.folioContrato,
      dias_pago: formData.diaPago,
      cobro_pago: parseFloat(formData.cobroSemana), // Convertir el cobro a un valor en centavos o el valor adecuado
      start_date: formData.fechaInicio,
      end_date: formData.fechaFinal,
      id_cliente: parseInt(formData.cliente),
      id_cobrador: parseInt(formData.cobrador),
      cantidad_semanas_pago: parseInt(formData.semanasPago),
      enganche: parseFloat(formData.enganche),
      articulos: selectedProducts.map((articulo: any) => ({
        id_articulo: articulo.id_articulo,
        cantidad: articulo.amount,
        precio_articulo: articulo.precio_articulo,
      })),
    };

    try {
      const ventaGuardada = await guardarVenta(venta);
      console.log("Venta guardada correctamente:", ventaGuardada);

      Swal.fire({
        icon: "success",
        title: "¡Venta guardada!",
        text: "La venta se ha guardado correctamente.",
        confirmButtonText: "Aceptar",
      });
    } catch (error) {
      console.error("Error al guardar la venta:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Ocurrió un error al guardar la venta. Inténtalo nuevamente.",
        confirmButtonText: "Cerrar",
      });
    }
    // Aquí puedes manejar los datos (enviar a una API, actualizar el estado, etc.)
  };
  return (
    <div>
      <FormInfoVenta
        colaborators={colaborators}
        customers={customers}
        products={products}
        onSubmit={handleFormSubmit}
      ></FormInfoVenta>
    </div>
  );
}
