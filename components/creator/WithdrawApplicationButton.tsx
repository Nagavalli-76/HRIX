"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { withdrawApplication } from "@/lib/actions/applications";
import { Button } from "@/components/ui/Button";

export function WithdrawApplicationButton({ applicationId }: { applicationId: string }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  return (
    <Button variant="ghost" size="sm" loading={isPending} onClick={() => startTransition(async () => { await withdrawApplication(applicationId); router.refresh(); })}>
      Withdraw
    </Button>
  );
}
