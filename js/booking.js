const db = firebase.firestore();

// ================= BOOK =================
function bookStation(stationId, stationName) {
  const user = firebase.auth().currentUser;
  if (!user) return alert("Please login");

  const vehicleNumber = prompt("Enter vehicle number");
  if (!vehicleNumber) return;

  db.collection("bookings").add({
    userId: user.uid,
    stationId,
    stationName,
    vehicleNumber,
    status: "booked",
    chargingPercent: 0,
    totalAmount: 0,
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  }).then(() => {
    alert("Booking successful ✅");
  });
}

// ================= MY BOOKING =================
function listenUserBookings(uid) {
  db.collection("bookings")
    .where("userId", "==", uid)
    .where("status", "in", ["booked", "charging"])
    .onSnapshot(snapshot => {

      const box = document.querySelector(".booking-data");
      box.innerHTML = "";

      if (snapshot.empty) {
        box.innerHTML = "<p>No active booking</p>";
        return;
      }

      snapshot.forEach(doc => {
        const b = doc.data();

        box.innerHTML = `
          <p><strong>${b.stationName}</strong></p>
          <p>Vehicle: ${b.vehicleNumber}</p>
          <button class="btn btn-sm btn-success me-2" onclick="startCharging('${doc.id}')">Start</button>
          <button class="btn btn-sm btn-danger" onclick="cancelBooking('${doc.id}')">Cancel</button>
        `;
      });
    });
}

// ================= CHARGING =================
function startCharging(id) {
  db.collection("bookings").doc(id).update({ status: "charging" });
  simulateCharging(id);
}

function simulateCharging(id) {
  let percent = 0;
  const timer = setInterval(() => {
    percent += 10;

    db.collection("bookings").doc(id).update({
      chargingPercent: percent,
      totalAmount: percent * 10
    });

    if (percent >= 100) {
      clearInterval(timer);
      stopCharging(id);
    }
  }, 3000);
}

function stopCharging(id) {
  db.collection("bookings").doc(id).update({ status: "completed" });
}

function cancelBooking(id) {
  if (!confirm("Cancel booking?")) return;
  db.collection("bookings").doc(id).delete();
}

// ================= STATUS =================
function listenChargingStatus(uid) {
  db.collection("bookings")
    .where("userId", "==", uid)
    .where("status", "in", ["charging", "completed"])
    .onSnapshot(snapshot => {

      const box = document.querySelector(".charging-data");
      box.innerHTML = "";

      snapshot.forEach(doc => {
        const b = doc.data();

        box.innerHTML = `
          <p>Status: ${b.status}</p>
          <p>Charging: ${b.chargingPercent || 0}%</p>
          <p>Amount: ₹${b.totalAmount || 0}</p>
          ${b.status === "completed"
            ? `<button class="btn btn-success" onclick="payNow('${doc.id}')">Pay</button>`
            : ""}
        `;
      });
    });
}

// ================= PAYMENT =================
function payNow(id) {
  alert("Payment successful 💳");
  db.collection("bookings").doc(id).update({ status: "paid" });
}
