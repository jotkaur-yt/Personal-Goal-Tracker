const $ = (id) => document.getElementById(id);
document.querySelectorAll("[data-toggle]").forEach((btn) =>
  btn.addEventListener("click", () => {
    const input = $(btn.dataset.toggle);
    input.type = input.type === "password" ? "text" : "password";
    btn.textContent = input.type === "password" ? "Show" : "Hide";
  }),
);
const readUsers = () =>
  JSON.parse(localStorage.getItem("goalspaceUsers") || "{}");
const show = (id, msg) => {
  if ($(id)) $(id).textContent = msg;
};
if ($("loginForm")) {
  $("loginForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const email = $("loginEmail").value.trim(),
      password = $("loginPassword").value;
    if (!email || !password) {
      alert("Please fill in all login information.");
      return;
    }
    const user = readUsers()[email.toLowerCase()];
    if (!user || user.password !== password) {
      show("loginMessage", "Email or password is incorrect.");
      return;
    }
    localStorage.setItem("goalspaceCurrent", email.toLowerCase());
    location.href = "dashboard.html";
  });
  $("forgotLink").addEventListener("click", (e) => {
    e.preventDefault();
    alert(
      "For this demo, create a new account if you cannot remember your password.",
    );
  });
}
if ($("signupForm")) {
  $("signupForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const name = $("fullName").value.trim(),
      email = $("signupEmail").value.trim().toLowerCase(),
      pass = $("signupPassword").value,
      confirm = $("confirmPassword").value;
    if (!name || !email || !pass || !confirm || !$("termsCheck").checked) {
      alert("Please complete all fields and tick the agreement.");
      return;
    }
    if (pass.length < 6) {
      alert("Password must contain at least 6 characters.");
      return;
    }
    if (pass !== confirm) {
      alert("Passwords do not match.");
      return;
    }
    const users = readUsers();
    if (users[email]) {
      show("signupMessage", "An account with this email already exists.");
      return;
    }
    users[email] = { name, password: pass };
    localStorage.setItem("goalspaceUsers", JSON.stringify(users));
    localStorage.setItem("goalspaceCurrent", email);
    location.href = "dashboard.html";
  });
}
