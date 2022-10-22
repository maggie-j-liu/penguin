import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

const Navbar = () => {
  const { data: session, status } = useSession();

  return (
    <div className="flex justify-between px-4 py-2 text-lg">
      <Link href={status === "authenticated" ? "/dashboard" : "/"}>
        <a>
          <h1>🐧 Penguin</h1>
        </a>
      </Link>
      <p>
        {session?.user.email} |{" "}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            signOut();
          }}
        >
          Logout
        </button>
      </p>
    </div>
  );
};

export default Navbar;
