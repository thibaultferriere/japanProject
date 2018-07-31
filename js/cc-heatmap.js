function heatmap(){
    // don't forget to include leaflet-heatmap.js
    // var testData = {
    //   max: 8,
    //   data: [
    //   {lat: 24.6408, lng:46.7728, count: 8},
    //   {lat: 50.75, lng:-1.55, count: 1},
    //   {lat: 33.597500, lng:130.222532, count: 4},
    //   {lat: 33.596748, lng:130.222532, count: 6},
    //   {lat: 33.595948, lng:130.222532, count: 8},
    // //  {lat: 33.596848, lng:130.223532, count: 7},
    //   ]
    // };
    var testData2 = {
      max: 8,
      data: [
      //{lat: 24.6408, lng:46.7728, count: 8},
      //{lat: 50.75, lng:-1.55, count: 1},
      //{lat: 33.597500, lng:130.222532, count: 4},
      //{lat: 33.596748, lng:130.222532, count: 8},
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

    // var cfg2 = JSON.parse(JSON.stringify(cfg));
    // cfg2["radius"] = 0.0003;
    console.log(cfg);
    console.log(cfg2);
    var heatmapLayer2 = new HeatmapOverlay(cfg2);
    // var heatmapLayer2 = new HeatmapOverlay(cfg);
    console.log(baseLayer);
    console.log(heatmapLayer);
    // console.log(heatmapLayer2);

    heatmapLayer.setData(testData);
    heatmapLayer2.setData(testData2);

    var map = new L.Map('map-canvas-heatmap', {
    //  center: new L.LatLng(25.6586, -80.3568),
      center: new L.LatLng(33.597324, 130.223160),
      zoom: 18,
    //  layers: [baseLayer, heatmapLayer, heatmapLayer2],
    //  layers: [baseLayer, heatmapLayer, heatmapLayer2]
      layers: [baseLayer, heatmapLayer]
    });
    var b = {"base":baseLayer};
    var o = {"heatmap":heatmapLayer, "heatmap2":heatmapLayer2};
    // L.control.layers(b, o).addTo(map);
    console.log(map);
    console.log(heatmapLayer);
    console.log(heatmapLayer2);
    // L.control.layers({"base":baseLayer, "h":heatmapLayer}, {"heatmap2":heatmapLayer2}).addTo(map);

    // var marker = L.marker([33.596748, 130.222532])
    // 	.bindPopup("Hello! Leaflet!<br>Aaaah!!!")
    // 	.addTo(map);// don't forget to include leaflet-heatmap.js
    for(var i=0; i<testDataList[0]['data'].length; i++) {
//        console.log(testDataList[0]['data'][i]);
        var marker = L.marker([testDataList[0]['data'][i]["lat"], testDataList[0]['data'][i]["lng"]])
            //.bindPopup("Hello! Leaflet!<br>Aaaah!!!")
            .bindPopup(testDataList[0]['data'][i]["spot_name"])
            .addTo(map);
    }

    // map.setView([33.5967, 130.2225], 17);
    //

    heatmapLayerList = [];
    for(var i=0; i<testDataList.length; i++) {
        var cfg2 = JSON.parse(JSON.stringify(cfg));
        var layer = new HeatmapOverlay(cfg2);
        layer.setData(testDataList[i]);
        heatmapLayerList.push(layer);
    }
    console.log(heatmapLayerList);
    heatmapLayer.removeFrom(map);
    heatmapLayerList[0].addTo(map);

    // var currentLayer = heatmapLayer;
    // setInterval(function(){
    //     if(currentLayer == heatmapLayer) {
    //         heatmapLayer.removeFrom(map);
    //         heatmapLayer2.addTo(map);
    //         currentLayer = heatmapLayer2;
    //     }
    //     else {
    //         heatmapLayer2.removeFrom(map);
    //         heatmapLayer.addTo(map);
    //         currentLayer = heatmapLayer;
    //     }
    // }, 1000);

    var iCurrentLayer = 0;
//    var iNextLayer = 1;
    iNextLayer_heatmap = 1;
    if(iNextLayer_heatmap == heatmapLayerList.length) {
        iNextLayer_heatmap = 0;
    }
    setInterval(function(){
//        console.log('toto');
        if(fPlay_heatmap) {
            heatmapLayerList[iCurrentLayer].removeFrom(map);
            iCurrentLayer = iNextLayer_heatmap;
//            console.log(iNextLayer_heatmap);
            iNextLayer_heatmap++;
            if(iNextLayer_heatmap == heatmapLayerList.length) {
                iNextLayer_heatmap = 0;
            }
            heatmapLayerList[iCurrentLayer].addTo(map);
            // console.log(typeof(heatmapLayerList[iCurrentLayer]));
            // console.log(heatmapLayerList[iCurrentLayer]._data);
            // console.log(map);
            // var m = moment(testDataList[iCurrentLayer].data[0]["calculated_at"], "YYYY-MM-DD HH:mm:ss");
            // console.log(m);
            // $("#current_date").text(m.format("YYYY-MM-DD HH:mm:ss"));
            // console.log(testDataList[iCurrentLayer]["calculated_at"]);
            $("#current_date_heatmap").text(testDataList[iCurrentLayer].data[0]["calculated_at"]);
            $("#pos_play_heatmap").val(iCurrentLayer/testDataList.length*100);
        }
    }, 500);

    // // minimal heatmap instance configuration
    // var heatmapInstance = h337.create({
    //   // only container is required, the rest will be defaults
    //   container: document.querySelector('.heatmap2')
    // });
    //
    // // now generate some random data
    // var points = [];
    // var max = 0;
    // var width = 840;
    // var height = 400;
    // var len = 200;
    //
    // while (len--) {
    //   var val = Math.floor(Math.random()*100);
    //   max = Math.max(max, val);
    //   var point = {
    //     x: Math.floor(Math.random()*width),
    //     y: Math.floor(Math.random()*height),
    //     value: val
    //   };
    //   // points.push(point);
    // }
    // points.push({x:420, y:200, value:10});
    // max = 10;
    // // heatmap data format
    // var data = { 
    //   max: max, 
    //   data: points 
    // };
    // // if you have a set of datapoints always use setData instead of addData
    // // for data initialization
    // heatmapInstance.setData(data);
}