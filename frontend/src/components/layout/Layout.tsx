import type { ReactNode } from "react";

import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen">
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <Navbar />
          <main className="flex-1 px-6 py-8 lg:px-8">{children}</main>
        </div>
      </div>
    </div>
  );
};
