"use client";

import { useFormContext } from "react-hook-form";
import { GripVertical, Plus, Trash2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CreateMasjidFormValues } from "../schema";

export function OrganizationContactsSection() {
  const { watch, setValue } = useFormContext<CreateMasjidFormValues>();
  const contacts = watch("organizationContacts");

  function addContact() {
    setValue("organizationContacts", [
      ...contacts,
      { role: "", description: "", parentIndex: null },
    ]);
  }

  function removeContact(index: number) {
    const next = contacts
      .filter((_, i) => i !== index)
      // Drop the parent link on any row that pointed at the removed one, and shift indices down
      .map((c) => ({
        ...c,
        parentIndex:
          c.parentIndex === null
            ? null
            : c.parentIndex === index
              ? null
              : c.parentIndex > index
                ? c.parentIndex - 1
                : c.parentIndex,
      }));
    setValue("organizationContacts", next);
  }

  function updateContact(index: number, patch: Partial<(typeof contacts)[number]>) {
    setValue(
      "organizationContacts",
      contacts.map((c, i) => (i === index ? { ...c, ...patch } : c))
    );
  }

  return (
    <Card id="section-organization-contacts">
      <CardHeader>
        <CardTitle>Organization contacts</CardTitle>
        <CardDescription>Roles and reporting structure for this masjid.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {contacts.map((contact, index) => (
            <div
              key={index}
              className="flex flex-col gap-3 rounded-md border border-border bg-background p-3.5 sm:flex-row sm:items-center"
            >
              <GripVertical className="hidden h-4 w-4 shrink-0 text-muted-foreground sm:block" />
              <div className="grid flex-1 gap-2 sm:grid-cols-2">
                <div className="space-y-1">
                  <Label className="text-xs">Role</Label>
                  <Input
                    placeholder="e.g. Management"
                    value={contact.role}
                    onChange={(e) => updateContact(index, { role: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Description</Label>
                  <Input
                    placeholder="e.g. Masjid leadership"
                    value={contact.description ?? ""}
                    onChange={(e) => updateContact(index, { description: e.target.value })}
                  />
                </div>
              </div>
              <div className="w-full space-y-1 sm:w-[230px]">
                <Label className="text-[11px] text-muted-foreground">Parent organization contact</Label>
                <Select
                  value={contact.parentIndex === null ? "none" : String(contact.parentIndex)}
                  onValueChange={(v) => updateContact(index, { parentIndex: v === "none" ? null : Number(v) })}
                >
                  <SelectTrigger className="h-9 w-full text-xs">
                    <SelectValue placeholder="No parent" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No parent</SelectItem>
                    {contacts.map((c, i) =>
                      i === index || !c.role ? null : (
                        <SelectItem key={i} value={String(i)}>
                          {c.role}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              </div>
              <button type="button" onClick={() => removeContact(index)} className="self-end sm:self-center">
                <Trash2 className="h-4 w-4 text-destructive" />
              </button>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">The hierarchy will be generated from the parent selections.</p>
          <Button type="button" size="sm" onClick={addContact} className="gap-1.5">
            <Plus className="h-3.5 w-3.5" /> Add contact
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
