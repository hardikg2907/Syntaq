"use client";
import { useSession } from "next-auth/react";

export default function HomePage() {
  const { data: session, status } = useSession();
  // console.log(session);
  return (
    <div>
      {/* Hello */}
      {status === "loading" && <h2> Loading...</h2>}
      Hello
      {!(status === "loading") && session && (
        <>
          Signed in as {session?.user?.name}
          <br />
        </>
      )}
    </div>
  );
}
