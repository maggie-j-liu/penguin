import { useSession } from "next-auth/react";
import Image from "next/future/image";

const Navbar = () => {
  const { data: session, status } = useSession();

  return (
    <div className="flex justify-between px-4 py-2">
      <h1>Penguin</h1>
      <p>{session?.user.email}</p>
    </div>
  );
};

export default Navbar;
