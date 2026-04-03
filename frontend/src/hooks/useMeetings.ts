"use client";

import { useQuery } from "@tanstack/react-query";
import { Meeting, MeetingFilters } from "@/types";
import { apiGet } from "@/lib/api";

/** Fetch meetings from the backend API (scoped to current user) */
async function fetchMeetings(filters: MeetingFilters): Promise<Meeting[]> {
    const data = await apiGet("/meetings");

    let results: Meeting[] = data.meetings.map((m: any) => ({
        id: m.id,
        title: m.title,
        date: m.date,
        participantsCount: m.participants?.length || 0,
        status: "completed" as const,
        agenda: m.agenda,
        participants: m.participants || [],
    }));

    if (filters.search) {
        const q = filters.search.toLowerCase();
        results = results.filter(
            (m) =>
                m.title.toLowerCase().includes(q) ||
                m.agenda?.toLowerCase().includes(q)
        );
    }

    if (filters.status && filters.status !== "all") {
        results = results.filter((m) => m.status === filters.status);
    }

    return results;
}

/** Fetch a single meeting by ID */
async function fetchMeeting(id: string): Promise<Meeting | undefined> {
    try {
        const data = await apiGet(`/meetings/${id}`);
        const m = data.meeting;
        return {
            id: m.id,
            title: m.title,
            date: m.date,
            participantsCount: m.participants?.length || 0,
            status: "completed" as const,
            agenda: m.agenda,
            participants: m.participants || [],
        };
    } catch {
        return undefined;
    }
}

/** React Query hook for the list of meetings */
export function useMeetings(filters: MeetingFilters = {}) {
    return useQuery({
        queryKey: ["meetings", filters],
        queryFn: () => fetchMeetings(filters),
    });
}

/** React Query hook for a single meeting */
export function useMeeting(id: string) {
    return useQuery({
        queryKey: ["meeting", id],
        queryFn: () => fetchMeeting(id),
        enabled: !!id,
    });
}
