import { unstable_noStore as noStore, revalidateTag } from "next/cache";
import { supabase } from "@/app/lib/supabaseClient";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
// import { Cliente } from "./types/definitions";
import { z } from "zod";

const FormSchema = z.object({
  id: z.string(),
  customerId: z.string({
    invalid_type_error: "Please select a customer.",
  }),
  amount: z.coerce
    .number()
    .gt(0, { message: "Please enter an amount greater than $0." }),
  status: z.enum(["pending", "paid"], {
    invalid_type_error: "Please select an invoice status.",
  }),
  date: z.string(),
});

export const fetchArticulos = async (): Promise<any[]> => {
  // const { data, error } = await supabase.from("Articulos").select("*");

  const { data, error } = await supabase.from("Articulos").select("*");

  // console.log(data);
  if (error) {
    throw new Error(error.message);
  }
  noStore();

  return data;
};

// const ITEMS_PER_PAGE = 6;
const ITEMS_PER_PAGE = 10;

export const fetchFilteredProducts = async (
  query: string,
  currentPage: number
): Promise<any> => {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  const { data, error } = await supabase
    .from("Articulos")
    .select(
      `
      id_articulo,
      created_at,
      name_articulo,
      precio_articulo,
      cantidad_articulo
    `
    )
    .ilike("name_articulo", `%${query}%`);
  //   .or(
  //     `
  //   precio_articulo::text.ilike.%${query}%,
  //   cantidad_articulo::text.ilike.%${query}%,
  //   created_at::text.ilike.%${query}%
  // `
  //   );
  // .order("created_at", { ascending: false });
  // .range(offset, offset + ITEMS_PER_PAGE - 1);

  // if (error) {
  //   throw new Error(error.message);
  // }

  return data;
};

export const fetchFilteredSales = async (
  query: string,
  currentPage: number
): Promise<any[]> => {
  const { data, error } = await supabase.from("Venta").select(`
      id_venta,
      folio_contrato,
      cobro_pago,
      start_date,
      end_date,
      dias_pago,
      Cliente(
        id_cliente,
        name_cliente,
        adress_cliente,
        location,
        phone_number
        ),
      Cobrador(
        id_cobrador,
        name_cobrador
      ), 
      Venta_articulo(
        Articulo:id_articulo(
        name_articulo,
        id_articulo,
        precio_articulo
      ),
        cantidad_venta,
        id_venta
      ),
      Cuenta_venta(
        id_pago,
        total_pago_evento,
        fecha_pago,
        status_pago,
        resta_pago
      ),
      cantidad_semanas_pago, 
      enganche`);

  // console.log(data);
  if (error) {
    throw new Error(error.message);
  }
  noStore();

  return data;
};

export const fetchColaborators = async (): Promise<any[]> => {
  const { data, error } = await supabase.from("Cobrador").select("*");

  // console.log(data);
  if (error) {
    throw new Error(error.message);
  }
  noStore();

  return data;
};

const CreateSale = FormSchema.omit({ id: true, date: true });
const UpdateInvoice = FormSchema.omit({ date: true, id: true });

export async function createSale(prevState: State, formData: FormData) {
  // Validate form fields using Zod
  const validatedFields = CreateSale.safeParse({
    customerId: formData.get("customerId"),
    amount: formData.get("amount"),
    status: formData.get("status"),
  });

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create Invoice.",
    };
  }

  // Prepare data for insertion into the database
  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split("T")[0];

  // Insert data into the database
  try {
    // await sql`
    //   INSERT INTO invoices (customer_id, amount, status, date)
    //   VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
    // `;
    return await supabase.from("Cliente").select("*");
  } catch (error) {
    // If a database error occurs, return a more specific error.
    return {
      message: "Database Error: Failed to Create Invoice.",
    };
  }

  // // Revalidate the cache for the invoices page and redirect the user.

  revalidatePath("/dashboard/invoices");
  redirect("/dashboard/invoices");
}

export const fetchCustomers = async (): Promise<any> => {
  const { data, error } = await supabase
    .from("Cliente")
    .select("id_cliente,name_cliente,adress_cliente");

  // console.log(data);
  if (error) {
    throw new Error(error.message);
  }
  noStore();

  return data;
};

export const fetchCustomersWithSaleInfoToPay = async (
  query: string
): Promise<any> => {
  const { data, error } = await supabase
    .from("Cliente")
    .select(
      `
      id_cliente,
      name_cliente,
      adress_cliente,
      Cuenta_venta (
        id_pago,
        created_at,
        id_cliente,
        id_cobrador,
        id_venta,
        total_pago_evento,
        fecha_pago,
        status_pago,
        resta_pago
      )
    `
    )
    .ilike("name_cliente", `%${query}%`);

  // console.log(data);
  if (error) {
    throw new Error(error.message);
  }
  noStore();

  return data;
};

export const fetchAllCustomersWithSaleInfoPay = async (): Promise<any> => {
  const { data, error } = await supabase.from("Cliente").select(
    `
      id_cliente,
      name_cliente,
      adress_cliente,
      location,
      phone_number,
      Venta(
        id_venta,
        folio_contrato,
        dias_pago,
        cobro_pago,
        Cuenta_venta (
        id_pago,
        created_at,
        id_venta,
        total_pago_evento,
        fecha_pago,
        status_pago,
        resta_pago
      )
      )
      
    `
  );

  console.log(data);
  if (error) {
    throw new Error(error.message);
  }
  noStore();

  return data;
};

export const fetchProductos = async () => {
  const { data, error } = await supabase.from("Articulos").select(`
      id_articulo,
      name_articulo,
      precio_articulo
    `);

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const savePagoPorConfirmar = async (id_pagos: any) => {
  // const { data, error } = await supabase.from("Articulos").select("*");
  const { data, error } = await supabase
    .from("Cobros_confirmar")
    .upsert(id_pagos)
    .select();

  if (error) {
    console.log(error);
    throw new Error(error.message);
  }
  // console.log(data);

  return data;
};

export const procesarRechazarPago = async (id_venta: any) => {
  try {
    // Obtener los datos actuales de la venta para conocer el valor de cobro_pago y resta_pago

    const { data: pagos, error: fetchError } = await supabase
      .from("Cobros_confirmar")
      .select(
        `
        id_venta
      `
      )
      .eq("id_venta", id_venta);

    console.log(pagos);

    if (fetchError) throw new Error(fetchError.message);

    if (pagos.length === 0) {
      throw new Error("No se encontró la venta para procesar.");
    }

    // Extraemos la información relevante
    const venta: any = pagos[0].id_venta;

    const { error: deleteError } = await supabase
      .from("Cobros_confirmar")
      .delete()
      .eq("id_venta", venta);

    if (deleteError) throw new Error(deleteError.message);

    console.log(`Pago rechazado correctamente para la venta ${id_venta}`);
  } catch (error: any) {
    console.error("Error procesando pago:", error.message);
    throw new Error(error.message);
  }
};

export const procesarConfirmacionPago = async (id_venta: any) => {
  try {
    // Obtener los datos actuales de la venta para conocer el valor de cobro_pago y resta_pago
    const { data: pagos, error: fetchError } = await supabase
      .from("Cobros_confirmar")
      .select(
        `
        Venta(
          cobro_pago,
          Cuenta_venta(
            id_pago,
            resta_pago,
            total_pago_evento
          )
        )
      `
      )
      .eq("id_venta", id_venta);

    if (fetchError) throw new Error(fetchError.message);

    if (pagos.length === 0) {
      throw new Error("No se encontró la venta para procesar.");
    }

    // Extraemos la información relevante
    const venta: any = pagos[0].Venta;
    const cuentaVenta = venta.Cuenta_venta[0]; // Acceder al primer elemento de Cuenta_venta

    // Verificamos si 'Cuenta_venta' tiene elementos
    if (!cuentaVenta) {
      throw new Error("No se encontró la información de Cuenta_venta.");
    }

    // Restamos el cobro_pago de resta_pago
    const nuevaRestaPago =
      cuentaVenta.resta_pago - cuentaVenta.total_pago_evento;

    console.log(nuevaRestaPago);
    // Actualizamos el valor de `resta_pago` en la tabla `Cuenta_venta`
    const { error: updateError } = await supabase
      .from("Cuenta_venta")
      .update({ resta_pago: nuevaRestaPago })
      .eq("id_pago", cuentaVenta.id_pago);

    if (updateError) throw new Error(updateError.message);

    // Ahora eliminamos el registro de `Cobros_confirmar` para esta venta
    const { error: deleteError, data } = await supabase
      .from("Cobros_confirmar")
      .delete()
      .eq("id_venta", id_venta);

    console.log(data);
    if (deleteError) throw new Error(deleteError.message);

    console.log(`Pago procesado correctamente para la venta ${id_venta}`);
  } catch (error: any) {
    console.error("Error procesando pago:", error.message);
    throw new Error(error.message);
  }
};

export const fetchPagosParaConfirmar = async () => {
  revalidateTag("cobros_confirmar");
  const { data, error } = await supabase.from("Cobros_confirmar").select(
    `
    id_venta,
    id_cliente,
    Cliente(
      id_cliente,
      name_cliente
    ),
    Venta(
      id_venta,
      folio_contrato,
      cobro_pago,
      start_date,
      Cuenta_venta(
        id_pago,
        resta_pago,
        fecha_pago
      )
    )
    `
  );

  console.log(data);
  if (error) {
    throw new Error(error.message);
  }

  noStore();
  // console.log(data);

  return data;
};

export const guardarVenta = async (
  venta: Venta & { articulos: ArticuloVenta[] }
) => {
  const { articulos, ...ventaData } = venta; // Desestructuramos el objeto venta para separar los artículos

  // Guardamos los datos de la venta en la tabla `Venta`
  const { data: ventaGuardada, error: errorVenta } = await supabase
    .from("Venta")
    .insert([ventaData])
    .select()
    .single(); // Usamos .single() ya que insertamos un solo registro

  if (errorVenta) {
    throw new Error(errorVenta.message);
  }

  // Ahora, vamos a guardar las relaciones en la tabla intermedia `Venta_articulo`
  const relacionesVenta: VentaArticulo[] = articulos.map((articulo) => ({
    id_venta: ventaGuardada.id_venta!, // Usamos '!' porque ahora sabemos que id_venta no es undefined
    id_articulo: articulo.id_articulo,
    cantidad_venta: articulo.cantidad,
  }));

  const { error: errorRelacion } = await supabase
    .from("Venta_articulo")
    .upsert(relacionesVenta); // upsert es útil para insertar o actualizar si ya existe una relación

  let totalVenta = 0;

  articulos.forEach((articulo) => {
    totalVenta += articulo.cantidad * articulo.precio_articulo;
  });
  const cuenta_venta = {
    created_at: ventaData.start_date,
    id_cliente: ventaData.id_cliente,
    id_cobrador: ventaData.id_cobrador,
    id_venta: ventaGuardada.id_venta,
    total_pago_evento: ventaGuardada.cobro_pago,
    fecha_pago: ventaData.start_date,
    status_pago: 2,
    resta_pago: totalVenta - ventaGuardada.enganche,
  };

  const { error: errorCuenta } = await supabase
    .from("Cuenta_venta")
    .insert([cuenta_venta]);

  if (errorCuenta) {
    throw new Error(errorCuenta.message);
  }

  if (errorRelacion) {
    throw new Error(errorRelacion.message);
  }

  return ventaGuardada; // Retornamos la venta guardada
};

type Venta = {
  id_venta?: number; // El id de la venta se asignará después de la inserción
  folio_contrato: string;
  dias_pago: string;
  cobro_pago: number;
  start_date: string;
  end_date: string;
  id_cliente: number;
  id_cobrador: number;
  cantidad_semanas_pago: number;
  enganche: number;
};

type ArticuloVenta = {
  id_articulo: number;
  cantidad: number;
  precio_articulo: number;
};

type VentaArticulo = {
  id_venta: number;
  id_articulo: number;
};

export type State = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
};
