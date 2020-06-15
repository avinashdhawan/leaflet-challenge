// Get geoJSON data
var earthquakeURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
var plateBoundaryURL = "/leaflet-challenge/static/data/PB2002_plates.json"

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
  
  var satmap  = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "satellite-v9",
    accessToken: API_KEY
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap,
    "Satellite Map": satmap
  };
 // Create our map, giving it the streetmap and earthquakes layers to display on load
 var myMap = L.map("map", {
  center: [
    40, 0
  ],
  zoom: 2,
  layers: [streetmap, darkmap, satmap]
});
// Extract earthquake data
d3.json(earthquakeURL, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
  
  
});


function createFeatures(earthquakeData) {

  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake  
  // Create a GeoJSON layer containing the features array on the earthquakeData object

  var earthquakes = L.geoJSON(earthquakeData, {

      pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng);
      },
      style: styledata,

   onEachFeature: function(feature, layer){
     layer.bindPopup("<h3>" + feature.properties.place +
     "</h3><hr><p>" + new Date(feature.properties.time) + "</p>")
   }


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
}

function createMap(earthquakes) {


  var tectonicPlates = new L.layerGroup();

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes,
    Tectonic_Plates: tectonicPlates
  };

   

 
  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

  d3.json(plateBoundaryURL, function (plateData){
    L.geoJSON(plateData, {
      color: "white",
      weight : 1,
    })
    .addTo(tectonicPlates);
    tectonicPlates.addTo(myMap);

    })
        // Set up the legend
  var legend = L.control({ position: "bottomright" });
  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");
    var limits = [0,2,3,4,5,6];
    var colors = ["purple", "blue", "green", "yellow", "orange", "red"];
    var labels = [];



    limits.forEach(function(limit, index) {
      labels.push("<i style=\"background-color: " + colors[index] + "\"></i>"+ limit + (limits[index+1]? "&ndash;" + limits[index + 1] +"<br>": "+"));
    });

    div.innerHTML += labels.join("");
    return div;
  };

  // Adding legend to the map
  legend.addTo(myMap);
};




 