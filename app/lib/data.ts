import { unstable_noStore as noStore } from "next/cache";
import { supabase } from "@/app/lib/supabaseClient";
// import { Cliente } from "./types/definitions";

const fetchArticulos = async (): Promise<any[]> => {
  // const { data, error } = await supabase.from("Articulo_venta").select("*");

  const { data, error } = await supabase.from("Articulo_venta").select("*");

  console.log(data);
  if (error) {
    throw new Error(error.message);
  }
  noStore();

  return data;
};
