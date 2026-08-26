"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderKanban,
  MapPin,
  Map,
  IndianRupee,
  FileText,
  Bell,
  BarChart3,
  ClipboardList,
  Settings,
} from "lucide-react";

const navItems = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Projects", href: "/dashboard/projects", icon: FolderKanban },
  { label: "Parcels", href: "/dashboard/parcels", icon: MapPin },
  { label: "GIS Map", href: "/dashboard/gis-map", icon: Map },
  { label: "Compensation", href: "/dashboard/compensation", icon: IndianRupee },
  { label: "Documents", href: "/dashboard/documents", icon: FileText },
  { label: "Notifications", href: "/dashboard/notifications", icon: Bell },
  { label: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { label: "Reports", href: "/dashboard/reports", icon: ClipboardList },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex w-56 shrink-0 flex-col border-r border-white/10 bg-navy-dark text-white min-h-[calc(100vh-64px)]">
      <nav className="flex flex-col gap-1 p-3">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || pathname?.startsWith(item.href + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
                isActive
                  ? "bg-gold text-navy-dark font-semibold"
                  : "text-slate-300 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon size={16} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
