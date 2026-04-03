"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { WorkspaceMember, MemberRole } from "@/types";
import { apiGet, apiPost, apiPatch, apiDelete } from "@/lib/api";

/** Fetch workspace members (scoped to current user) */
async function fetchMembers(): Promise<WorkspaceMember[]> {
    const data = await apiGet("/workspace/members");

    return data.members.map((m: any) => ({
        id: m.id,
        name: m.name,
        email: m.email,
        role: m.role,
        status: m.status,
        joinedAt: m.joinedAt?._seconds
            ? new Date(m.joinedAt._seconds * 1000).toISOString()
            : m.joinedAt,
    }));
}

/** React Query hook for workspace members */
export function useWorkspace() {
    return useQuery({
        queryKey: ["workspace-members"],
        queryFn: fetchMembers,
    });
}

/** Mutation hook for inviting a member */
export function useInviteMember() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (email: string) => apiPost("/workspace/invite", { email, role: "viewer" }),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["workspace-members"] });
        },
    });
}

/** Mutation hook for updating a member's role */
export function useUpdateMemberRole() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, role }: { id: string; role: MemberRole }) =>
            apiPatch(`/workspace/members/${id}`, { role }),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["workspace-members"] });
        },
    });
}

/** Mutation hook for removing a member */
export function useRemoveMember() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => apiDelete(`/workspace/members/${id}`),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["workspace-members"] });
        },
    });
}
