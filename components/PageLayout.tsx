import { ReactNode } from "react";
import Navbar from "./Navbar";

const PageLayout = ({
  children,
  crumbs = [],
  noNavbar = false,
}: {
  children: ReactNode;
  crumbs?: { text: string; link: string }[];
  noNavbar?: boolean;
}) => {
  return (
    <>
      {noNavbar ? null : <Navbar crumbs={crumbs} />}
      <div className="px-4 py-6">{children}</div>
    </>
  );
};

export default PageLayout;
