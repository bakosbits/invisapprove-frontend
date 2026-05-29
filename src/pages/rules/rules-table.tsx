import { Zap } from "lucide-react";
import type { Rule } from "../../api/types";
import { Badge } from "../../components/ui/badge";
import { EmptyState } from "../../components/ui/empty-state";
import { Skeleton } from "../../components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { CreateRuleDialog } from "./create-rule-dialog";

const ACTION_LABELS: Record<string, string> = {
  auto_approve: "Auto-approve",
  escalate: "Escalate",
  require_approval: "Require approval",
};

interface RulesTableProps {
  rules: Rule[] | undefined;
  loading: boolean;
}

export function RulesTable({ rules, loading }: RulesTableProps) {
  if (loading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full rounded-card" />
        ))}
      </div>
    );
  }

  if (!rules?.length) {
    return (
      <EmptyState
        icon={Zap}
        title="No rules yet"
        description="Create rules to automate approvals based on conditions"
        action={<CreateRuleDialog />}
      />
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Conditions</TableHead>
          <TableHead>Action</TableHead>
          <TableHead className="text-right">Priority</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rules.map((rule) => (
          <TableRow key={rule.id}>
            <TableCell>
              <div className="flex items-center gap-2">
                <p className="font-medium text-slate-200">{rule.name}</p>
                {rule.shadow && <Badge variant="shadow" dot={false}>shadow</Badge>}
              </div>
            </TableCell>
            <TableCell>
              <span className="text-xs text-slate-500">
                {rule.conditions.length} condition{rule.conditions.length !== 1 ? "s" : ""}
              </span>
            </TableCell>
            <TableCell>
              {rule.actions.map((a, i) => (
                <Badge key={i} variant="primary" dot={false}>
                  {ACTION_LABELS[a.type] ?? a.type}
                </Badge>
              ))}
            </TableCell>
            <TableCell className="text-right font-mono tabular text-slate-400">
              {rule.priority}
            </TableCell>
            <TableCell>
              <Badge variant={rule.enabled ? "approved" : "default"} dot>
                {rule.enabled ? "Enabled" : "Disabled"}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
