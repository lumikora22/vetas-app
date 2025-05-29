"use client";
import {
  UserGroupIcon,
  HomeIcon,
  DocumentDuplicateIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const links = [
  {
    name: "Home",
    href: "/dashboard",
    icon: HomeIcon,
    roles: ["admin", "invitado"],
  },
  {
    name: "Productos",
    href: "/dashboard/productos",
    icon: UserGroupIcon,
    roles: ["admin"],
  },
  {
    name: "Ventas",
    href: "/dashboard/ventas",
    icon: DocumentDuplicateIcon,
    roles: ["admin"],
  },
  {
    name: "Registrar Venta",
    href: "/dashboard/registrar-venta",
    icon: DocumentDuplicateIcon,
    roles: ["admin"],
  },
  {
    name: "Registrar Pago",
    href: "/dashboard/pagos",
    icon: DocumentDuplicateIcon,
    roles: ["admin", "user"],
  },
  {
    name: "Aprobar Pagos",
    href: "/dashboard/aprobar-pagos",
    icon: DocumentDuplicateIcon,
    roles: ["admin"],
  },
  {
    name: "Clientes",
    href: "/dashboard/clientes",
    icon: UserGroupIcon,
    roles: ["admin", "invitado"],
  },
];

export default function NavLinks({ userRole }: { userRole: string }) {
  const pathname = usePathname();

  return (
    <>
      {links.map((link) => {
        if (!link.roles.includes(userRole)) return null;

        const isActive = pathname === link.href;

        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              "flex h-[48px] grow items-center justify-center gap-2 rounded-md p-3 text-sm font-medium transition-colors md:flex-none md:justify-start md:p-2 md:px-3",
              isActive
                ? "bg-sky-200 text-blue-700"
                : "bg-gray-50 hover:bg-sky-100 hover:text-blue-600"
            )}
          >
            <link.icon className="w-6" />
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
