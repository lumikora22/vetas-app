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

import { useState } from "react";

const CurrencyInput = ({ field, form }: any) => {
  const [inputValue, setInputValue] = useState(field.value.toFixed(2));

  return (
    <FormItem className="w-[40%]">
      <FormLabel>Cobro por Semana</FormLabel>
      <FormControl>
        <div className="flex items-center space-x-2 w-[100%]">
          <span className="text-gray-500">$</span>
          <Input
            className="w-[100%]"
            type="number"
            step="0.01" // Acepta decimales
            placeholder="0.00"
            value={inputValue}
            onChange={(e) => {
              const value = parseFloat(e.target.value);
              setInputValue(e.target.value); // Actualizar el valor mientras se escribe
              if (!isNaN(value)) {
                field.onChange(value); // Guardar el valor numérico
              }
            }}
            onBlur={() => {
              // Formatear con dos decimales al perder el foco
              setInputValue(parseFloat(inputValue).toFixed(2));
            }}
          />
        </div>
      </FormControl>
      <FormMessage />
    </FormItem>
  );
};

export { CurrencyInput };
