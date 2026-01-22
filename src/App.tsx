import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Calendar, ChevronDown, Download } from 'lucide-react';
import { featureItems } from './content/features';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

type SectionId = 'home' | 'problem' | 'features' | 'download' | 'faq' | 'book';

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
        threshold: [0, 0.1, 0.2, 0.3, 0.4],
        rootMargin: '-15% 0px -45% 0px',
      }
    );

    for (const el of elements) observer.observe(el);
    return () => observer.disconnect();
  }, [sectionIds]);

  return activeSection;
}

function MainContent() {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    document.documentElement.dataset.theme = 'dark';
    document.documentElement.lang = 'en';
  }, []);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.set('.js-reveal', { autoAlpha: 0, y: 24 });

      gsap.fromTo(
        '.js-nav',
        { autoAlpha: 0, y: -12 },
        { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power2.out' }
      );

      const heroTl = gsap.timeline();
      heroTl
        .fromTo(
          '.js-hero-title',
          { autoAlpha: 0, y: 18 },
          { autoAlpha: 1, y: 0, duration: 0.9, ease: 'power3.out' },
          0
        )
        .fromTo(
          '.js-hero-tagline',
          { autoAlpha: 0, y: 14 },
          { autoAlpha: 1, y: 0, duration: 0.7, ease: 'power3.out' },
          0.12
        )
        .fromTo(
          '.js-hero-actions > *',
          { autoAlpha: 0, y: 10 },
          { autoAlpha: 1, y: 0, duration: 0.55, ease: 'power3.out', stagger: 0.08 },
          0.2
        );

      gsap.utils.toArray<HTMLElement>('.js-reveal').forEach((el) => {
        gsap.to(el, {
          autoAlpha: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        });
      });
    }, root);

    return () => ctx.revert();
  }, []);

  const t = {
    nav: {
      features: 'Features',
      download: 'Download',
      faq: 'FAQ',
      feedback: 'Feedback',
      discord: 'Discord',
      cta: 'Download App',
    },
    hero: {
      titleLine1: 'Write without',
      titleLine2: 'friction',
      tagline:
        'Ornata is a lightweight Markdown editor for technical writing. Fast, focused, and designed to stay out of your way.',
      description:
        'Ornata is a lightweight Markdown editor designed for speed and clarity. From instant startup to smooth editing, it removes friction between thought and text.',
      primaryCta: 'Download',
      discordCta: 'Discord',
    },
    features: {
      items: featureItems,
    },
    download: {
      title: 'Download',
      macOS: 'macOS',
      windows: 'Windows',
      linux: 'Linux',
      appleSilicon: 'Apple Silicon',
      intel: 'Intel',
      x64: 'x64',
      arm64: 'ARM64',
      appImage: '.AppImage',
      deb: '.deb',
    },
    faq: {
      title: 'FAQ',
      items: [
        {
          q: 'Is Ornata an online service?',
          a: 'No. Ornata is a desktop app that keeps your writing local and smooth.',
        },
        {
          q: 'Is it suitable for technical docs?',
          a: 'Yes—formulas, code highlighting, diagrams, and tables are core features.',
        },
        {
          q: 'Can it work with Git?',
          a: 'Yes. Documents are saved as Markdown, ideal for version control.',
        },
        {
          q: 'Do I need an account or internet connection to use Ornata?',
          a: 'No. Ornata runs entirely on your local machine. No account, no login, and no always-on internet connection are required. Once installed, Ornata works fully offline like a traditional desktop editor.',
        },
      ],
    },
    footer: {
      feedback: 'Feedback',
      headline: 'Ready to write with structure?',
      cta: 'Download Ornata',
    },
  };

  const sectionIds = useMemo<SectionId[]>(() => ['home', 'features', 'download', 'faq', 'book'], []);
  const activeSection = useActiveSection(sectionIds);
  const downloadColumns: Array<{
    title: string;
    disabled?: boolean;
    items: Array<{ label: string; href?: string }>;
  }> = [
    {
      title: t.download.macOS,
      items: [
        {
          label: `${t.download.appleSilicon} (.dmg)`,
          href: 'https://api.upgrade.toolsetlink.com/v1/tauri/download?tauriKey=eBdCwsKmTLj1UJLirVAN6Q&target=darwin&arch=aarch64&versionName=0.1.1',
        },
        {
          label: `${t.download.intel} (.dmg)`,
          href: 'https://api.upgrade.toolsetlink.com/v1/tauri/download?tauriKey=eBdCwsKmTLj1UJLirVAN6Q&target=darwin&arch=x86_64&versionName=0.1.1',
        },
      ],
    },
    {
      title: t.download.windows,
      items: [
        {
          label: `${t.download.x64} (.msi)`,
          href: 'https://api.upgrade.toolsetlink.com/v1/tauri/download?tauriKey=eBdCwsKmTLj1UJLirVAN6Q&target=windows&arch=x86_64&versionName=0.1.1',
        },
      ],
    },
    {
      title: t.download.linux,
      disabled: true,
      items: [
        { label: `${t.download.x64} ${t.download.appImage}` },
        { label: `${t.download.x64} ${t.download.deb}` },
      ],
    },
  ];

  const scrollToSection = (sectionId: SectionId) => {
    const element = document.getElementById(sectionId);
    if (!element) return;
    element.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div
      ref={rootRef}
      className="min-h-screen bg-[var(--surface-0)] text-[var(--text-0)] antialiased"
    >
      <nav className="js-nav fixed top-0 w-full z-50 bg-[var(--surface-0)]/90 backdrop-blur-sm shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <button
            onClick={() => scrollToSection('home')}
            className="text-lg tracking-tighter font-semibold flex items-center gap-2 rounded-[10px]"
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
              } rounded-[10px]`}
            >
              {t.nav.features}
            </button>
            <button
              onClick={() => scrollToSection('download')}
              className={`text-sm font-medium transition-colors ${
                activeSection === 'download'
                  ? 'text-[var(--menu-icon-active)]'
                  : 'text-[var(--menu-icon)] hover:text-[var(--menu-icon-active)]'
              } rounded-[10px]`}
            >
              {t.nav.download}
            </button>
            <button
              onClick={() => scrollToSection('faq')}
              className={`text-sm font-medium transition-colors ${
                activeSection === 'faq'
                  ? 'text-[var(--menu-icon-active)]'
                  : 'text-[var(--menu-icon)] hover:text-[var(--menu-icon-active)]'
              } rounded-[10px]`}
            >
              {t.nav.faq}
            </button>
            <a
              href="https://ornata.userjot.com/?cursor=1&order=top&limit=10&status=%5B%22PENDING%22%2C%22REVIEW%22%2C%22PLANNED%22%2C%22PROGRESS%22%5D"
              target="_blank"
              rel="noreferrer"
              className="text-sm font-medium hover:text-[var(--menu-icon-active)] transition-colors"
              style={{ color: 'var(--text-1)' }}
            >
              {t.nav.feedback}
            </a>
            <a
              href="https://discord.gg/hFkmXtrkWZ"
              target="_blank"
              rel="noreferrer"
              className="text-sm font-medium hover:text-[var(--menu-icon-active)] transition-colors"
              style={{ color: 'var(--text-1)' }}
            >
              {t.nav.discord}
            </a>

          </div>

          <div className="md:hidden flex items-center gap-2">
            <a
              href="https://ornata.userjot.com/?cursor=1&order=top&limit=10&status=%5B%22PENDING%22%2C%22REVIEW%22%2C%22PLANNED%22%2C%22PROGRESS%22%5D"
              target="_blank"
              rel="noreferrer"
              className="text-sm font-medium hover:text-[var(--menu-icon-active)] transition-colors"
              style={{ color: 'var(--text-1)' }}
            >
              {t.nav.feedback}
            </a>
            <a
              href="https://discord.gg/hFkmXtrkWZ"
              target="_blank"
              rel="noreferrer"
              className="text-sm font-medium hover:text-[var(--menu-icon-active)] transition-colors"
              style={{ color: 'var(--text-1)' }}
            >
              {t.nav.discord}
            </a>
          </div>
        </div>
      </nav>

      <header
        id="home"
        className="relative min-h-screen overflow-hidden flex items-center"
      >
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 gap-10 items-center">
            <div className="max-w-4xl">
              <h1 className="js-hero-title text-6xl md:text-8xl lg:text-9xl tracking-tighter font-semibold leading-[0.95] text-[var(--text-0)] mb-8">
                {t.hero.titleLine1} <br />
                {t.hero.titleLine2}
              </h1>
              <p className="js-hero-tagline text-sm md:text-base text-[var(--text-1)] max-w-md">
                {t.hero.tagline}
              </p>
              <div className="js-hero-actions mt-10 flex gap-4 flex-wrap">
                <a
                  href="#download"
                  className="inline-flex items-center justify-center gap-2 transition-colors duration-300 text-sm font-medium tracking-wide bg-[var(--button-bg)] hover:bg-[var(--button-bg-hover)] px-8 py-4 rounded-[10px]"
                  style={{ color: 'var(--button-text)' }}
                >
                  <Download className="w-4 h-4" />
                  {t.hero.primaryCta}
                </a>
                <a
                  href="https://discord.gg/hFkmXtrkWZ"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 transition-colors duration-300 text-sm font-medium tracking-wide bg-[var(--button-bg)] hover:bg-[var(--button-bg-hover)] px-8 py-4 rounded-[10px]"
                  style={{ color: 'var(--button-text)' }}
                >
                  <svg
                    role="img"
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4"
                  >
                    <path
                      fill="currentColor"
                      d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"
                    />
                  </svg>
                  {t.hero.discordCta}
                </a>
              </div>
            </div>
          </div>
        </div>
      </header>

      <section id="features" className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="space-y-20">
            {t.features.items.map((item, idx) => (
              <div
                key={item.title}
                className="js-reveal grid grid-cols-1 md:grid-cols-2 gap-10 items-center"
              >
                <div className={`space-y-4 ${idx % 2 === 1 ? 'md:order-2' : ''}`}>
                  <h3 className="text-2xl font-semibold text-[var(--text-0)] tracking-tight">
                    {item.title}
                  </h3>
                  <p className="text-[var(--text-1)] leading-relaxed">{item.description}</p>
                </div>
                <div
                  className={`rounded-[10px] bg-[var(--surface-1)]/70 aspect-[4/3] p-4 ${
                    idx % 2 === 1 ? 'md:order-1' : ''
                  }`}
                >
                  <img
                    src={`/${item.image}`}
                    alt={item.title}
                    className="h-full w-full object-contain"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="download" className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="js-reveal mb-16">
            <h2 className="text-4xl font-semibold tracking-tighter mt-4">{t.download.title}</h2>
            <p className="text-sm text-[var(--text-1)] mt-4">
              We are actively developing the current release. More builds coming soon. Currently, Ornata has only been tested on macOS with Apple Silicon (M-series chips).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {downloadColumns.map((col) => (
              <div
                key={col.title}
                className={`js-reveal relative p-10 md:p-12 rounded-2xl bg-[var(--surface-1)]/70 ${
                  col.disabled ? 'opacity-70' : ''
                }`}
              >
                <h3 className="text-xl font-semibold tracking-tight mb-6">{col.title}</h3>
                <div className="space-y-3 text-sm">
                  {col.items.map((item, idx) => (
                    <div
                      key={idx}
                      className={`block rounded-[10px] bg-[var(--surface-0)]/70 px-4 py-3 ${
                        col.disabled ? 'text-[var(--text-1)]/70' : 'hover:bg-[var(--surface-0)] transition-colors'
                      }`}
                    >
                      {col.disabled || !item.href ? (
                        <span>{item.label}</span>
                      ) : (
                        <a href={item.href} className="block" target="_blank" rel="noreferrer">
                          {item.label}
                        </a>
                      )}
                    </div>
                  ))}
                </div>
                {col.disabled ? (
                  <div className="absolute inset-0 rounded-2xl bg-[var(--surface-0)]/60" />
                ) : null}
              </div>
            ))}
          </div>

        </div>
      </section>

      <section id="faq" className="py-24">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="js-reveal text-3xl font-semibold tracking-tighter mb-12">{t.faq.title}</h2>

          <div className="space-y-4">
            {t.faq.items.map((item, idx) => (
              <details
                key={idx}
                className="js-reveal group rounded-2xl bg-[var(--surface-1)]/70 cursor-pointer"
              >
                <summary className="flex justify-between items-center p-6 font-medium text-lg hover:bg-[var(--surface-1)] transition-colors rounded-2xl">
                  <span>{item.q}</span>
                  <span className="transform group-open:rotate-180 transition-transform duration-200">
                    <ChevronDown className="w-5 h-5 text-[var(--text-1)]" />
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
          <h2 className="js-reveal text-4xl md:text-6xl font-semibold tracking-tighter mb-8">
            {t.footer.headline}
          </h2>

          <a
            href="#download"
            className="js-reveal inline-flex items-center gap-3 bg-[var(--button-bg)] px-10 py-5 text-lg font-medium hover:bg-[var(--button-bg-hover)] transition-colors duration-300 rounded-[10px]"
            style={{ color: 'var(--button-text)' }}
          >
            {t.footer.cta}
            <Calendar className="w-5 h-5" />
          </a>

          <div className="js-reveal mt-16 pt-6 w-full flex flex-col items-center text-sm text-[var(--text-1)]">
            <p>
              © 2026 Ornata. Made with love by{' '}
              <a
                href="https://x.com/xuyixff"
                target="_blank"
                rel="noreferrer"
                className="hover:text-[var(--text-0)] transition-colors"
              >
                Ornata
              </a>
            </p>
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
