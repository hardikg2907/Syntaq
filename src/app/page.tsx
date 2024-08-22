"use client";
import { signIn, signOut, useSession } from "next-auth/react";

export default function HomePage() {
  const { data: session, status } = useSession();
  // console.log(session);
  return (
    <div>
      {/* Hello */}
      {status === "loading" && <h2> Loading...</h2>}
      {!(status === "loading") && !session && (
        <>
          Not signed in <br />
          <button onClick={() => signIn()}>Sign in</button>
          <pre>{!session && "User is not logged in"}</pre>
        </>
      )}
      {!(status === "loading") && session && (
        <>
          Signed in as {session.user?.email} <br />
          <button onClick={() => signOut()}>Sign out</button>
        </>
      )}
    </div>
  );
}
