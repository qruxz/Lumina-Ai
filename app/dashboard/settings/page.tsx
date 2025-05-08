import { Settings } from "lucide-react";
import { ComingSoon } from "@/components/coming-soon";

export default function SettingsPage() {
  return (
    <ComingSoon
      title="Settings"
      description="Customize your learning experience"
      icon={<Settings className="w-8 h-8 text-white" />}
    />
  );
} 