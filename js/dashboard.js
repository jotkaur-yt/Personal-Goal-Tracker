const list = document.getElementById("goalList");
if (list) {
  function render() {
    const goals = getGoals(),
      q = document.getElementById("searchGoals").value.toLowerCase(),
      f = document.getElementById("filterStatus").value,
      p = document.getElementById("filterPriority").value,
      s = document.getElementById("sortGoals").value;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayKey = today.toISOString().slice(0, 10);
    document.getElementById("totalCount").textContent = goals.length;
    document.getElementById("completedCount").textContent = goals.filter(
      (g) => g.status === "Completed" || Number(g.progress) >= 100,
    ).length;
    document.getElementById("progressCount").textContent = goals.filter(
      (g) => g.status === "In Progress" && Number(g.progress) < 100,
    ).length;
    document.getElementById("averageCount").textContent =
      (goals.length
        ? Math.round(
            goals.reduce((sum, g) => sum + Number(g.progress || 0), 0) /
              goals.length,
          )
        : 0) + "%";
    document.getElementById("overdueCount").textContent = goals.filter(
      (g) =>
        g.deadline &&
        g.deadline < todayKey &&
        g.status !== "Completed" &&
        Number(g.progress) < 100,
    ).length;
    let shown = goals.filter(
      (g) =>
        g.name.toLowerCase().includes(q) &&
        (f === "all" || g.status === f) &&
        (p === "all" || g.priority === p),
    );
    const rank = { High: 3, Medium: 2, Low: 1 };
    shown.sort((a, b) =>
      s === "priority"
        ? rank[b.priority] - rank[a.priority]
        : s === "name"
          ? a.name.localeCompare(b.name)
          : s === "progress"
            ? Number(b.progress || 0) - Number(a.progress || 0)
            : (a.deadline || "9999").localeCompare(b.deadline || "9999"),
    );
    list.innerHTML = shown
      .map(
        (g) =>
          `<article class="goal-item"><div><h3>${escapeHTML(g.name)}</h3><p>${escapeHTML(g.category)} · ${escapeHTML(g.status)} · ${g.progress || 0}%${g.deadline ? " · Due " + g.deadline : ""}</p><div class="mini-track"><span style="width:${Math.max(0, Math.min(100, Number(g.progress) || 0))}%"></span></div></div><div class="goal-actions"><a class="btn btn-outline btn-small" href="add-goal.html?id=${g.id}">Edit</a><button class="btn btn-outline btn-small" data-delete="${g.id}">Delete</button></div></article>`,
      )
      .join("");
    document.getElementById("emptyState").style.display = shown.length
      ? "none"
      : "block";
    list.querySelectorAll("[data-delete]").forEach(
      (b) =>
        (b.onclick = () => {
          if (confirm("Delete this goal?")) {
            saveGoals(getGoals().filter((g) => g.id !== b.dataset.delete));
            render();
          }
        }),
    );
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      counts = Array(7).fill(0);
    goals
      .filter(
        (g) =>
          (g.status === "Completed" || Number(g.progress) >= 100) &&
          g.completedAt,
      )
      .forEach((g) => {
        const d = new Date(g.completedAt + "T12:00:00");
        if ((today - d) / 86400000 < 7 && d <= today) counts[d.getDay()]++;
      });
    document.getElementById("weeklyActivity").innerHTML = days
      .map(
        (day, i) =>
          `<div class="activity-day"><div class="activity-bar" title="${counts[i]} completed" style="height:${Math.max(5, counts[i] * 22)}px"></div><span>${day}</span></div>`,
      )
      .join("");
    const upcoming = goals
      .filter(
        (g) =>
          g.deadline &&
          g.deadline >= todayKey &&
          g.status !== "Completed" &&
          Number(g.progress) < 100,
      )
      .sort((a, b) => a.deadline.localeCompare(b.deadline))
      .slice(0, 4);
    document.getElementById("upcomingReminders").innerHTML = upcoming.length
      ? upcoming
          .map(
            (g) =>
              `<div class="reminder-item"><strong>${escapeHTML(g.name)}</strong><span>Due ${g.deadline} · ${escapeHTML(g.priority)} priority</span></div>`,
          )
          .join("")
      : '<p class="muted">No upcoming deadlines. Add a goal with a deadline to see reminders here.</p>';
  }
  document.getElementById("searchGoals").oninput = render;
  document.getElementById("filterStatus").onchange = render;
  document.getElementById("filterPriority").onchange = render;
  document.getElementById("sortGoals").onchange = render;
  render();
}
function escapeHTML(s) {
  return String(s).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
}
