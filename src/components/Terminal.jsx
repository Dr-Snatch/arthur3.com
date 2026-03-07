import { useState, useEffect, useRef } from "react";

// ═══════════════════════════════════════════════════════════
// VIRTUAL FILESYSTEM
// ═══════════════════════════════════════════════════════════

const FS = {
  "/": {
    type: "dir",
    children: ["home", "etc", "usr", "tmp", "var"],
  },
  "/home": { type: "dir", children: ["arthur"] },
  "/home/arthur": {
    type: "dir",
    children: [
      "projects", "swift", "blog", "lab",
      "README.md", ".profile", ".secrets", ".bashrc",
    ],
  },

  // ── FILES in ~ ──
  "/home/arthur/README.md": {
    type: "file",
    content: [
      "# arthur3.com",
      "",
      "BSc Artificial Intelligence — Northumbria University",
      "Building iOS apps, Python tools, and AI-powered software.",
      "",
      "## Currently shipping",
      "  → BeatMap   Music journaling for iOS (SwiftUI)",
      "  → RPtext    AI-powered text RPG (macOS)",
      "",
      "## Stack",
      "  Swift · SwiftUI · Python · TypeScript · Claude API",
      "",
      '"I build things to understand them."',
    ],
  },
  "/home/arthur/.profile": {
    type: "file",
    content: [
      "# ~/.profile",
      'export EDITOR="vim"',
      'export LANG="en_GB.UTF-8"',
      'export PS1="\\u@arthur3 \\w % "',
      'export PATH="$HOME/.local/bin:$PATH"',
      "",
      "# loaded on login",
      "echo 'welcome back, arthur.'",
    ],
  },
  "/home/arthur/.secrets": {
    type: "file",
    content: [
      "# you found the secrets file.",
      "",
      "favourite_editor=vim  # fight me",
      "coffee_per_day=4",
      "tabs_or_spaces=tabs   # i said fight me",
      'first_language="scratch"  # we all start somewhere',
      "mass_of_earth_kg=5.972e24  # just in case",
      "password=hunter2  # classic",
      "",
      "# if you're reading this, you're hired. (jk)",
    ],
  },
  "/home/arthur/.bashrc": {
    type: "file",
    content: [
      "# ~/.bashrc",
      "alias ll='ls -la'",
      "alias gs='git status'",
      "alias yeet='git push --force'  # dont actually do this",
      "alias please='sudo'",
      "",
      "# greeting",
      'echo "☕ $(date +%A). time to build."',
    ],
  },

  // ── PROJECTS ──
  "/home/arthur/projects": {
    type: "dir",
    children: ["beatmap", "rptext", "file-organiser", "devboard"],
    url: "/projects",
  },
  "/home/arthur/projects/beatmap": {
    type: "dir",
    children: ["README.md", "Package.swift", "BeatMap.xcodeproj"],
    url: "/projects/beatmap",
  },
  "/home/arthur/projects/beatmap/README.md": {
    type: "file",
    content: [
      "# BeatMap",
      "Music journaling for iOS. Tied to songs, places, and how you actually felt.",
      "",
      "## Status: In Progress — v1.1.0",
      "",
      "Diary entries linked to songs, location, mood, nostalgia, energy.",
      "Pulls live data from Spotify, identifies songs via ShazamKit.",
      "",
      "## Tech",
      "Swift · SwiftUI · Core Data · MapKit · ShazamKit",
      "Spotify API · OAuth 2.0 PKCE · AVFoundation · CryptoKit",
      "",
      "The hardest part: managing competing audio sessions between",
      "ShazamKit and AVFoundation while keeping OAuth token refresh",
      "completely invisible to the user.",
    ],
  },
  "/home/arthur/projects/beatmap/Package.swift": {
    type: "file",
    content: [
      '// swift-tools-version: 5.9',
      'import PackageDescription',
      '',
      'let package = Package(',
      '    name: "BeatMap",',
      '    platforms: [.iOS(.v17)],',
      '    products: [',
      '        .library(name: "BeatMap", targets: ["BeatMap"]),',
      '    ],',
      '    targets: [',
      '        .target(name: "BeatMap"),',
      '    ]',
      ')',
    ],
  },
  "/home/arthur/projects/beatmap/BeatMap.xcodeproj": {
    type: "file",
    content: ["[binary — Xcode project file]"],
  },
  "/home/arthur/projects/rptext": {
    type: "dir",
    children: ["README.md", "Package.swift"],
    url: "/projects/rptext",
  },
  "/home/arthur/projects/rptext/README.md": {
    type: "file",
    content: [
      "# RPtext",
      "An AI-powered text RPG. Living world, real consequences, no scripted content.",
      "",
      "## Status: In Progress — Core systems functional",
      "",
      "Native macOS app. AI generates the entire narrative in real time.",
      "Vague input gets punished. Thoughtful play gets rewarded.",
      "NPCs remember you. Factions track your reputation.",
      "",
      "## Tech",
      "Swift · SwiftUI · Claude API · Ollama · llama3.2:3b",
      "JSON parsing · Streaming responses · macOS",
      "",
      "XML sandwich architecture for reliable structured data exchange",
      "via hidden JSON blocks inside AI narrative responses.",
    ],
  },
  "/home/arthur/projects/rptext/Package.swift": {
    type: "file",
    content: [
      '// swift-tools-version: 5.9',
      'import PackageDescription',
      '',
      'let package = Package(',
      '    name: "RPtext",',
      '    platforms: [.macOS(.v14)],',
      '    dependencies: [',
      '        // Claude API, Ollama integration',
      '    ],',
      '    targets: [',
      '        .executableTarget(name: "RPtext"),',
      '    ]',
      ')',
    ],
  },
  "/home/arthur/projects/file-organiser": {
    type: "dir",
    children: ["main.py", "README.md"],
  },
  "/home/arthur/projects/file-organiser/main.py": {
    type: "file",
    content: [
      "#!/usr/bin/env python3",
      '"""Auto-sorts downloads by type and date."""',
      "",
      "import os, shutil, time",
      "from watchdog.observers import Observer",
      "",
      "# watches ~/Downloads and sorts files",
      "# into folders by extension and date",
      "# because I got tired of the chaos",
    ],
  },
  "/home/arthur/projects/file-organiser/README.md": {
    type: "file",
    content: [
      "# file-organiser",
      "Python script that watches downloads and auto-sorts by type and date.",
      "Solves a genuinely annoying problem.",
    ],
  },
  "/home/arthur/projects/devboard": {
    type: "dir",
    children: ["index.ts", "README.md"],
  },
  "/home/arthur/projects/devboard/index.ts": {
    type: "file",
    content: [
      'import { serve } from "cloudflare-workers";',
      "",
      "// personal dashboard",
      "// aggregates GitHub activity, tasks, and notes",
    ],
  },
  "/home/arthur/projects/devboard/README.md": {
    type: "file",
    content: [
      "# devboard",
      "Personal dashboard in TypeScript/React.",
      "Aggregates GitHub activity, tasks, and notes. Deployed on Cloudflare.",
    ],
  },

  // ── SWIFT ──
  "/home/arthur/swift": {
    type: "dir",
    children: ["projects", "blog"],
    url: "/swift",
  },
  "/home/arthur/swift/projects": {
    type: "dir",
    children: [],
    url: "/swift/projects",
  },
  "/home/arthur/swift/blog": {
    type: "dir",
    children: [],
    url: "/swift/blog",
  },

  // ── BLOG ──
  "/home/arthur/blog": {
    type: "dir",
    children: ["posts"],
    url: "/blog",
  },
  "/home/arthur/blog/posts": { type: "dir", children: [] },

  // ── LAB ──
  "/home/arthur/lab": {
    type: "dir",
    children: ["experiments"],
    url: "/lab",
  },
  "/home/arthur/lab/experiments": { type: "dir", children: [] },

  // ── SYSTEM DIRS ──
  "/etc": { type: "dir", children: ["hostname", "motd"] },
  "/etc/hostname": { type: "file", content: ["arthur3.com"] },
  "/etc/motd": {
    type: "file",
    content: [
      "┌──────────────────────────────────────────┐",
      "│  Welcome to arthur3-os 1.0.0             │",
      "│  Built with Astro · Hosted on Cloudflare │",
      "│  Last login: just now                    │",
      "└──────────────────────────────────────────┘",
    ],
  },
  "/usr": { type: "dir", children: ["bin", "share"] },
  "/usr/bin": { type: "dir", children: [] },
  "/usr/share": { type: "dir", children: ["fortune"] },
  "/usr/share/fortune": { type: "dir", children: ["quotes.txt"] },
  "/usr/share/fortune/quotes.txt": {
    type: "file",
    content: [
      '"Any sufficiently advanced technology is indistinguishable from magic." — Arthur C. Clarke',
      '"First, solve the problem. Then, write the code." — John Johnson',
      '"It works on my machine." — Every developer, ever',
      '"There are only two hard things in CS: cache invalidation and naming things." — Phil Karlton',
      '"Talk is cheap. Show me the code." — Linus Torvalds',
    ],
  },
  "/tmp": { type: "dir", children: [] },
  "/var": { type: "dir", children: ["log"] },
  "/var/log": { type: "dir", children: ["syslog"] },
  "/var/log/syslog": {
    type: "file",
    content: [
      "[2026-03-07 00:00:01] system boot complete",
      "[2026-03-07 00:00:02] loaded profile: arthur",
      "[2026-03-07 00:00:03] mounted /home/arthur",
      "[2026-03-07 00:00:04] network: cloudflare edge connected (LHR)",
      "[2026-03-07 00:00:05] all systems nominal ✓",
    ],
  },
};

const HOME = "/home/arthur";

// ═══════════════════════════════════════════════════════════
// PATH RESOLUTION
// ═══════════════════════════════════════════════════════════

function resolvePath(cwd, inputPath) {
  // expand ~
  let path = inputPath.replace(/^~/, HOME);

  // if not absolute, make it relative to cwd
  if (!path.startsWith("/")) {
    path = cwd + "/" + path;
  }

  // normalise: resolve . and ..
  const parts = path.split("/").filter(Boolean);
  const resolved = [];
  for (const part of parts) {
    if (part === ".") continue;
    if (part === "..") {
      resolved.pop();
    } else {
      resolved.push(part);
    }
  }
  return "/" + resolved.join("/") || "/";
}

function getAbsCwd(cwd) {
  return cwd === "~" ? HOME : cwd;
}

function toDisplayPath(absPath) {
  if (absPath === HOME) return "~";
  if (absPath.startsWith(HOME + "/")) return "~" + absPath.slice(HOME.length);
  return absPath;
}

// ═══════════════════════════════════════════════════════════
// BOOT
// ═══════════════════════════════════════════════════════════

const BOOT_SEQUENCE = [
  { text: "arthur3-os 1.0.0 (tty1)", delay: 0, color: "#6366f1" },
  { text: "", delay: 100 },
  { text: "loading kernel modules...", delay: 200, color: "#475569" },
  { text: "mounting filesystems...", delay: 400, color: "#475569" },
  { text: "starting network: cloudflare edge (LHR) ✓", delay: 600, color: "#34d399" },
  { text: "loading profile: arthur", delay: 800, color: "#475569" },
  { text: "", delay: 900 },
  { text: 'type "help" for commands, or just explore.', delay: 1000, color: "#64748b" },
];

// ═══════════════════════════════════════════════════════════
// EASTER EGG COMMANDS
// ═══════════════════════════════════════════════════════════

const NEOFETCH = [
  { text: "        .--.         arthur@arthur3.com", color: "#6366f1" },
  { text: "       |o_o |        ──────────────────", color: "#6366f1" },
  { text: "       |:_/ |        OS: arthur3-os 1.0.0 x86_64" },
  { text: "      //   \\ \\       Host: Cloudflare Pages" },
  { text: "     (|     | )      Kernel: Astro 5.x" },
  { text: '    /\'_   _/`\\       Shell: zsh 5.9' },
  { text: "    \\___)=(___/      Terminal: arthur3-term" },
  { text: "                     CPU: SwiftUI @ 120fps" },
  { text: "                     Memory: 669 node_modules" },
  { text: "                     Uptime: since mid-2025" },
  { text: "                     Packages: too many (npm)" },
  { text: "                     Theme: dark [always]" },
];

const COWSAY_MSGS = [
  "moo. i mean, ship it.",
  "have you tried turning it off and on again?",
  "segfault in the matrix.",
  "null pointer? i barely know her.",
  "git push --force and pray.",
];

function cowsay(msg) {
  const top = " " + "_".repeat(msg.length + 2);
  const mid = `< ${msg} >`;
  const bot = " " + "-".repeat(msg.length + 2);
  return [
    { text: top },
    { text: mid },
    { text: bot },
    { text: "        \\   ^__^" },
    { text: "         \\  (oo)\\_______" },
    { text: "            (__)\\       )\\/\\" },
    { text: "                ||----w |" },
    { text: "                ||     ||" },
  ];
}

// ═══════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════

export default function Terminal() {
  const [lines, setLines] = useState([]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [booted, setBooted] = useState(false);
  const [cwd, setCwd] = useState(HOME);
  const [windowState, setWindowState] = useState("normal");
  const [commandCount, setCommandCount] = useState(0);
  const inputRef = useRef(null);
  const bodyRef = useRef(null);

  useEffect(() => {
    const timers = BOOT_SEQUENCE.map(({ text, delay, color }) =>
      setTimeout(() => setLines((p) => [...p, { text, color }]), delay)
    );
    const bootTimer = setTimeout(() => setBooted(true), 1200);
    return () => { timers.forEach(clearTimeout); clearTimeout(bootTimer); };
  }, []);

  useEffect(() => {
    if (windowState === "normal" || windowState === "maximized") {
      if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [lines, windowState]);

  useEffect(() => {
    if (windowState === "normal" || windowState === "maximized") {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [windowState]);

  const out = (newLines) => setLines((p) => [...p, ...newLines]);
  const displayCwd = toDisplayPath(cwd);

  // ─────────────────────────────────────────
  // COMMAND HANDLER
  // ─────────────────────────────────────────
  const handleCommand = (raw) => {
    const trimmed = raw.trim();

    setLines((p) => [
      ...p,
      { text: `arthur@arthur3 ${displayCwd} % ${raw}`, color: "#a78bfa" },
    ]);

    if (!trimmed) return;

    setHistory((p) => [raw, ...p]);
    setHistoryIndex(-1);
    setCommandCount((c) => c + 1);

    const parts = trimmed.split(/\s+/);
    const base = parts[0].toLowerCase();
    const args = parts.slice(1);
    const rawArgs = trimmed.slice(base.length).trim();

    // ── CLEAR ──
    if (base === "clear") { setLines([]); return; }

    // ── CD ──
    if (base === "cd") {
      const target = args[0] || "~";
      if (target === "-") {
        out([{ text: "cd: OLDPWD not set", color: "#f87171" }]);
        return;
      }
      const resolved = resolvePath(cwd, target);
      const node = FS[resolved];
      if (!node) {
        out([{ text: `cd: ${target}: no such file or directory`, color: "#f87171" }]);
      } else if (node.type !== "dir") {
        out([{ text: `cd: ${target}: not a directory`, color: "#f87171" }]);
      } else {
        setCwd(resolved);
      }
      return;
    }

    // ── PWD ──
    if (base === "pwd") {
      out([{ text: cwd }]);
      return;
    }

    // ── LS ──
    if (base === "ls") {
      const showHidden = args.includes("-a") || args.includes("-la") || args.includes("-al");
      const showLong = args.includes("-l") || args.includes("-la") || args.includes("-al");
      const pathArg = args.find((a) => !a.startsWith("-"));
      const target = pathArg ? resolvePath(cwd, pathArg) : cwd;
      const node = FS[target];

      if (!node) {
        out([{ text: `ls: ${pathArg}: no such file or directory`, color: "#f87171" }]);
        return;
      }
      if (node.type === "file") {
        out([{ text: pathArg || target.split("/").pop() }]);
        return;
      }

      let items = node.children || [];
      if (!showHidden) items = items.filter((i) => !i.startsWith("."));

      if (showLong) {
        if (showHidden) {
          out([
            { text: "total " + items.length },
            { text: "drwxr-xr-x  .   ", color: "#60a5fa" },
            { text: "drwxr-xr-x  ..  ", color: "#60a5fa" },
          ]);
        }
        items.forEach((item) => {
          const childPath = target === "/" ? "/" + item : target + "/" + item;
          const childNode = FS[childPath];
          const isDir = childNode && childNode.type === "dir";
          const isHidden = item.startsWith(".");
          const perms = isDir ? "drwxr-xr-x" : "-rw-r--r--";
          const size = childNode && childNode.content ? String(childNode.content.length * 42).padStart(5) : "  4096";
          const date = "Mar  7 00:00";
          const color = isDir ? "#60a5fa" : isHidden ? "#475569" : item.endsWith(".py") || item.endsWith(".sh") ? "#4ade80" : "#94a3b8";
          out([{ text: `${perms}  ${size} ${date}  ${item}${isDir ? "/" : ""}`, color }]);
        });
      } else {
        const result = items.map((item) => {
          const childPath = target === "/" ? "/" + item : target + "/" + item;
          const childNode = FS[childPath];
          const isDir = childNode && childNode.type === "dir";
          return { text: isDir ? item + "/" : item, color: isDir ? "#60a5fa" : "#94a3b8" };
        });
        out(result.length > 0 ? result : [{ text: "(empty)", color: "#475569" }]);
      }
      return;
    }

    // ── CAT ──
    if (base === "cat") {
      if (args.length === 0) {
        out([{ text: "cat: missing operand", color: "#f87171" }]);
        return;
      }
      const target = resolvePath(cwd, args[0]);
      const node = FS[target];
      if (!node) {
        out([{ text: `cat: ${args[0]}: no such file or directory`, color: "#f87171" }]);
      } else if (node.type === "dir") {
        out([{ text: `cat: ${args[0]}: is a directory`, color: "#f87171" }]);
      } else {
        out(node.content.map((line) => ({ text: line })));
      }
      return;
    }

    // ── HEAD ──
    if (base === "head") {
      const target = resolvePath(cwd, args[0] || "");
      const node = FS[target];
      if (!node || node.type !== "file") {
        out([{ text: `head: ${args[0] || ""}: cannot read`, color: "#f87171" }]);
      } else {
        out(node.content.slice(0, 5).map((line) => ({ text: line })));
      }
      return;
    }

    // ── OPEN ──
    if (base === "open") {
      const target = args[0];
      if (!target) {
        // open current directory's URL
        const node = FS[cwd];
        if (node && node.url) {
          out([{ text: `opening ${node.url}...`, color: "#34d399" }]);
          setTimeout(() => { window.location.href = node.url; }, 600);
        } else {
          out([{ text: "open: no page for this directory", color: "#f87171" }]);
        }
        return;
      }
      // try resolving as path
      const resolved = resolvePath(cwd, target);
      const node = FS[resolved];
      if (node && node.url) {
        out([{ text: `opening ${node.url}...`, color: "#34d399" }]);
        setTimeout(() => { window.location.href = node.url; }, 600);
      } else if (target.startsWith("http")) {
        out([{ text: `opening ${target}...`, color: "#34d399" }]);
        setTimeout(() => { window.open(target, "_blank"); }, 600);
      } else {
        out([{ text: `open: ${target}: no page associated`, color: "#f87171" }]);
      }
      return;
    }

    // ── TREE ──
    if (base === "tree") {
      const target = args[0] ? resolvePath(cwd, args[0]) : cwd;
      const node = FS[target];
      if (!node || node.type !== "dir") {
        out([{ text: `tree: ${args[0] || "."}: not a directory`, color: "#f87171" }]);
        return;
      }
      const treeLines = [{ text: toDisplayPath(target), color: "#60a5fa" }];
      function walk(path, prefix) {
        const n = FS[path];
        if (!n || n.type !== "dir") return;
        const items = (n.children || []).filter((i) => !i.startsWith("."));
        items.forEach((item, i) => {
          const isLast = i === items.length - 1;
          const connector = isLast ? "└── " : "├── ";
          const childPath = path === "/" ? "/" + item : path + "/" + item;
          const childNode = FS[childPath];
          const isDir = childNode && childNode.type === "dir";
          treeLines.push({ text: prefix + connector + item + (isDir ? "/" : ""), color: isDir ? "#60a5fa" : "#94a3b8" });
          if (isDir) walk(childPath, prefix + (isLast ? "    " : "│   "));
        });
      }
      walk(target, "");
      out(treeLines);
      return;
    }

    // ── ECHO ──
    if (base === "echo") {
      const text = rawArgs.replace(/^["']|["']$/g, "");
      out([{ text: text || "" }]);
      return;
    }

    // ── DATE ──
    if (base === "date") {
      out([{ text: new Date().toString() }]);
      return;
    }

    // ── WHOAMI ──
    if (base === "whoami") {
      out([{ text: "arthur" }]);
      return;
    }

    // ── HOSTNAME ──
    if (base === "hostname") {
      out([{ text: "arthur3.com" }]);
      return;
    }

    // ── UNAME ──
    if (base === "uname") {
      if (args.includes("-a")) {
        out([{ text: "arthur3-os 1.0.0 arthur3.com x86_64 GNU/Linux" }]);
      } else {
        out([{ text: "arthur3-os" }]);
      }
      return;
    }

    // ── UPTIME ──
    if (base === "uptime") {
      const months = Math.floor((Date.now() - new Date("2025-06-01").getTime()) / (1000 * 60 * 60 * 24 * 30));
      out([{ text: ` up ${months} months, 1 user, load average: 0.42, 0.69, 0.13` }]);
      return;
    }

    // ── HISTORY ──
    if (base === "history") {
      const h = [...history].reverse();
      out(h.map((cmd, i) => ({ text: `  ${String(i + 1).padStart(4)}  ${cmd}`, color: "#64748b" })));
      return;
    }

    // ── WHICH / TYPE ──
    if (base === "which" || base === "type") {
      const cmd = args[0];
      const builtins = ["cd", "pwd", "ls", "cat", "echo", "clear", "history", "help", "open", "tree", "head", "date", "whoami", "hostname", "uname", "uptime", "which", "type"];
      if (builtins.includes(cmd)) {
        out([{ text: `${cmd}: shell built-in command` }]);
      } else {
        out([{ text: `${cmd}: not found`, color: "#f87171" }]);
      }
      return;
    }

    // ── HELP ──
    if (base === "help") {
      out([
        { text: "┌──────────────────────────────────────────────────┐" },
        { text: "│  NAVIGATION                                      │" },
        { text: "│    cd <path>    change directory (supports .. ~)  │" },
        { text: "│    ls [-la]     list files and directories        │" },
        { text: "│    pwd          print working directory            │" },
        { text: "│    tree         show directory tree                │" },
        { text: "│    cat <file>   read a file                       │" },
        { text: "│    open         navigate to current page           │" },
        { text: "│                                                    │" },
        { text: "│  INFO                                              │" },
        { text: "│    about        who am I                           │" },
        { text: "│    skills       my tech stack                      │" },
        { text: "│    contact      get in touch                       │" },
        { text: "│    neofetch     system info                        │" },
        { text: "│                                                    │" },
        { text: "│  SYSTEM                                            │" },
        { text: "│    whoami  hostname  uname  date  uptime           │" },
        { text: "│    echo  history  which  clear                     │" },
        { text: "│                                                    │" },
        { text: "│  there are also some hidden commands...            │", color: "#475569" },
        { text: "└──────────────────────────────────────────────────┘" },
      ]);
      return;
    }

    // ── ABOUT ──
    if (base === "about") {
      out([
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
      ]);
      return;
    }

    // ── SKILLS ──
    if (base === "skills") {
      out([
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
      ]);
      return;
    }

    // ── CONTACT ──
    if (base === "contact") {
      out([
        { text: "CONTACT", color: "#6366f1" },
        { text: "───────" },
        { text: "GitHub    github.com/Dr-Snatch" },
        { text: "Email     arthurwheildon0@gmail.com" },
        { text: "Twitter   x.com/ExpoArturo" },
        { text: "LinkedIn  linkedin.com/in/arthurwheildon" },
        { text: "" },
        { text: "I'm generally available. Say hi." },
      ]);
      return;
    }

    // ── PROJECTS ──
    if (base === "projects") {
      out([
        { text: "PROJECTS", color: "#6366f1" },
        { text: "────────" },
        { text: "BeatMap    iOS music journaling — v1.1.0" },
        { text: "RPtext     AI text RPG — core systems functional" },
        { text: "" },
        { text: "cd ~/projects to explore, or 'open' to visit the page", color: "#475569" },
      ]);
      return;
    }

    // ═══════════════════════════════════════
    // EASTER EGGS
    // ═══════════════════════════════════════

    if (base === "neofetch") { out(NEOFETCH); return; }

    if (base === "cowsay") {
      const msg = rawArgs || COWSAY_MSGS[Math.floor(Math.random() * COWSAY_MSGS.length)];
      out(cowsay(msg));
      return;
    }

    if (base === "fortune") {
      const quotes = FS["/usr/share/fortune/quotes.txt"].content;
      out([{ text: quotes[Math.floor(Math.random() * quotes.length)], color: "#fbbf24" }]);
      return;
    }

    if (base === "sudo") {
      if (rawArgs.startsWith("rm -rf")) {
        out([
          { text: "[sudo] password for arthur: ********", color: "#f87171" },
          { text: "nice try. this is a portfolio, not a sandbox." },
          { text: "incident reported to /dev/null." },
        ]);
      } else if (rawArgs === "make me a sandwich") {
        out([{ text: "okay.", color: "#4ade80" }]);
      } else {
        out([
          { text: "[sudo] password for arthur: ********", color: "#f87171" },
          { text: "arthur is not in the sudoers file. this incident will be reported." },
        ]);
      }
      return;
    }

    if (base === "rm") {
      if (rawArgs.includes("-rf /") || rawArgs.includes("-rf ~")) {
        out([{ text: "rm: nice try. refusing to destroy everything.", color: "#f87171" }]);
      } else {
        out([{ text: "rm: operation not permitted (read-only filesystem)", color: "#f87171" }]);
      }
      return;
    }

    if (base === "touch") {
      if (args[0] === "grass") {
        out([{ text: "good advice. going outside...", color: "#4ade80" }]);
      } else {
        out([{ text: "touch: read-only filesystem", color: "#f87171" }]);
      }
      return;
    }

    if (base === "mkdir" || base === "mv" || base === "cp") {
      out([{ text: `${base}: read-only filesystem`, color: "#f87171" }]);
      return;
    }

    if (base === "vim" || base === "vi") {
      out([
        { text: "~" },
        { text: "~" },
        { text: "~                    VIM - Vi IMproved" },
        { text: "~" },
        { text: "~             you're stuck now. there's no escape." },
        { text: "~                    (just kidding, type :q)" },
        { text: "~" },
        { text: "~" },
      ]);
      return;
    }

    if (base === "emacs") {
      out([
        { text: "emacs: great operating system, terrible text editor.", color: "#fbbf24" },
        { text: "(this terminal is a vim household.)" },
      ]);
      return;
    }

    if (base === "nano") {
      out([{ text: "nano is valid and I respect your choice.", color: "#4ade80" }]);
      return;
    }

    if (base === "code" || base === "code.") {
      out([{ text: "VS Code... the Switzerland of editors.", color: "#60a5fa" }]);
      return;
    }

    if (base === "python" || base === "python3") {
      out([
        { text: "Python 3.12.0 (totally real)", color: "#fbbf24" },
        { text: '>>> import antigravity' },
        { text: "    (you are now floating)" },
        { text: '>>> exit()' },
      ]);
      return;
    }

    if (base === "node") {
      out([
        { text: "Welcome to Node.js v24.12.0." },
        { text: "> require('happiness')" },
        { text: "Error: Cannot find module 'happiness'", color: "#f87171" },
        { text: "  (try npm install happiness)" },
      ]);
      return;
    }

    if (base === "npm") {
      if (args[0] === "install") {
        out([
          { text: "added 847 packages in 2s", color: "#4ade80" },
          { text: "243 packages are looking for funding" },
          { text: "  run `npm fund` for details" },
          { text: "" },
          { text: "37 vulnerabilities (12 moderate, 25 high)", color: "#fbbf24" },
          { text: "  good luck." },
        ]);
      } else {
        out([{ text: `npm: '${args[0] || ""}' — sure, whatever.` }]);
      }
      return;
    }

    if (base === "git") {
      if (args[0] === "status") {
        out([
          { text: "On branch main" },
          { text: "Your branch is up to date with 'origin/main'." },
          { text: "" },
          { text: "nothing to commit, working tree clean", color: "#4ade80" },
        ]);
      } else if (args[0] === "log") {
        out([
          { text: "commit 2b07eed (HEAD -> main, origin/main)", color: "#fbbf24" },
          { text: "Author: arthur <arthurwheildon0@gmail.com>" },
          { text: "Date:   Sat Mar 7 2026" },
          { text: "" },
          { text: "    Add projects, swift, lab section pages" },
        ]);
      } else if (args[0] === "blame") {
        out([{ text: "it was you. it's always you." }]);
      } else {
        out([{ text: `git: '${args[0] || ""}' is not a git command.` }]);
      }
      return;
    }

    if (base === "ping") {
      const host = args[0] || "localhost";
      out([
        { text: `PING ${host}: 56 data bytes` },
        { text: `64 bytes from ${host}: icmp_seq=0 ttl=64 time=0.042 ms` },
        { text: `64 bytes from ${host}: icmp_seq=1 ttl=64 time=0.069 ms` },
        { text: `64 bytes from ${host}: icmp_seq=2 ttl=64 time=0.031 ms` },
        { text: "" },
        { text: `--- ${host} ping statistics ---` },
        { text: "3 packets transmitted, 3 received, 0% packet loss", color: "#4ade80" },
      ]);
      return;
    }

    if (base === "curl") {
      out([
        { text: '{"status":"alive","mood":"caffeinated","shipping":true}', color: "#4ade80" },
      ]);
      return;
    }

    if (base === "make") {
      if (args[0] === "love") {
        out([{ text: "make: *** No rule to make target 'love'. Stop.", color: "#f87171" }]);
      } else if (args[0] === "money") {
        out([{ text: "make: *** No rule to make target 'money'. Try 'make projects'.", color: "#f87171" }]);
      } else if (args[0] === "coffee") {
        out([{ text: "☕ brewing...", color: "#fbbf24" }]);
      } else {
        out([{ text: `make: *** No targets specified. Stop.`, color: "#f87171" }]);
      }
      return;
    }

    if (base === "man") {
      out([
        { text: `No manual entry for ${args[0] || "life"}.` },
        { text: "RTFM? there is no FM. just vibes.", color: "#475569" },
      ]);
      return;
    }

    if (base === "apt" || base === "apt-get") {
      out([{ text: "E: Could not open lock file — are you root?", color: "#f87171" }]);
      return;
    }

    if (base === "brew") {
      out([{ text: "Error: This is Linux, not macOS. Oh wait...", color: "#fbbf24" }]);
      return;
    }

    if (base === "exit" || base === "logout") {
      out([{ text: "there's no escape. you live here now." }]);
      return;
    }

    if (base === "reboot" || base === "shutdown") {
      out([
        { text: "system going down for reboot...", color: "#f87171" },
        { text: "..." },
        { text: "just kidding. refresh the page if you must." },
      ]);
      return;
    }

    if (base === "hack" || base === "hackerman") {
      out([
        { text: "initiating hack sequence..." },
        { text: "▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ 100%", color: "#4ade80" },
        { text: "ACCESS GRANTED", color: "#4ade80" },
        { text: "" },
        { text: "just kidding. this is a portfolio." },
      ]);
      return;
    }

    if (base === "coffee" || base === "cafe") {
      out([
        { text: "     ( (" },
        { text: "      ) )" },
        { text: "   .______." },
        { text: "   |      |]" },
        { text: "   \\      /" },
        { text: "    '----'" },
        { text: "" },
        { text: "coffee.service: active (running)", color: "#4ade80" },
      ]);
      return;
    }

    if (base === "matrix") {
      out([
        { text: "wake up, Neo...", color: "#4ade80" },
        { text: "the Matrix has you...", color: "#4ade80" },
        { text: "follow the white rabbit.", color: "#4ade80" },
        { text: "" },
        { text: "(or just keep browsing this portfolio)" },
      ]);
      return;
    }

    if (base === "sl") {
      out([
        { text: "      ====        ________                ___________" },
        { text: "  _D _|  |_______/        \\__I_I_____===__|_________/" },
        { text: "   |(_)---  |   H\\________/ |   |        =|___ ___|" },
        { text: '   /     |  |   H  |  |     |   |         ||_| |_||' },
        { text: "  |      |  |   H  |__--------------------| [___] |" },
        { text: "  | ________|___H__/__|_____/[][]~\\_______|       |" },
        { text: "  |/ |   |-----------I_____I [][] []  D   |=======|__" },
        { text: "" },
        { text: "you meant 'ls', didn't you?", color: "#475569" },
      ]);
      return;
    }

    if (base === "hello" || base === "hi" || base === "hey") {
      const greetings = ["hey!", "hello there.", "sup.", "oh hi.", "greetings, human.", "ahoy."];
      out([{ text: greetings[Math.floor(Math.random() * greetings.length)], color: "#4ade80" }]);
      return;
    }

    if (base === "42" || trimmed === "the answer") {
      out([{ text: "to life, the universe, and everything.", color: "#fbbf24" }]);
      return;
    }

    if (base === "xkcd") {
      out([{ text: "there's always a relevant xkcd. always." }]);
      return;
    }

    if (base === "rickroll" || trimmed === "never gonna") {
      out([
        { text: "Never gonna give you up", color: "#f87171" },
        { text: "Never gonna let you down", color: "#fbbf24" },
        { text: "Never gonna run around and desert you", color: "#4ade80" },
      ]);
      return;
    }

    if (base === "lolcat" || base === "cmatrix" || base === "figlet" || base === "toilet") {
      out([{ text: `${base}: not installed. this terminal has standards.`, color: "#fbbf24" }]);
      return;
    }

    // ── FALLBACK ──
    out([
      { text: `zsh: command not found: ${base}`, color: "#f87171" },
      { text: `type "help" for available commands`, color: "#475569" },
    ]);
  };

  // ─────────────────────────────────────────
  // KEY HANDLER
  // ─────────────────────────────────────────
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
    } else if (e.key === "c" && e.ctrlKey) {
      e.preventDefault();
      setLines((p) => [...p, { text: `arthur@arthur3 ${displayCwd} % ${input}^C`, color: "#a78bfa" }]);
      setInput("");
    } else if (e.key === "Tab") {
      e.preventDefault();
      // basic tab completion for current directory
      const partial = input.split(/\s+/).pop() || "";
      if (!partial) return;
      const node = FS[cwd];
      if (!node || node.type !== "dir") return;
      const matches = (node.children || []).filter((c) => c.startsWith(partial));
      if (matches.length === 1) {
        const parts = input.split(/\s+/);
        parts[parts.length - 1] = matches[0];
        const childPath = cwd === "/" ? "/" + matches[0] : cwd + "/" + matches[0];
        const childNode = FS[childPath];
        if (childNode && childNode.type === "dir") parts[parts.length - 1] += "/";
        setInput(parts.join(" "));
      } else if (matches.length > 1) {
        setLines((p) => [...p, { text: matches.join("  "), color: "#64748b" }]);
      }
    }
  };

  const isMaximized = windowState === "maximized";
  const isMinimized = windowState === "minimized";
  const isClosed = windowState === "closed";

  return (
    <>
      <style>{`
        .term-tab {
          position: fixed; bottom: 0; right: 32px; z-index: 9999;
          display: flex; align-items: center; gap: 8px;
          padding: 8px 18px 8px 14px; background: #111118;
          border: 1px solid #1e1e2e; border-bottom: none;
          border-radius: 8px 8px 0 0; cursor: pointer;
          transition: background 0.15s ease;
          box-shadow: 0 -4px 20px rgba(99,102,241,0.08); user-select: none;
        }
        .term-tab:hover { background: #16161f; }
        .term-tab-dot {
          width: 7px; height: 7px; border-radius: 50%;
          background: #6366f1; box-shadow: 0 0 6px rgba(99,102,241,0.7);
          animation: tabpulse 2s ease-in-out infinite;
        }
        @keyframes tabpulse { 0%,100% { opacity: 1; } 50% { opacity: 0.35; } }
        .term-tab-label { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #64748b; letter-spacing: 0.05em; }
        .term-tab-open { font-family: 'JetBrains Mono', monospace; font-size: 10px; color: #334155; }
        .term-overlay { position: fixed; inset: 0; z-index: 9998; background: rgba(0,0,0,0.6); backdrop-filter: blur(2px); }
        .term-window {
          background: #0f0f0f; border: 1px solid #1e1e2e; border-radius: 12px;
          overflow: hidden; width: 100%; display: flex; flex-direction: column;
          box-shadow: 0 0 0 1px rgba(99,102,241,0.08), 0 25px 60px rgba(0,0,0,0.6), 0 0 80px rgba(99,102,241,0.05);
          transition: box-shadow 0.2s ease;
        }
        .term-window.maximized {
          position: fixed; inset: 40px; z-index: 9999; border-radius: 14px; width: auto;
          box-shadow: 0 0 0 1px rgba(99,102,241,0.15), 0 40px 100px rgba(0,0,0,0.9), 0 0 120px rgba(99,102,241,0.1);
        }
        .term-titlebar {
          display: flex; align-items: center; gap: 7px; padding: 11px 16px;
          background: #111118; border-bottom: 1px solid #1a1a2e;
          position: relative; flex-shrink: 0; user-select: none;
        }
        .term-btn { width: 12px; height: 12px; border-radius: 50%; flex-shrink: 0; border: none; cursor: pointer; padding: 0; transition: filter 0.15s ease; }
        .term-btn:hover { filter: brightness(1.25); }
        .term-btn-close { background: #ff5f57; }
        .term-btn-min { background: #febc2e; }
        .term-btn-max { background: #28c840; }
        .term-btn-group { display: flex; gap: 7px; align-items: center; }
        .term-titlebar-label {
          position: absolute; left: 50%; transform: translateX(-50%);
          font-family: 'JetBrains Mono', monospace; font-size: 11px;
          color: #334155; letter-spacing: 0.05em; pointer-events: none; white-space: nowrap;
        }
        .term-body {
          padding: 18px 20px 4px; height: 320px; overflow-y: auto;
          scrollbar-width: thin; scrollbar-color: #1e293b transparent; flex-shrink: 0;
        }
        .term-window.maximized .term-body { flex: 1; height: auto; }
        .term-body::-webkit-scrollbar { width: 4px; }
        .term-body::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 2px; }
        .term-line { font-family: 'JetBrains Mono', monospace; font-size: 12.5px; line-height: 1.65; white-space: pre; }
        .term-window.maximized .term-line { font-size: 14px; }
        .term-input-row { display: flex; align-items: center; gap: 8px; padding: 10px 20px 14px; border-top: 1px solid #111; flex-shrink: 0; }
        .term-prompt { font-family: 'JetBrains Mono', monospace; font-size: 12.5px; color: #6366f1; white-space: nowrap; user-select: none; flex-shrink: 0; }
        .term-window.maximized .term-prompt { font-size: 14px; }
        .term-input { flex: 1; background: transparent; border: none; outline: none; font-family: 'JetBrains Mono', monospace; font-size: 12.5px; color: #e2e8f0; caret-color: #6366f1; min-width: 0; }
        .term-window.maximized .term-input { font-size: 14px; }
      `}</style>

      {isMinimized && (
        <button className="term-tab" onClick={() => setWindowState("normal")} aria-label="Restore terminal">
          <span className="term-tab-dot" />
          <span className="term-tab-label">arthur@arthur3 {displayCwd}</span>
          <span className="term-tab-open">↑</span>
        </button>
      )}

      {isMaximized && <div className="term-overlay" onClick={() => setWindowState("normal")} />}

      {!isClosed && !isMinimized && (
        <div className={`term-window${isMaximized ? " maximized" : ""}`} onClick={() => inputRef.current?.focus()}>
          <div className="term-titlebar">
            <div className="term-btn-group">
              <button className="term-btn term-btn-close" onClick={(e) => { e.stopPropagation(); setWindowState("closed"); }} title="Close" aria-label="Close terminal" />
              <button className="term-btn term-btn-min" onClick={(e) => { e.stopPropagation(); setWindowState("minimized"); }} title="Minimise" aria-label="Minimise terminal" />
              <button className="term-btn term-btn-max" onClick={(e) => { e.stopPropagation(); setWindowState((s) => s === "maximized" ? "normal" : "maximized"); }} title={isMaximized ? "Restore" : "Maximise"} aria-label={isMaximized ? "Restore" : "Maximise"} />
            </div>
            <span className="term-titlebar-label">arthur@arthur3 {displayCwd} — zsh</span>
          </div>

          <div className="term-body" ref={bodyRef}>
            {lines.map((line, i) => (
              <div key={i} className="term-line" style={{ color: line.color || "#94a3b8" }}>{line.text}</div>
            ))}
          </div>

          <div className="term-input-row">
            <span className="term-prompt">arthur@arthur3 {displayCwd} %</span>
            <input
              ref={inputRef} className="term-input" value={input}
              onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyDown}
              autoFocus spellCheck={false} autoComplete="off" autoCapitalize="off" disabled={!booted}
            />
          </div>
        </div>
      )}

      {isClosed && (
        <button className="term-tab" onClick={() => setWindowState("normal")} aria-label="Open terminal">
          <span className="term-tab-dot" />
          <span className="term-tab-label">terminal</span>
          <span className="term-tab-open">↑</span>
        </button>
      )}
    </>
  );
}
