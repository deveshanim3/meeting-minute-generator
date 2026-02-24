"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { WorkspaceMember, MemberRole } from "@/types";
import { MOCK_MEMBERS } from "@/lib/mockData";

/** Simulated API fetch for workspace members */
async function fetchMembers(): Promise<WorkspaceMember[]> {
    await new Promise((r) => setTimeout(r, 300));
    return MOCK_MEMBERS;
}

/** Simulated API update for member role */
async function updateMemberRole(
    id: string,
    role: MemberRole
): Promise<WorkspaceMember> {
    await new Promise((r) => setTimeout(r, 200));
    const member = MOCK_MEMBERS.find((m) => m.id === id);
    if (!member) throw new Error("Member not found");
    return { ...member, role };
}

/** React Query hook for workspace members */
export function useWorkspace() {
    return useQuery({
        queryKey: ["workspace-members"],
        queryFn: fetchMembers,
    });
}

/** Mutation hook for updating a member's role */
export function useUpdateMemberRole() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, role }: { id: string; role: MemberRole }) =>
            updateMemberRole(id, role),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["workspace-members"] });
        },
    });
}
