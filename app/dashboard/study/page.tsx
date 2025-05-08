import { BookOpen } from "lucide-react";
import { ComingSoon } from "@/components/coming-soon";

export default function StudyPage() {
  return (
    <ComingSoon
      title="Study Sets"
      description="Create and manage your study materials"
      icon={<BookOpen className="w-8 h-8 text-white" />}
    />
  );
}
