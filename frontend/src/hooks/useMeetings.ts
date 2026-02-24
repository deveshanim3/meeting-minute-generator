"use client";

import { useQuery } from "@tanstack/react-query";
import { Meeting, MeetingFilters } from "@/types";
import { MOCK_MEETINGS } from "@/lib/mockData";

/** Simulated API fetch for meetings */
async function fetchMeetings(filters: MeetingFilters): Promise<Meeting[]> {
    await new Promise((r) => setTimeout(r, 400));
    let results = [...MOCK_MEETINGS];

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

/** Fetches a single meeting by ID */
async function fetchMeeting(id: string): Promise<Meeting | undefined> {
    await new Promise((r) => setTimeout(r, 200));
    return MOCK_MEETINGS.find((m) => m.id === id);
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
