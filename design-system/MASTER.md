# PWL Journal Design System

This is the global source of truth for the PWL Journal personal blog's UI, UX, styling, typography, and motion guidelines.

## 🎨 Visual Identity & Style

### Glassy Background Design
- **Theme**: Premium Glassmorphism & Subtle Dynamic Glow
- **Effect**: Abstract moving gradient background with 16 floating colored shapes (Rose, Amber, Teal, Sky, Emerald, Cyan) blurred at `blur-[60px]` overlayed with a `backdrop-blur-[70px] bg-bg/20` screen mask.
- **Card Styling & Transparency**:
  - **Light Mode**: Translucent 3D glass cards with white highlight borders and soft inset shadows to create a glass pane feel:
    - `background: rgba(255, 255, 255, 0.25)`
    - `border: 1px solid rgba(255, 255, 255, 0.45)`
    - `box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.03), inset 1px 1px 0 0 rgba(255, 255, 255, 0.5), inset -1px -1px 0 0 rgba(0, 0, 0, 0.03)`
  - **Dark Mode (Night Mode)**: Card background and base page background are set to **pure black** (`#000000`) for absolute high contrast, utilizing thin semi-transparent white border highlights for depth:
    - `background: #000000`
    - `border: 1px solid rgba(255, 255, 255, 0.08)`
    - `box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.6), inset 1px 1px 0 0 rgba(255, 255, 255, 0.03)`

### Typography
- **Core Font**: Apple System Fonts (`-apple-system`, `BlinkMacSystemFont`, `"SF Pro Text"`, `"SF Pro Display"`, `"PingFang SC"`, `"Hiragino Sans GB"`, `"Microsoft YaHei"`, `sans-serif`).
- **Setup**: Overrode the default Tailwind sans font family to prioritize Apple system typography for native rendering precision.

### Colors (Theme Mappings)
All colors are resolved using custom CSS variables (preventing default Tailwind palette usage):
- `primary`: Teal/Cyan HSL brand accent
- `secondary`: Emerald green HSL
- `accent`: Amber/Orange HSL
- `bg`: Background HSL base (light mode: soft blue-gray; dark mode: pure black `#000000`)
- `card`: Card backdrop HSL base (light mode: translucent white; dark mode: pure black `#000000`)
- `text`: Text content HSL base
- `muted`: Muted secondary text HSL base
- `border`: Divider & border HSL base

---

## ⚡ Motion & Interaction

### Text Reveal Animation (`TextAnimate.vue`)
- **Behavior**: Inspired by MagicUI's text animation, the `<TextAnimate>` component splits texts into characters or words, applying a staggered CSS delay as elements scroll into viewport via `IntersectionObserver`.
- **Animate State**: Stretches and reveals with `opacity-100 translate-y-0 blur-none`, transitioning from `opacity-0 translate-y-4 blur-[3px]`.

### Easing Curves
- Standard linear or `ease-in-out` transitions are **strictly banned** for primary interactive components.
- Custom Easing:
  - `.ease-custom` (`cubic-bezier(0.25, 1, 0.5, 1)`) - used for slide button, text animate reveal, and page reveals.
  - `.ease-out-back` (`cubic-bezier(0.34, 1.56, 0.64, 1)`) - used for bounce-back elastic hover feels.

### Inertia Momentum Scrolling
- Driven by the **Lenis Scroll Engine**.
- Scroll duration is set to `1.2s` with custom exponential decay: `(t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))` for smooth inertia.

---

## 🚫 Anti-Patterns & Bans
1. **No Purple or Indigo Gradients**: All gradients must use teal, amber, sky, or rose colors.
2. **No Hero + Three Card layouts**: Layouts must be asymmetric and Bento-like.
3. **No Perfect Center Alignment**: Keep components off-center, left-aligned, or staggered.
4. **No Emoji Functional Icons**: All icons must use vector-based SVGs or `<iconify-icon>` web components.
5. **No Tailwind Default Color Palette**: Direct color hexes or default Tailwind slate/blue/zinc classes are banned. All styling maps to theme variables.
6. **No Linear/Ease-in-out Transitions**: Use custom bezier curves instead.
