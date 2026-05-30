import { useState, useRef, useEffect } from "react";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { cn } from "../../lib/cn";
import { Avatar } from "./avatar";
import type { User } from "../../api/types";

interface UserComboboxProps {
  users: User[] | undefined;
  loading?: boolean;
  value: string | null;
  onChange: (userId: string | null) => void;
  placeholder?: string;
}

export function UserCombobox({
  users,
  loading,
  value,
  onChange,
  placeholder = "Search by name…",
}: UserComboboxProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const selected = users?.find((u) => u.id === value) ?? null;

  const filtered = users?.filter((u) => {
    if (!query) return true;
    const q = query.toLowerCase();
    return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
  }) ?? [];

  // Close on outside click
  useEffect(() => {
    function onPointerDown(e: PointerEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  function handleSelect(user: User) {
    onChange(user.id);
    setQuery("");
    setOpen(false);
  }

  function handleClear() {
    onChange(null);
    setQuery("");
    inputRef.current?.focus();
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setQuery(e.target.value);
    if (!open) setOpen(true);
    if (!e.target.value) onChange(null);
  }

  const displayValue = open ? query : (selected?.name ?? query);

  return (
    <div ref={containerRef} className="relative">
      <div
        className={cn(
          "flex h-9 items-center rounded-input border bg-invisapprove-surface px-3 text-sm transition-colors",
          open
            ? "border-invisapprove-primary ring-1 ring-invisapprove-primary"
            : "border-invisapprove-border"
        )}
      >
        {selected && !open && (
          <Avatar src={selected.avatar_url} name={selected.name} size="sm" className="mr-2 shrink-0" />
        )}
        <input
          ref={inputRef}
          className="flex-1 bg-transparent text-slate-100 placeholder:text-slate-500 focus:outline-none"
          placeholder={selected && !open ? selected.name : placeholder}
          value={displayValue}
          onChange={handleInputChange}
          onFocus={() => setOpen(true)}
        />
        <div className="flex items-center gap-1 ml-1">
          {loading && <Loader2 className="h-3.5 w-3.5 animate-spin text-slate-500" />}
          {selected && (
            <button
              type="button"
              onClick={handleClear}
              className="text-xs text-slate-500 hover:text-slate-300 px-1"
            >
              ×
            </button>
          )}
          <ChevronsUpDown className="h-3.5 w-3.5 text-slate-500 shrink-0" />
        </div>
      </div>

      {open && (
        <div className="absolute z-50 mt-1 w-full rounded-card border border-invisapprove-border bg-invisapprove-surface shadow-card overflow-hidden">
          {filtered.length === 0 ? (
            <p className="px-3 py-2 text-xs text-slate-500">
              {loading ? "Loading…" : "No users found"}
            </p>
          ) : (
            <ul className="max-h-48 overflow-y-auto py-1">
              {filtered.map((user) => (
                <li key={user.id}>
                  <button
                    type="button"
                    className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-slate-200 hover:bg-invisapprove-muted transition-colors"
                    onClick={() => handleSelect(user)}
                  >
                    <Avatar src={user.avatar_url} name={user.name} size="sm" className="shrink-0" />
                    <div className="flex-1 min-w-0 text-left">
                      <p className="truncate font-medium">{user.name}</p>
                      <p className="truncate text-xs text-slate-500">{user.email}</p>
                    </div>
                    {value === user.id && (
                      <Check className="h-3.5 w-3.5 text-invisapprove-primary shrink-0" />
                    )}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
