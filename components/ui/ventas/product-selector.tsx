import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Button } from "../button";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function ProductSelector({
  products,
  onProductSelect,
}: {
  products: any[];
  onProductSelect: (product: any) => void;
}) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[100%] justify-between"
        >
          {value
            ? products.find(
                (product) => product.id_articulo.toString() === value
              )?.name_articulo || "Producto no encontrado"
            : "Buscar Producto..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[100%] p-0">
        <Command>
          <CommandInput placeholder="Buscar Productos..." />
          <CommandList>
            <CommandEmpty>Producto no encontrado.</CommandEmpty>
            <CommandGroup>
              {products.map((product) => (
                <CommandItem
                  key={product.id_articulo}
                  value={product.id_articulo.toString()}
                  onSelect={(currentValue) => {
                    setValue(currentValue);
                    setOpen(false);
                    const selectedProduct = products.find(
                      (product) =>
                        product.id_articulo.toString() === currentValue
                    );
                    if (selectedProduct) {
                      onProductSelect(selectedProduct);
                    }
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === product.id_articulo.toString()
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  {product.name_articulo} ${product.precio_articulo}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
