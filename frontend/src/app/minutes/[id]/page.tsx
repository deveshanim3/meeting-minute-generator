"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Download, RefreshCw, Loader2 } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { useAuth } from "@/context/AuthContext";
import MinutesSection from "@/components/MinutesSection";
import ExportModal from "@/components/ExportModal";
import { apiGet, apiPatch } from "@/lib/api";

/**
 * Minutes page: fetches real meeting data from Firestore via the backend API.
 * Displays transcript on the left, AI-generated minutes on the right.
 */
export default function MinutesPage() {
    const params = useParams();
    const meetingId = params.id as string;
    const { user, isLoading: authLoading } = useAuth();

    const [meeting, setMeeting] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isExportOpen, setIsExportOpen] = useState(false);
    
    // Editing state
    const [isEditing, setIsEditing] = useState(false);
    const [editMinutes, setEditMinutes] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        async function loadMeeting() {
            try {
                const data = await apiGet(`/meetings/${meetingId}`);
                setMeeting(data.meeting);
                setEditMinutes(data.meeting.minutes || "");
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        if (meetingId && user) loadMeeting();
        else if (!authLoading && !user) {
            setError("Not authenticated");
            setLoading(false);
        }
    }, [meetingId, user, authLoading]);

    async function handleSaveMinutes() {
        if (!meetingId) return;
        setIsSaving(true);
        try {
            await apiPatch(`/meetings/${meetingId}`, { minutes: editMinutes });
            setMeeting({ ...meeting, minutes: editMinutes });
            setIsEditing(false);
        } catch (err: any) {
            alert(err.message || "Failed to save minutes");
        } finally {
            setIsSaving(false);
        }
    }

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
                        <div className="px-4 py-3 border-b border-border shrink-0 flex justify-between items-center">
                            <h3 className="section-title text-sm">AI-Generated Minutes</h3>
                            {!isEditing ? (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="text-xs font-medium text-primary hover:underline"
                                >
                                    Edit
                                </button>
                            ) : (
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => {
                                            setIsEditing(false);
                                            setEditMinutes(meeting.minutes || "");
                                        }}
                                        className="text-xs font-medium text-gray-500 hover:text-gray-700"
                                        disabled={isSaving}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSaveMinutes}
                                        className="text-xs font-medium text-primary hover:underline flex items-center"
                                        disabled={isSaving}
                                    >
                                        {isSaving && <Loader2 className="w-3 h-3 mr-1 animate-spin" />}
                                        Save
                                    </button>
                                </div>
                            )}
                        </div>
                        <div className="flex-1 overflow-hidden flex flex-col">
                            {isEditing ? (
                                <textarea
                                    className="w-full h-full p-4 resize-none outline-none text-sm font-sans text-textSecondary bg-gray-50"
                                    value={editMinutes}
                                    onChange={(e) => setEditMinutes(e.target.value)}
                                    placeholder="Edit meeting minutes here..."
                                />
                            ) : (
                                <div className="p-4 h-full overflow-y-auto">
                                    <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-textSecondary">
                                        {meeting.minutes}
                                    </pre>
                                </div>
                            )}
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
