//<script type="module">
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-analytics.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyD3uKYbfIsQqCIn5atbplJHq6MOMXw1ckw",
    authDomain: "electric-vehicle-recharg-ba1bd.firebaseapp.com",
    projectId: "electric-vehicle-recharg-ba1bd",
    storageBucket: "electric-vehicle-recharg-ba1bd.firebasestorage.app",
    messagingSenderId: "386828433766",
    appId: "1:386828433766:web:64088d545ed25e2dd0b0a7",
    measurementId: "G-PH0FFLWTCD"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
//</script>