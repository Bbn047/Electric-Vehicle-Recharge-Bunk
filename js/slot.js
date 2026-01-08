/* ADD SLOT */
function addSlot() {
  const bunkId = document.getElementById("slotBunkId").value;
  const slotTime = document.getElementById("slotTime").value;

  if (!bunkId || !slotTime) {
    alert("All fields are required");
    return;
  }

  db.collection("slots").add({
    bunkId: bunkId,
    slotTime: slotTime,
    status: "available",
    createdAt: new Date()
  })
  .then(() => {
    console.log("Slot added:", slotTime);
    alert("Slot created successfully");
    loadSlots();
  })
  .catch((error) => {
    console.error("Error adding slot:", error);
  });
}

/* LOAD SLOTS (ADMIN VIEW) */
function loadSlots() {
  const slotList = document.getElementById("slotList");
  slotList.innerHTML = "";

  db.collection("slots").get()
    .then((snapshot) => {
      snapshot.forEach((doc) => {
        const slot = doc.data();
        const li = document.createElement("li");
        li.textContent = `Bunk: ${slot.bunkId} | ${slot.slotTime} | ${slot.status}`;
        slotList.appendChild(li);
      });

      console.log("Slots loaded (admin)");
    });
}

window.onload = loadSlots;
