# CLAUDE.md — Built to Bloom

## 📌 PENDING REMINDER — deliver at the START of the next session, then delete this block
> Yonatan asked to be reminded to do the **analytics check-in** the next time he opens
> this project (set on 2026-06-16; intended for the next session, ~2026-06-17 or later).
>
> When you see this at session start, proactively say something like:
> "👋 Welcome back — time for the Built to Bloom **analytics check-in** 📊. Open GA4 →
> *'At a glance — Built to Bloom'* (or the Google Analytics mobile app) and send me these
> 4 numbers and I'll interpret them + suggest the next move:
> 1) Visitors (active users) 2) WhatsApp opens (`whatsapp_open`) 3) Leads (`generate_lead`)
> 4) Top source (`lead_source`).
> Also — to keep the 2–3 day content cadence: ready to post **Reel #2**?"
>
> ➡️ After delivering this reminder, DELETE this whole block and commit, so it doesn't repeat.

---

## Project snapshot
Built to Bloom — a landing page that rents **LEGO flower bouquets & décor for weddings/events**.
Static site (HTML/CSS/JS), Hebrew **RTL**, no build step.

- **Live site:** https://backyonatan-alt.github.io/Builttobloom/
- **Deploy:** every push to **`main`** auto-deploys via GitHub Pages (`.github/workflows/pages.yml`), ~1–2 min.
- **Working branch:** `claude/above-fold-photo-layouts-mk9tei` (develop here, then fast-forward `main` to deploy).
- **Config:** WhatsApp number, Instagram handle, Formspree, and GA4 id live in the `CONFIG` block at the top of `assets/js/script.js`.

## Where the knowledge lives
- **`ROADMAP.md`** — vision, marketing plan, social/reels, and **Section 9: Analytics & Performance** (GA4 `G-QHGZSVWENE`, events, key events, custom dimensions, and where to look).
- **`assets/brand/`** — Facebook profile picture + cover assets.
- **`social/`** — reel kits + launch caption SRTs.

## North star
Demand validation: **inquiries, not likes.** Track `whatsapp_open` + `generate_lead` and which `lead_source` drives them.
