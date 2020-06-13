// Get geoJSON data
var earthquakeURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
var plateBoundaryURL = "/leaflet-challenge/static/data/PB2002_plates.json"

// Extract earthquake data
d3.json(earthquakeURL, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
  
});


function createFeatures(earthquakeData) {

  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
  }

  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  var earthquakes = L.geoJSON(earthquakeData, {

  
      pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng);
      },
      style: styledata

  });
function styledata(feature){
  return{
  radius: feature.properties.mag * 2,
  fillColor: chooseColor(feature.properties.mag),
  fillOpacity: 1,
  opacity: 1,
  color: "#000000",
  stroke: true,
  weight: 0.5

  };

}

function chooseColor(magnitude) {
  var mag = magnitude;
  if (mag >= 6.0) {
  return "red";
  }
  else if (mag >= 5.0) {
  return "orange";
  }
  else if (mag >= 4.0) {
  return "yellow";
  }
  else if (mag >= 3.0) {
    return "green";
  }
  else if (mag >= 2.0) {
    return "blue";
      }
  else {
  return "purple";
  }
  }

  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
  //create faultlines
}

function createMap(earthquakes) {

  // Define streetmap and darkmap layers
  var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  });

  var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "dark-v10",
    accessToken: API_KEY
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap
  };
  var techtonicPlates = new L.layerGroup();

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes,
    TechtonicPlates: techtonicPlates
  };




  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [streetmap, earthquakes]
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

  d3.json(plateBoundaryURL, function (plateData){
    L.geoJSON(plateData, {
      color: "black",
      weight : 1,
    })
    .addTo(techtonicPlates);
    techtonicPlates.addTo(myMap);

    })
}
