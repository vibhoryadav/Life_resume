import { CheckCircle2, Clock, FileText, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface VerificationBadgeProps {
  status: string;
  className?: string;
  showIcon?: boolean;
}

export function VerificationBadge({ status, className = "", showIcon = true }: VerificationBadgeProps) {
  switch (status) {
    case "VERIFIED":
      return (
        <span
          className={cn(
            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/80 shadow-sm",
            className
          )}
        >
          {showIcon && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
          Verified
        </span>
      );

    case "VERIFICATION_REQUESTED":
      return (
        <span
          className={cn(
            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-brand-soft text-amber-900 border border-brand-yellow/50 shadow-sm",
            className
          )}
        >
          {showIcon && <Clock className="w-3.5 h-3.5 text-amber-600 animate-pulse" />}
          Verification Requested
        </span>
      );

    case "EVIDENCE_ATTACHED":
      return (
        <span
          className={cn(
            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50/80 text-amber-800 border border-amber-200/60",
            className
          )}
        >
          {showIcon && <FileText className="w-3.5 h-3.5 text-amber-600" />}
          Evidence Attached
        </span>
      );

    case "REJECTED":
      return (
        <span
          className={cn(
            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-800 border border-rose-200",
            className
          )}
        >
          {showIcon && <XCircle className="w-3.5 h-3.5 text-rose-600" />}
          Verification Declined
        </span>
      );

    case "EXPIRED":
      return (
        <span
          className={cn(
            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200",
            className
          )}
        >
          {showIcon && <Clock className="w-3.5 h-3.5 text-gray-400" />}
          Expired
        </span>
      );

    case "SELF_REPORTED":
    default:
      return (
        <span
          className={cn(
            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-50 text-gray-600 border border-brand-border",
            className
          )}
        >
          Self-Reported
        </span>
      );
  }
}
