import { FirebaseError } from "firebase/app";

export function getAuthErrorMessage(error: unknown): string {
  if (!(error instanceof FirebaseError)) {
    return "Authentication failed. Please try again.";
  }

  switch (error.code) {
    case "auth/email-already-in-use":
      return "This email is already in use. Try signing in instead.";
    case "auth/invalid-email":
      return "The email address is invalid.";
    case "auth/weak-password":
      return "Password is too weak. Use at least 6 characters.";
    case "auth/user-not-found":
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "Invalid email or password.";
    case "auth/operation-not-allowed":
      return "Email/Password sign-in is disabled in Firebase Auth. Enable it in Firebase Console > Authentication > Sign-in method.";
    case "auth/unauthorized-domain":
      return "This domain is not authorized in Firebase Auth. Add localhost in Firebase Console > Authentication > Settings > Authorized domains.";
    case "auth/invalid-api-key":
      return "Invalid Firebase API key. Check NEXT_PUBLIC_FIREBASE_API_KEY.";
    default:
      return `Authentication failed (${error.code}).`;
  }
}
