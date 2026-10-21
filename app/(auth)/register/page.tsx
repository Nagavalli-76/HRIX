import type { Metadata } from "next";
import { RoleSelector } from "@/features/onboarding/RoleSelector";

export const metadata: Metadata = { title: "Join HRIX" };

interface Props {
  searchParams: Promise<{ role?: string }>;
}

export default async function RegisterPage({ searchParams }: Props) {
  const { role } = await searchParams;
  const initialRole = role === "brand" ? "brand" : role === "creator" ? "creator" : undefined;

  return <RoleSelector initialRole={initialRole} />;
}
