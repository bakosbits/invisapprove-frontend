import { subDays, format, startOfDay } from "date-fns";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { Approval } from "../../api/types";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Skeleton } from "../../components/ui/skeleton";
import { colors } from "../../design/tokens";

function buildChartData(approvals: Approval[]) {
  const days = Array.from({ length: 30 }, (_, i) => {
    const date = startOfDay(subDays(new Date(), 29 - i));
    return { date, label: format(date, "MMM d"), count: 0 };
  });

  for (const approval of approvals) {
    const created = startOfDay(new Date(approval.created_at));
    const entry = days.find((d) => d.date.getTime() === created.getTime());
    if (entry) entry.count += 1;
  }

  return days.map(({ label, count }) => ({ date: label, approvals: count }));
}

interface ApprovalChartProps {
  approvals: Approval[] | undefined;
  loading: boolean;
}

export function ApprovalChart({ approvals, loading }: ApprovalChartProps) {
  const data = approvals ? buildChartData(approvals) : [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Approvals — last 30 days</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-44 w-full" />
        ) : (
          <ResponsiveContainer width="100%" height={176}>
            <AreaChart data={data} margin={{ top: 4, right: 8, left: -24, bottom: 0 }}>
              <defs>
                <linearGradient id="approvalGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={colors.primary} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={colors.primary} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={colors.border} vertical={false} />
              <XAxis
                dataKey="date"
                tick={{ fill: colors.text.muted, fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                interval={6}
              />
              <YAxis
                tick={{ fill: colors.text.muted, fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  background: colors.surface,
                  border: `1px solid ${colors.border}`,
                  borderRadius: 6,
                  fontSize: 12,
                  color: colors.text.primary,
                }}
                cursor={{ stroke: colors.muted }}
              />
              <Area
                type="monotone"
                dataKey="approvals"
                stroke={colors.primary}
                strokeWidth={2}
                fill="url(#approvalGradient)"
                dot={false}
                activeDot={{ r: 4, fill: colors.primary, stroke: colors.surface, strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
