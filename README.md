# SGTH 2026 — Student Guide Talent Hunt

A static, responsive website for the Student Guide Talent Hunt. No build step and no dependencies. Open `index.html` directly, or serve the folder with any static host (GitHub Pages, Netlify, etc.).

```
index.html          Page markup (all sections and inline SVG illustrations)
css/styles.css      Design tokens, layout, animation, responsive and reduced-motion rules
js/main.js          Mobile menu, scroll reveals, light parallax, and the enquiry form → WhatsApp
assets/images/      Logo, icons and hero artwork
```

## Logo and images
- `assets/images/student-guide-mark-{60,120,180}.{webp,png}`: the cap-and-SG mark cut from the official badge, used in the header next to a "STUDENT / Guide" wordmark set in Montserrat to match the logo lettering.
- `assets/images/student-guide-logo-{128,256,512}.{webp,png}`: the full round badge, used in the footer.
- `favicon-48.png`, `apple-touch-icon.png`: browser and home-screen icons made from the same badge.
- `hero-students-{800,1300}.{webp,jpg}`: the students artwork cropped from the SGTH 2026 poster, with the poster's white swoosh removed.

The stylesheet and script are linked with a `?v=` query. Bump it whenever CSS or JS changes so visitors don't keep a stale cached copy.

## Enquiry form
The form validates the required fields and the 10-digit Indian mobile number, then opens
`https://wa.me/919954562820?text=…` with the composed enquiry. Nothing is stored, and the visitor sends the message from WhatsApp themselves.

## Content guardrails
The site deliberately leaves out exam dates, fees, venues, eligible classes, prize amounts and deadlines, because the source posters do not provide them. Visitors are invited to enquire on WhatsApp instead.

## Search Console and security
- `google6791b66ee6c728be.html` verifies the site in Google Search Console (URL-prefix property `https://studentguidetalenthunt.in/`). Keep it in the site root; the deploy workflow copies `google*.html` automatically.
- `index.html` carries a Content-Security-Policy meta tag: only the site's own scripts (plus the one hashed inline script), Google Fonts, and local or `data:` images may load. If you change the inline `<script>` in the `<head>`, update its `sha256-` hash in the policy, or the script will be blocked.
- No secrets, API keys or form data are stored anywhere; the enquiry form only builds a WhatsApp link.
