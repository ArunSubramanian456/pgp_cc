/*
 * Reusable "work it out" exercise: the learner types a number and gets
 * immediate feedback.
 *
 * Usage in a lesson:
 *   <div class="num" data-num="n1"></div>
 *   <script type="application/json" id="n1">
 *     { "title": "...", "intro": "...",
 *       "questions": [ { "q": "...", "answer": 6, "tolerance": 0, "unit": "tasks", "why": "..." } ] }
 *   </script>
 *   <script src="../assets/numeric.js" defer></script>
 *
 * "tolerance" (optional, default 0) accepts answers within ± that amount.
 * Wrong answers can be retried; "Show answer" reveals the working.
 */
(function () {
  const css = `
  .num { margin: 1.6rem 0; }
  .num h3 { margin-bottom: .2rem; }
  .num .ncard { border: 1px solid var(--rule); border-radius: 8px; padding: 1rem 1.1rem; margin: 1rem 0; background: var(--card); }
  .num .qnum { font-size: .8rem; color: var(--muted); text-transform: uppercase; letter-spacing: .06em; }
  .num .qtext { margin: .2rem 0 .8rem; }
  .num .row { display: flex; flex-wrap: wrap; gap: .5rem; align-items: center; }
  .num input { font: inherit; font-family: var(--mono); font-size: 1rem; width: 7rem; padding: .45rem .6rem; border-radius: 6px;
    border: 1px solid var(--rule); background: var(--bg); color: var(--fg); }
  .num input.correct { background: var(--ok-soft); border-color: var(--ok); }
  .num input.wrong { background: var(--bad-soft); border-color: var(--bad); }
  .num .unit { color: var(--muted); }
  .num button { font: inherit; font-size: .95rem; padding: .4rem .9rem; border-radius: 6px;
    border: 1px solid var(--accent); background: transparent; color: var(--accent); cursor: pointer; }
  .num .why { margin-top: .7rem; font-size: .95rem; display: none; }
  .num .why.show { display: block; }
  .num .why b.ok { color: var(--ok); } .num .why b.bad { color: var(--bad); }`;
  const style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);

  const el = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; };

  function mount(root) {
    const data = JSON.parse(document.getElementById(root.dataset.num).textContent);
    if (data.title) root.appendChild(el("h3", null, data.title));
    if (data.intro) root.appendChild(el("p", "muted", data.intro));

    data.questions.forEach((q, n) => {
      const card = el("div", "ncard");
      card.appendChild(el("div", "qnum", `Question ${n + 1} of ${data.questions.length}`));
      card.appendChild(el("p", "qtext", q.q));
      const row = el("div", "row");
      const input = el("input");
      input.type = "text";
      input.inputMode = "decimal";
      input.setAttribute("aria-label", "Your answer");
      const check = el("button", null, "Check");
      const reveal = el("button", null, "Show answer");
      check.type = reveal.type = "button";
      row.appendChild(input);
      if (q.unit) row.appendChild(el("span", "unit", q.unit));
      row.appendChild(check);
      row.appendChild(reveal);
      const why = el("div", "why");

      const show = (ok, prefix) => {
        why.innerHTML = "";
        why.appendChild(el("b", ok ? "ok" : "bad", prefix));
        why.appendChild(document.createTextNode(ok || prefix.startsWith("The") ? (q.why || "") : ""));
        why.classList.add("show");
      };
      const done = () => { input.disabled = check.disabled = reveal.disabled = true; };

      check.addEventListener("click", () => {
        const v = parseFloat(input.value.replace(/,/g, ""));
        if (Number.isNaN(v)) return;
        const ok = Math.abs(v - q.answer) <= (q.tolerance || 0);
        input.classList.toggle("correct", ok);
        input.classList.toggle("wrong", !ok);
        if (ok) { show(true, "Correct. "); done(); }
        else show(false, "Not quite. Check your working and try again, or show the answer.");
      });
      input.addEventListener("keydown", (e) => { if (e.key === "Enter") check.click(); });
      reveal.addEventListener("click", () => {
        input.value = q.answer;
        input.classList.remove("wrong");
        show(false, `The answer is ${q.answer}${q.unit ? " " + q.unit : ""}. `);
        done();
      });

      card.appendChild(row);
      card.appendChild(why);
      root.appendChild(card);
    });
  }
  document.querySelectorAll(".num[data-num]").forEach(mount);
})();
