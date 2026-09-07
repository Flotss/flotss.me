# Antigravity CLI Guidelines — flotss.me

Welcome to the **flotss.me** repository! This document defines workspace rules, architectural conventions, and quality standards for Antigravity AI agents working in this project.

---

## 1. Project Overview & Tech Stack

- **Framework**: Next.js 16 (Pages Router) with React 19 and Turbopack
- **Language**: TypeScript (strict mode enabled)
- **Styling**: Tailwind CSS & Chakra UI (custom dark theme with glassmorphism aesthetics)
- **Graphics / 3D**: Three.js, `@react-three/fiber`, `@react-three/drei`, Framer Motion
- **Database / ORM**: Prisma ORM
- **Testing**: Jest & `@testing-library/react`
- **Linting & Formatting**: ESLint 9 & Prettier

---

## 2. Essential Commands

| Command | Purpose |
| :--- | :--- |
| `npm run dev` | Starts local Next.js development server on `http://localhost:3000` |
| `npm run lint` | Runs ESLint and Prettier check across the codebase |
| `npm run lint:fix` | Automatically formats and fixes linting issues |
| `npm test` | Runs Jest unit and security test suites |
| `npm run build` | Compiles Next.js production build with Turbopack |

> Always verify changes by running `npm run lint`, `npm test`, and `npm run build` before committing.

---

## 3. Architecture & React 19 Rules

1. **React 19 Hooks Rules**:
   - Never assign or mutate `ref.current` during rendering (`react-hooks/refs`).
   - Memoize complex calculations and filter options with `useMemo` and stable callbacks with `useCallback`.
   - Avoid side-effects or infinite update loops inside `useEffect` / `useToast`.

2. **SSR & Hydration Integrity**:
   - Always ensure deterministic HTML rendering. Avoid `Math.random()` or client-only dynamic dates in components rendered on the server.
   - For components requiring browser APIs or Three.js canvas, use dynamic imports with `{ ssr: false }`.

3. **Routing & Internal Navigation**:
   - Use `next/link` for internal links to preserve SPA transitions without full-page refreshes.
   - Always use absolute paths with leading slash (e.g. `/projects/${name}`) to prevent broken nested navigation when clicking links from `/projects`.

4. **Design & Styling Guidelines**:
   - Maintain the refined dark aesthetic: zinc-950/black background, subtle borders (`border-white/5` or `border-white/10`), glassmorphism (`backdrop-blur-md`/`backdrop-blur-xl`), and signature emerald (`emerald-400`/`emerald-500`) accents.
   - **Green / Emerald Accents**: Primary actions, CTAs, commit timelines, and active indicators use emerald green. Never use blue/cyan for commits.
   - **Repository Metrics (Stars, Forks, Watchers)**: Always rendered as clean neutral badges (`border-white/10 bg-white/[0.04] text-zinc-300`) with neutral icons—never use rainbow colors (no yellow stars, no cyan forks, no purple watchers).
   - **Languages**: Standard GitHub language color mappings are preserved for language indicators and breakdown bars.
   - **Alerts**: Red and orange are strictly reserved for critical alerts, error states, and private locks.
   - Language of user-facing UI copy: **English**.

---

## 4. Security & Sensitive Files

1. **SSRF & Input Validation**:
   - Every GitHub API interaction must pass through `ValidationUtils` (`isValidGithubOwner`, `isValidGithubRepo`, `isValidCommitHashOrNumber`) to prevent Server-Side Request Forgery (`js/request-forgery`).
2. **Environment Secrets**:
   - **NEVER** commit `.env` or sensitive API keys to git.
   - Keep `.env` strictly local.

---

## 5. Antigravity CLI Best Practices

- Interactive configuration can be accessed inside the CLI via `/config` or `/settings`.
- Global CLI settings are stored in `~/.gemini/antigravity-cli/settings.json`.
- When running commands requiring filesystem access outside the workspace or writing `.git`, use `BypassSandbox: true`.
