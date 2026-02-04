function initMap() {
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 13,
    center: { lat: 12.9716, lng: 77.5946 }
  });

  db.collection("evBunks").where("status", "==", "Open")
    .onSnapshot(snapshot => {
      snapshot.forEach(doc => {
        const s = doc.data();

        const marker = new google.maps.Marker({
          position: { lat: s.lat, lng: s.lng },
          map,
          title: s.name
        });

        marker.addListener("click", () => {
          new google.maps.InfoWindow({
            content: `
              <strong>${s.name}</strong><br>
              Slots: ${s.availableSlots}/${s.totalSlots}<br>
              ₹${s.pricePerUnit}/unit
            `
          }).open(map, marker);
        });
      });
    });
}
