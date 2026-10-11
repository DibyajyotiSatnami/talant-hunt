# SGTH 2026 — Student Guide Talent Hunt

A static, responsive website for the Student Guide Talent Hunt. No build step and no dependencies. Open `index.html` directly, or serve the folder with any static host (GitHub Pages, Netlify, etc.).

```
index.html          Page markup (all sections and inline SVG illustrations)
css/styles.css      Design tokens, layout, animation, responsive and reduced-motion rules
js/main.js          Mobile menu, scroll reveals, light parallax, and the enquiry form → WhatsApp
assets/images/      Logo, icons and hero artwork
```

## Logo and images
- `assets/images/student-guide-logo-{128,256}.{webp,png}`: the official Student Guide badge, used in the header (52px) and footer (88px) at 1x and 2x, always square so its proportions are preserved.
- `favicon-48.png`, `apple-touch-icon.png`: browser and home-screen icons made from the same badge.
- `hero-students-{800,1300}.{webp,jpg}`: the students artwork cropped from the SGTH 2026 poster.

## Enquiry form
The form validates the required fields and the 10-digit Indian mobile number, then opens
`https://wa.me/919101447800?text=…` with the composed enquiry. Nothing is stored, and the visitor sends the message from WhatsApp themselves.

## Content guardrails
The site deliberately leaves out exam dates, fees, venues, eligible classes, prize amounts and deadlines, because the source posters do not provide them. Visitors are invited to enquire on WhatsApp instead.
