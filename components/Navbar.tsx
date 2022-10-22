import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

const Navbar = () => {
  const { data: session, status } = useSession();

  return (
    <div className="flex justify-between px-4 py-2 text-lg">
      <Link href={status === "authenticated" ? "/dashboard" : "/"}>
        <a className="-mx-2 rounded-md px-2 py-0.5 duration-150 hover:bg-gray-200">
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
          className="-mx-2 rounded-md px-2 py-0.5 duration-150 hover:bg-gray-200"
        >
          Logout
        </button>
      </p>
    </div>
  );
};

export default Navbar;
