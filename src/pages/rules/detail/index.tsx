import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useParams } from "react-router-dom";
import { z } from "zod";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Badge } from "../../../components/ui/badge";
import { Skeleton } from "../../../components/ui/skeleton";
import { useRule, useUpdateRule } from "../../../hooks/use-rules";
import { useUIStore } from "../../../stores/ui.store";
import { ConditionBuilder } from "../condition-builder";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  conditions: z.array(
    z.object({
      field: z.string().min(1),
      operator: z.string().min(1),
      value: z.string(),
    })
  ).min(1, "At least one condition is required"),
  actionType: z.enum(["auto_approve", "escalate", "require_approval"]),
  shadow: z.boolean(),
  priority: z.coerce.number().int(),
  enabled: z.boolean(),
});

type FormData = z.infer<typeof schema>;

export function RuleDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: rule, isLoading } = useRule(id!);
  const updateRule = useUpdateRule(id!);
  const addToast = useUIStore((s) => s.addToast);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (!rule) return;
    reset({
      name: rule.name,
      conditions: rule.conditions.map((c) => ({
        field: c.field,
        operator: c.operator,
        value: String(c.value ?? ""),
      })),
      actionType: (rule.actions[0]?.type ?? "auto_approve") as FormData["actionType"],
      shadow: rule.shadow,
      priority: rule.priority,
      enabled: rule.enabled,
    });
  }, [rule, reset]);

  const onSubmit = async (data: FormData) => {
    await updateRule.mutateAsync({
      name: data.name,
      conditions: data.conditions.map((c) => ({
        field: c.field,
        operator: c.operator as "<",
        value: isNaN(Number(c.value)) ? c.value : Number(c.value),
      })),
      actions: [{ type: data.actionType }],
      shadow: data.shadow,
      priority: data.priority,
      enabled: data.enabled,
    });
    addToast("Rule updated", "success");
    reset(data);
  };

  return (
    <div className="max-w-2xl">
      <Link
        to="/rules"
        className="mb-6 inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to rules
      </Link>

      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
      ) : rule ? (
        <>
          <div className="mb-6 flex items-center gap-3">
            <h1 className="text-xl font-semibold text-slate-100">{rule.name}</h1>
            <Badge variant={rule.enabled ? "approved" : "default"} dot>
              {rule.enabled ? "Enabled" : "Disabled"}
            </Badge>
            {rule.shadow && <Badge variant="shadow" dot={false}>shadow</Badge>}
          </div>

          <form onSubmit={(e) => void handleSubmit(onSubmit)(e)}>
            <div className="rounded-card border border-invisapprove-border bg-invisapprove-surface p-6 space-y-5">

              <Input
                label="Rule name"
                error={errors.name?.message}
                {...register("name")}
              />

              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Priority"
                  type="number"
                  {...register("priority")}
                />
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-slate-400">Mode</label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="rounded" {...register("shadow")} />
                      <span className="text-xs text-slate-300">Shadow mode (log only)</span>
                    </label>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-slate-400">State</label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="rounded" {...register("enabled")} />
                      <span className="text-xs text-slate-300">Enabled</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="border-t border-invisapprove-border pt-5 space-y-2">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Conditions</p>
                <p className="text-xs text-slate-600">All conditions must match (AND).</p>
                <ConditionBuilder control={control as never} />
                {errors.conditions?.message && (
                  <p className="text-xs text-rose-400">{errors.conditions.message}</p>
                )}
              </div>

              <div className="border-t border-invisapprove-border pt-5">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500 mb-2">Action on match</p>
                <select
                  className="h-9 w-full rounded-input border border-invisapprove-border bg-invisapprove-surface px-3 text-sm text-slate-100 focus:outline-none focus:border-invisapprove-primary"
                  {...register("actionType")}
                >
                  <option value="auto_approve">Auto-approve</option>
                  <option value="escalate">Escalate</option>
                  <option value="require_approval">Require approval</option>
                </select>
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <Button type="submit" disabled={isSubmitting || !isDirty}>
                {isSubmitting ? "Saving…" : "Save changes"}
              </Button>
            </div>
          </form>
        </>
      ) : (
        <p className="text-sm text-slate-500">Rule not found.</p>
      )}
    </div>
  );
}
