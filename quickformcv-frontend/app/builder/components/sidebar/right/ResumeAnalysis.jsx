"use client";

import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ResumeAnalysis() {
  return (
    <div className="p-8 space-y-4">
      <h2 className="text-lg font-semibold flex items-center gap-2">
        <Sparkles className="h-5 w-5" />
        Resume Analysis
      </h2>
      <p className="text-sm text-muted-foreground">
        we will analyze your resume and provide you with actionable insights.
      </p>
      <Button className="w-full bg-black text-white hover:bg-gray-800">
        {" "}
        <Sparkles className="h-5 w-5" /> Analyze
      </Button>
    </div>
  );
}
