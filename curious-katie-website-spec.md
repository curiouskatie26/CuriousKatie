# Website build spec: Curious Katie – Body Explorations

You are building a small, static website for a somatic coaching practice. Build it exactly as specified below, using plain HTML, CSS, and minimal vanilla JavaScript (no frameworks, no build step) so it can be hosted for free on GitHub Pages.

---

## 1. Project overview

- **Business name:** Curious Katie – Body Explorations
- **Owner:** Katie
- **What she does:** One-on-one somatic coaching over Zoom
- **Who it's for:** People with anxiety and burnout, especially women in midlife
- **Tone:** Gentle, curious, open, warm, unhurried. Never clinical, salesy, or pushy.
- **Primary goal of the site:** Encourage visitors to book a free 30-minute intro call by email.
- **Contact method:** Email only (kmaygroves@gmail.com). No phone number, no contact form, no booking tool.

---

## 2. Tech requirements

- Static site: HTML5, one shared CSS file, and at most a tiny JS file (for the mobile menu only).
- No frameworks, bundlers, or package dependencies.
- Must work when served from GitHub Pages, both at `username.github.io/repo-name/` and later at a custom domain. **Use relative links only** (e.g. `about.html`, `css/styles.css`), never root-relative (`/about.html`).
- Fully responsive: looks good from 360px phones up to large desktops.
- Accessible: semantic HTML, proper heading order, alt text on all images, visible focus states, color contrast meeting WCAG AA, a "Skip to content" link, and `prefers-reduced-motion` respected.
- Fast and lightweight: no large images over ~300KB, lazy-load images below the fold.

### File structure

```
/
├── index.html          (Home)
├── about.html          (About)
├── services.html       (Services & pricing)
├── faq.html            (FAQ + testimonials)
├── contact.html        (Contact)
├── 404.html            (Friendly not-found page)
├── css/
│   └── styles.css
├── js/
│   └── main.js         (mobile nav toggle only)
├── images/
│   ├── katie-placeholder.jpg   (see section 5)
│   └── favicon.svg
├── README.md           (how to edit content and deploy)
└── .nojekyll           (empty file, so GitHub Pages serves files as-is)
```

---

## 3. Design system: "Mist and lavender"

Soft, calm, airy, and a touch dreamy. Lots of whitespace, generous line height, rounded but not bubbly shapes. Flat colors: no harsh shadows (a very soft shadow on cards is fine), no busy patterns.

### Colors (define as CSS custom properties on `:root`)

| Token | Hex | Use |
|---|---|---|
| `--color-bg` | `#F4F4F8` | Main page background (mist) |
| `--color-surface` | `#FFFFFF` | Cards, content panels |
| `--color-soft` | `#E1E2EE` | Alternate section backgrounds, dividers |
| `--color-lavender` | `#C2C5DD` | Decorative accents, borders, soft shapes |
| `--color-accent` | `#757AA3` | Buttons, links, small headings |
| `--color-accent-dark` | `#5C618A` | Button hover, link hover |
| `--color-text` | `#3E415C` | Body and heading text |
| `--color-text-muted` | `#62668A` | Captions, secondary text |

Check that button text (`#F4F4F8` or white on `#757AA3`) passes AA contrast; if not, darken the button to `--color-accent-dark`.

### Typography (Google Fonts)

- **Headings:** Fraunces (weights 400 and 500), soft and slightly rounded serif. Optionally use the `SOFT` axis for extra gentleness.
- **Body and UI:** Work Sans (weights 400 and 500)
- Base body size: 18px on desktop, 17px on mobile; line-height 1.7.
- Headings in sentence case. H1 around 2.75rem desktop / 2.1rem mobile.
- Load with `<link rel="preconnect">` and `display=swap`.

### Components

- **Buttons:** Pill-shaped (fully rounded), `--color-accent` background, light text, comfortable padding (~14px 28px). Hover: `--color-accent-dark` with a gentle transition. Secondary button style: transparent with a 1.5px `--color-accent` border.
- **Cards:** White background, 20px border radius, subtle border in `--color-soft`, generous padding.
- **Section rhythm:** Alternate between `--color-bg` and `--color-soft` backgrounds for sections to create gentle visual breathing. Use plenty of vertical padding (80–120px desktop, 56px mobile).
- **Decorative touch:** Soft, blurred-edge organic blob shapes in `--color-lavender` at low opacity behind the hero (pure CSS or inline SVG). Keep them subtle.
- **Max content width:** ~1100px for layouts, ~680px for reading text.
- **Motion:** Optional very gentle fade-in on scroll for sections. Disable entirely under `prefers-reduced-motion`.

### Header and navigation (all pages)

- Left: wordmark "Curious Katie" in Fraunces, with "Body Explorations" in small Work Sans beneath it. Links to Home.
- Right: Home · About · Services · FAQ · Contact, plus a small pill button "Free intro call" linking to `contact.html`.
- Highlight the current page in the nav (`aria-current="page"`).
- On mobile: a hamburger button that toggles an accessible menu (`aria-expanded`, keyboard operable).

### Footer (all pages)

- Wordmark, a short line: "Gentle somatic coaching on Zoom"
- Email link: kmaygroves@gmail.com (as `mailto:`)
- Nav links repeated
- **Disclaimer block** (small muted text). Use this placeholder until Katie supplies her wording, and wrap it in an obvious HTML comment so it's easy to find:

```html
<!-- DISCLAIMER: Replace the text below with Katie's own disclaimer wording -->
<p class="disclaimer">[DISCLAIMER PLACEHOLDER – Katie will supply her wording.]</p>
```

- Copyright: "© [current year] Curious Katie – Body Explorations"

---

## 4. Page content

Use this copy as written. Keep the gentle tone if small adjustments are needed for layout.

### 4.1 Home (`index.html`)

**Hero section**
- H1: Come home to your body
- Subheadline: Gentle somatic coaching for anxiety and burnout, with Katie
- Primary button: "Book a free intro call" → `contact.html`
- Secondary button: "How it works" → `services.html`

**Section: Does this sound familiar?**
> You're tired in a way rest doesn't fix. Your mind won't slow down, your body feels tense or far away, and you've started to wonder if something is wrong with you.
>
> Nothing is wrong with you. Your nervous system has been working hard to keep you safe, and it may be ready for a different kind of attention.

Optionally present three small soft cards beneath it: "Constant worry or racing thoughts", "Exhaustion that rest doesn't touch", "Feeling disconnected from your body".

**Section: A different way in**
> Somatic coaching works through the body rather than around it. Together we slow down, notice what's happening inside, and get curious about it, at your pace and led by what comes up for you.

**Section: Meet Katie** (photo on one side, text on the other; stacks on mobile)
> I'm a certified Compassion Method coach and Embodied Processing practitioner, with a highly sensitive nervous system of my own. I know what it's like to feel like you're "too much" or that something is wrong with you, and I know how much can shift when you begin listening to your body.

Link: "Read my story" → `about.html`

**Section: Testimonials** (see section 6, hidden for now)

**Closing call-to-action band** (on `--color-soft` background)
- Heading: Ready to explore?
- Text: Start with a free 30-minute intro call. No pressure, just a conversation.
- Button: "Book a free intro call" → `contact.html`

### 4.2 About (`about.html`)

- H1: Hi, I'm Katie
- Photo (placeholder, see section 5)

> For most of my life I felt like there was something wrong with me. I felt everything deeply, my nervous system was easily overwhelmed, and the usual advice to think differently or push through never worked.
>
> Somatic work changed that. Learning to listen to my body and the felt sense opened doors that thinking alone never could. It didn't fix me, because I was never broken. It helped me understand myself.
>
> Now I offer that same gentle, curious space to others, especially women in midlife navigating anxiety and burnout.

**H2: Training**
- Certified in the Compassion Method
- Embodied Processing practitioner
- Many years of personal somatic practice

**H2: How I work**
> My style is gentle, curious, and open. There's no script. You lead, and we explore whatever arises together, at a pace that feels safe for your system.

Closing CTA band (same as Home).

### 4.3 Services & pricing (`services.html`)

- H1: Working together
- Intro: Every session is one-on-one, on Zoom, and shaped around you.

**Two offering cards side by side (stack on mobile):**

Card 1: **Free intro call**
- 30 minutes · Zoom · Free
- A relaxed conversation to talk about what you're struggling with, what you're hoping for, and whether working together feels right.
- Button: "Book your intro call" → `contact.html`

Card 2: **One-on-one somatic session**
- 60 minutes · Zoom · $65
- A private session to slow down, tune into your body, and gently explore what's ready to be felt.
- Button: "Get started" → `contact.html`

**H2: What to expect in a session**
> Sessions take place on Zoom from somewhere comfortable and private. We might start by checking in with how you're feeling, then turn attention toward sensations, emotions, or images as they arise. You're always in charge, and you can pause or stop at any time. No experience is needed.

Optionally show this as 3 gentle steps: "Arrive and settle", "Notice and explore", "Integrate and close".

Closing CTA band.

### 4.4 FAQ (`faq.html`)

- H1: Questions you might have
- Build the FAQ as an accessible accordion using native `<details>` and `<summary>` elements, styled to match.

Questions and answers:

1. **What is somatic coaching?**
   Somatic coaching is a body-based approach that helps you notice and work with physical sensations, emotions, and nervous system responses, rather than only talking about problems. *(Add an HTML comment: `<!-- Katie may expand this answer later -->`)*
2. **Is this therapy?**
   No. Somatic coaching isn't therapy or medical treatment, and it can complement work with a therapist or doctor.
3. **Do I have to talk about my past?**
   Not unless you want to. We work with what's present in your body now.
4. **What if I don't feel anything in my body?**
   That's common and completely okay. Noticing numbness or distance is part of the exploration.
5. **Why Zoom?**
   Many people find it easier to relax at home, and online sessions can be just as meaningful as in person.
6. **How do I get started?**
   Send me an email to book a free 30-minute intro call, and we'll see if working together feels right.

Below the FAQ: the testimonials section (see section 6, hidden for now), then the closing CTA band.

### 4.5 Contact (`contact.html`)

- H1: Let's talk
- Text: The first step is a free 30-minute intro call. Send me an email and we'll find a time that works.
- A prominent card containing:
  - Large email link: **kmaygroves@gmail.com** using `mailto:kmaygroves@gmail.com?subject=Free%20intro%20call`
  - Button: "Email Katie" (same mailto link)
  - Small helper text: "It helps to share a little about what you're struggling with and a few times that suit you. Sessions are on Zoom, so you can join from anywhere."
- Do **not** include a contact form or phone number.

### 4.6 404 page (`404.html`)

- Heading: This page wandered off
- Text: Let's get you back somewhere familiar.
- Button: "Go to the home page" → `index.html`
- Same header and footer as other pages.

---

## 5. Images

- Katie will add her own photo later. For now, create `images/katie-placeholder.jpg` as a soft placeholder (or use a CSS block with a lavender-to-mist tone and a small "Photo coming soon" label). Give it `alt="Katie, somatic coach"` and a rounded or soft arch-shaped frame.
- Add a simple `favicon.svg`: a soft lavender circle or organic blob with a small "CK" or leaf/wave mark.
- Do not use stock photos of people. If decorative imagery is needed, use CSS/SVG organic shapes only.
- In the README, explain how to replace the placeholder photo (same filename, recommended size ~800×1000px, compressed under 300KB).

---

## 6. Testimonials (built but hidden)

Katie has testimonials and will add them later. Build the testimonial component now, styled and ready, but keep it hidden.

- Component: a section titled "Kind words" with 2–3 cards. Each card has a quote in Fraunces italic, and a name/initial line in Work Sans small caps style.
- Include it on the Home page (before the closing CTA) and on the FAQ page.
- Hide it by wrapping each section in an HTML comment with clear instructions:

```html
<!-- TESTIMONIALS: To show this section, remove the comment markers around it
     and replace the placeholder quotes with real ones (with client permission). -->
```

- Use obvious placeholder text inside (e.g. "[Client quote here]" / "— [First name or initials]").

---

## 7. SEO and metadata

For every page include:
- A unique `<title>`, e.g. "Curious Katie – Body Explorations | Somatic coaching for anxiety and burnout", "About Katie | Curious Katie", etc.
- A meta description (150–160 characters) for each page, written in the same gentle tone.
- `<meta name="viewport" content="width=device-width, initial-scale=1">`
- `lang="en"` on `<html>`
- Open Graph tags (title, description, type) so links share nicely.
- Favicon link.

---

## 8. README.md (for Katie)

Write a friendly, non-technical README that explains:
1. How to edit text on each page (which file, what to look for).
2. How to add the disclaimer (search for `DISCLAIMER`).
3. How to turn on testimonials (search for `TESTIMONIALS`).
4. How to replace the placeholder photo.
5. How to publish on GitHub Pages:
   - Create a GitHub repository and upload all files.
   - Go to Settings → Pages → Source: "Deploy from a branch", choose `main` and `/ (root)`.
   - The site will appear at `https://USERNAME.github.io/REPO-NAME/` within a few minutes.
6. How to add a custom domain later (buy a domain, add a `CNAME` file containing the domain, set it in Settings → Pages, and configure DNS records at the registrar per GitHub's docs, then enable "Enforce HTTPS").

---

## 9. Quality checklist (verify before finishing)

- [ ] All five pages plus 404 exist and share an identical header and footer.
- [ ] All internal links are relative and work when opened locally and on GitHub Pages.
- [ ] Mobile menu works with mouse, touch, and keyboard.
- [ ] Layout looks good at 360px, 768px, and 1280px widths.
- [ ] Every "Book" or "Get started" button leads to the Contact page; the Contact page email links open a new email to kmaygroves@gmail.com.
- [ ] No phone number or contact form anywhere.
- [ ] Prices and lengths are correct: intro call 30 min free; session 60 min $65; all on Zoom.
- [ ] Disclaimer placeholder and hidden testimonials are clearly marked with comments.
- [ ] Color contrast passes WCAG AA; focus states are visible.
- [ ] No console errors; HTML validates.
- [ ] `.nojekyll` file is present.

---

## 10. Placeholders Katie will fill in later

| Item | Where | Status |
|---|---|---|
| Disclaimer wording | Footer on every page | Placeholder |
| Testimonials | Home and FAQ pages | Built, hidden |
| Photo of Katie | `images/katie-placeholder.jpg` | Placeholder |
| Expanded "What is somatic coaching?" answer | FAQ page | Draft answer in place |
| Custom domain | GitHub Pages settings + `CNAME` | Not yet purchased |
