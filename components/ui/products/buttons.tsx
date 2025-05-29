import { PencilIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
// import { deleteInvoice } from '@/app/lib/actions';

// ("use client");
import { eliminarArticulo, guardarPrestamo } from "@/app/lib/data"; // Asegúrate de tener la función `guardarPrestamo`

import { guardarArticulo } from "@/app/lib/data";
import { editarArticulo } from "@/app/lib/data"; // Asegúrate de tener la función `guardarArticulo`
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface EditProductProps {
  product: {
    id_articulo: number;
    name_articulo: string;
    cantidad_articulo: number;
    precio_articulo: number;
  };
  onSuccess: () => void;
}

interface DeleteProductProps {
  id: number;
  name: string;
  onDeleted: () => void; // Para recargar tabla
}

// import { PlusIcon } from "lucide-react";

type CreateProductProps = {
  onSuccess: () => void; // Función callback para actualizar la tabla
};

type CreatePrestamoProps = {
  onSuccess: () => void; // Función para llamar cuando se guarde el préstamo
};

export function CreateProduct({ onSuccess }: CreateProductProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(""); // Estado para el nombre del artículo
  const [price, setPrice] = useState(0); // Estado para el precio del artículo
  const [quantity, setQuantity] = useState(0); // Estado para la cantidad del artículo
  const [error, setError] = useState<string | null>(null); // Estado para manejar errores
  const [success, setSuccess] = useState<string | null>(null); // Estado para manejar el éxito

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validar que todos los campos estén llenos
    if (!name || price <= 0 || quantity <= 0) {
      setError("Por favor, completa todos los campos correctamente.");
      return;
    }

    try {
      const articulo = {
        id_articulo: Date.now(), // Usar un ID temporal por ahora, luego lo ajustamos en base a la DB
        name_articulo: name,
        cantidad_articulo: quantity,
        precio_articulo: price,
      };

      // Llamamos a la función para guardar el artículo
      await guardarArticulo(articulo);

      setSuccess("Producto creado con éxito.");
      setError(null); // Limpiar cualquier error previo
      setName(""); // Limpiar campos
      setPrice(0);
      setQuantity(0);
      onSuccess(); // Llamar a la función de éxito para actualizar la tabla
      setOpen(false); // Cerrar el modal
    } catch (error) {
      setError(
        "Hubo un problema al guardar el artículo. Inténtalo nuevamente."
      );
      setSuccess(""); // Limpiar cualquier éxito anterior
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
          <span className="hidden md:block">Crear Producto</span>
          <PlusIcon className="h-5 md:ml-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Crear Producto</DialogTitle>
        </DialogHeader>
        {/* Aquí va tu formulario */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
          {/* Nombre del producto */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Nombre del producto
            </label>
            <input
              id="name"
              type="text"
              placeholder="Nombre del producto"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border p-2 rounded w-full"
            />
          </div>

          {/* Precio */}
          <div>
            <label
              htmlFor="price"
              className="block text-sm font-medium text-gray-700"
            >
              Precio
            </label>
            <input
              id="price"
              type="number"
              placeholder="Precio"
              value={price}
              onChange={(e) => setPrice(parseFloat(e.target.value))}
              className="border p-2 rounded w-full"
            />
          </div>

          {/* Cantidad */}
          <div>
            <label
              htmlFor="quantity"
              className="block text-sm font-medium text-gray-700"
            >
              Cantidad
            </label>
            <input
              id="quantity"
              type="number"
              placeholder="Cantidad"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
              className="border p-2 rounded w-full"
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
export function EditProduct({ product, onSuccess }: EditProductProps) {
  const [open, setOpen] = useState(false);
  const [id, setId] = useState(product.id_articulo);
  const [name, setName] = useState(product.name_articulo);
  const [price, setPrice] = useState(product.precio_articulo);
  const [quantity, setQuantity] = useState(product.cantidad_articulo);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      // Reset fields when dialog opens
      setId(product.id_articulo);
      setName(product.name_articulo);
      setPrice(product.precio_articulo);
      setQuantity(product.cantidad_articulo);
      setError(null);
      setSuccess(null);
    }
  }, [open, product]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || price <= 0 || quantity <= 0) {
      setError("Por favor, completa todos los campos correctamente.");
      return;
    }

    try {
      const updatedProduct = {
        id_articulo: id,
        name_articulo: name,
        precio_articulo: price,
        cantidad_articulo: quantity,
      };

      await editarArticulo(updatedProduct);

      setSuccess("Producto creado con éxito.");
      setError(null); // Limpiar cualquier error previo
      setName(""); // Limpiar campos
      setPrice(0);
      setQuantity(0);
      onSuccess(); // Llamar a la función de éxito para actualizar la tabla
      setOpen(false); // Cerrar el modal
    } catch (error) {
      setError("Error al actualizar el producto.");
      setSuccess(null);
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
          <DialogTitle>Editar Producto</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Nombre del producto
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border p-2 rounded w-full"
            />
          </div>

          <div>
            <label
              htmlFor="price"
              className="block text-sm font-medium text-gray-700"
            >
              Precio
            </label>
            <input
              id="price"
              type="number"
              value={price}
              onChange={(e) => setPrice(parseFloat(e.target.value))}
              className="border p-2 rounded w-full"
            />
          </div>

          <div>
            <label
              htmlFor="quantity"
              className="block text-sm font-medium text-gray-700"
            >
              Cantidad
            </label>
            <input
              id="quantity"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
              className="border p-2 rounded w-full"
            />
          </div>

          {error && <div className="text-red-500">{error}</div>}
          {success && <div className="text-green-500">{success}</div>}

          <Button type="submit" className="bg-blue-600 hover:bg-blue-500">
            Guardar cambios
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function DeleteProduct({ id, name, onDeleted }: DeleteProductProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setLoading(true);
      await eliminarArticulo(id); // Aquí llamas a tu función real de eliminación
      onDeleted(); // Notifica al padre para refrescar la tabla
      setOpen(false); // Cierra el modal
    } catch (error) {
      console.error("Error al eliminar:", error);
      alert("Error al eliminar el producto.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        variant="ghost"
        className="text-red-600 hover:bg-red-50"
        onClick={() => setOpen(true)}
      >
        <TrashIcon className="h-4 w-4" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Eliminar "{name}"?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-500">
            Esta acción no se puede deshacer.
          </p>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={loading}
            >
              {loading ? "Eliminando..." : "Eliminar"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
