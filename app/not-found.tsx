import { HrixLogo } from "@/components/brand/HrixLogo";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <main
      id="main"
      className="flex min-h-screen flex-col items-center justify-center gap-8 px-6 text-center"
    >
      <HrixLogo variant="auth" href="/" priority />
      <div>
        <h1 className="text-headline">This page isn&apos;t on HRIX yet</h1>
        <p className="mx-auto mt-4 max-w-md text-muted">
          The link may be old, or the page is still being built. Head back to
          the home page to keep exploring.
        </p>
      </div>
      <Button href="/">Back to home</Button>
    </main>
  );
}
