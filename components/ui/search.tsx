"use client";

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
type SearchProps = {
  placeholder: string;
  defaultValue?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};
export default function Search({
  placeholder,
  defaultValue,
  onChange,
}: SearchProps) {
  return (
    <input
      type="text"
      placeholder={placeholder}
      defaultValue={defaultValue}
      onChange={onChange}
      className="w-full rounded-md border px-3 py-2 text-sm shadow-sm md:w-80"
    />
  );
}
