import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { Approval } from "../../api/types";
import { CATEGORY_LABELS } from "../../lib/categories";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Skeleton } from "../../components/ui/skeleton";
import { colors } from "../../design/tokens";

const SLICE_COLORS = [
  colors.primary,
  colors.accent,
  colors.status.approved,
  colors.status.rejected,
  colors.status.auto_approved,
  "#06B6D4",
  "#EC4899",
];

interface CategoryBreakdownProps {
  approvals: Approval[] | undefined;
  loading: boolean;
}

export function CategoryBreakdown({ approvals, loading }: CategoryBreakdownProps) {
  const data = Object.entries(
    (approvals ?? []).reduce<Record<string, number>>((acc, a) => {
      if (!a.category) return acc;
      acc[a.category] = (acc[a.category] ?? 0) + 1;
      return acc;
    }, {})
  )
    .map(([category, count]) => ({
      name: CATEGORY_LABELS[category as keyof typeof CATEGORY_LABELS] ?? category,
      value: count,
    }))
    .sort((a, b) => b.value - a.value);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Category breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-44 w-full" />
        ) : !data.length ? (
          <p className="text-sm text-slate-500 py-14 text-center">No data yet</p>
        ) : (
          <div className="flex items-center gap-4">
            <ResponsiveContainer width={160} height={160}>
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={44}
                  outerRadius={72}
                  paddingAngle={2}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {data.map((_, i) => (
                    <Cell key={i} fill={SLICE_COLORS[i % SLICE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: colors.surface,
                    border: `1px solid ${colors.border}`,
                    borderRadius: 6,
                    fontSize: 12,
                    color: colors.text.primary,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <ul className="flex-1 space-y-1.5 min-w-0">
              {data.map((entry, i) => (
                <li key={entry.name} className="flex items-center gap-2 text-xs min-w-0">
                  <span
                    className="h-2 w-2 shrink-0 rounded-full"
                    style={{ background: SLICE_COLORS[i % SLICE_COLORS.length] }}
                  />
                  <span className="truncate text-slate-400">{entry.name}</span>
                  <span className="ml-auto font-mono text-slate-300 tabular-nums">{entry.value}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
