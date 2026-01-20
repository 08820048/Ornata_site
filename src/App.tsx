import { useEffect, useMemo, useState } from 'react';
import { flushSync } from 'react-dom';
import {
  ArrowRight,
  Briefcase,
  Calendar,
  ChevronDown,
  Compass,
  Globe,
  Moon,
  Sun,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

type SectionId = 'home' | 'problem' | 'features' | 'download' | 'faq' | 'book';
type ThemeMode = 'light' | 'dark';

function getInitialThemeMode(): ThemeMode {
  if (typeof window === 'undefined') return 'light';

  const saved = localStorage.getItem('themeMode');
  if (saved === 'light' || saved === 'dark') {
    document.documentElement.dataset.theme = saved;
    return saved;
  }

  const preferred = window.matchMedia?.('(prefers-color-scheme: dark)')?.matches ? 'dark' : 'light';
  document.documentElement.dataset.theme = preferred;
  return preferred;
}

function useActiveSection(sectionIds: SectionId[]) {
  const [activeSection, setActiveSection] = useState<SectionId>('home');

  useEffect(() => {
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0))[0];

        if (!visible?.target) return;
        const id = (visible.target as HTMLElement).id as SectionId;
        setActiveSection(id);
      },
      {
        root: null,
        threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.6],
        rootMargin: '-20% 0px -70% 0px',
      }
    );

    for (const el of elements) observer.observe(el);
    return () => observer.disconnect();
  }, [sectionIds]);

  return activeSection;
}

function splitLines(text: string) {
  const lines = text.split('\n');
  return lines.map((line, idx) => (
    <span key={idx}>
      {line}
      {idx < lines.length - 1 ? <br /> : null}
    </span>
  ));
}

function ThemeSwitch({
  themeMode,
  onToggle,
}: {
  themeMode: ThemeMode;
  onToggle: () => void;
}) {
  const { t: translate } = useTranslation();
  const isDark = themeMode === 'dark';

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label={isDark ? translate('theme.toLight') : translate('theme.toDark')}
      onClick={onToggle}
      className="group inline-flex items-center justify-center p-2 bg-transparent border-0 rounded-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--menu-icon-active)]"
    >
      {isDark ? (
        <Moon className="h-4 w-4 text-[var(--menu-icon-active)] transition-colors" />
      ) : (
        <Sun className="h-4 w-4 text-[var(--menu-icon)] group-hover:text-[var(--menu-icon-active)] transition-colors" />
      )}
    </button>
  );
}

function LanguageSwitch({
  currentLanguage,
  onToggle,
}: {
  currentLanguage: 'zh' | 'en';
  onToggle: () => void;
}) {
  const { t: translate } = useTranslation();

  return (
    <button
      type="button"
      aria-label={
        currentLanguage === 'zh' ? translate('language.toEnglish') : translate('language.toChinese')
      }
      onClick={onToggle}
      className="group inline-flex items-center justify-center p-2 bg-transparent border-0 rounded-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--menu-icon-active)]"
    >
      <Globe className="h-4 w-4 text-[var(--menu-icon)] group-hover:text-[var(--menu-icon-active)] transition-colors" />
    </button>
  );
}

function MainContent() {
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => getInitialThemeMode());
  const { t: translate, i18n } = useTranslation();

  useEffect(() => {
    document.documentElement.dataset.theme = themeMode;
    localStorage.setItem('themeMode', themeMode);
  }, [themeMode]);

  const currentLanguage = i18n.language.startsWith('zh') ? 'zh' : 'en';

  useEffect(() => {
    document.documentElement.lang = currentLanguage === 'zh' ? 'zh-CN' : 'en';
    localStorage.setItem('language', currentLanguage);
  }, [currentLanguage]);

  const toggleThemeMode = async () => {
    const wasDark = themeMode === 'dark';
    const nextMode: ThemeMode = wasDark ? 'light' : 'dark';
    const prefersReducedMotion =
      window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false;
    type StartViewTransition = (updateCallback: () => void) => { ready: Promise<void> };
    const startViewTransition = (
      document as unknown as { startViewTransition?: StartViewTransition }
    ).startViewTransition?.bind(document) as StartViewTransition | undefined;

    const applyThemeMode = (mode: ThemeMode) => {
      document.documentElement.dataset.theme = mode;
      localStorage.setItem('themeMode', mode);
      setThemeMode(mode);
    };

    if (!startViewTransition || prefersReducedMotion) {
      applyThemeMode(nextMode);
      if (!prefersReducedMotion) {
        document.body
          .animate([{ opacity: 0.85 }, { opacity: 1 }], { duration: 220, easing: 'ease-out' })
          .finished.catch(() => {});
      }
      return;
    }

    let transition: { ready: Promise<void> } | undefined;
    try {
      transition = startViewTransition(() => {
        flushSync(() => {
          applyThemeMode(nextMode);
        });
      });
    } catch {
      applyThemeMode(nextMode);
      return;
    }

    try {
      await transition.ready;
      const endRadius = Math.hypot(window.innerWidth, window.innerHeight);
      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${window.innerWidth}px 0px)`,
            `circle(${endRadius}px at ${window.innerWidth}px 0px)`,
          ],
        },
        {
          duration: 1000,
          easing: 'ease-in-out',
          pseudoElement: '::view-transition-new(root)',
        } as unknown as KeyframeAnimationOptions
      );
    } catch {
      void 0;
    }
  };

  const t = {
      nav: {
        features: translate('nav.features'),
        download: translate('nav.download'),
        faq: translate('nav.faq'),
        cta: translate('nav.cta'),
      },
      hero: {
        titleLine1: translate('hero.titleLine1'),
        titleLine2: translate('hero.titleLine2'),
        titleAccent: translate('hero.titleAccent'),
        description: translate('hero.description'),
        primaryCta: translate('hero.primaryCta'),
      },
      problem: {
        eyebrow: translate('problem.eyebrow'),
        title: translate('problem.title'),
        description: translate('problem.description'),
        highlight: translate('problem.highlight'),
      },
      features: {
        title: translate('features.title'),
        subtitle: translate('features.subtitle'),
        items: translate('features.items', { returnObjects: true }) as Array<{
          title: string;
          description: string;
        }>,
      },
      proof: {
        title: translate('proof.title'),
        subtitle: translate('proof.subtitle'),
        metrics: translate('proof.metrics', { returnObjects: true }) as Array<{
          value: string;
          label: string;
        }>,
        tiles: translate('proof.tiles', { returnObjects: true }) as string[],
      },
      collaboration: {
        eyebrow: translate('collaboration.eyebrow'),
        title: translate('collaboration.title'),
        options: translate('collaboration.options', { returnObjects: true }) as Array<{
          title: string;
          badge: string;
          description: string;
          bullets: string[];
        }>,
      },
      download: {
        title: translate('download.title'),
        subtitle: translate('download.subtitle'),
        macOS: translate('download.macOS'),
        windows: translate('download.windows'),
        linux: translate('download.linux'),
        appleSilicon: translate('download.appleSilicon'),
        intel: translate('download.intel'),
        x64: translate('download.x64'),
        arm64: translate('download.arm64'),
        appImage: translate('download.appImage'),
        deb: translate('download.deb'),
        comingSoon: translate('download.comingSoon'),
      },
      philosophy: {
        title: translate('philosophy.title'),
        accent: translate('philosophy.accent'),
        description: translate('philosophy.description'),
      },
      faq: {
        title: translate('faq.title'),
        items: translate('faq.items', { returnObjects: true }) as Array<{ q: string; a: string }>,
      },
      footer: {
        docs: translate('footer.docs'),
        feedback: translate('footer.feedback'),
        headline: translate('footer.headline'),
        cta: translate('footer.cta'),
      },
  };

  const sectionIds = useMemo<SectionId[]>(
    () => ['home', 'problem', 'features', 'download', 'faq', 'book'],
    []
  );
  const activeSection = useActiveSection(sectionIds);

  const scrollToSection = (sectionId: SectionId) => {
    const element = document.getElementById(sectionId);
    if (!element) return;
    element.scrollIntoView({ behavior: 'smooth' });
  };

  const featureRows = useMemo(() => {
    const items = t.features.items;
    return [items.slice(0, 3), items.slice(3, 6)];
  }, [t.features.items]);

  return (
    <div className="min-h-screen bg-[var(--surface-0)] text-[var(--text-0)] antialiased selection:bg-orange-500 selection:text-white">
      <nav className="fixed top-0 w-full z-50 bg-[var(--surface-0)] backdrop-blur-sm border-b border-[color:var(--border-0)]">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <button
            onClick={() => scrollToSection('home')}
            className="text-lg tracking-tighter font-semibold uppercase flex items-center gap-2"
          >
            <img src="/logo.png" alt="Ornata" className="w-5 h-5" />
            Ornata
          </button>

          <div className="hidden md:flex items-center gap-6">
            <button
              onClick={() => scrollToSection('features')}
              className={`text-sm font-medium transition-colors ${
                activeSection === 'features'
                  ? 'text-[var(--menu-icon-active)]'
                  : 'text-[var(--menu-icon)] hover:text-[var(--menu-icon-active)]'
              }`}
            >
              {t.nav.features}
            </button>
            <button
              onClick={() => scrollToSection('download')}
              className={`text-sm font-medium transition-colors ${
                activeSection === 'download'
                  ? 'text-[var(--menu-icon-active)]'
                  : 'text-[var(--menu-icon)] hover:text-[var(--menu-icon-active)]'
              }`}
            >
              {t.nav.download}
            </button>
            <button
              onClick={() => scrollToSection('faq')}
              className={`text-sm font-medium transition-colors ${
                activeSection === 'faq'
                  ? 'text-[var(--menu-icon-active)]'
                  : 'text-[var(--menu-icon)] hover:text-[var(--menu-icon-active)]'
              }`}
            >
              {t.nav.faq}
            </button>

            <div className="flex items-center gap-3 border-l border-[color:var(--border-0)] pl-6">
              <LanguageSwitch
                currentLanguage={currentLanguage}
                onToggle={() => {
                  void i18n.changeLanguage(currentLanguage === 'zh' ? 'en' : 'zh');
                }}
              />
              <ThemeSwitch themeMode={themeMode} onToggle={toggleThemeMode} />
              <a
                href="#book"
                className="hidden lg:flex items-center gap-2 text-sm font-medium border border-[color:var(--border-0)] px-5 py-2 text-[var(--menu-icon-active)] hover:bg-neutral-900 hover:!text-white transition-colors duration-300"
              >
                {t.nav.cta}
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div className="md:hidden flex items-center gap-2">
            <LanguageSwitch
              currentLanguage={currentLanguage}
              onToggle={() => {
                void i18n.changeLanguage(currentLanguage === 'zh' ? 'en' : 'zh');
              }}
            />
            <ThemeSwitch themeMode={themeMode} onToggle={toggleThemeMode} />
            <a
              href="#book"
              className="h-9 px-3 flex items-center gap-2 border border-[color:var(--border-0)] text-sm font-medium text-[var(--menu-icon-active)] hover:bg-neutral-900 hover:!text-white transition-colors"
            >
              {t.nav.cta}
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </nav>

      <header
        id="home"
        className="relative pt-32 pb-20 md:pt-48 md:pb-32 border-b border-[color:var(--border-0)] overflow-hidden"
      >
        <div className="absolute inset-0 pointer-events-none opacity-10">
          <div className="w-full h-full grid grid-cols-6 md:grid-cols-12 gap-0">
            {Array.from({ length: 12 }).map((_, idx) => (
              <div key={idx} className="border-r border-[color:var(--text-0)] h-full col-span-1" />
            ))}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-end">
            <div className="md:col-span-8">
              <h1 className="text-6xl md:text-8xl lg:text-9xl tracking-tighter font-semibold leading-[0.95] text-[var(--text-0)] mb-8">
                {t.hero.titleLine1} <br />
                {t.hero.titleLine2}{' '}
                <span className="text-orange-600">{t.hero.titleAccent}</span>
              </h1>
            </div>

            <div className="md:col-span-4 flex flex-col justify-end">
              <div className="w-full aspect-square relative mb-8 hidden md:block">
                <div className="absolute top-0 left-0 w-8 h-8 bg-neutral-200" />
                <div className="absolute top-4 left-12 w-8 h-8 bg-neutral-300" />
                <div className="absolute top-12 left-4 w-8 h-8 bg-neutral-800" />
                <div className="absolute bottom-0 right-0 w-32 h-32 border border-[color:var(--border-0)] flex flex-wrap content-end">
                  {Array.from({ length: 9 }).map((_, idx) => (
                    <div
                      key={idx}
                      className={`w-8 h-8 ${
                        idx === 0 ? 'bg-orange-600' : idx % 2 === 0 ? 'bg-neutral-900' : 'bg-neutral-700'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <p className="text-lg md:text-xl text-[var(--text-1)] leading-relaxed max-w-md">
                {t.hero.description}
              </p>

              <div className="mt-8 flex gap-4 flex-wrap">
                <a
                  href="#download"
                  className="inline-flex items-center justify-center hover:bg-orange-600 transition-colors duration-300 text-sm font-medium !text-white hover:!text-white tracking-wide bg-neutral-900 px-8 py-4"
                >
                  {t.hero.primaryCta}
                </a>
              </div>
            </div>
          </div>
        </div>
      </header>

      <section id="problem" className="border-b border-[color:var(--border-0)] py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
            <div className="relative h-64 md:h-auto bg-[var(--surface-1)] border border-[color:var(--border-0)] flex items-center justify-center overflow-hidden group">
              <div className="grid grid-cols-5 gap-2 opacity-60 transform group-hover:scale-105 transition-transform duration-700">
                <div className="w-12 h-12 border border-[color:var(--border-0)]" />
                <div className="w-12 h-12 bg-neutral-200 translate-y-4" />
                <div className="w-12 h-12 border border-[color:var(--border-0)] -translate-x-2" />
                <div className="w-12 h-12 bg-neutral-900 rotate-12" />
                <div className="w-12 h-12 border border-[color:var(--border-0)]" />
                <div className="w-12 h-12 border border-[color:var(--border-0)] translate-x-4" />
                <div className="w-12 h-12 bg-neutral-400" />
                <div className="w-12 h-12 border border-[color:var(--border-0)]" />
              </div>
              <div className="absolute bottom-4 left-4 text-xs font-mono uppercase text-neutral-400">
                Fig 1. Entropy
              </div>
            </div>

            <div className="flex flex-col justify-center">
              <span className="text-orange-600 font-mono text-xs uppercase tracking-widest mb-4">
                {t.problem.eyebrow}
              </span>
              <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-[var(--text-0)] mb-8 leading-tight">
                {splitLines(t.problem.title)}
              </h2>
              <p className="text-[var(--text-1)] text-lg leading-relaxed mb-6">
                {t.problem.description}
              </p>
              <p className="text-[var(--text-0)] text-lg font-medium leading-relaxed border-l-2 border-orange-600 pl-6">
                {t.problem.highlight}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="border-b border-[color:var(--border-0)]">
        <div className="max-w-7xl mx-auto">
          <div className="p-6 md:p-12 border-b border-[color:var(--border-0)]">
            <h2 className="text-4xl tracking-tighter font-semibold">{t.features.title}</h2>
            <p className="mt-4 text-[var(--text-1)] max-w-3xl">{t.features.subtitle}</p>
          </div>

          {featureRows.map((row, rowIndex) => (
            <div
              key={rowIndex}
              className={`grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[color:var(--border-0)] ${
                rowIndex === 1 ? 'border-t border-[color:var(--border-0)]' : ''
              }`}
            >
              {row.map((item, idx) => (
                <div
                  key={`${rowIndex}-${idx}`}
                  className="p-8 md:p-12 hover:bg-[var(--surface-1)] transition-colors duration-300"
                >
                  <h3 className="text-xl font-semibold text-[var(--text-0)] mb-4 tracking-tight">
                    {item.title}
                  </h3>
                  <p className="text-[var(--text-1)] leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      <section className="py-24 border-b border-[color:var(--border-0)] bg-neutral-900 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
            <div className="md:col-span-4">
              <h2 className="text-3xl md:text-4xl tracking-tighter font-semibold mb-8">
                {t.proof.title} <span className="text-neutral-400">{t.proof.subtitle}</span>
              </h2>
              <div className="space-y-8">
                {t.proof.metrics.map((m, idx) => (
                  <div key={idx}>
                    <div className="text-5xl md:text-6xl font-semibold tracking-tighter text-orange-500">
                      {m.value}
                    </div>
                    <div className="text-sm uppercase tracking-widest text-neutral-400 mt-2">
                      {m.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="md:col-span-8 border-t md:border-t-0 md:border-l border-neutral-800 md:pl-12 pt-12 md:pt-0">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                {t.proof.tiles.map((tile, idx) => (
                  <div
                    key={idx}
                    className="h-20 flex items-center border border-neutral-800 p-4 hover:border-neutral-600 transition-colors"
                  >
                    <span className="font-bold text-lg tracking-tight">{tile}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 border-b border-[color:var(--border-0)]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-16">
            <span className="text-orange-600 font-mono text-xs uppercase tracking-widest">
              {t.collaboration.eyebrow}
            </span>
            <h2 className="text-4xl font-semibold tracking-tighter mt-4">{t.collaboration.title}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border border-[color:var(--border-0)]">
            {t.collaboration.options.map((opt, idx) => (
              <div
                key={idx}
                className={`p-10 md:p-16 hover:bg-[var(--surface-1)] transition-all duration-300 ${
                  idx === 0 ? 'border-b md:border-b-0 md:border-r border-[color:var(--border-0)]' : ''
                }`}
              >
                <div
                  className={`w-12 h-12 flex items-center justify-center mb-8 border ${
                    idx === 0
                      ? 'bg-neutral-900 text-white border-neutral-900'
                      : 'bg-[var(--surface-0)] text-[var(--text-0)] border-[color:var(--border-0)]'
                  }`}
                >
                  {idx === 0 ? <Briefcase className="w-6 h-6" /> : <Compass className="w-6 h-6" />}
                </div>
                <h3 className="text-2xl font-semibold mb-4 tracking-tight">{opt.title}</h3>
                <p className="text-sm font-mono text-orange-600 uppercase tracking-wider mb-6">
                  {opt.badge}
                </p>
                <p className="text-[var(--text-1)] leading-relaxed mb-8">{opt.description}</p>
                <ul className="space-y-3 mb-8 text-[var(--text-1)] text-sm">
                  {opt.bullets.map((b, bIdx) => (
                    <li key={bIdx} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-[var(--text-0)]" />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="download" className="py-24 border-b border-[color:var(--border-0)]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-16">
            <span className="text-orange-600 font-mono text-xs uppercase tracking-widest">
              {t.download.subtitle}
            </span>
            <h2 className="text-4xl font-semibold tracking-tighter mt-4">{t.download.title}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-[color:var(--border-0)]">
            {[
              {
                title: t.download.macOS,
                items: [
                  `${t.download.appleSilicon} (.dmg)`,
                  `${t.download.intel} (.dmg)`,
                ],
              },
              {
                title: t.download.windows,
                items: [`${t.download.x64} (.exe)`, `${t.download.arm64} (.exe)`],
              },
              {
                title: t.download.linux,
                items: [`${t.download.x64} ${t.download.appImage}`, `${t.download.x64} ${t.download.deb}`],
              },
            ].map((col, colIdx) => (
              <div
                key={col.title}
                className={`p-10 md:p-12 ${
                  colIdx < 2 ? 'border-b md:border-b-0 md:border-r border-[color:var(--border-0)]' : ''
                }`}
              >
                <h3 className="text-xl font-semibold tracking-tight mb-6">{col.title}</h3>
                <div className="space-y-3 text-sm">
                  {col.items.map((label, idx) => (
                    <a
                      key={idx}
                      href="#"
                      className="block p-4 border border-[color:var(--border-0)] hover:bg-[var(--surface-1)] transition-colors"
                    >
                      {label}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <p className="text-sm text-[var(--text-1)] mt-8">{t.download.comingSoon}</p>
        </div>
      </section>

      <section className="py-32 border-b border-[color:var(--border-0)] bg-[var(--surface-1)]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-5xl md:text-7xl font-semibold tracking-tighter mb-8 text-[var(--text-0)]">
            {t.philosophy.title}{' '}
            <span className="italic font-serif">{t.philosophy.accent}</span>
          </h2>
          <div className="w-px h-16 bg-orange-600 mx-auto mb-8" />
          <p className="text-xl md:text-2xl text-[var(--text-1)] leading-relaxed font-light">
            {t.philosophy.description}
          </p>
        </div>
      </section>

      <section id="faq" className="py-24 border-b border-[color:var(--border-0)]">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl font-semibold tracking-tighter mb-12">{t.faq.title}</h2>

          <div className="space-y-4">
            {t.faq.items.map((item, idx) => (
              <details
                key={idx}
                className="group border border-[color:var(--border-0)] bg-[var(--surface-0)] cursor-pointer"
              >
                <summary className="flex justify-between items-center p-6 font-medium text-lg hover:bg-[var(--surface-1)] transition-colors">
                  <span>{item.q}</span>
                  <span className="transform group-open:rotate-180 transition-transform duration-200">
                    <ChevronDown className="w-5 h-5 text-neutral-400" />
                  </span>
                </summary>
                <div className="px-6 pb-6 text-[var(--text-1)] leading-relaxed">{item.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <footer className="py-24 bg-[var(--surface-0)]" id="book">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center text-center">
          <h2 className="text-4xl md:text-6xl font-semibold tracking-tighter mb-8">
            {t.footer.headline}
          </h2>

          <a
            href="#download"
            className="inline-flex items-center gap-3 bg-orange-600 text-white px-10 py-5 text-lg font-medium hover:bg-neutral-900 transition-colors duration-300"
          >
            {t.footer.cta}
            <Calendar className="w-5 h-5" />
          </a>

          <div className="mt-24 pt-8 border-t border-[color:var(--border-0)] w-full flex flex-col md:flex-row justify-between items-center text-sm text-[var(--text-1)]">
            <p>© 2026 Ornata. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-orange-600 transition-colors">
                {t.footer.docs}
              </a>
              <a href="#" className="hover:text-orange-600 transition-colors">
                {t.footer.feedback}
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return <MainContent />;
}

export default App;
