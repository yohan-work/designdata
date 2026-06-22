import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowRight,
  Bot,
  Braces,
  Check,
  FileText,
  GitBranch,
  Lock,
  Monitor,
  Play,
  Terminal,
  Workflow,
} from "lucide-react";
import {
  createThemeVars,
  defaultDesignSystem,
  designSystemOptions,
  getSystemStats,
  loadDesignSystem,
} from "./designSystems";
import "./styles.css";

const paletteTokens = [
  ["Primary", "var(--primary)"],
  ["Ink", "var(--ink)"],
  ["Canvas", "var(--page-bg)"],
  ["Soft", "var(--page-bg-soft)"],
  ["Card", "var(--card-bg)"],
  ["Code", "var(--code-bg)"],
];

const componentCards = [
  {
    icon: Monitor,
    title: "Hero Surface",
    description: "hero-band, canvas, display typography가 가장 크게 드러나는 영역입니다.",
  },
  {
    icon: Workflow,
    title: "Card System",
    description: "feature-card, rounded, spacing, hairline 값에 따라 밀도와 분위기가 달라집니다.",
  },
  {
    icon: Lock,
    title: "Controls",
    description: "button, input, select, badge가 같은 토큰을 공유하는지 확인합니다.",
  },
];

const docs = [
  {
    eyebrow: "Layout",
    title: "배경과 섹션 리듬",
    description: "canvas, canvas-soft, hero-band 토큰이 페이지 전체의 첫인상을 만듭니다.",
  },
  {
    eyebrow: "Components",
    title: "버튼과 카드 문법",
    description: "components 섹션의 button-primary, card, input 토큰을 실제 UI에 연결합니다.",
  },
  {
    eyebrow: "Typography",
    title: "헤드라인과 본문 대비",
    description: "display, body, code 스타일이 브랜드별로 어떻게 달라지는지 보여줍니다.",
  },
  {
    eyebrow: "Tokens",
    title: "실시간 CSS 변수",
    description: "select 변경 시 DESIGN.md에서 파싱한 값이 CSS 변수로 다시 주입됩니다.",
  },
];

function App() {
  const defaultSlug = designSystemOptions.some((system) => system.slug === "airbnb")
    ? "airbnb"
    : designSystemOptions[0]?.slug;
  const [selectedSlug, setSelectedSlug] = useState(defaultSlug);
  const [selectedSystem, setSelectedSystem] = useState(defaultDesignSystem);
  const themeVars = useMemo(() => createThemeVars(selectedSystem), [selectedSystem]);

  useEffect(() => {
    let isCurrent = true;

    loadDesignSystem(selectedSlug).then((system) => {
      if (isCurrent) {
        setSelectedSystem(system);
      }
    });

    return () => {
      isCurrent = false;
    };
  }, [selectedSlug]);

  return (
    <main className="page-shell" style={themeVars}>
      <Nav
        selectedSlug={selectedSlug}
        selectedSystem={selectedSystem}
        onThemeChange={setSelectedSlug}
      />
      <Hero selectedSystem={selectedSystem} />
      <ThemeSummary selectedSystem={selectedSystem} />
      <PaletteSection />
      <ComponentLab />
      <TypographySection />
      <DocsSection />
      <CtaSection selectedSystem={selectedSystem} />
    </main>
  );
}

function Nav({ selectedSlug, selectedSystem, onThemeChange }) {
  return (
    <header className="top-nav">
      <a className="brand" href="#top" aria-label="Design System Showcase">
        <span className="brand-mark">{selectedSystem.label.charAt(0)}</span>
        <span>{selectedSystem.label}</span>
      </a>
      <nav className="nav-links" aria-label="주요 링크">
        <a href="#palette">팔레트</a>
        <a href="#components">컴포넌트</a>
        <a href="#type">타입</a>
      </nav>
      <label className="theme-picker">
        <span>Design system</span>
        <select value={selectedSlug} onChange={(event) => onThemeChange(event.target.value)}>
          {designSystemOptions.map((system) => (
            <option key={system.slug} value={system.slug}>
              {system.label}
            </option>
          ))}
        </select>
      </label>
    </header>
  );
}

function Hero({ selectedSystem }) {
  return (
    <section className="hero showcase-hero" id="top">
      <div className="hero-copy">
        <span className="kicker">Live Theme Preview</span>
        <h1>
          Page data
        </h1>
        <p>
          현재 선택된 <strong>{selectedSystem.label}</strong> 디자인 시스템의 색상,
          타이포그래피, 카드, 버튼, 입력 폼, 코드 패널 토큰을 한 페이지에서 크게
          비교합니다.
        </p>
        <div className="hero-actions">
          <a className="button primary" href="#components">
            컴포넌트 확인
            <ArrowRight size={16} />
          </a>
          <a className="button secondary" href="#palette">
            팔레트 보기
          </a>
        </div>
      </div>
      <ShowcaseBoard selectedSystem={selectedSystem} />
    </section>
  );
}

function ShowcaseBoard({ selectedSystem }) {
  return (
    <aside className="showcase-board" aria-label="디자인 시스템 미리보기 보드">
      <div className="board-hero">
        <span>{selectedSystem.label}</span>
        <h2>Brand Surface</h2>
        <p>배경, headline, CTA가 선택한 디자인 시스템 토큰으로 다시 그려집니다.</p>
      </div>
      <div className="board-grid">
        <div className="mini-card accent-card">
          <Bot size={22} />
          <strong>Primary Action</strong>
          <button>Start</button>
        </div>
        <div className="mini-card code-card">
          <Terminal size={18} />
          <code>theme.apply("{selectedSystem.slug}")</code>
        </div>
        <div className="mini-card form-card">
          <label>
            Preview field
            <input placeholder="Token driven input" />
          </label>
          <span className="pill done">Active</span>
        </div>
      </div>
    </aside>
  );
}

function ThemeSummary({ selectedSystem }) {
  const stats = getSystemStats(selectedSystem);

  return (
    <section className="theme-summary" aria-label="선택한 디자인 시스템 요약">
      <div>
        <span className="kicker">Applied Theme</span>
        <h2>{selectedSystem.label} design system</h2>
        <p>{selectedSystem.description}</p>
      </div>
      <div className="token-stats">
        <span>
          <strong>{stats.colors}</strong>
          colors
        </span>
        <span>
          <strong>{stats.typeStyles}</strong>
          type styles
        </span>
        <span>
          <strong>{stats.components}</strong>
          components
        </span>
      </div>
    </section>
  );
}

function PaletteSection() {
  return (
    <section className="palette-section" id="palette">
      <div className="section-heading">
        <span className="kicker">Color System</span>
        <h2>배경부터 코드 블록까지 색이 달라집니다</h2>
        <p>
          단순 버튼 색상만 바꾸는 것이 아니라, canvas, card, code, ink 계열을
          나눠서 페이지의 전체 톤이 달라지도록 구성했습니다.
        </p>
      </div>
      <div className="palette-grid">
        {paletteTokens.map(([label, value]) => (
          <article className="swatch-card" key={label}>
            <div className="swatch" style={{ background: value }} />
            <span>{label}</span>
            <code>{value}</code>
          </article>
        ))}
      </div>
    </section>
  );
}

function ComponentLab() {
  return (
    <section className="component-lab" id="components">
      <div className="section-heading">
        <span className="kicker">Component Lab</span>
        <h2>눈에 띄는 UI 요소로 토큰을 확인하세요</h2>
      </div>
      <div className="lab-grid">
        <div className="control-panel">
          <div className="panel-header">
            <Braces size={18} />
            <span>button / input / badge</span>
          </div>
          <div className="button-row">
            <button className="button primary">Primary CTA</button>
            <button className="button secondary">Secondary</button>
          </div>
          <label className="field-row">
            Campaign name
            <input placeholder="Design system showcase" />
          </label>
          <label className="field-row">
            Density
            <select defaultValue="balanced">
              <option value="balanced">Balanced</option>
              <option value="compact">Compact</option>
              <option value="expressive">Expressive</option>
            </select>
          </label>
          <div className="timeline">
            <span className="pill thinking">Thinking</span>
            <span className="pill read">Reading</span>
            <span className="pill grep">Grepping</span>
            <span className="pill edit">Editing</span>
            <span className="pill done">Done</span>
          </div>
        </div>
        <div className="product-wall">
          {componentCards.map(({ icon: Icon, title, description }) => (
            <article className="feature-card" key={title}>
              <Icon size={22} />
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function TypographySection() {
  return (
    <section className="typography-section" id="type">
      <div className="type-specimen">
        <span className="kicker">Typography</span>
        <h2>Aa 가나다 123</h2>
        <p>
          Display token은 헤드라인 크기, 굵기, 자간에 연결되어 있습니다. 브랜드별
          타이포그래피 밀도 차이가 가장 빠르게 드러나는 영역입니다.
        </p>
      </div>
      <div className="terminal-card specimen-code" aria-label="토큰 코드 미리보기">
        <div className="terminal-topbar">
          <Terminal size={15} />
          <span>theme-tokens.css</span>
        </div>
        <pre>
          <code>{`:root {
  --hero-bg: var(--component-hero);
  --card-radius: var(--component-card);
  --font-sans: var(--typography-display);
  --button-primary-bg: var(--colors-primary);
}`}</code>
        </pre>
      </div>
    </section>
  );
}

function DocsSection() {
  return (
    <section className="docs-section" id="docs">
      <div className="section-heading">
        <span className="kicker">What Changes</span>
        <h2>select 변경 시 확인할 포인트</h2>
      </div>
      <div className="docs-grid">
        {docs.map((doc) => (
          <a className="doc-card" href="#top" key={doc.title}>
            <span>{doc.eyebrow}</span>
            <h3>{doc.title}</h3>
            <p>{doc.description}</p>
            <small>
              다시 비교하기 <ArrowRight size={13} />
            </small>
          </a>
        ))}
      </div>
    </section>
  );
}

function CtaSection({ selectedSystem }) {
  return (
    <section className="cta-section">
      <div>
        <Play size={22} />
        <h2>{selectedSystem.label} 테마가 적용된 상태입니다.</h2>
      </div>
      <code>design-md/{selectedSystem.slug}/DESIGN.md</code>
      <div className="cta-links">
        <a href="#top">위로 이동</a>
        <a href="#palette">
          <FileText size={15} />
          팔레트
        </a>
        <a href="#components">
          <GitBranch size={15} />
          컴포넌트
        </a>
      </div>
    </section>
  );
}

createRoot(document.getElementById("root")).render(<App />);
