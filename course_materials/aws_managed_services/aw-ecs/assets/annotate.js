/*
 * Reusable click-to-explain code annotations.
 *
 * Usage in a lesson:
 *   <div class="anno">
 *     <pre><code>... <span class="a" data-k="family">"family": "x"</span> ...</code></pre>
 *     <div class="anno-notes">
 *       <div data-k="family"><b>family</b> explanation…</div>
 *     </div>
 *   </div>
 *   <script src="../assets/annotate.js" defer></script>
 *
 * Highlighted spans are clickable (and keyboard focusable); the matching note
 * shows in a panel that sticks to the bottom of the screen. In print, every
 * note is shown as a list after the code.
 */
(function () {
  const css = `
  .anno { margin: 1.4rem 0; }
  .anno pre { margin-bottom: 0; }
  .anno .a { border-bottom: 2px solid var(--accent); cursor: pointer; border-radius: 2px; }
  .anno .a:hover, .anno .a:focus { background: var(--accent-soft); outline: none; }
  .anno .a.on { background: var(--accent-soft); }
  .anno .anno-notes > div { display: none; }
  .anno .panel { position: sticky; bottom: 0; background: var(--card); border: 1px solid var(--rule);
    border-top: 3px solid var(--accent); border-radius: 0 0 6px 6px; padding: .8rem 1rem; font-size: .98rem; min-height: 4.2rem;
    box-shadow: 0 -4px 14px rgba(0,0,0,.06); }
  .anno .panel .hint { color: var(--muted); font-style: italic; }
  .anno .count { float: right; font-size: .8rem; color: var(--muted); }
  @media print {
    .anno .panel { display: none; }
    .anno .anno-notes > div { display: block; margin: .4rem 0; }
  }`;
  const style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);

  document.querySelectorAll(".anno").forEach((box) => {
    const notes = {};
    box.querySelectorAll(".anno-notes > div[data-k]").forEach((n) => (notes[n.dataset.k] = n));
    const spans = [...box.querySelectorAll(".a[data-k]")];
    const seen = new Set();
    const panel = document.createElement("div");
    panel.className = "panel";
    panel.setAttribute("aria-live", "polite");
    const total = new Set(spans.map((s) => s.dataset.k)).size;
    const showHint = () => {
      panel.innerHTML = `<span class="count">0 / ${total} explored</span><span class="hint">Say out loud what a highlighted field does, then click it to check.</span>`;
    };
    showHint();
    box.querySelector("pre").after(panel);

    spans.forEach((s) => {
      s.tabIndex = 0;
      s.setAttribute("role", "button");
      const open = () => {
        spans.forEach((x) => x.classList.toggle("on", x.dataset.k === s.dataset.k));
        seen.add(s.dataset.k);
        const n = notes[s.dataset.k];
        panel.innerHTML = `<span class="count">${seen.size} / ${total} explored</span>` + (n ? n.innerHTML : "");
      };
      s.addEventListener("click", open);
      s.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); } });
    });
  });
})();
