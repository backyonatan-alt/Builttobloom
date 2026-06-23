# Built to Bloom 🌸

> פרחים שנבנו כדי לפרוח — לתמיד.

Landing page for **Built to Bloom** — a service that rents LEGO® flower bouquets
and custom brick displays for weddings and events. The page is in Hebrew (RTL)
and built as a single static site, so it deploys anywhere with zero build step.

## Why this page exists
This is a demand-validation page: drive traffic from an Instagram post, and see
how many real couples leave their details ("כן וואי / לא וואי"). The lead form
either emails you (via Formspree) or opens a pre-filled WhatsApp message.

## The pitch (key selling points)
- 🌗 **Never wilts** — perfect from morning to the end of the night, and a keepsake forever.
- ☀️ **Weatherproof** — sun, rain, wind or A/C: doesn't matter.
- 💸 **Cheaper than real flowers** — and it isn't thrown away after the event.
- 🎨 **Fully customizable** — colors, sizes, characters, themed pieces.
- 🌱 **Eco-friendly** — reused again and again, zero waste.
- 🛠️ **Doesn't break, just clicks apart** — spare parts always on hand.

## Quick start
Just open `index.html` in a browser. No dependencies, no build.

```
.
├── index.html            # the page
├── assets/
│   ├── css/styles.css    # styles (wedding palette + lego accent)
│   ├── js/script.js      # form logic, image loading, animations
│   └── landing/          # real event photos (boaz-*.jpg) — see landing/README.md
```

## Configure it (1 minute)
Open `assets/js/script.js` and edit the `CONFIG` block at the top:

```js
const CONFIG = {
  whatsapp: "972500000000",   // your WhatsApp number, international format, digits only
  instagram: "built.to.bloom.il", // your Instagram handle, no @
  formEndpoint: "",            // optional Formspree URL to collect leads by email
};
```

- Leave `formEndpoint` empty and the form opens a pre-filled WhatsApp message
  (great for starting out, no backend needed).
- Add a free [Formspree](https://formspree.io) endpoint to collect leads by email.

## Photos
The real event photos live in [`assets/landing/`](assets/landing/README.md)
(`boaz-*.jpg`). To swap which ones appear, edit the `data-src` attributes in
`index.html` — see the table in that folder's README.

## Deploy (free options)
- **GitHub Pages** — Settings → Pages → deploy from this branch → root.
- **Netlify / Vercel / Cloudflare Pages** — drag-and-drop the folder, or connect the repo.

---
LEGO® is a trademark of the LEGO Group, which does not sponsor or endorse this project.
