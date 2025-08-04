import { toast } from "sonner";
import { CheckCheck, CircleX, TriangleAlert } from "lucide-react";
import { XCircle } from "lucide-react";

export const handleSuccessToast = (message) => {
  toast.custom(() => (
    <div
      className="flex items-center gap-2 p-4 rounded-md shadow-md border text-sm transition-all
                    bg-emerald-100 text-emerald-900 border-emerald-200"
    >
      <CheckCheck className="w-5 h-5 text-emerald-700" />
      <span>{message}</span>
    </div>
  ));
};

export const handleFailureToast = (message) => {
  toast.custom(() => (
    <div
      className="flex items-center gap-2 p-4 rounded-md shadow-md border text-sm transition-all
                    bg-red-100 text-red-900 border-red-200"
    >
      <XCircle className="w-5 h-5 text-red-700" />
      <span>{message}</span>
    </div>
  ));
};

export const handleWarningToast = (message) => {
  toast.custom(() => (
    <div
      className="flex items-center gap-2 p-4 rounded-md shadow-md border text-sm transition-all
                    bg-yellow-100 text-yellow-900 border-yellow-200"
    >
      <TriangleAlert className="w-5 h-5 text-yellow-700" />
      <span>{message}</span>
    </div>
  ));
};
