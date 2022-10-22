import { ReactNode } from "react";
import Navbar from "./Navbar";

const PageLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Navbar />
      <div className="px-4 py-6">{children}</div>
    </>
  );
};

export default PageLayout;
