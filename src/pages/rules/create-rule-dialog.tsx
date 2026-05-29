import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";
import { useCreateRule } from "../../hooks/use-rules";
import { useUIStore } from "../../stores/ui.store";
import { ConditionBuilder } from "./condition-builder";

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
});

export type CreateRuleFormData = z.infer<typeof schema>;

export function CreateRuleDialog() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const createRule = useCreateRule();
  const addToast = useUIStore((s) => s.addToast);

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CreateRuleFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      conditions: [{ field: "amount", operator: "<", value: "" }],
      actionType: "auto_approve",
      shadow: false,
      priority: 0,
    },
  });

  const watchedName = watch("name");
  const watchedConditions = watch("conditions");
  const watchedAction = watch("actionType");

  const onSubmit = async (data: CreateRuleFormData) => {
    await createRule.mutateAsync({
      name: data.name,
      conditions: data.conditions.map((c) => ({
        field: c.field,
        operator: c.operator as "<",
        value: isNaN(Number(c.value)) ? c.value : Number(c.value),
      })),
      actions: [{ type: data.actionType }],
      enabled: true,
      shadow: data.shadow,
      priority: data.priority,
    });
    addToast("Rule created", "success");
    reset();
    setStep(1);
    setOpen(false);
  };

  const ACTION_LABELS = {
    auto_approve: "Auto-approve",
    escalate: "Escalate",
    require_approval: "Require approval",
  };

  return (
    <>
      <Button size="sm" onClick={() => setOpen(true)} className="gap-1.5">
        <Plus className="h-3.5 w-3.5" />
        New rule
      </Button>

      <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) { reset(); setStep(1); } }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {step === 1 && "Create rule — Name"}
              {step === 2 && "Create rule — Conditions"}
              {step === 3 && "Create rule — Action & preview"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={(e) => void handleSubmit(onSubmit)(e)}>
            <div className="px-6 py-4 space-y-4 min-h-[160px]">
              {step === 1 && (
                <>
                  <Input
                    label="Rule name"
                    placeholder="Auto-approve under $500"
                    error={errors.name?.message}
                    {...register("name")}
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      label="Priority"
                      type="number"
                      placeholder="0"
                      {...register("priority")}
                    />
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-medium text-slate-400">Mode</label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" className="rounded" {...register("shadow")} />
                        <span className="text-xs text-slate-300">Shadow mode (log only)</span>
                      </label>
                    </div>
                  </div>
                </>
              )}

              {step === 2 && (
                <div>
                  <p className="text-xs text-slate-500 mb-3">
                    All conditions must match (AND). Evaluated in priority order.
                  </p>
                  <ConditionBuilder control={control as never} />
                  {errors.conditions?.message && (
                    <p className="mt-1 text-xs text-rose-400">{errors.conditions.message}</p>
                  )}
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-slate-400">Action on match</label>
                    <select
                      className="h-9 rounded-input border border-invisapprove-border bg-invisapprove-surface px-3 text-sm text-slate-100 focus:outline-none focus:border-invisapprove-primary"
                      {...register("actionType")}
                    >
                      <option value="auto_approve">Auto-approve</option>
                      <option value="escalate">Escalate</option>
                      <option value="require_approval">Require approval</option>
                    </select>
                  </div>

                  {/* Preview */}
                  <div className="rounded-card border border-invisapprove-border bg-invisapprove-bg p-3 space-y-1">
                    <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">Preview</p>
                    <p className="text-sm font-medium text-slate-200">{watchedName}</p>
                    <p className="text-xs text-slate-500">
                      {watchedConditions.length} condition{watchedConditions.length !== 1 ? "s" : ""}
                      {" → "}
                      <span className="text-indigo-400">{ACTION_LABELS[watchedAction]}</span>
                    </p>
                  </div>
                </div>
              )}
            </div>

            <DialogFooter>
              {step > 1 && (
                <Button type="button" variant="ghost" onClick={() => setStep((s) => (s - 1) as 1 | 2 | 3)}>
                  Back
                </Button>
              )}
              <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              {step < 3 ? (
                <Button type="button" onClick={() => setStep((s) => (s + 1) as 1 | 2 | 3)}>
                  Next
                </Button>
              ) : (
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Creating…" : "Create rule"}
                </Button>
              )}
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
