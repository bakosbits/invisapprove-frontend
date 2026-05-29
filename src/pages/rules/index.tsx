import { PageShell } from "../../components/layout/page-shell";
import { Card } from "../../components/ui/card";
import { useRules } from "../../hooks/use-rules";
import { CreateRuleDialog } from "./create-rule-dialog";
import { RulesTable } from "./rules-table";

export function RulesPage() {
  const { data: rules, isLoading } = useRules();

  return (
    <PageShell title="Rules" actions={<CreateRuleDialog />}>
      <div className="mx-auto max-w-5xl">
        <Card className="overflow-hidden">
          <RulesTable rules={rules} loading={isLoading} />
        </Card>
      </div>
    </PageShell>
  );
}
