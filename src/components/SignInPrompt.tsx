"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { useRouter } from "next/navigation";

interface SignInPromptProps {
  message?: string;
  redirect?: string;
}

const SignInPrompt = ({ message, redirect }: SignInPromptProps) => {
  const router = useRouter();

  return (
    <Dialog modal open={true}>
      <DialogContent>
        {/* <DialogTitle className="text-center">Sign In</DialogTitle> */}
        <p className="text-center">{message}</p>
        <Button
          onClick={() =>
            router.push(`/api/auth/signin?callbackUrl=${window.location.href}`)
          }
        >
          Sign In
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default SignInPrompt;
