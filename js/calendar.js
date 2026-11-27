const days = document.getElementById("calendarDays");
if (days) {
  let shown = new Date();
  shown.setDate(1);
  let selected = "";
  const goals = getGoals();
  function dateKey(y, m, d) {
    return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
  }
  function render() {
    const y = shown.getFullYear(),
      m = shown.getMonth(),
      offset = shown.getDay(),
      count = new Date(y, m + 1, 0).getDate(),
      prevCount = new Date(y, m, 0).getDate();
    document.getElementById("monthLabel").textContent =
      shown.toLocaleDateString(undefined, { month: "long", year: "numeric" });
    let html = "";
    for (let i = 0; i < 42; i++) {
      let day = i - offset + 1,
        month = m,
        year = y,
        out = false;
      if (day < 1) {
        day = prevCount + day;
        month = m - 1;
        out = true;
      } else if (day > count) {
        day -= count;
        month = m + 1;
        out = true;
      }
      let key = dateKey(year, month, day),
        has = goals.some((g) => g.deadline === key),
        today =
          key ===
          dateKey(
            new Date().getFullYear(),
            new Date().getMonth(),
            new Date().getDate(),
          );
      html += `<button class="calendar-day ${out ? "outside" : ""} ${has ? "has-goal" : ""} ${today ? "today" : ""} ${selected === key ? "selected" : ""}" data-date="${key}">${day}</button>`;
    }
    days.innerHTML = html;
    days.querySelectorAll("[data-date]").forEach(
      (b) =>
        (b.onclick = () => {
          selected = b.dataset.date;
          render();
          const matches = goals.filter((g) => g.deadline === selected);
          document.getElementById("selectedDayGoals").innerHTML = matches.length
            ? `<strong>${selected}</strong><br>${matches.map((g) => escapeHTML(g.name)).join("<br>")}`
            : `<strong>${selected}</strong><br>No goal deadlines for this date.`;
        }),
    );
  }
  document.getElementById("prevMonth").onclick = () => {
    shown.setMonth(shown.getMonth() - 1);
    render();
  };
  document.getElementById("nextMonth").onclick = () => {
    shown.setMonth(shown.getMonth() + 1);
    render();
  };
  render();
}
