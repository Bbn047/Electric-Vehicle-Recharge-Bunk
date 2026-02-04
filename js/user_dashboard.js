const nearStationsContainer = document.querySelector(".near-stations");
const bookingContainer = document.querySelector(".booking-data");

function loadStations() {
  // Listen to live updates
  db.collection("evBunks")
    .where("status", "==", "Open") // only show stations that are open
    .orderBy("createdAt", "desc")
    .onSnapshot(snapshot => {
      // Clear previous stations
      nearStationsContainer.innerHTML = `<h6 class="mb-3">Nearby Charging Stations</h6>`;

      if (snapshot.empty) {
        nearStationsContainer.innerHTML += `<p>No stations available</p>`;
        return;
      }

      snapshot.forEach(doc => {
        const station = doc.data();

        const div = document.createElement("div");
        div.className = "station-card mb-2 p-2 border rounded";

        div.innerHTML = `
          <strong>${station.name}</strong>
          <p>${station.location}</p>
          <p>Slots: ${station.availableSlots}/${station.totalSlots}</p>
          <button class="btn btn-sm btn-outline-success"
            ${station.availableSlots === 0 ? "disabled" : ""}>
            Book
          </button>
        `;

        div.querySelector("button").addEventListener("click", () => {
          // Clear previous booking form if any
          const existingForm = document.querySelector(".booking-form");
          if (existingForm) existingForm.remove();

          // Create booking form
          const formDiv = document.createElement("div");
          formDiv.className = "booking-form border p-3 mb-2 rounded bg-light";

          formDiv.innerHTML = `
    <h6>Book Station: ${station.name}</h6>
    <div class="mb-2">
      <input type="text" class="form-control" id="bookingName" placeholder="Your Name" required>
    </div>
    <div class="mb-2">
      <input type="text" class="form-control" id="vehicleNumber" placeholder="Vehicle Number" required>
    </div>
    <div class="mb-2">
      <input type="date" class="form-control" id="bookingDate" required>
    </div>
    <button class="btn btn-success w-100" id="submitBookingBtn">Submit Booking</button>
  `;

          div.appendChild(formDiv);

          // Handle booking submission
          const submitBtn = formDiv.querySelector("#submitBookingBtn");
          submitBtn.addEventListener("click", (e) => {
            e.preventDefault();

            const name = formDiv.querySelector("#bookingName").value.trim();
            const vehicle = formDiv.querySelector("#vehicleNumber").value.trim();
            const date = formDiv.querySelector("#bookingDate").value;

            if (!name || !vehicle || !date) {
              alert("Please fill all fields");
              return;
            }

            // Save booking to Firestore
            db.collection("bookings").add({
              stationId: doc.id,
              stationName: station.name,
              userId: auth.currentUser.uid,
              userName: name,
              vehicleNumber: vehicle,
              date,
              pricePerUnit: station.pricePerUnit || 10,
              status: "pending",
              chargePercent: 0,
              amount: 0,
              createdAt: firebase.firestore.FieldValue.serverTimestamp()
            })
              .then(() => {
                alert("Booking confirmed!");
                formDiv.remove(); // remove form after submission
                loadUserBookings(); // refresh booking section
              })
              .catch(err => {
                console.error("Error booking station:", err);
                alert("Failed to book station. Try again.");
              });
          });
        });


        nearStationsContainer.appendChild(div);
      });
    }, err => {
      console.error("Error loading stations:", err);
    });
}

//-------------------------

const chargingContainer = document.querySelector(".charging-data");

// Simulate charging process
function startCharging(bookingDocId, bookingData) {
  chargingContainer.innerHTML = "";

  let chargePercent = bookingData.chargePercent || 0;
  let totalAmount = bookingData.amount || 0;
  const pricePerUnit = bookingData.pricePerUnit || 10;
  const chargingSpeed = 1; // 1% per second

  const div = document.createElement("div");
  div.className = "charging-status-card border p-3 rounded mb-2";

  div.innerHTML = `
    <h6>Charging at ${bookingData.stationName}</h6>
    <div><strong>Charge:</strong> <span id="chargePercent">${chargePercent}%</span></div>
    <div><strong>Time Remaining:</strong> <span id="timeRemaining">--:--</span></div>
    <div><strong>Total Amount:</strong> ₹<span id="totalAmount">${totalAmount}</span></div>
    <button class="btn btn-success mt-2" id="payBtn" disabled>Pay</button>
  `;

  chargingContainer.appendChild(div);

  const chargePercentEl = div.querySelector("#chargePercent");
  const timeRemainingEl = div.querySelector("#timeRemaining");
  const totalAmountEl = div.querySelector("#totalAmount");
  const payBtn = div.querySelector("#payBtn");

  const chargingInterval = setInterval(() => {
    chargePercent += chargingSpeed;

    if (chargePercent >= 100) {
      chargePercent = 100;
      clearInterval(chargingInterval);
      payBtn.disabled = false;
    }

    totalAmount = Math.round((chargePercent / 100) * 20 * pricePerUnit);

    chargePercentEl.innerText = `${chargePercent}%`;
    totalAmountEl.innerText = totalAmount;

    const remaining = 100 - chargePercent;
    timeRemainingEl.innerText = `${Math.floor(remaining / 60)}:${remaining % 60}`;

    // 🔥 SAVE PROGRESS
    db.collection("bookings").doc(bookingDocId).update({
      chargePercent,
      amount: totalAmount
    });

  }, 1000);

  // PAY BUTTON
 payBtn.addEventListener("click", () => {
  db.collection("bookings").doc(bookingDocId).update({
    status: "paid"
  }).then(() => {
    alert(`Payment of ₹${totalAmount} successful`);

    chargingContainer.innerHTML = "";
    bookingContainer.innerHTML = ""; // 🔥 force clear
    loadUserBookings();
  });
});


  return chargingInterval;
}


// Attach booking controls to buttons
function attachBookingControls(div, doc) {
  let chargingInterval;
  const booking = doc.data();

  const startBtn = div.querySelector(".start-btn");
  const stopBtn = div.querySelector(".stop-btn");
  const cancelBtn = div.querySelector(".cancel-btn");

  // START
  startBtn.addEventListener("click", async () => {
  await db.collection("bookings").doc(doc.id).update({
    status: "started"
  });

  const freshDoc = await db.collection("bookings").doc(doc.id).get();
  const freshBooking = freshDoc.data();

  startBtn.disabled = true;
  stopBtn.disabled = false;
  cancelBtn.disabled = true;

  chargingInterval = startCharging(doc.id, freshBooking);
});


  // STOP
  stopBtn.addEventListener("click", () => {
    db.collection("bookings").doc(doc.id).update({
      status: "stopped"
    });

    stopBtn.disabled = true;
    startBtn.disabled = false;

    if (chargingInterval) clearInterval(chargingInterval);

    // Enable pay button when stopped
    document.querySelector("#payBtn")?.removeAttribute("disabled");
  });

  // CANCEL (ONLY BEFORE START)
  cancelBtn.addEventListener("click", () => {
    if (booking.status !== "pending") return;

    if (confirm("Cancel booking?")) {
      db.collection("bookings").doc(doc.id).delete().then(() => {
        chargingContainer.innerHTML = "";
        loadUserBookings(); // refresh UI
      });
    }
  });

}


//----------------------------------


function renderActiveBooking(doc) {
  const booking = doc.data();

  const div = document.createElement("div");
  div.className = "user-booking mb-2 p-2 border rounded";

  div.innerHTML = `
    <strong>${booking.stationName}</strong><br>
    Vehicle: ${booking.vehicleNumber}<br>
    Status: <span class="text-primary">${booking.status}</span>
    <div class="mt-2">
      <button class="btn btn-sm btn-success start-btn" ${booking.status !== "pending" ? "disabled" : ""}>Start</button>
      <button class="btn btn-sm btn-warning stop-btn" ${booking.status !== "started" ? "disabled" : ""}>Stop</button>
      <button class="btn btn-sm btn-danger cancel-btn" ${booking.status !== "pending" ? "disabled" : ""}>Cancel</button>
    </div>
  `;

  attachBookingControls(div, doc);
  bookingContainer.appendChild(div);
}


//-------------------

function renderBookingHistory(booking) {
  const div = document.createElement("div");
  div.className = "history-card mb-2 p-2 border rounded bg-light";

  div.innerHTML = `
    <strong>${booking.stationName}</strong><br>
    User: ${booking.userName}<br>
    Vehicle: ${booking.vehicleNumber}<br>
    Amount Paid: ₹${booking.amount}
  `;

  historyContainer.appendChild(div);
}

//-----------------

const historyContainer = document.querySelector(".history-data");

function loadUserBookings() {
  const user = auth.currentUser;
  if (!user) return;

  db.collection("bookings")
    .where("userId", "==", user.uid)
    .orderBy("createdAt", "desc")
    .onSnapshot(snapshot => {

      bookingContainer.innerHTML = "";   // ✅ clear EVERY snapshot
      historyContainer.innerHTML = "";   // ✅ clear EVERY snapshot

      let activeCount = 0;

      snapshot.forEach(doc => {
        const booking = doc.data();

        if (booking.status === "paid" || booking.status === "cancelled") {
          renderBookingHistory(booking);
        } else {
          activeCount++;
          renderActiveBooking(doc);
        }
      });

      if (activeCount === 0) {
        bookingContainer.innerHTML = "<p>No active bookings.</p>";
      }
    });
}




//--------------


auth.onAuthStateChanged((user) => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  // Load user info
  db.collection("users").doc(user.uid).get()
    .then(doc => {
      if (doc.exists) {
        document.getElementById("username").innerText = doc.data().firstName || "User";
      }

      // Load nearby stations
      loadStations();

      // Load user's bookings
      loadUserBookings();

    })
    .catch(err => console.error(err));
});

// Get the logout button
const logoutBtn = document.getElementById("logoutBtn");

logoutBtn.addEventListener("click", (e) => {
  e.preventDefault(); // prevent default anchor behavior

  auth.signOut()
    .then(() => {
      // Successfully signed out
      window.location.href = "login.html"; // redirect to login page
    })
    .catch((error) => {
      console.error("Logout error:", error);
      alert("Failed to logout. Please try again.");
    });
});

