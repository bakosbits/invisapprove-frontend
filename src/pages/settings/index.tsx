import { Users } from "lucide-react";
import { PageShell } from "../../components/layout/page-shell";
import { Card, CardContent } from "../../components/ui/card";

export function SettingsPage() {
  return (
    <PageShell title="Settings">
      <div className="mx-auto max-w-3xl">
        <Card>
          <CardContent className="pt-5">
            <div className="flex flex-col items-center justify-center py-12 text-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-invisapprove-muted border border-invisapprove-border">
                <Users className="h-5 w-5 text-slate-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-300">Settings coming soon</p>
                <p className="text-xs text-slate-500 mt-1 max-w-xs">
                  Team management, notification preferences, and system integrations will be configured here.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}
