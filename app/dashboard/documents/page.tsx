import { FileText } from "lucide-react";
import { ComingSoon } from "@/components/coming-soon";

export default function DocumentsPage() {
  return (
    <ComingSoon
      title="Documents"
      description="Manage and organize your learning documents"
      icon={<FileText className="w-8 h-8 text-white" />}
    />
  );
} 