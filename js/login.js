const loginForm = document.getElementById("login-form");

loginForm.addEventListener("submit", function(e) {
  e.preventDefault();

  const email = loginForm.email.value;
  const password = loginForm.password.value;

  //  Firebase Authentication
  auth.signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      const user = userCredential.user;

      // Get user profile from Firestore
      return db.collection("users").doc(user.uid).get();
    })
    .then((docSnap) => {
      if (!docSnap.exists) {
        alert("User profile not found in Firestore");
        return;
      }

      const userData = docSnap.data();
      console.log("User Data:", userData);

      // Role-based redirection
      if (userData.role === "admin") {
        window.location.href = "admin-dashboard.html";
      } else {
        window.location.href = "user-dashboard.html";
      }

    })
    .catch((error) => {
      console.error("Login Error:", error);
      alert(error.message);
    });
});


document.getElementById("home").addEventListener("click", () =>{
  window.location.href = "index.html";
});