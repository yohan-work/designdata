import React from "react";
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
import "./styles.css";

const modelOptions = [
  "Auto",
  "Composer 2.5",
  "Opus 4.8",
  "GPT-5.5 High Fast",
  "Gemini 3.1 Pro",
  "Grok 4.3",
];

const featureCards = [
  {
    icon: Monitor,
    title: "선호하는 IDE에서 사용하세요",
    description:
      "터미널, 기존 에디터, 원격 환경 어디에서든 같은 Cursor Agent 흐름을 유지합니다.",
  },
  {
    icon: Workflow,
    title: "자동화를 코드처럼 작성하세요",
    description:
      "문서 업데이트, 보안 검토, 릴리즈 준비 같은 반복 작업을 스크립트와 워크플로우로 연결합니다.",
  },
  {
    icon: Lock,
    title: "작업 맥락을 안전하게 유지하세요",
    description:
      "프로젝트 규칙, MCP, 모델 설정을 공유하면서도 명령 실행과 변경 사항을 명확히 확인합니다.",
  },
];

const docs = [
  {
    eyebrow: "설치 가이드",
    title: "Dummy 시작하기",
    description: "설치, 로그인, 에이전트 실행, MCP 통합까지 한 번에 연결합니다.",
  },
  {
    eyebrow: "Headless",
    title: "스크립트에서 실행하기",
    description: "CI, 백엔드 잡, 커스텀 자동화 안에서 Cursor Agent를 실행합니다.",
  },
  {
    eyebrow: "Shell Mode",
    title: "명령 실행 흐름 설계",
    description: "안전 점검과 출력 확인을 포함한 셸 작업 루프를 구성합니다.",
  },
  {
    eyebrow: "GitHub Actions",
    title: "CI/CD에 연결하기",
    description: "PR 검토, 테스트 실패 수정, 릴리즈 작업을 자동화 워크플로우로 확장합니다.",
  },
];

function App() {
  return (
    <main className="page-shell">
      <Nav />
      <Hero />
      <ModelSection />
      <FeatureSection />
      <DocsSection />
      <CtaSection />
    </main>
  );
}

function Nav() {
  return (
    <header className="top-nav">
      <a className="brand" href="#top" aria-label="Design System CLI Demo">
        <span className="brand-mark">C</span>
        <span>Dummy</span>
      </a>
      <nav className="nav-links" aria-label="주요 링크">
        <a href="#models">모델</a>
        <a href="#automation">자동화</a>
        <a href="#docs">문서</a>
      </nav>
      <a className="nav-cta" href="#install">
        CLI 설치
      </a>
    </header>
  );
}

function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero-copy">
        <span className="kicker">CLI</span>
        <h1>
          에이전트와 함께
          <br />
          코드를 배포하세요.
        </h1>
        <p>
          터미널에서 바로 Cursor Agent를 실행하고, IDE 밖의 작업까지 같은
          맥락으로 이어가세요.
        </p>
        <div className="hero-actions" id="install">
          <a className="button primary" href="#docs">
            시작하기
            <ArrowRight size={16} />
          </a>
          <code>curl https://cursor.com/install -fsS | bash</code>
        </div>
      </div>
      <TerminalMockup />
    </section>
  );
}

function TerminalMockup() {
  return (
    <aside className="terminal-card" aria-label="Dummy 터미널 목업">
      <div className="terminal-topbar">
        <div className="traffic-lights" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <span>~/cursor/cursor-web</span>
      </div>
      <div className="terminal-body">
        <div className="prompt-row">
          <Terminal size={15} />
          <span>cursor agent</span>
        </div>
        <div className="agent-card">
          <div>
            <span className="agent-label">Cursor Agent</span>
            <p>이 PR의 실패한 체크를 분석하고 수정안을 제안해줘.</p>
          </div>
          <Bot size={22} />
        </div>
        <div className="timeline">
          <span className="pill thinking">Thinking</span>
          <span className="pill read">Reading</span>
          <span className="pill grep">Grepping</span>
          <span className="pill edit">Editing</span>
          <span className="pill done">Done</span>
        </div>
        <pre>
          <code>{`→ npm test
✓ 38 tests passed
→ git diff -- src/cli-runner.ts
1 file changed, 14 insertions`}</code>
        </pre>
      </div>
    </aside>
  );
}

function ModelSection() {
  return (
    <section className="split-section" id="models">
      <div>
        <span className="kicker">Models</span>
        <h2>항상 최신 모델을 이용하세요</h2>
        <p>
          Anthropic, OpenAI, Gemini, Cursor 등의 프런티어 모델을 같은 CLI
          인터페이스에서 고르고 실행합니다.
        </p>
      </div>
      <div className="model-panel">
        <div className="panel-header">
          <Braces size={18} />
          <span>/model</span>
        </div>
        <div className="model-list">
          {modelOptions.map((model, index) => (
            <button className={index === 0 ? "selected" : ""} key={model}>
              <span>{model}</span>
              {index === 0 ? <Check size={16} /> : <ArrowRight size={15} />}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureSection() {
  return (
    <section className="feature-section" id="automation">
      <div className="section-heading">
        <span className="kicker">Workflows</span>
        <h2>강력한 스크립트와 자동화를 작성하세요</h2>
        <p>
          레퍼런스 페이지의 간결한 메시지 구조를 유지하면서, 디자인 시스템
          토큰이 실제 카드와 CTA에 적용되는 모습을 보여줍니다.
        </p>
      </div>
      <div className="feature-grid">
        {featureCards.map(({ icon: Icon, title, description }) => (
          <article className="feature-card" key={title}>
            <Icon size={22} />
            <h3>{title}</h3>
            <p>{description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function DocsSection() {
  return (
    <section className="docs-section" id="docs">
      <div className="section-heading">
        <span className="kicker">Docs</span>
        <h2>자세히 알아보기</h2>
      </div>
      <div className="docs-grid">
        {docs.map((doc) => (
          <a className="doc-card" href="#install" key={doc.title}>
            <span>{doc.eyebrow}</span>
            <h3>{doc.title}</h3>
            <p>{doc.description}</p>
            <small>
              문서 읽기 <ArrowRight size={13} />
            </small>
          </a>
        ))}
      </div>
    </section>
  );
}

function CtaSection() {
  return (
    <section className="cta-section">
      <div>
        <Play size={22} />
        <h2>Dummy를 사용해 보세요.</h2>
      </div>
      <code>curl https://cursor.com/install -fsS | bash</code>
      <div className="cta-links">
        <a href="#top">위로 이동</a>
        <a href="#docs">
          <FileText size={15} />
          문서 보기
        </a>
        <a href="#automation">
          <GitBranch size={15} />
          Actions 연결
        </a>
      </div>
    </section>
  );
}

createRoot(document.getElementById("root")).render(<App />);
