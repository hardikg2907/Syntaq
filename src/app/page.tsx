import { auth } from "auth";

export default async function HomePage() {
  const session = await auth();
  // console.log(JSON.stringify(session, null, 2));
  return (
    <div>
      Hello
      {session && (
        <>
          {" "}
          Signed in as {session?.name}
          <br />
        </>
      )}
      {/* {JSON.stringify(data, null, 2)} */}
    </div>
  );
}
