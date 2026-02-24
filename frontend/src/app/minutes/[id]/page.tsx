"use client";

import { useState } from "react";
import { Download, RefreshCw } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import MinutesSection from "@/components/MinutesSection";
import ActionItemsTable from "@/components/ActionItemsTable";
import ExportModal from "@/components/ExportModal";
import { MOCK_MINUTES } from "@/lib/mockData";
import { ActionItem } from "@/types";

/**
 * Minutes editor page: transcript panel on left, structured minutes on right.
 */
export default function MinutesPage() {
    const [minutes, setMinutes] = useState(MOCK_MINUTES);
    const [isExportOpen, setIsExportOpen] = useState(false);

    const handleActionUpdate = (updated: ActionItem) => {
        setMinutes((prev) => ({
            ...prev,
            actionItems: prev.actionItems.map((a) =>
                a.id === updated.id ? updated : a
            ),
        }));
    };

    const handleActionDelete = (id: string) => {
        setMinutes((prev) => ({
            ...prev,
            actionItems: prev.actionItems.filter((a) => a.id !== id),
        }));
    };

    return (
        <AppLayout title="Meeting Minutes">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-base font-semibold text-textPrimary">
                        Q1 Product Roadmap Review
                    </h2>
                    <p className="text-xs text-textSecondary mt-0.5">
                        January 15, 2024 · 8 participants
                    </p>
                </div>
                <button
                    onClick={() => setIsExportOpen(true)}
                    className="btn-primary text-sm"
                >
                    <Download className="w-4 h-4" />
                    Export
                </button>
            </div>

            {/* Two-column layout */}
            <div className="flex gap-5 min-h-[calc(100vh-14rem)]">
                {/* Left: Transcript */}
                <div className="w-80 xl:w-96 shrink-0">
                    <div className="card h-full flex flex-col">
                        <div className="px-4 py-3 border-b border-border">
                            <h3 className="section-title text-sm">Transcript</h3>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4">
                            {minutes.transcript ? (
                                <pre className="text-xs text-textSecondary font-sans leading-relaxed whitespace-pre-wrap">
                                    {minutes.transcript}
                                </pre>
                            ) : (
                                <div className="flex items-center justify-center h-full">
                                    <div className="text-center">
                                        <RefreshCw className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                                        <p className="text-sm text-textSecondary">
                                            No transcript available
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right: Minutes sections */}
                <div className="flex-1 min-w-0 space-y-4">
                    {/* Summary */}
                    <MinutesSection title="Summary">
                        <p className="text-sm text-textSecondary leading-relaxed">
                            {minutes.summary}
                        </p>
                    </MinutesSection>

                    {/* Key Discussion Points */}
                    <MinutesSection title="Key Discussion Points">
                        <ul className="space-y-2">
                            {minutes.keyDiscussionPoints.map((point, i) => (
                                <li key={i} className="flex items-start gap-2.5 text-sm">
                                    <span className="mt-0.5 flex items-center justify-center w-5 h-5 rounded-full bg-primary-50 text-primary text-xs font-semibold shrink-0">
                                        {i + 1}
                                    </span>
                                    <span className="text-textSecondary leading-relaxed">
                                        {point}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </MinutesSection>

                    {/* Decisions */}
                    <MinutesSection title="Decisions Made">
                        <ul className="space-y-2">
                            {minutes.decisions.map((decision, i) => (
                                <li key={i} className="flex items-start gap-2.5 text-sm">
                                    <span className="mt-1 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                                    <span className="text-textSecondary leading-relaxed">
                                        {decision}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </MinutesSection>

                    {/* Action Items */}
                    <MinutesSection title="Action Items">
                        <ActionItemsTable
                            items={minutes.actionItems}
                            onUpdate={handleActionUpdate}
                            onDelete={handleActionDelete}
                        />
                    </MinutesSection>

                    {/* Open Questions */}
                    <MinutesSection title="Open Questions" defaultOpen={false}>
                        <ul className="space-y-2">
                            {minutes.openQuestions.map((q, i) => (
                                <li key={i} className="flex items-start gap-2.5 text-sm">
                                    <span className="mt-0.5 text-warning font-bold shrink-0">?</span>
                                    <span className="text-textSecondary leading-relaxed">{q}</span>
                                </li>
                            ))}
                        </ul>
                    </MinutesSection>
                </div>
            </div>

            {/* Export Modal */}
            <ExportModal
                isOpen={isExportOpen}
                onClose={() => setIsExportOpen(false)}
                meetingTitle="Q1 Product Roadmap Review"
            />
        </AppLayout>
    );
}
