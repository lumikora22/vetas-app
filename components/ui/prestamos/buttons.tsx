import { PencilIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
// import { deleteInvoice } from '@/app/lib/actions';

// ("use client");
import {
  editarPrestamo,
  eliminarArticulo,
  eliminarPrestamo,
  guardarPrestamo,
} from "@/app/lib/data"; // Asegúrate de tener la función `guardarPrestamo`

import { guardarArticulo } from "@/app/lib/data";
import { editarArticulo } from "@/app/lib/data"; // Asegúrate de tener la función `guardarArticulo`
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface EditLoanProps {
  loan: {
    id_prestamo: number;
    subtotal_prestamo: number;
    interes: number;
    total_prestamo: number;
  };
  onUpdated: () => void;
}

interface DeleteLoanProps {
  id: number;
  name: string;
  onDeleted: () => void; // Para recargar tabla
}

// import { PlusIcon } from "lucide-react";

export function CreateLoan({ onSuccess }: { onSuccess: () => void }) {
  const [open, setOpen] = useState(false);
  const [subTotal, setSubTotal] = useState(0); // Estado para el subtotal del préstamo
  const [interest, setInterest] = useState(0); // Estado para el interés
  const [totalLoan, setTotalLoan] = useState(0); // Estado para el total del préstamo (se calcula automáticamente)
  const [error, setError] = useState<string | null>(null); // Estado para manejar errores
  const [success, setSuccess] = useState<string | null>(null); // Estado para manejar el éxito

  // Calcular el total del préstamo cuando cambian el subtotal o el interés
  const calculateTotalLoan = (subTotal: number, interest: number) => {
    const total = subTotal + subTotal * (interest / 100);
    setTotalLoan(total);
  };

  // Manejador de envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validar que todos los campos estén llenos
    if (subTotal <= 0 || interest < 0) {
      setError("Por favor, completa todos los campos correctamente.");
      return;
    }

    try {
      const prestamo = {
        id_prestamo: Date.now(), // Usar un ID temporal por ahora, luego lo ajustamos en base a la DB
        subtotal_prestamo: subTotal,
        interes: interest,
        total_prestamo: totalLoan, // Usamos el total calculado
      };

      // Llamamos a la función para guardar el préstamo
      await guardarPrestamo(prestamo);

      setSuccess("Préstamo creado con éxito.");
      setError(null); // Limpiar cualquier error previo
      setSubTotal(0);
      setInterest(0);
      setTotalLoan(0); // Limpiar el total
      onSuccess(); // Llamar a la función de éxito para actualizar la tabla
      setOpen(false); // Cerrar el modal
    } catch (error) {
      setError(
        "Hubo un problema al guardar el préstamo. Inténtalo nuevamente."
      );
      setSuccess(""); // Limpiar cualquier éxito anterior
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
          <span className="hidden md:block">Crear Préstamo</span>
          <PlusIcon className="h-5 md:ml-4" />
          {/* Icono para crear */}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Crear Préstamo</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
          {/* Subtotal */}
          <div>
            <label
              htmlFor="subTotal"
              className="block text-sm font-medium text-gray-700"
            >
              Subtotal del Préstamo
            </label>
            <input
              id="subTotal"
              type="number"
              placeholder="Subtotal"
              value={subTotal}
              onChange={(e) => {
                const value = parseFloat(e.target.value);
                setSubTotal(value);
                calculateTotalLoan(value, interest); // Recalcular el total
              }}
              className="border p-2 rounded w-full"
            />
          </div>

          {/* Interés */}
          <div>
            <label
              htmlFor="interest"
              className="block text-sm font-medium text-gray-700"
            >
              Interés (%)
            </label>
            <input
              id="interest"
              type="number"
              placeholder="Interés"
              value={interest}
              onChange={(e) => {
                const value = parseFloat(e.target.value);
                setInterest(value);
                calculateTotalLoan(subTotal, value); // Recalcular el total
              }}
              className="border p-2 rounded w-full"
            />
          </div>

          {/* Total del préstamo */}
          <div>
            <label
              htmlFor="totalLoan"
              className="block text-sm font-medium text-gray-700"
            >
              Total del Préstamo
            </label>
            <input
              id="totalLoan"
              type="number"
              value={totalLoan}
              readOnly
              className="border p-2 rounded w-full bg-gray-200"
            />
          </div>

          {/* Mensajes de error y éxito */}
          {error && <div className="text-red-500">{error}</div>}
          {success && <div className="text-green-500">{success}</div>}

          {/* Botón para guardar */}
          <Button type="submit" className="bg-blue-600 hover:bg-blue-500">
            Guardar
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
export function EditLoan({ loan, onUpdated }: EditLoanProps) {
  const [open, setOpen] = useState(false);
  const [subTotal, setSubTotal] = useState(loan.subtotal_prestamo);
  const [interest, setInterest] = useState(loan.interes);
  const [totalLoan, setTotalLoan] = useState(loan.total_prestamo);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const calculateTotalLoan = (subTotal: number, interest: number) => {
    const total = subTotal + subTotal * (interest / 100);
    setTotalLoan(total);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (subTotal <= 0 || interest < 0) {
      setError("Por favor, completa todos los campos correctamente.");
      return;
    }

    try {
      await editarPrestamo({
        id_prestamo: loan.id_prestamo,
        subtotal_prestamo: subTotal,
        interes: interest,
        total_prestamo: totalLoan,
      });

      setSuccess("Préstamo actualizado correctamente.");
      setError(null);
      onUpdated(); // refrescar tabla
      setOpen(false); // cerrar modal
    } catch (error) {
      setError("No se pudo actualizar el préstamo. Intenta nuevamente.");
    }
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
          <DialogTitle>Editar Préstamo</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
          <div>
            <label
              htmlFor="subTotal"
              className="block text-sm font-medium text-gray-700"
            >
              Subtotal del Préstamo
            </label>
            <input
              id="subTotal"
              type="number"
              placeholder="Subtotal"
              value={subTotal}
              onChange={(e) => {
                const value = parseFloat(e.target.value);
                setSubTotal(value);
                calculateTotalLoan(value, interest);
              }}
              className="border p-2 rounded w-full"
            />
          </div>

          <div>
            <label
              htmlFor="interest"
              className="block text-sm font-medium text-gray-700"
            >
              Interés (%)
            </label>
            <input
              id="interest"
              type="number"
              placeholder="Interés"
              value={interest}
              onChange={(e) => {
                const value = parseFloat(e.target.value);
                setInterest(value);
                calculateTotalLoan(subTotal, value);
              }}
              className="border p-2 rounded w-full"
            />
          </div>

          <div>
            <label
              htmlFor="totalLoan"
              className="block text-sm font-medium text-gray-700"
            >
              Total del Préstamo
            </label>
            <input
              id="totalLoan"
              type="number"
              value={totalLoan}
              readOnly
              className="border p-2 rounded w-full bg-gray-200"
            />
          </div>

          {error && <div className="text-red-500">{error}</div>}
          {success && <div className="text-green-500">{success}</div>}

          <Button type="submit" className="bg-blue-600 hover:bg-blue-500">
            Guardar Cambios
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function DeleteLoan({
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
      await eliminarPrestamo(loanId);
      // toast.success("Préstamo eliminado exitosamente.");
      setOpen(false);
      onDeleted();
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
          <DialogTitle>¿Eliminar préstamo?</DialogTitle>
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
