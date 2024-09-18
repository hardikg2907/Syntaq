import { ReactNode } from "react";
import ManageSidebar from "~/components/ManageSidebar";

export default function ManageLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <div className="h-full w-full">
      <ManageSidebar />
      <div className="ml-14">{children}</div>
    </div>
  );
}
