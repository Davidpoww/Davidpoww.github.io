"use strict";

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ===== Terminal fastfetch ===== */
const term = document.querySelector(".term");
if (term) initTerminal(term);

function initTerminal(term) {
  const cmdEl  = term.querySelector(".term__cmd");
  const tabs   = term.querySelectorAll(".term__tab");
  const panels = term.querySelectorAll(".term__panel");
  const replay = term.querySelector(".term__replay");
  let current = "fastfetch";
  let timer = null;

  colorAscii(term.querySelector(".term__ascii"));

  // Marca cada línea de los paneles para animarla en cascada
  if (!reduceMotion) {
    panels.forEach((panel) => {
      const lines = panel.querySelectorAll(".term__ascii, .term__host, dl > div, .term__colors, li");
      lines.forEach((line, i) => {
        line.classList.add("term__line");
        line.style.setProperty("--i", i);
      });
    });
  }

  function run(name) {
    current = name;
    clearTimeout(timer);

    tabs.forEach((tab) => {
      tab.setAttribute("aria-pressed", String(tab.dataset.cmd === name));
    });
    panels.forEach((panel) => { panel.hidden = true; });
    const target = term.querySelector(`[data-panel="${name}"]`);

    if (reduceMotion) {
      cmdEl.textContent = name;
      target.hidden = false;
      return;
    }

    cmdEl.textContent = "";
    let i = 0;
    const typeNext = () => {
      if (i < name.length) {
        cmdEl.textContent += name[i];
        i++;
        timer = setTimeout(typeNext, 70);
      } else {
        timer = setTimeout(() => { target.hidden = false; }, 250);
      }
    };
    timer = setTimeout(typeNext, 300);
  }

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => run(tab.dataset.cmd));
  });
  replay.addEventListener("click", () => run(current));

  run("fastfetch");
}

/* Colorea el ASCII: bloques █ en menta, bordes ╗═║ en sombra */
function colorAscii(pre) {
  if (!pre) return;
  const text = pre.textContent;
  pre.textContent = "";
  for (const chunk of text.match(/█+|[^█]+/g)) {
    const span = document.createElement("span");
    span.className = chunk[0] === "█" ? "fill" : "shade";
    span.textContent = chunk;
    pre.append(span);
  }
}

/* ===== Cursor: aro con retraso + punto ===== */
const finePointer = window.matchMedia("(pointer: fine)").matches;
if (finePointer && !reduceMotion) initCursor();

function initCursor() {
  const ring = document.createElement("div");
  const dot = document.createElement("div");
  ring.className = "cursor-ring";
  dot.className = "cursor-dot";
  ring.setAttribute("aria-hidden", "true");
  dot.setAttribute("aria-hidden", "true");
  document.body.append(ring, dot);

  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;
  let visible = false;

  document.addEventListener("pointermove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.translate = `${mouseX}px ${mouseY}px`;
    if (!visible) {
      visible = true;
      ringX = mouseX;
      ringY = mouseY;
      document.body.classList.add("has-cursor");
    }
  });

  document.documentElement.addEventListener("mouseleave", () => {
    visible = false;
    document.body.classList.remove("has-cursor");
  });

  document.addEventListener("pointerover", (e) => {
    ring.classList.toggle("is-hover", Boolean(e.target.closest("a, button")));
  });

  function follow() {
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;
    ring.style.translate = `${ringX}px ${ringY}px`;
    requestAnimationFrame(follow);
  }
  follow();
}

/* ===== Filtro de habilidades ===== */
const skillFilter = document.querySelector(".filter");
if (skillFilter) initSkillFilter(skillFilter);

function initSkillFilter(filter) {
  const buttons = filter.querySelectorAll(".filter__btn");
  const chips = document.querySelectorAll(".chip");
  const status = document.querySelector("#skills-status");

  filter.hidden = false;

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const role = btn.dataset.role;

      buttons.forEach((b) => {
        b.setAttribute("aria-pressed", String(b === btn));
      });

      let count = 0;
      chips.forEach((chip) => {
        const match = role === "todo" || chip.dataset.roles.split(" ").includes(role);
        chip.classList.toggle("is-dim", !match);
        if (match) count++;
      });

      status.textContent = role === "todo"
        ? "Mostrando todas las habilidades"
        : `${count} habilidades destacadas para ${btn.textContent}`;
    });
  });
}


/* ===== Menú: marcar la sección activa ===== */
const navLinks = document.querySelectorAll('.nav__links a[href^="#"]');
if (navLinks.length) initScrollSpy(navLinks);

function initScrollSpy(links) {
  const items = [...links]
    .map((link) => ({ link, section: document.querySelector(link.getAttribute("href")) }))
    .filter((item) => item.section);

  let ticking = false;

  function update() {
    ticking = false;
    const line = window.innerHeight * 0.4;
    const atBottom =
      window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;

    let current = null;
    items.forEach((item) => {
      if (item.section.getBoundingClientRect().top <= line) current = item;
    });
    if (atBottom && items.length) current = items[items.length - 1];

    items.forEach((item) => {
      if (item === current) item.link.setAttribute("aria-current", "true");
      else item.link.removeAttribute("aria-current");
    });
  }

  window.addEventListener("scroll", () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  }, { passive: true });

  update();
}

/* ===== Al recargar, volver siempre al inicio ===== */
if ("scrollRestoration" in history) history.scrollRestoration = "manual";

const navEntry = performance.getEntriesByType("navigation")[0];
if (navEntry && navEntry.type === "reload") {
  if (location.hash) history.replaceState(null, "", location.pathname + location.search);
  window.scrollTo({ top: 0, behavior: "instant" });
}

/* ===== Correo: se monta solo al pulsar ===== */
const mailBtn = document.querySelector("#mail-btn");
if (mailBtn) {
  mailBtn.hidden = false;
  mailBtn.addEventListener("click", () => {
    const address = ["davidpow", "it"].join(".") + "@" + ["gmail", "com"].join(".");
    document.querySelector("#mail-text").textContent = address;
    window.location.href = "mailto:" + address;
  });
}

/* ===== Secciones: aparecen con un fundido al entrar ===== */
if (!reduceMotion && "IntersectionObserver" in window) {
  const sections = document.querySelectorAll(".section");

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });

  sections.forEach((section) => {
    section.classList.add("reveal");
    observer.observe(section);
  });
}

/* ===== Barra de progreso de lectura ===== */
const progressBar = document.createElement("div");
progressBar.className = "progress";
progressBar.setAttribute("aria-hidden", "true");
document.body.prepend(progressBar);

let progressTicking = false;

function updateProgress() {
  progressTicking = false;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const ratio = max > 0 ? window.scrollY / max : 0;
  progressBar.style.transform = `scaleX(${ratio})`;
}

window.addEventListener("scroll", () => {
  if (!progressTicking) {
    progressTicking = true;
    requestAnimationFrame(updateProgress);
  }
}, { passive: true });

updateProgress();

/* ===== Mensaje para quien abra la consola ===== */
console.log(
  "%cpow%c/%c\n¿Revisando el código? Buena señal.\nHecha a mano: HTML, CSS y JS, sin frameworks ni rastreadores.\nHablemos → linkedin.com/in/davidpow",
  "font: 800 28px sans-serif; color: #F4F2EA;",
  "font: 800 28px sans-serif; color: #FF6B6B;",
  "font: 13px monospace; color: #8EE3B4; line-height: 1.7;"
);
