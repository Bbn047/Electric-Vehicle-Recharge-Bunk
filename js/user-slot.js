function loadUserSlots(bunkId) {
  const list = document.getElementById("userSlotList");
  list.innerHTML = "";

  db.collection("slots")
    .where("bunkId", "==", bunkId)
    .where("status", "==", "available")
    .get()
    .then((snapshot) => {
      snapshot.forEach((doc) => {
        const slot = doc.data();
        const li = document.createElement("li");
        li.textContent = slot.slotTime;
        list.appendChild(li);
      });

      console.log("User slots loaded for bunk:", bunkId);
    });
}
