# 🏛️ Rock Studio — Software Architecture & Developer Guide

> **Version:** `0.16.0`  
> **Stack:** React 19, Vite, Tailwind CSS, Framer Motion, Web Audio API  
> **Brand Palette:** Obsidian Cyber (`#050508`) & Cyan Electric (`#67E8F9`)

---

## 1. 📁 Directory Structure & Architecture

The codebase follows **Feature-Driven & Clean Component Architecture**. Every domain feature is encapsulated with its own subcomponents, custom hooks, and layout constants.

```
Rock-Studio/
├── src/
│   ├── assets/                 # Next-gen WebP images, MP4 preview clips, and posters
│   │   └── projects/           # High-resolution case study assets and scroll previews
│   │
│   ├── components/
│   │   ├── common/             # Universal utilities across routes (ScrollToTop, etc.)
│   │   ├── layouts/            # Global structural shells (Navbar, Footer)
│   │   ├── ui/                 # Foundational canvas & shader effects (DataRain)
│   │   └── features/           # Domain-driven modular feature components
│   │       ├── Hero/           # Hero section, ScatterLetter & TechText shaders
│   │       ├── Statement/      # Letter-by-letter manifesto dissolve effect
│   │       ├── Story/          # Founders spotlight & cinematic narrative timeline
│   │       ├── Work/           # 3D DriftWall showcase & ProjectPortalNav
│   │       ├── Contact/        # 3D Mechanical keyboard, audio synthesis & lead form
│   │       └── ProjectDetail/  # Case study layout (Header, Hero, Media, Services, View)
│   │
│   ├── data/                   # Centralized application state and content schemas
│   │   ├── projects.js         # Complete portfolio projects roster and metadata
│   │   └── founders.js         # Co-founders profile definitions and spotlight ranges
│   │
│   ├── hooks/                  # Reusable custom React hooks
│   │   └── useMobile.js        # SSR-safe responsive viewport breakpoint detector
│   │
│   ├── lib/                    # Core libraries, design tokens, and preloaders
│   │   ├── constants.js        # Design tokens, color palette, easings, social links
│   │   ├── preloadImages.js    # Browser preloader for zero-latency image transitions
│   │   └── utils.js            # Tailwind merge and utility helpers (cn)
│   │
│   ├── pages/                  # Page route containers
│   │   ├── Home.jsx            # Single-page portfolio orchestrator
│   │   └── ProjectDetail.jsx   # Case study page with full-page zoom transitions
│   │
│   ├── App.jsx                 # Application entry, router, and background layers
│   ├── main.jsx                # React root mount
│   └── index.css               # Global typography, Tailwind directives & CSS resets
│
├── ARCHITECTURE.md             # This document
├── vercel.json                 # CDN caching rules, SPA routing rewrites
└── package.json                # Project dependencies and script runner
```

---

## 2. 🎨 Design System & Constants (`src/lib/constants.js`)

All brand colors, animation easings, responsive breakpoints, and external links are strictly centralized in `src/lib/constants.js`:

```javascript
import { THEME, EASINGS, SOCIAL_LINKS, BREAKPOINTS } from "@/lib/constants";
```

- **`THEME.colors.primary`**: `#67E8F9` (Cyan Electric)
- **`THEME.colors.background`**: `#050508` (Obsidian Cyber)
- **`EASINGS.expoOut`**: `[0.16, 1, 0.3, 1]`
- **`EASINGS.cinematic`**: `[0.22, 1, 0.36, 1]`
- **`BREAKPOINTS.mobile`**: `768px`

---

## 3. 🧩 Key Modules & Architectural Subsystems

### 3.1. Work & 3D DriftWall (`src/components/features/Work/`)
- **`Work.jsx`**: Coordinates scroll-driven spring physics using `framer-motion` (`useScroll`, `useSpring`).
- **`DriftWall.jsx`**: Renders 3D perspective grid of portfolio tiles.
  - **Adaptive Columns**: 3 columns on mobile (`width < 768px`), 5 columns on desktop.
  - **Video Previews**: Plays lightweight MP4 hover clips on desktop hover or mobile tap.
- **`ProjectPortalNav.jsx`**: Floating corner navigation bar for project case studies.
  - **Desktop**: Hovering over Next/Previous reveals animated project card; click navigates.
  - **Mobile Touch Handling**: Immediate tap (< 600ms without dragging) navigates directly; continuous 2-second hold reveals project preview without accidental scroll interruptions.

### 3.2. Contact & 3D Mechanical Keyboard (`src/components/features/Contact/`)
- **`Contact.jsx`**: Section orchestrator binding 3D perspective scroll fold animation.
- **`ContactForm.jsx`**: Lead capture inputs (`name`, `phone`, `message`), Persian/English phone sanitizer, status feedback, and social links.
- **`ContactKeyboard.jsx`**: 75% Mac ANSI mechanical keyboard rendered with CSS 3D transforms, ripple illumination, and key depression states.
- **`keyboardData.js`**: Key matrices (`ROWS`, `BY_CODE`, `BY_CHAR`) and switch acoustic physics parameters (`VAR_MAP`).
- **`useKeyboardAudio.js`**: Custom Web Audio API synthesizer. Dynamically constructs bandpass noise bursts and low-frequency sine resonance on every keystroke.

### 3.3. Project Case Studies (`src/pages/ProjectDetail.jsx` & `src/components/features/ProjectDetail/`)
- **`ProjectDetail.jsx`**: Page container handling URL slug matching, dynamic transform-origin calculation, and full-page zoom expansion animations.
- **`ProjectView.jsx`**: Composition wrapper rendering the full case study presentation.
- **`ProjectHeader.jsx`**: Navigation bar with back-link and action CTA.
- **`ProjectHero.jsx`**: Title, description, and responsive 4-column Bento metadata grid.
- **`ProjectMedia.jsx`**: Custom 4K video player with sleek seek bar, time counter, mute toggle, and fullscreen controls, or fallback browser mockups.
- **`ProjectServices.jsx`**: Deliverables list, technology pill tags, project inquiry CTA, and next case study teaser card.

### 3.4. Story & Founders Spotlight (`src/components/features/Story/`)
- **`OurStory.jsx`**: Orchestrates sticky scroll container with progressive timeline.
- **`src/data/founders.js`**: Structured roster of studio founders with spotlight coordinates (`box: { left, top, width, height }`) and scroll progress ranges (`range: [inStart, inEnd, outStart, outEnd]`).

---

## 4. 🚀 How to Extend the Project

### Adding a New Case Study
1. Place assets inside `src/assets/projects/` (prefer `.webp` for images, compressed `.mp4` for video).
2. Open `src/data/projects.js` and add a new entry conforming to the `Project` schema:
```javascript
{
  id: "my-project",
  slug: "my-project",
  title: "My Project Title",
  category: "Motion & Identity",
  description: "A short synopsis of the case study.",
  client: "Client Name",
  year: "2025",
  image: projectImg,
  scrollImage: projectScrollWebp, // Optional 700px lightweight preview
  video: projectVideoMp4,         // Optional 4K video file
  hoverClip: projectPreviewMp4,   // Optional loop clip for DriftWall
  services: ["Art Direction", "Full-Stack Dev"],
  tags: ["React", "WebGL", "Tailwind CSS"],
}
```
3. The new project will automatically populate:
   - 3D DriftWall in the Work section
   - Next/Previous Portal Navigation
   - Dedicated route at `/projects/my-project`

### Adding a New Team Member / Founder
1. Add portrait asset to `src/assets/` as `.webp`.
2. Add definition to `src/data/founders.js`:
```javascript
{
  id: "name",
  name: "Name",
  role: "Creative Role",
  tagline: "Studio Motto",
  image: portraitImg,
  quote: "Personal quote or philosophy.",
  skills: ["Skill 1", "Skill 2"],
  box: { left: "20%", top: "10%", width: "30%", height: "80%" },
  range: [0.2, 0.28, 0.45, 0.52],
}
```

---

## 5. 🛠️ Development & Quality Assurance

```bash
# Start development server
npm run dev

# Run ESLint validation
npm run lint

# Production build check
npm run build

# Preview production build locally
npm run preview
```

> **Rule for Contributors**: Maintain zero ESLint errors and ensure bundle build succeeds prior to pushing to `main`.
