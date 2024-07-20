import { auth } from "@clerk/nextjs/server";

export default function HomePage() {
  const user = auth();
  return <div>Hello {user.userId}</div>;
}
