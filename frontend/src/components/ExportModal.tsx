"use client";

import { useState } from "react";
import { Download, Copy, FileType, X, FileText, Mail, Loader2, Check } from "lucide-react";
import { jsPDF } from "jspdf";

interface ExportModalProps {
    isOpen: boolean;
    onClose: () => void;
    meetingTitle?: string;
    meetingData?: {
        title: string;
        date: string;
        participants: string[];
        transcript: string;
        minutes: string;
    };
}

/**
 * Modal dialog for exporting meeting minutes.
 * Supports: PDF download, TXT download, and send-to-email (mailto).
 */
export default function ExportModal({
    isOpen,
    onClose,
    meetingTitle = "Meeting Minutes",
    meetingData,
}: ExportModalProps) {
    const [exporting, setExporting] = useState<string | null>(null);
    const [done, setDone] = useState<string | null>(null);

    if (!isOpen) return null;

    const minutesText = meetingData?.minutes || "No minutes available.";
    const transcriptText = meetingData?.transcript || "";

    const fullText = [
        `Meeting Minutes: ${meetingData?.title || meetingTitle}`,
        `Date: ${meetingData?.date || "N/A"}`,
        `Participants: ${meetingData?.participants?.join(", ") || "N/A"}`,
        "",
        "═══════════════════════════════════════",
        "MINUTES",
        "═══════════════════════════════════════",
        "",
        minutesText,
        "",
        ...(transcriptText
            ? [
                  "═══════════════════════════════════════",
                  "TRANSCRIPT",
                  "═══════════════════════════════════════",
                  "",
                  transcriptText,
              ]
            : []),
    ].join("\n");

    const showDone = (format: string) => {
        setDone(format);
        setTimeout(() => {
            setDone(null);
            onClose();
        }, 1200);
    };

    /** ── Export as PDF ── */
    const handlePDF = () => {
        setExporting("PDF");

        try {
            const doc = new jsPDF();
            const pageWidth = doc.internal.pageSize.getWidth();
            const margin = 20;
            const maxWidth = pageWidth - margin * 2;

            // Title
            doc.setFontSize(18);
            doc.setFont("helvetica", "bold");
            doc.text(meetingData?.title || meetingTitle, margin, 25);

            // Date & participants
            doc.setFontSize(10);
            doc.setFont("helvetica", "normal");
            doc.setTextColor(100);
            doc.text(`Date: ${meetingData?.date || "N/A"}`, margin, 34);
            doc.text(
                `Participants: ${meetingData?.participants?.join(", ") || "N/A"}`,
                margin,
                40
            );

            // Divider
            doc.setDrawColor(200);
            doc.line(margin, 45, pageWidth - margin, 45);

            // Minutes content
            doc.setFontSize(11);
            doc.setTextColor(30);
            const lines = doc.splitTextToSize(minutesText, maxWidth);
            let y = 55;

            for (const line of lines) {
                if (y > doc.internal.pageSize.getHeight() - 20) {
                    doc.addPage();
                    y = 20;
                }
                doc.text(line, margin, y);
                y += 6;
            }

            const safeName = (meetingData?.title || "minutes")
                .replace(/[^a-zA-Z0-9]/g, "_")
                .toLowerCase();
            doc.save(`${safeName}.pdf`);
            showDone("PDF");
        } catch (err) {
            console.error("PDF export error:", err);
            alert("Failed to generate PDF");
        } finally {
            setExporting(null);
        }
    };

    /** ── Export as TXT ── */
    const handleTXT = () => {
        setExporting("TXT");

        try {
            const blob = new Blob([fullText], { type: "text/plain;charset=utf-8" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            const safeName = (meetingData?.title || "minutes")
                .replace(/[^a-zA-Z0-9]/g, "_")
                .toLowerCase();
            a.download = `${safeName}.txt`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            showDone("TXT");
        } catch (err) {
            console.error("TXT export error:", err);
            alert("Failed to generate TXT file");
        } finally {
            setExporting(null);
        }
    };

    /** ── Send via Email (mailto) ── */
    const handleEmail = () => {
        setExporting("Email");

        try {
            const subject = encodeURIComponent(`Meeting Minutes: ${meetingData?.title || meetingTitle}`);
            // mailto body has a character limit, so we truncate if needed
            const body = encodeURIComponent(fullText.substring(0, 1800) + (fullText.length > 1800 ? "\n\n[...truncated — see attached file for full minutes]" : ""));
            window.open(`mailto:?subject=${subject}&body=${body}`, "_blank");
            showDone("Email");
        } catch (err) {
            console.error("Email export error:", err);
            alert("Failed to open email client");
        } finally {
            setExporting(null);
        }
    };

    const ButtonLabel = ({ format, label }: { format: string; label: string }) => (
        <>
            {exporting === format ? (
                <Loader2 className="w-4 h-4 animate-spin text-primary" />
            ) : done === format ? (
                <Check className="w-4 h-4 text-success" />
            ) : null}
            <span>{done === format ? "Done!" : label}</span>
        </>
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Dialog */}
            <div className="relative z-10 w-full max-w-md bg-white rounded-xl shadow-xl border border-gray-200">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                    <div>
                        <h2 className="text-base font-semibold text-gray-900">
                            Export Meeting Minutes
                        </h2>
                        <p className="text-xs text-gray-500 mt-0.5 truncate max-w-[280px]">
                            {meetingTitle}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
                        aria-label="Close"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Export options */}
                <div className="px-6 py-4 space-y-2.5">
                    <p className="text-sm text-gray-500 mb-3">
                        Choose an export format:
                    </p>

                    <button
                        onClick={handlePDF}
                        disabled={!!exporting}
                        className="flex items-center gap-4 w-full px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-primary hover:bg-primary-50/30 transition-colors group disabled:opacity-50"
                    >
                        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-danger-light text-danger shrink-0">
                            <FileType className="w-5 h-5" />
                        </div>
                        <div className="text-left flex items-center gap-2">
                            <div>
                                <p className="text-sm font-medium text-gray-900">
                                    Export as PDF
                                </p>
                                <p className="text-xs text-gray-500">
                                    Best for sharing and printing
                                </p>
                            </div>
                        </div>
                    </button>

                    <button
                        onClick={handleTXT}
                        disabled={!!exporting}
                        className="flex items-center gap-4 w-full px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-primary hover:bg-primary-50/30 transition-colors group disabled:opacity-50"
                    >
                        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary-50 text-primary shrink-0">
                            <FileText className="w-5 h-5" />
                        </div>
                        <div className="text-left">
                            <p className="text-sm font-medium text-gray-900">
                                Export as TXT
                            </p>
                            <p className="text-xs text-gray-500">
                                Plain text format, universally readable
                            </p>
                        </div>
                    </button>

                    <button
                        onClick={handleEmail}
                        disabled={!!exporting}
                        className="flex items-center gap-4 w-full px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-primary hover:bg-primary-50/30 transition-colors group disabled:opacity-50"
                    >
                        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-success-light text-success shrink-0">
                            <Mail className="w-5 h-5" />
                        </div>
                        <div className="text-left">
                            <p className="text-sm font-medium text-gray-900">
                                Send via Email
                            </p>
                            <p className="text-xs text-gray-500">
                                Opens your email client with minutes pre-filled
                            </p>
                        </div>
                    </button>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end px-6 py-4 border-t border-gray-200">
                    <button onClick={onClose} className="btn-secondary text-sm">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
