# High-End Blog Homepage Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the blog into a more complete, premium-looking homepage with smooth motion while keeping the existing Vue 3 + Vite stack and markdown-based posts intact.

**Architecture:** Keep content loading local and static. The homepage becomes a composed landing page with a hero, featured article, latest posts, topic chips, and an about/CTA block. Shared shell styling moves into the app wrapper and global CSS so the layout, motion, and background treatment feel consistent across the home, post, and about views.

**Tech Stack:** Vue 3, Vue Router 4, Vite, Tailwind CSS, `front-matter`, `marked`

## Global Constraints

- Keep the current framework stack unchanged.
- Continue loading posts from `src/posts/*.md`.
- Preserve dark mode support with the existing `class` strategy.
- Keep motion subtle and performant.
- Avoid introducing external runtime dependencies.

---

### Task 1: Rebuild the app shell and global theme layer

**Files:**
- Modify: `src/App.vue`
- Modify: `src/assets/main.css`
- Modify: `index.html`

**Interfaces:**
- Consumes: existing `Navbar`, `Footer`, and `router-view`
- Produces: a consistent shell with decorative background layers and a wider content canvas

- [ ] Update `App.vue` to wrap the app in a premium background shell with fixed decorative gradients behind the content.
- [ ] Replace the minimal body styling in `main.css` with global typography, selection, scrollbar, and animation utilities.
- [ ] Set the document language in `index.html` to `zh-CN` and give the page a cleaner default title.

### Task 2: Turn the homepage into a complete editorial landing page

**Files:**
- Modify: `src/views/HomeView.vue`

**Interfaces:**
- Consumes: markdown front matter from `src/posts/*.md`
- Produces: hero content, featured post, latest post grid, topic chips, and author CTA blocks

- [ ] Load all posts, sort them by date, and derive featured and topic summary data.
- [ ] Build a multi-section homepage with a strong hero, a featured post card, a latest-posts grid, and a lightweight about/CTA area.
- [ ] Add staggered reveal timing and hover states so the page feels animated without needing a JS animation library.

### Task 3: Polish the supporting views and navigation

**Files:**
- Modify: `src/components/Navbar.vue`
- Modify: `src/components/Footer.vue`
- Modify: `src/views/PostView.vue`
- Modify: `src/views/AboutView.vue`

**Interfaces:**
- Consumes: router navigation and rendered markdown content
- Produces: cohesive chrome and article presentation across the whole site

- [ ] Upgrade the navbar to match the new visual language and keep theme switching intact.
- [ ] Refresh the footer so it feels intentional rather than default boilerplate.
- [ ] Rework the article page to improve spacing, hierarchy, and readability for markdown content.
- [ ] Align the about page with the new design system so the entire site feels like one product.

### Task 4: Verify the build

**Files:**
- None

**Interfaces:**
- Consumes: the updated Vite app
- Produces: a successful production build or concrete errors to fix

- [ ] Run `npm run build`.
- [ ] Fix any build-time regressions caused by template, import, or CSS changes.
- [ ] Re-run `npm run build` until the output is clean.
