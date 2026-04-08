import { EntryStatus, STATUS_ACTION_MAP } from "@/types";
import { cn, getStatusBg, getStatusColor } from "@/lib/utils";

interface StatusBadgeProps {
  status: EntryStatus;
  size?: "sm" | "md" | "lg";
  showAction?: boolean;
}

export function StatusBadge({ status, size = "md", showAction = false }: StatusBadgeProps) {
  const action = STATUS_ACTION_MAP[status];

  return (
    <div className="flex items-center gap-2">
      <span
        className={cn(
          "inline-flex items-center rounded-xl border font-semibold tracking-wide shadow-[0_10px_30px_-25px_rgba(0,0,0,0.8)] backdrop-blur",
          getStatusBg(status),
          getStatusColor(status),
          {
            "px-2 py-0.5 text-xs": size === "sm",
            "px-3 py-1 text-sm": size === "md",
            "px-4 py-1.5 text-lg": size === "lg",
          },
          `status-${status.toLowerCase()}`
        )}
      >
        <StatusDot status={status} />
        {status}
      </span>
      {showAction ? <span className="text-xs text-gray-500">-&gt; {action}</span> : null}
    </div>
  );
}

function StatusDot({ status }: { status: EntryStatus }) {
  const colors: Record<EntryStatus, string> = {
    WAIT: "bg-yellow-400",
    READY: "bg-blue-400",
    CONFIRMED: "bg-green-400",
    INVALID: "bg-red-400",
  };

  return <span className={cn("mr-1.5 h-1.5 w-1.5 rounded-full", colors[status])} />;
}

interface EntryStatusCardProps {
  status: EntryStatus;
  reason: string;
  whatMustHappenNext: string;
}

export function EntryStatusCard({ status, reason, whatMustHappenNext }: EntryStatusCardProps) {
  const action = STATUS_ACTION_MAP[status];

  return (
    <div className={cn("rounded-xl border-2 p-5", getStatusBg(status), `status-${status.toLowerCase()}`)}>
      <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
        Entry Status
      </div>
      <div className="mb-3 flex items-center gap-3">
        <StatusBadge status={status} size="lg" />
      </div>
      <p className="text-sm text-gray-300">{reason}</p>
      <div className="mt-3 border-t border-white/5 pt-3">
        <p className="text-xs text-gray-500">
          <strong className="text-gray-400">What must happen:</strong> {whatMustHappenNext}
        </p>
      </div>
      <div className={cn("mt-3 text-sm font-semibold", getStatusColor(status))}>
        User Action: {action}
      </div>
    </div>
  );
}
