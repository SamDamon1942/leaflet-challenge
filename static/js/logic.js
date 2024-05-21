// ************************************************************
// ** Module 15 Challenge - Part I (basic map using leaflet) **
// ************************************************************


// ***********************
// ** Retrieve the data **
// ***********************

// store the API endpoint as queryUrl.
//let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson";
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

//perform a GET request to the query URL
d3.json(queryUrl).then(function (earthquakeData) {
  // Once I get a response, send the features object to the createFeatures function.
  console.log(earthquakeData);
    createFeatures(earthquakeData);
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
  
  // function onEachFeatureFn(feature, layer) {
  //   layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p>`);
  // }

  var earthquakes = L.geoJSON(earthquakeData, {
    pointToLayer: function(feature, latlng) {
      return L.circleMarker(latlng, {
        radius: feature.properties.mag * 10, // Set the marker radius based on earthquake magnitude
        fillColor: getColorForDepth(feature.geometry.coordinates[2]), // Set marker color based on earthquake magnitude
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
      });
    },
    onEachFeature: function(feature, layer) {
      layer.bindPopup("Magnitude: "+ feature.properties.mag + "<br>Depth: " + feature.geometry.coordinates[2] + "<br>Location: " + feature.properties.place);
    }
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
      0.00, 0.00
    ],
    zoom: 2.5,
    layers: [street, earthquakes]
  });

  // *******************************************************
  // ** Create a legend to show the depth in kilometers of**
  // ** earthquakes with corresponding colors             **
  // *******************************************************

  // // Define the legend control
  let legend = L.control({ position: 'bottomright'});
  
  legend.onAdd = function() {
    let div = L.DomUtil.create("div", "info legend");
    let depths = [-10, 10, 30, 50, 70, 90]; // Define the depth ranges
    let colors = [colorArray[0], colorArray[1], colorArray[2], colorArray[3], colorArray[4], colorArray[5]]; // Define colors for each depth range
    let labels = [];

    // Add the legend title
    div.innerHTML = "<h4>Earthquake Depth "+ "<br>(km)</h4>";

    // Loop through the depth ranges and create a label for each
    for (let i = 0; i < depths.length; i++) {
        div.innerHTML +=
            '<i style="background:' + colors[i] + '"></i> ' +
            depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + '<br>' : '+');
    }

    return div;
};

// Add the legend to the map
  legend.addTo(myMap);
}

//********************END OF MAP CREATION***********************************************

//*************************************************
//** create an array of colors - this obviates   **
//**  the need to identify colors more than once.**
//*************************************************

colorArray = ['#98ee00', '#d4ee00','#eecc00','#ee9c00','#ea822c', '#ea2c2c']

// create a function to assign the legend color based on depth
function getColorForDepth(depth) {
  // define the color scale based on depth values
    return depth >= 90 ? colorArray[5]:
          depth >= 70 ? colorArray[4] :
          depth >= 50 ? colorArray[3] :
          depth >= 30 ? colorArray[2] :
          depth >= 10 ? colorArray[1] :
          colorArray[0];
}