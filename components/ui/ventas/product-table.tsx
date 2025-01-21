import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "../button";
import { TrashIcon } from "lucide-react";

export function ProductTable({
  products,
  onAmountChange,
  onDelete,
}: {
  products: any[];
  onAmountChange: (productId: any, newAmount: number) => void;
  onDelete: (productId: any) => void;
}) {
  return (
    <Table>
      <TableCaption>Productos Seleccionados</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Producto</TableHead>
          <TableHead className="w-[100px]">Precio</TableHead>
          {/* <TableHead className="w-[100px]">Existencias</TableHead> */}
          <TableHead className="w-[100px]">Cantidad</TableHead>
          <TableHead className="w-[100px]">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product, index) => (
          <TableRow key={`${product.id_articulo}-${index}`}>
            <TableCell className="font-medium">
              {product.name_articulo}
            </TableCell>
            <TableCell>${product.precio_articulo}</TableCell>
            {/* <TableCell>{product.cantidad_articulo}</TableCell>   */}
            <TableCell>
              <input
                type="number"
                value={product.amount}
                min="1"
                onChange={(e) =>
                  onAmountChange(product.id_articulo, parseInt(e.target.value))
                }
                className="w-full border rounded-md px-2 py-1"
              />
            </TableCell>
            <TableCell>
              <Button
                variant="destructive"
                onClick={() => onDelete(product.id_articulo)}
              >
                <TrashIcon className="text-white-500 h-5 w-5" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
