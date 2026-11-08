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
