import * as React from "react";

import { cn } from "@/lib/utils";

const Textarea = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex w-full items-center gap-4 self-stretch px-5 py-4",
        "rounded-[10px] border border-[rgba(111,111,111,0.15)] bg-white shadow-[0px_0px_30px_5px_rgba(0,0,0,0.05)]",
        "text-base transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium",
        "file:text-foreground placeholder:text-muted-foreground",
        "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "md:text-sm custom-scrollbar",
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export { Textarea };
