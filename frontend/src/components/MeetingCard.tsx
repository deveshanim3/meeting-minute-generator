"use client";

import Link from "next/link";
import { Calendar, Users, ArrowRight } from "lucide-react";
import { Meeting } from "@/types";
import { formatDate } from "@/lib/utils";
import StatusBadge from "./StatusBadge";

interface MeetingCardProps {
    /** Meeting data to display */
    meeting: Meeting;
}

/**
 * Card displaying a meeting's title, date, participant count, and status.
 * Links to the minutes editor for completed meetings.
 */
export default function MeetingCard({ meeting }: MeetingCardProps) {
    const href =
        meeting.status === "completed"
            ? `/minutes/${meeting.id}`
            : meeting.status === "processing"
                ? `/processing/${meeting.id}`
                : "#";

    return (
        <div className="card p-5 hover:shadow-card transition-shadow cursor-pointer group">
            <div className="flex items-start justify-between gap-3 mb-3">
                <h3 className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                    {meeting.title}
                </h3>
                <StatusBadge variant={meeting.status} className="shrink-0" />
            </div>

            <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    {formatDate(meeting.date)}
                </span>
                <span className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5" />
                    {meeting.participantsCount} participants
                </span>
            </div>

            {meeting.agenda && (
                <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 mb-4">
                    {meeting.agenda}
                </p>
            )}

            {(meeting.status === "completed" || meeting.status === "processing") && (
                <Link
                    href={href}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary-600 transition-colors"
                >
                    {meeting.status === "completed" ? "View Minutes" : "View Progress"}
                    <ArrowRight className="w-3.5 h-3.5" />
                </Link>
            )}
        </div>
    );
}
