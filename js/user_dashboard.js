// Protect User Dashboard
auth.onAuthStateChanged((user) => {
  if (!user) {
    window.location.href = "login.html";
  }
});