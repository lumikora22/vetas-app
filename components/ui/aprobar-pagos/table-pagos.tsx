"use client";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "../button";
import Swal from "sweetalert2";
import { procesarConfirmacionPago, procesarRechazarPago } from "@/app/lib/data";

export function TablePagos({ pagosConfirmar }: { pagosConfirmar: any[] }) {
  const handleApprovePayment = async (venta: any) => {
    console.log(venta);
    Swal.fire({
      icon: "warning",
      title: "¿Estás seguro de aprobar el pago?",
      showCancelButton: true,
      confirmButtonText: `Sí`,
      cancelButtonText: `No`,
      customClass: {
        confirmButton:
          "bg-blue-600 text-white px-4 py-2 mx-2 rounded-lg hover:bg-blue-700", // Estilo del botón de confirmación
        cancelButton:
          "bg-red-600 text-white px-4 py-2 mx-2 rounded-lg hover:bg-red-700", // Estilo del botón de cancelar
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // Mostrar indicador de carga
          const loadingSwal: any = Swal.fire({
            title: "Procesando...",
            text: "Por favor, espera mientras se aprueba el pago.",
            icon: "info",
            showConfirmButton: false,
            willOpen: () => {
              Swal.showLoading(); // Mostrar loading
            },
          });

          // Llamar a la función que procesa la confirmación del pago
          const pagoConfimado = await procesarConfirmacionPago(venta);
          console.log(pagoConfimado);

          // Cerrar el loading
          loadingSwal.close();

          // Confirmación exitosa
          Swal.fire("¡Pago aprobado!", "", "success");
        } catch (error: any) {
          console.log(error);

          // Cerrar el loading si ocurre un error
          Swal.close();

          // Mostrar error con el mensaje específico si está disponible
          Swal.fire(
            "¡Error al aprobar el pago!",
            error.message || "Ocurrió un problema al procesar el pago.",
            "error"
          );
        }
      }
    });
  };

  const handleDeclinePayment = async (venta: any) => {
    Swal.fire({
      icon: "warning",
      title: "¿Estás seguro de rechazar el pago?",
      showCancelButton: true,
      confirmButtonText: `Sí`,
      cancelButtonText: `No`,
      customClass: {
        confirmButton:
          "bg-blue-600 text-white px-4 py-2 mx-2 rounded-lg hover:bg-blue-700", // Estilo del botón de confirmación
        cancelButton:
          "bg-red-600 text-white px-4 py-2 mx-2 rounded-lg hover:bg-red-700", // Estilo del botón de cancelar
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // Mostrar indicador de carga
          const loadingSwal: any = Swal.fire({
            title: "Procesando...",
            text: "Por favor, espera mientras se rechaza el pago.",
            icon: "info",
            showConfirmButton: false,
            willOpen: () => {
              Swal.showLoading(); // Mostrar loading
            },
          });

          // Llamar a la función que procesa la confirmación del pago
          const pagoRechazado = await procesarRechazarPago(venta);
          console.log(pagoRechazado);

          // Cerrar el loading
          loadingSwal.close();

          // Confirmación exitosa
          Swal.fire("¡Pago Rechazado!", "", "success");
        } catch (error: any) {
          console.log(error);

          // Cerrar el loading si ocurre un error
          Swal.close();

          // Mostrar error con el mensaje específico si está disponible
          Swal.fire(
            "¡Error al rechazar el pago!",
            error.message || "Ocurrió un problema al procesar el pago.",
            "error"
          );
        }
      }
    });
  };
  // console.log(pagosConfirmar);
  return (
    <div className="w-full">
      <Table>
        <TableCaption>Lista para aprobar pagos</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Folio Contrato</TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead>Fecha Pago</TableHead>
            <TableHead>Pago</TableHead>
            <TableHead>Restante</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pagosConfirmar.map((sale) => (
            <TableRow key={sale.Venta.id_venta}>
              <TableCell className="font-medium">
                {sale.Venta.folio_contrato}
              </TableCell>
              <TableCell>{sale.Cliente.name_cliente}</TableCell>
              <TableCell>{sale.Venta.Cuenta_venta[0].fecha_pago}</TableCell>
              <TableCell>${sale.Venta.cobro_pago}</TableCell>
              <TableCell>${sale.Venta.Cuenta_venta[0].resta_pago}</TableCell>
              <TableCell>
                <Button
                  onClick={() => {
                    handleApprovePayment(sale.Venta.id_venta);
                  }}
                  variant="outline"
                >
                  Aprobar
                </Button>
                <Button
                  onClick={() => {
                    handleDeclinePayment(sale.Venta.id_venta);
                  }}
                  variant="destructive"
                >
                  Rechazar
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
