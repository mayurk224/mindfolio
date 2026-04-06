import React from 'react';
import { Sparkles } from 'lucide-react';

// ── Card Shell ─────────────────────────────────────────────────────────────
const Card = ({ children, className = '' }) => (
  <div
    className={`bg-card border border-border rounded-xl p-6 hover:border-primary/30 transition-colors duration-300 ${className}`}
  >
    {children}
  </div>
);

const CardTitle = ({ children }) => (
  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-5">
    {children}
  </p>
);

// ── Typography Card ─────────────────────────────────────────────────────────
const TypographyCard = () => (
  <Card>
    <CardTitle>Typography</CardTitle>

    {/* Specimen */}
    <p className="text-6xl font-bold text-foreground leading-none mb-1">Aa</p>
    <p className="text-xs text-muted-foreground tracking-wide mb-6">
      Figtree / Nunito Sans · Variable
    </p>

    <div className="space-y-3">
      {/* Simulated scale */}
      <div>
        <p className="text-[10px] text-muted-foreground/60 uppercase tracking-widest mb-0.5">
          Heading
        </p>
        <p className="text-2xl font-bold text-foreground leading-tight">
          Heading 1
        </p>
      </div>

      <div>
        <p className="text-[10px] text-muted-foreground/60 uppercase tracking-widest mb-0.5">
          Body
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          The quick brown fox jumps over the lazy dog.
        </p>
      </div>

      {/* Weight strip */}
      <div className="flex gap-2 pt-2">
        {['300', '400', '600', '700'].map((w) => (
          <span
            key={w}
            style={{ fontWeight: w }}
            className="text-xs text-foreground/70 border border-border rounded px-2 py-0.5"
          >
            {w}
          </span>
        ))}
      </div>
    </div>
  </Card>
);

// ── Palette Card ────────────────────────────────────────────────────────────
const swatches = [
  {
    bg: 'bg-primary',
    border: '',
    label: 'Primary',
    sub: 'Emerald Accent',
    dot: 'oklch(0.432 0.095 166.913)',
  },
  {
    bg: 'bg-background',
    border: 'border border-border',
    label: 'Background',
    sub: 'Midnight Base',
    dot: 'oklch(0.148 0.004 228.8)',
  },
  {
    bg: 'bg-card',
    border: 'border border-border/60',
    label: 'Surface',
    sub: 'Elevated Card',
    dot: 'oklch(0.218 0.008 223.9)',
  },
];

const PaletteCard = () => (
  <Card>
    <CardTitle>Core Palette</CardTitle>

    <div className="space-y-3">
      {swatches.map(({ bg, border, label, sub, dot }) => (
        <div key={label} className="flex items-center gap-4 group">
          {/* Swatch pill */}
          <div
            className={`${bg} ${border} h-11 w-16 rounded-lg shrink-0 transition-transform duration-200 group-hover:scale-105`}
          />
          {/* Labels */}
          <div>
            <p className="text-sm font-semibold text-foreground leading-none mb-0.5">
              {label}
            </p>
            <p className="text-xs text-muted-foreground">{sub}</p>
          </div>
          {/* Dot accent showing exact hue */}
          <div
            className="ml-auto h-3 w-3 rounded-full shrink-0 ring-1 ring-border"
            style={{ backgroundColor: dot }}
          />
        </div>
      ))}
    </div>

    {/* Gradient bar — full spectrum of the brand palette */}
    <div
      className="mt-6 h-2 w-full rounded-full"
      style={{
        background:
          'linear-gradient(to right, oklch(0.148 0.004 228.8), oklch(0.218 0.008 223.9), oklch(0.432 0.095 166.913), oklch(0.696 0.17 162.48))',
      }}
    />
    <p className="text-[10px] text-muted-foreground/50 mt-1.5 text-right tracking-wide">
      Brand gradient range
    </p>
  </Card>
);

// ── Identity Card ───────────────────────────────────────────────────────────
const IdentityCard = () => (
  <Card>
    <CardTitle>Identity</CardTitle>

    {/* Logo display */}
    <div className="bg-background border border-border flex items-center justify-center h-36 w-full rounded-lg mb-5 relative overflow-hidden">
      {/* Subtle radial glow */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, oklch(0.432 0.095 166.913), transparent 70%)',
        }}
      />
      <img
        src="/mindfolio.png"
        alt="Mindfolio logo"
        className="h-16 w-auto object-contain relative z-10 drop-shadow-lg"
        onError={(e) => {
          // Fallback to icon if image fails to load
          e.currentTarget.style.display = 'none';
          e.currentTarget.nextSibling.style.display = 'flex';
        }}
      />
      {/* Fallback icon (hidden by default) */}
      <div className="hidden items-center justify-center relative z-10">
        <Sparkles className="w-12 h-12 text-primary" />
      </div>
    </div>

    <p className="text-xs text-muted-foreground mb-5 text-center">
      Emerald Concept
    </p>

    {/* Token rows */}
    <div className="space-y-2">
      {[
        { label: 'Primary Hue', value: '166.9°' },
        { label: 'Chroma', value: '0.095' },
        { label: 'Lightness', value: '43.2%' },
      ].map(({ label, value }) => (
        <div
          key={label}
          className="flex justify-between items-center py-1.5 border-b border-border/40 last:border-0"
        >
          <span className="text-xs text-muted-foreground">{label}</span>
          <span className="text-xs font-mono font-semibold text-primary">
            {value}
          </span>
        </div>
      ))}
    </div>
  </Card>
);

// ── Section ─────────────────────────────────────────────────────────────────
const DesignSystemSection = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Very subtle background texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 60%, oklch(0.432 0.095 166.913 / 0.06) 0%, transparent 50%), radial-gradient(circle at 80% 30%, oklch(0.218 0.008 223.9 / 0.12) 0%, transparent 50%)',
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10 px-6">
        {/* Header */}
        <div className="mb-12">
          <p className="text-primary font-medium tracking-wide uppercase text-sm mb-2">
            Design Language
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            The Anatomy of Mindfolio
          </h2>
        </div>

        {/* 3 column grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <TypographyCard />
          <PaletteCard />
          <IdentityCard />
        </div>
      </div>
    </section>
  );
};

export default DesignSystemSection;
