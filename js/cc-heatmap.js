function heatmap(){
    // don't forget to include leaflet-heatmap.js
    var testData2 = {
      max: 8,
      data: [
      {lat: 33.597648, lng:130.223532, count: 4},
      {lat: 33.596848, lng:130.223532, count: 6},
      {lat: 33.596048, lng:130.223532, count: 8},
      ]
    };

    var baseLayer = L.tileLayer(
      'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
        attribution: '...',
        maxZoom: 18
      }
    );

    var cfg = {
      // radius should be small ONLY if scaleRadius is true (or small radius is intended)
      // if scaleRadius is false it will be the constant radius used in pixels
      "radius": 0.00025,
      "maxOpacity": .5, 
      // scales the radius based on map zoom
      "scaleRadius": true, 
      // if set to false the heatmap uses the global maximum for colorization
      // if activated: uses the data maximum within the current map boundaries 
      //   (there will always be a red spot with useLocalExtremas true)
    //  "useLocalExtrema": true,
      "useLocalExtrema": false,
      // which field name in your data represents the latitude - default "lat"
      latField: 'lat',
      // which field name in your data represents the longitude - default "lng"
      lngField: 'lng',
      // which field name in your data represents the data value - default "value"
      valueField: 'count'
    };

    var cfg2 = {
      // radius should be small ONLY if scaleRadius is true (or small radius is intended)
      // if scaleRadius is false it will be the constant radius used in pixels
      "radius": 0.0004,
      "maxOpacity": .5, 
      // scales the radius based on map zoom
      "scaleRadius": true, 
      // if set to false the heatmap uses the global maximum for colorization
      // if activated: uses the data maximum within the current map boundaries 
      //   (there will always be a red spot with useLocalExtremas true)
    //  "useLocalExtrema": true,
      "useLocalExtrema": false,
      // which field name in your data represents the latitude - default "lat"
      latField: 'lat',
      // which field name in your data represents the longitude - default "lng"
      lngField: 'lng',
      // which field name in your data represents the data value - default "value"
      valueField: 'count'
    };


    var heatmapLayer = new HeatmapOverlay(cfg);

//    console.log(cfg);
//    console.log(cfg2);
    var heatmapLayer2 = new HeatmapOverlay(cfg2);
//    console.log(baseLayer);
//    console.log(heatmapLayer);

    heatmapLayer.setData(testData);
    heatmapLayer2.setData(testData2);

    var map = new L.Map('map-canvas-heatmap', {
      center: new L.LatLng(33.597324, 130.223160),
      zoom: 18,
      layers: [baseLayer, heatmapLayer]
    });
    var b = {"base":baseLayer};
    var o = {"heatmap":heatmapLayer, "heatmap2":heatmapLayer2};
//    console.log(map);
//    console.log(heatmapLayer);
//    console.log(heatmapLayer2);
    for(var i=0; i<testDataList[0]['data'].length; i++) {
        var marker = L.marker([testDataList[0]['data'][i]["lat"], testDataList[0]['data'][i]["lng"]])
            //.bindPopup("Hello! Leaflet!<br>Aaaah!!!")
            .bindPopup(testDataList[0]['data'][i]["spot_name"])
            .addTo(map);
    }

    heatmapLayerList = [];
    for(var i=0; i<testDataList.length; i++) {
        var cfg2 = JSON.parse(JSON.stringify(cfg));
        var layer = new HeatmapOverlay(cfg2);
        layer.setData(testDataList[i]);
        heatmapLayerList.push(layer);
    }
//    console.log(heatmapLayerList);
    heatmapLayer.removeFrom(map);
    heatmapLayerList[0].addTo(map);

    var iCurrentLayer = 0;
    iNextLayer_heatmap = 1;
    if(iNextLayer_heatmap == heatmapLayerList.length) {
        iNextLayer_heatmap = 0;
    }
    setInterval(function(){
        if(fPlay_heatmap) {
            heatmapLayerList[iCurrentLayer].removeFrom(map);
            iCurrentLayer = iNextLayer_heatmap;
            iNextLayer_heatmap++;
            if(iNextLayer_heatmap == heatmapLayerList.length) {
                iNextLayer_heatmap = 0;
            }
            heatmapLayerList[iCurrentLayer].addTo(map);
            $("#current_date_heatmap").text(testDataList[iCurrentLayer].data[0]["calculated_at"]);
            $("#pos_play_heatmap").val(iCurrentLayer/testDataList.length*100);
        }
    }, 500);
}