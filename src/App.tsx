import { useEffect, useMemo, useState } from 'react';
import { Calendar, ChevronDown, Download } from 'lucide-react';

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
        threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.6],
        rootMargin: '-20% 0px -70% 0px',
      }
    );

    for (const el of elements) observer.observe(el);
    return () => observer.disconnect();
  }, [sectionIds]);

  return activeSection;
}

function MainContent() {
  useEffect(() => {
    document.documentElement.dataset.theme = 'dark';
    document.documentElement.lang = 'en';
  }, []);

  const t = {
    nav: {
      features: 'Features',
      download: 'Download',
      faq: 'FAQ',
      discord: 'Discord',
      cta: 'Download App',
    },
    hero: {
      titleLine1: 'Write without',
      titleLine2: 'friction',
      titleAccent: '.',
      tagline:
        'Ornata is a lightweight Markdown editor for technical writing. Fast, focused, and designed to stay out of your way.',
      description:
        'Ornata is a lightweight Markdown editor designed for speed and clarity. From instant startup to smooth editing, it removes friction between thought and text.',
      primaryCta: 'Download App',
      discordCta: 'Discord',
    },
    features: {
      items: [
        {
          title: 'Full Markdown, exactly as expected',
          description: 'Write in standard Markdown without extensions or surprises.Headings, lists, tables, formulas, and code blocks render cleanly —the way plain text should.',
          image: '/img/features1.png',
        },
        {
          title: 'Instant, even with large files',
          description: 'Open and edit large Markdown files without delay.Scrolling, typing, and rendering stay smooth,、no matter how long the document grows.',
          image: '/img/features2.png',
        },
        {
          title: 'Works naturally with Git',
          description: 'Write Markdown as plain text files that fit perfectly into Git workflows.Clean diffs, readable history,and no hidden metadata.',
          image: '/img/features3.png',
        },
        {
          title: 'Edit and preview, side by side',
          description: 'Write in plain Markdown while preview updates instantly.Switch between edit, preview, or split view —always knowing exactly what you’re writing.',
          image: '/img/features4.png',
        },
        {
          title: 'Designed to stay out of your way',
          description: 'No panels you don’t need. No visual noise. Just a quiet space to think and write.',
          image: '/img/features5.png',
        },
      ],
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
      ],
    },
    footer: {
      docs: 'Docs',
      feedback: 'Feedback',
      headline: 'Ready to write with structure?',
      cta: 'Download Ornata',
    },
  };

  const sectionIds = useMemo<SectionId[]>(() => ['home', 'features', 'download', 'faq', 'book'], []);
  const activeSection = useActiveSection(sectionIds);

  const scrollToSection = (sectionId: SectionId) => {
    const element = document.getElementById(sectionId);
    if (!element) return;
    element.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[var(--surface-0)] text-[var(--text-0)] antialiased selection:bg-orange-500 selection:text-white">
      <nav className="fixed top-0 w-full z-50 bg-[var(--surface-0)]/90 backdrop-blur-sm shadow-sm">
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
              href="https://discord.gg/hFkmXtrkWZ"
              target="_blank"
              rel="noreferrer"
              className="text-sm font-medium text-[var(--menu-icon)] hover:text-[var(--menu-icon-active)] transition-colors"
            >
              {t.nav.discord}
            </a>

          </div>

          <div className="md:hidden flex items-center gap-2">
            <a
              href="https://discord.gg/hFkmXtrkWZ"
              target="_blank"
              rel="noreferrer"
              className="text-sm font-medium text-[var(--menu-icon)] hover:text-[var(--menu-icon-active)] transition-colors"
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
              <h1 className="text-6xl md:text-8xl lg:text-9xl tracking-tighter font-semibold leading-[0.95] text-[var(--text-0)] mb-8">
                {t.hero.titleLine1} <br />
                {t.hero.titleLine2}{' '}
                <span className="text-orange-600">{t.hero.titleAccent}</span>
              </h1>
              <p className="text-sm md:text-base text-[var(--text-1)] max-w-md">
                {t.hero.tagline}
              </p>
              <div className="mt-10 flex gap-4 flex-wrap">
                <a
                  href="#download"
                  className="inline-flex items-center justify-center gap-2 hover:bg-orange-600 transition-colors duration-300 text-sm font-medium !text-white hover:!text-white tracking-wide bg-neutral-900 px-8 py-4 rounded-[10px]"
                >
                  <Download className="w-4 h-4" />
                  {t.hero.primaryCta}
                </a>
                <a
                  href="https://discord.gg/hFkmXtrkWZ"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 text-[var(--text-0)] hover:text-white hover:bg-orange-600 transition-colors duration-300 text-sm font-medium tracking-wide px-8 py-4 rounded-[10px]"
                >
                  <svg
                    role="img"
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4"
                  >
                    <path
                      fill="#5865F2"
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
          <div className="space-y-12">
            {t.features.items.map((item, idx) => (
              <div
                key={item.title}
                className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center"
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
                    src={item.image}
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
          <div className="mb-16">
            <h2 className="text-4xl font-semibold tracking-tighter mt-4">{t.download.title}</h2>
            <p className="text-sm text-[var(--text-1)] mt-4">
              We are actively developing the current release. More builds coming soon. Currently, Ornata has only been tested on macOS with Apple Silicon (M-series chips).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
                disabled: true,
                items: [`${t.download.x64} ${t.download.appImage}`, `${t.download.x64} ${t.download.deb}`],
              },
            ].map((col) => (
              <div
                key={col.title}
                className={`relative p-10 md:p-12 rounded-2xl bg-[var(--surface-1)]/70 ${
                  col.disabled ? 'opacity-70' : ''
                }`}
              >
                <h3 className="text-xl font-semibold tracking-tight mb-6">{col.title}</h3>
                <div className="space-y-3 text-sm">
                  {col.items.map((label, idx) => (
                    <div
                      key={idx}
                      className={`block rounded-[10px] bg-[var(--surface-0)]/70 px-4 py-3 ${
                        col.disabled ? 'text-[var(--text-1)]/70' : 'hover:bg-[var(--surface-0)] transition-colors'
                      }`}
                    >
                      {col.disabled ? (
                        <span>{label}</span>
                      ) : (
                        <a href="#" className="block">
                          {label}
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
          <h2 className="text-3xl font-semibold tracking-tighter mb-12">{t.faq.title}</h2>

          <div className="space-y-4">
            {t.faq.items.map((item, idx) => (
              <details
                key={idx}
                className="group rounded-2xl bg-[var(--surface-1)]/70 cursor-pointer"
              >
                <summary className="flex justify-between items-center p-6 font-medium text-lg hover:bg-[var(--surface-1)] transition-colors rounded-2xl">
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
            className="inline-flex items-center gap-3 bg-orange-600 text-white px-10 py-5 text-lg font-medium hover:bg-neutral-900 transition-colors duration-300 rounded-[10px]"
          >
            {t.footer.cta}
            <Calendar className="w-5 h-5" />
          </a>

          <div className="mt-16 pt-6 w-full flex flex-col md:flex-row justify-between items-center text-sm text-[var(--text-1)]">
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
