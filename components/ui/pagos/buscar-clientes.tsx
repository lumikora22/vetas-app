"use client"; // Este componente solo debe ejecutarse en el cliente

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import Swal from "sweetalert2"; // Importar SweetAlert2

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  fetchCustomersWithSaleInfoToPay,
  fetchAllCustomersWithSaleInfoPay,
  savePagoPorConfirmar,
} from "@/app/lib/data";

export function ClienteCombobox() {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  const [clientes, setClientes] = React.useState<any[]>([]); // Todos los clientes
  const [loading, setLoading] = React.useState(false);
  const [selectedCliente, setSelectedCliente] = React.useState<any | null>(
    null
  ); // Estado para el cliente seleccionado

  // Función para cargar todos los clientes
  const loadAllClientes = async () => {
    setLoading(true);

    const clientesData = await fetchAllCustomersWithSaleInfoPay(); // Obtener todos los clientes
    setClientes(clientesData);

    setLoading(false);
  };

  // Función para buscar clientes
  const handleSearch = async (query: string) => {
    setLoading(true);
    const clientesData = await fetchCustomersWithSaleInfoToPay(query); // Buscar cliente
    setClientes(clientesData);
    setLoading(false);
  };

  // Cargar todos los clientes al inicio
  React.useEffect(() => {
    const syncPagosPendientes = async () => {
      const pagosPendientes = JSON.parse(
        localStorage.getItem("pagosPendientes") || "[]"
      );

      if (pagosPendientes.length > 0 && navigator.onLine) {
        const pendientesRestantes: any[] = [];

        for (const cobro of pagosPendientes) {
          try {
            await savePagoPorConfirmar(cobro);
          } catch (error) {
            // Si falla, lo volvemos a guardar
            pendientesRestantes.push(cobro);
          }
        }

        // Actualizamos la lista de pagos pendientes
        localStorage.setItem(
          "pagosPendientes",
          JSON.stringify(pendientesRestantes)
        );

        if (pendientesRestantes.length < pagosPendientes.length) {
          Swal.fire(
            "Pagos sincronizados",
            "Se procesaron pagos pendientes.",
            "success"
          );
          loadAllClientes();
        }
      }
    };

    // Ejecutar al recuperar conexión
    window.addEventListener("online", syncPagosPendientes);

    // También ejecutar al iniciar si ya está en línea
    syncPagosPendientes();

    return () => {
      window.removeEventListener("online", syncPagosPendientes);
    };
  }, []);

  // Función para seleccionar un cliente
  const handleSelectCliente = (clienteId: string) => {
    const cliente = clientes.find((c) => c.id_cliente === clienteId);

    const formatedCliente = formatVentasGenerales(cliente);
    setSelectedCliente(formatedCliente);

    setValue(clienteId); // Para actualizar el valor del combobox
    setOpen(false); // Cerrar el combobox
  };

  const handleRealizarPago = async (venta: any, id_cliente: any) => {
    Swal.fire({
      title: "¿Confirmar pago?",
      text: "¿Está seguro de que desea realizar el pago?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, realizar pago",
      cancelButtonText: "Cancelar",
      buttonsStyling: false,
      customClass: {
        confirmButton:
          "bg-blue-600 text-white px-4 py-2 mx-2 rounded-lg hover:bg-blue-700", // Estilo del botón de confirmación
        cancelButton:
          "bg-red-600 text-white px-4 py-2 mx-2 rounded-lg hover:bg-red-700", // Estilo del botón de cancelar
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const cobro = {
            id_venta: venta.id_venta,
            id_cliente: id_cliente,
            // timestamp: new Date().toISOString(), // útil para orden y depuración
          };

          if (navigator.onLine) {
            // Si hay conexión, envía a Supabase
            try {
              await savePagoPorConfirmar(cobro);
              Swal.fire(
                "Pago realizado",
                "El pago se ha completado.",
                "success"
              );
              loadAllClientes();
            } catch (error) {
              Swal.fire("Error", "El pago ya se realizó o falló", "error");
            }
          } else {
            // Guardar localmente si no hay conexión
            const pagosPendientes = JSON.parse(
              localStorage.getItem("pagosPendientes") || "[]"
            );
            pagosPendientes.push(cobro);
            localStorage.setItem(
              "pagosPendientes",
              JSON.stringify(pagosPendientes)
            );
            Swal.fire(
              "Pago guardado",
              "El pago será enviado cuando tengas conexión.",
              "info"
            );
          }

          // const pago = await savePagoPorConfirmar(cobro);

          // Aquí llamas a la función para realizar el pago
          // await realizarPago(ventaId);
          Swal.fire("Pago realizado", "El pago se ha completado.", "success");
          loadAllClientes();
        } catch (error) {
          Swal.fire(
            "Error",
            "El pago ya se realizo, confirmar el pago para continuar",
            "error"
          );
        }
      }
    });
  };

  const handleImprimir = (venta: any, cliente: any) => {
    const reciboWindow = window.open("", "_blank");
    if (!reciboWindow) {
      alert("No se pudo abrir la ventana de impresión. Permita los pop-ups.");
      return;
    }

    const fecha = new Date(venta.fecha_pago).toLocaleDateString();
    const contenido = `
      <html>
        <head>
          <title>Recibo de Pago</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .container { width: 80%; margin: auto; border: 1px solid #000; padding: 20px; }
            .header { text-align: center; font-weight: bold; font-size: 18px; }
            .sub-header { text-align: center; font-size: 14px; margin-bottom: 20px; }
            .datos { margin-bottom: 10px; }
            .tabla { width: 100%; border-collapse: collapse; margin-top: 10px; }
            .tabla, .tabla th, .tabla td { border: 1px solid black; }
            .tabla th, .tabla td { padding: 8px; text-align: left; }
            .firma { margin-top: 30px; text-align: center; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">NOVEDADES DE LOS ÁNGELES</div>
            <div class="sub-header">Tehuacán, Puebla - Tel: 124 21 86</div>
  
            <div class="datos">
              <p><strong>Nombre:</strong> ${cliente.name_cliente}</p>
              <p><strong>Dirección:</strong> ${cliente.adress_cliente}</p>
              <p><strong>Teléfono:</strong> ${cliente.phone_number}</p>
              <p><strong>Fecha de Compra:</strong> ${fecha}</p>
            </div>
  
            <table class="tabla">
              <tr>
                <th>Cantidad</th>
                <th>Artículo</th>
                <th>Precio</th>
              </tr>
              <tr>
                <td>1</td>
                <td>Pago por contrato #${venta.folio_contrato}</td>
                <td>$${venta.cobro_pago}</td>
              </tr>
            </table>
  
            <div class="datos">
              <p><strong>Abono:</strong> $${venta.cobro_pago}</p>
              <p><strong>Saldo Restante:</strong> $${venta.resta_pago}</p>
            </div>
  
            <div class="firma">
              ___________________________<br />
              Firma del Cliente
            </div>
          </div>
  
          <script>
            window.print();
          </script>
        </body>
      </html>
    `;

    reciboWindow.document.write(contenido);
    reciboWindow.document.close();
  };

  return (
    <div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[500px] justify-between"
          >
            {value
              ? clientes.find((cliente) => cliente.id_cliente === value)
                  ?.name_cliente
              : "Seleccionar cliente..."}
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[100%] p-0">
          <Command>
            <CommandInput
              placeholder="Buscar cliente..."
              className="h-9"
              onValueChange={(value) => handleSearch(value)}
            />
            <CommandList>
              {loading && <CommandEmpty>Cargando...</CommandEmpty>}
              {clientes.length === 0 && !loading && (
                <CommandEmpty>No se encontraron clientes.</CommandEmpty>
              )}
              <CommandGroup>
                {clientes.map((cliente) => (
                  <CommandItem
                    key={cliente.id_cliente}
                    value={cliente.id_cliente}
                    onSelect={() => handleSelectCliente(cliente.id_cliente)}
                  >
                    {cliente.name_cliente}
                    <Check
                      className={`ml-auto ${
                        value === cliente.id_cliente
                          ? "opacity-100"
                          : "opacity-0"
                      }`}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Mostrar la tarjeta del cliente seleccionado */}
      {selectedCliente && (
        <div className="mt-6 p-6 border rounded-xl shadow-lg bg-white max-w-3xl mx-auto">
          {/* Título de la tarjeta */}
          <div className="flex justify-between items-center border-b pb-4 mb-6">
            <h3 className="text-2xl font-semibold text-gray-800">
              Detalles de Pago del Cliente
            </h3>
          </div>

          {/* Información del Cliente */}
          <div className="space-y-4">
            <div className="flex justify-between">
              <p className="text-lg font-medium text-gray-600">Nombre:</p>
              <p className="text-lg text-gray-800">
                {selectedCliente.name_cliente}
              </p>
            </div>

            <div className="flex justify-between">
              <p className="text-lg font-medium text-gray-600">Dirección:</p>
              <p className="text-lg text-gray-800">
                {selectedCliente.adress_cliente}
              </p>
            </div>

            <div className="flex justify-between">
              <p className="text-lg font-medium text-gray-600">Ubicación:</p>
              <p className="text-lg text-gray-800">
                {selectedCliente.location}
              </p>
            </div>

            <div className="flex justify-between">
              <p className="text-lg font-medium text-gray-600">Teléfono:</p>
              <p className="text-lg text-gray-800">
                {selectedCliente.phone_number}
              </p>
            </div>
          </div>

          {/* Información de Ventas Generales */}
          {selectedCliente["Ventas Generales"] &&
            selectedCliente["Ventas Generales"].length > 0 && (
              <div className="mt-6 border-t pt-6">
                <h4 className="text-xl font-semibold text-gray-800">
                  Ventas Generales
                </h4>
                <hr />
                <br />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {selectedCliente["Ventas Generales"].map(
                    (venta: any, index: number) => (
                      <div
                        key={index}
                        className="bg-white shadow-lg rounded-lg p-6 space-y-4 border border-gray-200 hover:shadow-xl transition-shadow"
                      >
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <p className="text-sm font-medium text-gray-500">
                              Día de pago:
                            </p>
                            <p className="text-base text-gray-900">
                              {venta.dias_pago}
                            </p>
                          </div>
                          <div className="flex justify-between">
                            <p className="text-sm font-medium text-gray-500">
                              Cobro pago:
                            </p>
                            <p className="text-base text-gray-900">
                              ${venta.cobro_pago}
                            </p>
                          </div>
                          <div className="flex justify-between">
                            <p className="text-sm font-medium text-gray-500">
                              Folio contrato:
                            </p>
                            <p className="text-base text-gray-900">
                              {venta.folio_contrato}
                            </p>
                          </div>
                          <div className="flex justify-between">
                            <p className="text-sm font-medium text-gray-500">
                              Fecha de pago:
                            </p>
                            <p className="text-base text-gray-900">
                              {new Date(venta.fecha_pago).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex justify-between">
                            <p className="text-sm font-medium text-gray-500">
                              Restante por pagar:
                            </p>
                            <p className="text-base text-gray-900">
                              ${venta.resta_pago}
                            </p>
                          </div>
                          <div className="flex justify-between">
                            <p className="text-sm font-medium text-gray-500">
                              Total pago evento:
                            </p>
                            <p className="text-base text-gray-900">
                              ${venta.total_pago_evento}
                            </p>
                          </div>
                          <div className="flex justify-between">
                            <p className="text-sm font-medium text-gray-500">
                              Estado del pago:
                            </p>
                            <p
                              className={`text-base font-semibold ${
                                venta.status_pago === 1
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}
                            >
                              {venta.status_pago === 1 ? "Pagado" : "Pendiente"}
                            </p>
                          </div>
                        </div>
                        <div className="mt-4 space-y-2">
                          <button
                            onClick={() =>
                              handleRealizarPago(
                                venta,
                                selectedCliente.id_cliente
                              )
                            }
                            className="w-full px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors focus:outline-none"
                          >
                            Realizar pago
                          </button>
                          <button
                            onClick={() =>
                              handleImprimir(venta, selectedCliente)
                            }
                            className="w-full px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors focus:outline-none"
                          >
                            Imprimir
                          </button>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}
        </div>
      )}
    </div>
  );
}

function formatVentasGenerales(cliente: any) {
  // Verificamos si el cliente tiene las propiedades Venta y Cuenta_venta
  if (!cliente.Venta) {
    return null;
  }

  // Combinamos las ventas y cuentas de pago en un solo arreglo
  const ventasGenerales = cliente.Venta.map((venta: any) => {
    // Encontramos la cuenta de venta correspondiente a esta venta
    const cuenta = venta.Cuenta_venta.find(
      (c: any) => c.id_venta === venta.id_venta
    );

    // Si no hay cuenta de venta, retornamos null
    if (!cuenta) return null;

    // Retornamos el formato combinado
    return {
      id_venta: venta.id_venta,
      dias_pago: venta.dias_pago,
      cobro_pago: venta.cobro_pago,
      folio_contrato: venta.folio_contrato,
      fecha_pago: cuenta.fecha_pago,
      resta_pago: cuenta.resta_pago,
      total_pago_evento: cuenta.total_pago_evento,
      status_pago: cuenta.status_pago,
    };
  }).filter((venta: any) => venta !== null); // Filtramos los valores null si alguna venta no tiene cuenta

  // Retornamos el cliente con la nueva propiedad "Ventas Generales"
  return {
    ...cliente,
    "Ventas Generales": ventasGenerales,
  };
}
