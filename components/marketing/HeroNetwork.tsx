"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { colors } from "@/lib/design/tokens";

/**
 * Hero visual: creators on the left, brands on the right, HRIX in the middle.
 *
 * Deliberately a lightweight SVG, not WebGL. It works as the non-WebGL fallback
 * for the future React Three Fiber scene and costs almost nothing on mobile.
 * The intro draws the connections once; afterwards only small pulses travel
 * along them and the hub rings turn slowly. Pulses are skipped entirely when
 * the visitor prefers reduced motion.
 */

interface NetworkNode {
  x: number;
  y: number;
  label?: string;
}

const HUB = { x: 300, y: 235 };

// Illustrative placeholders, not real HRIX accounts.
const CREATORS: NetworkNode[] = [
  { x: 64, y: 70, label: "Fitness, Kakinada" },
  { x: 132, y: 160 },
  { x: 56, y: 250, label: "Food, Vijayawada" },
  { x: 126, y: 335 },
  { x: 70, y: 412, label: "Tech, Bengaluru" },
];

const BRANDS: NetworkNode[] = [
  { x: 536, y: 85, label: "Fashion label" },
  { x: 470, y: 175 },
  { x: 544, y: 258, label: "Skincare brand" },
  { x: 474, y: 345 },
  { x: 530, y: 415, label: "Travel platform" },
];

function creatorPath(n: NetworkNode) {
  const dx = HUB.x - n.x;
  return `M ${n.x} ${n.y} C ${n.x + dx * 0.55} ${n.y}, ${HUB.x - dx * 0.4} ${HUB.y}, ${HUB.x} ${HUB.y}`;
}

function brandPath(n: NetworkNode) {
  const dx = n.x - HUB.x;
  return `M ${HUB.x} ${HUB.y} C ${HUB.x + dx * 0.4} ${HUB.y}, ${n.x - dx * 0.55} ${n.y}, ${n.x} ${n.y}`;
}

function NodeDot({
  node,
  tint,
  delay,
  animate,
  fallbackLabel,
}: {
  node: NetworkNode;
  tint: string;
  delay: number;
  animate: boolean;
  fallbackLabel: string;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.g
      initial={animate ? { opacity: 0 } : false}
      animate={{ opacity: 1, scale: hovered ? 1.18 : 1 }}
      transition={{ delay, duration: 0.6 }}
      style={{ transformOrigin: `${node.x}px ${node.y}px`, cursor: "pointer" }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
    >
      {hovered ? (
        <circle cx={node.x} cy={node.y} r={16} fill={tint} opacity={0.18} />
      ) : null}
      <circle
        cx={node.x}
        cy={node.y}
        r={9}
        fill={colors.canvasAlt}
        stroke={hovered ? tint : colors.lineStrong}
        strokeWidth={hovered ? 1.75 : 1.25}
      />
      <circle cx={node.x} cy={node.y} r={3} fill={tint} />
      {node.label || hovered ? (
        <text
          x={node.x}
          y={node.y - 18}
          textAnchor="middle"
          fill={hovered ? colors.ink : colors.muted}
          fontSize={12}
          className={node.label ? "max-sm:hidden" : "hidden sm:block"}
        >
          {node.label ?? fallbackLabel}
        </text>
      ) : null}
    </motion.g>
  );
}

/** A small light that travels along one connection, fading in and out at the ends. */
function Pulse({
  pathId,
  color,
  duration,
  begin,
}: {
  pathId: string;
  color: string;
  duration: number;
  begin: number;
}) {
  return (
    <circle r={2.5} fill={color} opacity={0}>
      <animateMotion
        dur={`${duration}s`}
        begin={`${begin}s`}
        repeatCount="indefinite"
      >
        <mpath href={`#${pathId}`} />
      </animateMotion>
      <animate
        attributeName="opacity"
        values="0;1;1;0"
        keyTimes="0;0.12;0.88;1"
        dur={`${duration}s`}
        begin={`${begin}s`}
        repeatCount="indefinite"
      />
    </circle>
  );
}

export function HeroNetwork() {
  const reduceMotion = useReducedMotion();
  const animate = !reduceMotion;

  return (
    <figure className="relative mx-auto w-full max-w-[640px]">
      <svg
        viewBox="0 0 600 470"
        role="img"
        aria-labelledby="hero-network-title hero-network-desc"
        className="h-auto w-full overflow-visible"
      >
        <title id="hero-network-title">
          Creators and brands connected through HRIX
        </title>
        <desc id="hero-network-desc">
          Illustration of five creators on the left and five brands on the
          right, all connected to the HRIX hub in the middle.
        </desc>

        <defs>
          <linearGradient
            id="hrix-net-left"
            gradientUnits="userSpaceOnUse"
            x1="56"
            y1="0"
            x2={HUB.x}
            y2="0"
          >
            <stop offset="0" stopColor={colors.violet} stopOpacity="0.15" />
            <stop offset="1" stopColor={colors.violet} stopOpacity="0.85" />
          </linearGradient>
          <linearGradient
            id="hrix-net-right"
            gradientUnits="userSpaceOnUse"
            x1={HUB.x}
            y1="0"
            x2="544"
            y2="0"
          >
            <stop offset="0" stopColor={colors.blue} stopOpacity="0.85" />
            <stop offset="1" stopColor={colors.blue} stopOpacity="0.15" />
          </linearGradient>
          <linearGradient id="hrix-net-ring" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={colors.violet} />
            <stop offset="1" stopColor={colors.blue} />
          </linearGradient>
          <radialGradient id="hrix-net-glow">
            <stop offset="0" stopColor={colors.violet} stopOpacity="0.32" />
            <stop offset="0.55" stopColor={colors.blue} stopOpacity="0.1" />
            <stop offset="1" stopColor={colors.blue} stopOpacity="0" />
          </radialGradient>

          {CREATORS.map((n, i) => (
            <path key={`cp-${i}`} id={`hrix-c-${i}`} d={creatorPath(n)} />
          ))}
          {BRANDS.map((n, i) => (
            <path key={`bp-${i}`} id={`hrix-b-${i}`} d={brandPath(n)} />
          ))}
        </defs>

        {/* Ambient light behind the hub */}
        <circle cx={HUB.x} cy={HUB.y} r={190} fill="url(#hrix-net-glow)" />

        {/* Connections */}
        <g fill="none" strokeWidth={1.25} strokeLinecap="round">
          {CREATORS.map((n, i) => (
            <motion.path
              key={`c-${i}`}
              d={creatorPath(n)}
              stroke="url(#hrix-net-left)"
              initial={animate ? { pathLength: 0, opacity: 0 } : false}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ delay: 0.2 + i * 0.09, duration: 1.3, ease: "easeOut" }}
            />
          ))}
          {BRANDS.map((n, i) => (
            <motion.path
              key={`b-${i}`}
              d={brandPath(n)}
              stroke="url(#hrix-net-right)"
              initial={animate ? { pathLength: 0, opacity: 0 } : false}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ delay: 0.75 + i * 0.09, duration: 1.3, ease: "easeOut" }}
            />
          ))}
        </g>

        {/* Pulses travelling along the connections */}
        {animate ? (
          <g>
            {CREATORS.map((_, i) => (
              <Pulse
                key={`pc-${i}`}
                pathId={`hrix-c-${i}`}
                color={colors.violetSoft}
                duration={4.6 + (i % 3) * 0.7}
                begin={2.2 + i * 0.9}
              />
            ))}
            {BRANDS.map((_, i) => (
              <Pulse
                key={`pb-${i}`}
                pathId={`hrix-b-${i}`}
                color={colors.blueSoft}
                duration={4.6 + ((i + 1) % 3) * 0.7}
                begin={2.8 + i * 0.9}
              />
            ))}
          </g>
        ) : null}

        {/* Hub rings */}
        <g
          className="animate-hub-spin"
          style={{ transformOrigin: `${HUB.x}px ${HUB.y}px` }}
        >
          <circle
            cx={HUB.x}
            cy={HUB.y}
            r={86}
            fill="none"
            stroke={colors.lineStrong}
            strokeWidth={1}
            strokeDasharray="2 9"
            strokeLinecap="round"
          />
        </g>
        <g
          className="animate-hub-spin-reverse"
          style={{ transformOrigin: `${HUB.x}px ${HUB.y}px` }}
        >
          <circle
            cx={HUB.x}
            cy={HUB.y}
            r={118}
            fill="none"
            stroke={colors.line}
            strokeWidth={1}
            strokeDasharray="1 14"
            strokeLinecap="round"
          />
        </g>

        {/* Hub: the H from the HRIX logo, cropped from the supplied artwork */}
        <circle
          cx={HUB.x}
          cy={HUB.y}
          r={58}
          fill={colors.canvasAlt}
          stroke="url(#hrix-net-ring)"
          strokeWidth={1.5}
        />
        <image
          href="/brand/hrix-mark.png"
          x={HUB.x - 26}
          y={HUB.y - 31.5}
          width={52}
          height={63}
          preserveAspectRatio="xMidYMid meet"
        />

        {/* Nodes */}
        {CREATORS.map((n, i) => (
          <NodeDot
            key={`nc-${i}`}
            node={n}
            tint={colors.violetSoft}
            delay={0.1 + i * 0.09}
            animate={animate}
            fallbackLabel="Creator"
          />
        ))}
        {BRANDS.map((n, i) => (
          <NodeDot
            key={`nb-${i}`}
            node={n}
            tint={colors.blueSoft}
            delay={0.65 + i * 0.09}
            animate={animate}
            fallbackLabel="Brand"
          />
        ))}
      </svg>

      <figcaption className="mt-2 grid grid-cols-3 items-start gap-3 text-sm">
        <span className="text-left text-muted">Creators</span>
        <span className="text-center text-faint">Connected through HRIX</span>
        <span className="text-right text-muted">Brands</span>
      </figcaption>
    </figure>
  );
}
