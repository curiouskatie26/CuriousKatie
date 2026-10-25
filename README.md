# Curious Katie – Body Explorations

Hi Katie! This folder holds your whole website. Each page is a plain file that you can open in any text editor, such as Notepad, TextEdit, or the free [Visual Studio Code](https://code.visualstudio.com/). Nothing needs to be installed or "built". You save a file, upload it, and the change is live.

To preview the site on your own computer, double-click `index.html` to open it in your browser.

---

## 1. Editing the text on a page

| Page | File |
|---|---|
| Home | `index.html` |
| About | `about.html` |
| Services & pricing | `services.html` |
| FAQ | `faq.html` |
| Contact | `contact.html` |
| "Page not found" | `404.html` |

Open the file and use your editor's search (Ctrl+F on Windows, Cmd+F on Mac) to find the sentence you want to change. Each section has a label like `<!-- ===== Meet Katie ===== -->` above it, so you can find your way around.

The words you see on the page sit between little tags, for example:

```html
<p>Not unless you want to. We work with what's present in your body now.</p>
```

Change only the words between `<p>` and `</p>`, or between `<h2>` and `</h2>`, and leave the tags in angle brackets alone.

A few tips:

- **Session lengths** are in `services.html`. Search for `60 minutes`. The session price isn't shown on the site for now. To add one later, add a line like `<li class="offer-price">$65</li>` below `<li>Online</li>` in that card. The intro call's `Free` line shows how it looks.
- **"What it's like to work with me"** and **"And what is embodiment?"** are on the About page (`about.html`).
- **The header and footer** appear on every page. If you change one, such as your email address, make the same change in all six `.html` files. Search for the old text to find it in each file.
- **The copyright year** is near the bottom of each page. Search for `©`.
- **Adding an FAQ question**: in `faq.html`, copy one whole block from `<details class="faq-item">` down to its `</details>`, paste it underneath, and change the question and answer.
- The **"What is somatic coaching?"** answer has a note next to it (`Katie may expand this answer later`) so you can find it easily.

## 2. Changing your disclaimer

Your disclaimer is in the footer of every page. To change it, do this in each of the six `.html` files:

1. Search for `DISCLAIMER`.
2. Directly below that note is the line that starts `<p class="disclaimer">`.
3. Change the words between `<p class="disclaimer">` and `</p>`, keeping those tags. Use the same wording in all six files.

## 3. Turning on testimonials

The "Kind words" section is already built on the **Home** page (`index.html`) and the **FAQ** page (`faq.html`). It's hidden for now.

1. Search for `TESTIMONIALS`.
2. Delete the line that says `<!-- START TESTIMONIALS`.
3. Delete the line that says `END TESTIMONIALS -->`.
4. Replace each `[Client quote here]` with a real quote, and each `[First name or initials]` with the client's name or initials. Please only use quotes you have the client's permission to share.
5. If you only have two quotes, delete one whole `<figure class="card testimonial"> … </figure>` block.

Repeat on the other page.

## 4. Changing your photo

Your photo is on the About page (`images/katie.jpg`). The Home page's "Meet Katie" section shows your line drawing of a woman holding a child (`images/reparenting-illustration.webp`) instead.

To use a different photo:

1. Choose a portrait photo, ideally around **800 × 1000 pixels** (a 4:5 upright shape). The site fades its edges softly into the page, so keep your face near the middle and leave a little space above your head.
2. Compress it to **under 300KB**. The free [Squoosh](https://squoosh.app/) website works well for this.
3. Name the file **`katie.jpg`** and replace the existing file in the `images` folder.

### Background photos

Your photos appear as gently fixed ("parallax") backgrounds behind some sections:

| Photo | File | Where |
|---|---|---|
| Sunset meadow | `images/bg-sunset.jpg` | Home "A different way in" |
| Cloudy sky | `images/bg-sky.jpg` | Closing "Ready to explore?" on Home and FAQ |
| Single petunia | `images/bg-petunia.jpg` | Closing section on About |
| Petunia cluster | `images/bg-petunias.jpg` | Closing section on Services |
| Hammock | `images/bg-hammock.jpg` | The whole Contact page |

- **To swap a photo:** replace the file with a new one of the same name. Keep it about 1500–1920 pixels wide and under 300KB. Squoosh works well for this.
- **To move a photo to a different section:** in the `.html` file, find the section's opening `<section class="section ...">` and add `section--photo photo--sunset` (or `photo--sky`, `photo--petunia`, `photo--petunias`, `photo--hammock`) to its class list. Put the section's text inside a `<div class="frost">` so it stays readable.
- On phones and tablets the photo scrolls normally instead of staying fixed, because touch screens don't handle the fixed effect well. It also scrolls normally for anyone who has asked their device for reduced motion.

## 5. Publishing on GitHub Pages (free)

1. Create a free account at [github.com](https://github.com) if you don't have one.
2. Click **+** (top right) → **New repository**. Give it a name, such as `curious-katie`, set it to **Public**, and click **Create repository**.
3. On the new repository page, click **uploading an existing file**. Drag in **everything** from this folder: all the `.html` files, the `css`, `js` and `images` folders, `README.md`, and the `.nojekyll` file. Then click **Commit changes**.
   - `.nojekyll` is a hidden, empty file. If you can't see it, turn on "show hidden files" in your file browser. It tells GitHub to serve your files exactly as they are.
4. Go to **Settings** → **Pages**.
5. Under **Source**, choose **Deploy from a branch**. Choose branch **`main`** and folder **`/ (root)`**, then click **Save**.
6. After a few minutes your site will be live at:
   `https://USERNAME.github.io/REPO-NAME/`
   (for example `https://katie.github.io/curious-katie/`).

**Updating later:** open the file in your repository on GitHub, click the pencil icon, edit, and click **Commit changes**. Or upload a new version of the file the same way you did in step 3. The live site updates within a minute or two.

## 6. Adding a custom domain later

1. Buy a domain, such as `curiouskatie.com`, from a registrar like Namecheap, Porkbun, or Google/Squarespace Domains.
2. In your repository, add a new file named **`CNAME`** (all capitals, no file extension). It should contain just your domain on one line, for example:
   ```
   curiouskatie.com
   ```
3. In **Settings** → **Pages**, type your domain into **Custom domain** and click **Save**.
4. At your registrar, set up the DNS records GitHub asks for. Follow GitHub's guide: [Managing a custom domain for your GitHub Pages site](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site). DNS changes can take up to a day to take effect.
5. Once the domain works, go back to **Settings** → **Pages** and tick **Enforce HTTPS**.

All the links in the site are relative, so nothing else needs to change when you move to your own domain.

---

## What's still to fill in

| Item | Where | Status |
|---|---|---|
| Disclaimer wording | Footer on every page | Added |
| Testimonials | Home and FAQ pages | Built, hidden |
| Photo of Katie | `images/katie.jpg` (About page) | Added (a sharper original would be even better) |
| Expanded "What is somatic coaching?" answer | FAQ page | Draft answer in place |
| Custom domain | GitHub Pages settings + `CNAME` | Not yet purchased |

## For the technically curious

- Plain HTML5, one stylesheet (`css/styles.css`), a small script for the mobile menu (`js/main.js`), and the home page's animated header (`js/meadow.js`).
- Colors and fonts are set as variables at the top of `styles.css` (look for `:root`). The small gold sprig above "I'll meet you right where you are" on the About page is `images/sprig.svg`.
- **The home page header** is the "Ink meadow": an ink tree, a soft lilac sun and a swaying meadow with little purple flowers, drawn live by `js/meadow.js` using the three.js library (loaded from cdn.jsdelivr.net). Its colours are at the top of `js/meadow.js`.
- **The Services page banner** is a half-height view of the same meadow from a different spot: the tree on the left and further away, under a low, rosy evening sun in a calmer breeze. Each banner's view is set in its `data-params` in the HTML: `side` (`"left"` or `"right"`), `treeScale` (smaller = further away), `sunX`/`sunY` (where the sun sits), `sun` (its colour), `wind` (breeze strength), `seed` (a different number grows a different tree and meadow) and `density` (how many grasses).
- **The FAQ page banner** is the same half height as Services, at sunrise: a small, far-off tree on the right and a peach sun rising just above the grasses.
- **The About page's "How I work" section** has a third view of the meadow behind it, at morning: a pale dawn sun high on the left (`sunAcross` places the sun across the whole sky, from `-1` at the left edge to `1` at the right) and a close tree on the right. The scene stays put while the section's cards scroll over it; the heading and the "We keep going…" verses sit on soft frosted panels so they stay easy to read. It pauses when scrolled out of view, shows a still picture for people who prefer reduced motion, and falls back to a soft gradient on devices that can't draw it.
- Buttons and text links use the darker lavender (`#5C618A`) because white text on `#757AA3` falls just short of the WCAG AA contrast standard.
