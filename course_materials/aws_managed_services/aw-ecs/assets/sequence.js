/*
 * Reusable "put the steps in order" exercise.
 *
 * Usage in a lesson:
 *   <div class="seq" data-seq="s1"></div>
 *   <script type="application/json" id="s1">
 *     { "title": "...", "intro": "...",
 *       "steps": ["first", "second", "third"],   // correct order
 *       "why": "explanation shown when finished" }
 *   </script>
 *   <script src="../assets/sequence.js" defer></script>
 *
 * Steps are shown shuffled; the learner clicks them in order. Wrong clicks
 * flash and are counted, so feedback is immediate.
 */
(function () {
  const css = `
  .seq { margin: 1.6rem 0; border: 1px solid var(--rule); border-radius: 8px; padding: 1rem 1.1rem; background: var(--card); }
  .seq h3 { margin-top: 0; }
  .seq .pool, .seq .done { display: grid; gap: .45rem; margin: .7rem 0; }
  .seq .done:empty { display: none; }
  .seq button.step { font: inherit; font-size: .98rem; text-align: left; padding: .5rem .8rem; border-radius: 6px;
    border: 1px solid var(--rule); background: var(--bg); color: var(--fg); cursor: pointer; }
  .seq button.step:hover { border-color: var(--accent); }
  .seq button.step.bad { background: var(--bad-soft); border-color: var(--bad); }
  .seq .placed { padding: .45rem .8rem; border-radius: 6px; background: var(--ok-soft); border: 1px solid var(--ok); font-size: .98rem; }
  .seq .placed b { font-family: var(--mono); margin-right: .5rem; color: var(--ok); }
  .seq .result { font-style: italic; }
  .seq .actions button { font: inherit; font-size: .95rem; margin-top: .5rem; padding: .4rem .9rem; border-radius: 6px;
    border: 1px solid var(--accent); background: transparent; color: var(--accent); cursor: pointer; }`;
  const style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);

  const shuffle = (a) => {
    a = a.slice();
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  };
  const el = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; };

  function mount(root) {
    const data = JSON.parse(document.getElementById(root.dataset.seq).textContent);

    function render() {
      root.innerHTML = "";
      if (data.title) root.appendChild(el("h3", null, data.title));
      if (data.intro) root.appendChild(el("p", "muted", data.intro));
      const done = el("div", "done");
      const pool = el("div", "pool");
      const result = el("p", "result");
      const actions = el("div", "actions");
      let next = 0, mistakes = 0;

      let order = shuffle(data.steps.map((t, i) => ({ t, i })));
      // avoid presenting the steps already in the correct order
      if (order.every((x, k) => x.i === k) && order.length > 1) order.push(order.shift());

      order.forEach(({ t, i }) => {
        const b = el("button", "step", t);
        b.type = "button";
        b.addEventListener("click", () => {
          if (i === next) {
            const p = el("div", "placed");
            p.appendChild(el("b", null, String(next + 1)));
            p.appendChild(document.createTextNode(t));
            done.appendChild(p);
            b.remove();
            next++;
            if (next === data.steps.length) {
              result.textContent = (mistakes === 0 ? "Perfect order. " : `Done with ${mistakes} wrong click${mistakes === 1 ? "" : "s"}. `) + (data.why || "");
              const again = el("button", null, "Try again");
              again.type = "button";
              again.addEventListener("click", render);
              actions.appendChild(again);
            }
          } else {
            mistakes++;
            b.classList.add("bad");
            setTimeout(() => b.classList.remove("bad"), 600);
          }
        });
        pool.appendChild(b);
      });

      root.appendChild(done);
      root.appendChild(pool);
      root.appendChild(result);
      root.appendChild(actions);
    }
    render();
  }
  document.querySelectorAll(".seq[data-seq]").forEach(mount);
})();
