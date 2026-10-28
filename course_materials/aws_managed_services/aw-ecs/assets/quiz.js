/*
 * Reusable retrieval-practice quiz.
 *
 * Usage in a lesson:
 *   <div class="quiz" data-quiz="q1"></div>
 *   <script type="application/json" id="q1">
 *     { "title": "...", "shuffle": true,
 *       "questions": [ { "q": "...", "options": ["a","b"], "answer": 0, "why": "..." } ] }
 *   </script>
 *   <script src="../assets/quiz.js" defer></script>
 *
 * Rules for authors: keep every option in a question the same word count
 * (and close in length) so formatting gives no clue to the answer.
 */
(function () {
  const css = `
  .quiz { margin: 1.6rem 0; }
  .quiz h3 { margin-bottom: .2rem; }
  .quiz .qcard { border: 1px solid var(--rule); border-radius: 8px; padding: 1rem 1.1rem; margin: 1rem 0; background: var(--card); }
  .quiz .qnum { font-size: .8rem; color: var(--muted); text-transform: uppercase; letter-spacing: .06em; }
  .quiz .qtext { margin: .2rem 0 .8rem; }
  .quiz .opts { display: grid; gap: .5rem; }
  .quiz button.opt { font: inherit; font-size: 1rem; text-align: left; padding: .55rem .8rem; border-radius: 6px;
    border: 1px solid var(--rule); background: var(--bg); color: var(--fg); cursor: pointer; }
  .quiz button.opt:hover:not([disabled]) { border-color: var(--accent); }
  .quiz button.opt[disabled] { cursor: default; }
  .quiz button.opt.correct { background: var(--ok-soft); border-color: var(--ok); }
  .quiz button.opt.wrong { background: var(--bad-soft); border-color: var(--bad); }
  .quiz .why { margin-top: .7rem; font-size: .95rem; display: none; }
  .quiz .why.show { display: block; }
  .quiz .why b.ok { color: var(--ok); } .quiz .why b.bad { color: var(--bad); }
  .quiz .score { font-style: italic; margin-top: 1rem; }
  .quiz .actions button { font: inherit; font-size: .95rem; margin: .6rem .5rem 0 0; padding: .4rem .9rem;
    border-radius: 6px; border: 1px solid var(--accent); background: transparent; color: var(--accent); cursor: pointer; }`;
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
    const data = JSON.parse(document.getElementById(root.dataset.quiz).textContent);
    let pool = data.questions.map((q, i) => ({ ...q, id: i }));

    function render(questions) {
      root.innerHTML = "";
      if (data.title) root.appendChild(el("h3", null, data.title));
      if (data.intro) root.appendChild(el("p", "muted", data.intro));
      const order = data.shuffle ? shuffle(questions) : questions;
      let answered = 0, right = 0;
      const missed = [];
      const score = el("p", "score");
      const actions = el("div", "actions");

      order.forEach((q, n) => {
        const card = el("div", "qcard");
        card.appendChild(el("div", "qnum", `Question ${n + 1} of ${order.length}`));
        card.appendChild(el("p", "qtext", q.q));
        const opts = el("div", "opts");
        const why = el("div", "why");
        const choices = q.options.map((text, i) => ({ text, i }));
        (data.shuffle ? shuffle(choices) : choices).forEach(({ text, i }) => {
          const b = el("button", "opt", text);
          b.type = "button";
          b.addEventListener("click", () => {
            opts.querySelectorAll("button").forEach((x) => (x.disabled = true));
            const ok = i === q.answer;
            b.classList.add(ok ? "correct" : "wrong");
            if (!ok) opts.querySelector(`[data-i="${q.answer}"]`).classList.add("correct");
            why.innerHTML = "";
            why.appendChild(el("b", ok ? "ok" : "bad", ok ? "Correct. " : "Not quite. "));
            why.appendChild(document.createTextNode(q.why || ""));
            why.classList.add("show");
            answered++; if (ok) right++; else missed.push(q);
            if (answered === order.length) finish();
          });
          b.dataset.i = i;
          opts.appendChild(b);
        });
        card.appendChild(opts);
        card.appendChild(why);
        root.appendChild(card);
      });

      function finish() {
        score.textContent = right === order.length
          ? `${right} / ${order.length}. Come back in a day or two and try again from memory.`
          : `${right} / ${order.length}. Retry the ones you missed, then come back tomorrow.`;
        actions.innerHTML = "";
        if (missed.length) {
          const r = el("button", null, "Retry missed");
          r.type = "button";
          r.addEventListener("click", () => render(missed));
          actions.appendChild(r);
        }
        const all = el("button", null, "Start over");
        all.type = "button";
        all.addEventListener("click", () => render(pool));
        actions.appendChild(all);
      }
      root.appendChild(score);
      root.appendChild(actions);
    }
    render(pool);
  }
  document.querySelectorAll(".quiz[data-quiz]").forEach(mount);
})();
