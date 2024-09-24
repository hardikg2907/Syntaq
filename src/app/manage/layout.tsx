import { auth } from "auth";
import { ReactNode } from "react";
import ManageSidebar from "~/components/ManageSidebar";
import SignInPrompt from "~/components/SignInPrompt";

export default async function ManageLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  const user = await auth();
  return (
    <div className="h-full w-full">
      {!user && (
        <SignInPrompt message="You need to Sign in to access this page" />
      )}
      <ManageSidebar />
      <div className="ml-14">{children}</div>
    </div>
  );
}
