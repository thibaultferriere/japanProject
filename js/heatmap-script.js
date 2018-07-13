testData = JSON.parse('${testData}');
testDataList = JSON.parse('${testDataList}');
console.log(testData);
console.log(testDataList);

var picker = new Pikaday({ field: document.getElementById('datepicker_heatmap') });

for(var i=0; i<24; i++) {
    //$$("#select_hour").append($$("<option>").val(i).text(i));
    var hour = ("00"+i).slice(-2);
    $$("#select_hour_heatmap").append($$("<option>").val(hour).text(hour));
}
for(var i=0; i<60; i+=10) {
    var minute = ("00"+i).slice(-2);
    $$("#select_minute_heatmap").append($$("<option>").val(minute).text(minute));
}

datepicker_inited = false;
var url = location.href;
console.log(url);
var url_split = url.split("?");
if(url_split.length > 1) {
    var params = url_split[1].split("&");
    for(i=0; i<params.length; i++) {
        var params_split = params[i].split("=");
        var key = '';
        var value = '0';
        if(params_split.length >= 1) {
            key = params_split[0];
            if(params_split.length > 1) {
                value = params_split[1];
            }
        }
        else {
            key = params[i];
        }
        if(key == "datetime") {
            var m = moment(value, "YYYYMMDDHHmm");
            $$("#datepicker_heatmap").val(m.format("YYYY-MM-DD"));
            $$("#select_hour_heatmap").val(m.format("HH"));
            $$("#select_minute_heatmap").val(m.format("mm"));
            datepicker_inited = true;
        }
    }
}

if(!datepicker_inited) {
    var m = moment();
    var hour = m.format("HH");
    var hour_filled = ("00"+hour).slice(-2);
    var minute = Math.floor(m.format("mm")/10)*10;
    var minute_filled = ("00"+minute).slice(-2);
    $$("#datepicker_heatmap").val(m.format("YYYY-MM-DD"));
    $$("#select_hour_heatmap").val(hour_filled);
    $$("#select_minute_heatmap").val(minute_filled);
}



function compose_datetime() {
    var m = moment($$("#datepicker_heatmap").val() + " " + $$("#select_hour_heatmap").val() + ":" + $$("#select_minute_heatmap").val());
    $$("#input_datetime_heatmap").val(m.format("YYYYMMDDHHmm"));
    console.log(m);
    return true;
}

var fPlay = true;
function play() {
    if(fPlay == true) {
        fPlay = false;
        $$("#play_button_heatmap").text("Play");
    }
    else {
        fPlay = true;
        $$("#play_button_heatmap").text("Pause");
    }
}

function jump() {
    if ($$("pos_play_heatmap").hasClass("range_30")) {
        var divisor = 30;
    } 
    else if ($$("pos_play_heatmap").hasClass("range_100")) {
        var divisor = 100;
    }
    else {
        return;
    }
    iNextLayer = testDataList.length * $$("#pos_play_heatmap").val() / divisor;
}