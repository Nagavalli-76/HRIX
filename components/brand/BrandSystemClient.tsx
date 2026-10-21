"use client";

import { useState } from "react";
import Image from "next/image";
import { Check, Copy, Download, ExternalLink, Sparkles, CheckCircle2, XCircle } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

interface ColorTokenItem {
  name: string;
  token: string;
  hex: string;
  textColor?: string;
  border?: boolean;
  description: string;
}

export function ColorSwatchCard({ color }: { color: ColorTokenItem }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(color.hex);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <div
      onClick={handleCopy}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleCopy();
        }
      }}
      className="group relative flex flex-col overflow-hidden rounded-md border border-line bg-surface/50 p-3 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-violet/40 hover:bg-surface-raised cursor-pointer"
    >
      <div
        className="h-16 w-full rounded-sm transition-transform duration-200 group-hover:scale-[1.02]"
        style={{
          backgroundColor: color.hex,
          border: color.border ? "1px solid rgba(255,255,255,0.12)" : "none",
        }}
      />
      <div className="mt-3 flex items-start justify-between gap-1">
        <div>
          <div className="font-display text-sm font-semibold text-ink">
            {color.name}
          </div>
          <div className="text-xs font-mono text-muted">{color.hex}</div>
        </div>
        <button
          type="button"
          aria-label={`Copy ${color.hex}`}
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded border border-line bg-surface text-muted transition-colors hover:border-violet hover:text-ink"
        >
          {copied ? (
            <Check className="h-3.5 w-3.5 text-success" />
          ) : (
            <Copy className="h-3.5 w-3.5" />
          )}
        </button>
      </div>
      <p className="mt-2 text-xs text-faint line-clamp-2">
        {color.description}
      </p>
      {copied && (
        <span className="absolute bottom-2 right-2 rounded bg-violet/90 px-1.5 py-0.5 text-[10px] font-medium text-white shadow-sm">
          Copied!
        </span>
      )}
    </div>
  );
}

export function AssetDownloadCard({
  title,
  dimensions,
  fileSize,
  format,
  src,
  fileName,
  description,
  aspectRatio = "366/130",
}: {
  title: string;
  dimensions: string;
  fileSize: string;
  format: string;
  src: string;
  fileName: string;
  description: string;
  aspectRatio?: string;
}) {
  return (
    <GlassCard tone="default" className="flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between border-b border-line/70 pb-3">
          <div>
            <h3 className="font-display text-base font-semibold text-ink">{title}</h3>
            <p className="text-xs text-muted mt-0.5">{description}</p>
          </div>
          <Badge tone="violet">{format}</Badge>
        </div>

        <div className="my-6 flex min-h-[140px] items-center justify-center rounded-md border border-dashed border-line bg-canvas p-6">
          <div className="relative max-w-[240px] w-full" style={{ aspectRatio }}>
            <Image
              src={src}
              alt={title}
              fill
              className="object-contain"
              sizes="240px"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs text-muted mb-4">
          <div className="rounded bg-surface-raised px-2.5 py-1.5 border border-line/50">
            <span className="text-faint block text-[10px] uppercase font-mono">Dimensions</span>
            <span className="font-medium text-ink font-mono">{dimensions}</span>
          </div>
          <div className="rounded bg-surface-raised px-2.5 py-1.5 border border-line/50">
            <span className="text-faint block text-[10px] uppercase font-mono">Format</span>
            <span className="font-medium text-ink font-mono">{format} ({fileSize})</span>
          </div>
        </div>
      </div>

      <a
        href={src}
        download={fileName}
        className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-surface-raised border border-line-strong px-4 py-2.5 text-sm font-medium text-ink transition-colors hover:border-violet/50 hover:bg-surface hover:text-white"
      >
        <Download className="h-4 w-4" />
        Download {format}
      </a>
    </GlassCard>
  );
}
