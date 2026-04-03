"use client";

import { useState } from "react";
import { Mail, Plus, Trash2, Loader2, Check, UserPlus } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { useWorkspace, useInviteMember, useUpdateMemberRole, useRemoveMember } from "@/hooks/useWorkspace";
import { MemberRole, WorkspaceMember } from "@/types";
import { formatDate, getInitials } from "@/lib/utils";

const ROLE_OPTIONS: MemberRole[] = ["admin", "editor", "viewer"];

/**
 * Workspace page: member list with real invite, role management, and remove.
 */
export default function WorkspacePage() {
    const { data: members, isLoading } = useWorkspace();
    const inviteMember = useInviteMember();
    const updateRole = useUpdateMemberRole();
    const removeMember = useRemoveMember();
    const [inviteEmail, setInviteEmail] = useState("");
    const [inviteSuccess, setInviteSuccess] = useState(false);

    const handleInvite = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inviteEmail.trim()) return;

        try {
            await inviteMember.mutateAsync(inviteEmail.trim());
            setInviteSuccess(true);
            setInviteEmail("");
            setTimeout(() => setInviteSuccess(false), 2500);
        } catch (err: any) {
            alert(err.message || "Failed to invite member");
        }
    };

    const handleRemove = async (member: WorkspaceMember) => {
        if (!confirm(`Remove ${member.name} (${member.email}) from the workspace?`)) return;
        try {
            await removeMember.mutateAsync(member.id);
        } catch (err: any) {
            alert(err.message || "Failed to remove member");
        }
    };

    return (
        <AppLayout title="Workspace">
            <div className="max-w-4xl">
                {/* Invite */}
                <div className="card p-5 mb-6">
                    <h2 className="section-title mb-4">Invite a Member</h2>
                    <form
                        onSubmit={handleInvite}
                        className="flex items-center gap-3"
                    >
                        <div className="relative flex-1 max-w-sm">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                            <input
                                type="email"
                                value={inviteEmail}
                                onChange={(e) => setInviteEmail(e.target.value)}
                                placeholder="colleague@company.com"
                                className="form-input pl-9"
                                disabled={inviteMember.isPending}
                            />
                        </div>
                        <button
                            type="submit"
                            className="btn-primary"
                            disabled={inviteMember.isPending || !inviteEmail.trim()}
                        >
                            {inviteMember.isPending ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : inviteSuccess ? (
                                <Check className="w-4 h-4" />
                            ) : (
                                <Plus className="w-4 h-4" />
                            )}
                            {inviteMember.isPending
                                ? "Inviting…"
                                : inviteSuccess
                                ? "Invited!"
                                : "Invite Member"}
                        </button>
                    </form>
                </div>

                {/* Members table */}
                <div className="card overflow-hidden">
                    <div className="px-5 py-4 border-b border-gray-200">
                        <h2 className="section-title">
                            Team Members
                            {members && (
                                <span className="ml-2 text-xs font-normal text-gray-500">
                                    ({members.length})
                                </span>
                            )}
                        </h2>
                    </div>

                    {isLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : members && members.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="text-left text-xs font-medium text-gray-500 px-5 py-3 w-[35%]">
                                            Member
                                        </th>
                                        <th className="text-left text-xs font-medium text-gray-500 px-4 py-3 w-[30%]">
                                            Email
                                        </th>
                                        <th className="text-left text-xs font-medium text-gray-500 px-4 py-3 w-[15%]">
                                            Role
                                        </th>
                                        <th className="text-left text-xs font-medium text-gray-500 px-4 py-3 w-[15%]">
                                            Joined
                                        </th>
                                        <th className="text-left text-xs font-medium text-gray-500 px-4 py-3 w-[5%]" />
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {members.map((member: WorkspaceMember) => (
                                        <tr key={member.id} className="group hover:bg-gray-500 hover:text-black transition-colors">
                                            <td className="px-5 py-3.5">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-100 text-primary text-xs font-semibold shrink-0">
                                                        {getInitials(member.name)}
                                                    </div>
                                                    <span className="font-medium text-gray-900">
                                                        {member.name}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3.5 text-gray-500">
                                                {member.email}
                                            </td>
                                            <td className="px-4 py-3.5">
                                                <select
                                                    value={member.role}
                                                    onChange={(e) =>
                                                        updateRole.mutate({
                                                            id: member.id,
                                                            role: e.target.value as MemberRole,
                                                        })
                                                    }
                                                    className="text-xs font-medium border border-gray-200 rounded-lg px-2.5 py-1.5 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary"
                                                >
                                                    {ROLE_OPTIONS.map((r) => (
                                                        <option key={r} value={r}>
                                                            {r.charAt(0).toUpperCase() + r.slice(1)}
                                                        </option>
                                                    ))}
                                                </select>
                                            </td>
                                            <td className="px-4 py-3.5 text-gray-500 text-xs">
                                                {formatDate(member.joinedAt)}
                                            </td>
                                            <td className="px-4 py-3.5">
                                                <button
                                                    className="flex items-center justify-center w-7 h-7 rounded-md text-gray-500 hover:text-danger hover:bg-danger-light transition-colors opacity-0 group-hover:opacity-100"
                                                    aria-label={`Remove ${member.name}`}
                                                    onClick={() => handleRemove(member)}
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-16 text-center">
                            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gray-100 mb-4">
                                <UserPlus className="w-6 h-6 text-gray-400" />
                            </div>
                            <p className="text-sm font-medium text-gray-900">No team members yet</p>
                            <p className="text-xs text-gray-500 mt-1">
                                Invite your first team member using the form above
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
