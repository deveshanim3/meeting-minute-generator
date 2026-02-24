/** Meeting status values */
export type MeetingStatus = "queued" | "processing" | "completed" | "failed";

/** Role values for workspace members */
export type MemberRole = "admin" | "editor" | "viewer";

/** Status values for action items */
export type ActionItemStatus = "pending" | "in-progress" | "done";

/** Represents a single meeting */
export interface Meeting {
    id: string;
    title: string;
    date: string; // ISO date string
    participantsCount: number;
    status: MeetingStatus;
    agenda?: string;
    participants: string[];
    audioFileUrl?: string;
}

/** Represents a single action item in the minutes */
export interface ActionItem {
    id: string;
    task: string;
    owner: string | null;
    deadline: string | null; // ISO date string
    status: ActionItemStatus;
}

/** Structured meeting minutes */
export interface MeetingMinutes {
    id: string;
    meetingId: string;
    summary: string;
    keyDiscussionPoints: string[];
    decisions: string[];
    actionItems: ActionItem[];
    openQuestions: string[];
    transcript?: string;
    generatedAt: string; // ISO date string
}

/** Workspace member */
export interface WorkspaceMember {
    id: string;
    name: string;
    email: string;
    role: MemberRole;
    avatarUrl?: string;
    joinedAt: string; // ISO date string
}

/** Workspace */
export interface Workspace {
    id: string;
    name: string;
    members: WorkspaceMember[];
}

/** Processing step */
export interface ProcessingStep {
    id: string;
    label: string;
    status: "pending" | "active" | "completed" | "failed";
}

/** Search & filter params for meeting list */
export interface MeetingFilters {
    search?: string;
    status?: MeetingStatus | "all";
    dateFrom?: string;
    dateTo?: string;
}

/** Nav item in sidebar */
export interface NavItem {
    label: string;
    href: string;
    icon: string;
}
