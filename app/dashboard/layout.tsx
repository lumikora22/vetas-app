import SideNav from "@/components/ui/dashboard/sidenav";
import { getCurrentUserId, getUserRole } from "../login/actions"; // Importa la función que obtiene el rol
import { supabase } from "../lib/supabaseClient";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userId: string = await getCurrentUserId();

  console.log(userId);

  // Si el usuario está autenticado, obtener su rol
  const userRole: any = await getUserRole(userId);
  const roleSelected = userRole?.roles?.name ?? "invitado";
  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-64">
        <SideNav userRole={roleSelected} />
      </div>
      <div className="flex-grow p-6 md:overflow-y-auto md:p-12">{children}</div>
    </div>
  );
}
