import { auth } from "auth";
import ManageSidebarOptions from "./ManageSidebarOptions";
import { LoginUserButton } from "./navbar/login-user-button";

const ManageSidebar = async () => {
  const user = await auth();
  return (
    <aside className="fixed inset-y-0 left-0 z-10 flex w-14 flex-col border-r transition-all">
      <ManageSidebarOptions />
      <nav className="mt-auto flex flex-col items-center px-2 py-5">
        {/* <Link
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
              > */}
        <LoginUserButton session={user} />
        <span className="sr-only">Profile</span>
        {/* </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Profile</TooltipContent>
          </Tooltip> */}
      </nav>
    </aside>
  );
};

export default ManageSidebar;
