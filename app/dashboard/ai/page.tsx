import { Sparkles } from "lucide-react";
import { ComingSoon } from "@/components/coming-soon";

export default function AIAssistantPage() {
  return (
    <ComingSoon
      title="AI Assistant"
      description="Your personal AI-powered learning companion"
      icon={<Sparkles className="w-8 h-8 text-white" />}
    />
  );
}
