import Link from "next/link";
import { FileText, Sparkles, Clock3, CheckCircle2 } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

/**
 * Public landing page.
 */
export default function Home() {
  return (
    <main className="min-h-screen bg-linear-to from-white to-gray-50">
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle className="bg-white border border-gray-200" />
      </div>
      <section className="max-w-6xl mx-auto px-6 py-16 sm:py-24">
        <div className="flex items-center gap-2.5 mb-8">
          <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-xl">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-semibold text-gray-900">MeetMind</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 text-primary text-xs font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              AI Meeting Minutes
            </p>
            <h1 className="mt-5 text-4xl sm:text-5xl font-semibold text-gray-900 leading-tight">
              Turn recordings into clear, actionable minutes.
            </h1>
            <p className="mt-4 text-base text-gray-600 max-w-xl">
              Upload your meeting audio or transcript and get structured summaries,
              decisions, and action items in minutes.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href="/login" className="btn-primary">
                Get Started
              </Link>
              <Link href="/dashboard" className="btn-secondary">
                Go to Dashboard
              </Link>
            </div>
          </div>

          <div className="card p-6 sm:p-8 space-y-4">
            {[
              {
                icon: Clock3,
                title: "Fast generation",
                text: "From upload to final minutes in just a few steps.",
              },
              {
                icon: CheckCircle2,
                title: "Structured output",
                text: "Action items, owners, and deadlines neatly organized.",
              },
              {
                icon: Sparkles,
                title: "Consistent quality",
                text: "Keep every meeting aligned and easy to review later.",
              },
            ].map((item) => (
              <div key={item.title} className="flex gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary-50 text-primary flex items-center justify-center shrink-0">
                  <item.icon className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{item.title}</p>
                  <p className="text-sm text-gray-600">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
