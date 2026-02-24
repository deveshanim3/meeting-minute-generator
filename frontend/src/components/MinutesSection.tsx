"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface MinutesSectionProps {
    /** Section heading */
    title: string;
    /** Content to render inside the section */
    children: React.ReactNode;
    /** Whether the section starts expanded */
    defaultOpen?: boolean;
}

/**
 * Collapsible card section used in the minutes editor.
 * Displays a title with expand/collapse toggle and a divider.
 */
export default function MinutesSection({
    title,
    children,
    defaultOpen = true,
}: MinutesSectionProps) {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="card overflow-hidden">
            <button
                onClick={() => setIsOpen((prev) => !prev)}
                className="flex items-center justify-between w-full px-5 py-4 text-left hover:bg-gray-50 transition-colors"
            >
                <span className="section-title">{title}</span>
                {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-gray-500" />
                ) : (
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                )}
            </button>

            <div
                className={cn(
                    "transition-all duration-200",
                    isOpen ? "block" : "hidden"
                )}
            >
                <div className="h-px bg-border" />
                <div className="px-5 py-4">{children}</div>
            </div>
        </div>
    );
}
