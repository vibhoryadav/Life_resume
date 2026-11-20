import Link from "next/link";
import { Award } from "lucide-react";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`inline-flex items-center gap-2.5 font-bold tracking-tight text-brand-dark group ${className}`}>
      <div className="w-9 h-9 rounded-xl bg-brand-yellow flex items-center justify-center text-brand-dark shadow-sm group-hover:scale-105 transition-transform duration-200">
        <Award className="w-5 h-5 stroke-[2.2]" />
      </div>
      <div className="flex flex-col">
        <span className="font-extrabold text-lg leading-none tracking-tight">
          LIFE <span className="text-brand-yellow drop-shadow-sm text-stroke">RESUME</span>
        </span>
        <span className="text-[10px] text-brand-muted font-medium tracking-wider uppercase mt-0.5">
          Verified Identity
        </span>
      </div>
    </Link>
  );
}
