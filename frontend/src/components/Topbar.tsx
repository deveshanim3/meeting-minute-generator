"use client";

import { Bell, Search } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

interface TopbarProps {
    /** Page title displayed in the topbar */
    title: string;
}

/**
 * Top navigation bar displaying the page title, search, and notification icon.
 */
export default function Topbar({ title }: TopbarProps) {
    return (
        <header className="fixed top-0 right-0 left-sidebar h-topbar bg-white border-b border-gray-200 flex items-center justify-between px-6 z-20">
            <h1 className="page-title">{title}</h1>
            <div className="flex items-center gap-3">
                <ThemeToggle />
                <div className="relative hidden md:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                        type="search"
                        placeholder="Search…"
                        className="form-input pl-9 w-56 h-9 text-sm"
                    />
                </div>
                <button className="relative flex items-center justify-center w-9 h-9 rounded-lg hover:bg-gray-100 transition-colors">
                    <Bell className="w-4.5 h-4.5 text-gray-500" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full" />
                </button>
            </div>
        </header>
    );
}
