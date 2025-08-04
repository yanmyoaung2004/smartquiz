import { Loader2 } from "lucide-react";

export default function LoadingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-800 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-10 w-10 text-gray-700 animate-spin dark:text-slate-200" />
        <span className="text-gray-700 text-lg font-medium dark:text-slate-200">
          Loading, please wait...
        </span>
      </div>
    </div>
  );
}
