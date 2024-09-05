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
      <DialogHeader>
        <DialogTitle>
          <h1>Sign In</h1>
        </DialogTitle>
      </DialogHeader>
      <DialogContent>
        <p>{message}</p>
        <Button
          onClick={() =>
            router.push(
              `/api/auth/signin?callbackUrl=http://localhost:3000/${redirect}`,
            )
          }
        >
          Sign In
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default SignInPrompt;
