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

//admin logout 
document.addEventListener("DOMContentLoaded", () => {

  // Call function
  loadStations();
  //station counts
  listenTotalStations();
  //total user count
  totalUsers();
  //total income
  listenTotalIncome();
  //load recent bookings
  loadRecentBookings();

  //chart
  loadBookingStatistics();
  //active bookings
  listenActiveBookings();


  const logoutBtn = document.getElementById("logoutBtn");

  logoutBtn.addEventListener("click", (e) => {
    e.preventDefault();

    firebase.auth().signOut().then(() => {

      //signout
      window.location.href = "login.html"
    }).catch((error) => {
      console.error("Logout error: ", error);
      alert("failed to logout, Try again");
    });
  });
});


//add stations
const addStationBtn = document.getElementById("addStationBtn");

addStationBtn.addEventListener("click", () => {
  const modal = new bootstrap.Modal(
    document.getElementById("addStationModal")
  );
  modal.show();
});



//store station deatails
const addStationForm = document.getElementById("addStationForm");

addStationForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const latValue = document.getElementById("lat").value.trim();
  const lngValue = document.getElementById("lng").value.trim();

  if (!latValue || !lngValue) {
    alert("Latitude and Longitude are required");
    return;
  }

  const lat = parseFloat(latValue);
  const lng = parseFloat(lngValue);

  if (isNaN(lat) || isNaN(lng)) {
    alert("Latitude and Longitude must be valid numbers");
    return;
  }

  const stationData = {
    name: document.getElementById("stationName").value.trim(),
    location: document.getElementById("stationLocation").value.trim(),

    // 🔥 IMPORTANT: keep lat/lng INSIDE location (consistent everywhere)
    locationCoords: {
      lat,
      lng
    },

    totalSlots: parseInt(document.getElementById("totalSlots").value) || 0,
    availableSlots: parseInt(document.getElementById("availableSlots").value) || 0,
    status: document.getElementById("stationStatus").value,
    pricePerUnit: Number(document.getElementById("pricePerUnit").value) || 0,
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  };

  db.collection("evBunks").add(stationData)
    .then(() => {
      alert("Station added successfully ✅");
      addStationForm.reset();
      bootstrap.Modal.getInstance(
        document.getElementById("addStationModal")
      ).hide();
    })
    .catch((error) => {
      console.error("Error adding station:", error);
      alert(error.message);
    });
});



// Load stations into admin table
const stationTableBody = document.getElementById("stationTableBody");

function loadStations() {
  stationTableBody.innerHTML = ""; // clear old rows

  db.collection("evBunks")
    .orderBy("createdAt", "desc")
    .onSnapshot((snapshot) => {
      stationTableBody.innerHTML = "";

      snapshot.forEach((doc) => {
        const station = doc.data();

        const tr = document.createElement("tr");

        tr.innerHTML = `
          <td>${station.name}</td>
          <td>${station.location}</td>
          <td>
            <span class="badge ${station.status === "Open" ? "bg-success" : "bg-danger"}">
              ${station.status.charAt(0).toUpperCase() + station.status.slice(1)}
            </span>
          </td>
          <td>${station.availableSlots} / ${station.totalSlots}</td>
        `;

        stationTableBody.appendChild(tr);
      });
    }, (error) => {
      console.error("Error loading stations:", error);
    });
}


// ================= RECENT BOOKINGS (ADMIN) =================
const recentBookingsBody = document.getElementById("recentBookingsBody");

function loadRecentBookings() {
  db.collection("bookings")
    .orderBy("createdAt", "desc")
    .limit(8)
    .onSnapshot(async (snapshot) => {

      recentBookingsBody.innerHTML = "";

      for (const doc of snapshot.docs) {
        const booking = doc.data();

        // 🔹 get station location
        let location = "—";
        if (booking.stationId) {
          const stationSnap = await db.collection("evBunks")
            .doc(booking.stationId)
            .get();

          if (stationSnap.exists) {
            location = stationSnap.data().location;
          }
        }

        // 🔹 status mapping
        let statusText = "Pending";
        let badge = "bg-warning";

        if (booking.status === "started") {
          statusText = "Charging";
          badge = "bg-info";
        } else if (booking.status === "paid") {
          statusText = "Completed";
          badge = "bg-success";
        }

        // 🔹 amount
        const amountText =
          booking.status === "paid"
            ? `₹${booking.amount}`
            : `₹${booking.amount || 0} (Pending)`;

        const tr = document.createElement("tr");

        tr.innerHTML = `
        <td>${booking.userName}</td>
          <td>${booking.stationName}</td>

          <td>${location}</td>
          <td>
            <span class="badge ${badge}">
              ${statusText}
            </span>
          </td>
          <td>${amountText}</td>
        `;

        recentBookingsBody.appendChild(tr);
      }
    });
}


//--------------------------------


const addStationModalEl = document.getElementById("addStationModal");

addStationModalEl.addEventListener("hidden.bs.modal", () => {
  document.body.focus();
});

//get total stations number
function listenTotalStations() {
  db.collection("evBunks").onSnapshot((snapshot) => {
    document.getElementById("totalStations").innerText = snapshot.size;
  }, (error) => {
    console.error("Error counting stations:", error);
  });
}

//get registered user number
function totalUsers() {
  db.collection("users")
    .where("role", "==", "user")
    .onSnapshot((snapshot) => {
      document.getElementById("totalUsers").innerText = snapshot.size;
    }, (error) => {
      console.error("error counting :", error);
    });
}

//--================
function listenActiveBookings() {
  db.collection("bookings")
    .where("status", "in", ["pending", "started", "stopped"])
    .onSnapshot((snapshot) => {
      document.getElementById("activeBookings").innerText = snapshot.size;
    }, (error) => {
      console.error("Error counting active bookings:", error);
    });
}



// ================= TOTAL INCOME =================
function listenTotalIncome() {

  const incomeEl = document.getElementById("incomeValue");
  const filterEl = document.getElementById("incomeFilter");

  let cachedBookings = [];

  // 🔥 Listen ONCE to paid bookings
  db.collection("bookings")
    .where("status", "==", "paid")
    .onSnapshot(snapshot => {

      cachedBookings = [];

      snapshot.forEach(doc => {
        const data = doc.data();
        if (data.createdAt) {
          cachedBookings.push(data);
        }
      });

      // Initial render
      calculateIncome(filterEl.value, cachedBookings);
    });

  // Dropdown change
  filterEl.addEventListener("change", () => {
    calculateIncome(filterEl.value, cachedBookings);
  });

  function calculateIncome(filter, bookings) {
    const now = new Date();
    let total = 0;

    bookings.forEach(b => {
      const date = b.createdAt.toDate();
      const amount = b.amount || 0;

      if (filter === "day") {
        if (
          date.getDate() === now.getDate() &&
          date.getMonth() === now.getMonth() &&
          date.getFullYear() === now.getFullYear()
        ) {
          total += amount;
        }
      }

      if (filter === "month") {
        if (
          date.getMonth() === now.getMonth() &&
          date.getFullYear() === now.getFullYear()
        ) {
          total += amount;
        }
      }

      if (filter === "year") {
        if (date.getFullYear() === now.getFullYear()) {
          total += amount;
        }
      }
    });

    incomeEl.innerText = total;
  }
}


//------------------
// ================= BOOKING STATISTICS CHART =================
let bookingChart;

function loadBookingStatistics() {
  db.collection("bookings")
    .orderBy("createdAt")
    .onSnapshot(snapshot => {

      const bookingMap = {};
      const cancelMap = {};

      let totalBookings = 0;
      let totalCancellations = 0;

      snapshot.forEach(doc => {
        const b = doc.data();
        if (!b.createdAt) return;

        const dateKey = b.createdAt
          .toDate()
          .toISOString()
          .split("T")[0]; // YYYY-MM-DD

        // total bookings
        bookingMap[dateKey] = (bookingMap[dateKey] || 0) + 1;
        totalBookings++;
        if (b.status !== "cancelled") {
          totalBookings++;
        }
        // cancellations
        if (b.status === "cancelled") {
          cancelMap[dateKey] = (cancelMap[dateKey] || 0) + 1;
          totalCancellations++;
        }
      });

      const labels = Object.keys(bookingMap);
      const bookingData = labels.map(d => bookingMap[d] || 0);
      const cancelData = labels.map(d => cancelMap[d] || 0);

      document.getElementById("totalBookingCount").innerText = totalBookings;
      document.getElementById("cancelBookingCount").innerText = totalCancellations;

      renderBookingChart(labels, bookingData, cancelData);
    });
}


//--------------
function renderBookingChart(labels, bookings, cancellations) {
  const ctx = document.getElementById("bookingChart").getContext("2d");

  if (bookingChart) bookingChart.destroy();

  bookingChart = new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "Total Bookings",
          data: bookings,
          borderWidth: 2,
          tension: 0.4
        },
        {
          label: "Cancellations",
          data: cancellations,
          borderWidth: 2,
          tension: 0.4
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "top"
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1
          }
        }
      }
    }
  });
}
