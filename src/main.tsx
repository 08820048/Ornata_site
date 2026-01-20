import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import './index.css'
import App from './App.tsx'

const getInitialLanguage = () => {
  if (typeof window === 'undefined') return 'zh'
  const saved = localStorage.getItem('language')
  if (saved === 'zh' || saved === 'en') return saved
  const preferred = navigator.language?.toLowerCase() ?? 'en'
  return preferred.startsWith('zh') ? 'zh' : 'en'
}

i18n.use(initReactI18next).init({
  lng: getInitialLanguage(),
  fallbackLng: 'zh',
  interpolation: { escapeValue: false },
  resources: {
    zh: {
      translation: {
        nav: {
          features: '能力',
          download: '下载',
          faq: '常见问题',
          cta: '下载客户端',
        },
        hero: {
          titleLine1: '让写作从',
          titleLine2: '混沌走向',
          titleAccent: '秩序。',
          description:
            '一个简洁而强大的桌面 Markdown 编辑器，专为技术写作打造。公式、代码、图表、表格——组织成可读、可复用、可发布的文档。',
          primaryCta: '下载客户端',
        },
        problem: {
          eyebrow: '写作的断层',
          title: '你在记录。\n但你没有系统。',
          description:
            '碎片化的笔记、公式、代码与图表，缺少结构就会变成散落的拼图。Ornata 帮你把这些碎片连接起来，让每一篇文档都有明确的脉络与表达。',
          highlight: '写得更少混乱，交付更多清晰。',
        },
        features: {
          title: '能力',
          subtitle: '面向技术写作工作流：更快、更一致、更专注。',
          items: [
            {
              title: '实时预览',
              description: '编辑时同步渲染，减少来回切换，确保格式与含义一致。',
            },
            {
              title: '数学公式（LaTeX）',
              description: '完整支持行内/块级公式，满足学术与工程文档需求。',
            },
            {
              title: '代码高亮',
              description: '清晰可读的代码块语法高亮，适配常见编程语言。',
            },
            {
              title: 'Mermaid 图表',
              description: '在 Markdown 中写流程图/时序图等，并直接渲染预览。',
            },
            {
              title: '表格',
              description: '支持对齐与清爽展示，适合规范说明与对比表。',
            },
            {
              title: '键盘优先',
              description: '丰富快捷键，让双手留在键盘，注意力留在内容。',
            },
          ],
        },
        proof: {
          title: '为技术写作者打造。',
          subtitle: '离线优先、跨平台、开放迭代。',
          metrics: [
            { value: '6', label: '核心能力' },
            { value: '3', label: '桌面平台' },
            { value: '2', label: '界面语言' },
          ],
          tiles: ['Markdown', 'LaTeX', 'Mermaid', '代码', '表格', '快捷键'],
        },
        collaboration: {
          eyebrow: '使用方式',
          title: '按你的工作流选择。',
          options: [
            {
              title: '下载使用',
              badge: '桌面客户端',
              description: '安装即可开始写作，专注、快速，内容保留在本地。',
              bullets: ['离线优先', '渲染一致', '专注写作'],
            },
            {
              title: '提交反馈',
              badge: '反馈',
              description: '提交需求与问题，我们会持续迭代，把体验打磨得更好。',
              bullets: ['需求建议', '问题反馈', '使用体验'],
            },
          ],
        },
        download: {
          title: '下载客户端',
          subtitle: '支持 macOS、Windows 和 Linux',
          macOS: 'macOS',
          windows: 'Windows',
          linux: 'Linux',
          appleSilicon: 'Apple Silicon',
          intel: 'Intel',
          x64: 'x64',
          arm64: 'ARM64',
          appImage: '.AppImage',
          deb: '.deb',
          comingSoon: '当前版本正在积极开发中，更多安装包与发布节奏即将推出',
        },
        philosophy: {
          title: '写作就是',
          accent: '结构化思考。',
          description:
            '好的编辑器应该减少摩擦。不是写更多，而是让内容随着增长依然清晰、可读、可维护。',
        },
        faq: {
          title: '常见问题',
          items: [
            {
              q: 'Ornata 是在线服务吗？',
              a: '不是。Ornata 是桌面应用，尽可能让你的写作保持本地与流畅。',
            },
            {
              q: '适合技术文档吗？',
              a: '适合：公式、代码高亮、图表、表格等都是核心能力。',
            },
            {
              q: '可以配合 Git 使用吗？',
              a: '可以。文档以 Markdown 保存，天然适合版本管理与协作。',
            },
          ],
        },
        footer: {
          docs: '文档',
          feedback: '问题反馈',
          headline: '准备好开始结构化写作了吗？',
          cta: '下载 Ornata',
        },
        theme: {
          toLight: '切换为浅色模式',
          toDark: '切换为深色模式',
        },
        language: {
          toEnglish: '切换到英文',
          toChinese: '切换到中文',
        },
      },
    },
    en: {
      translation: {
        nav: {
          features: 'Features',
          download: 'Download',
          faq: 'FAQ',
          cta: 'Download App',
        },
        hero: {
          titleLine1: 'Turn writing from',
          titleLine2: 'chaos to',
          titleAccent: 'order.',
          description:
            'A clean yet powerful desktop Markdown editor built for technical writing. Formulas, code, diagrams, tables—organized into readable, reusable, publishable documents.',
          primaryCta: 'Download App',
        },
        problem: {
          eyebrow: 'The Writing Gap',
          title: 'You are recording.\nBut you have no system.',
          description:
            'Fragmented notes, formulas, code, and diagrams become scattered pieces without structure. Ornata connects those fragments so every document has a clear flow and intent.',
          highlight: 'Less chaos, more clarity.',
        },
        features: {
          title: 'Capabilities',
          subtitle: 'Built for technical writing workflows: faster, consistent, focused.',
          items: [
            {
              title: 'Live Preview',
              description: 'Render as you type to keep format and meaning aligned.',
            },
            {
              title: 'Math (LaTeX)',
              description: 'Full support for inline and block equations for academic needs.',
            },
            {
              title: 'Code Highlighting',
              description: 'Readable syntax highlighting for common programming languages.',
            },
            {
              title: 'Mermaid Diagrams',
              description: 'Write diagrams in Markdown and render them instantly.',
            },
            {
              title: 'Tables',
              description: 'Aligned, clean tables for specs and comparisons.',
            },
            {
              title: 'Keyboard First',
              description: 'Rich shortcuts keep your hands on the keyboard.',
            },
          ],
        },
        proof: {
          title: 'Made for technical writers.',
          subtitle: 'Offline-first, cross-platform, open iteration.',
          metrics: [
            { value: '6', label: 'Core capabilities' },
            { value: '3', label: 'Desktop platforms' },
            { value: '2', label: 'UI languages' },
          ],
          tiles: ['Markdown', 'LaTeX', 'Mermaid', 'Code', 'Tables', 'Shortcuts'],
        },
        collaboration: {
          eyebrow: 'Usage',
          title: 'Pick the workflow that fits you.',
          options: [
            {
              title: 'Download & Use',
              badge: 'Desktop App',
              description: 'Install and start writing fast. Content stays local.',
              bullets: ['Offline-first', 'Consistent rendering', 'Focused writing'],
            },
            {
              title: 'Send Feedback',
              badge: 'Feedback',
              description: 'Share ideas and issues. We keep refining the experience.',
              bullets: ['Feature requests', 'Issue reports', 'User feedback'],
            },
          ],
        },
        download: {
          title: 'Download',
          subtitle: 'Available for macOS, Windows, and Linux',
          macOS: 'macOS',
          windows: 'Windows',
          linux: 'Linux',
          appleSilicon: 'Apple Silicon',
          intel: 'Intel',
          x64: 'x64',
          arm64: 'ARM64',
          appImage: '.AppImage',
          deb: '.deb',
          comingSoon: 'We are actively developing the current release. More builds coming soon.',
        },
        philosophy: {
          title: 'Writing is',
          accent: 'structured thinking.',
          description:
            'A good editor reduces friction. Not writing more, but keeping growth clear, readable, and maintainable.',
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
        theme: {
          toLight: 'Switch to light mode',
          toDark: 'Switch to dark mode',
        },
        language: {
          toEnglish: 'Switch to English',
          toChinese: '切换到中文',
        },
      },
    },
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
