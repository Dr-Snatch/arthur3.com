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
      { text: "│  cd /path    — navigate the site        │" },
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
      { text: "/            home" },
      { text: "/projects    things I've built" },
      { text: "/swift       iOS & macOS development" },
      { text: "/blog        writing" },
      { text: "/lab         experiments" },
      { text: "README.md    you're looking at it" },
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
  date: {
    output: [{ text: new Date().toString() }],
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

export default function Terminal() {
  const [lines, setLines] = useState([]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [booted, setBooted] = useState(false);
  const inputRef = useRef(null);
  const bottomRef = useRef(null);

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
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines]);

  const handleCommand = (raw) => {
    const trimmed = raw.trim();
    const cmd = trimmed.toLowerCase();
    const parts = cmd.split(" ");
    const base = parts[0];

    setLines((prev) => [
      ...prev,
      { text: `user@arthur3 ~ % ${raw}`, color: "#a78bfa" },
    ]);

    if (!trimmed) return;

    setHistory((prev) => [raw, ...prev]);
    setHistoryIndex(-1);

    if (base === "clear") {
      setLines([]);
      return;
    }

    if (base === "cd") {
      const path = parts[1] || "/";
      const route = CD_ROUTES[path];
      if (route) {
        setLines((prev) => [
          ...prev,
          { text: `navigating to ${route}...`, color: "#34d399" },
          { text: "redirecting...", color: "#475569" },
        ]);
        setTimeout(() => {
          window.location.href = route;
        }, 800);
        return;
      } else {
        setLines((prev) => [
          ...prev,
          { text: `cd: ${path}: no such directory`, color: "#f87171" },
        ]);
        return;
      }
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

  return (
    <>
      <style>{`
        .term-window {
          background: #0f0f0f;
          border: 1px solid #1e1e2e;
          border-radius: 12px;
          overflow: hidden;
          box-shadow:
            0 0 0 1px rgba(99,102,241,0.08),
            0 25px 60px rgba(0,0,0,0.6),
            0 0 80px rgba(99,102,241,0.05);
          cursor: text;
          width: 100%;
        }
        .term-titlebar {
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 11px 16px;
          background: #111118;
          border-bottom: 1px solid #1a1a2e;
          position: relative;
        }
        .term-dot { width: 12px; height: 12px; border-radius: 50%; flex-shrink: 0; }
        .term-titlebar-label {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          color: #334155;
          letter-spacing: 0.05em;
          pointer-events: none;
        }
        .term-body {
          padding: 18px 20px 4px;
          height: 320px;
          overflow-y: auto;
          scrollbar-width: thin;
          scrollbar-color: #1e293b transparent;
        }
        .term-body::-webkit-scrollbar { width: 4px; }
        .term-body::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 2px; }
        .term-line {
          font-family: 'JetBrains Mono', monospace;
          font-size: 12.5px;
          line-height: 1.65;
          white-space: pre;
        }
        .term-input-row {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px 14px;
          border-top: 1px solid #111;
        }
        .term-prompt {
          font-family: 'JetBrains Mono', monospace;
          font-size: 12.5px;
          color: #6366f1;
          white-space: nowrap;
          user-select: none;
          flex-shrink: 0;
        }
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
      `}</style>

      <div className="term-window" onClick={() => inputRef.current?.focus()}>
        <div className="term-titlebar">
          <div className="term-dot" style={{ background: "#ff5f57" }} />
          <div className="term-dot" style={{ background: "#febc2e" }} />
          <div className="term-dot" style={{ background: "#28c840" }} />
          <span className="term-titlebar-label">user@arthur3 ~ zsh</span>
        </div>

        <div className="term-body">
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

        <div className="term-input-row">
          <span className="term-prompt">user@arthur3 ~ %</span>
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
      <p style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: "10px",
        color: "#1e293b",
        textAlign: "right",
        marginTop: "6px",
        paddingRight: "4px"
      }}>↑↓ history · ctrl+l clear</p>
    </>
  );
}
