
# EV-BUNK - Electric Vehicle Charging Dashboard

EV-BUNK is a full-stack web application that allows users to book and monitor EV charging stations and provides an admin dashboard to manage stations, users, and bookings.

---

## Features

### User Dashboard
- **Book Charging Stations**: Search nearby EV charging stations and book slots.
- **Charging Status**: Real-time monitoring of charging progress, percentage, and estimated cost.
- **Booking History**: View completed and paid bookings with station name, date, and amount.
- **Profile Management**: View and manage user information.
- **Notifications**: Receive updates about your bookings.

### Admin Dashboard
- **Station Management**: Add, edit, or remove EV charging stations.
- **User Management**: View registered users.
- **Booking Overview**: Monitor active bookings and completed transactions.
- **Statistics**: Charts for total bookings, cancellations, and revenue.
- **Real-Time Updates**: Data updates in real-time using Firebase.

---

## Technology Stack
- **Frontend**: HTML, CSS, JavaScript, Bootstrap, Boxicons
- **Backend / Database**: Firebase Authentication and Firestore
- **Mapping**: Google Maps API
- **Charting**: Chart.js for admin booking statistics

---

## Project Structure

EV-BUNK/
├─ index.html # User Dashboard
├─ admin.html # Admin Dashboard
├─ js/
│ ├─ user_dashboard.js # User dashboard logic
│ ├─ booking.js # Booking logic
│ ├─ map.js # Google Maps integration
│ ├─ admin.js # Admin dashboard logic
│ └─ firebase-config.js # Firebase configuration (not tracked in git)
├─ css/
│ ├─ user-style.css
│ └─ admin.css
├─ assets/ # Images, icons, logos
├─ node_modules/ # Dependencies (if using Node server)
└─ README.md

----
## Firebase Setup

Create a Firebase project at Firebase Console
.

Enable Authentication and Firestore.

Create a js/firebase-config.js file locally with your Firebase config

## firebase-config.js
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();


-------


## Usage

User

Sign up or log in.

Search for nearby EV stations.

Book a slot and monitor charging progress.

Pay when charging completes; view completed bookings in history.

Admin

Log in with admin credentials.

Add or manage stations.

View total users, active bookings, and revenue.

Monitor booking statistics and cancellations.

----------

## Future Improvements

Add payment gateway integration for online payments.

Implement email notifications for bookings.

Add user analytics and reporting features.

