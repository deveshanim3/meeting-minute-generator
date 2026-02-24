"use client";

import { Download, Copy, FileType, X } from "lucide-react";

interface ExportModalProps {
    /** Controls modal visibility */
    isOpen: boolean;
    /** Callback to close the modal */
    onClose: () => void;
    /** Title of the meeting being exported */
    meetingTitle?: string;
}

/**
 * Modal dialog for exporting meeting minutes in various formats.
 */
export default function ExportModal({
    isOpen,
    onClose,
    meetingTitle = "Meeting Minutes",
}: ExportModalProps) {
    if (!isOpen) return null;

    const handleExport = (format: string) => {
        // In production, trigger actual file download
        alert(`Exporting as ${format}...`);
        onClose();
    };

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
                        onClick={() => handleExport("PDF")}
                        className="flex items-center gap-4 w-full px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-primary hover:bg-primary-50/30 transition-colors group"
                    >
                        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-danger-light text-danger shrink-0">
                            <FileType className="w-5 h-5" />
                        </div>
                        <div className="text-left">
                            <p className="text-sm font-medium text-gray-900">
                                Export as PDF
                            </p>
                            <p className="text-xs text-gray-500">
                                Best for sharing and printing
                            </p>
                        </div>
                    </button>

                    <button
                        onClick={() => handleExport("DOCX")}
                        className="flex items-center gap-4 w-full px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-primary hover:bg-primary-50/30 transition-colors group"
                    >
                        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary-50 text-primary shrink-0">
                            <FileType className="w-5 h-5" />
                        </div>
                        <div className="text-left">
                            <p className="text-sm font-medium text-gray-900">
                                Export as DOCX
                            </p>
                            <p className="text-xs text-gray-500">
                                Editable Microsoft Word format
                            </p>
                        </div>
                    </button>

                    <button
                        onClick={() => handleExport("Email")}
                        className="flex items-center gap-4 w-full px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-primary hover:bg-primary-50/30 transition-colors group"
                    >
                        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-success-light text-success shrink-0">
                            <Copy className="w-5 h-5" />
                        </div>
                        <div className="text-left">
                            <p className="text-sm font-medium text-gray-900">
                                Copy to Email
                            </p>
                            <p className="text-xs text-gray-500">
                                Format and copy for email clients
                            </p>
                        </div>
                    </button>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
                    <button onClick={onClose} className="btn-secondary text-sm">
                        Cancel
                    </button>
                    <button
                        onClick={() => handleExport("PDF")}
                        className="btn-primary text-sm"
                    >
                        <Download className="w-4 h-4" />
                        Download
                    </button>
                </div>
            </div>
        </div>
    );
}
