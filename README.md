# SGTH 2026 — Student Guide Talent Hunt

A static, responsive website for the Student Guide Talent Hunt. No build step and no dependencies. Open `index.html` directly, or serve the folder with any static host (GitHub Pages, Netlify, etc.).

```
index.html          Page markup (all sections and inline SVG illustrations)
css/styles.css      Design tokens, layout, animation, responsive and reduced-motion rules
js/main.js          Mobile menu, scroll reveals, light parallax, and the enquiry form → WhatsApp
assets/images/      Logo (dark and light variants) and favicon
```

## Replacing the logo
`assets/images/student-guide-logo.svg` (header) and `student-guide-logo-light.svg` (footer) are stand-ins.
To use the official Student Guide logo, replace those files, or point the two `<img>` tags in `index.html` at the new file and update their `width`/`height` attributes and the `aspect-ratio` in `.brand-logo` / `.footer-brand img` to match the real logo. This keeps its proportions and prevents layout shift.

## Enquiry form
The form validates the required fields and the 10-digit Indian mobile number, then opens
`https://wa.me/919101447800?text=…` with the composed enquiry. Nothing is stored, and the visitor sends the message from WhatsApp themselves.

## Content guardrails
The site deliberately leaves out exam dates, fees, venues, eligible classes, prize amounts and deadlines, because the source posters do not provide them. Visitors are invited to enquire on WhatsApp instead.
