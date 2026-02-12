import { Database } from "lucide-react";
import { Link } from "react-router-dom";
import { LoginForm } from "@/components/auth/LoginForm";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export const Login = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <nav className="border-b border-neutral-200 dark:border-neutral-800">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex h-16 items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <Database className="h-6 w-6" />
              <span className="text-lg font-semibold">QueryCraft</span>
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </nav>
      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <LoginForm />
      </div>
    </div>
  );
};
