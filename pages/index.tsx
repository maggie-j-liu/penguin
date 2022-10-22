import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";

export default function Component() {
  const { data: session, status } = useSession();
  return (
    <main>
      <section>
        <h1>Penguin</h1>
        {status === "authenticated" ? (
          <Link href="/dashboard">
            <a>Dashboard</a>
          </Link>
        ) : (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              signIn("google");
            }}
          >
            Sign In
          </button>
        )}
      </section>
    </main>
  );
}
