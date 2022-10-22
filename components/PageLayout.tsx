import { ReactNode } from "react";

const PageLayout = ({ children }: { children: ReactNode }) => {
  return <div className="px-4 py-12">{children}</div>;
};

export default PageLayout;
