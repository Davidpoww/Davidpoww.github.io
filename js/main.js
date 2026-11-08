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
