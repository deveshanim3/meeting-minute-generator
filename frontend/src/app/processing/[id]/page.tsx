"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, Circle, Loader2, XCircle } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { MOCK_PROCESSING_STEPS } from "@/lib/mockData";
import { ProcessingStep } from "@/types";
import { cn } from "@/lib/utils";

/**
 * Processing status page showing real-time step progress during AI generation.
 */
export default function ProcessingPage() {
    const router = useRouter();
    const [steps, setSteps] = useState<ProcessingStep[]>(MOCK_PROCESSING_STEPS);
    const [elapsed, setElapsed] = useState(0);

    // Simulate step progression
    useEffect(() => {
        const interval = setInterval(() => {
            setElapsed((t) => t + 1);
        }, 1000);

        const generateTimer = setTimeout(() => {
            setSteps((prev) =>
                prev.map((s) =>
                    s.id === "generate" ? { ...s, status: "completed" } : s
                )
            );
            setSteps((prev) =>
                prev.map((s) =>
                    s.id === "format" ? { ...s, status: "active" } : s
                )
            );
        }, 4000);

        const formatTimer = setTimeout(() => {
            setSteps((prev) =>
                prev.map((s) =>
                    s.id === "format" ? { ...s, status: "completed" } : s
                )
            );
            setTimeout(() => router.push("/minutes/1"), 800);
        }, 7000);

        return () => {
            clearInterval(interval);
            clearTimeout(generateTimer);
            clearTimeout(formatTimer);
        };
    }, [router]);

    const formatElapsed = (secs: number) => {
        const m = Math.floor(secs / 60);
        const s = secs % 60;
        return `${m}:${s.toString().padStart(2, "0")}`;
    };

    return (
        <AppLayout title="Processing">
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)]">
                <div className="card p-10 max-w-md w-full">
                    {/* Spinner */}
                    <div className="flex justify-center mb-8">
                        <div className="relative flex items-center justify-center w-16 h-16">
                            <Loader2 className="absolute w-16 h-16 text-primary-100 animate-spin" />
                            <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center">
                                <Loader2 className="w-5 h-5 text-primary animate-spin" />
                            </div>
                        </div>
                    </div>

                    <h2 className="text-center text-lg font-semibold text-textPrimary mb-1">
                        Generating your minutes
                    </h2>
                    <p className="text-center text-sm text-textSecondary mb-8">
                        This usually takes 1–2 minutes. Please don&apos;t close this page.
                    </p>

                    {/* Steps */}
                    <div className="space-y-3">
                        {steps.map((step, index) => (
                            <div key={step.id} className="flex items-center gap-3">
                                {/* Connector line */}
                                {index > 0 && (
                                    <div className="absolute ml-5 -mt-[6] h-3 w-px bg-border" />
                                )}
                                {/* Icon */}
                                <div className="relative shrink-0">
                                    {step.status === "completed" ? (
                                        <CheckCircle className="w-5 h-5 text-success" />
                                    ) : step.status === "active" ? (
                                        <Loader2 className="w-5 h-5 text-primary animate-spin" />
                                    ) : step.status === "failed" ? (
                                        <XCircle className="w-5 h-5 text-danger" />
                                    ) : (
                                        <Circle className="w-5 h-5 text-gray-300" />
                                    )}
                                </div>
                                {/* Label */}
                                <div
                                    className={cn(
                                        "flex-1 flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors",
                                        step.status === "active"
                                            ? "bg-primary-50 text-primary font-medium"
                                            : step.status === "completed"
                                                ? "text-textPrimary"
                                                : "text-textSecondary"
                                    )}
                                >
                                    <span>{step.label}</span>
                                    {step.status === "completed" && (
                                        <span className="text-xs text-success font-medium">✓</span>
                                    )}
                                    {step.status === "active" && (
                                        <span className="text-xs text-primary">In progress…</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Timer */}
                    <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-xs text-textSecondary">
                        <span>Elapsed time</span>
                        <span className="font-medium text-textPrimary tabular-nums">
                            {formatElapsed(elapsed)}
                        </span>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
