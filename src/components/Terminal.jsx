import { useState, useEffect, useRef, useCallback } from "react";

// ═══════════════════════════════════════════════════════════
// VIRTUAL FILESYSTEM
// ═══════════════════════════════════════════════════════════

const FS = {
  "/": { type: "dir", children: ["home", "etc", "usr", "tmp", "var"] },
  "/home": { type: "dir", children: ["arthur"] },
  "/home/arthur": {
    type: "dir", url: "/",
    children: ["projects", "lab", "README.md", ".profile", ".secrets", ".bashrc"],
  },
  "/home/arthur/README.md": {
    type: "file",
    content: [
      "# arthur3.com", "",
      "BSc Artificial Intelligence — Northumbria University",
      "Building iOS apps, Python tools, and AI-powered software.", "",
      "## Currently shipping",
      "  → BeatMap   Music journaling for iOS (SwiftUI)",
      "  → RPtext    AI-powered text RPG (macOS)", "",
      "## Stack",
      "  Swift · SwiftUI · Python · TypeScript · Claude API", "",
      '"I build things to understand them."',
    ],
  },
  "/home/arthur/.profile": {
    type: "file",
    content: [
      "# ~/.profile", 'export EDITOR="vim"', 'export LANG="en_GB.UTF-8"',
      'export PS1="\\u@arthur3 \\w % "', 'export PATH="$HOME/.local/bin:$PATH"',
      "", "# loaded on login", "echo 'welcome back, arthur.'",
    ],
  },
  "/home/arthur/.secrets": {
    type: "file",
    content: [
      "# you found the secrets file.", "",
      "favourite_editor=vim  # fight me", "coffee_per_day=4",
      "tabs_or_spaces=tabs   # i said fight me",
      'first_language="scratch"  # we all start somewhere',
      "mass_of_earth_kg=5.972e24  # just in case",
      "password=hunter2  # classic", "",
      "# if you're reading this, you're hired. (jk)",
    ],
  },
  "/home/arthur/.bashrc": {
    type: "file",
    content: [
      "# ~/.bashrc", "alias ll='ls -la'", "alias gs='git status'",
      "alias yeet='git push --force'  # dont actually do this",
      "alias please='sudo'", "",
      'echo "☕ $(date +%A). time to build."',
    ],
  },

  // ── PROJECTS ──
  "/home/arthur/projects": { type: "dir", url: "/projects", children: ["beatmap", "rptext", "arthur3-com"] },
  "/home/arthur/projects/beatmap": { type: "dir", url: "/projects/beatmap", children: ["README.md", "Package.swift", "BeatMap.xcodeproj"] },
  "/home/arthur/projects/beatmap/README.md": {
    type: "file",
    content: [
      "# BeatMap", "Music journaling for iOS. Tied to songs, places, and how you actually felt.", "",
      "## Status: In Progress — v1.1.0", "",
      "Diary entries linked to songs, location, mood, nostalgia, energy.",
      "Pulls live data from Spotify, identifies songs via ShazamKit.", "",
      "## Tech", "Swift · SwiftUI · Core Data · MapKit · ShazamKit",
      "Spotify API · OAuth 2.0 PKCE · AVFoundation · CryptoKit",
    ],
  },
  "/home/arthur/projects/beatmap/Package.swift": {
    type: "file",
    content: ['// swift-tools-version: 5.9', 'import PackageDescription', '', 'let package = Package(', '    name: "BeatMap",', '    platforms: [.iOS(.v17)],', ')'],
  },
  "/home/arthur/projects/beatmap/BeatMap.xcodeproj": { type: "file", content: ["[binary — Xcode project file]"] },
  "/home/arthur/projects/rptext": { type: "dir", url: "/projects/rptext", children: ["README.md", "Package.swift"] },
  "/home/arthur/projects/rptext/README.md": {
    type: "file",
    content: [
      "# RPtext", "An AI-powered text RPG. Living world, real consequences, no scripted content.", "",
      "## Status: In Progress — Core systems functional", "",
      "Native macOS app. AI generates the entire narrative in real time.",
      "NPCs remember you. Factions track your reputation.", "",
      "## Tech", "Swift · SwiftUI · Claude API · Ollama · llama3.2:3b",
      "JSON parsing · Streaming responses · macOS",
    ],
  },
  "/home/arthur/projects/rptext/Package.swift": {
    type: "file",
    content: ['// swift-tools-version: 5.9', 'import PackageDescription', '', 'let package = Package(', '    name: "RPtext",', '    platforms: [.macOS(.v14)],', ')'],
  },
  "/home/arthur/projects/arthur3-com": { type: "dir", children: ["README.md"] },
  "/home/arthur/projects/arthur3-com/README.md": {
    type: "file",
    content: ["# arthur3.com", "This website. Astro + Keystatic + Cloudflare Pages.", "The terminal you're using right now is part of it."],
  },

  // ── LAB ──
  "/home/arthur/lab": { type: "dir", url: "/lab", children: ["experiments"] },
  "/home/arthur/lab/experiments": { type: "dir", children: [] },

  // ── SYSTEM ──
  "/etc": { type: "dir", children: ["hostname", "motd"] },
  "/etc/hostname": { type: "file", content: ["arthur3.com"] },
  "/etc/motd": { type: "file", content: ["┌──────────────────────────────────────────┐", "│  Welcome to arthur3-os 1.0.0             │", "│  Built with Astro · Hosted on Cloudflare │", "└──────────────────────────────────────────┘"] },
  "/usr": { type: "dir", children: ["bin", "share"] },
  "/usr/bin": { type: "dir", children: [] },
  "/usr/share": { type: "dir", children: ["fortune"] },
  "/usr/share/fortune": { type: "dir", children: ["quotes.txt"] },
  "/usr/share/fortune/quotes.txt": {
    type: "file",
    content: [
      '"Any sufficiently advanced technology is indistinguishable from magic." — Clarke',
      '"First, solve the problem. Then, write the code." — John Johnson',
      '"It works on my machine." — Every developer, ever',
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
      "[2026-03-07 00:00:03] network: cloudflare edge (LHR) connected",
      "[2026-03-07 00:00:04] all systems nominal ✓",
    ],
  },
};

const HOME = "/home/arthur";
const URL_TO_PATH = { "/": HOME };
Object.entries(FS).forEach(([path, node]) => { if (node.url && node.url !== "/") URL_TO_PATH[node.url] = path; });

function resolvePath(cwd, inputPath) {
  let path = inputPath.replace(/^~/, HOME);
  if (!path.startsWith("/")) path = cwd + "/" + path;
  const parts = path.split("/").filter(Boolean);
  const resolved = [];
  for (const part of parts) { if (part === ".") continue; if (part === "..") resolved.pop(); else resolved.push(part); }
  return "/" + resolved.join("/") || "/";
}

function toDisplayPath(absPath) {
  if (absPath === HOME) return "~";
  if (absPath.startsWith(HOME + "/")) return "~" + absPath.slice(HOME.length);
  return absPath;
}

// ═══════════════════════════════════════════════════════════
// BOOT + EASTER EGGS
// ═══════════════════════════════════════════════════════════

const BOOT = [
  { text: "arthur3-os 1.0.0 (tty1)", delay: 0, color: "#6366f1" },
  { text: "", delay: 80 },
  { text: "loading kernel modules...", delay: 160, color: "#475569" },
  { text: "mounting filesystems...", delay: 320, color: "#475569" },
  { text: "starting network: cloudflare edge (LHR) ✓", delay: 480, color: "#34d399" },
  { text: "loading profile: arthur", delay: 640, color: "#475569" },
  { text: "", delay: 800 },
  { text: "┌──────────────────────────────────────────────────────────┐", delay: 900 },
  { text: "│                                                          │", delay: 900 },
  { text: "│  Arthur — AI Student & App Builder.                      │", delay: 900, color: "#e2e8f0" },
  { text: "│                                                          │", delay: 900 },
  { text: "│  I build iOS and macOS apps in SwiftUI, automate things  │", delay: 900, color: "#94a3b8" },
  { text: "│  in Python, and write JavaScript when I have to.         │", delay: 900, color: "#94a3b8" },
  { text: "│  Currently working on BeatMap and RPtext.                │", delay: 900, color: "#94a3b8" },
  { text: "│  Learning in public.                                     │", delay: 900, color: "#94a3b8" },
  { text: "│                                                          │", delay: 900 },
  { text: "│  BSc Artificial Intelligence · Northumbria University    │", delay: 900, color: "#475569" },
  { text: "│  Newcastle, UK                                           │", delay: 900, color: "#475569" },
  { text: "│                                                          │", delay: 900 },
  { text: "└──────────────────────────────────────────────────────────┘", delay: 900 },
  { text: "", delay: 1050 },
  { text: 'type "help" for commands, or just explore.', delay: 1150, color: "#64748b" },
];

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
  { text: "                     Theme: dark [always]" },
];

const COWMSGS = ["moo. i mean, ship it.", "have you tried turning it off and on again?", "segfault in the matrix.", "git push --force and pray."];
function cowsay(msg) {
  const t = " " + "_".repeat(msg.length + 2), b = " " + "-".repeat(msg.length + 2);
  return [{ text: t }, { text: `< ${msg} >` }, { text: b }, { text: "        \\   ^__^" }, { text: "         \\  (oo)\\_______" }, { text: "            (__)\\       )\\/\\" }, { text: "                ||----w |" }, { text: "                ||     ||" }];
}

// ═══════════════════════════════════════════════════════════
// SESSION STORAGE
// ═══════════════════════════════════════════════════════════

const SK_LINES = "a3t-lines";
const SK_HIST  = "a3t-hist";

function saveState(lines, history) { try { sessionStorage.setItem(SK_LINES, JSON.stringify(lines.length > 300 ? lines.slice(-300) : lines)); sessionStorage.setItem(SK_HIST, JSON.stringify(history.slice(0, 50))); } catch {} }
function loadState() { try { const l = sessionStorage.getItem(SK_LINES), h = sessionStorage.getItem(SK_HIST); if (l) return { lines: JSON.parse(l), history: h ? JSON.parse(h) : [] }; } catch {} return null; }
function clearState() { try { sessionStorage.removeItem(SK_LINES); sessionStorage.removeItem(SK_HIST); } catch {} }
function cwdFromUrl() { if (typeof window === "undefined") return HOME; const p = window.location.pathname.replace(/\/+$/, "") || "/"; return URL_TO_PATH[p] || HOME; }

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
  const inputRef = useRef(null);
  const bodyRef = useRef(null);
  const linesRef = useRef([]);
  const histRef = useRef([]);

  useEffect(() => { linesRef.current = lines; }, [lines]);
  useEffect(() => { histRef.current = history; }, [history]);
  useEffect(() => { if (booted) saveState(lines, history); }, [lines, history, booted]);

  useEffect(() => {
    const saved = loadState();
    setCwd(cwdFromUrl());
    if (saved && saved.lines.length > 0) { setLines(saved.lines); setHistory(saved.history); setBooted(true); }
    else { const timers = BOOT.map(({ text, delay, color }) => setTimeout(() => setLines((p) => [...p, { text, color }]), delay)); const bt = setTimeout(() => setBooted(true), 1350); return () => { timers.forEach(clearTimeout); clearTimeout(bt); }; }
  }, []);

  useEffect(() => { if ((windowState === "normal" || windowState === "maximized") && bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight; }, [lines, windowState]);
  useEffect(() => { if (windowState === "normal" || windowState === "maximized") setTimeout(() => inputRef.current?.focus(), 50); }, [windowState]);

  const displayCwd = toDisplayPath(cwd);
  const out = useCallback((newLines) => setLines((p) => [...p, ...newLines]), []);

  const handleCommand = (raw) => {
    const trimmed = raw.trim();
    const prompt = { text: `arthur@arthur3 ${displayCwd} % ${raw}`, color: "#a78bfa" };
    setLines((p) => [...p, prompt]);
    if (!trimmed) return;
    setHistory((p) => [raw, ...p]);
    setHistoryIndex(-1);
    const parts = trimmed.split(/\s+/);
    const base = parts[0].toLowerCase();
    const args = parts.slice(1);
    const rawArgs = trimmed.slice(base.length).trim();

    if (base === "clear") { setLines([]); return; }

    // ── RESET — clear everything, replay boot, go home ──
    if (base === "reset") {
      clearState();
      setLines([]);
      setHistory([]);
      setHistoryIndex(-1);
      const currentPage = window.location.pathname.replace(/\/+$/, "") || "/";
      if (currentPage !== "/") { window.location.href = "/"; return; }
      setCwd(HOME);
      const timers = BOOT.map(({ text, delay, color }) => setTimeout(() => setLines((p) => [...p, { text, color }]), delay));
      setTimeout(() => setBooted(true), 1350);
      return;
    }

    // ── HOME — navigate to landing page ──
    if (base === "home") {
      const currentPage = window.location.pathname.replace(/\/+$/, "") || "/";
      if (currentPage === "/") { setCwd(HOME); out([{ text: "already home.", color: "#475569" }]); return; }
      const newLines = [...linesRef.current, prompt, { text: "going home...", color: "#34d399" }];
      saveState(newLines, [raw, ...histRef.current]);
      window.location.href = "/";
      return;
    }

    // ── CD ──
    if (base === "cd") {
      const target = args[0] || "~";
      if (target === "-") { out([{ text: "cd: OLDPWD not set", color: "#f87171" }]); return; }
      const resolved = resolvePath(cwd, target);
      const node = FS[resolved];
      if (!node) { out([{ text: `cd: ${target}: no such file or directory`, color: "#f87171" }]); return; }
      if (node.type !== "dir") { out([{ text: `cd: ${target}: not a directory`, color: "#f87171" }]); return; }
      if (node.url) {
        const currentPage = (window.location.pathname.replace(/\/+$/, "") || "/");
        if (node.url !== currentPage) { const newLines = [...linesRef.current, prompt]; saveState(newLines, [raw, ...histRef.current]); window.location.href = node.url; return; }
      }
      setCwd(resolved);
      return;
    }

    if (base === "pwd") { out([{ text: cwd }]); return; }

    // ── LS ──
    if (base === "ls") {
      const showHidden = args.includes("-a") || args.includes("-la") || args.includes("-al");
      const showLong = args.includes("-l") || args.includes("-la") || args.includes("-al");
      const pathArg = args.find((a) => !a.startsWith("-"));
      const target = pathArg ? resolvePath(cwd, pathArg) : cwd;
      const node = FS[target];
      if (!node) { out([{ text: `ls: ${pathArg}: no such file or directory`, color: "#f87171" }]); return; }
      if (node.type === "file") { out([{ text: pathArg || target.split("/").pop() }]); return; }
      let items = node.children || [];
      if (!showHidden) items = items.filter((i) => !i.startsWith("."));
      if (showLong) {
        if (showHidden) out([{ text: "total " + items.length }, { text: "drwxr-xr-x  .   ", color: "#60a5fa" }, { text: "drwxr-xr-x  ..  ", color: "#60a5fa" }]);
        items.forEach((item) => { const cp = target === "/" ? "/" + item : target + "/" + item; const cn = FS[cp]; const isDir = cn && cn.type === "dir"; const perms = isDir ? "drwxr-xr-x" : "-rw-r--r--"; const sz = cn && cn.content ? String(cn.content.length * 42).padStart(5) : "  4096"; const c = isDir ? "#60a5fa" : item.startsWith(".") ? "#475569" : item.endsWith(".py") || item.endsWith(".sh") ? "#4ade80" : "#94a3b8"; out([{ text: `${perms}  ${sz} Mar  7 00:00  ${item}${isDir ? "/" : ""}`, color: c }]); });
      } else {
        const result = items.map((item) => { const cp = target === "/" ? "/" + item : target + "/" + item; const cn = FS[cp]; const isDir = cn && cn.type === "dir"; return { text: isDir ? item + "/" : item, color: isDir ? "#60a5fa" : "#94a3b8" }; });
        out(result.length > 0 ? result : [{ text: "(empty)", color: "#475569" }]);
      }
      return;
    }

    if (base === "cat") { if (!args[0]) { out([{ text: "cat: missing operand", color: "#f87171" }]); return; } const t = resolvePath(cwd, args[0]); const n = FS[t]; if (!n) out([{ text: `cat: ${args[0]}: no such file or directory`, color: "#f87171" }]); else if (n.type === "dir") out([{ text: `cat: ${args[0]}: is a directory`, color: "#f87171" }]); else out(n.content.map((l) => ({ text: l }))); return; }
    if (base === "head") { const t = resolvePath(cwd, args[0] || ""); const n = FS[t]; if (!n || n.type !== "file") out([{ text: `head: cannot read`, color: "#f87171" }]); else out(n.content.slice(0, 5).map((l) => ({ text: l }))); return; }

    // ── OPEN ──
    if (base === "open") {
      const target = args[0];
      if (!target) { const node = FS[cwd]; if (node && node.url) { const cp = window.location.pathname.replace(/\/+$/, "") || "/"; if (node.url === cp) { out([{ text: "you're already here.", color: "#475569" }]); return; } const nl = [...linesRef.current, prompt, { text: `opening ${node.url}...`, color: "#34d399" }]; saveState(nl, [raw, ...histRef.current]); setTimeout(() => { window.location.href = node.url; }, 400); } else out([{ text: "open: no page for this directory", color: "#f87171" }]); return; }
      const resolved = resolvePath(cwd, target); const node = FS[resolved];
      if (node && node.url) { const nl = [...linesRef.current, prompt, { text: `opening ${node.url}...`, color: "#34d399" }]; saveState(nl, [raw, ...histRef.current]); setTimeout(() => { window.location.href = node.url; }, 400); }
      else if (target.startsWith("http")) { out([{ text: `opening ${target}...`, color: "#34d399" }]); setTimeout(() => { window.open(target, "_blank"); }, 400); }
      else out([{ text: `open: ${target}: no page associated`, color: "#f87171" }]);
      return;
    }

    // ── TREE ──
    if (base === "tree") {
      const target = args[0] ? resolvePath(cwd, args[0]) : cwd; const node = FS[target];
      if (!node || node.type !== "dir") { out([{ text: `tree: not a directory`, color: "#f87171" }]); return; }
      const tl = [{ text: toDisplayPath(target), color: "#60a5fa" }];
      function walk(p, pfx) { const n = FS[p]; if (!n || n.type !== "dir") return; const items = (n.children || []).filter((i) => !i.startsWith(".")); items.forEach((item, i) => { const last = i === items.length - 1; const cp = p === "/" ? "/" + item : p + "/" + item; const cn = FS[cp]; const isDir = cn && cn.type === "dir"; tl.push({ text: pfx + (last ? "└── " : "├── ") + item + (isDir ? "/" : ""), color: isDir ? "#60a5fa" : "#94a3b8" }); if (isDir) walk(cp, pfx + (last ? "    " : "│   ")); }); }
      walk(target, ""); out(tl); return;
    }

    if (base === "echo") { out([{ text: rawArgs.replace(/^["']|["']$/g, "") || "" }]); return; }
    if (base === "date") { out([{ text: new Date().toString() }]); return; }
    if (base === "whoami") { out([{ text: "arthur" }]); return; }
    if (base === "hostname") { out([{ text: "arthur3.com" }]); return; }
    if (base === "uname") { out([{ text: args.includes("-a") ? "arthur3-os 1.0.0 arthur3.com x86_64 GNU/Linux" : "arthur3-os" }]); return; }
    if (base === "uptime") { const m = Math.floor((Date.now() - new Date("2025-06-01").getTime()) / 2592000000); out([{ text: ` up ${m} months, 1 user, load average: 0.42, 0.69, 0.13` }]); return; }
    if (base === "history") { out([...history].reverse().map((c, i) => ({ text: `  ${String(i + 1).padStart(4)}  ${c}`, color: "#64748b" }))); return; }
    if (base === "which" || base === "type") { out([{ text: `${args[0] || "?"}: shell built-in command` }]); return; }

    if (base === "help") {
      out([
        { text: "┌────────────────────────────────────────────────────┐" },
        { text: "│  NAVIGATION                                        │" },
        { text: "│    cd <path>    change directory (.. ~ / relative)  │" },
        { text: "│    ls [-la]     list files and directories          │" },
        { text: "│    pwd          print working directory              │" },
        { text: "│    tree         show directory tree                  │" },
        { text: "│    cat <file>   read a file                         │" },
        { text: "│    open         navigate to current section's page   │" },
        { text: "│    home         go back to the landing page          │" },
        { text: "│    reset        clear session and restart            │" },
        { text: "│                                                      │" },
        { text: "│  cd to a section navigates to that page.            │", color: "#4ade80" },
        { text: "│  terminal state persists across pages.              │", color: "#4ade80" },
        { text: "│                                                      │" },
        { text: "│  INFO                                                │" },
        { text: "│    about  skills  contact  neofetch                  │" },
        { text: "│                                                      │" },
        { text: "│  SYSTEM                                              │" },
        { text: "│    whoami hostname uname date uptime echo history    │" },
        { text: "│                                                      │" },
        { text: "│  there are also some hidden commands...              │", color: "#475569" },
        { text: "└────────────────────────────────────────────────────┘" },
      ]);
      return;
    }

    if (base === "about") { out([{ text: "arthur@arthur3.com", color: "#6366f1" }, { text: "──────────────────" }, { text: "AI undergraduate @ Northumbria University" }, { text: "Building at the intersection of AI, security," }, { text: "and software engineering." }, { text: "" }, { text: "Currently shipping:" }, { text: "  → BeatMap  — iOS music tagging app (SwiftUI)" }, { text: "  → RPtext   — text-based RPG with AI NPCs" }, { text: "" }, { text: "When I'm not in lectures, I'm in the terminal." }]); return; }
    if (base === "skills") { out([{ text: "TECH STACK", color: "#6366f1" }, { text: "──────────" }, { text: "Languages   Swift · Python · TypeScript · JS" }, { text: "Mobile      SwiftUI · Core Data · ShazamKit" }, { text: "AI          Claude API · Ollama · LLM tooling" }, { text: "Web         Astro · React · Cloudflare Pages" }, { text: "Tools       Git · Docker · Linux · Vim" }]); return; }
    if (base === "contact") { out([{ text: "CONTACT", color: "#6366f1" }, { text: "───────" }, { text: "GitHub    github.com/Dr-Snatch" }, { text: "Email     arthurwheildon0@gmail.com" }, { text: "Twitter   x.com/ExpoArturo" }, { text: "LinkedIn  linkedin.com/in/arthurwheildon" }]); return; }
    if (base === "projects") { out([{ text: "PROJECTS", color: "#6366f1" }, { text: "────────" }, { text: "BeatMap    iOS music journaling — v1.1.0" }, { text: "RPtext     AI text RPG — core systems functional" }, { text: "" }, { text: "cd ~/projects to explore, or 'open' to visit the page", color: "#475569" }]); return; }

    // ═══════ EASTER EGGS ═══════
    if (base === "neofetch") { out(NEOFETCH); return; }
    if (base === "cowsay") { out(cowsay(rawArgs || COWMSGS[Math.floor(Math.random() * COWMSGS.length)])); return; }
    if (base === "fortune") { const q = FS["/usr/share/fortune/quotes.txt"].content; out([{ text: q[Math.floor(Math.random() * q.length)], color: "#fbbf24" }]); return; }
    if (base === "sudo") { if (rawArgs.startsWith("rm -rf")) out([{ text: "[sudo] password for arthur: ********", color: "#f87171" }, { text: "nice try. this is a portfolio, not a sandbox." }, { text: "incident reported to /dev/null." }]); else if (rawArgs === "make me a sandwich") out([{ text: "okay.", color: "#4ade80" }]); else out([{ text: "[sudo] password for arthur: ********", color: "#f87171" }, { text: "arthur is not in the sudoers file. this incident will be reported." }]); return; }
    if (base === "rm") { out([{ text: rawArgs.includes("-rf") ? "rm: nice try. refusing to destroy everything." : "rm: read-only filesystem", color: "#f87171" }]); return; }
    if (base === "touch") { out([{ text: args[0] === "grass" ? "good advice. going outside..." : "touch: read-only filesystem", color: args[0] === "grass" ? "#4ade80" : "#f87171" }]); return; }
    if (base === "mkdir" || base === "mv" || base === "cp") { out([{ text: `${base}: read-only filesystem`, color: "#f87171" }]); return; }
    if (base === "vim" || base === "vi") { out([{ text: "~" }, { text: "~" }, { text: "~                    VIM - Vi IMproved" }, { text: "~" }, { text: "~             you're stuck now. there's no escape." }, { text: "~                    (just kidding, type :q)" }, { text: "~" }]); return; }
    if (base === "emacs") { out([{ text: "emacs: great operating system, terrible text editor.", color: "#fbbf24" }, { text: "(this terminal is a vim household.)" }]); return; }
    if (base === "nano") { out([{ text: "nano is valid and I respect your choice.", color: "#4ade80" }]); return; }
    if (base === "code" || base === "code.") { out([{ text: "VS Code... the Switzerland of editors.", color: "#60a5fa" }]); return; }
    if (base === "python" || base === "python3") { out([{ text: "Python 3.12.0 (totally real)", color: "#fbbf24" }, { text: ">>> import antigravity" }, { text: "    (you are now floating)" }, { text: ">>> exit()" }]); return; }
    if (base === "node") { out([{ text: "Welcome to Node.js v24.12.0." }, { text: "> require('happiness')" }, { text: "Error: Cannot find module 'happiness'", color: "#f87171" }]); return; }
    if (base === "npm") { out(args[0] === "install" ? [{ text: "added 847 packages in 2s", color: "#4ade80" }, { text: "37 vulnerabilities (12 moderate, 25 high)", color: "#fbbf24" }, { text: "  good luck." }] : [{ text: `npm: '${args[0] || ""}' — sure, whatever.` }]); return; }
    if (base === "git") { if (args[0] === "status") out([{ text: "On branch main" }, { text: "nothing to commit, working tree clean", color: "#4ade80" }]); else if (args[0] === "log") out([{ text: "commit 2b07eed (HEAD -> main)", color: "#fbbf24" }, { text: "Author: arthur <arthurwheildon0@gmail.com>" }, { text: "" }, { text: "    Add projects, swift, lab section pages" }]); else if (args[0] === "blame") out([{ text: "it was you. it's always you." }]); else out([{ text: `git: '${args[0] || ""}' is not a git command.` }]); return; }
    if (base === "ping") { const h = args[0] || "localhost"; out([{ text: `PING ${h}: 56 data bytes` }, { text: `64 bytes from ${h}: icmp_seq=0 time=0.042 ms` }, { text: `64 bytes from ${h}: icmp_seq=1 time=0.069 ms` }, { text: "" }, { text: "3 packets transmitted, 3 received, 0% loss", color: "#4ade80" }]); return; }
    if (base === "curl") { out([{ text: '{"status":"alive","mood":"caffeinated","shipping":true}', color: "#4ade80" }]); return; }
    if (base === "make") { out([{ text: args[0] === "coffee" ? "☕ brewing..." : `make: *** No rule to make target '${args[0] || ""}'. Stop.`, color: args[0] === "coffee" ? "#fbbf24" : "#f87171" }]); return; }
    if (base === "man") { out([{ text: `No manual entry for ${args[0] || "life"}.` }, { text: "RTFM? there is no FM. just vibes.", color: "#475569" }]); return; }
    if (base === "apt" || base === "apt-get") { out([{ text: "E: Could not open lock file — are you root?", color: "#f87171" }]); return; }
    if (base === "brew") { out([{ text: "Error: This is Linux, not macOS. Oh wait...", color: "#fbbf24" }]); return; }
    if (base === "exit" || base === "logout") { out([{ text: "there's no escape. you live here now." }]); return; }
    if (base === "reboot" || base === "shutdown") { out([{ text: "system going down for reboot...", color: "#f87171" }, { text: "..." }, { text: "just kidding. refresh the page." }]); return; }
    if (base === "hack" || base === "hackerman") { out([{ text: "initiating hack sequence..." }, { text: "▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ 100%", color: "#4ade80" }, { text: "ACCESS GRANTED", color: "#4ade80" }, { text: "" }, { text: "just kidding. this is a portfolio." }]); return; }
    if (base === "coffee" || base === "cafe") { out([{ text: "     ( (" }, { text: "      ) )" }, { text: "   .______." }, { text: "   |      |]" }, { text: "   \\      /" }, { text: "    '----'" }, { text: "" }, { text: "coffee.service: active (running)", color: "#4ade80" }]); return; }
    if (base === "matrix") { out([{ text: "wake up, Neo...", color: "#4ade80" }, { text: "the Matrix has you...", color: "#4ade80" }, { text: "follow the white rabbit.", color: "#4ade80" }, { text: "" }, { text: "(or just keep browsing this portfolio)" }]); return; }
    if (base === "sl") { out([{ text: "      ====        ________                ___________" }, { text: "  _D _|  |_______/        \\__I_I_____===__|_________/" }, { text: "   |(_)---  |   H\\________/ |   |        =|___ ___|" }, { text: "" }, { text: "you meant 'ls', didn't you?", color: "#475569" }]); return; }
    if (base === "hello" || base === "hi" || base === "hey") { const g = ["hey!", "hello there.", "sup.", "oh hi.", "greetings, human."]; out([{ text: g[Math.floor(Math.random() * g.length)], color: "#4ade80" }]); return; }
    if (base === "42" || trimmed === "the answer") { out([{ text: "to life, the universe, and everything.", color: "#fbbf24" }]); return; }
    if (base === "xkcd") { out([{ text: "there's always a relevant xkcd. always." }]); return; }
    if (base === "rickroll" || trimmed === "never gonna") { out([{ text: "Never gonna give you up", color: "#f87171" }, { text: "Never gonna let you down", color: "#fbbf24" }, { text: "Never gonna run around and desert you", color: "#4ade80" }]); return; }

    out([{ text: `zsh: command not found: ${base}`, color: "#f87171" }, { text: 'type "help" for available commands', color: "#475569" }]);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") { e.preventDefault(); handleCommand(input); setInput(""); }
    else if (e.key === "ArrowUp") { e.preventDefault(); const n = Math.min(historyIndex + 1, history.length - 1); setHistoryIndex(n); setInput(history[n] || ""); }
    else if (e.key === "ArrowDown") { e.preventDefault(); const n = Math.max(historyIndex - 1, -1); setHistoryIndex(n); setInput(n === -1 ? "" : history[n]); }
    else if (e.key === "l" && e.ctrlKey) { e.preventDefault(); setLines([]); }
    else if (e.key === "c" && e.ctrlKey) { e.preventDefault(); setLines((p) => [...p, { text: `arthur@arthur3 ${displayCwd} % ${input}^C`, color: "#a78bfa" }]); setInput(""); }
    else if (e.key === "Tab") {
      e.preventDefault(); const partial = input.split(/\s+/).pop() || ""; if (!partial) return;
      const node = FS[cwd]; if (!node || node.type !== "dir") return;
      const matches = (node.children || []).filter((c) => c.startsWith(partial));
      if (matches.length === 1) { const pp = input.split(/\s+/); pp[pp.length - 1] = matches[0]; const cp = cwd === "/" ? "/" + matches[0] : cwd + "/" + matches[0]; const cn = FS[cp]; if (cn && cn.type === "dir") pp[pp.length - 1] += "/"; setInput(pp.join(" ")); }
      else if (matches.length > 1) setLines((p) => [...p, { text: matches.join("  "), color: "#64748b" }]);
    }
  };

  const isMax = windowState === "maximized", isMin = windowState === "minimized", isClosed = windowState === "closed";

  return (
    <>
      <style>{`
        .term-tab{position:fixed;bottom:0;right:32px;z-index:9999;display:flex;align-items:center;gap:8px;padding:8px 18px 8px 14px;background:#111118;border:1px solid #1e1e2e;border-bottom:none;border-radius:8px 8px 0 0;cursor:pointer;transition:background .15s;box-shadow:0 -4px 20px rgba(99,102,241,.08);user-select:none}.term-tab:hover{background:#16161f}.term-tab-dot{width:7px;height:7px;border-radius:50%;background:#6366f1;box-shadow:0 0 6px rgba(99,102,241,.7);animation:tabpulse 2s ease-in-out infinite}@keyframes tabpulse{0%,100%{opacity:1}50%{opacity:.35}}.term-tab-label{font-family:'JetBrains Mono',monospace;font-size:11px;color:#64748b;letter-spacing:.05em}.term-tab-open{font-family:'JetBrains Mono',monospace;font-size:10px;color:#334155}.term-overlay{position:fixed;inset:0;z-index:9998;background:rgba(0,0,0,.6);backdrop-filter:blur(2px)}.term-window{background:#0f0f0f;border:1px solid #1e1e2e;border-radius:12px;overflow:hidden;width:100%;display:flex;flex-direction:column;box-shadow:0 0 0 1px rgba(99,102,241,.08),0 25px 60px rgba(0,0,0,.6),0 0 80px rgba(99,102,241,.05);transition:box-shadow .2s}.term-window.maximized{position:fixed;inset:40px;z-index:9999;border-radius:14px;width:auto;box-shadow:0 0 0 1px rgba(99,102,241,.15),0 40px 100px rgba(0,0,0,.9),0 0 120px rgba(99,102,241,.1)}.term-titlebar{display:flex;align-items:center;gap:7px;padding:11px 16px;background:#111118;border-bottom:1px solid #1a1a2e;position:relative;flex-shrink:0;user-select:none}.term-btn{width:12px;height:12px;border-radius:50%;flex-shrink:0;border:none;cursor:pointer;padding:0;transition:filter .15s}.term-btn:hover{filter:brightness(1.25)}.term-btn-close{background:#ff5f57}.term-btn-min{background:#febc2e}.term-btn-max{background:#28c840}.term-btn-group{display:flex;gap:7px;align-items:center}.term-titlebar-label{position:absolute;left:50%;transform:translateX(-50%);font-family:'JetBrains Mono',monospace;font-size:11px;color:#334155;letter-spacing:.05em;pointer-events:none;white-space:nowrap}.term-body{padding:18px 20px 4px;height:320px;overflow-y:auto;scrollbar-width:thin;scrollbar-color:#1e293b transparent;flex-shrink:0}.term-window.maximized .term-body{flex:1;height:auto}.term-body::-webkit-scrollbar{width:4px}.term-body::-webkit-scrollbar-thumb{background:#1e293b;border-radius:2px}.term-line{font-family:'JetBrains Mono',monospace;font-size:12.5px;line-height:1.65;white-space:pre}.term-window.maximized .term-line{font-size:14px}.term-input-row{display:flex;align-items:center;gap:8px;padding:10px 20px 14px;border-top:1px solid #111;flex-shrink:0}.term-prompt{font-family:'JetBrains Mono',monospace;font-size:12.5px;color:#6366f1;white-space:nowrap;user-select:none;flex-shrink:0}.term-window.maximized .term-prompt{font-size:14px}.term-input{flex:1;background:transparent;border:none;outline:none;font-family:'JetBrains Mono',monospace;font-size:12.5px;color:#e2e8f0;caret-color:#6366f1;min-width:0}.term-window.maximized .term-input{font-size:14px}
      `}</style>
      {isMin && <button className="term-tab" onClick={() => setWindowState("normal")} aria-label="Restore terminal"><span className="term-tab-dot" /><span className="term-tab-label">arthur@arthur3 {displayCwd}</span><span className="term-tab-open">↑</span></button>}
      {isMax && <div className="term-overlay" onClick={() => setWindowState("normal")} />}
      {!isClosed && !isMin && (
        <div className={`term-window${isMax ? " maximized" : ""}`} onClick={() => inputRef.current?.focus()}>
          <div className="term-titlebar">
            <div className="term-btn-group">
              <button className="term-btn term-btn-close" onClick={(e) => { e.stopPropagation(); setWindowState("closed"); }} title="Close" />
              <button className="term-btn term-btn-min" onClick={(e) => { e.stopPropagation(); setWindowState("minimized"); }} title="Minimise" />
              <button className="term-btn term-btn-max" onClick={(e) => { e.stopPropagation(); setWindowState((s) => s === "maximized" ? "normal" : "maximized"); }} title={isMax ? "Restore" : "Maximise"} />
            </div>
            <span className="term-titlebar-label">arthur@arthur3 {displayCwd} — zsh</span>
          </div>
          <div className="term-body" ref={bodyRef}>{lines.map((l, i) => <div key={i} className="term-line" style={{ color: l.color || "#94a3b8" }}>{l.text}</div>)}</div>
          <div className="term-input-row">
            <span className="term-prompt">arthur@arthur3 {displayCwd} %</span>
            <input ref={inputRef} className="term-input" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyDown} autoFocus spellCheck={false} autoComplete="off" autoCapitalize="off" disabled={!booted} />
          </div>
        </div>
      )}
      {isClosed && <button className="term-tab" onClick={() => setWindowState("normal")} aria-label="Open terminal"><span className="term-tab-dot" /><span className="term-tab-label">terminal</span><span className="term-tab-open">↑</span></button>}
    </>
  );
}
