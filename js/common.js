const current = localStorage.getItem("goalspaceCurrent");
if (
  !current &&
  !location.pathname.endsWith("index.html") &&
  !location.pathname.endsWith("signup.html")
)
  location.href = "index.html";
const user =
  JSON.parse(localStorage.getItem("goalspaceUsers") || "{}")[current] || {};
if (document.getElementById("userGreeting"))
  document.getElementById("userGreeting").textContent = user.name || "";
if (document.getElementById("userName"))
  document.getElementById("userName").textContent = (
    user.name || "there"
  ).split(" ")[0];
document.getElementById("logoutBtn")?.addEventListener("click", () => {
  localStorage.removeItem("goalspaceCurrent");
  location.href = "index.html";
});
function getGoals() {
  return JSON.parse(localStorage.getItem("goalspaceGoals_" + current) || "[]");
}
function saveGoals(g) {
  localStorage.setItem("goalspaceGoals_" + current, JSON.stringify(g));
}
