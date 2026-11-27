const form = document.getElementById("goalForm");
if (form) {
  const params = new URLSearchParams(location.search),
    id = params.get("id"),
    old = getGoals().find((g) => g.id === id);
  if (old) {
    document.getElementById("formTitle").textContent = "Edit your goal";
    [
      "goalName",
      "description",
      "category",
      "priority",
      "startDate",
      "deadline",
      "status",
      "progress",
    ].forEach((field, i) => {
      const keys = [
        "name",
        "description",
        "category",
        "priority",
        "startDate",
        "deadline",
        "status",
        "progress",
      ];
      document.getElementById(field).value = old[keys[i]] ?? "";
    });
  }
  form.onsubmit = (e) => {
    e.preventDefault();
    const name = document.getElementById("goalName").value.trim();
    if (!name) {
      alert("Please enter a goal title.");
      return;
    }
    const goals = getGoals(),
      data = {
        id: id || String(Date.now()),
        name,
        description: document.getElementById("description").value,
        category: document.getElementById("category").value,
        priority: document.getElementById("priority").value,
        startDate: document.getElementById("startDate").value,
        deadline: document.getElementById("deadline").value,
        status: document.getElementById("status").value,
        progress: Math.max(
          0,
          Math.min(100, Number(document.getElementById("progress").value) || 0),
        ),
        completedAt:
          document.getElementById("status").value === "Completed" ||
          Number(document.getElementById("progress").value) >= 100
            ? old?.completedAt || new Date().toISOString().slice(0, 10)
            : "",
      };
    const updated = old
      ? goals.map((g) => (g.id === id ? data : g))
      : [...goals, data];
    saveGoals(updated);
    location.href = "dashboard.html";
  };
}
