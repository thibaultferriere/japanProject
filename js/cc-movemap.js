var baseLayer = L.tileLayer(
  'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '...',
    maxZoom: 18
  }
);
//console.log(baseLayer);

var lrmap = new L.map('map-canvas-movemap').setView([33.597324, 130.223160], 18);
baseLayer.addTo(lrmap);
//console.log(lrmap);

// lat, lng
spotCoordList =[
    [33.596531, 130.222394],
    [33.597103, 130.223915],
    [33.596960, 130.223975],
    [33.596632, 130.222811],
    [33.596790, 130.222345],
    [33.596846, 130.222731],
    [33.597002, 130.223279],
    [33.597229, 130.223933],
    [33.597335, 130.224375],
    [33.597365, 130.223534],
    [33.597235, 130.223057],
    [33.597075, 130.222478],
    [33.597546, 130.222768],
    [33.597816, 130.223867],
    [33.598100, 130.223545],
    [33.597904, 130.223072],
    [33.597745, 130.221920],
    [33.597645, 130.221516],
    [33.597132, 130.224126],
    [33.597038, 130.224147]
];

// スポット毎にマーカーを置く
for (var i = 0; i < spotCoordList.length; i++) {
  if (i == 0 || i == 3) {
    var Marker = L.AwesomeMarkers.icon({
    icon: 'cutlery',
    markerColor: 'blue',
    prefix: 'fa',
    });
    L.marker(spotCoordList[i], {icon: Marker}).addTo(lrmap);
  }
  else if (i == 1) {
    var Marker = L.AwesomeMarkers.icon({
    icon: 'coffee',
    markerColor: 'blue',
    prefix: 'fa',
    });
    L.marker(spotCoordList[i], {icon: Marker}).addTo(lrmap);
  }
  else if (i == 2 || i == 18 || i == 19) {
    var Marker = L.AwesomeMarkers.icon({
    icon: 'pencil',
    markerColor: 'blue',
    prefix: 'fa',
    });
    L.marker(spotCoordList[i], {icon: Marker}).addTo(lrmap);
  }
  else if (i == 14 || i == 16 || i == 17) {
    var Marker = L.AwesomeMarkers.icon({
    icon: 'bus',
    markerColor: 'blue',
    prefix: 'fa',
    });
    L.marker(spotCoordList[i], {icon: Marker}).addTo(lrmap);
  }
  else if (i == 10 || i == 13) {
    var Marker = L.AwesomeMarkers.icon({
    icon: 'bicycle',
    markerColor: 'blue',
    prefix: 'fa',
    });
    L.marker(spotCoordList[i], {icon: Marker}).addTo(lrmap);
  }
  else {
    var Marker = L.AwesomeMarkers.icon({
    icon: 'circle',
    markerColor: 'blue',
    prefix: 'fa',
    });
    L.marker(spotCoordList[i], {icon: Marker}).addTo(lrmap);
  }
}

//making layerlist of movemap
movemapLayerList = [];
//for (var i = 0; i < movemapDataList.length; i++) {
var Layer = new L.migrationLayer({
    map: lrmap,
    data: movemapDataList[0]['data'],
    pulseRadius: 0.1,
    arcWidth: 0.5,
    arcLabel: false,
    }
);
movemapLayerList.push(Layer);
//}
//console.log(movemapLayerList);
movemapLayerList[0].addTo(lrmap);

var iCurrentLayer = 0;
iNextLayer = 1;
if (iNextLayer == movemapDataList.length) {
  iNextLayer = 0;
}

var id = setInterval(function () {
  if (fPlay_movemap) {
    movemapLayerList[iCurrentLayer].setData(movemapDataList[iNextLayer]['data']);
    $("#current_date_movemap").text(movemapDataList[iNextLayer]['time']);
    $("#pos_play_movemap").val(iNextLayer / movemapDataList.length * 30);

    iNextLayer++;
    if (iNextLayer == movemapDataList.length) {
        iNextLayer = 0;
    }
  }
}, 3000);
