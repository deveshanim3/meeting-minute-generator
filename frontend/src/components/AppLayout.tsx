import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import AuthGuard from "@/components/AuthGuard";

interface AppLayoutProps {
    /** Page title shown in the topbar */
    title: string;
    children: React.ReactNode;
}

/**
 * Main application shell: fixed sidebar + topbar + scrollable content area.
 * All authenticated pages should use this layout.
 */
export default function AppLayout({ title, children }: AppLayoutProps) {
    return (
        <AuthGuard>
            <div className="min-h-screen bg-gray-50">
                <Sidebar />
                <Topbar title={title} />
                <main className="pl-sidebar pt-topbar min-h-screen">
                    <div className="p-6">{children}</div>
                </main>
            </div>
        </AuthGuard>
    );
}
