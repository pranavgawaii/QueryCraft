import { AlertCircle, CheckCircle2, Info, X } from "lucide-react";

import { useToastStore } from "@/stores/toastStore";

const iconByType = {
  success: <CheckCircle2 className="h-4 w-4 text-emerald-600" aria-hidden />,
  error: <AlertCircle className="h-4 w-4 text-red-600" aria-hidden />,
  info: <Info className="h-4 w-4 text-blue-600" aria-hidden />,
};

const styleByType = {
  success: "border-emerald-200 bg-emerald-50",
  error: "border-red-200 bg-red-50",
  info: "border-blue-200 bg-blue-50",
};

export const ToastViewport = () => {
  const { toasts, dismissToast } = useToastStore();

  return (
    <div className="fixed right-4 top-4 z-50 flex w-full max-w-sm flex-col gap-3" aria-live="polite">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`rounded-lg border p-3 shadow ${styleByType[toast.type]} backdrop-blur-sm`}
          role="status"
        >
          <div className="flex items-start gap-2">
            {iconByType[toast.type]}
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-slate-900">{toast.title}</p>
              {toast.description ? <p className="mt-1 text-xs text-slate-700">{toast.description}</p> : null}
            </div>
            <button
              type="button"
              onClick={() => dismissToast(toast.id)}
              className="rounded p-1 text-slate-500 hover:bg-slate-100"
              aria-label="Dismiss notification"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
