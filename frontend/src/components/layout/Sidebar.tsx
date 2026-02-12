import { Database, FolderOpen, Home, Settings, Wrench } from "lucide-react";
import { NavLink } from "react-router-dom";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

const items = [
  { to: "/dashboard", label: "Dashboard", icon: Home },
  { to: "/query-builder", label: "Query Builder", icon: Wrench },
  { to: "/connections", label: "Connections", icon: Database },
  { to: "/saved-queries", label: "Saved Queries", icon: FolderOpen },
  { to: "/settings", label: "Settings", icon: Settings },
];

export const Sidebar = () => {
  return (
    <aside className="hidden w-64 border-r border-neutral-200 px-6 py-6 dark:border-neutral-800 lg:block">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Database className="h-6 w-6" />
          <span className="text-lg font-semibold">QueryCraft</span>
        </div>
        <ThemeToggle />
      </div>

      <nav className="space-y-1">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                  isActive
                    ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
                    : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-900 dark:hover:text-white"
                }`
              }
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};
