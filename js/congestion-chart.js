$.ajax({
    url: '../controller/congestion-chart.php',
    type: 'GET',
    dataType: 'json',
    success: function(result){
        var congestion = new Array();
        var calculated_at = new Array();
        for(i = 0; i < result.length; i++){
            calculated_at.push(result[i].calculated_at);    //add every JSON attribute "calculated_at" into a separate array
            congestion.push(result[i].congestion);  //add every JSON attribute "congestion" into a separate array
        }
        console.log(congestion);
        console.log(calculated_at);
        var ctx = document.getElementById("congestion-chart").getContext('2d');  //get the canvas where to draw the chart
        var data = {
            labels: calculated_at,
            datasets:[
                {
                    label: "congestion over the time",
                    data: congestion,
                    backgroundColor: "blue",
                    borderColor: "blue",
                    fill: false,
                    lineTension: 0,
                    radius: 0
                }
            ]
        };
        var options = {
            responsive: true,
            title: {
                display: true,
                position: "top",
                text: "Congestion chart for spot 1",
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
    },
    error: function(e){
        console.error(e.message);
    }
});