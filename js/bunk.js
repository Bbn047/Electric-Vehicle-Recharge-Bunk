import { getFirestore, collection, addDoc, getDocs }
from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

const db = getFirestore();

/* ADD EV BUNK */
window.addBunk = async function () {
  const name = document.getElementById("bunkName").value;
  const address = document.getElementById("address").value;
  const mobile = document.getElementById("mobile").value;
  const latitude = document.getElementById("latitude").value;
  const longitude = document.getElementById("longitude").value;

  if (!name || !address || !mobile || !latitude || !longitude) {
    alert("All fields are required");
    return;
  }

  try {
    await addDoc(collection(db, "evBunks"), {
      name,
      address,
      mobile,
      location: {
        lat: latitude,
        lng: longitude
      },
      createdAt: new Date()
    });

    console.log("EV Bunk Added:", name);
    alert("EV Bunk added successfully");
    loadBunks();
  } catch (error) {
    console.error("Error adding bunk:", error.message);
  }
};

/* LOAD EV BUNKS */
window.loadBunks = async function () {
  const bunkList = document.getElementById("bunkList");
  bunkList.innerHTML = "";

  const querySnapshot = await getDocs(collection(db, "evBunks"));
  querySnapshot.forEach((doc) => {
    const bunk = doc.data();
    const li = document.createElement("li");
    li.textContent = `${bunk.name} - ${bunk.address}`;
    bunkList.appendChild(li);
  });

  console.log("EV Bunks Loaded");
};

window.onload = loadBunks;
