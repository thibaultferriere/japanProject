$.ajax({
    url: '../controller/example-chart.php',
    type: 'GET',
    dataType: 'json',
    success: function(result){
//                    console.log(result[0].id); //get the id of the first JSON object in the array "result"
        var congestion = new Array();
        var spot_id = new Array();
        for(i = 0; i < result.length; i++){
//                        console.log("congestion : " + result[i].congestion); //display in console all the congestions
            spot_id.push(result[i].spot_id);    //add every JSON attribute "spot_id" into a separate array
            congestion.push(result[i].congestion);  //add every JSON attribute "congestion" into a separate array
        }
        console.log(congestion);
        console.log(spot_id);

        var ctx = document.getElementById("basic-chart").getContext('2d');  //get the canvas where to draw the chart
        var data = {
            labels: spot_id,
            datasets:[
                {
                    label: "congestion by spot",
                    data: congestion,
                    backgroundColor: "blue",
                    borderColor: "blue",
                    fill: false,
                    lineTension: 1,
                    radius: 0
                }
            ]
        };
        var options = {
            responsive: true,
            title: {
                display: true,
                position: "top",
                text: "Example chart",
                fontSize: 18,
                fontColor: "#111"
            },
            legend: {
                display: true,
                position: "bottom",
                labels: {
                    fontColor: "#333",
                    fontSize: 16,
                    boxWidth: 30
                }
            }
        };
        var testLineChart = new Chart(ctx, {
            type: 'line',
            data: data,
            options: options
        });
    }
});