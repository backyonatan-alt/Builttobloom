/* ===== Built to Bloom · landing logic ===== */

/* -------------------------------------------------------------
   CONFIG — edit these three values and the whole site updates.
   ------------------------------------------------------------- */
const CONFIG = {
  // WhatsApp number in international format, digits only (e.g. Israel: 9725XXXXXXXX)
  whatsapp: "972547822268",
  // Instagram handle (without the @)
  instagram: "built.to.bloom",
  // OPTIONAL: paste a Formspree form endpoint to collect leads by email.
  // Leave empty ("") to fall back to sending the lead via WhatsApp instead.
  formEndpoint: "", // e.g. "https://formspree.io/f/xxxxxxx"
  // Google Analytics 4 Measurement ID (leave empty to disable analytics).
  gaId: "G-QHGZSVWENE",
};
/* ------------------------------------------------------------- */

const waText = encodeURIComponent("היי! ראיתי את Built to Bloom ואשמח לבדוק זמינות לאירוע 🌸");
const waUrl = `https://wa.me/${CONFIG.whatsapp}?text=${waText}`;
const igUrl = `https://instagram.com/${CONFIG.instagram}`;

/* ---- Analytics (GA4) ---- */
function track(name, params) {
  if (typeof window.gtag === "function") window.gtag("event", name, params || {});
}
// Figure out where this visitor came from (UTM params → saved → referrer → direct)
function leadSource() {
  const p = new URLSearchParams(location.search);
  const src = p.get("utm_source");
  if (src) {
    const med = p.get("utm_medium");
    const val = med ? `${src}/${med}` : src;
    try { sessionStorage.setItem("btb_src", val); } catch (e) {}
    return val;
  }
  try { const s = sessionStorage.getItem("btb_src"); if (s) return s; } catch (e) {}
  if (document.referrer) {
    try { return new URL(document.referrer).hostname.replace(/^www\./, ""); } catch (e) {}
  }
  return "direct";
}
const LEAD_SOURCE = leadSource();
(function initGA() {
  if (!CONFIG.gaId) return;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  window.gtag("js", new Date());
  window.gtag("config", CONFIG.gaId);
  const s = document.createElement("script");
  s.async = true;
  s.src = "https://www.googletagmanager.com/gtag/js?id=" + CONFIG.gaId;
  document.head.appendChild(s);
})();

// Wire up all WhatsApp / Instagram links
["wa-link", "wa-link-footer", "wa-fab"].forEach((id) => {
  const el = document.getElementById(id);
  if (el) {
    el.href = waUrl; el.target = "_blank"; el.rel = "noopener";
    el.addEventListener("click", () => track("whatsapp_open", { source: id, lead_source: LEAD_SOURCE }));
  }
});
["ig-link", "ig-inline"].forEach((id) => {
  const el = document.getElementById(id);
  if (el) {
    el.href = igUrl; el.target = "_blank"; el.rel = "noopener";
    el.addEventListener("click", () => track("instagram_click", { source: id, lead_source: LEAD_SOURCE }));
  }
});

// Track CTA button clicks (in-page anchor buttons like "קבלו הצעת מחיר")
document.querySelectorAll('a.btn[href^="#"]').forEach((el) => {
  el.addEventListener("click", () => {
    const sec = el.closest("section");
    track("cta_click", {
      location: (sec && sec.id) || "nav",
      label: el.textContent.trim().slice(0, 40),
      lead_source: LEAD_SOURCE,
    });
  });
});
// Track clicks through to the full gallery
document.querySelectorAll('a[href="gallery.html"]').forEach((el) => {
  el.addEventListener("click", () => track("gallery_open", { lead_source: LEAD_SOURCE }));
});

// Close the mobile menu after tapping a link
const navCheck = document.getElementById("nav-check");
document.querySelectorAll(".nav__links a").forEach((a) =>
  a.addEventListener("click", () => { if (navCheck) navCheck.checked = false; })
);

// Current year in footer
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ---- Images: load from data-src, fall back to a styled placeholder ---- */
document.querySelectorAll("img[data-src]").forEach((img) => {
  const src = img.getAttribute("data-src");
  const probe = new Image();
  probe.onload = () => { img.src = src; };
  probe.onerror = () => {
    // Real photo not added yet — show a tasteful placeholder.
    img.classList.add("ph--empty");
    img.alt = (img.alt || "תמונה") + " (להוספה)";
  };
  probe.src = src;
});

/* ---- Reveal on scroll ---- */
const revealTargets = document.querySelectorAll(
  ".benefit, .product, .step, .gallery__item, .pricing__highlight, .lead, .section__title"
);
revealTargets.forEach((el) => el.classList.add("reveal"));
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }),
    { threshold: 0.12 }
  );
  revealTargets.forEach((el) => io.observe(el));
} else {
  revealTargets.forEach((el) => el.classList.add("in"));
}

/* ---- Lead form ---- */
const form = document.getElementById("lead-form");
const status = document.getElementById("lead-status");

function setStatus(msg, type) {
  status.textContent = msg;
  status.className = "lead__status" + (type ? " " + type : "");
}

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());

    if (!data.name || !data.phone) {
      setStatus("נא למלא שם וטלפון 🙏", "err");
      return;
    }

    // Path A: a Formspree endpoint is configured → submit by email.
    if (CONFIG.formEndpoint) {
      try {
        setStatus("שולח...", "");
        const res = await fetch(CONFIG.formEndpoint, {
          method: "POST",
          headers: { Accept: "application/json" },
          body: new FormData(form),
        });
        if (res.ok) {
          track("generate_lead", { method: "formspree", event_type: data.event_type || "", lead_source: LEAD_SOURCE });
          form.reset();
          setStatus("תודה! נחזור אליכם בהקדם 🌸", "ok");
        } else {
          throw new Error("bad response");
        }
      } catch (err) {
        setStatus("משהו השתבש — נסו שוב או פנו אלינו בוואטסאפ.", "err");
      }
      return;
    }

    // Path B: no backend yet → open a pre-filled WhatsApp message.
    const lines = [
      "פנייה חדשה מ-Built to Bloom 🌸",
      `שם: ${data.name}`,
      `טלפון: ${data.phone}`,
      data.event_date ? `תאריך: ${data.event_date}` : null,
      data.event_type ? `סוג אירוע: ${data.event_type}` : null,
      data.message ? `הערות: ${data.message}` : null,
      `מקור: ${LEAD_SOURCE}`,
    ].filter(Boolean);
    const url = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(lines.join("\n"))}`;
    track("generate_lead", { method: "whatsapp", event_type: data.event_type || "", lead_source: LEAD_SOURCE });
    window.open(url, "_blank", "noopener");
    setStatus("נפתח וואטסאפ עם הפרטים — רק ללחוץ שליחה ✓", "ok");
    form.reset();
  });
}

/* ---- Gallery lightbox (click to enlarge + prev/next) ---- */
(function () {
  const imgs = Array.from(document.querySelectorAll("img[data-src]"));
  if (!imgs.length) return;

  const slides = imgs.map((im) => {
    const fig = im.closest("figure");
    const cap = fig && fig.querySelector("figcaption");
    return { src: im.getAttribute("data-src") || im.src, cap: cap ? cap.textContent : (im.getAttribute("alt") || "") };
  });
  let idx = 0;

  const lb = document.createElement("div");
  lb.className = "lb";
  lb.innerHTML =
    '<button class="lb__close" aria-label="סגור">✕</button>' +
    '<button class="lb__btn lb__prev" aria-label="הקודם">‹</button>' +
    '<img class="lb__img" alt="" />' +
    '<button class="lb__btn lb__next" aria-label="הבא">›</button>' +
    '<div class="lb__cap"></div>';
  document.body.appendChild(lb);

  const lbImg = lb.querySelector(".lb__img");
  const lbCap = lb.querySelector(".lb__cap");

  function show(i) {
    idx = (i + slides.length) % slides.length;
    lbImg.src = slides[idx].src;
    lbCap.textContent = slides[idx].cap;
  }
  function open(i) { show(i); lb.classList.add("open"); document.body.style.overflow = "hidden"; }
  function close() { lb.classList.remove("open"); document.body.style.overflow = ""; }

  imgs.forEach((im, i) => im.addEventListener("click", () => open(i)));
  lb.querySelector(".lb__close").addEventListener("click", close);
  lb.querySelector(".lb__prev").addEventListener("click", (e) => { e.stopPropagation(); show(idx - 1); });
  lb.querySelector(".lb__next").addEventListener("click", (e) => { e.stopPropagation(); show(idx + 1); });
  lb.addEventListener("click", (e) => { if (e.target === lb) close(); });
  document.addEventListener("keydown", (e) => {
    if (!lb.classList.contains("open")) return;
    if (e.key === "Escape") close();
    else if (e.key === "ArrowLeft") show(idx - 1);
    else if (e.key === "ArrowRight") show(idx + 1);
  });
})();
