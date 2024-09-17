import { ReactNode } from "react";

export default function ManageLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return <div className="h-full w-full bg-red-200">{children}</div>;
}
