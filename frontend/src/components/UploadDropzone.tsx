"use client";

import { useCallback, useState } from "react";
import { UploadCloud, File, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface UploadDropzoneProps {
    /** Callback when files are selected */
    onFilesChange?: (files: File[]) => void;
}

const ACCEPTED_TYPES = [
    "audio/mpeg",
    "audio/wav",
    "audio/wave",
    "text/plain",
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const ACCEPTED_EXT = ".mp3,.wav,.txt,.pdf,.docx";

/**
 * Drag-and-drop file upload zone.
 * Accepts mp3, wav, txt, pdf, and docx files.
 */
export default function UploadDropzone({ onFilesChange }: UploadDropzoneProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [files, setFiles] = useState<File[]>([]);

    const handleFiles = useCallback(
        (incoming: FileList | null) => {
            if (!incoming) return;
            const accepted = Array.from(incoming).filter(
                (f) => ACCEPTED_TYPES.includes(f.type) || f.name.endsWith(".docx")
            );
            const next = [...files, ...accepted];
            setFiles(next);
            onFilesChange?.(next);
        },
        [files, onFilesChange]
    );

    const onDrop = useCallback(
        (e: React.DragEvent<HTMLDivElement>) => {
            e.preventDefault();
            setIsDragging(false);
            handleFiles(e.dataTransfer.files);
        },
        [handleFiles]
    );

    const removeFile = (index: number) => {
        const next = files.filter((_, i) => i !== index);
        setFiles(next);
        onFilesChange?.(next);
    };

    const formatSize = (bytes: number) => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    return (
        <div className="space-y-3">
            <div
                onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={onDrop}
                className={cn(
                    "relative flex flex-col items-center justify-center gap-3 p-10 border-2 border-dashed rounded-xl transition-colors",
                    isDragging
                        ? "border-primary bg-primary-50"
                        : "border-gray-200 bg-gray-50 hover:border-primary hover:bg-primary-50/50"
                )}
            >
                <div
                    className={cn(
                        "flex items-center justify-center w-12 h-12 rounded-xl transition-colors",
                        isDragging ? "bg-primary text-white" : "bg-white border border-gray-200 text-gray-500"
                    )}
                >
                    <UploadCloud className="w-6 h-6" />
                </div>
                <div className="text-center">
                    <p className="text-sm font-medium text-gray-900">
                        Drop your files here, or{" "}
                        <label className="text-primary cursor-pointer hover:underline">
                            <span>browse</span>
                            <input
                                type="file"
                                multiple
                                accept={ACCEPTED_EXT}
                                className="sr-only"
                                onChange={(e) => handleFiles(e.target.files)}
                            />
                        </label>
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                        Supports MP3, WAV, TXT, PDF, DOCX
                    </p>
                </div>
            </div>

            {files.length > 0 && (
                <ul className="space-y-2">
                    {files.map((file, i) => (
                        <li
                            key={i}
                            className="flex items-center gap-3 px-3 py-2.5 bg-white border border-gray-200 rounded-lg"
                        >
                            <File className="w-4 h-4 text-gray-500 shrink-0" />
                            <span className="flex-1 text-sm text-gray-900 truncate">
                                {file.name}
                            </span>
                            <span className="text-xs text-gray-500 shrink-0">
                                {formatSize(file.size)}
                            </span>
                            <button
                                onClick={() => removeFile(i)}
                                className="flex items-center justify-center w-5 h-5 rounded-full hover:bg-gray-100 text-gray-500 hover:text-danger transition-colors"
                                aria-label="Remove file"
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
