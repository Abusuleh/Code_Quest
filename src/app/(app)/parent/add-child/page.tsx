"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { Avatar } from "@/components/atoms/Avatar";

const avatarOptions = [
  { id: "atlas", label: "AT" },
  { id: "nova", label: "NV" },
  { id: "ember", label: "EM" },
  { id: "pulse", label: "PU" },
  { id: "zen", label: "ZE" },
  { id: "wave", label: "WA" },
  { id: "flare", label: "FL" },
  { id: "echo", label: "EC" },
];

export default function AddChildPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState<string>("");
  const [selectedAvatar, setSelectedAvatar] = useState(avatarOptions[0].id);
  const [childCount, setChildCount] = useState<number>(0);

  useEffect(() => {
    fetch("/api/children")
      .then(async (res) => {
        if (!res.ok) return;
        const data = (await res.json().catch(() => null)) as { children?: unknown[] } | null;
        if (data?.children) setChildCount(data.children.length);
      })
      .catch(() => null);
  }, []);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    const formData = new FormData(event.currentTarget);
    const pin = formData.get("pin")?.toString() ?? "";
    const pinConfirm = formData.get("pinConfirm")?.toString() ?? "";
    if (pin !== pinConfirm) {
      setStatus("error");
      setMessage("PIN confirmation does not match.");
      return;
    }

    const payload = {
      username: formData.get("username")?.toString().trim(),
      displayName: formData.get("displayName")?.toString().trim(),
      dateOfBirth: formData.get("dateOfBirth")?.toString(),
      avatarConfig: {
        variant: selectedAvatar,
        label: formData.get("displayName")?.toString()?.slice(0, 2),
      },
      pin,
    };

    try {
      const res = await fetch("/api/children", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        setStatus("error");
        setMessage(data?.error ?? "Unable to create child.");
        return;
      }
      setStatus("done");
      setMessage("Child profile created.");
      event.currentTarget.reset();
    } catch {
      setStatus("error");
      setMessage("Unable to create child.");
    }
  }

  const maxReached = childCount >= 5;

  return (
    <main className="min-h-screen px-6 py-12 text-cq-text-primary">
      <div className="mx-auto w-full max-w-3xl space-y-8">
        <header className="space-y-2">
          <p className="text-xs uppercase tracking-[0.4em] text-cq-text-secondary">Parent</p>
          <h1 className="text-3xl font-heading text-white">Add child profile</h1>
          <p className="text-sm text-cq-text-secondary">
            Create a child profile for safe, age-aware access.
          </p>
        </header>
        <form
          className="space-y-4 rounded-3xl border border-cq-border bg-cq-bg-elevated p-6"
          onSubmit={onSubmit}
        >
          <Input name="displayName" placeholder="Child display name" required />
          <Input name="username" placeholder="Unique username" required />
          <Input name="dateOfBirth" type="date" required />
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.3em] text-cq-text-secondary">Avatar</p>
            <div className="flex flex-wrap gap-3">
              {avatarOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  className={`rounded-full border p-1 ${
                    selectedAvatar === option.id ? "border-cq-cyan" : "border-cq-border"
                  }`}
                  onClick={() => setSelectedAvatar(option.id)}
                >
                  <Avatar
                    config={{ variant: option.id, label: option.label }}
                    fallback={option.label}
                    size={48}
                  />
                </button>
              ))}
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              name="pin"
              placeholder="4-digit PIN"
              maxLength={4}
              inputMode="numeric"
              pattern="\d{4}"
              type="password"
              required
            />
            <Input
              name="pinConfirm"
              placeholder="Confirm PIN"
              maxLength={4}
              inputMode="numeric"
              pattern="\d{4}"
              type="password"
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={status === "loading" || maxReached}>
            {maxReached
              ? "Max children reached"
              : status === "loading"
                ? "Creating..."
                : "Create child"}
          </Button>
          {maxReached ? (
            <p className="text-xs text-cq-text-secondary">
              Maximum of 5 children per parent account.
            </p>
          ) : null}
        </form>
        {message ? (
          <p
            className={`rounded-2xl border px-4 py-3 text-sm ${
              status === "error" ? "border-cq-red/50 text-cq-red" : "border-cq-cyan/40 text-cq-cyan"
            }`}
          >
            {message}
          </p>
        ) : null}
        <Link href="/parent/dashboard" className="text-sm text-cq-cyan">
          Back to dashboard
        </Link>
      </div>
    </main>
  );
}
