import { ReactNode } from "react";
import Navbar from "./Navbar";

const PageLayout = ({
  children,
  crumbs = [],
}: {
  children: ReactNode;
  crumbs?: { text: string; link: string }[];
}) => {
  return (
    <>
      <Navbar crumbs={crumbs} />
      <div className="px-4 py-6">{children}</div>
    </>
  );
};

export default PageLayout;
