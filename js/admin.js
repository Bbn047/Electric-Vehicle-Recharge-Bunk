const sidebar = document.querySelector(".left-section");
const menuIcon = document.querySelector("#menu-icon");
const closeIcon = document.querySelector("#close-icon");


closeIcon.addEventListener("click", () => {
  sidebar.style.display = "none";
  menuIcon.style.display = "block";
})

menuIcon.addEventListener("click", () => {
  sidebar.style.display = "flex";
  menuIcon.style.display = "none";
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 991) {
    sidebar.classList.remove("active");
  }
});



// Protect Admin Dashboard
auth.onAuthStateChanged((user) => {
  if (!user) {
    // Not logged in
    window.location.href = "login.html";
    return;
  }

  // Check role from Firestore
  db.collection("users").doc(user.uid).get()
    .then((doc) => {
      if (doc.exists) {
        document.getElementById("admin-name").innerText = doc.data().firstName;
      }

      if (!doc.exists) {
        alert("No user record found");
        auth.signOut();
        window.location.href = "login.html";
        return;
      }

      const userData = doc.data();

      if (userData.role !== "admin") {
        alert("Access denied. Admins only.");
        window.location.href = "user-dashboard.html";
      }
    })
    .catch((error) => {
      console.error("Error checking admin role:", error);
    });
});
