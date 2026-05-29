import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { Rule } from "../../api/types";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Skeleton } from "../../components/ui/skeleton";
import { colors } from "../../design/tokens";

interface RuleHitRateChartProps {
  rules: Rule[] | undefined;
  loading: boolean;
}

export function RuleHitRateChart({ rules, loading }: RuleHitRateChartProps) {
  const data = (rules ?? [])
    .filter((r) => r.enabled)
    .slice(0, 8)
    .map((r) => ({
      name: r.name.length > 18 ? `${r.name.slice(0, 18)}…` : r.name,
      conditions: r.conditions.length,
      shadow: r.shadow,
      priority: r.priority,
    }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Active rules</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-44 w-full" />
        ) : !data.length ? (
          <p className="text-sm text-slate-500 py-14 text-center">No active rules</p>
        ) : (
          <ResponsiveContainer width="100%" height={176}>
            <BarChart data={data} margin={{ top: 4, right: 8, left: -24, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={colors.border} vertical={false} />
              <XAxis
                dataKey="name"
                tick={{ fill: colors.text.muted, fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: colors.text.muted, fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
                label={{ value: "conditions", angle: -90, position: "insideLeft", fill: colors.text.muted, fontSize: 10, dx: 16 }}
              />
              <Tooltip
                contentStyle={{
                  background: colors.surface,
                  border: `1px solid ${colors.border}`,
                  borderRadius: 6,
                  fontSize: 12,
                  color: colors.text.primary,
                }}
              />
              <Bar dataKey="conditions" radius={[3, 3, 0, 0]}>
                {data.map((entry, i) => (
                  <Cell
                    key={i}
                    fill={entry.shadow ? colors.muted : colors.primary}
                    opacity={entry.shadow ? 0.6 : 1}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
