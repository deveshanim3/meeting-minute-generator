import { auth } from "@/lib/firebase";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://meeting-minute-generator.onrender.com/api/v1";

/**
 * Returns the current user's Firebase ID token for Authorization header.
 * Throws if the user is not logged in.
 */
async function getAuthHeaders(): Promise<Record<string, string>> {
    const user = auth.currentUser;
    if (!user) throw new Error("Not authenticated");
    const token = await user.getIdToken();
    return { Authorization: `Bearer ${token}` };
}

/**
 * Authenticated GET request
 */
export async function apiGet(path: string) {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_URL}${path}`, { headers });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Request failed");
    return data;
}

/**
 * Authenticated POST request (JSON body)
 */
export async function apiPost(path: string, body: Record<string, any>) {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_URL}${path}`, {
        method: "POST",
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Request failed");
    return data;
}

/**
 * Authenticated POST request with FormData (for file uploads)
 */
export async function apiPostForm(path: string, formData: FormData) {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_URL}${path}`, {
        method: "POST",
        headers, // no Content-Type — browser sets it with boundary
        body: formData,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Request failed");
    return data;
}

/**
 * Authenticated PATCH request
 */
export async function apiPatch(path: string, body: Record<string, any>) {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_URL}${path}`, {
        method: "PATCH",
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Request failed");
    return data;
}

/**
 * Authenticated DELETE request
 */
export async function apiDelete(path: string) {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_URL}${path}`, {
        method: "DELETE",
        headers,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Request failed");
    return data;
}
