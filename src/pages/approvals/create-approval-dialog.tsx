import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  AMOUNT_APPLICABLE_CATEGORIES,
  AMOUNT_REQUIRED_CATEGORIES,
  CATEGORY_LABELS,
  CATEGORY_METADATA_FIELDS,
  CATEGORY_SLUGS,
} from "../../lib/categories";
import type { ApprovalCategory } from "../../lib/categories";
import { Button } from "../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { Input, Textarea } from "../../components/ui/input";
import { useMutateApproval } from "../../hooks/use-approvals";
import { useAuth } from "../../hooks/use-auth";
import { useUIStore } from "../../stores/ui.store";

const schema = z
  .object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    category: z.enum(CATEGORY_SLUGS, { required_error: "Category is required" }),
    amount: z.coerce.number().nonnegative("Must be 0 or greater").optional(),
    metadata: z.record(z.unknown()).optional(),
  })
  .superRefine((data, ctx) => {
    if (AMOUNT_REQUIRED_CATEGORIES.has(data.category) && data.amount == null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["amount"],
        message: "Amount is required for this category",
      });
    }
  });

type FormData = z.infer<typeof schema>;

export function CreateApprovalDialog() {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const { create } = useMutateApproval();
  const addToast = useUIStore((s) => s.addToast);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const category = watch("category") as ApprovalCategory | undefined;
  const metadataFields = category ? CATEGORY_METADATA_FIELDS[category] : [];
  const amountApplicable = category ? AMOUNT_APPLICABLE_CATEGORIES.has(category) : false;
  const amountRequired = category ? AMOUNT_REQUIRED_CATEGORIES.has(category) : false;

  const onSubmit = async (data: FormData) => {
    if (!user) return;
    await create.mutateAsync({
      title: data.title,
      description: data.description,
      requester_id: user.id,
      amount: data.amount,
      category: data.category,
      metadata: data.metadata,
    });
    addToast("Approval created", "success");
    reset();
    setOpen(false);
  };

  return (
    <>
      <Button size="sm" onClick={() => setOpen(true)} className="gap-1.5">
        <Plus className="h-3.5 w-3.5" />
        New approval
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New approval request</DialogTitle>
          </DialogHeader>

          <form onSubmit={(e) => void handleSubmit(onSubmit)(e)}>
            <div className="space-y-4 px-6 py-4">
              <Input
                label="Title"
                placeholder="Purchase order — AWS credits"
                error={errors.title?.message}
                {...register("title")}
              />
              <Textarea
                label="Description"
                placeholder="Optional details…"
                {...register("description")}
              />

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-slate-400">
                  Category <span className="text-rose-400">*</span>
                </label>
                <select
                  className="h-9 rounded-input border border-invisapprove-border bg-invisapprove-surface px-3 text-sm text-slate-100 focus:outline-none focus:border-invisapprove-primary focus:ring-1 focus:ring-invisapprove-primary"
                  {...register("category")}
                >
                  <option value="">Select category…</option>
                  {CATEGORY_SLUGS.map((slug) => (
                    <option key={slug} value={slug}>
                      {CATEGORY_LABELS[slug]}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="text-xs text-rose-400">{errors.category.message}</p>
                )}
              </div>

              {amountApplicable && (
                <Input
                  label={amountRequired ? "Amount (USD) *" : "Amount (USD)"}
                  type="number"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  error={errors.amount?.message}
                  {...register("amount")}
                />
              )}

              {metadataFields.length > 0 && (
                <div className="space-y-3 border-t border-invisapprove-border pt-3">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    Details
                  </p>
                  {metadataFields.map((field) => {
                    if (field.type === "select" && field.options) {
                      return (
                        <div key={field.key} className="flex flex-col gap-1.5">
                          <label className="text-xs font-medium text-slate-400">
                            {field.label}
                            {field.required && <span className="ml-1 text-rose-400">*</span>}
                          </label>
                          <select
                            className="h-9 rounded-input border border-invisapprove-border bg-invisapprove-surface px-3 text-sm text-slate-100 focus:outline-none focus:border-invisapprove-primary focus:ring-1 focus:ring-invisapprove-primary"
                            {...register(`metadata.${field.key}`)}
                          >
                            <option value="">Select…</option>
                            {field.options.map((opt) => (
                              <option key={opt} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </select>
                        </div>
                      );
                    }
                    if (field.type === "checkbox") {
                      return (
                        <div key={field.key} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id={field.key}
                            className="h-4 w-4 rounded border-invisapprove-border bg-invisapprove-surface accent-invisapprove-primary"
                            {...register(`metadata.${field.key}`)}
                          />
                          <label htmlFor={field.key} className="text-sm text-slate-300">
                            {field.label}
                          </label>
                        </div>
                      );
                    }
                    return (
                      <Input
                        key={field.key}
                        label={field.required ? `${field.label} *` : field.label}
                        type={field.type === "number" ? "number" : "text"}
                        placeholder={field.placeholder}
                        {...register(`metadata.${field.key}`, {
                          valueAsNumber: field.type === "number",
                        })}
                      />
                    );
                  })}
                </div>
              )}
            </div>

            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating…" : "Create approval"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
