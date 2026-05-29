import {
  PolarAngleAxis,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
} from "recharts";
import type { Approval } from "../../api/types";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Skeleton } from "../../components/ui/skeleton";
import { colors } from "../../design/tokens";

const SLA_HOURS = 48;

interface SlaMeta {
  rate: number;
  within: number;
  breached: number;
  atRisk: number;
  total: number;
}

function computeSla(approvals: Approval[]): SlaMeta {
  const terminal = approvals.filter((a) => a.status !== "pending");
  const total = approvals.length;

  if (!terminal.length) {
    const atRisk = approvals.filter((a) => {
      const ageHours = (Date.now() - new Date(a.created_at).getTime()) / 3_600_000;
      return ageHours > SLA_HOURS;
    }).length;
    return { rate: 0, within: 0, breached: 0, atRisk, total };
  }

  const within = terminal.filter((a) => {
    const created = new Date(a.created_at).getTime();
    const lastAction = a.actions.at(-1);
    const resolved = lastAction
      ? new Date(lastAction.created_at).getTime()
      : created;
    return (resolved - created) / 3_600_000 <= SLA_HOURS;
  }).length;

  const breached = terminal.length - within;

  const atRisk = approvals.filter((a) => {
    if (a.status !== "pending") return false;
    const ageHours = (Date.now() - new Date(a.created_at).getTime()) / 3_600_000;
    return ageHours > SLA_HOURS;
  }).length;

  return {
    rate: Math.round((within / terminal.length) * 100),
    within,
    breached,
    atRisk,
    total,
  };
}

function rateColor(rate: number): string {
  if (rate >= 90) return colors.status.approved;
  if (rate >= 70) return colors.accent;
  return colors.status.rejected;
}

interface SlaComplianceChartProps {
  approvals: Approval[] | undefined;
  loading: boolean;
}

export function SlaComplianceChart({ approvals, loading }: SlaComplianceChartProps) {
  const meta = computeSla(approvals ?? []);
  const fill = rateColor(meta.rate);

  const chartData = [
    { name: "SLA", value: meta.rate, fill },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>SLA compliance</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-44 w-full" />
        ) : !meta.total ? (
          <p className="text-sm text-slate-500 py-14 text-center">No approvals yet</p>
        ) : (
          <div className="flex items-center gap-6">
            {/* Radial gauge */}
            <div className="relative shrink-0" style={{ width: 160, height: 160 }}>
              <ResponsiveContainer width={160} height={160}>
                <RadialBarChart
                  cx="50%"
                  cy="50%"
                  innerRadius={52}
                  outerRadius={72}
                  startAngle={90}
                  endAngle={-270}
                  data={chartData}
                  barSize={16}
                >
                  {/* Track ring */}
                  <RadialBar
                    background={{ fill: colors.muted }}
                    dataKey="value"
                    cornerRadius={8}
                    max={100}
                  />
                  <PolarAngleAxis
                    type="number"
                    domain={[0, 100]}
                    tick={false}
                    axisLine={false}
                  />
                </RadialBarChart>
              </ResponsiveContainer>
              {/* Center label */}
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <span
                  className="text-2xl font-bold font-mono tabular-nums"
                  style={{ color: fill }}
                >
                  {meta.rate}%
                </span>
                <span className="text-[10px] text-slate-500 mt-0.5">within SLA</span>
              </div>
            </div>

            {/* Stats */}
            <ul className="flex-1 space-y-3">
              <StatRow
                label="Within 48 h"
                value={meta.within}
                color={colors.status.approved}
              />
              <StatRow
                label="Breached SLA"
                value={meta.breached}
                color={colors.status.rejected}
              />
              <StatRow
                label="Pending at risk"
                value={meta.atRisk}
                color={colors.accent}
              />
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function StatRow({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <li className="flex items-center gap-2 text-xs">
      <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: color }} />
      <span className="text-slate-400 flex-1">{label}</span>
      <span className="font-mono text-slate-300 tabular-nums">{value}</span>
    </li>
  );
}
