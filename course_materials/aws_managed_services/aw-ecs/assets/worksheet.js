/*
 * Reusable design worksheet: answer first, then compare with a checklist.
 *
 * Usage in a lesson:
 *   <div class="ws" data-ws="w1"></div>
 *   <script type="application/json" id="w1">
 *     { "id": "capstone-agent",                 // storage key prefix
 *       "sections": [ { "title": "...", "prompt": "...", "hint": "optional",
 *                       "checklist": ["...", "..."] } ] }
 *   </script>
 *   <script src="../assets/worksheet.js" defer></script>
 *
 * Each section: a text box for the learner's answer, then "Lock in" freezes it
 * and reveals the reviewer's checklist plus a second box for amendments, so the
 * first attempt stays visible (retrieval first, feedback second). Drafts are
 * kept in localStorage when available. "Copy my design" collects everything as
 * Markdown to paste into the chat for review.
 */
(function () {
  const css = `
  .ws { margin: 1.6rem 0; }
  .ws .wcard { border: 1px solid var(--rule); border-radius: 8px; padding: 1rem 1.1rem; margin: 1.2rem 0; background: var(--card); }
  .ws .wnum { font-size: .8rem; color: var(--muted); text-transform: uppercase; letter-spacing: .06em; }
  .ws h3 { margin: .1rem 0 .3rem; }
  .ws .prompt { margin: .2rem 0 .4rem; }
  .ws .hint { font-size: .92rem; color: var(--muted); font-style: italic; margin: 0 0 .6rem; }
  .ws textarea { width: 100%; min-height: 8rem; font: inherit; font-size: .98rem; line-height: 1.5; padding: .6rem .7rem;
    border-radius: 6px; border: 1px solid var(--rule); background: var(--bg); color: var(--fg); resize: vertical; }
  .ws textarea[readonly] { background: var(--code-bg); }
  .ws button { font: inherit; font-size: .95rem; margin: .6rem .5rem 0 0; padding: .4rem .9rem; border-radius: 6px;
    border: 1px solid var(--accent); background: transparent; color: var(--accent); cursor: pointer; }
  .ws button[disabled] { opacity: .5; cursor: default; }
  .ws .check { display: none; margin-top: .9rem; border-left: 3px solid var(--ok); background: var(--ok-soft); padding: .7rem 1rem; border-radius: 0 6px 6px 0; }
  .ws .check.show { display: block; }
  .ws .check ul { margin: .3rem 0 .2rem; padding-left: 1.2rem; }
  .ws .check li { margin: .25rem 0; }
  .ws .amend-label { font-size: .92rem; margin: .8rem 0 .3rem; }
  .ws .copied { font-style: italic; color: var(--ok); margin-left: .3rem; }
  @media print { .ws button { display: none; } .ws .check { display: block; } }`;
  const style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);

  const el = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; };
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* storage unavailable: keep in page only */ } },
  };

  function mount(root) {
    const data = JSON.parse(document.getElementById(root.dataset.ws).textContent);
    const key = (i, part) => `ws:${data.id}:${i}:${part}`;
    const boxes = [];

    data.sections.forEach((s, i) => {
      const card = el("div", "wcard");
      card.appendChild(el("div", "wnum", `Part ${i + 1} of ${data.sections.length}`));
      card.appendChild(el("h3", null, s.title));
      card.appendChild(el("p", "prompt", s.prompt));
      if (s.hint) card.appendChild(el("p", "hint", s.hint));

      const answer = el("textarea");
      answer.setAttribute("aria-label", `Your answer: ${s.title}`);
      answer.value = store.get(key(i, "a")) || "";
      answer.addEventListener("input", () => store.set(key(i, "a"), answer.value));

      const lock = el("button", null, "Lock in and show the checklist");
      lock.type = "button";

      const check = el("div", "check");
      check.appendChild(el("strong", null, "What a reviewer looks for"));
      const ul = el("ul");
      s.checklist.forEach((c) => ul.appendChild(el("li", null, c)));
      check.appendChild(ul);
      check.appendChild(el("p", "amend-label", "Anything you'd change after reading this? Add it here, and keep your first answer as it is."));
      const amend = el("textarea");
      amend.style.minHeight = "4rem";
      amend.setAttribute("aria-label", `Amendments: ${s.title}`);
      amend.value = store.get(key(i, "m")) || "";
      amend.addEventListener("input", () => store.set(key(i, "m"), amend.value));
      check.appendChild(amend);

      const doLock = () => {
        answer.readOnly = true;
        lock.disabled = true;
        lock.textContent = "Locked in";
        check.classList.add("show");
      };
      lock.addEventListener("click", () => {
        if (!answer.value.trim()) { answer.focus(); return; }
        store.set(key(i, "locked"), "1");
        doLock();
      });
      if (store.get(key(i, "locked")) === "1") doLock();

      card.appendChild(answer);
      card.appendChild(lock);
      card.appendChild(check);
      root.appendChild(card);
      boxes.push({ title: s.title, answer, amend });
    });

    const copy = el("button", null, "Copy my design");
    copy.type = "button";
    const msg = el("span", "copied");
    copy.addEventListener("click", () => {
      const md = boxes.map((b, i) =>
        `## ${i + 1}. ${b.title}\n${b.answer.value.trim() || "(blank)"}` +
        (b.amend.value.trim() ? `\n\n*After the checklist:* ${b.amend.value.trim()}` : "")
      ).join("\n\n");
      const done = () => { msg.textContent = "Copied. Paste it into the chat."; };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(md).then(done, () => fallback(md, done));
      } else fallback(md, done);
    });
    function fallback(md, done) {
      const t = el("textarea"); t.value = md; document.body.appendChild(t); t.select();
      try { document.execCommand("copy"); done(); } catch (e) { msg.textContent = "Couldn't copy: select the text in each box instead."; }
      t.remove();
    }
    root.appendChild(copy);
    root.appendChild(msg);
  }
  document.querySelectorAll(".ws[data-ws]").forEach(mount);
})();
