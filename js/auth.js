const form = document.getElementById("register");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const firstName = form.fname.value;
  const lastName = form.lname.value;
  const email = form.mail.value;
  const password = form.pswd.value;
  const confirmPassword = form.pswd2.value;
  const role = form.role.value;

  if (password !== confirmPassword) {
    alert("Passwords do not match");
    return;
  }

  if (!role) {
    alert("Please select a role");
    return;
  }

  // Create user using Firebase Authentication
  auth.createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      const user = userCredential.user;

      // Store user details in Firestore
      return db.collection("users").doc(user.uid).set({
        firstName: firstName,
        lastName: lastName,
        email: email,
        role: role, // user or admin
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
    })
    .then(() => {
      alert("Registration successful");
      form.reset();
      // window.location.href = "login.html";
    })
    .catch((error) => {
      console.error("Registration Error:", error);
      alert(error.message);
    });
    
    
});
