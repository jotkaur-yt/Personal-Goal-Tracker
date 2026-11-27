const list = document.getElementById("progressList");
if (list) {
  const goals = getGoals(),
    avg = goals.length
      ? Math.round(
          goals.reduce((s, g) => s + Number(g.progress || 0), 0) / goals.length,
        )
      : 0;
  document.getElementById("overallPercent").textContent = avg + "%";
  document.getElementById("circlePercent").textContent = avg + "%";
  document.getElementById("progressCircle").style.background =
    `conic-gradient(var(--accent) ${avg * 3.6}deg,#e5d7c5 0deg)`;
  document.getElementById("overallText").textContent = goals.length
    ? `${goals.length} goal(s) in your tracker.`
    : "Add goals to start tracking your progress.";
  list.innerHTML = goals
    .map(
      (g) =>
        `<article class="goal-item"><div><h3>${escapeHTML(g.name)}</h3><p>${escapeHTML(g.status)} · ${g.progress || 0}% complete</p><div class="progress-track"><div style="width:${g.progress || 0}%;height:7px;background:var(--accent);border-radius:8px;margin-top:10px"></div></div></div></article>`,
    )
    .join("");
  document.getElementById("progressEmpty").style.display = goals.length
    ? "none"
    : "block";
}
