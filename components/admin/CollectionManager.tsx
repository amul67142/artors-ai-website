"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Pencil, Plus, Trash2, Upload, X } from "lucide-react";
import type { CollectionSpec, Field } from "@/lib/admin/collections";
import { saveItem, deleteItem, setPublished } from "@/lib/admin/actions";
import { cn } from "@/lib/admin/cn";
import { Button } from "@/components/admin/ui/button";
import { Input } from "@/components/admin/ui/input";
import { Label } from "@/components/admin/ui/label";
import { Textarea } from "@/components/admin/ui/textarea";
import { Switch } from "@/components/admin/ui/switch";
import { Badge } from "@/components/admin/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/admin/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/admin/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/admin/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/admin/ui/table";

/**
 * One editor for every content type — driven entirely by the spec in
 * lib/admin/collections.ts. Adding a field to a spec adds it to the form and
 * the validation at once, with no component changes.
 */

type Row = Record<string, unknown>;
type Metric = { label: string; value: string };
type Faq = { q: string; a: string };

export default function CollectionManager({
  spec,
  rows,
}: {
  spec: CollectionSpec;
  rows: Row[];
}) {
  const [editing, setEditing] = useState<Row | null>(null);
  const [creating, setCreating] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<Row | null>(null);
  const [pending, start] = useTransition();
  // revalidatePath() drops the server cache, but the already-rendered route
  // still has to be told to re-fetch — without this the table shows stale rows
  // until a manual reload.
  const router = useRouter();

  const open = creating || editing !== null;

  function close() {
    setCreating(false);
    setEditing(null);
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-2xl">
          <h1 className="text-2xl font-semibold tracking-tight">{spec.title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{spec.blurb}</p>
        </div>
        <Button onClick={() => setCreating(true)}>
          <Plus className="size-4" aria-hidden />
          Add {spec.singular.toLowerCase()}
        </Button>
      </header>

      {rows.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border py-16 text-center">
          <p className="text-sm text-muted-foreground">
            Nothing here yet. The section stays hidden on the site until something is published.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                {spec.columns.map((c) => (
                  <TableHead key={c}>{labelFor(spec, c)}</TableHead>
                ))}
                <TableHead className="w-[120px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={String(row.id)}>
                  {spec.columns.map((c) => (
                    <TableCell key={c}>
                      <Cell spec={spec} row={row} name={c} pending={pending} start={start} />
                    </TableCell>
                  ))}
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Edit"
                        onClick={() => setEditing(row)}
                      >
                        <Pencil className="size-4" aria-hidden />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Delete"
                        onClick={() => setConfirmDelete(row)}
                      >
                        <Trash2 className="size-4 text-destructive" aria-hidden />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={open} onOpenChange={(o) => !o && close()}>
        <DialogContent className="max-h-[88vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editing ? "Edit " : "New "}
              {spec.singular.toLowerCase()}
            </DialogTitle>
            <DialogDescription>{spec.blurb}</DialogDescription>
          </DialogHeader>
          {open && (
            <ItemForm
              spec={spec}
              row={editing}
              onDone={() => {
                close();
                toast.success("Saved.");
                router.refresh();
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={confirmDelete !== null}
        onOpenChange={(o) => !o && setConfirmDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this {spec.singular.toLowerCase()}?</AlertDialogTitle>
            <AlertDialogDescription>
              This cannot be undone. Any uploaded image is deleted with it.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                const row = confirmDelete;
                if (!row) return;
                start(async () => {
                  const res = await deleteItem(spec.key, String(row.id));
                  if (res.error) toast.error(res.error);
                  else {
                    toast.success("Deleted.");
                    router.refresh();
                  }
                });
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function labelFor(spec: CollectionSpec, name: string): string {
  return spec.fields.find((f) => f.name === name)?.label ?? name;
}

function Cell({
  spec,
  row,
  name,
  pending,
  start,
}: {
  spec: CollectionSpec;
  row: Row;
  name: string;
  pending: boolean;
  start: (fn: () => void) => void;
}) {
  const router = useRouter();
  const field = spec.fields.find((f) => f.name === name);
  const value = row[name];

  if (name === "published") {
    return (
      <Switch
        checked={Boolean(value)}
        disabled={pending}
        aria-label="Published"
        onCheckedChange={(next) =>
          start(async () => {
            const res = await setPublished(spec.key, String(row.id), next);
            if (res.error) toast.error(res.error);
            else {
              toast.success(next ? "Published." : "Unpublished.");
              router.refresh();
            }
          })
        }
      />
    );
  }

  if (field?.type === "bool") {
    return value ? <Badge variant="secondary">Yes</Badge> : <span className="text-muted-foreground">—</span>;
  }

  if (name === "kind") {
    return (
      <Badge variant={value === "client" ? "default" : "outline"}>
        {value === "client" ? "Client" : "Integration"}
      </Badge>
    );
  }

  return <span>{value ? String(value) : <span className="text-muted-foreground">—</span>}</span>;
}

function ItemForm({
  spec,
  row,
  onDone,
}: {
  spec: CollectionSpec;
  row: Row | null;
  onDone: () => void;
}) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pending, start] = useTransition();

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    start(async () => {
      const res = await saveItem(spec.key, row ? String(row.id) : null, formData);
      if (res.ok) {
        setErrors({});
        onDone();
      } else {
        setErrors(res.fieldErrors ?? {});
        toast.error(res.error ?? "Could not save.");
      }
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {spec.fields.map((field) => (
        <FieldInput
          key={field.name}
          field={field}
          defaultValue={row?.[field.name]}
          error={errors[field.name]}
        />
      ))}
      <DialogFooter>
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : "Save"}
        </Button>
      </DialogFooter>
    </form>
  );
}

function FieldInput({
  field,
  defaultValue,
  error,
}: {
  field: Field;
  defaultValue: unknown;
  error?: string;
}) {
  const id = "f-" + field.name;
  const describedBy = field.help || error ? id + "-help" : undefined;

  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between gap-3">
        <Label htmlFor={id}>
          {field.label}
          {field.required && <span className="ml-0.5 text-destructive">*</span>}
        </Label>
      </div>

      <Control field={field} id={id} defaultValue={defaultValue} describedBy={describedBy} />

      {(field.help || error) && (
        <p
          id={describedBy}
          className={cn("text-xs", error ? "text-destructive" : "text-muted-foreground")}
        >
          {error ?? field.help}
        </p>
      )}
    </div>
  );
}

function Control({
  field,
  id,
  defaultValue,
  describedBy,
}: {
  field: Field;
  id: string;
  defaultValue: unknown;
  describedBy?: string;
}) {
  const str = defaultValue == null ? "" : String(defaultValue);

  switch (field.type) {
    case "textarea":
      return (
        <Textarea
          id={id}
          name={field.name}
          rows={4}
          defaultValue={str}
          placeholder={field.placeholder}
          aria-describedby={describedBy}
        />
      );

    case "bool":
      return <BoolControl id={id} name={field.name} defaultChecked={Boolean(defaultValue)} />;

    case "number":
      return (
        <Input
          id={id}
          name={field.name}
          type="number"
          defaultValue={str === "" ? "0" : str}
          aria-describedby={describedBy}
        />
      );

    case "select":
      return (
        <SelectControl
          id={id}
          name={field.name}
          defaultValue={str || field.options?.[0]?.value || ""}
          options={field.options ?? []}
        />
      );

    case "markdown":
      return (
        <Textarea
          id={id}
          name={field.name}
          rows={18}
          defaultValue={str}
          placeholder={field.placeholder}
          aria-describedby={describedBy}
          className="font-mono text-[13px] leading-relaxed"
        />
      );

    case "faq":
      return <FaqControl name={field.name} defaultValue={defaultValue} />;

    case "image":
      return <ImageControl name={field.name} defaultValue={str} />;

    case "metrics":
      return <MetricsControl name={field.name} defaultValue={defaultValue} />;

    default:
      return (
        <Input
          id={id}
          name={field.name}
          type={field.type === "email" ? "email" : field.type === "url" ? "url" : "text"}
          defaultValue={str}
          placeholder={field.placeholder}
          aria-describedby={describedBy}
        />
      );
  }
}

/** Switch does not submit with the form, so a hidden input carries the value. */
function BoolControl({
  id,
  name,
  defaultChecked,
}: {
  id: string;
  name: string;
  defaultChecked: boolean;
}) {
  const [on, setOn] = useState(defaultChecked);
  return (
    <>
      <Switch id={id} checked={on} onCheckedChange={setOn} />
      <input type="hidden" name={name} value={on ? "true" : "false"} />
    </>
  );
}

function SelectControl({
  id,
  name,
  defaultValue,
  options,
}: {
  id: string;
  name: string;
  defaultValue: string;
  options: { value: string; label: string }[];
}) {
  const [value, setValue] = useState(defaultValue);
  return (
    <>
      <Select value={value} onValueChange={setValue}>
        <SelectTrigger id={id} className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((o) => (
            <SelectItem key={o.value} value={o.value}>
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <input type="hidden" name={name} value={value} />
    </>
  );
}

function ImageControl({ name, defaultValue }: { name: string; defaultValue: string }) {
  const [url, setUrl] = useState(defaultValue);
  const [busy, setBusy] = useState(false);

  async function upload(file: File) {
    setBusy(true);
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/admin/media", { method: "POST", body });
      const json = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !json.url) throw new Error(json.error || "Upload failed");
      setUrl(json.url);
      toast.success("Uploaded.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-2">
      <input type="hidden" name={name} value={url} />
      <div className="flex items-center gap-3">
        {url ? (
          <span className="relative inline-flex size-16 items-center justify-center overflow-hidden rounded-md border border-border bg-muted">
            <Image src={url} alt="" fill sizes="64px" className="object-contain" unoptimized />
          </span>
        ) : (
          <span className="inline-flex size-16 items-center justify-center rounded-md border border-dashed border-border text-muted-foreground">
            <Upload className="size-4" aria-hidden />
          </span>
        )}

        <div className="flex flex-wrap items-center gap-2">
          <Button type="button" variant="outline" size="sm" disabled={busy} asChild>
            <label className="cursor-pointer">
              {busy ? "Uploading…" : url ? "Replace" : "Upload"}
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp,image/svg+xml,image/avif"
                className="sr-only"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) void upload(file);
                  e.target.value = "";
                }}
              />
            </label>
          </Button>
          {url && (
            <Button type="button" variant="ghost" size="sm" onClick={() => setUrl("")}>
              <X className="size-3.5" aria-hidden />
              Remove
            </Button>
          )}
        </div>
      </div>
      <p className="text-xs text-muted-foreground">PNG, JPEG, WebP, SVG or AVIF. Max 4 MB.</p>
    </div>
  );
}

/** Repeatable question/answer pairs. Emits FAQPage schema on the public page. */
function FaqControl({ name, defaultValue }: { name: string; defaultValue: unknown }) {
  const initial: Faq[] = Array.isArray(defaultValue) ? (defaultValue as Faq[]) : [];
  const [items, setItems] = useState<Faq[]>(initial);

  function update(i: number, patch: Partial<Faq>) {
    setItems((prev) => prev.map((f, idx) => (idx === i ? { ...f, ...patch } : f)));
  }

  return (
    <div className="space-y-3">
      <input type="hidden" name={name} value={JSON.stringify(items.filter((f) => f.q))} />
      {items.map((item, i) => (
        <div key={i} className="space-y-2 rounded-md border border-border p-3">
          <div className="flex gap-2">
            <Input
              value={item.q}
              placeholder="Question"
              onChange={(e) => update(i, { q: e.target.value })}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Remove question"
              onClick={() => setItems((prev) => prev.filter((_, idx) => idx !== i))}
            >
              <X className="size-4" aria-hidden />
            </Button>
          </div>
          <Textarea
            rows={3}
            value={item.a}
            placeholder="Answer — a complete one. This is what gets quoted."
            onChange={(e) => update(i, { a: e.target.value })}
          />
        </div>
      ))}
      {items.length < 12 && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setItems((prev) => [...prev, { q: "", a: "" }])}
        >
          <Plus className="size-3.5" aria-hidden />
          Add question
        </Button>
      )}
    </div>
  );
}

function MetricsControl({ name, defaultValue }: { name: string; defaultValue: unknown }) {
  const initial: Metric[] = Array.isArray(defaultValue) ? (defaultValue as Metric[]) : [];
  const [items, setItems] = useState<Metric[]>(initial);

  function update(i: number, patch: Partial<Metric>) {
    setItems((prev) => prev.map((m, idx) => (idx === i ? { ...m, ...patch } : m)));
  }

  return (
    <div className="space-y-2">
      <input type="hidden" name={name} value={JSON.stringify(items.filter((m) => m.label))} />
      {items.map((metric, i) => (
        <div key={i} className="flex gap-2">
          <Input
            value={metric.label}
            placeholder="Response time"
            onChange={(e) => update(i, { label: e.target.value })}
          />
          <Input
            value={metric.value}
            placeholder="under 60s"
            onChange={(e) => update(i, { value: e.target.value })}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Remove metric"
            onClick={() => setItems((prev) => prev.filter((_, idx) => idx !== i))}
          >
            <X className="size-4" aria-hidden />
          </Button>
        </div>
      ))}
      {items.length < 6 && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setItems((prev) => [...prev, { label: "", value: "" }])}
        >
          <Plus className="size-3.5" aria-hidden />
          Add metric
        </Button>
      )}
    </div>
  );
}
