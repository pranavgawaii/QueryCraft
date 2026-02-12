import { LogOut, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { useAuthStore } from "@/stores/authStore";
import { useToastStore } from "@/stores/toastStore";

export const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { pushToast } = useToastStore();

  const onLogout = async () => {
    await logout();
    pushToast({
      type: "info",
      title: "Logged out",
    });
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-30 border-b border-neutral-200 bg-white/80 backdrop-blur-lg dark:border-neutral-800 dark:bg-neutral-950/80">
      <div className="flex h-16 items-center justify-between px-6 lg:px-8">
        <button className="lg:hidden">
          <Menu className="h-6 w-6" />
        </button>

        <div className="ml-auto flex items-center gap-4">
          <div className="hidden text-right md:block">
            <p className="text-sm text-neutral-600 dark:text-neutral-400">{user?.email}</p>
          </div>

          <Button variant="ghost" size="sm" onClick={onLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
};
