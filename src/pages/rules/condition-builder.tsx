import { Plus, Trash2 } from "lucide-react";
import { useFieldArray, type Control } from "react-hook-form";
import type { CreateRuleFormData } from "./create-rule-dialog";
import { Button } from "../../components/ui/button";
import { CONDITION_FIELDS } from "../../lib/categories";

const OPERATORS = ["<", "<=", ">", ">=", "=", "!=", "in", "not_in", "exists"] as const;

interface ConditionBuilderProps {
  control: Control<CreateRuleFormData>;
}

export function ConditionBuilder({ control }: ConditionBuilderProps) {
  const { fields, append, remove } = useFieldArray({ control, name: "conditions" });

  return (
    <div className="space-y-2">
      {fields.map((field, index) => (
        <div key={field.id} className="flex items-center gap-2">
          <select
            className="flex-1 h-8 rounded-input border border-invisapprove-border bg-invisapprove-surface px-2 text-xs text-slate-200 focus:outline-none focus:border-invisapprove-primary"
            {...control.register(`conditions.${index}.field`)}
          >
            {CONDITION_FIELDS.map((group) => (
              <optgroup key={group.group} label={group.group}>
                {group.fields.map((f) => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </optgroup>
            ))}
          </select>
          <select
            className="w-24 h-8 rounded-input border border-invisapprove-border bg-invisapprove-surface px-2 text-xs text-slate-200 focus:outline-none focus:border-invisapprove-primary"
            {...control.register(`conditions.${index}.operator`)}
          >
            {OPERATORS.map((op) => <option key={op} value={op}>{op}</option>)}
          </select>
          <input
            placeholder="value"
            className="flex-1 h-8 rounded-input border border-invisapprove-border bg-invisapprove-surface px-2 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-invisapprove-primary"
            {...control.register(`conditions.${index}.value`)}
          />
          <button
            type="button"
            onClick={() => remove(index)}
            className="text-slate-600 hover:text-rose-400 transition-colors shrink-0"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="w-full gap-1.5 text-xs"
        onClick={() => append({ field: "amount", operator: "<", value: "" })}
      >
        <Plus className="h-3 w-3" />
        Add condition
      </Button>
    </div>
  );
}
