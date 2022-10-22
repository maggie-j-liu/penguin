import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

const Navbar = ({
  crumbs = [],
}: {
  crumbs?: { text: string; link: string }[];
}) => {
  const { data: session, status } = useSession();

  return (
    <nav className="flex justify-between px-4 py-2 text-lg">
      <div>
        <Link href={status === "authenticated" ? "/dashboard" : "/"}>
          <a className="rounded-md px-2 py-0.5 duration-150 hover:bg-gray-200">
            🐧 Penguin
          </a>
        </Link>
        {crumbs.length > 0
          ? crumbs.map((crumb, i) => (
              <span key={i}>
                {" "}
                /{" "}
                <Link href={crumb.link}>
                  <a className="rounded-md px-2 py-0.5 duration-150 hover:underline">
                    {crumb.text}
                  </a>
                </Link>
              </span>
            ))
          : null}
      </div>
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
    </nav>
  );
};

export default Navbar;
