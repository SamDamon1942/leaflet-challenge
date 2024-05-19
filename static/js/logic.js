// ************************************************************
// ** Module 15 Challenge - Part I (basic map using leaflet) **
// ************************************************************


// ***********************
// ** Retrieve the data **
// ***********************

// store the API endpoint as queryUrl.
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_day.geojson";

//perform a GET request to the query URL
d3.json(queryUrl).then(function (features) {
  // Once I get a response, send the features object to the createFeatures function.
  console.log(features);
    createFeatures(features);
});

//********************END OF DATA RETRIEVAL**************************************************

//********************BEGINING OF FEATURE CREATION*******************************************
// *******************************************************
// ** Define a function that we want to run once        **
// ** for each feature in the features array. Give each **
// ** feature a popup that describes the place and time **
// ** of the earthquake.                                **
// *******************************************************

function createFeatures(earthquakeData){
  
  // A function within a function: the following function creates a popup for each earthquake location

  function onEachFeatureFn(feature) {
    //create a marker for each earthquake feature
    const latitude = feature.geometry.coordinates[0];
    const longitude = feature.geometry.coordinates[1];
    console.log(latitude, longitude);


    var marker = L.circle([latitude, longitude], {
      radius: feature.properties.mag * 5, // Set marker size based on magnitude
      // fillColor: getColorForDepth(feature.geometry.depth), // Set marker color based on depth
      fillColor: "white",
      color: '#000', // Border color
      weight: 1, // Border width
      opacity: 1, // Border opacity
      fillOpacity: 0.8 // Fill opacity
    });
    
    //next, bind a popup with earthquake information
    marker.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p>`);
    }

  // Now, create a GeoJSON layer that contains the features array on the earthquakeData object.
  let earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeatureFn
  });

  // Lastly, send the earthquake layer to the createMap function
  createMap(earthquakes);
}

//********************END OF FEATURE CREATION************************************************

//********************BEGINING OF MAP CREATION***********************************************

function createMap(earthquakes) {

  // **************************************
  // ** create the base layers of my map **
  // **************************************

  let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  })

  // ** Note: for Part 1 of the challenge, I won't need the topo map.
  let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });


  // ******************************
  // ** create a baseMaps object **
  // ******************************

  let baseMaps = {
    "Street Map": street,
    "Topographic Map": topo   // **note: for Part 1 of the challenge, I won't need this **
  };

  // ***********************************************
  // Create an overlay object to hold my overlay. **
  // ***********************************************

  let overlayMaps = {
    Earthquakes: earthquakes
  };


  // *******************************************************
  // ** Create my map object, giving it the streetmap and **
  // ** earthquakes layers to display on load.            **
  // *******************************************************

  let myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [street, earthquakes]
  });

}

// *******************************************************
// ** Create a legend to show the depth in kilometers of**
// ** earthquakes with corresponding colors             **
// *******************************************************

// // Define the legend control
// let legend = L.control({ position: "bottomright"});

// // 1. define depth ranges in kilometers
// var depthRanges = [-10, 10, 30, 50, 70, 90]; // depth ranges in kilometers

// // 2. add content to the legend
// legend.onAdd = function (map) {
//     var div = L.DomUtil.create('div', 'legend');
//     div.innerHTML = '<h4>Earthquake Depth (km)</h4>';
    
//     // Loop through depth ranges, add color-coded indicators, and create a label for each
//     for (let i = 0; i < depthRanges.length; i++) {
//       div.innerHTML +=
//           '<i style="background:' + getColorForDepth(depthRanges[i]) + '"></i> ' +
//           depthRanges[i] + (depthRanges[i + 1] ? '&ndash;' + depthRanges[i + 1] + '<br>' : '+');
//   }
//         return div;
// };

// create a function to assign the legend color based on depth
function getColorForDepth(depth) {
// define the color scale based on depth values
  return depth >= 90 ? '#800026' :
         depth >= 70 ? '#BD0026' :
         depth >= 50 ? '#E31A1C' :
         depth >= 30 ? '#FC4E2A' :
         depth >= 10 ? '#FD8D3C' :
        '#FEB24C';
}

// // Add the legend to the map
// legend.addTo(map);

//********************END OF MAP CREATION***********************************************
