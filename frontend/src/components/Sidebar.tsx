"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "firebase/auth";
import {
    LayoutDashboard,
    PlusCircle,
    Users,
    Settings,
    FileText,
    ChevronRight,
} from "lucide-react";
import { cn, getFallbackDisplayName } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { auth } from "@/lib/firebase";

const navItems = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "New Meeting", href: "/create", icon: PlusCircle },
    { label: "Workspace", href: "/workspace", icon: Users },
    { label: "Settings", href: "/settings", icon: Settings },
];

/**
 * Fixed 240px left sidebar with navigation links.
 * Highlights the currently active route.
 */
export default function Sidebar() {
    const pathname = usePathname();
    const { user } = useAuth();
    const displayName = user?.displayName || getFallbackDisplayName(user?.email);

    const initials =
        displayName
            ?.split(" ")
            .filter(Boolean)
            .slice(0, 2)
            .map((part) => part[0]?.toUpperCase())
            .join("") || user?.email?.slice(0, 2).toUpperCase() || "MM";

    return (
        <aside className="fixed left-0 top-0 h-screen w-sidebar bg-white border-r border-gray-200 flex flex-col z-30">
            {/* Logo */}
            <div className="flex items-center gap-2.5 px-5 h-topbar border-b border-gray-200 shrink-0">
                <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-lg">
                    <FileText className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-semibold text-gray-900">MeetMind</span>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
                <p className="px-3 mb-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Menu
                </p>
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive =
                        pathname === item.href || pathname.startsWith(item.href + "/");

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "sidebar-item",
                                isActive ? "sidebar-item-active" : "sidebar-item-inactive"
                            )}
                        >
                            <Icon className="w-4 h-4 shrink-0" />
                            <span className="flex-1">{item.label}</span>
                            {isActive && (
                                <ChevronRight className="w-3.5 h-3.5 text-primary opacity-60" />
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer */}
            <div className="px-3 py-4 border-t border-gray-200">
                <div className="flex items-center gap-3 px-3 py-2">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-100 text-primary text-xs font-semibold shrink-0">
                        {initials}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                            {displayName}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                            {user?.email || "No email available"}
                        </p>
                    </div>
                </div>
                <button
                    type="button"
                    className="btn-secondary w-full mt-2 text-xs"
                    onClick={() => signOut(auth)}
                >
                    Sign Out
                </button>
            </div>
        </aside>
    );
}
