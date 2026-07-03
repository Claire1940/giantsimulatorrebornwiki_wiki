"use client";

import { useState, Suspense, lazy } from "react";
import {
  ArrowRight,
  BookOpen,
  Check,
  ChevronDown,
  Coins,
  Copy,
  Gift,
  PawPrint,
  Sparkles,
  Target,
  TrendingUp,
  Trophy,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useMessages } from "next-intl";
import { VideoFeature } from "@/components/home/VideoFeature";
import { LatestGuidesAccordion } from "@/components/home/LatestGuidesAccordion";
import { NativeBannerAd, AdBanner } from "@/components/ads";
import { getPreferredMobileBannerSelection } from "@/components/ads/mobileAdConfigs";
import { scrollToSection } from "@/lib/scrollToSection";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import type { ContentItemWithType } from "@/lib/getLatestArticles";
import type { ModuleLinkMap } from "@/lib/buildModuleLinkMap";

// Lazy load heavy components
const HeroStats = lazy(() => import("@/components/home/HeroStats"));
const CTASection = lazy(() => import("@/components/home/CTASection"));

// Loading placeholder
const LoadingPlaceholder = ({ height = "h-64" }: { height?: string }) => (
  <div
    className={`${height} bg-white/5 border border-border rounded-xl animate-pulse`}
  />
);

// Render module titles as plain text (internal module URLs were removed).
// Kept as a component so structure stays stable for future link wiring.
function ModuleTitle({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

// Tools Grid cards map 1:1 to module section ids (zero dead anchors).
const TOOL_CARD_SECTION_IDS = [
  "codes",
  "beginner-guide",
  "leveling-gold-farming",
  "pets-guide",
] as const;

// Priority badge styles for the leveling/gold-farming module.
const PRIORITY_STYLES: Record<string, string> = {
  Highest:
    "bg-[hsl(var(--nav-theme)/0.15)] border-[hsl(var(--nav-theme)/0.4)] text-[hsl(var(--nav-theme-light))]",
  "Core Loop":
    "bg-[hsl(var(--nav-theme)/0.1)] border-[hsl(var(--nav-theme)/0.3)] text-[hsl(var(--nav-theme-light))]",
  "Early Upgrade": "bg-emerald-500/10 border-emerald-500/30 text-emerald-300",
  "Gold Sink": "bg-amber-500/10 border-amber-500/30 text-amber-300",
  Scaling: "bg-violet-500/10 border-violet-500/30 text-violet-300",
  Checkpoint: "bg-cyan-500/10 border-cyan-500/30 text-cyan-300",
  "Event Route":
    "bg-[hsl(var(--nav-theme)/0.1)] border-[hsl(var(--nav-theme)/0.3)] text-[hsl(var(--nav-theme-light))]",
  "Rule-Safe": "bg-slate-500/10 border-slate-500/30 text-slate-300",
};

// Category badge styles for the pets module.
const CATEGORY_STYLES: Record<string, string> = {
  Start: "bg-emerald-500/10 border-emerald-500/30 text-emerald-300",
  Progress:
    "bg-[hsl(var(--nav-theme)/0.15)] border-[hsl(var(--nav-theme)/0.4)] text-[hsl(var(--nav-theme-light))]",
  Upgrade: "bg-violet-500/10 border-violet-500/30 text-violet-300",
  Resource: "bg-amber-500/10 border-amber-500/30 text-amber-300",
  Event: "bg-cyan-500/10 border-cyan-500/30 text-cyan-300",
  Build:
    "bg-[hsl(var(--nav-theme)/0.1)] border-[hsl(var(--nav-theme)/0.3)] text-[hsl(var(--nav-theme-light))]",
  Rebirth: "bg-rose-500/10 border-rose-500/30 text-rose-300",
};

interface HomePageClientProps {
  latestArticles: ContentItemWithType[];
  moduleLinkMap: ModuleLinkMap;
  locale: string;
}

export default function HomePageClient({
  latestArticles,
  moduleLinkMap,
  locale,
}: HomePageClientProps) {
  const t = useMessages() as any;
  // moduleLinkMap is kept in props for structural compatibility; internal
  // module URLs were intentionally removed, so it is not indexed here.
  void moduleLinkMap;
  void locale;

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.giantsimulatorrebornwiki.wiki";

  // Structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: "Giant Simulator Reborn Wiki",
        description:
          "Complete Giant Simulator Reborn Wiki covering codes, pets, rebirth, gear, bosses, gold farming, events, and beginner routes for the Roblox giant growth simulator.",
        image: {
          "@type": "ImageObject",
          url: `${siteUrl}/images/hero.webp`,
          width: 1920,
          height: 1080,
          caption: "Giant Simulator Reborn - Roblox Giant Growth Simulator",
        },
        potentialAction: {
          "@type": "SearchAction",
          target: `${siteUrl}/search?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: "Giant Simulator Reborn Wiki",
        alternateName: "Giant Simulator Reborn",
        url: siteUrl,
        description:
          "Complete Giant Simulator Reborn Wiki resource hub for codes, pets, rebirth, gear, bosses, and farming guides",
        logo: {
          "@type": "ImageObject",
          url: `${siteUrl}/android-chrome-512x512.png`,
          width: 512,
          height: 512,
        },
        image: {
          "@type": "ImageObject",
          url: `${siteUrl}/images/hero.webp`,
          width: 1920,
          height: 1080,
          caption: "Giant Simulator Reborn Wiki - Roblox Giant Growth Simulator",
        },
        sameAs: [
          "https://www.roblox.com/games/12645083079/Giant-Simulator-REBORN",
          "https://discord.com/invite/f7eMMSjBbh",
          "https://x.com/MithrilGames",
          "https://www.youtube.com/watch?v=UwsyBvLdIj4",
        ],
      },
      {
        "@type": "VideoGame",
        name: "Giant Simulator Reborn",
        gamePlatform: ["Roblox"],
        applicationCategory: "Game",
        genre: ["Simulation", "Adventure", "Clicker", "RPG"],
        numberOfPlayers: {
          minValue: 1,
          maxValue: 1,
        },
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
          url: "https://www.roblox.com/games/12645083079/Giant-Simulator-REBORN",
        },
      },
      {
        "@type": "VideoObject",
        name: "Becoming The Biggest Player In Giant Simulator Reborn",
        description:
          "Gravycatman becomes the biggest player in Giant Simulator Reborn — gameplay showcase covering growth, gear, pets, and rebirth.",
        uploadDate: "2026-07-02",
        thumbnailUrl: `${siteUrl}/images/hero.webp`,
        embedUrl: "https://www.youtube.com/embed/UwsyBvLdIj4",
        url: "https://www.youtube.com/watch?v=UwsyBvLdIj4",
      },
    ],
  };

  const [faqExpanded, setFaqExpanded] = useState<number | null>(null);
  const [codesExpanded, setCodesExpanded] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const mobileBannerAd = getPreferredMobileBannerSelection();

  const handleCopyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 1500);
    } catch {
      setCopiedCode(null);
    }
  };

  const codes = t.modules.codes;
  const codesItems: any[] = codes.items || [];
  const activeCodes = codesItems.filter((i) => i.type === "active-code");
  const summaryCard = codesItems.find((i) => i.type === "summary-card");
  const expiredGroup = codesItems.find((i) => i.type === "expired-code-group");
  const redeemSteps = codesItems.filter((i) => i.type === "redeem-step");

  return (
    <div className="home-shell min-h-screen bg-background text-foreground">
      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* 广告位 1: 顶部固定横幅 */}
      <div className="sticky top-20 z-20 border-b border-border py-2">
        <AdBanner type="banner-320x50" adKey={process.env.NEXT_PUBLIC_AD_MOBILE_320X50} />
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 pt-24 pb-14 md:pt-32 md:pb-20">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-8 text-center scroll-reveal">
            {/* Badge */}
            <div
              className="mb-4 inline-flex items-center gap-2 rounded-full border border-[hsl(var(--nav-theme)/0.3)]
                            bg-[hsl(var(--nav-theme)/0.1)] px-3 py-1.5 md:mb-6 md:px-4 md:py-2"
            >
              <Sparkles className="h-4 w-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-xs font-medium md:text-sm">{t.hero.badge}</span>
            </div>

            {/* Title */}
            <h1 className="mb-4 text-4xl font-bold leading-[1.05] sm:text-5xl md:mb-6 md:text-7xl">
              {t.hero.title}
            </h1>

            {/* Description */}
            <p className="mx-auto mb-8 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg md:mb-10 md:max-w-3xl md:text-2xl">
              {t.hero.description}
            </p>

            {/* CTA Buttons */}
            <div className="mb-10 flex flex-col justify-center gap-3 sm:flex-row md:mb-12 md:gap-4">
              <button
                onClick={() => scrollToSection("codes")}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[hsl(var(--nav-theme))]
                           px-6 py-3.5 font-semibold text-base text-white transition-colors
                           hover:bg-[hsl(var(--nav-theme)/0.9)] md:px-8 md:py-4 md:text-lg"
              >
                <Gift className="h-5 w-5" />
                {t.hero.getFreeCodesCTA}
              </button>
              <a
                href="https://www.roblox.com/games/12645083079/Giant-Simulator-REBORN"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-border
                           px-6 py-3.5 font-semibold text-base transition-colors hover:bg-white/10
                           md:px-8 md:py-4 md:text-lg"
              >
                {t.hero.playOnRobloxCTA}
                <ArrowRight className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Stats */}
          <Suspense fallback={<LoadingPlaceholder height="h-32" />}>
            <HeroStats stats={Object.values(t.hero.stats)} />
          </Suspense>
        </div>
      </section>

      {/* Video Section - 紧跟 Hero 区域 (max-w-5xl) */}
      <section className="px-4 py-10 md:py-12">
        <div className="container mx-auto max-w-5xl scroll-reveal">
          <div className="relative overflow-hidden rounded-2xl">
            <VideoFeature
              videoId="UwsyBvLdIj4"
              title="Becoming The Biggest Player In Giant Simulator Reborn"
            />
          </div>
        </div>
      </section>

      {/* Tools Grid - 模块导航区 (max-w-5xl, 4 卡 1:1 对应模块) */}
      <section className="bg-white/[0.02] px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="mb-8 text-center scroll-reveal md:mb-12">
            <h2 className="mb-3 text-3xl font-bold md:mb-4 md:text-5xl">
              {t.tools.title}{" "}
              <span className="text-[hsl(var(--nav-theme-light))]">
                {t.tools.titleHighlight}
              </span>
            </h2>
            <p className="text-base text-muted-foreground md:text-lg">
              {t.tools.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            {t.tools.cards.map((card: any, index: number) => {
              const sectionId = TOOL_CARD_SECTION_IDS[index];
              return (
                <button
                  key={index}
                  onClick={() => scrollToSection(sectionId)}
                  className="scroll-reveal group cursor-pointer rounded-xl border border-border bg-card p-4 text-left
                             transition-all duration-300 hover:border-[hsl(var(--nav-theme)/0.5)]
                             hover:shadow-lg hover:shadow-[hsl(var(--nav-theme)/0.1)] md:p-6"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div
                    className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg
                                  bg-[hsl(var(--nav-theme)/0.1)] transition-colors
                                  group-hover:bg-[hsl(var(--nav-theme)/0.2)] md:mb-4 md:h-12 md:w-12"
                  >
                    <DynamicIcon
                      name={card.icon}
                      className="h-5 w-5 text-[hsl(var(--nav-theme-light))] md:h-6 md:w-6"
                    />
                  </div>
                  <h3 className="mb-1.5 text-sm font-semibold md:text-base">
                    {card.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{card.description}</p>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Latest Updates Section (模板1 Latest Updates, 禁止删除) */}
      <LatestGuidesAccordion articles={latestArticles} locale={locale} max={12} />

      {/* 广告位 2: 首屏内容之后再加载广告 */}
      <NativeBannerAd adKey={process.env.NEXT_PUBLIC_AD_NATIVE_BANNER || ""} />

      {/* 广告位 3: 移动端优先使用方形，桌面端保留横幅 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-728x90"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90}
        className="hidden md:flex"
      />

      {/* Module 1: Giant Simulator Reborn Codes (code-cards) */}
      <section id="codes" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="mb-8 text-center scroll-reveal md:mb-12">
            <span className="mb-3 inline-block rounded-full border border-[hsl(var(--nav-theme)/0.3)] bg-[hsl(var(--nav-theme)/0.1)] px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[hsl(var(--nav-theme-light))]">
              {codes.eyebrow}
            </span>
            <h2 className="mb-3 text-3xl font-bold md:mb-4 md:text-5xl">
              <ModuleTitle>{codes.title}</ModuleTitle>
            </h2>
            <p className="mx-auto mb-3 max-w-3xl text-base text-muted-foreground md:text-lg">
              {codes.subtitle}
            </p>
            <p className="mx-auto max-w-3xl text-sm text-muted-foreground md:text-base">
              {codes.intro}
            </p>
          </div>

          {/* Active code cards */}
          <div className="mb-6 grid grid-cols-1 gap-3 scroll-reveal md:grid-cols-2 md:gap-4 lg:grid-cols-3">
            {activeCodes.map((item, index) => (
              <div
                key={index}
                className="rounded-xl border border-border bg-white/5 p-4 transition-colors hover:border-[hsl(var(--nav-theme)/0.5)] md:p-5"
              >
                <div className="mb-3 flex items-center justify-between gap-2">
                  <code className="rounded-md bg-[hsl(var(--nav-theme)/0.15)] px-3 py-1.5 font-mono text-sm font-bold text-[hsl(var(--nav-theme-light))]">
                    {item.code}
                  </code>
                  <button
                    type="button"
                    onClick={() => handleCopyCode(item.code)}
                    aria-label={`Copy code ${item.code}`}
                    className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 text-xs text-muted-foreground transition-colors hover:border-[hsl(var(--nav-theme)/0.5)] hover:text-[hsl(var(--nav-theme-light))]"
                  >
                    {copiedCode === item.code ? (
                      <>
                        <Check className="h-3.5 w-3.5" /> Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" /> Copy
                      </>
                    )}
                  </button>
                </div>
                <div className="mb-2 flex items-center gap-2">
                  <Coins className="h-4 w-4 text-[hsl(var(--nav-theme-light))]" />
                  <span className="text-sm font-semibold">{item.reward}</span>
                </div>
                <p className="text-xs text-muted-foreground">{item.note}</p>
              </div>
            ))}
          </div>

          {/* Total value summary */}
          {summaryCard && (
            <div className="mb-6 scroll-reveal rounded-xl border border-[hsl(var(--nav-theme)/0.3)] bg-[hsl(var(--nav-theme)/0.05)] p-5 md:p-6">
              <div className="flex flex-col items-center justify-between gap-3 text-center sm:flex-row sm:text-left">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[hsl(var(--nav-theme)/0.2)]">
                    <Gift className="h-5 w-5 text-[hsl(var(--nav-theme-light))]" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                      {summaryCard.title}
                    </p>
                    <p className="text-2xl font-bold text-[hsl(var(--nav-theme-light))]">
                      {summaryCard.value}
                    </p>
                  </div>
                </div>
                <p className="max-w-md text-xs text-muted-foreground md:text-sm">
                  {summaryCard.note}
                </p>
              </div>
            </div>
          )}

          {/* Expired codes */}
          {expiredGroup && (
            <div className="mb-6 scroll-reveal rounded-xl border border-border bg-white/5 p-5 md:p-6">
              <button
                type="button"
                onClick={() => setCodesExpanded(!codesExpanded)}
                className="flex w-full items-center justify-between text-left"
              >
                <span className="text-base font-bold md:text-lg">
                  {expiredGroup.title}
                </span>
                <ChevronDown
                  className={`h-5 w-5 flex-shrink-0 text-muted-foreground transition-transform ${codesExpanded ? "rotate-180" : ""}`}
                />
              </button>
              {codesExpanded && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {expiredGroup.codes.map((c: string, i: number) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 rounded-md border border-border bg-white/5 px-2.5 py-1 font-mono text-xs text-muted-foreground line-through decoration-muted-foreground/60"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Redeem steps */}
          {redeemSteps.length > 0 && (
            <div className="scroll-reveal rounded-xl border border-[hsl(var(--nav-theme)/0.3)] bg-[hsl(var(--nav-theme)/0.05)] p-5 md:p-6">
              <div className="mb-4 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-[hsl(var(--nav-theme-light))]" />
                <h3 className="text-base font-bold md:text-lg">How to Redeem Codes</h3>
              </div>
              <ol className="space-y-3">
                {redeemSteps.map((step, index) => (
                  <li key={index} className="flex gap-3 md:gap-4">
                    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border-2 border-[hsl(var(--nav-theme)/0.5)] bg-[hsl(var(--nav-theme)/0.2)]">
                      <span className="text-sm font-bold text-[hsl(var(--nav-theme-light))]">
                        {step.step}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold">{step.title}</p>
                      <p className="text-sm text-muted-foreground">{step.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      </section>

      {/* 广告位 4: 第一模块之后的阅读停顿位 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-468x60"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_468X60}
        className="hidden md:flex"
      />

      {/* Module 2: Giant Simulator Reborn Beginner Guide (step-by-step) */}
      <section id="beginner-guide" className="scroll-mt-24 bg-white/[0.02] px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="mb-8 text-center scroll-reveal md:mb-12">
            <span className="mb-3 inline-block rounded-full border border-[hsl(var(--nav-theme)/0.3)] bg-[hsl(var(--nav-theme)/0.1)] px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[hsl(var(--nav-theme-light))]">
              {t.modules.beginnerGuide.eyebrow}
            </span>
            <h2 className="mb-3 text-3xl font-bold md:mb-4 md:text-5xl">
              <ModuleTitle>{t.modules.beginnerGuide.title}</ModuleTitle>
            </h2>
            <p className="mx-auto mb-3 max-w-3xl text-base text-muted-foreground md:text-lg">
              {t.modules.beginnerGuide.subtitle}
            </p>
            <p className="mx-auto max-w-3xl text-sm text-muted-foreground md:text-base">
              {t.modules.beginnerGuide.intro}
            </p>
          </div>

          <div className="space-y-3 scroll-reveal md:space-y-4">
            {t.modules.beginnerGuide.items.map((step: any, index: number) => (
              <div
                key={index}
                className="flex flex-col gap-3 rounded-xl border border-border bg-white/5 p-4 transition-colors hover:border-[hsl(var(--nav-theme)/0.5)] md:flex-row md:gap-5 md:p-6"
              >
                <div className="flex items-center gap-3 md:w-48 md:flex-shrink-0">
                  <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full border-2 border-[hsl(var(--nav-theme)/0.5)] bg-[hsl(var(--nav-theme)/0.2)]">
                    <span className="text-lg font-bold text-[hsl(var(--nav-theme-light))]">
                      {step.step}
                    </span>
                  </div>
                  <h3 className="text-base font-bold md:text-lg">
                    <ModuleTitle>{step.title}</ModuleTitle>
                  </h3>
                </div>
                <div className="grid flex-1 gap-3 sm:grid-cols-3">
                  <div className="rounded-lg bg-white/5 p-3">
                    <p className="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[hsl(var(--nav-theme-light))]">
                      <Target className="h-3.5 w-3.5" /> Goal
                    </p>
                    <p className="text-sm text-muted-foreground">{step.goal}</p>
                  </div>
                  <div className="rounded-lg bg-white/5 p-3">
                    <p className="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[hsl(var(--nav-theme-light))]">
                      <Zap className="h-3.5 w-3.5" /> Action
                    </p>
                    <p className="text-sm text-muted-foreground">{step.action}</p>
                  </div>
                  <div className="rounded-lg bg-white/5 p-3">
                    <p className="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[hsl(var(--nav-theme-light))]">
                      <TrendingUp className="h-3.5 w-3.5" /> Result
                    </p>
                    <p className="text-sm text-muted-foreground">{step.result}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 3: Giant Simulator Reborn Leveling and Gold Farming Guide (guide-cards) */}
      <section id="leveling-gold-farming" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="mb-8 text-center scroll-reveal md:mb-12">
            <span className="mb-3 inline-block rounded-full border border-[hsl(var(--nav-theme)/0.3)] bg-[hsl(var(--nav-theme)/0.1)] px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[hsl(var(--nav-theme-light))]">
              {t.modules.levelingAndGoldFarming.eyebrow}
            </span>
            <h2 className="mb-3 text-3xl font-bold md:mb-4 md:text-5xl">
              <ModuleTitle>{t.modules.levelingAndGoldFarming.title}</ModuleTitle>
            </h2>
            <p className="mx-auto mb-3 max-w-3xl text-base text-muted-foreground md:text-lg">
              {t.modules.levelingAndGoldFarming.subtitle}
            </p>
            <p className="mx-auto max-w-3xl text-sm text-muted-foreground md:text-base">
              {t.modules.levelingAndGoldFarming.intro}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 scroll-reveal md:grid-cols-2 lg:grid-cols-3">
            {t.modules.levelingAndGoldFarming.items.map((item: any, index: number) => (
              <div
                key={index}
                className="flex flex-col rounded-xl border border-border bg-white/5 p-5 transition-colors hover:border-[hsl(var(--nav-theme)/0.5)] md:p-6"
              >
                <div className="mb-3 flex items-center justify-between gap-2">
                  <h3 className="text-base font-bold md:text-lg">
                    <ModuleTitle>{item.title}</ModuleTitle>
                  </h3>
                  <span
                    className={`inline-flex flex-shrink-0 items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-semibold ${PRIORITY_STYLES[item.priority] || "bg-[hsl(var(--nav-theme)/0.1)] border-[hsl(var(--nav-theme)/0.3)] text-[hsl(var(--nav-theme-light))]"}`}
                  >
                    {item.priority}
                  </span>
                </div>
                <p className="mb-3 rounded-lg bg-white/5 p-3 text-sm text-muted-foreground">
                  {item.data}
                </p>
                <p className="mb-3 text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">Action: </span>
                  {item.action}
                </p>
                <p className="mt-auto flex items-start gap-2 border-t border-border pt-3 text-xs text-muted-foreground">
                  <Check className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-[hsl(var(--nav-theme-light))]" />
                  <span>{item.why_it_matters}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 广告位 5: 移动端横幅 */}
      {mobileBannerAd && (
        <AdBanner
          type={mobileBannerAd.type}
          adKey={mobileBannerAd.adKey}
          className="md:hidden"
        />
      )}

      {/* Module 4: Giant Simulator Reborn Pets Guide (card-list) */}
      <section id="pets-guide" className="scroll-mt-24 bg-white/[0.02] px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="mb-8 text-center scroll-reveal md:mb-12">
            <span className="mb-3 inline-block rounded-full border border-[hsl(var(--nav-theme)/0.3)] bg-[hsl(var(--nav-theme)/0.1)] px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[hsl(var(--nav-theme-light))]">
              {t.modules.petsGuide.eyebrow}
            </span>
            <h2 className="mb-3 text-3xl font-bold md:mb-4 md:text-5xl">
              <ModuleTitle>{t.modules.petsGuide.title}</ModuleTitle>
            </h2>
            <p className="mx-auto mb-3 max-w-3xl text-base text-muted-foreground md:text-lg">
              {t.modules.petsGuide.subtitle}
            </p>
            <p className="mx-auto max-w-3xl text-sm text-muted-foreground md:text-base">
              {t.modules.petsGuide.intro}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 scroll-reveal md:grid-cols-2">
            {t.modules.petsGuide.items.map((item: any, index: number) => (
              <div
                key={index}
                className="flex flex-col rounded-xl border border-border bg-white/5 p-5 transition-colors hover:border-[hsl(var(--nav-theme)/0.5)] md:p-6"
              >
                <div className="mb-3 flex items-center gap-2">
                  <PawPrint className="h-5 w-5 flex-shrink-0 text-[hsl(var(--nav-theme-light))]" />
                  <h3 className="text-base font-bold md:text-lg">
                    <ModuleTitle>{item.title}</ModuleTitle>
                  </h3>
                  <span
                    className={`ml-auto inline-flex flex-shrink-0 items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-semibold ${CATEGORY_STYLES[item.category] || "bg-[hsl(var(--nav-theme)/0.1)] border-[hsl(var(--nav-theme)/0.3)] text-[hsl(var(--nav-theme-light))]"}`}
                  >
                    {item.category}
                  </span>
                </div>
                <p className="mb-2 text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">What it does: </span>
                  {item.what_it_does}
                </p>
                <p className="mb-2 text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">Player action: </span>
                  {item.player_action}
                </p>
                <p className="mt-auto flex items-start gap-2 border-t border-border pt-3 text-xs text-muted-foreground">
                  <Trophy className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-[hsl(var(--nav-theme-light))]" />
                  <span>
                    <span className="font-semibold text-foreground">Best for: </span>
                    {item.best_for}
                  </span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-3xl">
          <div className="mb-8 text-center scroll-reveal md:mb-12">
            <h2 className="mb-3 text-3xl font-bold md:mb-4 md:text-5xl">
              {t.faq.title}{" "}
              <span className="text-[hsl(var(--nav-theme-light))]">
                {t.faq.titleHighlight}
              </span>
            </h2>
            <p className="text-base text-muted-foreground md:text-lg">
              {t.faq.subtitle}
            </p>
          </div>
          <div className="space-y-2 scroll-reveal">
            {t.faq.questions.map((faq: any, index: number) => (
              <div
                key={index}
                className="overflow-hidden rounded-xl border border-border"
              >
                <button
                  onClick={() => setFaqExpanded(faqExpanded === index ? null : index)}
                  className="flex w-full items-center justify-between p-5 text-left transition-colors hover:bg-white/5"
                >
                  <span className="font-semibold">{faq.question}</span>
                  <ChevronDown
                    className={`h-5 w-5 flex-shrink-0 transition-transform ${faqExpanded === index ? "rotate-180" : ""}`}
                  />
                </button>
                {faqExpanded === index && (
                  <div className="px-5 pb-5 text-sm text-muted-foreground">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <Suspense fallback={<LoadingPlaceholder />}>
        <CTASection
          title={t.cta.title}
          description={t.cta.description}
          joinCommunity={t.cta.joinCommunity}
          joinGame={t.cta.joinGame}
        />
      </Suspense>

      {/* Ad Banner 3 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-728x90"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90}
        className="hidden md:flex"
      />

      {/* Footer */}
      <footer className="border-t border-border bg-white/[0.02]">
        <div className="container mx-auto px-4 py-12">
          <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-4">
            {/* Brand */}
            <div>
              <h3 className="mb-4 text-xl font-bold text-[hsl(var(--nav-theme-light))]">
                {t.footer.title}
              </h3>
              <p className="text-sm text-muted-foreground">{t.footer.description}</p>
            </div>

            {/* Community - External Links Only */}
            <div>
              <h4 className="mb-4 font-semibold">{t.footer.community}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="https://discord.com/invite/f7eMMSjBbh"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground transition hover:text-[hsl(var(--nav-theme-light))]"
                  >
                    {t.footer.discord}
                  </a>
                </li>
                <li>
                  <a
                    href="https://x.com/MithrilGames"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground transition hover:text-[hsl(var(--nav-theme-light))]"
                  >
                    {t.footer.twitter}
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.youtube.com/watch?v=UwsyBvLdIj4"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground transition hover:text-[hsl(var(--nav-theme-light))]"
                  >
                    {t.footer.steamCommunity}
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.roblox.com/games/12645083079/Giant-Simulator-REBORN"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground transition hover:text-[hsl(var(--nav-theme-light))]"
                  >
                    {t.footer.steamStore}
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal - Internal Routes Only */}
            <div>
              <h4 className="mb-4 font-semibold">{t.footer.legal}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href={locale === "en" ? "/about" : `/${locale}/about`}
                    className="text-muted-foreground transition hover:text-[hsl(var(--nav-theme-light))]"
                  >
                    {t.footer.about}
                  </Link>
                </li>
                <li>
                  <Link
                    href={locale === "en" ? "/privacy-policy" : `/${locale}/privacy-policy`}
                    className="text-muted-foreground transition hover:text-[hsl(var(--nav-theme-light))]"
                  >
                    {t.footer.privacy}
                  </Link>
                </li>
                <li>
                  <Link
                    href={locale === "en" ? "/terms-of-service" : `/${locale}/terms-of-service`}
                    className="text-muted-foreground transition hover:text-[hsl(var(--nav-theme-light))]"
                  >
                    {t.footer.terms}
                  </Link>
                </li>
                <li>
                  <Link
                    href={locale === "en" ? "/copyright" : `/${locale}/copyright`}
                    className="text-muted-foreground transition hover:text-[hsl(var(--nav-theme-light))]"
                  >
                    {t.footer.copyrightNotice}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Copyright */}
            <div>
              <p className="mb-2 text-sm text-muted-foreground">{t.footer.copyright}</p>
              <p className="text-xs text-muted-foreground">{t.footer.disclaimer}</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
