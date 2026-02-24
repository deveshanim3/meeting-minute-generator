"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FileText, Eye, EyeOff } from "lucide-react";
import { signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db, isFirebaseConfigured } from "@/lib/firebase";
import { getAuthErrorMessage } from "@/lib/firebaseAuthErrors";
import { generateRandomUsername, normalizeUsername } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import ThemeToggle from "@/components/ThemeToggle";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const nextPath = searchParams.get("next") || "/dashboard";

  useEffect(() => {
    if (user) {
      router.replace(nextPath);
    }
  }, [user, router, nextPath]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFirebaseConfigured) {
      setError("Firebase is not configured. Add NEXT_PUBLIC_FIREBASE_* variables.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const credential = await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );
      const existingName = credential.user.displayName?.trim() || "";
      const fallbackFromEmail = normalizeUsername(
        credential.user.email?.split("@")[0] || ""
      );
      const resolvedName =
        existingName || fallbackFromEmail || generateRandomUsername();

      if (!existingName) {
        await updateProfile(credential.user, { displayName: resolvedName });
      }

      await setDoc(
        doc(db, "users", credential.user.uid),
        {
          email: credential.user.email,
          lastLoginAt: serverTimestamp(),
          displayName: resolvedName,
          username: resolvedName,
        },
        { merge: true }
      );

      router.replace(nextPath);
    } catch (error) {
      setError(getAuthErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle className="bg-white border border-gray-200" />
      </div>
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-xl">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-semibold text-gray-900">MeetMind</span>
        </div>

        <div className="card p-8">
          <div className="mb-6">
            <h1 className="text-xl font-semibold text-gray-900">Welcome Back</h1>
            <p className="mt-1 text-sm text-gray-500">
              Sign in to your account to continue
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="form-label">
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alice@company.com"
                required
                autoComplete="email"
                className="form-input"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="form-label mb-0">
                  Password
                </label>
                <Link href="#" className="text-xs text-primary hover:text-primary-600">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="********"
                  required
                  autoComplete="current-password"
                  className="form-input pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-900"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {error ? <p className="text-sm text-danger">{error}</p> : null}

            <button type="submit" disabled={isSubmitting} className="btn-primary w-full mt-2">
              {isSubmitting ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-gray-500">
            Don&apos;t have an account?{" "}
            <Link
              href={`/signup?next=${encodeURIComponent(nextPath)}`}
              className="text-primary font-medium hover:text-primary-600"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
