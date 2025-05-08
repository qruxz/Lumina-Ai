import { Network } from "lucide-react";
import { ComingSoon } from "@/components/coming-soon";

export default function KnowledgeMapPage() {
  return (
    <ComingSoon
      title="Knowledge Map"
      description="Visualize and connect your learning journey"
      icon={<Network className="w-8 h-8 text-white" />}
    />
  );
}
