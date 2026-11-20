"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/Button";
import {
  Users,
  Award,
  ShieldCheck,
  Clock,
  AlertTriangle,
  Activity,
  Search,
  CheckCircle2,
  XCircle,
  FileText,
} from "lucide-react";
import { formatDate, formatDateTime } from "@/lib/utils";

export default function SuperAdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const loadAdminData = async () => {
    try {
      const [statsRes, usersRes, logsRes] = await Promise.all([
        fetch("/api/admin/stats"),
        fetch(`/api/admin/users${search ? `?q=${encodeURIComponent(search)}` : ""}`),
        fetch("/api/admin/audit-logs"),
      ]);

      const statsJson = await statsRes.json();
      const usersJson = await usersRes.json();
      const logsJson = await logsRes.json();

      if (statsJson.stats) setStats(statsJson.stats);
      if (usersJson.users) setUsers(usersJson.users);
      if (logsJson.logs) setLogs(logsJson.logs);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, [search]);

  const toggleUserStatus = async (userId: string, currentStatus: string) => {
    const nextStatus = currentStatus === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, account_status: nextStatus }),
      });
      if (res.ok) {
        loadAdminData();
      }
    } catch {
      alert("Failed to update user status.");
    }
  };

  if (loading) {
    return <div className="py-20 text-center text-xs text-brand-muted">Loading administrative platform telemetry...</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-dark">Platform Overview & Governance</h1>
        <p className="text-xs sm:text-sm text-brand-muted">
          Platform-wide metrics, identity verification state, audit log stream, and user governance.
        </p>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-5 rounded-2xl border border-brand-border shadow-card space-y-1">
          <div className="flex items-center justify-between text-brand-muted text-xs">
            <span>Registered Users</span>
            <Users className="w-4 h-4 text-brand-yellow" />
          </div>
          <span className="text-3xl font-black text-brand-dark">{stats?.totalUsers || 0}</span>
          <span className="text-[11px] text-emerald-600 font-semibold">{stats?.activeUsers || 0} active</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-brand-border shadow-card space-y-1">
          <div className="flex items-center justify-between text-brand-muted text-xs">
            <span>Total Achievements</span>
            <Award className="w-4 h-4 text-brand-yellow" />
          </div>
          <span className="text-3xl font-black text-brand-dark">{stats?.totalAchievements || 0}</span>
          <span className="text-[11px] text-brand-muted">Across all portfolios</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-brand-border shadow-card space-y-1">
          <div className="flex items-center justify-between text-emerald-800 text-xs">
            <span>Verified Records</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="text-3xl font-black text-emerald-700">{stats?.verifiedAchievements || 0}</span>
          <span className="text-[11px] text-brand-muted">Third-party attested</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-brand-border shadow-card space-y-1">
          <div className="flex items-center justify-between text-amber-800 text-xs">
            <span>Pending Verifications</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <span className="text-3xl font-black text-amber-800">{stats?.pendingVerifications || 0}</span>
          <span className="text-[11px] text-brand-muted">Token requests active</span>
        </div>
      </div>

      {/* User Governance Table */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-border shadow-card space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-brand-dark">User Governance & Roster</h2>
            <p className="text-xs text-brand-muted">Inspect user portfolios and manage active privileges.</p>
          </div>
          <div className="relative max-w-xs w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-brand-muted" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email..."
              className="w-full pl-10 pr-3.5 py-2 rounded-xl border border-brand-border text-xs focus:outline-none focus:ring-2 focus:ring-brand-yellow/50"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-brand-border text-brand-muted uppercase text-[10px] tracking-wider">
                <th className="pb-3 font-bold">User</th>
                <th className="pb-3 font-bold">Role</th>
                <th className="pb-3 font-bold">Status</th>
                <th className="pb-3 font-bold">Achievements</th>
                <th className="pb-3 font-bold">Joined</th>
                <th className="pb-3 font-bold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-brand-soft/50 transition-colors">
                  <td className="py-3">
                    <span className="font-bold text-brand-dark block">{u.full_name}</span>
                    <span className="text-brand-muted text-[11px] block">{u.email}</span>
                  </td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 rounded-md bg-brand-soft border border-brand-border font-semibold text-[10px]">
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        u.account_status === "ACTIVE"
                          ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                          : "bg-red-50 text-red-800 border border-red-200"
                      }`}
                    >
                      {u.account_status}
                    </span>
                  </td>
                  <td className="py-3 font-semibold text-brand-dark">
                    {u._count?.achievements || 0} logged
                  </td>
                  <td className="py-3 text-brand-muted">{formatDate(u.created_at)}</td>
                  <td className="py-3 text-right">
                    <Button
                      onClick={() => toggleUserStatus(u.id, u.account_status)}
                      variant={u.account_status === "ACTIVE" ? "outline" : "secondary"}
                      size="sm"
                      className="text-[11px]"
                    >
                      {u.account_status === "ACTIVE" ? "Suspend" : "Reactivate"}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Structured Audit Log Viewer */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-border shadow-card space-y-4">
        <div className="flex items-center justify-between border-b border-brand-border pb-4">
          <div>
            <h2 className="text-lg font-bold text-brand-dark">Structured Security & Audit Trail</h2>
            <p className="text-xs text-brand-muted">Immutable log of critical system operations.</p>
          </div>
          <span className="text-xs text-brand-muted">Showing latest 100 events</span>
        </div>

        <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
          {logs.map((log) => (
            <div
              key={log.id}
              className="p-3 rounded-xl bg-brand-ivory border border-brand-border text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2"
            >
              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px] font-bold text-brand-dark bg-white px-2 py-0.5 rounded border border-brand-border">
                  {log.action}
                </span>
                <span className="text-brand-muted text-[11px]">{log.entity_type}</span>
              </div>
              <span className="text-[11px] text-brand-muted font-mono">{formatDateTime(log.created_at)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
