function initMap() {
  const centerLocation = { lat: 12.9716, lng: 77.5946 }; // Example: Bangalore

  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 13,
    center: centerLocation,
  });

  // Example charging stations
  const stations = [
    { name: "EV Bunk – MG Road", position: { lat: 12.975, lng: 77.605 } },
    { name: "GreenCharge Hub", position: { lat: 12.965, lng: 77.585 } },
    { name: "Volt Station", position: { lat: 12.982, lng: 77.59 } },
  ];

  stations.forEach((station) => {
    const marker = new google.maps.Marker({
      position: station.position,
      map,
      title: station.name,
      icon: "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
    });

    const infoWindow = new google.maps.InfoWindow({
      content: `<strong>${station.name}</strong>`,
    });

    marker.addListener("click", () => {
      infoWindow.open(map, marker);
    });
  });
}
