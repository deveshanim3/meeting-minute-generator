"use client";

import { useState, useEffect } from "react";
import AppLayout from "@/components/AppLayout";
import { useAuth } from "@/context/AuthContext";
import { apiPatch } from "@/lib/api";
import { updateProfile } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Loader2, Check } from "lucide-react";

/**
 * Settings page.
 */
export default function SettingsPage() {
    const { user } = useAuth();
    
    const [displayName, setDisplayName] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);

    // Initialize display name from user
    useEffect(() => {
        if (user) {
            setDisplayName(user.displayName || "");
        }
    }, [user]);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            // 1. Call Backend API to save display name
            await apiPatch("/user/profile", { displayName });
            
            // 2. Update local Firebase Auth user profile
            if (auth.currentUser) {
                await updateProfile(auth.currentUser, { displayName });
                await auth.currentUser.reload();
            }

            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 2000);
        } catch (error: any) {
            alert("Failed to update profile: " + error.message);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <AppLayout title="Settings">
            <div className="max-w-2xl space-y-4">
                {/* Profile */}
                <div className="card p-5">
                    <h2 className="section-title mb-4">Profile</h2>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="display-name" className="form-label">
                                Display Name
                            </label>
                            <input
                                id="display-name"
                                type="text"
                                value={displayName}
                                onChange={(e) => setDisplayName(e.target.value)}
                                className="form-input"
                                placeholder="Your Name"
                            />
                        </div>
                        <div>
                            <label htmlFor="settings-email" className="form-label">
                                Email
                            </label>
                            <input
                                id="settings-email"
                                type="email"
                                value={user?.email || ""}
                                disabled
                                className="form-input bg-gray-50 text-gray-500 cursor-not-allowed opacity-75"
                            />
                        </div>
                        <div className="flex justify-end">
                            <button
                                className="btn-primary text-sm flex items-center gap-2"
                                onClick={handleSave}
                                disabled={isSaving || !displayName.trim()}
                            >
                                {isSaving ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : saveSuccess ? (
                                    <Check className="w-4 h-4" />
                                ) : null}
                                {isSaving ? "Saving..." : saveSuccess ? "Saved!" : "Save Changes"}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Notifications */}
                <div className="card p-5">
                    <h2 className="section-title mb-4">Notifications</h2>
                    <div className="space-y-3">
                        {[
                            "Email me when minutes are ready",
                            "Email me when a meeting fails",
                            "Weekly usage summary",
                        ].map((label) => (
                            <label
                                key={label}
                                className="flex items-center gap-3 cursor-pointer"
                            >
                                <input
                                    type="checkbox"
                                    defaultChecked
                                    className="w-4 h-4 accent-primary"
                                />
                                <span className="text-sm text-gray-900">{label}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Danger zone */}
                <div className="card p-5 border-danger/30">
                    <h2 className="section-title text-danger mb-2">Danger Zone</h2>
                    <p className="text-sm text-gray-500 mb-4">
                        Permanently delete your account and all associated data.
                    </p>
                    <button className="btn-danger text-sm">Delete Account</button>
                </div>
            </div>
        </AppLayout>
    );
}
