import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Metadata } from "next";
import { DashboardContent } from "@/components/dashboard/content";

export const metadata: Metadata = {
  title: "Dashboard | Lumina",
  description: "Your personal knowledge management dashboard",
};

export default async function DashboardPage() {
  const { userId } = auth();
  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="space-y-4">
          <h2 className="text-4xl font-bold tracking-tight">Welcome to your workspace</h2>
          <p className="text-zinc-400 text-lg">
            Your personal knowledge hub for smarter learning and organization
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href="/dashboard/notes" className="group">
            <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold group-hover:text-primary">Create Note</h3>
                  <p className="text-sm text-zinc-400 mt-1">Start a new note with AI assistance</p>
                </div>
                <div className="text-2xl opacity-80 group-hover:opacity-100">📝</div>
              </div>
            </div>
          </Link>

          <Link href="/dashboard/study" className="group">
            <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold group-hover:text-primary">Study Materials</h3>
                  <p className="text-sm text-zinc-400 mt-1">Access your learning resources</p>
                </div>
                <div className="text-2xl opacity-80 group-hover:opacity-100">📚</div>
              </div>
            </div>
          </Link>

          <Link href="/dashboard/ai" className="group">
            <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold group-hover:text-primary">AI Insights</h3>
                  <p className="text-sm text-zinc-400 mt-1">Get AI-powered learning suggestions</p>
                </div>
                <div className="text-2xl opacity-80 group-hover:opacity-100">🤖</div>
              </div>
            </div>
          </Link>

          <Link href="/dashboard/knowledge" className="group">
            <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold group-hover:text-primary">Quick Review</h3>
                  <p className="text-sm text-zinc-400 mt-1">Review today's key concepts</p>
                </div>
                <div className="text-2xl opacity-80 group-hover:opacity-100">🎯</div>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Fixed Plus Button */}
      <Link href="/dashboard/notes/new" className="fixed bottom-8 right-8">
        <Button size="lg" className="rounded-full w-14 h-14 bg-zinc-800 hover:bg-zinc-700 text-white border-none shadow-xl">
          <Plus className="w-6 h-6" />
        </Button>
      </Link>
    </div>
  );
}