---
name: react-component
description: Scaffold a new UI component that follows this project's structure (folder, CSS Module, tokens, icon usage, a11y). Use when adding any new section or control to the listing page.
---

# New component checklist

1. Create `frontend/src/components/<Name>/<Name>.jsx` and `<Name>.module.css`.
2. Export a named function component. Data arrives via props; the only fetch
   lives in `App.jsx` (`useListing`).
3. Styles: use tokens from `styles/tokens.css` (`var(--ink)`, `var(--line)`,
   `var(--grey-200)`, `var(--reserve)`...). Section headings are 22px/26px/500;
   section padding 32px (left column) or 48px (wide sections) with a
   `1px solid var(--line-soft)` top border.
4. Icons: import from `components/icons` and size with a wrapper
   (`<span style={{width:24,height:24}}><Icon/></span>` or a CSS class).
5. Buttons: reuse `ui/Button` (`primary | outline | soft | link`) and
   `ui/IconButton`; never restyle a `<div>` as a button.
6. Transitions: use the reference timings (0.15s background, 0.05s transform,
   `var(--ease-out)` for overlays) and keep them under 0.4s.
7. Accessibility: text or `aria-label` on every control, `aria-pressed` for
   toggles, `aria-expanded` for show-more buttons.
8. Verify with the `pixel-parity` skill before committing.

Template:

```jsx
import styles from './Name.module.css';

export function Name({ items }) {
  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>Title</h2>
      {/* ... */}
    </section>
  );
}
```
