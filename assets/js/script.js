/* ===== Built to Bloom · landing logic ===== */

/* -------------------------------------------------------------
   CONFIG — edit these three values and the whole site updates.
   ------------------------------------------------------------- */
const CONFIG = {
  // WhatsApp number in international format, digits only (e.g. Israel: 9725XXXXXXXX)
  whatsapp: "972500000000",
  // Instagram handle (without the @)
  instagram: "built.to.bloom",
  // OPTIONAL: paste a Formspree form endpoint to collect leads by email.
  // Leave empty ("") to fall back to sending the lead via WhatsApp instead.
  formEndpoint: "", // e.g. "https://formspree.io/f/xxxxxxx"
};
/* ------------------------------------------------------------- */

const waText = encodeURIComponent("היי! ראיתי את Built to Bloom ואשמח לבדוק זמינות לאירוע 🌸");
const waUrl = `https://wa.me/${CONFIG.whatsapp}?text=${waText}`;
const igUrl = `https://instagram.com/${CONFIG.instagram}`;

// Wire up all WhatsApp / Instagram links
["wa-link", "wa-link-footer", "wa-fab"].forEach((id) => {
  const el = document.getElementById(id);
  if (el) { el.href = waUrl; el.target = "_blank"; el.rel = "noopener"; }
});
const ig = document.getElementById("ig-link");
if (ig) { ig.href = igUrl; ig.target = "_blank"; ig.rel = "noopener"; }

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
  ".card, .step, .gallery__item, .pricing__highlight, .lead, .section__title"
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
    ].filter(Boolean);
    const url = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(lines.join("\n"))}`;
    window.open(url, "_blank", "noopener");
    setStatus("נפתח וואטסאפ עם הפרטים — רק ללחוץ שליחה ✓", "ok");
    form.reset();
  });
}
