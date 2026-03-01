"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { PinInput } from "@/components/atoms/PinInput";
import { PinPad } from "@/components/atoms/PinPad";
import { Avatar } from "@/components/atoms/Avatar";

type Child = {
  id: string;
  displayName: string;
  avatarConfig?: Record<string, unknown> | null;
};

export function ChildLoginClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const childId = useMemo(() => searchParams.get("childId"), [searchParams]);
  const { data: session, update } = useSession();
  const [children, setChildren] = useState<Child[]>([]);
  const [pin, setPin] = useState("");
  const [status, setStatus] = useState<"idle" | "error" | "success" | "locked">("idle");
  const [lockoutUntil, setLockoutUntil] = useState<Date | null>(null);
  const [message, setMessage] = useState<string>("");
  const [now, setNow] = useState(Date.now());

  const child = children.find((entry) => entry.id === childId);

  useEffect(() => {
    if (!session?.user?.id) return;
    fetch("/api/children", { method: "GET" })
      .then(async (res) => {
        if (!res.ok) return;
        const data = (await res.json().catch(() => null)) as { children?: Child[] } | null;
        if (data?.children) setChildren(data.children);
      })
      .catch(() => null);
  }, [session?.user?.id]);

  useEffect(() => {
    if (pin.length < 4 || !childId) return;
    verifyPin();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pin]);

  async function verifyPin() {
    if (!childId) return;
    setStatus("idle");
    const res = await fetch(`/api/children/${childId}/pin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pin }),
    });
    if (res.status === 423) {
      const data = (await res.json().catch(() => null)) as { lockedUntil?: string } | null;
      if (data?.lockedUntil) setLockoutUntil(new Date(data.lockedUntil));
      setStatus("locked");
      setMessage("PIN locked. Try again later.");
      setPin("");
      return;
    }
    if (!res.ok) {
      setStatus("error");
      setMessage("Incorrect PIN. Try again.");
      setPin("");
      return;
    }
    setStatus("success");
    setMessage("Welcome back.");
    await update({ activeChildId: childId });
    router.push("/dashboard");
  }

  function handleDigit(digit: string) {
    if (status === "locked") return;
    if (pin.length >= 4) return;
    setPin((prev) => prev + digit);
  }

  function handleDelete() {
    if (status === "locked") return;
    setPin((prev) => prev.slice(0, -1));
  }

  const remainingLockout =
    lockoutUntil && lockoutUntil.getTime() > now
      ? Math.ceil((lockoutUntil.getTime() - now) / 1000)
      : null;

  useEffect(() => {
    if (!remainingLockout) return;
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, [remainingLockout]);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(0,212,255,0.2),_rgba(10,10,15,1)_70%)] px-6 py-16 text-cq-text-primary">
      <div className="mx-auto flex w-full max-w-md flex-col items-center gap-6 text-center">
        {child ? (
          <div className="flex flex-col items-center gap-3">
            <Avatar
              config={(child.avatarConfig as { variant?: string; label?: string }) ?? undefined}
              fallback={child.displayName}
              size={96}
            />
            <h1 className="text-2xl font-heading text-white">{child.displayName}</h1>
          </div>
        ) : (
          <p className="text-sm text-cq-text-secondary">
            Select a child from the parent dashboard to continue.
          </p>
        )}
        <PinInput
          value={pin}
          status={status === "error" ? "error" : status === "success" ? "success" : "idle"}
        />
        {status === "locked" && remainingLockout ? (
          <p className="text-xs text-cq-red">Locked for {remainingLockout}s</p>
        ) : message ? (
          <p className="text-xs text-cq-text-secondary">{message}</p>
        ) : null}
        <PinPad onDigit={handleDigit} onDelete={handleDelete} />
      </div>
    </main>
  );
}
