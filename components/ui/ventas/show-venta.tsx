"use client";
import { useState } from "react"; // Importamos useState para controlar la visibilidad

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Eye } from "lucide-react";
import FormEditVenta from "./edit-venta";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
  TableCaption,
} from "@/components/ui/table";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
// import { Label } from "../label";
import { Label } from "@/components/ui/label";

const dayMap: any = {
  Domingo: 0,
  Lunes: 1,
  Martes: 2,
  Miércoles: 3,
  Jueves: 4,
  Viernes: 5,
  Sábado: 6,
};

export default function ShowVenta({
  sale,
  onClose,
}: {
  sale: any;
  onClose: () => void;
}) {
  const { Cliente, Cobrador, Venta_articulo, Cuenta_venta } = sale;
  //   console.log(sale);
  // Funciones para abrir y cerrar el modal

  // Calcular el total de los artículos vendidos
  // const totalArticulo = 0;
  const totalArticulo = Venta_articulo.reduce(
    (acc: number, item: any) =>
      acc + item.Articulo.precio_articulo * item.cantidad_venta,
    0
  );
  console.log(Venta_articulo);

  const nextPayDay = getNextWeekdayDate(sale.dias_pago);

  return (
    <>
      <Dialog
        open={true}
        onOpenChange={(isOpen) => {
          if (!isOpen) onClose();
        }}
      >
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Detalles de la Venta</DialogTitle>
            <DialogDescription>
              Información completa de la venta, incluyendo el cliente, cobrador,
              artículos vendidos y pagos.
            </DialogDescription>
          </DialogHeader>

          {/* Acordeón con detalles de la venta */}
          <Accordion type="single" collapsible className="w-full">
            {/* Información del cliente */}
            <AccordionItem value="cliente-info">
              <AccordionTrigger>Información del Cliente</AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-4 gap-4">
                  <Label className="text-right">Cliente</Label>
                  <div className="col-span-3">{Cliente.name_cliente}</div>
                </div>

                <div className="grid grid-cols-4 gap-4">
                  <Label className="text-right">Direccion</Label>
                  <div className="col-span-3">
                    {Cliente.adress_cliente} - {Cliente.location}
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4">
                  <Label className="text-right">Telefono</Label>
                  <div className="col-span-3">{Cliente.phone_number}</div>
                </div>

                <div className="grid grid-cols-4 gap-4">
                  <Label className="text-right">Cobrador</Label>
                  <div className="col-span-3">{Cobrador.name_cobrador}</div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Información de la venta */}
            <AccordionItem value="venta-info">
              <AccordionTrigger>Detalles de la Venta</AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-4 gap-4">
                  <Label className="text-right">Folio de Venta</Label>
                  <div className="col-span-3">{sale.folio_contrato}</div>
                </div>
                <div className="grid grid-cols-4 gap-4">
                  <Label className="text-right">Fecha de Inicio</Label>
                  <div className="col-span-3">
                    {formatDate(sale.start_date)}
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-4">
                  <Label className="text-right">Fecha de Fin</Label>
                  <div className="col-span-3">{formatDate(sale.end_date)}</div>
                </div>
                <div className="grid grid-cols-4 gap-4">
                  <Label className="text-right">Día de Pago</Label>
                  <div className="col-span-3">{sale.dias_pago}</div>
                </div>
                <div className="grid grid-cols-4 gap-4">
                  <Label className="text-right">Cantidad de Semanas</Label>
                  <div className="col-span-3">{sale.cantidad_semanas_pago}</div>
                </div>
                <div className="grid grid-cols-4 gap-4">
                  <Label className="text-right">Enganche</Label>
                  <div className="col-span-3 text-green-500">
                    ${sale.enganche.toFixed(2)}
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Tabla de artículos vendidos */}
            <AccordionItem value="articulos">
              <AccordionTrigger>Artículos Vendidos</AccordionTrigger>
              <AccordionContent>
                <Table>
                  <TableCaption>
                    Artículos incluidos en esta venta.
                  </TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Artículo</TableHead>
                      <TableHead>Cantidad</TableHead>
                      <TableHead className="text-right">
                        Precio Unitario
                      </TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Venta_articulo.map((item: any) => (
                      <TableRow key={item.Articulo.id_articulo}>
                        <TableCell>{item.Articulo.name_articulo}</TableCell>
                        <TableCell>{item.cantidad_venta}</TableCell>
                        <TableCell className="text-right">
                          ${item.Articulo.precio_articulo.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right">
                          $
                          {(
                            item.Articulo.precio_articulo * item.cantidad_venta
                          ).toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TableCell colSpan={3}>Total Artículos</TableCell>
                      <TableCell className="text-right text-blue-600">
                        ${totalArticulo.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  </TableFooter>
                </Table>
              </AccordionContent>
            </AccordionItem>

            {/* Información del pago */}
            <AccordionItem value="pago-info">
              <AccordionTrigger>Detalles del Pago</AccordionTrigger>
              <AccordionContent>
                {Cuenta_venta.map((pago: any) => (
                  <div
                    key={pago.id_pago}
                    className="grid grid-cols-4 gap-4 items-center mt-4"
                  >
                    <Label className="text-right">Fecha de último Pago</Label>
                    <div className="col-span-3">
                      {formatDate(pago.fecha_pago)}
                    </div>
                    <Label className="text-right">Fecha de pago proximo</Label>
                    <div className="col-span-3">{nextPayDay}</div>

                    <Label className="text-right">Pago Total</Label>
                    <div className="col-span-3 text-green-600">
                      ${totalArticulo.toFixed(2)}
                    </div>
                    <Label className="text-right">Pago X Semana</Label>
                    <div className="col-span-3 text-yellow-600">
                      ${pago.total_pago_evento.toFixed(2)}
                    </div>
                    <Label className="text-right">Restante</Label>
                    <div className="col-span-3 text-red-500">
                      {pago.resta_pago < 0
                        ? "Pendiente"
                        : `$${Math.abs(pago.resta_pago).toFixed(2)}`}
                    </div>
                    <Label className="text-right">Status de Pago</Label>
                    <div className="col-span-3">
                      {pago.status_pago === 1 ? "Completado" : "Pendiente"}
                    </div>
                  </div>
                ))}
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* <DialogFooter>
            <Button type="button">Cerrar</Button>
          </DialogFooter> */}
          <DialogFooter>
            <Button onClick={onClose}>Cerrar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function getNextWeekdayDate(targetDayName: any) {
  const currentDate = new Date();
  const currentDay = currentDate.getDay();

  // Mapeo de los días de la semana en formato texto a sus valores numéricos
  const targetDay = dayMap[targetDayName];

  // Calcular la diferencia en días entre el día actual y el día objetivo
  const daysToAdd = (targetDay - currentDay + 7) % 7 || 7;

  // Calcular la fecha del próximo día objetivo
  const targetDate = new Date(currentDate);
  targetDate.setDate(currentDate.getDate() + daysToAdd);

  // Formatear la fecha como dd/MM/yyyy
  const day = String(targetDate.getDate()).padStart(2, "0"); // Día del mes
  const month = String(targetDate.getMonth() + 1).padStart(2, "0"); // Mes (debe ser +1 porque enero es 0)
  const year = targetDate.getFullYear(); // Año

  // Devolver la fecha en el formato deseado (dd/MM/yyyy)
  return `${day}/${month}/${year}`;
}

function formatDate(inputDate: any) {
  const date = new Date(inputDate); // Convertir el string a un objeto Date

  // Extraer día, mes y año
  const day = String(date.getDate()).padStart(2, "0"); // Día (con ceros a la izquierda)
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Mes (agregar 1 porque enero es 0)
  const year = date.getFullYear(); // Año

  // Retornar la fecha formateada en dd/MM/yyyy
  return `${day}/${month}/${year}`;
}
