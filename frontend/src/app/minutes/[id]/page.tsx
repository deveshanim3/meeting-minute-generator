"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Download, RefreshCw, Loader2 } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import MinutesSection from "@/components/MinutesSection";
import ExportModal from "@/components/ExportModal";
import { apiGet } from "@/lib/api";

/**
 * Minutes page: fetches real meeting data from Firestore via the backend API.
 * Displays transcript on the left, AI-generated minutes on the right.
 */
export default function MinutesPage() {
    const params = useParams();
    const meetingId = params.id as string;

    const [meeting, setMeeting] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isExportOpen, setIsExportOpen] = useState(false);

    useEffect(() => {
        async function loadMeeting() {
            try {
                const data = await apiGet(`/meetings/${meetingId}`);
                setMeeting(data.meeting);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        if (meetingId) loadMeeting();
    }, [meetingId]);

    if (loading) {
        return (
            <AppLayout title="Meeting Minutes">
                <div className="flex items-center justify-center py-32">
                    <Loader2 className="w-6 h-6 text-primary animate-spin" />
                    <span className="ml-2 text-sm text-gray-500">Loading minutes…</span>
                </div>
            </AppLayout>
        );
    }

    if (error || !meeting) {
        return (
            <AppLayout title="Meeting Minutes">
                <div className="flex flex-col items-center justify-center py-32 text-center">
                    <p className="text-sm text-danger">{error || "Meeting not found"}</p>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout title="Meeting Minutes">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-base font-semibold text-textPrimary">
                        {meeting.title}
                    </h2>
                    <p className="text-xs text-textSecondary mt-0.5">
                        {meeting.date} · {meeting.participants?.length || 0} participants
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

            {/* Two-column layout — both panels scroll independently */}
            <div className="flex gap-5 h-[calc(100vh-12rem)]">
                {/* Left: Transcript */}
                <div className="w-80 xl:w-96 shrink-0">
                    <div className="card h-full flex flex-col">
                        <div className="px-4 py-3 border-b border-border shrink-0">
                            <h3 className="section-title text-sm">Transcript</h3>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4">
                            {meeting.transcript ? (
                                <pre className="text-xs text-textSecondary font-sans leading-relaxed whitespace-pre-wrap">
                                    {meeting.transcript}
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

                {/* Right: AI-generated minutes */}
                <div className="flex-1 min-w-0">
                    <div className="card h-full flex flex-col">
                        <div className="px-4 py-3 border-b border-border shrink-0">
                            <h3 className="section-title text-sm">AI-Generated Minutes</h3>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4">
                            <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-textSecondary">
                                {meeting.minutes}
                            </pre>
                        </div>
                    </div>
                </div>
            </div>

            {/* Export Modal */}
            <ExportModal
                isOpen={isExportOpen}
                onClose={() => setIsExportOpen(false)}
                meetingTitle={meeting.title}
                meetingData={{
                    title: meeting.title,
                    date: meeting.date,
                    participants: meeting.participants || [],
                    transcript: meeting.transcript || "",
                    minutes: meeting.minutes || "",
                }}
            />
        </AppLayout>
    );
}
