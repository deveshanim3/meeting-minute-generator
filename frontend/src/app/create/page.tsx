"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X, Calendar, Loader2 } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import UploadDropzone from "@/components/UploadDropzone";

/**
 * Create meeting page with form and file upload dropzone.
 */
export default function CreateMeetingPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form state
    const [title, setTitle] = useState("");
    const [date, setDate] = useState("");
    const [participantInput, setParticipantInput] = useState("");
    const [participants, setParticipants] = useState<string[]>([]);
    const [agenda, setAgenda] = useState("");

    const addParticipant = (e: React.KeyboardEvent) => {
        if ((e.key === "Enter" || e.key === ",") && participantInput.trim()) {
            e.preventDefault();
            const name = participantInput.trim().replace(/,$/, "");
            if (name && !participants.includes(name)) {
                setParticipants((prev) => [...prev, name]);
            }
            setParticipantInput("");
        }
    };

    const removeParticipant = (name: string) => {
        setParticipants((prev) => prev.filter((p) => p !== name));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate API request
        await new Promise((r) => setTimeout(r, 1200));
        router.push("/processing/new");
    };

    return (
        <AppLayout title="New Meeting">
            <div className="max-w-2xl mx-auto">
                <p className="text-sm text-gray-500 mb-6">
                    Fill in the meeting details and upload your audio or transcript file
                    to generate structured minutes.
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Title */}
                    <div className="card p-5">
                        <h2 className="section-title mb-4">Meeting Details</h2>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="title" className="form-label">
                                    Meeting Title <span className="text-danger">*</span>
                                </label>
                                <input
                                    id="title"
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="e.g. Q1 Product Roadmap Review"
                                    required
                                    className="form-input"
                                />
                            </div>

                            {/* Date */}
                            <div>
                                <label htmlFor="date" className="form-label">
                                    Meeting Date <span className="text-danger">*</span>
                                </label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                                    <input
                                        id="date"
                                        type="datetime-local"
                                        value={date}
                                        onChange={(e) => setDate(e.target.value)}
                                        required
                                        className="form-input pl-9"
                                    />
                                </div>
                            </div>

                            {/* Participants */}
                            <div>
                                <label htmlFor="participants" className="form-label">
                                    Participants
                                </label>
                                <div className="flex flex-wrap gap-2 p-2.5 bg-white border border-gray-200 rounded-lg min-h-[11] focus-within:ring-2 focus-within:ring-primary focus-within:border-transparent">
                                    {participants.map((p) => (
                                        <span
                                            key={p}
                                            className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-primary-50 text-primary text-xs font-medium rounded-full"
                                        >
                                            {p}
                                            <button
                                                type="button"
                                                onClick={() => removeParticipant(p)}
                                                className="hover:text-primary-700"
                                                aria-label={`Remove ${p}`}
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </span>
                                    ))}
                                    <input
                                        id="participants"
                                        type="text"
                                        value={participantInput}
                                        onChange={(e) => setParticipantInput(e.target.value)}
                                        onKeyDown={addParticipant}
                                        placeholder={
                                            participants.length === 0
                                                ? "Type a name and press Enter…"
                                                : ""
                                        }
                                        className="flex-1 min-w-[30] text-sm outline-none bg-transparent placeholder:text-gray-500"
                                    />
                                </div>
                                <p className="mt-1 text-xs text-gray-500">
                                    Press Enter or comma to add participants
                                </p>
                            </div>

                            {/* Agenda */}
                            <div>
                                <label htmlFor="agenda" className="form-label">
                                    Agenda
                                </label>
                                <textarea
                                    id="agenda"
                                    value={agenda}
                                    onChange={(e) => setAgenda(e.target.value)}
                                    placeholder="Describe the meeting agenda and key topics…"
                                    rows={4}
                                    className="form-input resize-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Upload */}
                    <div className="card p-5">
                        <h2 className="section-title mb-1">Upload File</h2>
                        <p className="text-xs text-gray-500 mb-4">
                            Upload an audio recording or transcript to generate AI minutes.
                        </p>
                        <UploadDropzone />
                    </div>

                    {/* Submit */}
                    <div className="flex items-center justify-end gap-3">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="btn-secondary"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="btn-primary"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Submitting…
                                </>
                            ) : (
                                "Generate Minutes"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
