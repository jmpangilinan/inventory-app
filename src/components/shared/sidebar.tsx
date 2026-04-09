"use client";

import {
  BarChart3,
  Box,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  Tag,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import { useProductsLowStock } from "@/api/generated/products/products";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth.store";
import { ThemeToggle } from "./theme-toggle";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/products", label: "Products", icon: Package },
  { href: "/categories", label: "Categories", icon: Tag },
  { href: "/stock-transactions", label: "Stock Transactions", icon: Box },
  { href: "/audit-logs", label: "Audit Logs", icon: ClipboardList },
  { href: "/reports", label: "Reports", icon: BarChart3 },
];

function NavLink({
  href,
  label,
  icon: Icon,
  collapsed = false,
  onClick,
  badge,
}: {
  href: string;
  label: string;
  icon: React.ElementType;
  collapsed?: boolean;
  onClick?: () => void;
  badge?: number;
}) {
  const pathname = usePathname();
  const isActive = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));

  const link = (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
        "hover:bg-accent hover:text-accent-foreground",
        isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground",
        collapsed && "justify-center px-2",
      )}
    >
      <Icon className="size-4 shrink-0" />
      {!collapsed && <span className="flex-1">{label}</span>}
      {!collapsed && badge ? (
        <span className="flex size-5 items-center justify-center rounded-full bg-destructive text-[10px] font-semibold text-destructive-foreground">
          {badge > 99 ? "99+" : badge}
        </span>
      ) : null}
    </Link>
  );

  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger
          className={cn(
            "flex w-full items-center justify-center rounded-md p-2 transition-colors",
            "hover:bg-accent",
          )}
          render={<span />}
        >
          {link}
        </TooltipTrigger>
        <TooltipContent side="right">{label}</TooltipContent>
      </Tooltip>
    );
  }

  return link;
}

function UserMenu({ collapsed = false }: { collapsed?: boolean }) {
  const { user, clearAuth } = useAuthStore();
  const router = useRouter();

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  function handleLogout() {
    clearAuth();
    toast.success("Logged out");
    router.push("/login");
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium transition-colors hover:bg-accent",
          collapsed && "justify-center",
        )}
      >
        <Avatar className="size-7">
          <AvatarFallback className="text-xs">{initials}</AvatarFallback>
        </Avatar>
        {!collapsed && <span className="truncate">{user?.name ?? "User"}</span>}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <div className="px-2 py-1.5">
          <p className="text-sm font-medium">{user?.name}</p>
          <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleLogout}
          className="text-destructive focus:text-destructive"
        >
          <LogOut className="mr-2 size-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function SidebarContent({ onNavClick }: { onNavClick?: () => void }) {
  const { data: lowStockData } = useProductsLowStock();
  const lowStockCount = lowStockData?.data?.length ?? 0;

  return (
    <>
      <div className="flex h-14 items-center gap-2 border-b px-4">
        <Package className="size-5 text-primary" />
        <span className="text-sm font-semibold">Inventory App</span>
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto p-2">
        {navItems.map((item) => (
          <NavLink
            key={item.href}
            {...item}
            onClick={onNavClick}
            badge={item.href === "/products" && lowStockCount > 0 ? lowStockCount : undefined}
          />
        ))}
      </nav>

      <div className="space-y-1 border-t p-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs text-muted-foreground">Theme</span>
          <ThemeToggle />
        </div>
        <Separator className="my-1" />
        <UserMenu />
      </div>
    </>
  );
}

export function Sidebar() {
  return (
    <aside className="sticky top-0 hidden h-screen w-56 flex-col border-r bg-background lg:flex">
      <SidebarContent />
    </aside>
  );
}

export function MobileSidebar() {
  return (
    <Sheet>
      <SheetTrigger
        className="inline-flex size-9 items-center justify-center rounded-md hover:bg-accent lg:hidden"
        aria-label="Toggle menu"
      >
        <Menu className="size-5" />
      </SheetTrigger>
      <SheetContent side="left" className="w-56 p-0">
        <SheetTitle className="sr-only">Navigation</SheetTitle>
        <div className="flex h-full flex-col">
          <SidebarContent />
        </div>
      </SheetContent>
    </Sheet>
  );
}
