"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Mail, Phone, AlertTriangle } from "lucide-react";
import { setLeadStatus, setLeadNote } from "@/lib/admin/actions";
import { Badge } from "@/components/admin/ui/badge";
import { Button } from "@/components/admin/ui/button";
import { Textarea } from "@/components/admin/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/admin/ui/dialog";
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

type Lead = {
  id: number;
  createdAt: Date | string;
  name: string;
  company: string | null;
  phone: string;
  email: string | null;
  service: string | null;
  message: string | null;
  sourcePath: string | null;
  status: string;
  emailedAt: Date | string | null;
  note: string | null;
};

const STATUSES = ["new", "contacted", "qualified", "closed", "spam"] as const;

const TONE: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
  new: "default",
  contacted: "secondary",
  qualified: "secondary",
  closed: "outline",
  spam: "destructive",
};

function when(value: Date | string) {
  return new Date(value).toLocaleString(undefined, {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function LeadsTable({ leads }: { leads: Lead[] }) {
  const [open, setOpen] = useState<Lead | null>(null);
  const [pending, start] = useTransition();
  const router = useRouter();

  function changeStatus(id: number, status: string) {
    start(async () => {
      const res = await setLeadStatus(String(id), status);
      if (res.error) toast.error(res.error);
      else {
        toast.success("Marked " + status + ".");
        router.refresh();
      }
    });
  }

  return (
    <>
      <div className="overflow-x-auto rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[150px]">Received</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="hidden md:table-cell">Contact</TableHead>
              <TableHead className="hidden lg:table-cell">Service</TableHead>
              <TableHead className="w-[150px]">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leads.map((lead) => (
              <TableRow key={lead.id} className="cursor-pointer" onClick={() => setOpen(lead)}>
                <TableCell className="whitespace-nowrap text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    {!lead.emailedAt && (
                      <AlertTriangle
                        className="size-3.5 text-destructive"
                        aria-label="Never emailed"
                      />
                    )}
                    {when(lead.createdAt)}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="font-medium">{lead.name}</span>
                  {lead.company && (
                    <span className="block text-xs text-muted-foreground">{lead.company}</span>
                  )}
                </TableCell>
                <TableCell className="hidden text-muted-foreground md:table-cell">
                  <span className="block text-xs">{lead.phone}</span>
                  {lead.email && <span className="block text-xs">{lead.email}</span>}
                </TableCell>
                <TableCell className="hidden text-muted-foreground lg:table-cell">
                  {lead.service || "—"}
                </TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <Select
                    defaultValue={lead.status}
                    onValueChange={(v) => changeStatus(lead.id, v)}
                    disabled={pending}
                  >
                    <SelectTrigger size="sm" className="w-[130px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUSES.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <LeadDialog lead={open} onClose={() => setOpen(null)} />
    </>
  );
}

function LeadDialog({ lead, onClose }: { lead: Lead | null; onClose: () => void }) {
  const [note, setNote] = useState("");
  const [pending, start] = useTransition();

  return (
    <Dialog
      open={Boolean(lead)}
      onOpenChange={(isOpen) => {
        if (!isOpen) onClose();
        else setNote(lead?.note ?? "");
      }}
    >
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        {lead && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {lead.name}
                <Badge variant={TONE[lead.status] ?? "outline"}>{lead.status}</Badge>
              </DialogTitle>
              <DialogDescription>
                {when(lead.createdAt)}
                {lead.sourcePath ? " · from " + lead.sourcePath : ""}
              </DialogDescription>
            </DialogHeader>

            <dl className="space-y-3 text-sm">
              {lead.company && (
                <div>
                  <dt className="text-xs text-muted-foreground">Company</dt>
                  <dd>{lead.company}</dd>
                </div>
              )}
              <div>
                <dt className="text-xs text-muted-foreground">Phone</dt>
                <dd>
                  <a
                    href={"tel:" + lead.phone}
                    className="inline-flex items-center gap-1.5 underline"
                  >
                    <Phone className="size-3.5" aria-hidden />
                    {lead.phone}
                  </a>
                </dd>
              </div>
              {lead.email && (
                <div>
                  <dt className="text-xs text-muted-foreground">Email</dt>
                  <dd>
                    <a
                      href={"mailto:" + lead.email}
                      className="inline-flex items-center gap-1.5 underline"
                    >
                      <Mail className="size-3.5" aria-hidden />
                      {lead.email}
                    </a>
                  </dd>
                </div>
              )}
              {lead.service && (
                <div>
                  <dt className="text-xs text-muted-foreground">Service</dt>
                  <dd>{lead.service}</dd>
                </div>
              )}
              {lead.message && (
                <div>
                  <dt className="text-xs text-muted-foreground">Message</dt>
                  <dd className="whitespace-pre-wrap">{lead.message}</dd>
                </div>
              )}
              {!lead.emailedAt && (
                <p className="rounded-md border border-destructive/30 bg-destructive/5 p-2.5 text-xs text-destructive">
                  This lead was saved but the notification email never sent.
                </p>
              )}
            </dl>

            <div className="space-y-2">
              <label htmlFor="note" className="text-xs text-muted-foreground">
                Working note
              </label>
              <Textarea
                id="note"
                rows={3}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Called, asked for a proposal…"
              />
              <Button
                size="sm"
                disabled={pending}
                onClick={() =>
                  start(async () => {
                    const res = await setLeadNote(String(lead.id), note);
                    if (res.error) toast.error(res.error);
                    else toast.success("Note saved.");
                  })
                }
              >
                {pending ? "Saving…" : "Save note"}
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
