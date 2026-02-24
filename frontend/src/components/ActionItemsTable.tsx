"use client";

import { useState } from "react";
import { Pencil, Trash2, Check, X } from "lucide-react";
import { ActionItem, ActionItemStatus } from "@/types";
import { formatDate } from "@/lib/utils";
import StatusBadge from "./StatusBadge";

interface ActionItemsTableProps {
    /** List of action items */
    items: ActionItem[];
    /** Callback when an item is updated */
    onUpdate?: (updated: ActionItem) => void;
    /** Callback when an item is deleted */
    onDelete?: (id: string) => void;
}

const STATUS_OPTIONS: ActionItemStatus[] = ["pending", "in-progress", "done"];

/**
 * Editable table of action items with inline editing.
 * Shows "Unclear" / "Not specified" for missing owner/deadline.
 */
export default function ActionItemsTable({
    items,
    onUpdate,
    onDelete,
}: ActionItemsTableProps) {
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editValues, setEditValues] = useState<Partial<ActionItem>>({});

    const startEdit = (item: ActionItem) => {
        setEditingId(item.id);
        setEditValues({ ...item });
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditValues({});
    };

    const saveEdit = (item: ActionItem) => {
        onUpdate?.({ ...item, ...editValues });
        setEditingId(null);
        setEditValues({});
    };

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
                <thead>
                    <tr className="border-b border-gray-200">
                        <th className="text-left text-xs font-medium text-gray-500 pb-3 pr-4 w-[40%]">
                            Task
                        </th>
                        <th className="text-left text-xs font-medium text-gray-500 pb-3 pr-4 w-[18%]">
                            Owner
                        </th>
                        <th className="text-left text-xs font-medium text-gray-500 pb-3 pr-4 w-[18%]">
                            Deadline
                        </th>
                        <th className="text-left text-xs font-medium text-gray-500 pb-3 pr-4 w-[14%]">
                            Status
                        </th>
                        <th className="text-left text-xs font-medium text-gray-500 pb-3 w-[10%]">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-border">
                    {items.map((item) => {
                        const isEditing = editingId === item.id;
                        return (
                            <tr key={item.id} className="group">
                                {/* Task */}
                                <td className="py-3 pr-4 align-top">
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={editValues.task ?? ""}
                                            onChange={(e) =>
                                                setEditValues((v) => ({ ...v, task: e.target.value }))
                                            }
                                            className="form-input text-sm py-1"
                                        />
                                    ) : (
                                        <span className="text-gray-900 leading-relaxed">
                                            {item.task}
                                        </span>
                                    )}
                                </td>

                                {/* Owner */}
                                <td className="py-3 pr-4 align-top">
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={editValues.owner ?? ""}
                                            placeholder="Assign owner"
                                            onChange={(e) =>
                                                setEditValues((v) => ({
                                                    ...v,
                                                    owner: e.target.value || null,
                                                }))
                                            }
                                            className="form-input text-sm py-1"
                                        />
                                    ) : item.owner ? (
                                        <span className="text-gray-900">{item.owner}</span>
                                    ) : (
                                        <span className="text-xs font-medium text-warning-text bg-warning-light px-2 py-0.5 rounded-full">
                                            Unclear
                                        </span>
                                    )}
                                </td>

                                {/* Deadline */}
                                <td className="py-3 pr-4 align-top">
                                    {isEditing ? (
                                        <input
                                            type="date"
                                            value={
                                                editValues.deadline
                                                    ? editValues.deadline.slice(0, 10)
                                                    : ""
                                            }
                                            onChange={(e) =>
                                                setEditValues((v) => ({
                                                    ...v,
                                                    deadline: e.target.value
                                                        ? new Date(e.target.value).toISOString()
                                                        : null,
                                                }))
                                            }
                                            className="form-input text-sm py-1"
                                        />
                                    ) : item.deadline ? (
                                        <span className="text-gray-900">
                                            {formatDate(item.deadline, "MMM d, yyyy")}
                                        </span>
                                    ) : (
                                        <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                                            Not specified
                                        </span>
                                    )}
                                </td>

                                {/* Status */}
                                <td className="py-3 pr-4 align-top">
                                    {isEditing ? (
                                        <select
                                            value={editValues.status ?? item.status}
                                            onChange={(e) =>
                                                setEditValues((v) => ({
                                                    ...v,
                                                    status: e.target.value as ActionItemStatus,
                                                }))
                                            }
                                            className="form-input text-sm py-1"
                                        >
                                            {STATUS_OPTIONS.map((s) => (
                                                <option key={s} value={s}>
                                                    {s === "in-progress"
                                                        ? "In Progress"
                                                        : s.charAt(0).toUpperCase() + s.slice(1)}
                                                </option>
                                            ))}
                                        </select>
                                    ) : (
                                        <StatusBadge variant={item.status} />
                                    )}
                                </td>

                                {/* Actions */}
                                <td className="py-3 align-top">
                                    <div className="flex items-center gap-1.5">
                                        {isEditing ? (
                                            <>
                                                <button
                                                    onClick={() => saveEdit(item)}
                                                    className="flex items-center justify-center w-7 h-7 rounded-md hover:bg-success-light text-success transition-colors"
                                                    aria-label="Save"
                                                >
                                                    <Check className="w-3.5 h-3.5" />
                                                </button>
                                                <button
                                                    onClick={cancelEdit}
                                                    className="flex items-center justify-center w-7 h-7 rounded-md hover:bg-danger-light text-danger transition-colors"
                                                    aria-label="Cancel"
                                                >
                                                    <X className="w-3.5 h-3.5" />
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <button
                                                    onClick={() => startEdit(item)}
                                                    className="flex items-center justify-center w-7 h-7 rounded-md hover:bg-gray-100 text-gray-500 hover:text-primary transition-colors opacity-0 group-hover:opacity-100"
                                                    aria-label="Edit"
                                                >
                                                    <Pencil className="w-3.5 h-3.5" />
                                                </button>
                                                <button
                                                    onClick={() => onDelete?.(item.id)}
                                                    className="flex items-center justify-center w-7 h-7 rounded-md hover:bg-danger-light text-gray-500 hover:text-danger transition-colors opacity-0 group-hover:opacity-100"
                                                    aria-label="Delete"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            {items.length === 0 && (
                <p className="py-6 text-center text-sm text-gray-500">
                    No action items found.
                </p>
            )}
        </div>
    );
}
