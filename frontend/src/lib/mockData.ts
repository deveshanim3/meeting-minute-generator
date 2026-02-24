import { Meeting, MeetingMinutes, WorkspaceMember, ProcessingStep } from "@/types";

/** Mock meetings data */
export const MOCK_MEETINGS: Meeting[] = [
    {
        id: "1",
        title: "Q1 Product Roadmap Review",
        date: "2024-01-15T10:00:00Z",
        participantsCount: 8,
        status: "completed",
        agenda: "Review Q1 OKRs, discuss product priorities for Q2",
        participants: ["Alice Johnson", "Bob Smith", "Carol White", "David Lee"],
    },
    {
        id: "2",
        title: "Engineering Sprint Planning",
        date: "2024-01-18T14:00:00Z",
        participantsCount: 6,
        status: "completed",
        agenda: "Sprint 14 planning, backlog grooming",
        participants: ["Eve Martinez", "Frank Chen", "Grace Kim"],
    },
    {
        id: "3",
        title: "Marketing Campaign Kickoff",
        date: "2024-01-20T09:30:00Z",
        participantsCount: 5,
        status: "processing",
        agenda: "Q1 campaign strategy, budget allocation",
        participants: ["Helen Brown", "Ivan Davis"],
    },
    {
        id: "4",
        title: "Customer Feedback Analysis",
        date: "2024-01-22T11:00:00Z",
        participantsCount: 4,
        status: "queued",
        agenda: "Review NPS scores, plan improvements",
        participants: ["Jane Wilson", "Kevin Moore"],
    },
    {
        id: "5",
        title: "Board Meeting — January",
        date: "2024-01-10T15:00:00Z",
        participantsCount: 12,
        status: "failed",
        agenda: "Financial overview, strategic initiatives",
        participants: ["Laura Taylor", "Mike Anderson"],
    },
    {
        id: "6",
        title: "Design System Workshop",
        date: "2024-01-24T13:00:00Z",
        participantsCount: 7,
        status: "completed",
        agenda: "Component library updates, accessibility review",
        participants: ["Nancy Thomas", "Oscar Jackson"],
    },
];

/** Mock minutes data */
export const MOCK_MINUTES: MeetingMinutes = {
    id: "min-1",
    meetingId: "1",
    summary:
        "The Q1 Product Roadmap Review covered the progress against OKRs, identified gaps in delivery, and aligned the team on Q2 priorities. Key decisions were made around feature deprioritization and resource allocation.",
    keyDiscussionPoints: [
        "Current OKR completion rate stands at 68%, below the 80% target",
        "Mobile app launch delayed by 3 weeks due to backend dependencies",
        "Analytics dashboard received strong positive feedback from beta users",
        "New AI-powered search feature is on track for end of Q1",
        "Customer churn rate has decreased by 12% following UX improvements",
    ],
    decisions: [
        "Deprioritize the reporting module to Q2 to focus on core feature stability",
        "Allocate 2 additional engineers to the mobile team for the next 6 weeks",
        "Launch the beta version of analytics to top 20% of customers by Feb 1",
        "Schedule weekly sync between product and engineering leads",
    ],
    actionItems: [
        {
            id: "ai-1",
            task: "Update Q2 roadmap document with revised priorities",
            owner: "Alice Johnson",
            deadline: "2024-01-22T00:00:00Z",
            status: "done",
        },
        {
            id: "ai-2",
            task: "Prepare mobile team resource allocation proposal",
            owner: "Bob Smith",
            deadline: "2024-01-19T00:00:00Z",
            status: "in-progress",
        },
        {
            id: "ai-3",
            task: "Identify beta customers for analytics rollout",
            owner: null,
            deadline: null,
            status: "pending",
        },
        {
            id: "ai-4",
            task: "Set up weekly sync calendar invites",
            owner: "Carol White",
            deadline: "2024-01-16T00:00:00Z",
            status: "done",
        },
        {
            id: "ai-5",
            task: "Draft churn analysis report for stakeholders",
            owner: null,
            deadline: "2024-01-26T00:00:00Z",
            status: "pending",
        },
    ],
    openQuestions: [
        "What is the contingency plan if the mobile launch slips further?",
        "Should we consider a phased rollout approach for the analytics feature?",
        "How do we measure success for the AI search feature post-launch?",
    ],
    transcript: `[00:00] Alice Johnson: Good morning everyone. Let's get started with our Q1 roadmap review.

[00:15] Bob Smith: Thanks Alice. I've pulled up the OKR dashboard. We're currently at 68% completion.

[00:45] Carol White: That's below our target of 80%. What are the main blockers?

[01:02] David Lee: The mobile app launch has been delayed by about 3 weeks due to backend API dependencies. We're working to resolve them.

[02:15] Alice Johnson: What about the analytics dashboard? I've heard positive feedback from the beta group.

[03:01] Eve Martinez: Yes, NPS for the analytics feature is 8.4 out of 10. Users love the visualizations.

[04:20] Frank Chen: The AI search feature is on schedule. We should have it ready by end of Q1.

[05:10] Alice Johnson: Given the mobile delay, I think we should deprioritize the reporting module. We can push it to Q2 and focus on stability.

[05:45] Bob Smith: Agreed. We should also add resources to the mobile team — maybe 2 engineers for the next 6 weeks.

[06:20] Carol White: I can prepare the resource allocation proposal by Friday.

[07:00] Alice Johnson: Perfect. One more thing — let's set up a weekly sync between product and engineering to avoid these surprises going forward.`,
    generatedAt: "2024-01-16T09:00:00Z",
};

/** Mock workspace members */
export const MOCK_MEMBERS: WorkspaceMember[] = [
    {
        id: "m1",
        name: "Alice Johnson",
        email: "alice@company.com",
        role: "admin",
        joinedAt: "2023-06-01T00:00:00Z",
    },
    {
        id: "m2",
        name: "Bob Smith",
        email: "bob@company.com",
        role: "editor",
        joinedAt: "2023-07-15T00:00:00Z",
    },
    {
        id: "m3",
        name: "Carol White",
        email: "carol@company.com",
        role: "editor",
        joinedAt: "2023-08-10T00:00:00Z",
    },
    {
        id: "m4",
        name: "David Lee",
        email: "david@company.com",
        role: "viewer",
        joinedAt: "2023-09-20T00:00:00Z",
    },
    {
        id: "m5",
        name: "Eve Martinez",
        email: "eve@company.com",
        role: "viewer",
        joinedAt: "2023-11-05T00:00:00Z",
    },
];

/** Mock processing steps */
export const MOCK_PROCESSING_STEPS: ProcessingStep[] = [
    { id: "upload", label: "Uploaded", status: "completed" },
    { id: "transcribe", label: "Transcribing", status: "completed" },
    { id: "generate", label: "Generating Minutes", status: "active" },
    { id: "format", label: "Formatting Output", status: "pending" },
];
