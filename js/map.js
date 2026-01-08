let map;

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 20.5937, lng: 78.9629 },
    zoom: 5
  });

  console.log("Map initialized");
  loadBunks();
}

function loadBunks() {
  db.collection("evBunks").get()
    .then((snapshot) => {
      snapshot.forEach((doc) => {
        const bunk = doc.data();

        const marker = new google.maps.Marker({
          position: {
            lat: Number(bunk.location.lat),
            lng: Number(bunk.location.lng)
          },
          map: map,
          title: bunk.name
        });

        const infoWindow = new google.maps.InfoWindow({
          content: `
            <h4>${bunk.name}</h4>
            <p>${bunk.address}</p>
            <p>Mobile: ${bunk.mobile}</p>
          `
        });

        marker.addListener("click", () => {
          infoWindow.open(map, marker);
          console.log("Bunk clicked:", bunk.name);
        });
      });

      console.log("EV bunks loaded on map");
    })
    .catch((error) => {
      console.error("Error loading bunks:", error);
    });
}


marker.addListener("click", () => {
  infoWindow.open(map, marker);
  loadUserSlots(doc.id);
});
