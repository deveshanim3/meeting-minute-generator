import AppLayout from "@/components/AppLayout";

/**
 * Settings page placeholder.
 */
export default function SettingsPage() {
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
                                defaultValue="Alice Johnson"
                                className="form-input"
                            />
                        </div>
                        <div>
                            <label htmlFor="settings-email" className="form-label">
                                Email
                            </label>
                            <input
                                id="settings-email"
                                type="email"
                                defaultValue="alice@company.com"
                                className="form-input"
                            />
                        </div>
                        <div className="flex justify-end">
                            <button className="btn-primary text-sm">Save Changes</button>
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
