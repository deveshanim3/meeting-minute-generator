import { cn } from "@/lib/utils";
import { MeetingStatus, ActionItemStatus } from "@/types";

type BadgeVariant = MeetingStatus | ActionItemStatus | "admin" | "editor" | "viewer";

const variantMap: Record<BadgeVariant, string> = {
    queued: "bg-warning-light text-warning-text",
    processing: "bg-primary-50 text-primary",
    completed: "bg-success-light text-success-text",
    failed: "bg-danger-light text-danger-text",
    pending: "bg-gray-100 text-gray-500",
    "in-progress": "bg-primary-50 text-primary",
    done: "bg-success-light text-success-text",
    admin: "bg-primary-50 text-primary",
    editor: "bg-gray-100 text-gray-900",
    viewer: "bg-gray-50 text-gray-500",
};

const labelMap: Record<BadgeVariant, string> = {
    queued: "Queued",
    processing: "Processing",
    completed: "Completed",
    failed: "Failed",
    pending: "Pending",
    "in-progress": "In Progress",
    done: "Done",
    admin: "Admin",
    editor: "Editor",
    viewer: "Viewer",
};

interface StatusBadgeProps {
    /** The variant/status to display */
    variant: BadgeVariant;
    /** Optional override label */
    label?: string;
    className?: string;
}

/**
 * A small pill-shaped badge for displaying status, role, or category labels.
 * Colors are mapped from the design system tokens.
 */
export default function StatusBadge({ variant, label, className }: StatusBadgeProps) {
    return (
        <span
            className={cn(
                "inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full",
                variantMap[variant],
                className
            )}
        >
            {label ?? labelMap[variant]}
        </span>
    );
}
