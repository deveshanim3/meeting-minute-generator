"use client";

import { useState } from "react";
import { Search, Filter, PlusCircle, RefreshCw } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import MeetingCard from "@/components/MeetingCard";
import { useMeetings } from "@/hooks/useMeetings";
import { MeetingStatus } from "@/types";
import Link from "next/link";

const STATUS_FILTERS: { label: string; value: MeetingStatus | "all" }[] = [
    { label: "All", value: "all" },
    { label: "Completed", value: "completed" },
    { label: "Processing", value: "processing" },
    { label: "Queued", value: "queued" },
    { label: "Failed", value: "failed" },
];

/**
 * Dashboard page showing all meetings in a filterable grid.
 */
export default function DashboardPage() {
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState<MeetingStatus | "all">("all");

    const { data: meetings, isLoading, error } = useMeetings({ search, status });

    return (
        <AppLayout title="Dashboard">
            {/* Filters row */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
                {/* Search */}
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                        type="search"
                        placeholder="Search meetings…"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="form-input pl-9"
                    />
                </div>

                {/* Status filter */}
                <div className="flex items-center gap-1.5">
                    <Filter className="w-4 h-4 text-gray-500 shrink-0" />
                    <div className="flex gap-1">
                        {STATUS_FILTERS.map((f) => (
                            <button
                                key={f.value}
                                onClick={() => setStatus(f.value)}
                                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${status === f.value
                                        ? "bg-primary text-white"
                                        : "bg-white border border-gray-200 text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                                    }`}
                            >
                                {f.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="ml-auto">
                    <Link href="/create" className="btn-primary text-sm">
                        <PlusCircle className="w-4 h-4" />
                        New Meeting
                    </Link>
                </div>
            </div>

            {/* Summary stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                {[
                    { label: "Total Meetings", value: "6" },
                    { label: "Completed", value: "3" },
                    { label: "Processing", value: "1" },
                    { label: "Queued", value: "1" },
                ].map((stat) => (
                    <div key={stat.label} className="card px-4 py-3">
                        <p className="text-xs text-gray-500">{stat.label}</p>
                        <p className="text-xl font-semibold text-gray-900 mt-0.5">
                            {stat.value}
                        </p>
                    </div>
                ))}
            </div>

            {/* Meeting grid */}
            {isLoading ? (
                <div className="flex items-center justify-center py-20">
                    <RefreshCw className="w-5 h-5 text-primary animate-spin" />
                    <span className="ml-2 text-sm text-gray-500">Loading meetings…</span>
                </div>
            ) : error ? (
                <div className="flex items-center justify-center py-20">
                    <p className="text-sm text-danger">Failed to load meetings.</p>
                </div>
            ) : meetings && meetings.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {meetings.map((meeting) => (
                        <MeetingCard key={meeting.id} meeting={meeting} />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gray-100 mb-4">
                        <Search className="w-6 h-6 text-gray-500" />
                    </div>
                    <p className="text-sm font-medium text-gray-900">No meetings found</p>
                    <p className="text-xs text-gray-500 mt-1">
                        Try adjusting your search or filter
                    </p>
                </div>
            )}
        </AppLayout>
    );
}
