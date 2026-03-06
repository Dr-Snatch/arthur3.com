import { useState, useEffect, useRef } from "react";

const BOOT_SEQUENCE = [
  { text: "arthur3.com v1.0.0", delay: 0, color: "#6366f1" },
  { text: "initialising environment...", delay: 300, color: "#475569" },
  { text: "loading profile: arthur", delay: 600, color: "#475569" },
  { text: 'type "help" to see available commands', delay: 900, color: "#475569" },
];

const COMMANDS = {
  help: {
    output: [
      { text: "┌─────────────────────────────────────────┐" },
      { text: "│  AVAILABLE COMMANDS                     │" },
      { text: "├─────────────────────────────────────────┤" },
      { text: "│  about       — who am I                 │" },
      { text: "│  projects    — things I've built        │" },
      { text: "│  skills      — my tech stack            │" },
      { text: "│  contact     — get in touch             │" },
      { text: "│  cd /path    — change directory         │" },
      { text: "│  open        — go to current directory  │" },
      { text: "│  ls          — list site sections       │" },
      { text: "│  whoami      — current user             │" },
      { text: "│  clear       — clear terminal           │" },
      { text: "│  sudo        — try it                   │" },
      { text: "└─────────────────────────────────────────┘" },
    ],
  },
  about: {
    output: [
      { text: "arthur@arthur3.com", color: "#6366f1" },
      { text: "──────────────────" },
      { text: "AI undergraduate @ Northumbria University" },
      { text: "Building at the intersection of AI, security," },
      { text: "and software engineering." },
      { text: "" },
      { text: "Currently shipping:" },
      { text: "  → BeatMap  — iOS music tagging app (SwiftUI)" },
      { text: "  → RPtext   — text-based RPG with AI NPCs" },
      { text: "" },
      { text: "When I'm not in lectures, I'm in the terminal." },
    ],
  },
  projects: {
    output: [
      { text: "PROJECTS", color: "#6366f1" },
      { text: "────────" },
      { text: "BeatMap  [iOS]" },
      { text: "  Music tagging via ShazamKit + Spotify OAuth." },
      { text: "  Core Data, AirDrop sharing, v1.1.0 shipped." },
      { text: "  → /projects/beatmap", color: "#475569" },
      { text: "" },
      { text: "RPtext  [macOS / CLI]" },
      { text: "  Text RPG engine with AI-powered NPC memory," },
      { text: "  faction standings, combat + inventory system." },
      { text: "  → /projects/rptext", color: "#475569" },
      { text: "" },
      { text: "run 'cd /projects' to see everything", color: "#475569" },
    ],
  },
  skills: {
    output: [
      { text: "TECH STACK", color: "#6366f1" },
      { text: "──────────" },
      { text: "Languages   Swift · Python · TypeScript · JS" },
      { text: "Mobile      SwiftUI · Core Data · ShazamKit" },
      { text: "AI          Claude API · Ollama · LLM tooling" },
      { text: "Web         Astro · React · Cloudflare Pages" },
      { text: "Tools       Git · Docker · Linux · Vim" },
      { text: "" },
      { text: "Currently exploring:" },
      { text: "  structured AI output · app security · agents" },
    ],
  },
  contact: {
    output: [
      { text: "CONTACT", color: "#6366f1" },
      { text: "───────" },
      { text: "GitHub    github.com/Dr-Snatch" },
      { text: "Email     hello@arthur3.com" },
      { text: "Site      arthur3.com" },
      { text: "" },
      { text: "I'm generally available. Say hi." },
    ],
  },
  whoami: {
    output: [{ text: "arthur — AI student, builder, terminal enjoyer." }],
  },
  ls: {
    output: [
      { text: "/" },
      { text: "/projects" },
      { text: "/swift" },
      { text: "/blog" },
      { text: "/lab" },
      { text: "README.md" },
    ],
  },
  sudo: {
    output: [
      { text: "sudo: permission denied.", color: "#f87171" },
      { text: "nice try." },
    ],
  },
  uname: {
    output: [{ text: "arthur3-os 1.0.0 #1 SMP x86_64 GNU/Linux" }],
  },
  pwd: {
    output: [{ text: "/home/arthur" }],
  },
  exit: {
    output: [{ text: "there's no escape." }],
  },
  rm: {
    output: [{ text: "rm: refusing to delete yourself." }],
  },
  hack: {
    output: [
      { text: "initiating hack sequence..." },
      { text: "▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ 100%", color: "#4ade80" },
      { text: "just kidding. this is a portfolio." },
    ],
  },
  coffee: {
    output: [
      { text: "     ( (" },
      { text: "      ) )" },
      { text: "   .____." },
      { text: "   |    |" },
      { text: "   '----'" },
      { text: "" },
      { text: "coffee.exe running in background." },
    ],
  },
};

const CD_ROUTES = {
  "/": "/",
  "/projects": "/projects",
  "/swift": "/swift",
  "/blog": "/blog",
  "/lab": "/lab",
  projects: "/projects",
  swift: "/swift",
  blog: "/blog",
  lab: "/lab",
};

// state: "normal" | "minimized" | "maximized" | "closed"
export default function Terminal() {
  const [lines, setLines] = useState([]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [booted, setBooted] = useState(false);
  const [cwd, setCwd] = useState("~");
  const [windowState, setWindowState] = useState("normal");
  const inputRef = useRef(null);
  const bottomRef = useRef(null);
  const bodyRef = useRef(null);

  useEffect(() => {
    const timers = BOOT_SEQUENCE.map(({ text, delay, color }) =>
      setTimeout(() => {
        setLines((prev) => [...prev, { text, color }]);
      }, delay)
    );
    const bootTimer = setTimeout(() => setBooted(true), 1100);
    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(bootTimer);
    };
  }, []);

  useEffect(() => {
    if (windowState === "normal" || windowState === "maximized") {
      if (bodyRef.current) {
        bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
      }
    }
  }, [lines, windowState]);

  useEffect(() => {
    if (windowState === "normal" || windowState === "maximized") {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [windowState]);

  const handleCommand = (raw) => {
    const trimmed = raw.trim();
    const cmd = trimmed.toLowerCase();
    const parts = cmd.split(" ");
    const base = parts[0];

    setLines((prev) => [
      ...prev,
      { text: `user@arthur3 ${cwd} % ${raw}`, color: "#a78bfa" },
    ]);

    if (!trimmed) return;

    setHistory((prev) => [raw, ...prev]);
    setHistoryIndex(-1);

    if (base === "clear") {
      setLines([]);
      return;
    }

    if (base === "cd") {
      const path = parts[1] || "~";
      const normalised = path.startsWith("/") ? path : `/${path}`;
      const route = CD_ROUTES[path];
      if (route) {
        const dir = route === "/" ? "~" : route;
        setCwd(dir);
        setLines((prev) => [
          ...prev,
          { text: `${dir}`, color: "#34d399" },
        ]);
      } else {
        setLines((prev) => [
          ...prev,
          { text: `cd: ${path}: no such directory`, color: "#f87171" },
        ]);
      }
      return;
    }

    if (base === "open") {
      const route = CD_ROUTES[cwd] || CD_ROUTES[parts[1]];
      if (route && route !== "/") {
        setLines((prev) => [
          ...prev,
          { text: `opening ${route}...`, color: "#34d399" },
        ]);
        setTimeout(() => { window.location.href = route; }, 600);
      } else {
        setLines((prev) => [
          ...prev,
          { text: `open: nothing to open`, color: "#f87171" },
        ]);
      }
      return;
    }

    const command = COMMANDS[base];
    if (command) {
      setLines((prev) => [...prev, ...command.output]);
    } else {
      setLines((prev) => [
        ...prev,
        { text: `command not found: ${base}`, color: "#f87171" },
        { text: `type "help" for available commands`, color: "#475569" },
      ]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleCommand(input);
      setInput("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const next = Math.min(historyIndex + 1, history.length - 1);
      setHistoryIndex(next);
      setInput(history[next] || "");
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = Math.max(historyIndex - 1, -1);
      setHistoryIndex(next);
      setInput(next === -1 ? "" : history[next]);
    } else if (e.key === "l" && e.ctrlKey) {
      e.preventDefault();
      setLines([]);
    }
  };

  const isMaximized = windowState === "maximized";
  const isMinimized = windowState === "minimized";
  const isClosed = windowState === "closed";

  return (
    <>
      <style>{`
        /* ── Minimised tab ── */
        .term-tab {
          position: fixed;
          bottom: 0;
          right: 32px;
          z-index: 9999;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 18px 8px 14px;
          background: #111118;
          border: 1px solid #1e1e2e;
          border-bottom: none;
          border-radius: 8px 8px 0 0;
          cursor: pointer;
          transition: background 0.15s ease;
          box-shadow: 0 -4px 20px rgba(99,102,241,0.08);
          user-select: none;
        }
        .term-tab:hover { background: #16161f; }
        .term-tab-dot {
          width: 7px; height: 7px; border-radius: 50%;
          background: #6366f1;
          box-shadow: 0 0 6px rgba(99,102,241,0.7);
          animation: tabpulse 2s ease-in-out infinite;
        }
        @keyframes tabpulse {
          0%,100% { opacity: 1; } 50% { opacity: 0.35; }
        }
        .term-tab-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          color: #64748b;
          letter-spacing: 0.05em;
        }
        .term-tab-open {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          color: #334155;
        }

        /* ── Maximised overlay ── */
        .term-overlay {
          position: fixed;
          inset: 0;
          z-index: 9998;
          background: rgba(0,0,0,0.6);
          backdrop-filter: blur(2px);
        }

        /* ── Window ── */
        .term-window {
          background: #0f0f0f;
          border: 1px solid #1e1e2e;
          border-radius: 12px;
          overflow: hidden;
          box-shadow:
            0 0 0 1px rgba(99,102,241,0.08),
            0 25px 60px rgba(0,0,0,0.6),
            0 0 80px rgba(99,102,241,0.05);
          width: 100%;
          display: flex;
          flex-direction: column;
          transition: box-shadow 0.2s ease;
        }
        .term-window.maximized {
          position: fixed;
          inset: 40px;
          z-index: 9999;
          border-radius: 14px;
          width: auto;
          box-shadow:
            0 0 0 1px rgba(99,102,241,0.15),
            0 40px 100px rgba(0,0,0,0.9),
            0 0 120px rgba(99,102,241,0.1);
        }

        /* ── Titlebar ── */
        .term-titlebar {
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 11px 16px;
          background: #111118;
          border-bottom: 1px solid #1a1a2e;
          position: relative;
          flex-shrink: 0;
          user-select: none;
        }
        .term-btn {
          width: 12px; height: 12px; border-radius: 50%;
          flex-shrink: 0;
          border: none;
          cursor: pointer;
          padding: 0;
          position: relative;
          transition: filter 0.15s ease;
        }
        .term-btn:hover { filter: brightness(1.25); }
        .term-btn::after {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 50%;
          opacity: 0;
          transition: opacity 0.15s;
        }
        .term-btn-close { background: #ff5f57; }
        .term-btn-min   { background: #febc2e; }
        .term-btn-max   { background: #28c840; }
        .term-btn-group { display: flex; gap: 7px; align-items: center; }

        .term-titlebar-label {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          color: #334155;
          letter-spacing: 0.05em;
          pointer-events: none;
          white-space: nowrap;
        }

        /* ── Body ── */
        .term-body {
          padding: 18px 20px 4px;
          height: 320px;
          overflow-y: auto;
          scrollbar-width: thin;
          scrollbar-color: #1e293b transparent;
          flex-shrink: 0;
        }
        .term-window.maximized .term-body {
          flex: 1;
          height: auto;
        }
        .term-body::-webkit-scrollbar { width: 4px; }
        .term-body::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 2px; }

        .term-line {
          font-family: 'JetBrains Mono', monospace;
          font-size: 12.5px;
          line-height: 1.65;
          white-space: pre;
        }
        .term-window.maximized .term-line {
          font-size: 14px;
        }

        /* ── Input row ── */
        .term-input-row {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px 14px;
          border-top: 1px solid #111;
          flex-shrink: 0;
        }
        .term-prompt {
          font-family: 'JetBrains Mono', monospace;
          font-size: 12.5px;
          color: #6366f1;
          white-space: nowrap;
          user-select: none;
          flex-shrink: 0;
        }
        .term-window.maximized .term-prompt { font-size: 14px; }
        .term-input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          font-family: 'JetBrains Mono', monospace;
          font-size: 12.5px;
          color: #e2e8f0;
          caret-color: #6366f1;
          min-width: 0;
        }
        .term-window.maximized .term-input { font-size: 14px; }


      `}</style>

      {/* Minimised tab */}
      {isMinimized && (
        <button
          className="term-tab"
          onClick={() => setWindowState("normal")}
          aria-label="Restore terminal"
        >
          <span className="term-tab-dot" />
          <span className="term-tab-label">user@arthur3 {cwd}</span>
          <span className="term-tab-open">↑</span>
        </button>
      )}

      {/* Overlay behind maximised window */}
      {isMaximized && (
        <div
          className="term-overlay"
          onClick={() => setWindowState("normal")}
        />
      )}

      {/* Main window — hidden when closed or minimised */}
      {!isClosed && !isMinimized && (
        <>
          <div
            className={`term-window${isMaximized ? " maximized" : ""}`}
            onClick={() => inputRef.current?.focus()}
          >
            {/* Titlebar */}
            <div className="term-titlebar">
              <div className="term-btn-group">
                <button
                  className="term-btn term-btn-close"
                  onClick={(e) => { e.stopPropagation(); setWindowState("closed"); }}
                  title="Close"
                  aria-label="Close terminal"
                />
                <button
                  className="term-btn term-btn-min"
                  onClick={(e) => { e.stopPropagation(); setWindowState("minimized"); }}
                  title="Minimise"
                  aria-label="Minimise terminal"
                />
                <button
                  className="term-btn term-btn-max"
                  onClick={(e) => {
                    e.stopPropagation();
                    setWindowState((s) => s === "maximized" ? "normal" : "maximized");
                  }}
                  title={isMaximized ? "Restore" : "Maximise"}
                  aria-label={isMaximized ? "Restore terminal" : "Maximise terminal"}
                />
              </div>
              <span className="term-titlebar-label">user@arthur3 {cwd} — zsh</span>
            </div>

            {/* Output */}
            <div className="term-body" ref={bodyRef}>
              {lines.map((line, i) => (
                <div
                  key={i}
                  className="term-line"
                  style={{ color: line.color || "#94a3b8" }}
                >
                  {line.text}
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="term-input-row">
              <span className="term-prompt">user@arthur3 {cwd} %</span>
              <input
                ref={inputRef}
                className="term-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                autoFocus
                spellCheck={false}
                autoComplete="off"
                autoCapitalize="off"
                disabled={!booted}
              />
            </div>
          </div>

    
        </>
      )}

      {/* Re-open button if closed */}
      {isClosed && (
        <button
          className="term-tab"
          onClick={() => setWindowState("normal")}
          aria-label="Open terminal"
        >
          <span className="term-tab-dot" />
          <span className="term-tab-label">terminal</span>
          <span className="term-tab-open">↑</span>
        </button>
      )}
    </>
  );
}
