import { useSession } from "next-auth/react";
import Image from "next/future/image";
import Link from "next/link";

const Navbar = () => {
  const { data: session, status } = useSession();

  return (
    <div className="flex justify-between px-4 py-2">
      <Link href={status === "authenticated" ? "/dashboard" : "/"}>
        <a>
          <h1>Penguin</h1>
        </a>
      </Link>
      <p>{session?.user.email}</p>
    </div>
  );
};

export default Navbar;
