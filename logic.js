// Creating our initial map object:
// We set the longitude, latitude, and starting zoom level.
let myMap = L.map("map", {
    center: [36.12, -97.05],
    zoom: 13
  });
   
// Adding a tile layer (the background map image) to our map:
// We use the addTo() method to add objects to our map.
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// Store the endpoint in a variable
let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Perform a GET request to the query URL
d3.json(url).then(function (data) {
  // Console log the data retrieved 
  console.log(data);
  
  // Create an array to store circle markers
  let markers = [];

// Loop through the earthquake data and add markers to the map
for (let i = 0; i < data.features.length; i++) {
  let feature = data.features[i];
  let location = feature.geometry.coordinates;
  if (location) {
    let circle = L.circle([location[1], location[0]], {
      fillOpacity: 0.75,
      color: "white",
      fillColor: getColor(location[2]), // This should work based on depth
      radius: markerSize(feature.properties.mag)
    }).bindPopup(`<h1>${feature.properties.place}</h1> <hr> <h3>Magnitude: ${feature.properties.mag}</h3>`);
    markers.push(circle);
  }
}

  // Create a layer group from the markers and add it to the map
  let earthquakeLayer = L.layerGroup(markers);
  earthquakeLayer.addTo(myMap);
});


// Define a function to determine the marker size based on magnitude
function markerSize(magnitude) {
  return magnitude * 10000;
};

// Define a function to determine the marker color based on depth
function getColor(depth) {
  // Define color ranges and corresponding depths
  if (depth < 10) return "#00FF00";
  else if (depth < 30) return "greenyellow";
  else if (depth < 50) return "yellow";
  else if (depth < 70) return "orange";
  else if (depth <90) return "orangered";
  else return "#FF0000"
};

// Put the legend in the bottom right corner 
let info = L.control({
  position: "bottomright"
});

// Create the legend and return the title
info.onAdd = function (map) {
  let div = L.DomUtil.create("div", "legend");
  div.innerHTML += "<h3>Depth</h3>";
  return div;
};

// Define the color categories and labels
let legendColors = [
  "#00FF00",       // -10 to 10
  "greenyellow",   // 10 to 30
  "yellow",        // 30 to 50
  "orange",        // 50 to 70
  "orangered",     // 70 to 90
  "#FF0000"        // 90+
];

// Give the legend labels names
let legendLabels = ["-10 to 10", "10 to 30", "30 to 50", "50 to 70", "70 to 90", "90+"];

// Create a custom legend control
let legend = L.control({ position: "bottomright" });

// Add features to the legend
legend.onAdd = function (map) {
  let div = L.DomUtil.create("div", "info legend");
  div.style.backgroundColor = "white";
  div.style.border = "1px solid #ccc";
  div.innerHTML += "<h3>Depth</h3>";

  // Loop through categories and create legend items
  for (let i = 0; i < legendColors.length; i++) {
    div.innerHTML +=
      `<div style="display: flex; align-items: center;">
        <div style="width: 20px; height: 20px; background-color:${legendColors[i]}; margin-right: 5px;"></div>
        <span>${legendLabels[i]}</span>
      </div>`;
  }
  return div;
};

legend.addTo(myMap);






