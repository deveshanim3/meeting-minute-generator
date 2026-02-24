"use client";

import { useAuth } from "@/context/AuthContext";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading, isConfigured } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (isLoading || !isConfigured || user) {
      return;
    }

    const next = encodeURIComponent(pathname || "/dashboard");
    router.replace(`/login?next=${next}`);
  }, [isLoading, isConfigured, user, pathname, router]);

  if (!isConfigured) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-center">
        <div className="max-w-md card p-6">
          <h1 className="text-lg font-semibold text-gray-900">Firebase is not configured</h1>
          <p className="mt-2 text-sm text-gray-500">
            Add your `NEXT_PUBLIC_FIREBASE_*` environment variables to enable authentication.
          </p>
        </div>
      </div>
    );
  }

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <p className="text-sm text-gray-500">Checking session...</p>
      </div>
    );
  }

  return <>{children}</>;
}
